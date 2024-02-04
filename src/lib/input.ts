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
import debug from '@ppmdev/modules/debug.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';

const main = (): void => {
  const args = PPx.Arguments.length > 0 && PPx.Arguments.Item(0).replace(/'/g, '"');
  const options: Partial<Options> = args ? parseArgs(args) : {};
  const optsInput = inputOptions(options);
  const optsPostCmd = postOptions(options);
  const [errorlevel, input] = ppm.extract('.', `%*input(${optsInput} ${optsPostCmd})`);

  ppm.deletemenu();
  ppm.deletekeys();

  PPx.result = errorlevel !== 0 ? '[error]' : input;
};

/**
 * Fills in the missing processing in JSON.parse().
 * NOTE: JSON.parse() cannot handle Unicode. It also requires escaping backslashes.
 */
const parseArgs = (args: string): Partial<Options> => {
  const elements = args.slice(1, -1).split(',');
  const rgx = /^"(text|title)":\s*"(.*)"$/;
  let [text, title]: string[] = [];

  for (let i = 0, j = 0, k = elements.length; i < k; i++) {
    if (elements[i] == null || j === 2) {
      break;
    }

    if (~elements[i].indexOf('"text":')) {
      text = elements[i].replace(rgx, '$2').replace(/"/g, '""');
      elements.splice(i, 1);
      i--;
      j++;
    } else if (~elements[i].indexOf('"title"')) {
      title = elements[i].replace(rgx, '$2').replace(/"/, '""');
      elements.splice(i, 1);
      i--;
      j++;
    }
  }

  return {text, title, ...JSON.parse(`{${elements.join(',')}}`)};
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
    const v = arg[value] ?? def[value];
    const q = quote ? '"' : '';

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
  opts('list');
  opts('module');
  opts('match');
  opts('detail', true);
  opts('file', true);

  const result: string[] = [arr.join(' ')];

  if (arg.autoselect) {
    const keyTbl = ppm.setkey('ENTER', `*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"`, true)
    result.push(`*mapkey use,${keyTbl}`);
  }

  if (arg.k) {
    result.push(arg.k);
  }

  return result.join('%%:');
};

!debug.jestRun() && main();
// export {parseArgs, inputOptions, postOptions}
