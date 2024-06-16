/* @file ppm installer
 * @arg 0 {number} - Install process. 0=install, 1=develop, 2=update
 * @arg 1 {number} - If non-zero, do not install and check permissions
 */

import '@ppmdev/polyfills/objectKeys.ts';
import debug from '@ppmdev/modules/debug.ts';
import fso, {copyFile, copyFolder, createTextFile} from '@ppmdev/modules/filesystem.ts';
import {info, useLanguage, mandatory, uniqName, tmp} from '@ppmdev/modules/data.ts';
import {pathSelf, pathJoin} from '@ppmdev/modules/path.ts';
import {runPPb} from '@ppmdev/modules/run.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {expandSource, setSource, owSource, sourceComp, sourceComplistPath} from '@ppmdev/modules/source.ts';
import {colorlize} from '@ppmdev/modules/ansi.ts';
import {type PermissionItems, permission, useSelfLibDir} from '@ppmdev/modules/permission.ts';
import {coloredEcho} from '@ppmdev/modules/echo.ts';
// import {getDisplaySize} from '@ppmdev/modules/window.ts';
import {createBackup} from '@ppmdev/modules/ppcust.ts';
import {conf} from './mod/configuration.ts';
import {langPPmInstall} from './mod/language.ts';
import {parsePluginlist, parseInstall, parsedItem} from './mod/parser.ts';
import {installer as core, pluginInstall} from './mod/core.ts';
import {semver} from '@ppmdev/modules/util.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';

const ppbID = `B${info.ppmID}`;
const subDirectories = ['backup', 'config', 'userscript', 'list', 'complist', 'ppm\\setup', 'ppm\\unset'] as const;
const ppmName: string = info.ppmName;
const cacheDir: string = uniqName.cacheDir();
const {parentDir} = pathSelf();
const lang = langPPmInstall[useLanguage()];
const selfRoot = ((): string => {
  const rgx = /^(.+)\\(dist|dev)$/;
  return parentDir.replace(rgx, '$1');
})();
const globalPaths = (() => {
  const home = ppm.global('home');
  const root = ppm.global('ppm');

  return {
    home,
    root,
    arch: pathJoin(home, 'arch'),
    repo: pathJoin(home, 'repo'),
    cache: pathJoin(home, cacheDir),
    lib: pathJoin(root, 'dist', 'lib')
  };
})();
const ppmVersion: string = (() => {
  const version = ppm.getVersion(selfRoot);
  return version ?? String(info.ppmVersion);
})();

