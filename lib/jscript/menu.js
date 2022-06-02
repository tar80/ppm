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

  return {
    order: args.Item(0),
    label: args.Item(1),
    count: args.Item(2) | 0,
    cmdline: len > 3 && args.Item(3),
    dryrun: len > 4 ? args.Item(4) | 0 : 0
  };
})(PPx.Arguments());

var g_table = (function (label) {
  var data = PPx.Extract('%*getcust(' + label + ')');
  var codes = ['\r\n', '\n', '\r'];
  var linefeed;

  for (var i = 0, l = codes.length; i < l; i++) {
    if (~data.indexOf(codes[i])) {
      linefeed = codes[i];
      break;
    }
  }

  return {data: data.split(linefeed), linefeed: linefeed};
})(g_args.label);

var method = {};
var process = function (table, count, label, cmdline, dryrun, flag) {
  var result = ['*deletecust "' + label + '"'];
  var order = dryrun ? {method: 'echo', sep: table.linefeed} : {method: 'execute', sep: '%:'};
  var item = table.data.slice(0, -2);
  var prop = cmdline.split('=')[0];
  var command = function (data) {
    var reg = /%/g;
    var rep = {'%': '%%'};

    return (
      '*setcust ' +
      label +
      ':' +
      data.replace(reg, function (c) {
        return rep[c];
      })
    );
  };

  for (var i = 1, l = item.length; i < l; i++) {
    var thisItem = item[i];

    if (thisItem.indexOf(prop) === 0) {
      dryrun && PPx.Echo(label + ' has ' + prop);
      PPx.quit(1);
    }

    result.push(command(thisItem));
  }

  result.splice(Math.min(count, item.length), flag, command(cmdline));
  PPx[order.method](result.join(order.sep));
};

method['add'] = function (table, count, label, cmdline, dryrun) {
  process(table, count, label, cmdline, dryrun, 0);
};

method['del'] = function (table, count, label, _cmdline, dryrun) {
  var order = dryrun ? 'Echo' : 'Execute';
  var item = table.data[Math.min(count, table.data.length)].replace(/^([^\s]+)\s.*/, '$1');

  PPx[order]('*deletecust ' + label + ':' + item);
};

method['ex'] = function (table, count, label, cmdline, dryrun) {
  process(table, count, label, cmdline, dryrun, 1);
};

method[g_args.order](g_table, g_args.count, g_args.label, g_args.cmdline, g_args.dryrun);

!g_args.dryrun && g_args.label === 'MC_menu'
  ? PPx.Execute(
      '*pptray -c %%"ppx-plugin-manager"%%Q"The menu was regenerated%%bnRestart PPc?" %%: *closeppx C* %%: *ppc'
    )
  : PPx.Execute('%K"@LOADCUST"');
