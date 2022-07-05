//!*script
/**
 *  Edit plugin settings, then setup
 *
 * @arg 0 Plugin name
 * @arg 1 Patch to apply, user | def
 * @arg 2 Specification of the method, set | editor | compare
 * @arg 3 If nonzero dry run
 */

/* Initial */
var st = PPx.CreateObject('ADODB.stream');
var module = function (filepath) {
  var data;

  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(filepath);
  data = st.ReadText(-1);
  st.Close;

  return Function(' return ' + data)();
};

var util = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\util.js'));
var plugin = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\plugin.js'));
module = null;

// var print = (function () {
// var newline = getc('S_ppm#user:newline');

// return function () {
// var args = [].slice.call(arguments);
// PPx.Execute(
// '*script "' + g_ppm.lib + '\\print.js",ppe,' + newline + ',' + this.title + ',' + args
// );
// PPx.Quit(-1);
// };
// })();

var g_ppm = (function () {
  var ppm = util.getc('S_ppm#global:ppm');

  return {
    lib: ppm + '\\lib\\jscript',
    script: ppm + '\\script\\jscript',
    cache: util.getc('S_ppm#global:cache')
  };
})();

var g_args = (function (args) {
  var len = args.length;

  if (len < 3) {
    util.error('arg');
  }

  var scriptName = PPx.scriptName;
  var pluginName = args.item(0);
  var pluginDir = util.getc('S_ppm#plugins:' + pluginName);

  if (pluginDir === '') {
    PPx.Execute(
      '%"ppx-plugin-manager"%I"%*name(C,"' +
        scriptName +
        '"): Specified plugin is not valid.%bnUpdate pluginlist and *ppmInstall first."'
    );
    PPx.Quit(-1);
  }

  var order = args.item(2);
  var apply = order === 'compare' ? 'user' : args.item(1);

  return {
    name: pluginName,
    dir: pluginDir,
    apply: apply,
    order: order,
    dryrun: len > 3 ? args.item(3) | 0 : 0
  };
})(PPx.Arguments());

/* Question, continue loading */
if (g_args.dryrun === 0 && g_args.order !== 'set') {
  if (g_args.apply === 'user') {
    (function (order, name, dir) {
      var path = g_ppm.cache + '\\config\\' + name + '.cfg';

      if (order === 'compare') {
        path = path + '" "' + dir + '\\setting\\patch.cfg';
      }

      var exitcode = PPx.Execute(
        '*execute ,%%Osbq %*getcust(S_ppm#user:' +
          order +
          ') "' +
          path +
          '" %%: *focus %%: %%"ppx-plugin-manager"%%Q"Load ' +
          name +
          ' settings?"'
      );

      if (exitcode) {
        PPx.Quit(1);
      }
    })(g_args.order, g_args.name, g_args.dir);
  } else {
    if (PPx.Execute('%"ppx-plugin-manager"%Q"Load default ' + g_args.name + ' settings?"')) {
      PPx.Quit(1);
    }
  }
}

/* Get path to config file */
var global_cfg = g_ppm.cache + '\\ppm\\global.cfg';
var cfg = (function (name) {
  return {
    setup: g_ppm.cache + '\\ppm\\setup\\' + name + '.cfg',
    unset: g_ppm.cache + '\\ppm\\unset\\' + name + '.cfg',
    linecust: g_ppm.cache + '\\ppm\\unset\\linecust.cfg'
  };
})(g_args.name);

/* Initial plugin */
var init_result = plugin.unset(g_args.name, g_args.dryrun);

if (g_args.dryrun !== 0) {
  PPx.Echo('[Unset]\n\n' + init_result);
}

/* Build settings */
(function (plug, ppm) {
  var msg = PPx.Extract(
    '%*script("' +
      ppm.script +
      '\\build.js",' +
      plug.name +
      ',' +
      plug.apply +
      ',' +
      plug.dryrun +
      ')'
  );

  if (msg !== '') {
    util.print.call(
      {cmd: 'ppe', title: 'BUILD CONFIG FILE ABORTING'},
      'Failure: ' + plug.name + ' ' + msg
    );
  }
})(g_args, g_ppm);

if (g_args.dryrun !== 0) {
  PPx.Echo('[Load]\n\n' + cfg.setup);
  PPx.Quit(1);
}

/* Load settings */
util.setc('@' + cfg.setup);

var enable_plugin = util.getc('S_ppm#global:plugins').split(',');

if (!~enable_plugin.indexOf(g_args.name)) {
  util.setc('S_ppm#global:plugins=' + util.getc('S_ppm#global:plugins') + ',' + g_args.name);
  (function () {
    var listpath = util.getc('S_ppm#global:cache') + '\\list\\_pluginlist';
    var lines = util.readLines(listpath);

    for (var i = 0, l = lines.data.length; i < l; i++) {
      var thisLine = lines.data[i];

      if (~thisLine.indexOf(g_args.name)) {
        lines.data[i] = thisLine.indexOf(';') === 0 ? thisLine.slice(1) : thisLine;
        break;
      }
    }

    util.write.apply({filepath: listpath, newline: lines.newline}, lines.data);
  })();
}

/* Output settings to file */
PPx.Execute('%Obd *ppcust CD ' + global_cfg + ' -mask:"S_ppm#global,S_ppm#plugins"');
PPx.SetPopLineMessage('!"Set ' + g_args.name);
