//!*script
// deno-lint-ignore-file no-var
/**
 * Registration of *ppmRestore
 *
 * @arg 0 Selection of process. set | unset
 */

/* Initial */
// Read module
var st = PPx.CreateObject('ADODB.stream');
var module = function (filepath) {
  var data;

  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(filepath);
  data = st.ReadText(-1);
  st.Close;

  return Function(' return ' + data)();
};

// Load module
var util = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\util.js'));
module = null;

var RANGE_START = ';[ppm]';
var RANGE_END = ';[endppm]';
var g_process = PPx.Arguments.length === 0 ? util.error('arg') : PPx.Arguments.Item(0);
var g_ppxdef = PPx.Extract('%0%\\PPXDEF.CFG');
var g_lines = util.readLines(g_ppxdef);

var write = function (data, newline) {
  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LineSeparator = util.metaNewline.ansi[newline];
  st.WriteText(data.join(newline), 1);
  st.SaveToFile(g_ppxdef, 2);
  st.Close;
};

({
  set: function (lines) {
    PPx.SetPopLineMessage('!"Registered');

    if (~lines.data.indexOf(RANGE_START)) {
      PPx.Quit(1);
    }

    var ppm_dir = util.getc('S_ppm#global:ppm');
    var home_dir = util.getc('S_ppm#global:home');
    var restoreCmd = [
      RANGE_START,
      '_Command = {',
      'ppmRestore = *script "' + ppm_dir + '\\script\\jscript\\restore.js","' + home_dir + '"',
      '}',
      RANGE_END
    ];

    write(lines.data.concat(restoreCmd), lines.newline);
  },
  unset: function (lines) {
    var result = [];
    var thisLine;

    PPx.SetPopLineMessage('!"Un-registered');

    if (!~lines.data.indexOf(RANGE_START)) {
      PPx.Quit(1);
    }

    for (var i = 0, l = lines.data.length; i < l; i++) {
      thisLine = lines.data[i];

      if (~thisLine.indexOf(RANGE_START)) {
        for (var j = i + 1; j < l; j++) {
          thisLine = lines.data[j];
          i = j;

          if (~thisLine.indexOf(RANGE_END)) {
            break;
          }
        }

        continue;
      }

      result.push(thisLine);
    }

    write(result, lines.newline);
  }
}[g_process](g_lines));
