import '@ppmdev/polyfills/objectKeys.ts';
import '@ppmdev/polyfills/json.ts';
import type {Error_String} from '@ppmdev/modules/types.ts';
import {isError, isEmptyObj} from '@ppmdev/modules/guard.ts';
import {colorlize} from '@ppmdev/modules/ansi.ts';
import {copyFile} from '@ppmdev/modules/filesystem.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {readLines, writeLines} from '@ppmdev/modules/io.ts';
import {type MergeLines, type PatchSource, type ParsedPatch, parseConfig} from './parser.ts';

const checkRegisteredLinecusts = (pluginName: string, linecusts: MergeLines['linecust']): typeof linecusts => {
  if (isEmptyObj(linecusts)) {
    return {};
  }

  const register = {...linecusts};
  const ppmcache = ppm.global('ppmcache');
  const linecustCfg = `${ppmcache}\\ppm\\unset\\linecust.cfg`;
  const [error, data] = readLines({path: linecustCfg});
  const rgx = /^[^=]+=([^,]+),.+,$/;

  if (isError(error, data)) {
    throw new Error(data);
  }

  for (const line of data.lines) {
    if (~line.indexOf(pluginName)) {
      const id = line.replace(rgx, '$1');
      register[id] && delete register[id];
    }
  }

  return register;
};

type Title = 'load' | 'linecust' | 'execute';

/**
 * Get log of a plugin registration result.
 * @param color Color the log
 * @return One line log
 */
const getLog = (exitcode: number, type: Title, message: string, color: boolean): string => {
  const load = color ? colorlize({message: ' LOAD ', fg: 'black', bg: 'green'}) : 'LOAD: ';
  const linecust = color ? colorlize({message: ' LINECUST ', fg: 'black', bg: 'yellow'}) : 'LINECUST: ';
  const execute = color ? colorlize({message: ' EXECUTE ', fg: 'black', bg: 'yellow'}) : 'EXECUTE: ';
  const error = color ? colorlize({message: ' ERROR ', fg: 'black', bg: 'red'}) : 'ERROR: ';
  const title = {'load': load, 'linecust': linecust, 'execute': execute}[type];

  return exitcode === 0 ? `${title} ${message}` : `${error} [${type}] ${message}`;
};

export const conf = {
  /**
   * Copy user config to ppm cache directory.
   * @return [success or not, error-message]
   */
  init(pluginName: string, pluginDir: string): Error_String {
    const ppmcache = ppm.global('ppmcache');
    return copyFile(`${pluginDir}\\setting\\patch.cfg`, `${ppmcache}\\config\\${pluginName}.cfg`, false);
  },

  /**
   * Merge base.cfg and patch.cfg.
   * @param source - `default`|`user`
   */
  merge(pluginName: string, pluginDir: string, source: PatchSource): MergeLines {
    const ppmcache = ppm.global('ppmcache');
    const cfg = {
      patch: source === 'default' ? `${pluginDir}\\setting\\patch.cfg` : `${ppmcache}\\config\\${pluginName}.cfg`,
      base: `${pluginDir}\\setting\\base.cfg`
    };

    let [error, data] = readLines({path: cfg.patch});

    if (isError(error, data)) {
      throw new Error(data);
    }

    const patchLines = parseConfig.patch(source, data.lines);
    [error, data] = readLines({path: cfg.base});

    if (isError(error, data)) {
      throw new Error(data);
    }

    return parseConfig.merge(data.lines, patchLines);
  },

  /** Restore linecusts from patch */
  mergeLinecust(linecusts: ParsedPatch['linecust']): string[] {
    const arr: string[] = [];

    for (const key of Object.keys(linecusts)) {
      const o = linecusts[key];
      arr.push(`${key},${o.id}${o.sep}${o.value}`);
    }

    return arr;
  },

  /** Export merged settings to file. */
  write(pluginName: string, merged: MergeLines): typeof registLinecusts {
    const ppmcache = ppm.global('ppmcache');
    const linecustCfg = `${ppmcache}\\ppm\\unset\\linecust.cfg`;
    const cfg = {
      setup: `${ppmcache}\\ppm\\setup\\${pluginName}.cfg`,
      unset: `${ppmcache}\\ppm\\unset\\${pluginName}.cfg`
    };

    let [error, errMsg] = writeLines({path: cfg.setup, data: merged.set, overwrite: true});
    [error, errMsg] = error ? [error, errMsg] : writeLines({path: cfg.unset, data: merged.unset, overwrite: true});

    if (isError(error, errMsg)) {
      throw new Error(errMsg);
    }

    const registLinecusts = checkRegisteredLinecusts(pluginName, merged.linecust);
    const data: string[] = [];

    for (const label of Object.keys(registLinecusts)) {
      const {id} = registLinecusts[label];
      data.push(`${pluginName}=${label},${id},`);
    }

    if (data.length > 0) {
      [error, errMsg] = writeLines({path: linecustCfg, data, append: true});

      if (isError(error, errMsg)) {
        throw new Error(errMsg);
      }
    }

    return merged.linecust;
  },

  /**
   * Register the plugin settings.
   * @param color Color the log
   * @return Result log
   */
  register(
    pluginName: string,
    executes: string[],
    linecusts: MergeLines['linecust'],
    color?: boolean,
    ppcust?: boolean
  ): [boolean, string[]] {
    const ppmcache = ppm.global('ppmcache');
    const result: string[] = [];
    const cfg = `${ppmcache}\\ppm\\setup\\${pluginName}.cfg`;
    color = color ?? true;
    let error = false;

    if (ppcust) {
      ppm.execute('B', `*linemessage @${cfg}%%bn%%:*ppcust CA ${cfg}%%&`);
    } else {
      ppm.setcust(`@${cfg}`);
      result.push(getLog(0, 'load', pluginName, color));
    }

    for (const key of Object.keys(linecusts)) {
      const {id, sep, value} = linecusts[key];
      const exitcode = PPx.Execute(`*linecust ${key},${id}${sep}${value}`);
      result.push(getLog(exitcode, 'linecust', `${key},${id}${sep}${value}`, color));
      error = exitcode !== 0;
    }

    for (const command of executes) {
      const exitcode = PPx.Execute(command);
      result.push(getLog(exitcode, 'execute', command, color));
      error = exitcode !== 0;
    }

    return [error, result];
  }
};
