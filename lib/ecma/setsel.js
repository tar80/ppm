//!*script
/**
 * Controls the selection of the string
 *
 * @arg 0 Specify a regular expression string. "(before the select string)(select string)"
 * @arg 1 If nonzero, for multiple lines
 */

'use strict';

const item = ((args = PPx.Arguments) => {
  const result = {};
  const len = args.Length;

  if (len === 0) {
    PPx.Execute('*script "%*getcust(S_ppm#global:lib)\\errors.js",arg,' + PPx.ScriptName);
    PPx.Quit(-1);
  }

  const nothing = (match) => {
    if (match === null) {
      PPx.SetPopLineMessage('[ setSel.js: no match. ]');
      PPx.Quit(1);
    }
  };

  const rep = args.item(0);
  const multi = len > 1 ? args.item(1) | 0 : 0;
  result['text'] = PPx.Extract('%*edittext()');

  if (multi === 0) {
    const reg = new RegExp(rep);
    const match = result.text.match(reg);
    nothing(match);
    result['match'] = [match[1], match[2]];
  } else {
    const pos = PPx.Extract('%*editprop(start)');
    const part1 = result['text'].slice(0, pos);
    const part2 = result['text'].slice(pos);
    const reg1 = new RegExp(rep.slice(0, rep.lastIndexOf(')') + 1), 'm');
    const reg2 = new RegExp(rep.slice(rep.lastIndexOf('(')), 'm');
    const match1 = part1.replace(reg1, '$1');
    const match2 = part1.slice(match1.length) + part1.slice(pos) + part2.replace(reg2, '$1');
    result['match'] = [match1, match2];
  }

  return result;
})();

const lparam = item.match[0].length + item.match[1].length;
const wparam = item.match[0].length;
// const wparam = item.match[1] !== '' ? item.text.lastIndexOf(item.match[1]) : item.match[0].length;
PPx.Execute(`*sendmessage %N,177,${wparam},${lparam}`);
PPx.linemessage('');
