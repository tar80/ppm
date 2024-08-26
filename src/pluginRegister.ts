/* @file ppm plugin register
 * @arg 0 {string} - Registration target. "plugin name"|"all"
 * @arg 1 {string} - Registration mode. "set"|"unset"|"reset"|"restore"
 * @arg 2 {string} - Source of patch. "default"|"user"
 * @arg 3 {number} - If non-zero, do not install and display result
 */

import '@ppmdev/polyfills/arrayIsArray.ts';
import '@ppmdev/polyfills/arrayIndexOf.ts';
import {colorlize} from '@ppmdev/modules/ansi.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';
import {info, tmp, uniqID, uniqName, useLanguage} from '@ppmdev/modules/data.ts';
import debug from '@ppmdev/modules/debug.ts';
import {coloredEcho} from '@ppmdev/modules/echo.ts';
import {copyFile} from '@ppmdev/modules/filesystem.ts';
import {isEmptyStr, isError} from '@ppmdev/modules/guard.ts';
import {writeLines} from '@ppmdev/modules/io.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {createBackup} from '@ppmdev/modules/ppcust.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {runPPb} from '@ppmdev/modules/run.ts';
import {type Source, expandSource, owSource, setSource, sourceNames} from '@ppmdev/modules/source.ts';
import type {Error_String} from '@ppmdev/modules/types.ts';
import {conf} from './mod/configuration.ts';
import {pluginRegister as core, installer} from './mod/core.ts';
import {langPluginRegister} from './mod/language.ts';
import {type PatchSource, parseLinecust} from './mod/parser.ts';

type RegMode = 'set' | 'unset' | 'reset' | 'restore';

const lang = langPluginRegister[useLanguage()];
const ppmcache = ppm.global('ppmcache');
const ppbID = `B${info.ppmID}`;

const main = () => {
  const jobend: () => number = ppm.jobstart('.');
  const args = safeArgs('all', 'reset', 'default', false);
  const target = args[0].replace(/^[\!~]/, '');
  const mode = /^(set|restore|unset)$/.test(args[1]) ? (args[1] as RegMode) : 'reset';
  const patchCfg = args[2] === 'default' ? 'default' : 'user';
  const dryRun = args[3];
  const reset = mode === 'reset' || mode === 'restore';
  const multipleSetup = target === 'all';

  debug.log(`target: ${target}, mode: ${mode}, patch: ${patchCfg}, dryrun: ${dryRun}`);

  const sources = getSources(target, multipleSetup);

  if (!sources) {
    /* error */
    const {scriptName} = pathSelf();
    ppm.echo(scriptName, `${target} ${lang.notRegistered}`);
  } else if (!dryRun) {
    /* registration */
    if (reset) {
      const title = `${info.ppmName} ver${ppm.global('version')}`;
      runPPb({
        bootid: info.ppmID,
        desc: title,
        fg: 'cyan',
        x: 0,
        y: 0,
        width: 700,
        height: 500,
        k: `*mapkey use,${uniqID.tempKey}`
      });

      if (mode === 'reset') {
        const path = `${tmp().ppmDir()}\\_user.cfg`;
        createBackup({path, sort: false, mask: ['_User']});

        // initialize PPx
        ppm.execute(ppbID, `*ppcust CINIT%%&*setcust @${path}`);
        ppm.execute(ppbID, `*ppcust CA ${ppmcache}\\ppm\\${uniqName.globalCfg}%%&`);
      }
    }

    initialState(reset, sources);

    const date = PPx.Extract('%*now(date)');

    if (reset || multipleSetup) {
      const nopluginCfg = `${ppmcache}\\ppm\\${uniqName.nopluginCfg}`;
      createBackup({path: nopluginCfg});
      copyFile(nopluginCfg, `${ppmcache}\\backup\\${date}_${uniqName.nopluginCfg}`, true);
    }

    mode !== 'unset' && loadPlugins(reset, patchCfg, sources);

    if (reset || multipleSetup) {
      createBackup({path: `${ppmcache}\\backup\\${date}.cfg`});
    }

    const [_, data] = core.updateLists(sources);

    debug.log(`[write lists]\nerror: ${data}`);

    // output global variables to _global.cfg
    {
      const globalCfg = `%sgu'ppmcache'\\ppm\\${uniqName.globalCfg}`;
      //TODO: S_ppm#plugins will remove v1.0.0
      createBackup({
        path: globalCfg,
        mask: ['S_ppm#global', 'S_ppm#sources', 'S_ppm#plugins', 'A_color']
      });
    }

    if (reset) {
      ppm.setkey('ESC', `*deletecust "${uniqID.tempKey}"%%:*ppc%%:*wait 200%%:*closeppx %%n`);
      ppm.linemessage(ppbID, `${lang.completed}`);
    }
  } else {
    /* dry run */
    const TAB_WIDTH = '24';
    const resultLog = doDryrun(sources, patchCfg);
    PPx.Execute(`*ppv -esc:on -tab:${TAB_WIDTH} ${resultLog}`);
  }

  jobend();
};

