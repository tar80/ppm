//!*script
// deno-lint-ignore-file no-var
/**
 * Read a utf8 encoded file
 *
 * @version
 * @return Method execution result
 * @arg 0  Target file path
 * @arg 1  Specify method. read | exists
 * @arg 2+ Comma separated method arguments
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

  var array = [];
  for (var i = 2; i < len; i++) {
    array.push(args.item(i));
  }

  return {
    filepath: PPx.Arguments(0),
    method: PPx.Arguments(1),
    methodArg: array
  };
})(PPx.Arguments);

var result = function (args, callback) {
  var fso = PPx.CreateObject('Scripting.FileSystemObject');

  if (!fso.FileExists(args.filepath)) {
    return '';
  }

  fso = null;

  var st = PPx.CreateObject('ADODB.stream');
  var data, data_;
  var linefeed = '';
  var codes = ['\r\n', '\n', '\r'];

  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(args.filepath);
  data = st.ReadText(-1);
  data_ = data.slice(0, 100);
  st.Close;

  for (var i = 0, l = codes.length; i < l; i++) {
    linefeed = codes[i];
    if (~data_.indexOf(linefeed)) {
      break;
    }
  }

  return callback[args.method](data.split(linefeed), args);
};

var method = {};

/**
 * Comma-separated lines
 *
 * @return {string}
 */
method['read'] = function (lines, _args) {
  return lines;
};

/**
 * Whether searchString exists
 *
 * @return {boolean}
 */
method['exists'] = function (lines, args) {
  for (var i = 0, l = lines.length; i < l; i++) {
    var thisLine = lines[i];
    if (~thisLine.indexOf(args.methodArg)) {
      return true;
    }
  }

  return false;
};

PPx.Result = result(g_args, method);
