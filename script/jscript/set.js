//!*script
/**
 *  Edit plugin settings, then setup
 *
 * @arg 0 {string} Plugin name
 * @arg 1 {string} Patch to source, user | def
 * @arg 2 {string} Specification of the method, set | editor | compare
 * @arg 3 {number} If nonzero dry run
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
var ppm = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\ppm.js'));
module = null;

var script_dir = util.getc('S_ppm#global:ppm') + '\\script\\jscript';
var cache_dir = util.getc('S_ppm#global:cache');

var set_plugin = (function (args) {
  var len = args.length;

  if (len < 3) {
    util.error('arg');
  }

  var pluginName = args.Item(0).replace(/^@/, '');
  var disable = util.getc('S_ppm#plugins:@' + pluginName);
  var pluginDir = disable || util.getc('S_ppm#plugins:' + pluginName);
  var isBack = disable !== '' ? true : false;

  if (pluginDir === '') {
    PPx.Execute(
      '%"ppx-plugin-manager"%I"' +
        util.script.name +
        ': *' +
        pluginName +
        '* is not valid.%bn%bnUpdate pluginlist and *ppmInstall first."'
    );
    PPx.Quit(1);
  }

  var order = args.Item(2);
  var source = order === 'compare' ? 'user' : args.Item(1);

  return {
    name: pluginName,
    dir: pluginDir,
    source: source,
    order: order,
    isBack: isBack,
    dryrun: len > 3 ? args.Item(3) | 0 : 0
  };
})(PPx.Arguments);

/* Question, continue loading */
if (set_plugin.dryrun === 0 && set_plugin.order !== 'set') {
  if (set_plugin.source === 'user') {
    (function (order, name, dir) {
      var path = cache_dir + '\\config\\' + name + '.cfg';

      if (order === 'compare') {
        path = path + '" "' + dir + '\\setting\\patch.cfg';
      }

      var exitcode = PPx.Execute(
        '*execute ,*cd ' +
          cache_dir +
          '%%: %%Osbq %*getcust(S_ppm#user:' +
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
    })(set_plugin.order, set_plugin.name, set_plugin.dir);
  } else if (
    PPx.Execute('%"ppx-plugin-manager"%Q"Load default ' + set_plugin.name + ' settings?"')
  ) {
    PPx.Quit(1);
  }
}

/* Get path to config file */
var global_cfg = cache_dir + '\\ppm\\global.cfg';
var cfg = (function (name) {
  return {
    setup: cache_dir + '\\ppm\\setup\\' + name + '.cfg',
    unset: cache_dir + '\\ppm\\unset\\' + name + '.cfg',
    linecust: cache_dir + '\\ppm\\unset\\linecust.cfg'
  };
})(set_plugin.name);

/* Initial plugin */
var init_result = ppm.unsetLines(set_plugin.name, set_plugin.dryrun);

if (set_plugin.dryrun !== 0) {
  PPx.Echo('[Unset]\n\n' + init_result);
}

/* Build settings */
(function () {
  var msg = PPx.Extract(
    '%*script("' +
      script_dir +
      '\\build.js",' +
      set_plugin.name +
      ',' +
      set_plugin.source +
      ',' +
      set_plugin.dryrun +
      ')'
  );

  if (msg !== '') {
    util.print.call(
      {cmd: 'ppe', title: 'BUILD CONFIG FILE ABORTING'},
      'Failure: ' + set_plugin.name + ' ' + msg
    );
  }
})();

if (set_plugin.dryrun !== 0) {
  PPx.Echo('[Load]\n\n' + cfg.setup);
  PPx.Quit(1);
}

/* Load settings */
util.setc('@' + cfg.setup);

if (set_plugin.isBack) {
  util.setc('S_ppm#plugins:' + set_plugin.name + '=' + set_plugin.dir);
  PPx.Execute('*deletecust S_ppm#plugins:@' + set_plugin.name);

  var overWrite = function (name, prefix) {
    var listPath = cache_dir + '\\list\\' + name;
    var lines = util.readLines(listPath);

    for (var i = 0, l = lines.data.length; i < l; i++) {
      var thisLine = lines.data[i];

      if (~thisLine.indexOf(set_plugin.name)) {
        lines.data[i] = thisLine.indexOf(prefix) === 0 ? thisLine.slice(1) : thisLine;
        continue;
      }
    }

    util.write.apply({filepath: listPath, newline: lines.newline}, lines.data);
  };

  overWrite('_pluginList', ';');
  overWrite('enable_plugins.txt', '@');
}

/* Output settings to file */
PPx.Execute('%Obd *ppcust CD ' + global_cfg + ' -mask:"S_ppm#global,S_ppm#plugins"');
PPx.Execute('%K"@LOADCUST"');
PPx.SetPopLineMessage('!"Set ' + set_plugin.name);
