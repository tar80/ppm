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

  var newline = {
    lf: {chr: '\n', ad: '10'},
    cf: {chr: '\r', ad: '13'},
    crlf: {chr: '\r\n', ad: '-1'},
    unix: {chr: '\n', ad: '10'},
    mac: {chr: '\r', ad: '13'},
    dos: {chr: '\r\n', ad: '-1'}
  };

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
    newline: newline[args.item(1)],
    data: array
  };
})(PPx.Arguments());

var st = PPx.CreateObject('ADODB.stream');
st.Open;
st.Type = 2;
st.Charset = 'UTF-8';
st.LineSeparator = g_args.newline.ad;
st.WriteText(g_args.data.join(g_args.newline.chr), 1);
st.SaveToFile(g_args.filepath, 2);
st.Close;
