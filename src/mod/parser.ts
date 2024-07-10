import type {Error_Data} from '@ppmdev/modules/types.ts';
import '@ppmdev/polyfills/stringTrim.ts';
import '@ppmdev/polyfills/stringPrecedes.ts';
import '@ppmdev/polyfills/arrayIndexOf.ts';
import type {ScriptEngine} from '@ppmdev/modules/types.ts';
import {type PermissionItems, permission} from '@ppmdev/modules/permission.ts';
import {readLines} from '@ppmdev/modules/io.ts';
import {isBottom, isEmptyStr} from '@ppmdev/modules/guard.ts';
import {info, uniqName} from '@ppmdev/modules/data.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {langParser} from './language.ts';

const lang = langParser[ppm.lang()];

type ListSource = {
  autor: string;
  name: string;
  version: string | number;
  location: 'remote' | 'local';
  path: string;
  enable: boolean;
  setup: boolean;
  branch?: string;
  commit?: string;
};
export const parsePluginlist = (path?: string): typeof plugins => {
  const pluginlist = path ?? `${ppm.global('ppmcache')}\\list\\${uniqName.pluginList}`;
  const [error, data] = readLines({path: pluginlist});

  if (error) {
    throw new Error(data);
  }

  const ppmrepo = ppm.global('ppmrepo');
  const rgx = /^(local|remote)[\s]+["']([^"']+)["'][\s,]?[\s]*(.+)?/i;
  const plugins: ListSource[] = [];
  const [enable, setup, version] = [true, false, '0.1.0'];

  for (let line of data.lines) {
    if (line.indexOf(';') === 0) {
      continue;
    }

    if (line.indexOf('local') === 0 || line.indexOf('remote') === 0) {
      line.precedes(' ;').replace(rgx, function (_: string, location: 'local' | 'remote', path: string, info: string): string {
        const [autor, name] = path.replace(/^(.+)[\/\\](.+)/, '$1;$2').split(';');
        const repoInfo: object = Function(`return ${info}`)();

        if (location === 'remote') {
          path = `${ppmrepo}\\${name}`;
        }

        plugins.push({name, autor, enable, setup, version, location, path, ...repoInfo});

        return '';
      });
    }
  }

  return plugins;
};

const item = {
  pluginVersion: '0.0.1',
  copyFlag: false,
  copyScript: false,
  copySpec: [] as string[]
};

export let parsedItem = {...item};
export const clearItem = () => (parsedItem = {...item});

