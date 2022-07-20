//!*script
// deno-lint-ignore-file no-var
/**
 * Print message in PPe
 *
 * @version 1.0
 * @arg 0  PPe processing method, ppe | edit
 * @arg 1  Linefeed-code. lf | cr | crlf
 * @arg 2  PPe title
 * @arg 3+ Comma separated text-lines
 */

var script_name = PPx.scriptName;

var errors = function (method) {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var len = args.length;

  if (len < 3) {
    errors('arg');
  }

  var linefeed = {
    lf: '%%bl',
    cf: '%%br',
    crlf: '%%bn',
    unix: '%%bl',
    mac: '%%br',
    dos: '%%bn'
  };
  var array = [];

  for (var i = 3; i < len; i++) {
    array.push(args.item(i));
  }

  return {
    cmd: '*' + args.item(0),
    code: args.item(1),
    title: args.item(2),
    msg: array.join(linefeed[args.item(1)])
  };
})(PPx.Arguments);

PPx.Execute(
  g_args.cmd +
    ' -utf8bom -' +
    g_args.code +
    ' -k *editmode -modify:silent -modify:readonly %%: *setcaption ' +
    g_args.title +
    '%%: *insert ' +
    g_args.msg
);
