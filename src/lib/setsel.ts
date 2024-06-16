/* @file Controls string selection
 * @arg 0 {string} - RegExp. "(<before the select string>)(<select string>)"
 * @arg 1 {number} - If non-zero, enable multiple lines
 * @arg 2 {string} - Specify "1" to maintain the running state
 */

import {isEmptyStr, isNonZero} from '@ppmdev/modules/guard.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import debug from '@ppmdev/modules/debug.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';

const main = (): void => {
  const [rgx, multi, staymode] = safeArgs('', '0', '');

  if (isEmptyStr(rgx) || rgx.split(')').length < 3) {
    const {scriptName, parentDir} = pathSelf();
    PPx.Execute(`*script "${parentDir}\\errors.js",arg,${scriptName}`);
    PPx.Quit(-1);
  }

  if (staymode === '1') {
    PPx.StayMode = 2;
  }

  ppx_resume(rgx, multi);

  // const NOTIFICATION = `[Failed] Could not get selection.`;
  // !param || param.w === param.l
  //   ? PPx.linemessage(NOTIFICATION)
  //   : PPx.Execute(`*sendmessage %N,177,${param.w},${param.l}`);
};

const ppx_resume = (rgx: string, multi: string): void => {
  const text = PPx.Extract('%*edittext()');
  const param: Param | void = isNonZero(multi) ? selectMulti(text, rgx) : selectSingle(text, rgx);
  param && param.w !== param.l && PPx.Execute(`*sendmessage %N,177,${param.w},${param.l}`);
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