type installPermissions = typeof permissions;
type installPermissionKeys = keyof installPermissions;
const permissions = {
  VERSION: 'pluginVersion',
  PPM_VERSION: 'ppmVersion',
  PPX_VERSION: 'ppxVersion',
  SCRIPT_VERSION: 'scriptVersion',
  CV8_VERSION: 'scriptVersion',
  QJS_VERSION: 'scriptVersion',
  EXECUTABLES: 'useExecutables',
  MODULES: 'useModules',
  DEPENDENCIES: 'dependencies',
  CODETYPE_PERMISSION: 'codeType',
  SCRIPTTYPE_PERMISSION: 'scriptType',
  COPY_FLAG: 'copyFlag',
  COPY_SCRIPT: 'copyScript',
  SPECIFIC_COPY_DIR: 'copySpec'
} as const;
export const parseInstall = (name: string, path: string, local: boolean): [boolean, string, string?] => {
  const messages: string[] = [];
  let [key, value]: string[] = [];
  const [error, data] = readLines({path});

  if (error) {
    return [true, `${lang.failedToGet} ${name}`];
  }

  if (~data.lines[0].indexOf('404:')) {
    return [true, `${name} ${lang.isNotPlugin}`];
  }

  const lines = data.lines;
  const ignoreItem = {
    JScript: ['CV8_VERSION', 'QJS_VERSION'],
    ClearScriptV8: ['SCRIPT_VERSION', 'QJS_VERSION'],
    QuickJS: ['SCRIPT_VERSION', 'CV8_VERSION']
  }[PPx.ScriptEngineName as ScriptEngine];

  if (isBottom(lines[0]) || !~lines[0].indexOf(name)) {
    return [true, `${name} ${lang.isNotPlugin}`];
  }

  type ItemNames = keyof Required<PermissionItems>;
  let drop = false;
  let dep: string | undefined;

  for (let i = 1, k = lines.length; i < k; i++) {
    [key, value] = lines[i].split('=');

    //NOTE: PPMCV8_VERSION is deprecated. User CV8_VERSION instead.
    //PPMCV8_VERSION will be removed. When all plugins are updated.
    if (isEmptyStr(lines[i]) || key.indexOf('#') === 0 || ~key.indexOf('PPMCV8_VERSION') || ~ignoreItem.indexOf(key)) {
      continue;
    }

    key = permissions[key as installPermissionKeys];

    if (!isBottom(value)) {
      if (key === 'copyFlag' || key === 'copyScript') {
        parsedItem[key] = value.toLowerCase() === 'true';
        continue;
      } else if (key === 'copySpec') {
        if (!isEmptyStr(value)) {
          parsedItem[key] = value.split(',');
        }

        continue;
      }

      let error2, dataStr;
      if (key === 'pluginVersion') {
        parsedItem[key] = value;
        [error2, dataStr] = permission['pluginVersion'](value as never, name);
      } else if (key === 'dependencies') {
        [error2, dataStr] = [false, ''];

        if (!isEmptyStr(value)) {
          dep = value;
        }
      } else {
        [error2, dataStr] = permission[key as ItemNames](value as never);
      }

      if (error2) {
        drop = true;
        !(local && key === 'pluginVersion') && messages.push(dataStr);
      }
    }
  }

  return [drop, messages.join('\\n'), dep];
};

