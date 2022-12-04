//!*script
/**
 * Toggle specified columns of entry list
 *
 * @version 1.1
 * @arg {string} 0 Target columns in JSON format. "{"number of column": "format of viewstyle"}"
 */

'use strict';

const script_name = PPx.scriptName;

const errors = (method, msg) => {
  PPx.Execute(`*script "%*name(D,"${script_name}")\\errors.js",${method},${script_name},${msg}`);
  PPx.Quit(-1);
};

if (PPx.Arguments.length === 0) {
  errors('arg');
}

const shape_array = (arr) => {
  for (let l = arr.length; l--; ) {
    arr[l] === '' && arr.splice(l, 1);
  }

  return arr;
};

const toggle_styles = JSON.parse(PPx.Arguments.Item(0));
const current_style = shape_array(PPx.Extract('%*viewstyle').split(' '));
let thisColumn;

for (const [column, style] of Object.entries(toggle_styles)) {
  thisColumn = Number(column);

  if (typeof current_style[thisColumn] === 'undefined') {
    continue;
  }

  current_style[thisColumn] === style
    ? (current_style[thisColumn] = '')
    : current_style.splice(thisColumn, 0, style);
}

const new_style = shape_array(current_style);

PPx.Execute(`*viewstyle -temp format "${new_style.join(' ')}"`);
