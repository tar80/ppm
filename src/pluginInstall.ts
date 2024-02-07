/* @file Plugin installer */

import '@ppmdev/polyfills/arrayIndexOf.ts';
import '@ppmdev/polyfills/objectKeys.ts';
import {Level_String} from '@ppmdev/modules/types.ts';
import debug from '@ppmdev/modules/debug.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {isEmptyStr, isError} from '@ppmdev/modules/guard.ts';
import {cursorMove} from '@ppmdev/modules/ansi.ts';
import {echoExe, coloredEcho} from '@ppmdev/modules/echo.ts';
import {copyFile} from '@ppmdev/modules/filesystem.ts';
import {type Source, setSource, owSource, expandSource} from '@ppmdev/modules/source.ts';
import {info, uniqName, uri, tmp} from '@ppmdev/modules/data.ts';
import {createBackup} from '@ppmdev/modules/ppcust.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {runPPb} from '@ppmdev/modules/run.ts';
import {readLines, stdout} from '@ppmdev/modules/io.ts';
import {properties} from '@ppmdev/parsers/table.ts';
import {langPluginInstall} from './mod/language.ts';
import {parsePluginlist, parseInstall, parsedItem, clearItem} from './mod/parser.ts';
import {conf} from './mod/configuration.ts';
import {type LogLevel, pluginInstall as core} from './mod/core.ts';

// restart on pptray
if (PPx.Extract('%n%N') !== '') {
  PPx.Execute(`*pptray -c *script ${PPx.ScriptName},${PPx.Arguments.Item(-1)}`);
  PPx.Quit(1);
}

const GIT_CLONE_OPTS = '--depth=1 --recurse-submodules --shallow-submodules';
const ppbID = `B${info.ppmID}`;
const lang = langPluginInstall[ppm.lang()];
const ppmrepo = ppm.global('ppmrepo');
const ppmcache = ppm.global('ppmcache');
const oldSources = properties('S_ppm#sources');

const main = (): void => {
  //Note. this function is applied temporarily to fix bugs up to version 0.93.9.
  (() => {
    const version = ppm.getVersion(ppm.global('ppm')) ?? ppm.global('version');
    ppm.setcust(`S_ppm#global:version=${version}`);
    owSource(info.ppmName, {version});
  })();
  const title = `ppx-plugin-manager ver${ppm.global('version')}`;
  runPPb({bootid: info.ppmID, desc: title, fg: 'cyan', x: 0, y: 0, width: 700, height: 800});

  let hasUpdate = false;
  const pluginList = parsePluginlist();

  // initialize sources
  ppm.deletecust('S_ppm#sources');
  enableSource(info.ppmName);

  for (let i = 0, k = pluginList.length; i < k; i++) {
    let [error, errorMsg] = [true, ''];
    let dep: string | undefined;
    let plugin = pluginList[i];

    if (plugin.path && fso.FolderExists(plugin.path)) {
      /* installed plugins */
      if (oldSources[plugin.name] != null) {
        hasUpdate = true;
        enableSource(plugin.name, plugin.path);
        [error, errorMsg, dep] = parseInstall(plugin.name, `${plugin.path}\\install`, true);
        coloredEcho(ppbID, core.decorateLog(plugin.name, notify(!!errorMsg), dep));

        if (error) {
          !!errorMsg && coloredEcho(ppbID, errorMsg);
          continue;
        }

        copyToCache(plugin);
        clearItem();

        // debug.log(`already installed: ${plugin.name}`);
        continue;
      }

      [error, errorMsg] = parseInstall(plugin.name, `${plugin.path}\\install`, true);

      if (error) {
        coloredEcho(ppbID, core.decorateLog(plugin.name, 'error', plugin.name));
        coloredEcho(ppbID, errorMsg);
        continue;
      }

      hasUpdate = true;
      plugin.version = parsedItem.pluginVersion;
      coloredEcho(ppbID, core.decorateLog(plugin.name, 'install', dep));

      errorMsg = core.gitSwitch(plugin);
      !isEmptyStr(errorMsg) && coloredEcho(ppbID, errorMsg);
    } else if (plugin.location === 'local') {
      /* local plugin that does not exist */
      coloredEcho(ppbID, core.decorateLog(plugin.name, 'error', `${lang.couldNotGet} ${plugin.path}`));
    } else {
      /* plugins to download */
      if (!fso.FolderExists(`${ppmrepo}\\${plugin.name}`)) {
        [error, errorMsg, dep] = checkPermissions(plugin, false);

        if (error) {
          coloredEcho(ppbID, core.decorateLog(plugin.name, 'error', plugin.name));
          coloredEcho(ppbID, errorMsg);
          continue;
        }

        plugin.version = parsedItem.pluginVersion;
        const [exitcode] = clonePlugin(plugin);

        if (exitcode !== 0) {
          coloredEcho(ppbID, core.decorateLog(plugin.name, 'error', plugin.name));
          coloredEcho(ppbID, lang.failedClone);
          continue;
        }
      }

      hasUpdate = true;
      coloredEcho(ppbID, core.decorateLog(plugin.name, 'install', dep));
    }

    setSource(core.sourceDetails(plugin));
    copyToCache(plugin);
    core.setCompItem(plugin.name);

    //TODO: remove for v1.0.0
    //NOTE: "S_ppm#plguins" is deprecated. Use "S_ppm#sources" instead.
    ppm.setcust(`S_ppm#plugins:${plugin.name}=${plugin.path}`);

    conf.init(plugin.name, plugin.path);
    clearItem();

    debug.log(`conf.init: ${plugin.name}`);
  }

  if (hasUpdate) {
    // registration of disabled plugins
    for (const name of Object.keys(oldSources)) {
      ppm.setcust(`S_ppm#sources:${name}=${oldSources[name].value}`);
      owSource(name, {enable: false});
      core.setCompItem(name);
    }

    // create a list of plugin completion candidates
    core.writeComplist();

    // output global variables to _global.cfg
    {
      const globalCfg = `%sgu'ppmcache'\\ppm\\${uniqName.globalCfg}`;
      //TODO: S_ppm#plugins will remove v1.0.0
      const errorLevel = createBackup({
        path: globalCfg,
        mask: ['S_ppm#global', 'S_ppm#sources', 'S_ppm#plugins', 'A_color']
      });
      errorLevel && debug.exists(globalCfg);
    }
  }

  ppm.execute(ppbID, `%%OWsq ${echoExe} -ne "" %%&*closeppx ${ppbID}`);
};