export const getProp = (line: string): {key: string; sep: string; value: string} => {
  const delim = '@ppm!delim#';
  const param = /^'/.test(line)
    ? line.replace(/^('[^']+'\s*)([=,])\s*(.*)$/, `$1${delim}$2${delim}$3`)
    : line.replace(/^([^=,]+)([=,])\s*(.*)$/, `$1${delim}$2${delim}$3`);
  const param_ = param.split(delim);

  return {key: param_[0].replace(/[\s\uFEFF\xA0]+$/, ''), sep: param_[1], value: param_[2]};
};

export type ParsedPatch = SpecProp & ExtraProp & LinecustProp;
type SpecKeys = 'default' | 'replace' | 'convert';
type ExtraKeys = 'section' | 'unset' | 'execute';
type SpecValue = {[key: string]: {sep: string; value: string}};
type SpecProp = {[key in SpecKeys]: SpecValue};
type ExtraProp = {[key in ExtraKeys]: string[]};
type LinecustValue = {[key: string]: {id: string; sep: string; value: string}};
type LinecustProp = {'linecust': LinecustValue};

export const specItem = (
  i: number,
  k: number,
  line: string,
  lines: string[],
  parsed: ParsedPatch
): [string | false, ParsedPatch, number] => {
  const rgxCtrlJ = /^([\\&]*\^[\\&]*)J$/;
  let {key, sep, value} = getProp(line);
  let specs: SpecKeys;

  // convert "CTRL+J" to "CTRL+V_H4A"
  if (key.indexOf('$') === 0) {
    value = value.trim().toUpperCase();

    if (~value.indexOf('J')) {
      value = value.replace(rgxCtrlJ, '$1V_H4A');
    }

    specs = 'replace';
  } else if (key.indexOf('@') === 0) {
    let value_ = [value];

    for (i++; i < k; i++) {
      line = lines[i];

      if (line.indexOf('\t') === 0) {
        value_.push(line);
      } else {
        i--;
        break;
      }
    }

    value = value_.join(info.nlcode);
    specs = 'default';
  } else if (key.indexOf('?') === 0) {
    value = value.trim();
    specs = 'convert';
  } else {
    return [lang.badGrammar, parsed, i];
  }

  parsed[specs][key.substring(1)] = {sep, value};

  return [false, parsed, i];
};

// "-- =" separator
const rgxSeparator = /^--[\s]+=[\s]*/;
const separatorFmt = '--\t=';
const setFmt = (key: string, sep: string, value: string): string => `${key}\t${sep} ${value}`;
const unsetFmt = (key: string): string => `-|${key}\t=`;

// properties to ignore registration to the unset
const ignoreProps = (prop: string): boolean => /^(A_|X_|XB_|XC_|XV_|KC_main|KV_main)/i.test(prop);

type UserReplace = {key: string; value: string}[];
const replacer = (line: string, replacers: UserReplace): string => {
  let rgx: RegExp;

  for (const repl of replacers) {
    if (~line.indexOf(`[/${repl.key}]`)) {
      rgx = RegExp(`\\[/${repl.key}]`, 'g');
      line = line.replace(rgx, repl.value);
    }
  }

  return line;
};

export const sectionItems = (i: number, k: number, lines: string[], parsed: ParsedPatch): [string | false, typeof i, ParsedPatch] => {
  const userReplace: UserReplace = [];
  const [section, unset]: string[][] = [[], []];
  let [key, sep, value, line]: string[] = [];

  for (i++; i < k; i++) {
    line = lines[i];

    if (isEmptyStr(line) || /^[\s;}]/.test(line) || rgxSeparator.test(line)) {
      continue;
    }

    if (line.indexOf('[endsection]') === 0) {
      break;
    }

    /* user-defined replace */
    if (line.indexOf('/') === 0) {
      userReplace.push(getProp(line.substring(1)));
      continue;
    }

    line = replacer(line, userReplace);
    ({key, sep, value} = getProp(line));

    if (!sep && !value) {
      return [lang.badGrammar, i, parsed];
    }

    if (sep === '=' && value.indexOf('{') === 0) {
      let deleteProps = true;

      if (key.indexOf('-') === 0) {
        if (/^-[0-9\.]*\|.+/.test(key)) {
          return [lang.badDeletion, i, parsed];
        }

        key = key.substring(1);

        if (ignoreProps(key)) {
          unset.push(setFmt(key, sep, value));
        } else {
          deleteProps = false;
          unset.push(unsetFmt(key));
        }
      } else {
        unset.push(setFmt(key, sep, value));
      }

      section.push(setFmt(key, sep, value));

      /* inner loop for a table */
      for (i++; i < k; i++) {
        line = lines[i];

        if (isEmptyStr(line) || line.indexOf(';') === 0) {
          continue;
        }

        if (line.indexOf('[endsection]') === 0 || line.indexOf('}') === 0) {
          section.push('}');
          deleteProps && unset.push('}');

          break;
        }

        line = replacer(line, userReplace);

        if (/^[\s]/.test(line) || rgxSeparator.test(line)) {
          section.push(line);
          continue;
        }

        ({key, sep, value} = getProp(line));
        section.push(setFmt(key, sep, value));
        deleteProps && unset.push(unsetFmt(key));
      }

      continue;
    }

    if (key.indexOf('-') !== 0) {
      section.push(setFmt(key, sep, value));
      !ignoreProps(key) && unset.push(unsetFmt(key));
    } else {
      if (key.indexOf('-|') === 0 || /^-[0-9\.]*\|.+/.test(key)) {
        section.push(setFmt(key, sep, value));
      } else {
        !ignoreProps(key) && unset.push(`-|${key.substring(1)}\t=`);
      }
    }
  }

  [parsed['section'], parsed['unset']] = [section, unset];

  return [false, i, parsed];
};

export const linecustItems = (i: number, k: number, lines: string[], parsed: ParsedPatch): [number, ParsedPatch] => {
  let line: string;
  const linecust: LinecustValue = {};
  const rgx = /^(\w+),([^,=]+)([,=])(.*)$/;

  for (; i < k; i++) {
    line = lines[i];

    if (line.indexOf('[endlinecust]') === 0) {
      break;
    }

    line.replace(rgx, function (_, ...rest): string {
      let [label, id, sep, value] = [...rest];

      if (!!sep) {
        value = value ?? '';
        linecust[label] = {id, sep, value};
      }

      return line;
    });
  }

  parsed['linecust'] = linecust;

  return [i, parsed];
};

