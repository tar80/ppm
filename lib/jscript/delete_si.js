//!*script
/**
 * Delete special-environment-variables "i" specified by arguments
 *
 * @version 1.0
 * @arg 0 Linecust label
 * @arg 1+ Target variable-si
 */

var g_args = (function (args) {
  var len = args.length;

  if (len < 2) {
    PPx.SetPopLineMessage('[ delete_si.js: not enough arguments ]');
    PPx.Quit(-1);
  }

  var si = [];

  for (var i = 1; i < len; i++) {
    si.push('*string i,' + PPx.Arguments(i) + '=%%:');
  }

  return {
    label: args.item(0),
    item: si.join('')
  };
})(PPx.Arguments());

PPx.Execute(
  '*linecust ' +
    g_args.label +
    ',' +
    'KC_main:ACTIVEEVENT,' +
    g_args.item +
    ' *linecust ' +
    g_args.label +
    ',KC_main:ACTIVEEVENT,'
);
PPx.Execute('%K"@LOADCUST"');
