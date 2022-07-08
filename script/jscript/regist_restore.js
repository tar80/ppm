﻿//!*script
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

var g_order = (function (args) {
  var len = args.length;

  if (len === 0) {
    util.error('arg');
  }

  return PPx.Arguments(0);
})(PPx.Arguments());

var g_ppxdef = PPx.Extract('%0%\\PPXDEF.CFG');
var g_lines = util.readLines(g_ppxdef);

var write = function (data, newline) {
  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LineSeparator = util.newline.adodb[newline];
  st.WriteText(data.join(newline), 1);
  st.SaveToFile(g_ppxdef, 2);
  st.Close;
};

var register = {};

register['set'] = function (lines) {
  PPx.SetPopLineMessage('!"Registered');

  if (~lines.data.indexOf(';[ppm]')) {
    PPx.Quit(1);
  }

  var ppm_dir = util.getc('S_ppm#global:ppm');
  var home_dir = util.getc('S_ppm#global:home');
  var text = [
    ';[ppm]',
    '_Command = {',
    'ppmRestore = *script "' + ppm_dir + '\\script\\jscript\\restore.js","' + home_dir + '"',
    '}',
    ';[endppm]'
  ];

  write(lines.data.concat(text), lines.newline);
};

register['unset'] = function (lines) {
  var result = [];
  var thisLine;
  var range = {
    start: ';[ppm]',
    end: ';[endppm]'
  };

  PPx.SetPopLineMessage('!"Unregistered');

  if (!~lines.data.indexOf(range.start)) {
    PPx.Quit(1);
  }

  for (var i = 0, l = lines.data.length; i < l; i++) {
    thisLine = lines.data[i];

    if (~thisLine.indexOf(range.start)) {
      for (var j = i + 1; j < l; j++) {
        thisLine = lines.data[j];
        i = j;

        if (~thisLine.indexOf(range.end)) {
          break;
        }
      }

      continue;
    }

    result.push(thisLine);
  }

  write(result, lines.newline);
};

register[g_order](g_lines);
