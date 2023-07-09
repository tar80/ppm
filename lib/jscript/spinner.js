//!*script
/**
 * Spinner (inspired by fidget.nvim)
 *
 * @desc Show spinner in status-line while PPx.getValue('spin') returns '1'.
 * @arg {string} 0 - Target PPx ID
 * @arg {string} 1 - Specify cycle of spin. default=300ms
 * @arg {string} 2 - Specify limit of spin. default=6000ms
 * @arg {string} 3 - Specify type of spinner. default=dot
 */

var spinner = {
  dot: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
};

var adjust_arg = function(args) {
  var arr = ['C', 300, 6000, 'dot'];

  for (var i = 0, l = args.length; i < l; i++) {
    arr[i] = args.Item(i);
  }

  return {
    ppxid: arr[0],
    cycle: Number(arr[1]),
    limit: Number(arr[2]),
    spinner: spinner[arr[3]]
  };
};
var show_spinner = function(id, mark) {
  PPx.Execute('*execute ' + id + ',*linemessage !"' + mark);
}
var spinning = function(args, spin_len) {
  var total = 0;
  var i = 0;

  PPx.Execute('*execute ' + args.ppxid + ',*string i,spin=1');

  while (PPx.Extract('%*extract(' + args.ppxid + ',%%si"spin")')) {
    show_spinner(args.ppxid, args.spinner[i]);

    i++;

    if (i >= spin_len) {
      i = 0;
    }

    PPx.Execute('*wait ' + args.cycle + ',2');
    total = total + args.cycle;

    if (total >= args.limit) {
      break;
    }
  }

  show_spinner(args.ppxid, '');
};

var g_arg = adjust_arg(PPx.Arguments);
spinning(g_arg, g_arg.spinner.length);
