//!*script
/**
 * Escape the result of input
 *
 * @return {string} Input string
 * @arg 0 Escape the specified characters, 0:double quote | 1:double quote & parcent
 * @arg 1 Initial input string
 * @arg 2 Input bar title
 * @arg 3 Reference history type
 * @arg 4 Range of select string
 * @arg 5 Post command-line
 * NOTE: If the initial input string contained double-quote or parcent,
 *        then should escape these charactors. The number of characters is
 *        4 for double quotes and 2 percent.like """"%%FDC""""
 */

'use strict';

const script_name = PPx.scriptName;

const errors = (method) => {
  PPx.Execute(`*script "%*name(D,"${script_name}")\\errors.js",${method},${script_name}`);
  PPx.Quit(-1);
};

const g_args = ((args = PPx.Arguments()) => {
  const len = args.length;

  if (len < 2) {
    errors('arg');
  }

  const reg = {
    0: [/"/g, {'"': '""'}],
    1: [/["%]/g, {'"': '""', '%': '%%'}]
  };
  const title = 'Input.js';
  const mode = 'g';
  const select = 'a';
  const postcmd = '';

  return {
    rep: reg[args.item(0)],
    text: args.item(1) || '',
    title: args.item(2) || title,
    mode: args.item(3) || mode,
    select: args.item(4) || select,
    postcmd: len > 5 ? ` -k %(${args.item(5)}%)` : postcmd
  };
})(PPx.Arguments());

PPx.Result = ((args) => {
  const text =
    PPx.Extract(
      `%*input("%(${args.text}%)" -title:"${args.title}" -mode:${args.mode} -select:${args.select}${args.postcmd})`
    ) || PPx.Quit(-1);

  return text.replace(args.rep[0], (c) => args.rep[1][c]);
})(g_args);
