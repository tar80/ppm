/* @file Print Error message
 * @arg 0 {string} - Specify method. "arg" | "msg"
 * @arg 1 {string} - Path of target script
 * @arg 2 {string} - Error message for arg(0) method "msg"
 */

import {useLanguage} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {isError} from '@ppmdev/modules/guard.ts';
import {readLines} from '@ppmdev/modules/io.ts';
import debug from '@ppmdev/modules/debug.ts';

const {scriptName, parentDir} = pathSelf();

const main = (): void => {
  if (PPx.Arguments.length < 2) {
    errorMsg(`${lang.notEnough}\n${lang.error}`);
    PPx.Quit(1);
  }

  const args: Args = adjustArgs();

  if (args.method !== 'arg' && args.method !== 'msg') {
    errorMsg(lang.error);
    PPx.Quit(1);
  }

  type Method = keyof typeof errorMethod;
  PPx.Echo(errorMethod[args.method as Method](args));
};

const lang = {
  en: {
    notEnough: 'Not enough arguments',
    error: `
 @arg 0 {string} - Specify method. "arg" | "msg"
 @arg 1 {string} - Path of target script
 @arg 2 {string} - Error message for method 'msg'

 Mothod "arg" displays argument details.
        "msg" displays the error message`
  },
  jp: {
    notEnough: '引数が足りません',
    error: `
 @arg 0 {string} - 実行するメソッド: "arg | "msg"
 @arg 1 {string} - 対象とするスクリプトのパス
 @arg 2 {string} - メソッド"msg"を指定したときに表示するメッセージ

 メソッド "arg" 引数の詳細を表示します
          "msg" エラーメッセージを表示します`
  }
}[useLanguage()];

const errorMsg = (msg: string): void => PPx.Echo(`${scriptName}: ${msg}`);

type Args = {method: string; message: string; name: string; path: string};
const adjustArgs = (args = PPx.Arguments): Args => {
  const arr: string[] = ['arg', '', ''];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args(i);
  }

  const [parent, name] = !~arr[1].indexOf('\\') ? [parentDir, arr[1]] : arr[1].replace(/^(.+)\\(.+)$/, '$1;$2').split(';');
  let path = `${parent}\\${name}`;

  if (/\.js$/.test(path)) {
    path = path.replace(/(dist|\.js$)/g, (_, match: 'dist' | '.js') => {
      return {dist: 'src', '.js': '.ts'}[match];
    });
  }

  return {method: arr[0], message: arr[2], name, path};
};

const errorMethod = {
  arg: (args: Args): string => {
    const arr: string[] = [`${args.name}: ${lang.notEnough}`, ''];
    const rgx = /^\s\*\s(@args?\s.+)$/;
    const [error, data] = readLines({path: args.path});

    if (isError(error, data)) {
      throw new Error(data);
    }

    for (let i = 0, k = data.lines.length; i < k; i++) {
      const thisLine = data.lines[i];

      if (rgx.test(thisLine)) {
        arr.push(thisLine.replace(rgx, '$1'));
      }
    }

    return arr.join(data.nl);
  },

  msg: (args: Args): string => `${args.name}: ${args.message}`
} as const;

if (!debug.jestRun()) main();
// export {lang, errorMethod};
