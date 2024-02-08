/* @file Perform actions on ListFile entries
 * @arg 0 {string} - Specifies the command-alias
 * @arg 1 {string} - How to deal with paths containing spaces. "enclose" | "double" | "escape"
 * @arg 2 {number} - If non-zero, allow duplicate paths
 * @arg 3 {string} - Specify the file encoding. "sjis" | "utf8" | "utf16le"(default)
 */

import '@ppmdev/polyfills/json.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {uniqID, useLanguage} from '@ppmdev/modules/data.ts';
import debug from '@ppmdev/modules/debug.ts';

type BlankHandle = 'enclose' | 'double' | 'escape';
type BoolStr = '0' | '1';
type EntryDetails = {att: PPxEntry.Attribute; hl: number; path: string; sname: string};

if (fso.FileExists(PPx.Extract('%OR %FDC'))) {
  PPx.Quit(1);
}

const DELIM = '@#_#@';

const main = (): void => {
  const args = adjustArgs();
  const userData = PPx.Extract(`%*extract(%%su'${uniqID.lfDset}%n')`);

  if (isEmptyStr(userData)) {
    PPx.Execute('%Obd echo %*comment|%0ppvw.exe');
    PPx.Quit(-1);
  }

  const metadata: Record<string, string> = JSON.parse(userData);
  const cmdline = shapeCmdline(metadata.ppm, args.act);
  // const cmdline = action.replace(/\r\n/g, '%bn');

  if (isEmptyStr(cmdline)) {
    PPx.linemessage(`!"${lang.noAction}`);
    PPx.Quit(-1);
  }

  const perPath = metadata.freq === 'every';
  const base = metadata.base ?? '';
  const dirtype = metadata.dirtype ?? '';
  const search = metadata.search ?? '';
  const blankReplacer = blankHandleSpec(args.spc);
  const doAction = (() => {
    return perPath
      ? ({entry, isDup}: {entry: EntryDetails; isDup: BoolStr}): number =>
          PPx.Execute(`%OCP- *execute ,%(${replaceCmdline({cmdline, base, dirtype, search, isDup, entry})}%)`)
      : ({entry}: {entry: EntryDetails}): number => entries.push(entry.path);
  })();
  const entries: string[] = [];
  const duplicates: Record<string, typeof isDup> = {};
  let isDup: BoolStr;

  const e = PPx.Entry;
  e.FirstMark;

  do {
    const entry: EntryDetails = {
      att: e.Attributes,
      hl: e.Highlight,
      path: `${base}\\${e.Comment}`,
      sname: e.ShortName
    };

    if (fso.FileExists(entry.path)) {
      if (~entry.path.indexOf(' ')) {
        entry.path = blankReplacer(entry.path);
      }

      isDup = duplicates[entry.path] || '0';

      if (args.dup || isDup === '0') {
        duplicates[entry.path] = '1';
        doAction({entry, isDup});
      }
    }
  } while (e.NextMark);

  if (!perPath) {
    const data = `dup:0${DELIM}search:${search}${DELIM}path:${entries.join(' ')}`;
    const rgx = `^dup:(?<dup>0)${DELIM}search:(?<search>.*)${DELIM}path:(?<path>.+)$`;
    debug.log(PPx.Extract(`%*regexp("%(${data}%)","%(/${rgx}/${cmdline}/%)")`));
    PPx.Execute(`%OP *execute ,%%OP- %*regexp("%(${data}%)","%(/${rgx}/${cmdline}/%)")`);
  }
};

const lang = {
  en: {noAction: 'No action registered'},
  jp: {noAction: '対応するコマンドが登録されていません'}
}[useLanguage()];

const adjustArgs = (args = PPx.Arguments): {act: string; spc: BlankHandle; dup: boolean} => {
  const arr: string[] = ['*ppv', 'enclose', '0', 'utf16le'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  if (!/enclose|escape|double/.test(arr[1])) {
    arr[1] = 'enclose';
  }

  if (!/sjis|utf8|utf16le/.test(arr[3])) {
    arr[3] = 'utf16le';
  }

  return {act: arr[0], spc: arr[1] as BlankHandle, dup: arr[2] !== '0'};
};

const shapeCmdline = (plugin: string, command: string): string => {
  const value =
    PPx.Extract(`%*getcust(S_ppm#actions:${plugin}_${command})`) ||
    PPx.Extract(`%*getcust(S_ppm#actions:all_${command})`);

  return value.replace(/\//g, '\\/');
};

const blankHandleSpec = (spec: BlankHandle): ((path: string) => string) => {
  return {
    enclose(path: string): string {
      return `"${path}"`;
    },
    double(path: string): string {
      return `""${path}""`;
    },
    escape(path: string): string {
      return path.replace(/\s/g, '\\ ');
    }
  }[spec];
};

type CmdParameters = {
  cmdline: string;
  base: string;
  dirtype: string;
  search: string;
  isDup: BoolStr;
  entry: EntryDetails;
};

const replaceCmdline = ({cmdline, base, dirtype, search, isDup, entry}: CmdParameters): string => {
  const att = entry.att ?? '';
  const hl = entry.hl ? String(entry.hl) : '';
  const sname = entry.sname ?? '';
  const data = `base:${base}${DELIM}dirtype:${dirtype}${DELIM}search:${search}${DELIM}dup:${isDup}${DELIM}path:${entry.path}${DELIM}att:${att}${DELIM}hl:${hl}${DELIM}option:${sname}`;
  const rgx = `base:(?<base>.*)${DELIM}dirtype:(?<type>.*)${DELIM}search:(?<search>.*)${DELIM}dup:(?<dup>.+)${DELIM}path:(?<path>.+)${DELIM}att:(?<att>.*)${DELIM}hl:(?<hl>.*)${DELIM}option:(?<option>.*)`;

  if (debug.jestRun()) {
    // @ts-ignore
    return {data, rgx, cmdline};
  }

  return PPx.Extract(`%OP %*regexp("%(${data}%)","%(/${rgx}/${cmdline}/%)")`);
};

if (!debug.jestRun()) main();
// export {blankHandleSpec, replaceCmdline};
