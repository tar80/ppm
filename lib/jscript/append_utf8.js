//!*script
/**
 * Append lines an UTF8 encoding file
 *
 * @version 1.0
 * @arg {string} 0  Target file path
 * @arg {string} 1  Newline code. lf(unix) | cr(mac) | crlf(dos) | match(match file newline)
 * @arg {number} 2  If nonzero ignore blank lines at end of file
 * @arg {string} 3+ Comma separated text-lines
 * NOTE: If arg 3 specify "FDC", expand %#FDC
 */

/* Import modules */
var st = PPx.CreateObject('ADODB.stream');
var module = function (filepath) {
  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(filepath);
  const data = st.ReadText(-1);
  st.Close;

  return Function(' return ' + data)();
};

// Load modules
var util = module(PPx.Extract('%*getcust(S_ppm#global:module)\\util.js'));
module = null;

var g_args = function (args) {
  var arr = ['', 'crlf', '0', ''];
  var len = args.length;

  if (len < 4) {
    util.error('arg');
  }

  for (var i = 0; i < 4; i++) {
    arr[i] = args.Item(i);
  }

  var newline = {
    lf: '\n',
    cf: '\r',
    crlf: '\r\n',
    unix: '\n',
    mac: '\r',
    dos: '\r\n',
    match: ''
  };

  var data = [];

  if (args.length === 4 && arr[2] === 'FDC') {
    data = PPx.Extract('%#;FDC').split(';');
  } else {
    for (var i = 3; i < len; i++) {
      data.push(args.item(i));
    }
  }

  return {
    filepath: arr[0],
    newline: newline[arr[1]],
    ignoreblank: arr[2] !== '0',
    data: data
  };
};

var append = g_args(PPx.Arguments);
var lines = util.readLines(append.filepath, append.newline);

util.append.apply({filepath: append.filepath, newline: lines.newline, ignoreblank: append.ignoreblank}, append.data);

