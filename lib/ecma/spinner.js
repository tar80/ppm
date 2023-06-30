//!*script
/**
 * Spinner
 *
 * @desc Show spinner in status-line while PPx.getValue('spin') returns '1'.
 * @arg {string} 0 - Target PPx ID
 * @arg {string} 1 - Specify cycle of spin. default=300ms
 * @arg {string} 2 - Specify limit of spin. default=6000ms
 * @arg {string} 3 - Specify type of spinner. default=dot
 */

'use strict';

const spinner = {
  dot: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
};

const adjust_arg = (args = PPx.Arguments) => {
  const arr = ['C', 300, 6000, 'dot'];

  for (let i = 0, l = args.length; i < l; i++) {
    arr[i] = args.Item(i);
  }

  return {
    ppxid: arr[0],
    cycle: Number(arr[1]),
    limit: Number(arr[2]),
    spinner: spinner[arr[3]]
  };
};
const show_spinner = (id, mark) => PPx.Execute(`*execute ${id},*linemessage !"${mark}`);
const spinning = (args, spin_len) => {
  let total = 0;
  let i = 0;

  PPx.Execute(`*execute ${args.ppxid},*string i,spin=1`);

  while (PPx.Extract(`%*extract(${args.ppxid},%%si"spin")`)) {
    show_spinner(args.ppxid, args.spinner[i]);

    i++;

    if (i >= spin_len) {
      i = 0;
    }

    PPx.Execute(`*wait ${args.cycle},2`);
    total = total + args.cycle;

    if (total >= args.limit) {
      break;
    }
  }

  show_spinner(args.ppxid, '');
};

const g_arg = adjust_arg();
spinning(g_arg, g_arg.spinner.length);