const notify = (hasMsg: boolean): LogLevel => (hasMsg ? 'warn' : 'load');

const getPaths = (() => {
  const tempFile = tmp().file;
  const opts = `-utf8 -dir:on -subdir:off -listfile:"${tempFile}" -name`;

  return (source: string) => {
    ppm.execute('C', `%(*whereis -path:"${source}" -listfile:"${tempFile}" ${opts}%)`, true);
    return readLines({path: tempFile});
  };
})();

const copyDirectory = (source: string, dirname: string): void => {
  const [error, data] = getPaths(source);

  if (isError(error, data)) {
    debug.log(data);
    return;
  }

  for (const entry of data.lines) {
    const src = entry;
    const dest = `${ppmcache}\\${dirname}\\${fso.GetFileName(entry)}`;
    const [error, errorMessage] = copyFile(src, dest);

    if (error && ~errorMessage.indexOf('is not exist')) {
      PPx.Execute(`*makedir "${ppmcache}\\${dirname}\\${fso.GetFileName(dest)}"`);
      debug.log(`create directory: ${dest}`);
      continue;
    }

    error && debug.log(errorMessage);
  }
};

/** Cache files used by plugins. */
const copyToCache = (item: Source): void => {
  if (parsedItem.copyFlag) {
    const src = `${item.path}\\sheet`;
    const dest = `list`;
    copyDirectory(src, dest);
  }

  if (parsedItem.copyScript) {
    const src = `${item.path}\\userscript`;
    const dest = `userscript`;
    copyDirectory(src, dest);
  }

  if (parsedItem.copySpec.length > 0) {
    for (const dirname of parsedItem.copySpec) {
      const src = `${item.path}\\${dirname}`;
      copyDirectory(src, dirname);
    }
  }
};

const enableSource = (name: string, path?: string): void => {
  ppm.setcust(`S_ppm#sources:${name}=${oldSources[name].value}`);
  const version = expandSource(name)?.version;
  const obj = path ? {enable: true, version, path} : {enable: true, version};
  owSource(name, obj);
  core.setCompItem(name);
  delete oldSources[name];
};

/** Adjust cursor postion on console. */
const cursorBack = (n: number = 1): void => {
  ppm.execute(ppbID, `${echoExe} -ne "${cursorMove('u', n)}"`);
};

const permissionText = tmp().stdout;
const checkPermissions = (plugin: Source, local: boolean): [boolean, string, string?] => {
  const url = `${uri.rawGithub}/${plugin.autor}/${plugin.name}/master/install`;
  PPx.Execute(`*httpget "${url}","${permissionText}"`);
  const data = permissionText;
  // cursorBack(3);

  return parseInstall(plugin.name, data, local);
};

const clonePlugin = (plugin: Source): Level_String => {
  const url = `${uri.github}/${plugin.autor}/${plugin.name}`;
  const branch = !!plugin.branch ? ` --branch=${plugin.branch}` : '';
  cursorBack(1);

  return stdout({cmd: `%Osq git clone ${GIT_CLONE_OPTS}${branch} ${url} ${plugin.path}`});
};

main();

/* for test */
// ppm.deletecust('S_ppm#sources', 'ppm-adjacentdir');
// ppm.deletecust('S_ppm#sources', 'ppm-switchmenu');
// PPx.Execute(`*delete ${repoDir}\\ppm-adjacentdir`);
// PPx.Execute(`*delete ${repoDir}\\ppm-switchmenu`);
