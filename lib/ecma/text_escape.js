//!*script
/**
 * Escapes text in selection or editing range
 *
 * @return {string} Input string
 * @arg 0 Complete match charactors. 0:double quote | 1:double quote & parcent
 * @arg 1 Target text range. s:selecttext() | e:edittext()
 */

'use strict';

const script_name = PPx.scriptName;

const errors = (method) => {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

const g_args = ((args) => {
  const len = args.length;
  if (len < 1) {
    errors('arg');
  }

  const rep = {
    0: [/"/g, {'"': '""'}],
    1: [/["%"]/g, {'"': '""', '%': '%%'}]
  }[args.item(0)];

  const text = {
    s: PPx.Extract('%*selecttext()'),
    e: PPx.Extract('%*edittext()')
  }[args.item(1)];

  if (rep === undefined || text === undefined) {
    errors('arg');
  }

  return {
    rep: rep,
    text: text
  };
})(PPx.Arguments());

PPx.Result = g_args.text.replace(g_args.rep[0], (c) => g_args.rep[1][c]);
