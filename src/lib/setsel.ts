/* @file Controls string selection
 * @arg 0 {string} - RegExp. "(<before the select string>)(<select string>)"
 * @arg 1 {number} - If non-zero, enable multiple lines
 */

import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import debug from '@ppmdev/modules/debug.ts';

const main = (): void => {
  const {scriptName, parentDir} = pathSelf();
  const args = adjustArgs();

  if (isEmptyStr(args.rgx) || args.rgx.split(')').length < 3) {
    PPx.Execute(`*script "${parentDir}\\errors.js",arg,${scriptName}`);
    PPx.Quit(-1);
  }

  const text = PPx.Extract('%*edittext()');
  const param: Param | void = args.multi ? selectMulti(text, args.rgx) : selectSingle(text, args.rgx);
  param && param.w !== param.l && PPx.Execute(`*sendmessage %N,177,${param.w},${param.l}`);

  // const NOTIFICATION = `[Failed] Could not get selection.`;
  // !param || param.w === param.l
  //   ? PPx.linemessage(NOTIFICATION)
  //   : PPx.Execute(`*sendmessage %N,177,${param.w},${param.l}`);
};

const adjustArgs = (args = PPx.Arguments): {rgx: string; multi: boolean} => {
  const arr: string[] = ['', '0'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  return {rgx: arr[0], multi: arr[1] !== '0'};
};

type Param = {w: number; l: number};
const selectSingle = (text: string, rgxstr: string): Param | void => {
  const rgx = RegExp(rgxstr);
  const match = text.match(rgx);

  if (!match) {
    return;
  }

  const w = match[1].length;

  return {w, l: w + match[2].length};
};

const selectMulti = (text: string, rgxstr: string): Param => {
  const cursorPos = Number(PPx.Extract('%*editprop(start)'));
  const preStr = text.slice(0, cursorPos);
  const postStr = text.slice(cursorPos);
  const rgxPre = RegExp(rgxstr.slice(0, rgxstr.lastIndexOf(')') + 1), 'm');
  const rgxPost = RegExp(rgxstr.slice(rgxstr.lastIndexOf('(')), 'm');
  let match = false;
  const matchPre = preStr.replace(rgxPre, (_: string, m: string) => {
    match = true;
    return m;
  }).length;
  const w = !match && matchPre === cursorPos ? 0 : matchPre;
  const l = cursorPos + postStr.replace(rgxPost, '$1').length;

  return {w, l};
};

if (!debug.jestRun()) main();
// export {selectSingle, selectMulti};
