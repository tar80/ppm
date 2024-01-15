/* @file Perform actions on ListFile entries
 * @arg 0 {string} - Specifies the command-alias
 * @arg 1 {string} - How to deal with paths containing spaces. "enclose" | "double" | "escape"
 * @arg 2 {number} - If non-zero, allow duplicate paths
 */

import '@ppmdev/polyfills/json.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {useLanguage} from '@ppmdev/modules/data.ts';
import debug from '@ppmdev/modules/debug.ts';

type BlankHandle = 'enclose' | 'double' | 'escape';
type BoolStr = '0' | '1';
type EntryDetails = {att: PPxEntry.Attribute; hl: number; path: string; sname: string};

if (fso.FileExists(PPx.Extract('%OR %FDC'))) {
  PPx.Quit(1);
}

const DELIM = '@#_#@';

const main = (): void => {
  const {scriptName} = pathSelf();
  const args = adjustArgs();
  const metadata: Record<string, string> = JSON.parse(PPx.getIValue('meta'));
  const cmdline = PPx.Extract(`%*getcust(S_ppm#actions:${metadata.ppm}_${args.act})`).replace(
    /[\r\n]/g,
    (c) => ({'\r': '%br', '\n': '%bl'})[c as '\r' | '\n']
  );

  if (isEmptyStr(cmdline)) {
    PPx.report(`[ppm/${scriptName}] ${lang.noAction}`);
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
          PPx.Execute(`%OP- *execute ,${replaceCmdline({cmdline, base, dirtype, search, isDup, entry})}`)
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

    break;
  } while (e.NextMark);

  if (!perPath) {
    const data = `search:${search}${DELIM}path:${entries.join(' ')}`;
    const rgx = `^search:(?<search>.*)${DELIM}path:(?<path>.+)$`;
    debug.log(PPx.Extract(`%*regexp("%(${data}%)","%(/${rgx}/${cmdline}/%)")`));
    PPx.Execute(`%OP *execute ,%%OP- %*regexp("%(${data}%)","%(/${rgx}/${cmdline}/%)")`);
  }

  PPx.Quit(-1);
};

const lang = {
  en: {noAction: 'No action registered'},
  jp: {noAction: '対応するコマンドが登録されていません'}
}[useLanguage()];

const adjustArgs = (args = PPx.Arguments): {act: string; spc: BlankHandle; dup: boolean} => {
  const arr: string[] = ['*ppv', 'enclose', '0', 'utf8'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  if (!/enclose|escape|double/.test(arr[1])) {
    arr[1] = 'enclose';
  }

  if (!/sjis|utf16le|utf8/.test(arr[3])) {
    arr[3] = 'utf8';
  }

  return {act: arr[0], spc: arr[1] as BlankHandle, dup: arr[2] !== '0'};
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
  const rgx = `base:(?<base>.*)${DELIM}type:(?<type>.*)${DELIM}search(?<search>.*)${DELIM}dup:(?<dup>.+)${DELIM}path:(?<path>.+)${DELIM}att:(?<att>.*)${DELIM}hl:(?<hl>.*)${DELIM}option:(?<sname>.*)`;

  if (debug.jestRun()) {
    // @ts-ignore
    return {data, rgx, cmdline};
  }

  return PPx.Extract(`%%OP %*regexp("%(${data}%)","%(/${rgx}/${cmdline}/%)")`);
};

if (!debug.jestRun()) main();
// export {blankHandleSpec, replaceCmdline};