const main = (): void => {
  const jobend: Function = ppm.jobstart('.');
  const abort = (exitcode: number): void => {
    jobend();
    PPx.Quit(exitcode);
  };
  const [installMode, dryRun] = safeArgs(ppm.global('dev'), false);

  if (installMode !== '2') {
    const title = `${ppmName} ver${ppmVersion}`;
    runPPb({bootid: info.ppmID, desc: title, k: '*option terminal', fg: 'cyan', x: 0, y: 0, width: 700, height: 500});
  }

  {
    const [error, logs] = checkPermissions();

    // print permission status
    if (error) {
      core.globalPath.unset();
      ppm.deletecust('S_ppm#global');
      logs.push(`\\n${lang.abort}`);
      coloredEcho(ppbID, logs.join('\\n'));
      abort(-1);
    }

    // dryrun finish
    if (!!dryRun) {
      logs.push(`\\n${lang.success}`);
      coloredEcho(ppbID, logs.join('\\n'));
      abort(1);
    }

    debug.log('permission check finished');
  }

  const ppmGlobal = getGlobalVariables();

  {
    // create cache directories
    createDirectories(globalPaths, subDirectories);

    let [error, errorMsg] = createTextFile(`${globalPaths.cache}\\ppm\\unset\\linecust.cfg`, false);
    error && debug.log(errorMsg);

    [error, errorMsg] = createTextFile(sourceComplistPath, false);
    error && debug.log(errorMsg);
  }

  ppm.setcust(`S_ppm#global:version=${ppmVersion}`);

  // update finish
  if (installMode === '2') {
    abort(1);
  }

  // initialize sources
  ppm.deletecust('S_ppm#sources');

  //TODO: remove for v1.0.0
  //NOTE: "S_ppm#plguins" is deprecated. Use "S_ppm#sources" instead.
  ppm.deletecust('S_ppm#plugins');
  ppm.setcust(`S_ppm#plugins:${ppmName}=${globalPaths.root}`);

  const location = installMode === '1' ? 'local' : 'remote';
  setSource({name: ppmName, version: ppmVersion, location, path: globalPaths.root});

  debug.log(`[setplugin] ${JSON.stringify(expandSource(ppmName))}`);

  for (const key of Object.keys(ppmGlobal)) {
    ppm.setcust(`S_ppm#global:${key}=${ppmGlobal[key as keyof Global]}`);
  }

  debug.log(`${ppm.getcust('S_ppm#global')[1]}`);

  //TODO: remove for v1.0.0
  const isOverwrite = PPx.getValue('ppm_overwrite') === '1';
  isOverwrite && overwriteSettings(globalPaths);

  // output global variables to _global.cfg
  {
    const globalCfg = `${globalPaths.cache}\\ppm\\${uniqName.globalCfg}`;
    //TODO: S_ppm#plugins will remove v1.0.0
    const errorLevel = createBackup({
      path: globalCfg,
      mask: ['S_ppm#global', 'S_ppm#sources', 'S_ppm#plugins', 'A_color']
    });
    errorLevel && debug.exists(globalCfg);
  }

  // copy files
  {
    // buckup current setting
    const backupCfg = `${globalPaths.cache}\\backup\\`;
    let [error, errorMsg] = copyFile(`${tmp().dir}\\${uniqName.initialCfg}`, backupCfg, false);
    error && debug.log(errorMsg);

    const pluginList = `${selfRoot}\\sheet\\${uniqName.pluginList}`;
    [error, errorMsg] = copyFile(pluginList, `${globalPaths.cache}\\list\\`, false);
    error && debug.log(`[create pluginlist] ${errorMsg}`);

    [error, errorMsg] = conf.init(ppmName, selfRoot);
    error && debug.log(`[create plugin.cfg] ${errorMsg}`);

    installMode === '0' && copyFolder(selfRoot, `${globalPaths.repo}\\${ppmName}`, true);
  }

  const merged = conf.merge(ppmName, selfRoot, 'default');
  const linecust = conf.write(ppmName, merged);
  const [_, log] = conf.register(ppmName, merged.execute, linecust);

  // create a list of plugin completion candidates
  const [error, errorMsg] = sourceComp.fix([
    {
      name: ppmName,
      version: ppmVersion,
      location,
      path: globalPaths.root,
      setup: false
    }
  ]);
  error && log.push(errorMsg);

  // TODO: remove for v1.0.0
  isOverwrite && loadPlugins();

  // for v1.0.0 remove old files
  // updateFormalEdition();

  // choice process when installation is complete
  const compMsg = isOverwrite
    ? `${lang.beforeCompare} ${colorlize({message: '*ppmCompare', fg: 'yellow'})}`
    : `${lang.beforeEdit} ${colorlize({message: '*ppmEdit', fg: 'yellow'})}`;
  const completeMessage = [lang.complete, `${compMsg} ${lang.afterMsg}`];
  coloredEcho(ppbID, [...log, '', ...completeMessage].join('\\n'));
  const type = isOverwrite ? 'yNc' : 'Ync';
  const choice = ppm.choice(ppbID, lang.choice, '', type, 'edit(&Y)', 'compare with vimdiff(&N)', 'close(&C)');

  if (choice === 'yes') {
    ppm.execute('C', `%*getcust(S_ppm#user:editor) %sgu"ppmcache"\\config\\${info.ppmName}.cfg`);
  } else if (choice === 'no') {
    const base = '%%sgu"ppm"\\setting\\patch.cfg';
    const user = `%%sgu"ppmcache"\\config\\${info.ppmName}.cfg`;
    ppm.execute('C', `*ppb -c %*getcust(S_ppm#user:compare) ${user} ${base}`);
  }

  PPx.Execute(`*closeppx ${ppbID}`);
  jobend();
};

//TODO: v1.0.0 removes everything except disp_xxx
type Global = {
  'home': string;
  'cache': string;
  'ppm': string;
  'lib': string;
  'scripttype': string;
  'module': string;
  'disp_width': number;
  'disp_height': number;
};
const getGlobalVariables = (): Global => {
  // const [disp_width, disp_height] = getDisplaySize(`${parentDir}\\lib`);

  //TODO: @deprecated  will remove it v1.0.0
  const scripttype = ppm.getcust('_others:usejs9')[1] === '4' ? 'ecma' : 'jscript';
  //TODO: @deprecated  will remove it v1.0.0
  const lib = pathJoin(globalPaths.root, 'lib', scripttype);
  //TODO: @deprecated  will remove it v1.0.0
  const module = pathJoin(globalPaths.root, 'module', scripttype);

  return {
    home: globalPaths.home,
    ppm: globalPaths.root,
    //TODO: @deprecated  will remove it v1.0.0
    cache: globalPaths.cache,
    //TODO: @deprecated  will remove it v1.0.0
    scripttype,
    //TODO: @deprecated  will remove it v1.0.0
    lib,
    //TODO: @deprecated  will remove it v1.0.0
    module,
    disp_width: NaN,
    disp_height: NaN
  } as const;
};

