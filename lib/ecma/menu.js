//!*script
/**
 * Processing to the specified number of the menu
 *
 * @version 1.0
 * @arg 0 add | del | ex
 * @arg 1 menu-label
 * @arg 2 number
 * @arg 3 command-line
 * @arg 4 If nonzero dry run
 */

'use strict';

const script_name = PPx.scriptName;

const errors = (method) => {
  PPx.Execute(`*script "%*name(D,"${script_name}")\\errors.js",${method},${script_name}`);
  PPx.Quit(-1);
};

const g_args = ((args = PPx.Arguments) => {
  const len = args.length;

  if (len < 2) {
    errors('arg');
  }

  return {
    order: args.Item(0),
    label: args.Item(1),
    count: args.Item(2) | 0,
    cmdline: len > 3 && args.Item(3),
    dryrun: len > 4 ? args.Item(4) | 0 : 0
  };
})();

const g_table = ((label = g_args.label) => {
  const data = PPx.Extract(`%*getcust(${label})`);
  const codes = ['\r\n', '\n', '\r'];
  let linefeed;

  for (let i = 0, l = codes.length; i < l; i++) {
    if (~data.indexOf(codes[i])) {
      linefeed = codes[i];
      break;
    }
  }

  return {data: data.split(linefeed), linefeed: linefeed};
})();

const method = {};
const process = (table, count, label, cmdline, dryrun, flag) => {
  const result = [`*deletecust "${label}"`];
  const order = dryrun ? {method: 'Echo', sep: table.linefeed} : {method: 'Execute', sep: '%:'};
  const item = table.data.slice(0, -2);
  const prop = cmdline.split('=')[0];
  const command = function (data) {
    const reg = /%/g;
    const rep = {'%': '%%'};
    return `*setcust ${label}:${data.replace(reg, (c) => rep[c])}`;
  };

  for (let i = 1, l = item.length; i < l; i++) {
    const thisItem = item[i];

    if (thisItem.indexOf(prop) === 0) {
      dryrun && PPx.Echo(`${label} has ${prop}`);
      PPx.quit(1);
    }

    result.push(command(thisItem));
  }

  result.splice(Math.min(count, item.length), flag, command(cmdline));
  PPx[order.method](result.join(order.sep));
};

method['add'] = (table, count, label, cmdline, dryrun) => {
  process(table, count, label, cmdline, dryrun, 0);
};

method['del'] = (table, count, label, _cmdline, dryrun) => {
  const order = dryrun ? 'Echo' : 'Execute';
  const item = table.data[Math.min(count, table.data.length)].replace(/^([^\s]+)\s.*/, '$1');

  PPx[order](`*deletecust ${label}:${item}`);
};

method['ex'] = (table, count, label, cmdline, dryrun) => {
  process(table, count, label, cmdline, dryrun, 1);
};

method[g_args.order](g_table, g_args.count, g_args.label, g_args.cmdline, g_args.dryrun);

PPx.Execute('%K"@LOADCUST"');
!g_args.dryrun && PPx.execute('*logwindow "Menu regenerated. Restart PPc now."');
