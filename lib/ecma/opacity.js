//!*script
/**
 * Toggle opacity of the window
 *
 * @arg {number} 0 Specify opacity. If specified "0" rotation opacity
 * @arg {number} 1 Specify high opacity. default=80
 * @arg {number} 2 Specify low opacity. default=60
 */

'use strict';

const g_args = (args = PPx.Arguments) => {
  const arr = [0, 90, 80];

  for (let i = 0, l = args.length; i < l; i++) {
    arr[i] = args.Item(i) | 0;
  }

  return {
    spec: arr[0],
    high: arr[1],
    low: arr[2]
  };
};

const opacity = g_args();
const ppx_id = PPx.Extract('%n#') || PPx.Extract('%n');
const change_opacity = (v) => {
  PPx.Execute(`*customize X_bg:O_${ppx_id}=${v}`);
  PPx.Quit(1);
};

if (opacity.spec !== 0) {
  change_opacity(opacity.spec);
}

const current_opacity = PPx.Extract(`%*getcust(X_bg:O_${ppx_id})`);
/100|^$/.test(current_opacity) && change_opacity(opacity.high);
current_opacity > opacity.low && change_opacity(opacity.low);
change_opacity('');