/** Create directories used by ppm */
const createDirectories = (base: typeof globalPaths, subDirs: typeof subDirectories): void => {
  const dirs = [base.arch, base.repo];

  for (const dir of dirs) {
    PPx.Execute(`*makedir ${dir}`);
  }

  for (const subDir of subDirs) {
    PPx.Execute(`*makedir ${pathJoin(base.cache, subDir)}`);
  }

  debug.log(`[createDirectories]\narch: ${base.arch}\nrepo: ${base.repo}\ncontents: ${subDirs.join(',')}`);
};

// function to support new trials. will remove this function for v1.0.0
const overwriteSettings = (base: typeof globalPaths): void => {
  PPx.setValue('ppm_overwrite', '');
  PPx.Execute(`*script ${parentDir}\\pluginRegister.js,${ppmName},unset`);
  PPx.Execute(`*script ${parentDir}\\ppmRestoreRegister.js,reset`);
  owSource(ppmName, {enable: true});

  //NOTE: The directory "script" is changed to "userscript", so copy the previous settings to "userscript"
  //TODO: delete the script directory when updating to v1.0.0
  const src = `${base.cache}\\script`;
  const dest = `${base.cache}\\userscript`;

  if (fso.FolderExists(src)) {
    const [error, msg] = copyFolder(src, dest, true);

    error && debug.log(msg);
  }
};

/** Check if the ppm installation requirements are met. */
const checkPermissions = (): [boolean, string[]] => {
  const checkItems: PermissionItems = {
    ppxVersion: mandatory.ppxVersion,
    scriptVersion: mandatory.scriptModule(),
    scriptType: mandatory.scriptType,
    codeType: mandatory.codeType,
    libRegexp: PPx.Extract('%*regexp(?)'),
    useModules: mandatory.modules,
    useExecutables: mandatory.executables
  };
  const result: string[] = [];
  let disallow = false;

  type ItemNames = keyof Required<PermissionItems>;

  // do not use installed ppmlib. use the path of the ppmlib to be updated as the basis.
  useSelfLibDir(`${parentDir}\\lib`);

  for (const item of Object.keys(checkItems)) {
    const [error, msg] = permission[item as ItemNames](checkItems[item as ItemNames] as never);
    result.push(msg);
    disallow = disallow || error;
  }

  return [disallow, result];
};

/**
 * Load enable plugins.
 * TODO: remove for v1.0.0
 */
const loadPlugins = (): void => {
  if (fso.FolderExists(`${globalPaths.repo}\\tar80`)) {
    const send = `${globalPaths.repo}\\tar80\\*`;
    const dest = globalPaths.repo;
    PPx.Execute(`%Os *file !move,${send},${dest},-min -querycreatedirectory:off -error:abort`);
    PPx.Execute(`*delete ${globalPaths.repo}\\tar80`);
  }

  const pluginList = parsePluginlist();

  for (let i = 0, k = pluginList.length; i < k; i++) {
    let [error, errorMsg] = [true, ''];
    let plugin = pluginList[i];

    if (plugin.path && fso.FolderExists(plugin.path)) {
      [error, errorMsg] = parseInstall(plugin.name, `${plugin.path}\\install`, false);

      if (error) {
        coloredEcho(ppbID, pluginInstall.decorateLog(plugin.name, 'error', errorMsg));
        continue;
      }

      coloredEcho(ppbID, pluginInstall.decorateLog(plugin.name, 'load'));
      plugin.version = parsedItem.pluginVersion;

      setSource(pluginInstall.sourceDetails(plugin));
      pluginInstall.setCompItem(plugin.name);
    }
  }

  pluginInstall.writeComplist();
};

/** Items to be deleted when version 1.0.0 is released, etc. */
const updateFormalEdition = (): void => {
  if (semver(ppmVersion) < 10000) {
    return;
  }

  fso.DeleteFolder(`${globalPaths.cache}\\script`);
  //TODO: move the contents of listDir to compDir, then move listFiles to listDir
  //TODO: delete files global.cfg, noplugin.cfg, initial.cfg,
  // these have been renamed to _global.cfg, _noplugin.cfg, _initial.cfg
};

main();
