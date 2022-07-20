//!*script
/**
 * Write out an UTF8 encoding file
 *
 * @version 1.0
 * @arg 0  Target file path
 * @arg 1  Newline code. lf(unix) | cr(mac) | crlf(dos)
 * @arg 2+ Comma separated text-lines
 * NOTE: If arg 2 specify "FDC", expand %#FDC
 */

'use strict';

const script_name = PPx.scriptName;

const errors = (method) => {
  PPx.Execute(`*script "%*name(D,"${script_name}")\\errors.js",${method},${script_name}`);
  PPx.Quit(-1);
};

const g_args = ((args = PPx.Arguments) => {
  const len = args.length;

  if (len < 3) {
    errors('arg');
  }

  const path = args.Item(0);

  if (
    !~path.indexOf(PPx.Extract('%*getcust(S_ppm#global:cache)')) &&
    !~path.indexOf(PPx.Extract("%'temp'"))
  ) {
    PPx.Execute('%"ppx-plugin-manager"%I"Error: Not ppm management file%bn%bn' + path + '"');
    PPx.Quit(-1);
  }

  const newline = {
    lf: {chr: '\n', ad: '10'},
    cf: {chr: '\r', ad: '13'},
    crlf: {chr: '\r\n', ad: '-1'},
    unix: {chr: '\n', ad: '10'},
    mac: {chr: '\r', ad: '13'},
    dos: {chr: '\r\n', ad: '-1'}
  };

  const array = (() => {
    const result = [];

    if (args.length === 3 && args.Item(2) === 'FDC') {
      return PPx.Extract('%#;FDC').split(';');
    }

    for (let i = 2; i < len; i++) {
      result.push(args.Item(i));
    }

    return result;
  })();

  return {
    filepath: path,
    newline: newline[args.Item(1)],
    data: array
  };
})();

const st = PPx.CreateObject('ADODB.stream');
st.Open;
st.Type = 2;
st.Charset = 'UTF-8';
st.LineSeparator = g_args.newline.ad;
st.WriteText(g_args.data.join(g_args.newline.chr), 1);
st.SaveToFile(g_args.filepath, 2);
st.Close;
