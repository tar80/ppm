//!*script
// deno-lint-ignore-file no-var
/**
 * Print usage status of ppm
 *
 * @return Tables
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

var g_ppm = (function () {
  var cache = util.getc('S_ppm#global:cache');
  return {
    currentSet: util.getc('S_ppm#global:plugins').split(','),
    setup: cache + '\\ppm\\setup\\',
    linecust: cache + '\\ppm\\unset\\linecust.cfg'
  };
})();

var prop = (function (v) {
  var result = {};
  var lines = {};
  var thisPlugin, thisFile, thisLine, thisLine_;
  var plugins = v.currentSet;
  var skip = false;
  var reg = /^([^\s]*_\S+)\s?=\s?({)$/;

  for (var i = 0, l = plugins.length; i < l; i++) {
    thisFile = v.setup + plugins[i] + '.cfg';
    lines = util.readLines(thisFile);

    if (lines.newline !== '') {
      for (var j = 0, k = lines.data.length; j < k; j++) {
        thisLine = lines.data[j];

        if (thisLine.indexOf('}') === 0) {
          skip = false;
          continue;
        }

        if (skip === true) {
          if (/^\S/.test(thisLine)) {
            result[thisLine_[0]].push(thisLine.replace(/^(\S+).+/, '$1\t' + thisPlugin));
          }
          continue;
        }

        thisLine_ = thisLine.replace(reg, '$1,$2').split(',');

        if (thisLine_[1] === '{') {
          skip = true;
          thisPlugin = plugins[i];

          if (typeof result[thisLine_[0]] === 'undefined') {
            result[thisLine_[0]] = [];
          }
        }
      }
    }
  }

  result['linecust'] = (function () {
    var result = [];
    var lines = util.readLines(v.linecust).data;
    var reg = /^([^=]+)=([^,]+),(.+)/;

    for (var i = 0, l = lines.length; i < l; i++) {
      result.push(lines[i].replace(reg, '$3$2\t$1'));
    }

    return result;
  })();

  return result;
})(g_ppm);

/* Print using information */
var output = [];
for (var item in prop) {
  if (Object.prototype.hasOwnProperty.call(prop, item)) {
    output.push('[' + item + ']');
    [].push.apply(output, prop[item]);
    output.push('');
  }
}

util.printw.apply({cmd: 'ppe', title: 'USING INFORMATION RESULT', tab: 30}, output);
