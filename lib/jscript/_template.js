//!*script
/**
 * Description
 *
 * @version 1.0
 * @arg 0
 */

var script_name = PPx.scriptName;

var errors = function (method) {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var len = args.length;

  if (len < n) {
    errors('arg');
  }

  return;
})(PPx.Arguments());

