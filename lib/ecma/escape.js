//!*script
/**
 * String to escape
 *
 * @version 1.0
 * @Return regular-expression of a string
 * @return {string} Input string
 * @arg 0 Specify notation. esc | nor | q | qp
 * @arg 1 Target text range. a:arguments(2) | s:selecttext() | e:edittext()
 * @arg 2 String to process, surround double quotes
 */

const script_name = PPx.scriptName;

const errors = (method) => {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

const g_args = ((args = PPx.Arguments()) => {
  const len = args.length;
  if (len < 2) {
    errors('arg');
  }

  const fmt = {
    esc: [
      /./g,
      {
        '^': '\\^',
        '$': '\\$',
        '(': '\\(',
        ')': '\\)',
        '[': '\\[',
        '|': '\\|',
        '=': '\\=',
        '*': '\\*',
        '+': '\\+',
        '?': '\\?',
        '.': '\\.',
        '/': '\\/',
        '\\': '\\\\'
      }
    ],
    nor: [
      /\\./g,
      {
        '\\^': '^',
        '\\$': '$',
        '\\(': '(',
        '\\)': ')',
        '\\[': '[',
        '\\]': ']',
        '\\|': '|',
        '\\=': '=',
        '\\*': '*',
        '\\+': '+',
        '\\?': '?',
        '\\.': '.',
        '\\/': '/',
        '\\s': ' ',
        '\\t': '\t',
        '\\\\': '\\'
      }
    ],
    q: [/"/g, {'"': '""'}],
    qp: [/["%]/g, {'"': '""', '%': '%%'}]
  };

  const argString = len > 2 ? args.item(2) : '';

  const text = {
    a: argString,
    s: PPx.Extract('%*selecttext()'),
    e: PPx.Extract('%*edittext()')
  }[args.item(1)];

  if (typeof fmt === 'undefined' || typeof text === 'undefined') {
    errors('arg');
  }

  return {
    rep: fmt[args.item(0)],
    text: text
  };
})();

PPx.Result = g_args.text.replace(g_args.rep[0], (match) => g_args.rep[1][match]);
