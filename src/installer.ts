/* @file ppx-plugin-manager installer
 * @arg 0 {number} - Install process. 0=normal install, 1=install for private development
 * @arg 1 {number} - If non-zero, do not install and check permissions
 */

import type {Level_String} from '@ppmdev/modules/types.ts';
import debug from '@ppmdev/modules/debug.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {info, useLanguage, uniqName, tmp} from '@ppmdev/modules/data.ts';
import {pathSelf, pathNormalize} from '@ppmdev/modules/path.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {createBackup} from '@ppmdev/modules/ppcust.ts';
import {langInstaller} from './mod/language.ts';
import {installer as core} from './mod/core.ts';

const {scriptName, parentDir} = pathSelf();
const lang = langInstaller[useLanguage()];

const main = () => {
  const {installMode, dryRun} = adjustArgs();
  const isDev = Number(installMode) + Number(ppm.global('dev')) !== 0;
  const runInstall = `*script ${parentDir}\\ppmInstall.js,${installMode},${dryRun}`;

  // dryrun
  if (dryRun !== '0') {
    ppm.execute('C', runInstall);
    PPx.Quit(1);
  }

  {
    const startMsg = isDev ? lang.devmode : lang.start;
    !ppm.question(scriptName, startMsg) && abort(-1);
  }

  const cachedDataDir = ppm.global('home');
  let overwriteCachedData = false;

  // override ppm settings
  if (!isEmptyStr(cachedDataDir)) {
    !ppm.question(scriptName, lang.overwrite) && abort(-1);
    PPx.setValue('ppm_overwrite', '1');
    overwriteCachedData = true;
  }

  let [exitcode, resp] = gitDirSpec();
  (exitcode !== 0 || isEmptyStr(resp)) && abort(-1);

  const gitDir = resp;

  [exitcode, resp] = ppm.getinput({message: core.homeSpec(cachedDataDir), title: lang.homespec, mode: 'd'});
  (exitcode !== 0 || isEmptyStr(resp)) && abort(-1);

  const ppmhome = pathNormalize(resp, '\\');

  {
    const initCfg = `${tmp().dir}\\${uniqName.initialCfg}`;
    createBackup({path: initCfg});

    debug.exists(initCfg);
  }

  {
    const ppmroot = isDev ? rootDir() : `${ppmhome}\\${uniqName.repoDir}\\${info.ppmName}`;
    ppm.deletecust('S_ppm#global');
    ppm.setcust(`S_ppm#global:git=${gitDir}`);
    ppm.setcust(`S_ppm#global:home=${ppmhome}`);
    ppm.setcust(`S_ppm#global:ppm=${ppmroot}`);
    isDev && ppm.setcust('S_ppm#global:dev=1');
    core.globalPath.set(ppmhome, ppmroot);

    debug.log(ppm.getcust('S_ppm#global')[1]);
  }

  if (overwriteCachedData && ppmhome !== cachedDataDir) {
    const exitcode = PPx.Execute(
      `*file !move,${cachedDataDir}\\,${ppmhome},-min -querycreatedirectory:off -error:abort`
    );

    if (exitcode !== 0) {
      ppm.echo(scriptName, lang.failedToMove, exitcode);
      PPx.Quit(-1);
    }
  }

  ppm.execute('C', runInstall);
};

const abort = (exitcode: number): void => {
  ppm.linemessage('.', lang.abort, true);
  PPx.Quit(exitcode);
};

const adjustArgs = (args = PPx.Arguments): {installMode: string; dryRun: string} => {
  const arr: string[] = ['0', '0'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  return {installMode: arr[0], dryRun: arr[1]};
};

/** Get the path of the ppm root directory. */
const rootDir = (): string => {
  const rgx = RegExp(`^(.*\\\\${info.ppmName})\\\\.*`);
  return parentDir.replace(rgx, '$1');
};

/**
 * Specify the path of the directory where git is installed.
 * @return A path or an empty-string
 */
const gitDirSpec = (): Level_String => {
  let exitcode = 0;
  let path = core.extractGitDir();

  if (isEmptyStr(path)) {
    [exitcode, path] = ppm.getinput({message: '', title: lang.gitspec, mode: 'd'});
  }

  return [exitcode, path];
};

main();
