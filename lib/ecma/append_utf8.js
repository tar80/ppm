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

'use strict';

/* Import modules */
const st = PPx.CreateObject('ADODB.stream');
let module = function (filepath) {
  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(filepath);
  const data = st.ReadText(-1);
  st.Close;

  return Function(' return ' + data)();
};

// Load modules
const util = module(PPx.Extract('%*getcust(S_ppm#global:module)\\util.js'));
module = null;

const g_args = (args = PPx.Arguments) => {
  const arr = ['', 'crlf', '0', ''];
  const len = args.length;

  if (len < 4) {
    util.error('arg');
  }

  for (let i = 0; i < 4; i++) {
    arr[i] = args.Item(i);
  }

  const newline = {
    lf: '\n',
    cf: '\r',
    crlf: '\r\n',
    unix: '\n',
    mac: '\r',
    dos: '\r\n',
    match: ''
  };

  let data = [];

  if (args.length === 4 && arr[2] === 'FDC') {
    data = PPx.Extract('%#;FDC').split(';');
  } else {
    for (let i = 3; i < len; i++) {
      data.push(args.Item(i));
    }
  }

  return {
    filepath: arr[0],
    newline: newline[arr[1]],
    ignoreblank: arr[2] !== '0',
    data: data
  };
};

const append = g_args();
const lines = util.readLines(append.filepath, append.newline);

util.append.apply({filepath: append.filepath, newline: lines.newline, ignoreblank: append.ignoreblank}, append.data);

