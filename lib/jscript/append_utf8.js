//!*script
/**
 * Append an UTF8 encoded file
 *
 * @version 1.0
 * @arg 0  Target file path
 * @arg 1  If nonzero ignore blank line at The end of line
 * @arg 2+ Comma separated text-lines
 * NOTE: If arg 2 specify "FDC", expand %#FDC
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

  var path = args.item(0);

  if (
    !~path.indexOf(PPx.Extract('%*getcust(S_ppm#global:cache)')) &&
    !~path.indexOf(PPx.Extract("%'temp'"))
  ) {
    PPx.Execute('%"ppx-plugin-manager"%I"Error: Not ppm management file%bn%bn' + path + '"');
    PPx.Quit(-1);
  }

  var array = (function () {
    var result = [];

    if (args.length === 3 && args.item(2) === 'FDC') {
      return PPx.Extract('%#;FDC').split(';');
    }

    for (var i = 2; i < len; i++) {
      result.push(args.item(i));
    }

    return result;
  })();

  return {
    filepath: path,
    blankline: args.item(1) !== '0' ? 'ignore' : 'asis',
    data: array
  };
})(PPx.Arguments());

var st = PPx.CreateObject('ADODB.stream');
var result = function (args, callback) {
  var data, data_;
  var linefeed = '';
  var codes = ['\r\n', '\n', '\r'];

  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(args.filepath);
  data = st.ReadText(-1);
  data_ = data.slice(0, 120);

  for (var i = 0, l = codes.length; i < l; i++) {
    linefeed = codes[i];
    if (~data_.indexOf(linefeed)) {
      break;
    }
  }

  callback[args.blankline](data.split(linefeed), args, linefeed);

  st.SetEOS;
  st.WriteText(args.data.join(linefeed), 1);
  st.SaveToFile(args.filepath, 2);
  st.Close;
};

var method = {};

method['asis'] = function (_lines, _args, _linefeed) {
  return (st.Position = st.Size);
};

method['ignore'] = function (lines, args, linefeed) {
  var baseByte = linefeed === '\r\n' ? 2 : 1;
  var omitByte = -baseByte;

  for (var i = lines.length; i--; ) {
    if (lines[i] !== '') {
      if (lines.length - 1 === i) {
        omitByte = 0;
        args.data = linefeed + args.data;
      }

      break;
    }

    omitByte = omitByte + baseByte;
  }

  return (st.Position = st.Size - omitByte);
};

PPx.Result = result(g_args, method);
