//!*script
/**
 * Print Error message
 *
 * @version 1.0
 * @arg 0 Specify method. arg
 * @arg 1 Target script path
 */

var script_name = PPx.ScriptName.replace(/^.+\\/, '');

var errorMsg = function (msg) {
  PPx.Echo(script_name + ': ' + msg);
  PPx.Quit(-1);
};

if (PPx.Arguments.length < 2) {
  errorMsg('Not enough arguments\n\n 0 Specify method, arg\n 1 Target script path');
}

var g_args = (function (args) {
  var name = args.item(1).replace(/^.+\\/, '');
  return {
    name: name,
    path: args.Item(1),
    method: args.Item(0)
  };
})(PPx.Arguments);

var method = {};

method['arg'] = function (args) {
  var result = [args.name + ': Not enough arguments\n'];
  var codes = ['\r\n', '\n', '\r'];
  var linefeed = '';

  var lines = (function () {
    var st = PPx.CreateObject('ADODB.stream');
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LoadFromFile(args.path);
    var data = st.ReadText(-1);
    var data_ = data.slice(0, 100);
    st.Close;

    for (var i = 0, l = codes.length; i < l; i++) {
      linefeed = codes[i];

      if (~data_.indexOf(linefeed)) {
        break;
      }
    }

    return data.split(linefeed);
  })();

  var reg = /\s\*\s@arg\s+/;

  for (var i = 0, l = lines.length; i < l; i++) {
    var thisLine = lines[i];

    if (thisLine.indexOf(' * @arg') === 0) {
      result.push(thisLine.replace(reg, ' '));
    }
  }

  return result.join(linefeed);
};

PPx.Echo(method[g_args.method](g_args));