export const executeItems = (i: number, k: number, lines: string[], parsed: ParsedPatch): [typeof i, ParsedPatch] => {
  let line: string;
  const exec: string[] = [];

  for (i++; i < k; i++) {
    line = lines[i];

    if (line.indexOf('[endexecute]') === 0) {
      break;
    }

    if (line.indexOf(';') === 0) {
      continue;
    }

    exec.push(line);
  }

  parsed['execute'] = exec;

  return [i, parsed];
};

const errorDetail = (message: string, i: number, line: string): string => `${message}\nLine:${i + 1}:${line}`;

export type PatchSource = 'default' | 'user';
const patch = (type: PatchSource, lines: string[]): ParsedPatch => {
  let error: string | false = false;
  let line: string;
  let [i, k] = [0, lines.length];
  let parsedPatch: ParsedPatch = {
    default: {},
    replace: {},
    convert: {},
    section: [],
    execute: [],
    unset: [],
    linecust: {}
  };

  for (; i < k; i++) {
    line = lines[i];

    if (isEmptyStr(line) || /^[\s;}]/.test(line) || rgxSeparator.test(line)) {
      continue;
    }

    if (line.indexOf('[end') === 0) {
      throw new Error(errorDetail(`${line} ${lang.isEarlier}`, i, line));
    }

    if (line.indexOf('[section]') === 0 || line.indexOf('[linecust]') === 0 || line.indexOf('[execute') === 0) {
      break;
    }

    [error, parsedPatch, i] = specItem(i, k, line, lines, parsedPatch);

    if (!!error) {
      throw new Error(errorDetail(error, i, line));
    }
  }

  for (; i < k; i++) {
    line = lines[i];

    if (line.indexOf('[section]') === 0) {
      [error, i, parsedPatch] = sectionItems(i, k, lines, parsedPatch);

      if (!!error) {
        throw new Error(errorDetail(error, i, line));
      }
    } else if (type === 'user' && line.indexOf('[linecust]') === 0) {
      [i, parsedPatch] = linecustItems(i, k, lines, parsedPatch);
    } else if (line.indexOf('[execute]') === 0) {
      [i, parsedPatch] = executeItems(i, k, lines, parsedPatch);
    }
  }

  return parsedPatch;
};

