/* @file Plugin installer */

import '@ppmdev/polyfills/arrayIndexOf.ts';
import '@ppmdev/polyfills/objectKeys.ts';
import {Error_String, Level_String} from '@ppmdev/modules/types.ts';
import debug from '@ppmdev/modules/debug.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {isEmptyStr, isError} from '@ppmdev/modules/guard.ts';
import {cursorMove} from '@ppmdev/modules/ansi.ts';
import {echoExe, coloredEcho} from '@ppmdev/modules/echo.ts';
import {copyFile, copyFolder} from '@ppmdev/modules/filesystem.ts';
import {type Source, setSource, owSource} from '@ppmdev/modules/source.ts';
import {info, uri, tmp} from '@ppmdev/modules/data.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {runPPb} from '@ppmdev/modules/run.ts';
import {readLines, stdout} from '@ppmdev/modules/io.ts';
import {properties} from '@ppmdev/parsers/table.ts';
import {langPluginInstall} from './mod/language.ts';
import {parsePluginlist, parseInstall, parsedItem} from './mod/parser.ts';
import {conf} from './mod/configuration.ts';
import {pluginInstall as core} from './mod/core.ts';

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
  const title = `ppx-plugin-manager ver${info.ppmVersion}`;
  runPPb({bootid: info.ppmID, desc: title, fg: 'cyan', x: 0, y: 0, width: 700, height: 800});

  let hasUpdate = false;
  const pluginList = parsePluginlist();

  // initialize sources
  ppm.deletecust('S_ppm#sources');
  enableSource(info.ppmName);

  for (let i = 0, k = pluginList.length; i < k; i++) {
    let [error, errorMsg] = [true, ''];
    let plugin = pluginList[i];

    if (plugin.path && fso.FolderExists(plugin.path)) {
      debug.log(plugin.name);
      /* installed plugins */
      if (oldSources[plugin.name] != null) {
        hasUpdate = true;
        enableSource(plugin.name, plugin.path);
        coloredEcho(ppbID, core.decorateLog(plugin.name, 'load'));

        debug.log(`exists: ${plugin.name} = ${ppm.getcust(`S_ppm#sources:${plugin.name}`)[1]}`);
        continue;
      }

      [error, errorMsg] = parseInstall(plugin.name, `${plugin.path}\\install`);

      if (error) {
        coloredEcho(ppbID, core.decorateLog(plugin.name, 'error', errorMsg));
        continue;
      }

      hasUpdate = true;
      plugin.version = parsedItem.pluginVersion;
      coloredEcho(ppbID, core.decorateLog(plugin.name, 'install'));

      errorMsg = core.gitSwitch(plugin);
      !isEmptyStr(errorMsg) && coloredEcho(ppbID, core.decorateLog(plugin.name, 'warn', errorMsg));
    } else if (plugin.location === 'local') {
      /* local plugin that does not exist */
      coloredEcho(ppbID, core.decorateLog(plugin.name, 'error', `${lang.couldNotGet} ${plugin.path}`));
    } else {
      /* plugins to download */
      if (!fso.FolderExists(`${ppmrepo}\\${plugin.name}`)) {
        [error, errorMsg] = checkPermissions(plugin);

        if (error) {
          coloredEcho(ppbID, core.decorateLog(plugin.name, 'error', errorMsg));
          continue;
        }

        plugin.version = parsedItem.pluginVersion;
        const [exitcode] = clonePlugin(plugin);

        if (exitcode !== 0) {
          coloredEcho(ppbID, core.decorateLog(plugin.name, 'error', lang.failedClone));
          continue;
        }
      }

      hasUpdate = true;
      coloredEcho(ppbID, core.decorateLog(plugin.name, 'install'));
    }

    setSource(core.sourceDetails(plugin));
    copyToCache(plugin);
    core.setCompItem(plugin.name);

    //TODO: remove for v1.0.0
    //NOTE: "S_ppm#plguins" is deprecated. Use "S_ppm#sources" instead.
    ppm.setcust(`S_ppm#plugins:${plugin.name}=${plugin.path}`);

    conf.init(plugin.name, plugin.path);

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
  }

  ppm.execute(ppbID, `%%OWsq ${echoExe} -ne "" %%&*closeppx ${ppbID}`);
};

/** Cache files used by plugins. */
const copyToCache = (item: Source): void => {
  let [error, errorMessage] = [false, ''];

  if (parsedItem.copyFlag) {
    const send = `${item.path}\\sheet`;
    const dest = `${ppmcache}\\list`;
    [error, errorMessage] = copyFolder(send, dest);

    error && debug.log(errorMessage);
  }

  if (parsedItem.copyScript) {
    const send = `${item.path}\\userscript`;
    const dest = `${ppmcache}\\userscript`;
    [error, errorMessage] = copyFolder(send, dest);

    error && debug.log(errorMessage);
  }

  if (parsedItem.copySpec.length > 0) {
    const tempFile = tmp().file;
    const opts = `-mask:"a:d-" -utf8 -dir:on -subdir:off -listfile:${tempFile} -name`;

    for (const dirname of parsedItem.copySpec) {
      ppm.execute('C', `*whereis -path:"${item.path}\\${dirname}" ${opts}`);
      let [error, data] = readLines({path: tempFile});

      if (isError(error, data)) {
        debug.log(data);
        continue;
      }

      if (data.lines.length === 0) {
        PPx.Execute(`*makedir "${ppmcache}\\${dirname}"`);
        continue;
      }

      for (const entry of data.lines) {
        const send = `${item.path}\\${dirname}\\${entry}`;
        const dest = `${ppmcache}\\${dirname}\\${entry}`;
        [error, errorMessage] = copyFile(send, dest);

        error && debug.log(errorMessage);
      }
    }

    // for (const dirname of parsedItem.copySpec) {
    //   const opts = [
    //     `-src:"${item.path}\\${dirname}\\*"`,
    //     `-dest:"${ppmcache}\\${dirname}"`,
    //     '-min',
    //     '-error:ignore',
    //     '-same:skip',
    //     '-sameall:on',
    //     '-querycreatedirectory:off',
    //     '-undolog:off',
    //     '-nocount'
    //   ];
    //   const exitcode = PPx.Execute(`*file !copy ${opts.join(' ')}`);
    //   error = exitcode !== 0;
    //   error && debug.log(`Could not create ${dirname}`);
    // }
  }
};

const enableSource = (name: string, path?: string): void => {
  ppm.setcust(`S_ppm#sources:${name}=${oldSources[name].value}`);
  const obj = path ? {enable: true, path} : {enable: true};
  owSource(name, obj);
  core.setCompItem(name);
  delete oldSources[name];
};

/** Adjust cursor postion on console. */
const cursorBack = (n: number = 1): void => {
  ppm.execute(ppbID, `${echoExe} -ne "${cursorMove('u', n)}"`);
};

const permissionText = tmp().stdout;
const checkPermissions = (plugin: Source): Error_String => {
  const url = `${uri.rawGithub}/${plugin.autor}/${plugin.name}/master/install`;
  PPx.Execute(`*httpget "${url}","${permissionText}"`);
  // cursorBack(3);

  return parseInstall(plugin.name, permissionText);
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
