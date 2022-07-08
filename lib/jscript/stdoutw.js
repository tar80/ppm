//!*script
// deno-lint-ignore-file no-var
/**
 * Export and read standard output
 *
 * @version 1.0
 * @return Stdout
 * @arg 0 Working directory
 * @arg 1 External command
 */

var script_name = PPx.scriptName;

var errors = function (method) {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var len = args.length;

  if (len < 2) {
    errors('arg');
  }

  return {
    wd: args.item(0),
    cmd: args.item(1)
  };
})(PPx.Arguments());

PPx.Result = (function (args) {
  var path = PPx.Extract('%*temp()%\\stdout.txt');
  PPx.Execute('*run -noppb -hide -d:' + args.wd + ' ' + args.cmd + '>' + path + ' %&');

  var st = PPx.CreateObject('ADODB.stream');
  var stdout = '';

  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(path);
  stdout = st.ReadText(-1);
  st.Close;

  return stdout;
})(g_args);
