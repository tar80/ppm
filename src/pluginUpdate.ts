/* @file Update remote plugins
 * @arg 0 {string} - Specify plugin name for single update, or "all" for all plugins
 * @arg 1 {number} - If non-zero, check updates
 */

import '@ppmdev/polyfills/objectKeys.ts';
import type {Error_String} from '@ppmdev/modules/types.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {info, useLanguage, uniqName} from '@ppmdev/modules/data.ts';
import {writeLines} from '@ppmdev/modules/io.ts';
import {runPPb} from '@ppmdev/modules/run.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {type Source, sourceNames, expandSource, owSource} from '@ppmdev/modules/source.ts';
import {colorlize} from '@ppmdev/modules/ansi.ts';
import {coloredEcho} from '@ppmdev/modules/echo.ts';
import {langPluginUpdate} from './mod/language.ts';
import {pluginUpdate as core} from './mod/core.ts';

const GIT_LOG_OPTS = '--oneline --color=always';
const updateLog = `${ppm.global('ppmcache')}\\ppm\\${uniqName.updateLog}`;
const lang = langPluginUpdate[useLanguage()];

const main = (): void => {
  const jobend = ppm.jobstart('.');
  const ppbID = `B${info.ppmID}`;

  {
    const ppmVersion = ppm.global('version');
    const title = `${info.ppmName} ver${ppmVersion}`;
    runPPb({bootid: info.ppmID, desc: title, k: '*option terminal', fg: 'cyan', x: 0, y: 0, width: 700, height: 500});
  }

  const {target, dryRun} = adjustArgs();
  const pluginNames = target !== 'all' ? [target] : sourceNames();
  const errorHeader = colorlize({message: ' ERROR ', esc: true, fg: 'black', bg: 'red'});
  const checkHeader = colorlize({message: ' CHECK ', esc: true, fg: 'black', bg: 'cyan'});
  let hasUpdate: boolean;

  {
    coloredEcho(ppbID, `${checkHeader} ${info.ppmName}`);
    const [error, data] = updatePpm();
    hasUpdate = !error;

    if (error && data !== 'noUpdates') {
      coloredEcho(ppbID, `${errorHeader} ${data}`);
    }
  }

  let source: Source;

  for (const name of pluginNames) {
    if (name === info.ppmName) {
      continue;
    }

    source = expandSource(name) as Source;

    if (source.location === 'local') {
      continue;
    }

    coloredEcho(ppbID, `${checkHeader} ${name}`);
    const [error, data] = core.checkUpdate(source.path);

    if (error) {
      data !== 'noUpdates' && coloredEcho(ppbID, `${errorHeader} ${lang[data as 'failedToGet' | 'detached']}`);
      continue;
    }

    // NOTE: The value of hasUpdate is used to determine whether to overwrite or append to the update log.
    //  Therefore, hasUpdate must be under writeTitle() for initialization.
    writeTitle(source.name, hasUpdate);
    hasUpdate = true;

    if (dryRun === '0') {
      const logSize = fso.GetFile(updateLog).Size;
      PPx.Execute(`git -C ${source.path} pull`);
      PPx.Execute(`%Obds git -C ${source.path} log ${GIT_LOG_OPTS} head...${data}>> ${updateLog}`);
      owSource(source.name, {version: ppm.getVersion(source.path) ?? '0.0.0'});

      if (logSize == fso.GetFile(updateLog).Size) {
        hasUpdate = false;
      }
    }
  }

  hasUpdate && ppm.execute(ppbID, `*ppv -utf8 -esc:on ${updateLog}`);
  ppm.execute(ppbID, `%%OW echo ${lang.noUpdates}%%:*closeppx %%n`);

  jobend();
};

const adjustArgs = (args = PPx.Arguments): {target: string; dryRun: string} => {
  const arr: string[] = ['all', '0'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  return {target: arr[0], dryRun: arr[1]};
};

/** Write plugin name to the update log */
const writeTitle = (name: string, update: boolean): void => {
  // In order to add the output of git log, unify the newline code to LF
  const linefeed = '\n';
  const opts = update ? {append: true} : {overwrite: true};
  const title = colorlize({message: name, fg: 'black', bg: 'green'});
  writeLines({path: updateLog, data: [title, ''], linefeed, ...opts});
};

/** Update ppm, and start PPb. */
const updatePpm = (): Error_String => {
  const ppmDir = ppm.global('ppm');

  let [error, data] = core.checkUpdate(ppmDir);

  if (!error) {
    writeTitle(info.ppmName, false);
    PPx.Execute(`@git -C ${ppmDir} pull`);
    PPx.Execute(`%Obds git -C ${ppmDir} log ${GIT_LOG_OPTS} head...${data}>> ${updateLog}`);
    const version = ppm.getVersion(ppmDir) ?? info.ppmVersion;
    owSource(info.ppmName, {version});
    ppm.setcust(`S_ppm#global:version=${version}`);
    PPx.Execute(`*script %sgu"ppm"\\dist\\ppmInstall.js,2`);
  }

  return [error, data];
};

main();
