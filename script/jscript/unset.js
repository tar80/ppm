//!*script
// deno-lint-ignore-file no-var
/**
 *  Unset plugin settings
 *
 * @arg 0 Plugin name
 * @arg 1 If nonzero dry run
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

var g_args = (function (args) {
  var len = args.length;

  if (len < 1) {
    util.error('arg');
  }

  return {
    name: args.item(0),
    dryrun: len > 1 ? args.item(1) | 0 : 0
  };
})(PPx.Arguments());

var enable_plugin = util.getc('S_ppm#global:plugins').split(',');
var cache_dir = util.getc('S_ppm#global:cache');
var unset_cfg = cache_dir + '\\ppm\\unset\\' + g_args.name + '.cfg';
var global_cfg = cache_dir + '\\ppm\\global.cfg';

if (!~enable_plugin.indexOf(g_args.name)) {
  PPx.Execute('%"ppx-plugin-manager"%I"' + g_args.name + ' is not installed"');
  PPx.Quit(1);
}

/* Initial plugin */
var init_result = plugin.unset(g_args.name, g_args.dryrun);
if (g_args.dryrun !== 0) {
  PPx.Echo('[Unset]\n\n' + init_result);
  PPx.Quit(1);
}

if (~enable_plugin.indexOf(g_args.name)) {
  enable_plugin.splice(enable_plugin.indexOf(g_args.name), 1);
  util.setc('S_ppm#global:plugins=' + enable_plugin.join(','));

  (function () {
    var listpath = cache_dir + '\\list\\_pluginlist';
    var lines = util.readLines(listpath);

    for (var i = 0, l = lines.data.length; i < l; i++) {
      var thisLine = lines.data[i];

      if (thisLine.indexOf(';') !== 0 && ~thisLine.indexOf(g_args.name)) {
        lines.data[i] = ';' + thisLine;
      }
    }

    util.write.apply({filepath: listpath, newline: lines.newline}, lines.data);
  })();
}

/* Output settings to file */
g_args.dryrun === 0 &&
  PPx.Execute('%Osbd *ppcust CD ' + global_cfg + ' -mask:"S_ppm#global,S_ppm#plugins"');

PPx.SetPopLineMessage('!"Unset ' + g_args.name);
