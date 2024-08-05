/* @file Enhanced %*input()
 * @arg 0 {string} - JSON style argument
 * @return - Input string or "[error]"
 *
 * JSON style argument format { "option name": "default value", ... }
 * {
 *    "text": "",
 *    "title": "ppm/input.js",
 *    "mode": "e",
 *    "select": "a",
 *    "k": "",
 *    "forpath": false,
 *    "fordigit": false,
 *    "leavecancel": false,
 *    "multi": false,
 *    "autoselect": false,      - automatically select the first candidate
 *    "list": "off",            - same as *completelist -list:on|off
 *    "module": "off",          - same as *completelist -module:on|off
 *    "match": "",              - same as *completelist -match:number
 *    "detail": "",             - same as *completelist -detail:"format"
 *    "file": "",               - same as *completelist -file:"file path"
 * }
 *
 * NOTE: If autoselect is true, the first candidate in the completion list
 * will be automatically selected when you press the Enter Key.
 *
 * (Ex) input.js,"{'text':'%si""id""','title':'input bar title','k':'*linemessage %%FDC'}"
 * (Ex) input.js,"{""text"":""%si'id'"",""title"":""input bar title"",""autoselect"":true}"
 */

import '@ppmdev/polyfills/json.ts';
import {argParse} from '@ppmdev/parsers/json.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import debug from '@ppmdev/modules/debug.ts';

const main = (): string => {
  const arg: false | string = argParse();

  if (!arg) {
    PPx.Echo('[wrong argument]: invalid JSON format.');
    PPx.Quit(-1);
  }

  const options: Partial<Options> = JSON.parse(arg);
  const optsInput = inputOptions(options);
  const optsPostCmd = postOptions(options);
  const [errorlevel, input] = ppm.extract('.', `%*input(${optsInput} ${optsPostCmd})`);

  ppm.deletemenu();
  ppm.deletekeys();

  return errorlevel !== 0 ? '[error]' : input;
};

type Options = typeof def;
type OptKeys = keyof Options;
const def = {
  text: '',
  title: 'ppm/input.js',
  mode: 'e',
  select: 'a',
  k: '',
  forpath: false,
  fordigit: false,
  leavecancel: false,
  multi: false,
  autoselect: false,
  list: 'off',
  module: 'off',
  match: '',
  detail: '',
  file: ''
};
const parseOptions = (arr: string[], arg: Partial<Options>, post?: boolean) => {
  /**
   * Assembling option strings.
   * @param value - Target option value
   * @param quote - Whether to enclose the value in quotes
   * @param bool  - Whether the value is a Boolean value
   */
  return (value: OptKeys, quote?: boolean, bool?: boolean): void => {
    let v = arg[value] ?? def[value];
    const q = quote ? '"' : '';

    if (typeof v === 'string') {
      v.replace(/\\"/g, '""');
    }

    if (post) {
      v !== '' && arr.push(`-${value}:${q}${v}${q}`);
    } else {
      if (bool) {
        v && arr.push(`-${value}`);
      } else if (v !== '') {
        arr.push(`-${value}:${q}${v}${q}`);
      }
    }
  };
};

const inputOptions = (arg: Partial<Options>): string => {
  const arr: string[] = [];
  const opts = parseOptions(arr, arg);
  opts('text', true);
  opts('title', true);
  opts('mode');
  opts('select');
  opts('forpath', false, true);
  opts('fordigit', false, true);
  opts('leavecancel', false, true);
  opts('multi', false, true);

  return arr.join(' ');
};

const postOptions = (arg: Partial<Options>): string => {
  const arr: string[] = ['-k', '*completelist'];
  const opts = parseOptions(arr, arg, true);
  let keyTbl = '';
  opts('list');
  opts('module');
  opts('match');
  opts('detail', true);

  if (arg.file) {
    if (fso.FileExists(PPx.Extract(arg.file))) {
      keyTbl = ppm.setkey(
        '^o',
        `*linecust ppminput,K_lied:FIRSTEVENT,%%(*insert ${arg.file}%%:*linecust ppminput,K_lied:FIRSTEVENT,%%)%%:%%K"@^o"`,
        true
      );
      ppm.setkey(
        '^s',
        `*linecust ppminput,K_lied:FIRSTEVENT,%%(*insert ${arg.file}%%:*linecust ppminput,K_lied:FIRSTEVENT,%%)%%:%%K"@^s"`,
        true
      );
    } else {
      arg.file = '';
    }
  }

  opts('file', true);

  const result: string[] = [arr.join(' ')];

  if (arg.autoselect) {
    keyTbl = ppm.setkey('ENTER', '*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"', true);
  }

  if (!isEmptyStr(keyTbl)) {
    result.push(`*mapkey use,${keyTbl}`);
  }

  if (arg.k) {
    result.push(arg.k);
  }

  return result.join('%%:');
};

if (!debug.jestRun()) {
  PPx.result = main();
}
// export {parseArgs, inputOptions, postOptions};
