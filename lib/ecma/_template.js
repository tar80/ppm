//!*script
/**
 * Description
 *
 * @version 1.0
 * @arg 0
 */

'use strict';

const script_name = PPx.ScriptName.replace(/^.*\\/, '');

const errors = (method) => {
  PPx.Execute(`*script "%*name(D,"${script_name}")\\errors.js",${method},${script_name}`);
  PPx.Quit(-1);
};

const g_args = ((args = PPx.Arguments()) => {
  const len = args.length;

  if (len < n) {
    errors('arg');
  }

  return;
})();
