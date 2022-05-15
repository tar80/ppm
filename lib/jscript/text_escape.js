//!*script
/**
 * Escapes text in selection or editing range
 *
 * @return {string} Input string
 * @arg 0 Complete match charactors. 0:double quote | 1:double quote & parcent
 * @arg 1 Target text range. s:selecttext() | e:edittext()
 */

var script_name = PPx.scriptName;

var errors = function (method) {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var len = args.length;
  if (len < 1) {
    errors('arg');
  }

  var rep = {
    0: [/"/g, {'"': '""'}],
    1: [/["%"]/g, {'"': '""', '%': '%%'}]
  }[args.item(0)];

  var text = {
    s: PPx.Extract('%*selecttext()'),
    e: PPx.Extract('%*edittext()')
  }[args.item(1)];

  if (typeof rep === 'undefined' || typeof text === 'undefined') {
    errors('arg');
  }

  return {
    rep: rep,
    text: text
  };
})(PPx.Arguments());

PPx.Result = g_args.text.replace(g_args.rep[0], function (c) {
  return g_args.rep[1][c];
});
