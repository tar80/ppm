/* @file Update remote plugins
 * @arg 0 {string} - Specify plugin name for single update, or "all" for all plugins
 * @arg 1 {number} - If non-zero, check updates
 */

import '@ppmdev/polyfills/objectKeys.ts';
import type {Error_String} from '@ppmdev/modules/types.ts';
// import fso from '@ppmdev/modules/filesystem.ts';
import {info, useLanguage, uniqName} from '@ppmdev/modules/data.ts';
import {writeLines} from '@ppmdev/modules/io.ts';
import {runPPb} from '@ppmdev/modules/run.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {type Source, sourceNames, expandSource, owSource} from '@ppmdev/modules/source.ts';
import {colorlize} from '@ppmdev/modules/ansi.ts';
import {coloredEcho} from '@ppmdev/modules/echo.ts';
import {isZero} from '@ppmdev/modules/guard.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';
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

  const [target, dryRun] = safeArgs('all', false);
  const pluginNames = target !== 'all' ? [target] : sourceNames();
  const errorHeader = colorlize({message: '  ERROR  ', esc: true, fg: 'black', bg: 'red'});
  const checkHeader = colorlize({message: '  CHECK  ', esc: true, fg: 'black', bg: 'cyan'});
  const updateHeader = colorlize({message: ' UPDATED ', esc: true, fg: 'black', bg: 'green'});
  let hasUpdate = false;

  if (!dryRun) {
    coloredEcho(ppbID, `${checkHeader} ${info.ppmName}`);
    const [error, data] = updatePpm();
    hasUpdate = !error;

    if (error && data !== 'noUpdates') {
      coloredEcho(ppbID, `${errorHeader} ${data}`, true);
      PPx.Quit(-1);
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
    } else if (data === 'noUpdates') {
      continue;
    }

    if (!dryRun) {
      const errorlevel = ppm.execute('.', `@git -C ${source.path} pull`, true);

      if (!isZero(errorlevel)) {
        coloredEcho(ppbID, `${errorHeader} ${lang.failedPull}`);
        continue;
      }

      // NOTE: The value of hasUpdate is used to determine whether to overwrite or append to the update log.
      //  Therefore, hasUpdate must be under writeTitle() for initialization.
      writeTitle(source.name, hasUpdate);
      hasUpdate = true;

      PPx.Execute(`%Obds git -C ${source.path} log ${GIT_LOG_OPTS} head...${data}>> ${updateLog}`);
      owSource(source.name, {version: ppm.getVersion(source.path) ?? '0.0.0'});
    } else {
      coloredEcho(ppbID, `${updateHeader} ${data}`);
    }
  }

  hasUpdate
    ? ppm.execute(ppbID, `*script %sgu'ppm'\\dist\\ppmLogViewer.js,update%%:*closeppx %%n`)
    : ppm.execute(ppbID, `%%OW echo "" %%:*closeppx %%n`);

  jobend();
};

/** Write plugin name to the update log */
const writeTitle = (name: string, update: boolean): void => {
  // In order to add the output of git log, unify the newline code to LF
  const linefeed = info.nlcode;
  const opts = update ? {append: true} : {overwrite: true};
  const title = colorlize({message: name, fg: 'black', bg: 'green'});
  writeLines({path: updateLog, data: [title], linefeed, ...opts});
};

/** Update ppm, and start PPb. */
const updatePpm = (): Error_String => {
  const ppmDir = ppm.global('ppm');
  let [error, data] = core.checkUpdate(ppmDir);

  if (!error && data !== 'noUpdates') {
    const errorlevel = ppm.execute('.', `@git -C ${ppmDir} pull`, true);

    if (!isZero(errorlevel)) {
      return [true, lang.failedPull];
    }

    writeTitle(info.ppmName, false);
    PPx.Execute(`%Obds git -C ${ppmDir} log ${GIT_LOG_OPTS} head...${data}>> ${updateLog}`);
    const version = ppm.getVersion(ppmDir) ?? info.ppmVersion;
    owSource(info.ppmName, {version});
    ppm.setcust(`S_ppm#global:version=${version}`);
    PPx.Execute(`*script %sgu"ppm"\\dist\\ppmInstall.js,2`);
  }

  return [error, data];
};

main();