export const convertLine = (line: string, repl: SpecValue): string => {
  const matchKeys = line.match(/\[\?[^:]+/g);

  if (isBottom(matchKeys)) {
    return line;
  }

  let [key, value]: string[] = [];
  let rgxRepl: RegExp;
  let line_ = line;

  for (let i = 0, k = matchKeys.length; i < k; i++) {
    key = matchKeys[i].substring(2);
    value = repl[key] ? repl[key].value : '';
    value = isEmptyStr(value) || isBottom(value) ? '$1' : value;
    rgxRepl = RegExp(`\\[\\?${key}:([^\\]]*)]`, 'g');
    line_ = line_.replace(rgxRepl, value);
  }

  return line_;
};

type Unsets = ParsedPatch['unset'];
let subIds: string[] = [];
const isRegistered = (loop: boolean, key: string, registered: Unsets): boolean => {
  let hasItem = false;
  const unsetKey = unsetFmt(key);

  if (loop) {
    subIds.push(unsetKey);
  } else {
    subIds = [];
  }

  for (const item of registered) {
    if (unsetKey === item && (subIds.length === 0 || subIds.indexOf(item))) {
      hasItem = true;
      break;
    }
  }

  return hasItem;
};

export const mergeProp = (
  loop: boolean,
  key: string,
  sep: string,
  value: string,
  patch: ParsedPatch
): {set: string; unset: string} | undefined => {
  const DEFAULT_VALUE = '@default:';
  const REPLACE_KEY = '$replace:';
  let [set, unset]: string[] = [];
  let [key_, sep_, value_] = [key, sep, value];
  let attach: SpecValue[string] | undefined;

  if (key.indexOf(DEFAULT_VALUE) === 0) {
    key_ = key.substring(DEFAULT_VALUE.length);
    attach = patch.default[key_];

    if (!!attach) {
      [sep_, value_] = [attach.sep, attach.value];
    }
  } else if (key.indexOf(REPLACE_KEY) === 0) {
    key_ = key.substring(REPLACE_KEY.length);
    key_ = key_.replace(/^["'](.+)["']/, '$1');
    attach = patch.replace[key_];

    if (!!attach && !isEmptyStr(attach.value)) {
      key_ = attach.value;
    } else {
      return undefined;
    }
  }

  set = setFmt(key_, sep_, value_);

  if (!isRegistered(loop, key_, patch.unset)) {
    unset = unsetFmt(key_);
  }

  return {set, unset};
};

export type MergeLines = {set: string[]; unset: string[]; linecust: LinecustValue; execute: string[]};
const merge = (base: string[], patch: ParsedPatch): MergeLines => {
  const merged: string[] = [];
  let [key, sep, value, line]: string[] = [];
  let [skip, deleteProps] = [false, true];

  for (let i = 0, k = base.length; i < k; i++) {
    line = base[i];

    if (isEmptyStr(line) || /^[\s;}]/.test(line) || rgxSeparator.test(line)) {
      continue;
    }

    if (line.indexOf('-|') === 0) {
      throw new Error(lang.doNotDelete);
    }

    line = convertLine(line, patch.convert);
    ({key, sep, value} = getProp(line));

    if (!sep && !value) {
      throw new Error(lang.badGrammar);
    }

    if (sep === '=' && value.indexOf('{') === 0) {
      if (key.indexOf('-') === 0) {
        throw new Error(lang.badGrammar);
      }

      merged.push(setFmt(key, sep, value));

      if (isRegistered(false, key, patch.unset)) {
        deleteProps = false;
      } else {
        deleteProps = true;
        patch.unset.push(setFmt(key, sep, value));
      }

      /* inner loop for table */
      for (i++; i < k; i++) {
        line = base[i];

        if (isEmptyStr(line) || line.indexOf(';') === 0) {
          continue;
        }

        if (line.indexOf('-|') === 0) {
          throw new Error(lang.doNotDelete);
        }

        if (line.indexOf('}') === 0) {
          merged.push('}');
          deleteProps && patch.unset.push('}');
          skip = false;

          break;
        }

        if (rgxSeparator.test(line)) {
          merged.push(separatorFmt);
          skip = false;
          continue;
        }

        line = convertLine(line, patch.convert);

        if (/^\s+/.test(line)) {
          !skip && merged.push(line);
          continue;
        }

        ({key, sep, value} = getProp(line));

        let tempProp = mergeProp(true, key, sep, value, patch);

        if (!tempProp) {
          skip = true;
          continue;
        }

        merged.push(tempProp.set);
        deleteProps && !!tempProp.unset && patch.unset.push(tempProp.unset);
        skip = false;
      }

      continue;
    }

    let tempProp = mergeProp(false, key, sep, value, patch);

    if (!tempProp) {
      skip = true;
      continue;
    }

    merged.push(tempProp.set);
    !!tempProp.unset && !ignoreProps && patch.unset.push(tempProp.unset);
    skip = false;
  }

  return {set: [...merged, ...patch.section], unset: patch.unset, linecust: patch.linecust, execute: patch.execute};
};

/**
 * Get linecust unregistration details
 * @param name Plugin name
 * @return Linecust cmdlines for unregistration
 */
export const parseLinecust = (name: string): Error_Data => {
  const path = `${ppm.global('ppmcache')}\\ppm\\unset\\linecust.cfg`;
  const [error, data] = readLines({path: path});
  const rgx = /^[^=]+=(.+)$/;
  const register: string[] = [];

  if (error) {
    return [true, data];
  }

  for (const line of data.lines) {
    if (~line.indexOf(name)) {
      register.push(line.replace(rgx, '*linecust $1'));
    }
  }

  return [false, register];
};

export const parseConfig = {patch, merge} as const;
