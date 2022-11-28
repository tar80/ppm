//!*script
/**
 * Print usage status of ppm
 *
 * @return Tables
 */

var NL_CHAR = '\r\n';

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

var prop = (function () {
  var result = {};
  var cacheDir = util.getc('S_ppm#global:cache');
  var setupDir = cacheDir + '\\ppm\\setup';
  var plugins = (function () {
    var result = util.getc('S_ppm#plugins').split(NL_CHAR);
    result.splice(0, 1, 'ppx-plugin-manager');

    return result;
  })();
  var linecustCfg = cacheDir + '\\ppm\\unset\\linecust.cfg';
  var reg = /^(\S+)\s*[=,]\s*(.*)$/;
  var del = '@#=#@';

  for (var i = 0, l = plugins.length - 2; i < l; i++) {
    var thisPlugin = plugins[i].split(/\s/)[0];

    if (thisPlugin.indexOf('@') === 0) break;

    var lines = util.readLines(setupDir + '\\' + thisPlugin + '.cfg');

    if (lines.newline !== '') {
      for (var j = 0, k = lines.data.length; j < k; j++) {
        var thisTable = lines.data[j].replace(reg, '$1' + del + '$2').split(del);

        if (thisTable[1] === '{') {
          for (j++; j < k; j++) {
            var thisLine = lines.data[j];
            var thisLine_ = thisLine.replace(reg, '$1' + del + '$2').split(del);

            if (typeof result[thisTable[0]] === 'undefined') {
              result[thisTable[0]] = [];
            }

            if (thisLine_[0].trim().indexOf('}') === 0) {
              break;
            }

            if (/^\S/.test(thisLine_[0])) {
              result[thisTable[0]].push(thisLine_[0].trim() + '\t' + thisPlugin);
            }
          }
        }
      }
    }
  }

  result['linecust'] = (function () {
    var data = [];
    var lines = util.readLines(linecustCfg).data;
    var reg = /^([^=]+)=([^,]+),(.+)/;

    for (var i = 0, l = lines.length; i < l; i++) {
      data.push(lines[i].replace(reg, '$3$2\t$1'));
    }

    return data;
  })();

  return result;
})();

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
