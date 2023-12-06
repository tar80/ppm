/* @file Perform actions on ListFile entries
 * @arg 0 {string} - Specifies the action
 * @arg 1 {string} - How to deal with paths containing spaces. "enclose" |  "double" | "escape"
 * @arg 2 {number} - If non-zero, allow duplicate paths
 * @arg 3 {string} - Specifies the file encoding. "sjis" | "utf16le" | "utf8"
 */
import type {FileEncode} from '@ppmdev/modules/types.ts';
import {type EntryElements, getLfMeta, parseLfData, splitLfData} from '@ppmdev/parsers/listfile.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {isEmptyStr, isError} from '@ppmdev/modules/guard.ts';
import {readLines} from '@ppmdev/modules/io.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {useLanguage} from '@ppmdev/modules/data.ts';
import debug from '@ppmdev/modules/debug.ts';

type BlankHandle = 'enclose' | 'double' | 'escape';
type BoolStr = '0' | '1';

if (fso.FileExists(PPx.Extract('%OR %FDC'))) {
  PPx.Quit(1);
}

const DELIM = '@#_#@';

const main = (): void => {
  const {scriptName} = pathSelf();
  const args = adjustArgs();
  const path = PPx.Extract('%FDV');
  const [error, data] = readLines({path, enc: args.enc});

  if (isError(error, data)) {
    PPx.report(`[ppm/${scriptName}] ${data}`);
    PPx.Quit(-1);
  }

  const metadata = getLfMeta(data.lines);
  const [base, dirtype] = metadata.base.split('|');
  const markEntries = PPx.Extract('%#;X').split(';');
  const cmdline = PPx.Extract(`%*getcust(S_ppm#actions:${metadata.ppm}_${args.act})`).replace(
    /[\r\n]/g,
    (c) => ({'\r': '%br', '\n': '%bl'})[c as '\r' | '\n']
  );

  if (isEmptyStr(cmdline)) {
    PPx.report(`[ppm/${scriptName}] ${lang.noAction}`);
    PPx.Quit(-1);
  }

  const perPath = metadata.freq === 'every';
  const search = metadata.search ?? '';
  const blankReplacer = blankHandleSpec(args.spc);
  const decompLine = splitLfData();
  const doAction = (() => {
    return perPath
      ? ({path, entry, isDup}: {path: string; entry: EntryElements; isDup: BoolStr}): number =>
          PPx.Execute(`%OP- *execute ,${replaceCmdline({cmdline, base, dirtype, isDup, path, search, entry})}`)
      : ({path}: {path: string}): number => entries.push(path);
  })();
  const entries: string[] = [];
  const duplicates: Record<string, typeof isDup> = {};
  let isDup: BoolStr;

  for (let i = 0, k = markEntries.length; i < k; i++) {
    for (const line of data.lines) {
      if (~line.indexOf(markEntries[i])) {
        const entry = parseLfData(decompLine(line));

        if (!!entry && entry.sname && fso.FileExists(entry.sname)) {
          let path = `${base}\\${entry.sname}`;

          if (~path.indexOf(' ')) {
            path = blankReplacer(path);
          }

          isDup = duplicates[path] || '0';

          if (args.dup || isDup === '0') {
            duplicates[path] = '1';
            doAction({path, entry, isDup});
          }
        }

        break;
      }
    }
  }

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

const adjustArgs = (args = PPx.Arguments): {act: string; spc: BlankHandle; dup: boolean; enc: FileEncode} => {
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

  return {act: arr[0], spc: arr[1] as BlankHandle, dup: arr[2] !== '0', enc: arr[3] as FileEncode};
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
  isDup: BoolStr;
  path: string;
  search: string;
  entry: EntryElements;
};

const esc = (str: string): string => str.replace(/[\r\n]/g, (c) => ({'\r': '%br', '\n': '%bl'})[c as '\r' | '\n']);
const replaceCmdline = ({cmdline, base, dirtype, isDup, path, search, entry}: CmdParameters): string => {
  const att = entry.A ?? '';
  const hl = entry.H ?? '';
  const comment = entry.T ?? '';
  const data = `base:${base}${DELIM}dirtype:${dirtype}${DELIM}search:${search}${DELIM}dup:${isDup}${DELIM}path:${path}${DELIM}att:${att}${DELIM}hl:${hl}${DELIM}comment:${comment}`;
  const rgx = `base:(?<base>.*)${DELIM}type:(?<type>.*)${DELIM}search(?<search>.*)${DELIM}dup:(?<dup>.+)${DELIM}path:(?<path>.+)${DELIM}att:(?<att>.*)${DELIM}hl:(?<hl>.*)${DELIM}comment:(?<comment>.*)`;

  if (debug.jestRun()) {
    // @ts-ignore
    return {data, rgx, cmdline};
  }

  return PPx.Extract(`%%OP %*regexp("%(${data}%)","%(/${rgx}/${cmdline}/%)")`);
};

if (!debug.jestRun()) main();
// export {blankHandleSpec, replaceCmdline};
