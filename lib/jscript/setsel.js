//!*script
/**
 * Operate the selection of strings during editing
 *
 * @arg 0 Specify a regular expression string. "(before the select string)(select string)"
 * @arg 1 If nonzero, for multiple lines
 */

var item = (function (args) {
  var result = {};
  var len = args.length;

  if (len === 0) {
    PPx.Execute('*script "%*getcust(S_ppm#global:lib)\\errors.js",arg,' + PPx.ScriptName);
    PPx.Quit(-1);
  }

  var nothing = function (match) {
    if (match === null) {
      PPx.SetPopLineMessage('[ setSel.js: no match. ]');
      PPx.Quit(1);
    }
  };

  var rep = args.item(0);
  var multi = len > 1 ? args.item(1) | 0 : 0;
  result['text'] = PPx.Extract('%*edittext()');

  if (multi === 0) {
    var reg = new RegExp(rep);
    var match = result.text.match(reg);
    nothing(match);
    result['match'] = [match[1], match[2]];
  } else {
    var pos = PPx.Extract('%*editprop(start)');
    var part1 = result['text'].slice(0, pos);
    var part2 = result['text'].slice(pos);
    var reg1 = new RegExp(rep.slice(0, rep.lastIndexOf(')') + 1), 'm');
    var reg2 = new RegExp(rep.slice(rep.lastIndexOf('(')), 'm');
    var match1 = part1.replace(reg1, '$1');
    var match2 = part1.slice(match1.length) + part1.slice(pos) + part2.replace(reg2, '$1');
    result['match'] = [match1, match2];
  }

  return result;
})(PPx.Arguments);

var lparam = item.match[0].length + item.match[1].length;
var wparam = item.match[0].length;
PPx.Execute('*sendmessage %N,177,' + wparam + ',' + lparam);