/** Get installation infomation for plugins */
const getSources = (name: string, multi: boolean): Source[] | undefined => {
  const sources: Source[] = [];

  if (multi) {
    const items = sourceNames();

    for (const item of items) {
      sources.push(expandSource(item) as Source);
    }
  } else {
    const pluginDetail = expandSource(name);
    pluginDetail && sources.push(pluginDetail);
  }

  return sources;
};

/** Load user settings into PPx, and display the results */
const loadManageFiles = (): void => {
  const files = core.getManageFiles(ppmcache);
  const custMode = files.length === 1 ? 'CS' : 'CA';
  const rgx = /^.+\\/;

  for (const file of files) {
    if (!isEmptyStr(file)) {
      coloredEcho(ppbID, colorlize({message: file.replace(rgx, ''), esc: true}));
      ppm.execute(ppbID, `%%Oa *ppcust ${custMode} ${file}%%&`);
    }
  }
};

/** Remove plugin settings from PPx. */
const unsetPlugin = (source: Source): Error_String => {
  const unsetCfg = `${ppmcache}\\ppm\\unset\\${source.name}.cfg`;
  let [error, linecusts] = parseLinecust(source.name);

  if (!isError(error, linecusts)) {
    linecusts = '';

    for (let i = 0, k = linecusts.length; i < k; i++) {
      PPx.Execute(linecusts[i]);
    }
  }

  ppm.setcust(`@${unsetCfg}`);

  return [error, linecusts];
};

/** Set PPx to the state before plugin installation. */
const initialState = (reset: boolean, sources: Source[]): void => {
  if (reset) {
    ppm.close('C*');
    /* load user settings into initialized ppx */
    loadManageFiles();
    installer.globalPath.set(ppm.global('home'), ppm.global('ppm'));
  } else {
    /* unregister plugins */
    for (let i = 0, k = sources.length; i < k; i++) {
      const source = sources[i];

      let [error, data] = unsetPlugin(source);
      [error, data] = !owSource(source.name, {enable: false}) ? [true, lang.failedOverride] : [false, ''];

      if (error) {
        debug.log(data);
      } else {
        sources[i].enable = false;
      }
    }

    PPx.Execute('%K"LOADCUST"');
  }
};

/** Load plugin setting into PPx */
const setPlugin = (source: Source, patch: PatchSource, onPPb: boolean): [boolean, string[]] => {
  const merged = conf.merge(source.name, source.path, patch);
  const linecusts = conf.write(source.name, merged);
  return conf.register(source.name, merged.execute, linecusts, onPPb, onPPb);
};

/** Load plugins into PPx, and display the results */
const loadPlugins = (reset: boolean, patch: PatchSource, sources: Source[]): void => {
  const registered = [];
  const failed: string[] = ['Failed:'];

  for (let i = 0, k = sources.length; i < k; i++) {
    const source = sources[i];

    if (~registered.indexOf(source.name)) {
      continue;
    }

    if (reset && !source.enable) {
      continue;
    }

    registered.push(source.name);
    sources[i] = {...source, ...{enable: true, setup: true}};
    let [error, data]: [boolean, string | string[]] = [setSource(sources[i]) !== 0, lang.failedOverride];
    //TODO: S_ppm#plugins will remove v1.0.0
    ppm.setcust(`S_ppm#plugins:${source.name}=${source.path}`);

    if (error) {
      reset ? coloredEcho(ppbID, colorlize({message: data, esc: true, fg: 'red'})) : failed.push(data);
    }

    [error, data] = setPlugin(source, patch, reset);

    if (error) {
      reset ? coloredEcho(ppbID, data.join('\\n')) : failed.push(...data);
    } else if (reset) {
      coloredEcho(ppbID, `%(${data.join('\\n')}%)`);
    }

    debug.log(`registered ${JSON.stringify(expandSource(source.name))}`);
  }

  // error report on PPc
  if (reset) {
    PPx.Execute('%K"LOADCUST"');
  } else if (failed.length > 1) {
    ppm.report(`${failed.join(info.nlcode)}`);
  }
};

/** Output plugin settings all at once. */
const doDryrun = (sources: Source[], patchCfg: PatchSource): typeof path => {
  const path = tmp().file;
  const title = colorlize({message: 'Reference of plugin settings', fg: 'cyan'});
  const linecust = colorlize({message: ' linecust ', fg: 'black', bg: 'magenta'});
  const execute = colorlize({message: ' execute ', fg: 'black', bg: 'yellow'});
  const unset = colorlize({message: ' unset ', fg: 'black', bg: 'red'});
  const data: string[] = [title];

  for (let i = 0, k = sources.length; i < k; i++) {
    const name = colorlize({message: ` ${sources[i].name} `, fg: 'black', bg: 'green'});
    const merged = conf.merge(sources[i].name, sources[i].path, patchCfg);
    const linecusts = conf.mergeLinecust(merged.linecust);
    data.push(name, ...merged.set);
    linecusts.length > 0 && data.push(linecust, ...linecusts);
    merged.execute.length > 0 && data.push(execute, ...merged.execute);
    data.push(unset, ...merged.unset);
  }

  const [error, errorMsg] = writeLines({path, data, overwrite: true});

  if (error) {
    throw new Error(errorMsg);
  }

  return path;
};

main();
