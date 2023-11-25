/* @file Update remote plugins
 * @arg 0 {string} - Specify plugin name for single update, or "all" for all plugins
 * @arg 1 {number} - If non-zero, check updates
 */

import '@ppmdev/polyfills/objectKeys.ts';
import {info, useLanguage, uniqName} from '@ppmdev/modules/data.ts';
import {writeLines} from '@ppmdev/modules/io.ts';
import {runPPb} from '@ppmdev/modules/run.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {type Source, sourceNames, expandSource} from '@ppmdev/modules/source.ts';
import {colorlize} from '@ppmdev/modules/ansi.ts';
import {coloredEcho} from '@ppmdev/modules/echo.ts';
import {langPluginUpdate} from './mod/language.ts';
import {pluginUpdate as core} from './mod/core.ts';

const GIT_LOG_OPTS = '--oneline --color=always';
const updateLog = `${ppm.global('ppmcache')}\\ppm\\${uniqName.updateLog}`;
const lang = langPluginUpdate[useLanguage()];

const main = (): void => {
  const jobend = ppm.jobstart('.');
  const {target, dryRun} = adjustArgs();
  const ppbID = `B${info.ppmID}`;
  const pluginNames = target !== 'all' ? [target] : sourceNames();
  const errorHeader = colorlize({message: ' ERROR ', esc: true, fg: 'black', bg: 'red'});
  const checkHeader = colorlize({message: ' CHECK ', esc: true, fg: 'black', bg: 'cyan'});
  let source: Source;
  let hasUpdate = updatePpm();

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
      data !== 'noUpdates' && coloredEcho(ppbID, `${errorHeader} ${lang[data as 'failedToGet'|'detached']}`);
      continue;
    }

    // NOTE: The value of hasUpdate is used to determine whether to overwrite or append to the update log.
    //  Therefore, hasUpdate must be under writeTitle() for initialization.
    writeTitle(source.name, hasUpdate);
    hasUpdate = true;

    if (dryRun === '0') {
      PPx.Execute(`%Obds git -C ${source.path} pull`);
      PPx.Execute(`%Obds git -C ${source.path} log ${GIT_LOG_OPTS} head...${data} >> ${updateLog}`);
    }
  }

  const postCmd = hasUpdate ? `*ppv -utf8 -esc:on ${updateLog}` : `%%OW echo ${lang.noUpdates}%%:*closeppx %%n`;
  ppm.execute(ppbID, postCmd);

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
const updatePpm = (): boolean => {
  const ppmDir = ppm.global('ppm');
  const isDev = ppm.global('dev') === '1';
  let [error, data] = core.checkUpdate(ppmDir);
  let update: boolean;

  if (isDev || error) {
    update = false;
    data = colorlize({message: data, esc: true, fg: 'yellow'});
    const title = `${info.ppmName} ver${info.ppmVersion}\\n[${info.ppmName}] ${data}`;
    runPPb({bootid: info.ppmID, desc: title, fg: 'cyan', x: 0, y: 0, width: 700, height: 500});
  } else {
    update = true;
    writeTitle(info.ppmName, false);
    PPx.Execute(`%Obds git -C ${ppmDir} log ${GIT_LOG_OPTS} head...${data} > ${updateLog}`);
    PPx.Execute(`%Obds git -C ${ppmDir} pull`);

    /* ppb is launced within the ppmInstall.js */
    PPx.Execute(`*script %sgu"ppm"\\dist\\ppmInstall.js,2`);
  }

  return update;
};

main();
