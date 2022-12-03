//!*script
/**
 * Toggle specified columns of entry list
 *
 * @version 1.0
 * @arg {string} 0 Target columns in JSON format. "{"number of column": "format of viewstyle"}"
 */

var script_name = PPx.scriptName;

var errors = function (method, msg) {
  PPx.Execute(
    '*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name + ',' + msg
  );
  PPx.Quit(-1);
};

if (PPx.Arguments.length === 0) {
  errors('arg');
}

var shape_array = function (arr) {
  for (var l = arr.length; l--; ) {
    arr[l] === '' && arr.splice(l, 1);
  }

  return arr;
};

var toggle_styles = (function (v) {
  var ele = v.split(',');
  var reg = /^\s*"(.+)":\s"(.+)"/;
  var obj = {};

  for (var i = 1, l = ele.length; i < l; i++) {
    var m = ele[i].match(reg);
    obj[m[1]] = m[2];
  }

  return obj;
})(PPx.Arguments.Item(0));
var current_style = shape_array(PPx.Extract('%*viewstyle').split(' '));
var thisColumn;

for (var [column, style] of Object.entries(toggle_styles)) {
  thisColumn = Number(column);

  if (typeof current_style[thisColumn] === 'undefined') {
    continue;
  }

  current_style[thisColumn] === style
    ? (current_style[thisColumn] = '')
    : current_style.splice(thisColumn, 0, style);
}

var new_style = shape_array(current_style);

PPx.Execute('*viewstyle format "' + new_style.join(' ') + '"');
