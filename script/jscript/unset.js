//!*script
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

var plugin = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\plugin.js'));
module = null;

var getc = function (item) {
  return PPx.Extract('%*getcust(' + item + ')');
};

var g_args = (function (args) {
  var len = args.length;

  if (len < 1) {
    PPx.Execute('*script "' + g_ppm.lib + '\\errors.js",arg,' + PPx.ScriptName);
    PPx.Quit(-1);
  }

  return {
    name: args.item(0),
    dryrun: len > 1 ? args.item(1) | 0 : 0
  };
})(PPx.Arguments());

var enable_plugin = getc('S_ppm#global:plugins').split(',');
var cache_dir = getc('S_ppm#global:cache');
var unset_cfg = cache_dir + '\\ppm\\unset\\' + g_args.name + '.cfg';
var global_cfg = cache_dir + '\\ppm\\global.cfg';

// if (!~enable_plugin.indexOf(g_args.name)) {
//   PPx.Execute('%"ppx-plugin-manager"%I"' + g_args.name + ' is not installed"');
//   PPx.Quit(1);
// }

/* Initial plugin */
var init_result = plugin.unset(g_args.name, g_args.dryrun);
if (g_args.dryrun !== 0) {
  PPx.Echo('[Unset]\n\n' + init_result);
  PPx.Quit(1);
}

if (~enable_plugin.indexOf(g_args.name)) {
  enable_plugin.splice(enable_plugin.indexOf(g_args.name), 1);
  PPx.Execute('*setcust S_ppm#global:plugins=' + enable_plugin.join(','));
}

/* Output settings to file */
g_args.dryrun === 0 &&
  PPx.Execute('%Osbd *ppcust CD ' + global_cfg + ' -mask:"S_ppm#global,S_ppm#plugins"');

PPx.SetPopLineMessage('!"Unset ' + g_args.name);
