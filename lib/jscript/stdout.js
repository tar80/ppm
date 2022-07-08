//!*script
// deno-lint-ignore-file no-var
/**
 * Get standard output
 *
 * @version 1.0
 * @return Stdout
 * @arg 0 Working directory
 * @arg 1 External command
 * @arg 2 If nonzero output with utf8 encoding
 * NOTE: Limit on the number of characters is about 1000 characters
 */

var script_name = PPx.scriptName;

var errors = function (method) {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var encoding = '';
  var len = args.length;

  if (len < 2) {
    errors('arg');
  }

  if (args.length > 1) {
    encoding = args.item(2) === '1' ? '-utf8' : encoding;
  }

  return {
    wd: args.item(0),
    cmd: args.item(1),
    enc: encoding
  };
})(PPx.Arguments());

PPx.Result = (function (args) {
  PPx.Execute(
    '*run -noppb -hide -d:' + args.wd + ' ' +
      args.cmd +
      ' | %0pptrayw -c *string u,stdout=%%*stdin(' +
      args.enc +
      ') %&'
  );
  var stdout = PPx.Extract('%*getcust(_User:stdout)');
  PPx.Execute('*deletecust _User:stdout');

  return stdout;
})(g_args);
