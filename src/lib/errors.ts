/* @file Print Error message
 * @arg 0 {string} - Specify method. "arg" | "msg"
 * @arg 1 {string} - Path of target script
 * @arg 2 {string} - Error message for arg(0) method "msg"
 */

import {useLanguage} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {readLines} from '@ppmdev/modules/io.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';
import debug from '@ppmdev/modules/debug.ts';

const {scriptName, parentDir} = pathSelf();

const main = (): void => {
  const [method, path, message] = safeArgs('arg', undefined, '');

  if (!path) {
    errorMsg(`${lang.notEnough}\n${lang.error}`);
    PPx.Quit(1);
  }

  const file = fileDetails(path);

  type Method = keyof typeof errorMethod;
  PPx.Echo(errorMethod[method as Method](file.path, file.name, message));
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
  ja: {
    notEnough: '引数が間違っています',
    error: `
 @arg 0 {string} - 実行するメソッド: "arg | "msg"
 @arg 1 {string} - 対象とするスクリプトのパス
 @arg 2 {string} - メソッド"msg"を指定したときに表示するメッセージ

 メソッド "arg" 引数の詳細を表示します
          "msg" エラーメッセージを表示します`
  }
}[useLanguage()];

const errorMsg = (msg: string): void => PPx.Echo(`${scriptName}: ${msg}`);

const fileDetails = (path: string): {path: string; name: string} => {
  const [parent, name] = !~path.indexOf('\\') ? [parentDir, path] : path.replace(/^(.+)\\(.+)$/, '$1;$2').split(';');
  path = `${parent}\\${name}`;

  if (/^.*[\/\\]dist[\/\\].*\.js$/.test(path)) {
    path = path.replace(/(dist|\.js$)/g, (_, match: 'dist' | '.js') => {
      return {dist: 'src', '.js': '.ts'}[match];
    });
  }

  return {path, name};
};

const errorMethod = {
  arg: (path: string, name: string, _: string): string => {
    const arr: string[] = [`${name}: ${lang.notEnough}`, ''];
    const rgx = /^\s\*\s(@args?\s.+)$/;
    const [error, data] = readLines({path: path});

    if (error) {
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

  msg: (_: string, name: string, message: string): string => `${name}: ${message}`
} as const;

if (!debug.jestRun()) main();
// export {lang, errorMethod};
