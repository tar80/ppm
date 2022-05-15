//!*script
/**
 * String to escape for regular-expression
 *
 * @version 1.0
 * @Return regular-expression of a string
 * @arg 0 Specify notation. bregonig
 * @arg 1 String to process, surround double quotes
 */


var script_name = PPx.scriptName;

var errors = function (method) {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var len = args.length;
  if (len < 2) {
    errors('arg');
  }

  var fmt = {
    bregonig: {
      '^': '\\^',
      '$': '\\$',
      '(': '\\(',
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
  };

  return {
    formats: fmt[args.item(0)],
    string: args.item(1)
  };
})(PPx.Arguments());

PPx.Result = (function (arg) {
  return arg.replace(/./g, function (match) {
    return g_args.formats[match] || match;
  });
})(g_args.string);
