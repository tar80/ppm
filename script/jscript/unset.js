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
var ppm = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\ppm.js'));
module = null;

var unset_cfg = (function (args) {
  var len = args.length;

  if (len < 1) {
    util.error('arg');
  }

  return {
    name: args.Item(0),
    dryrun: len > 1 ? args.Item(1) | 0 : 0
  };
})(PPx.Arguments);

var cache_dir = util.getc('S_ppm#global:cache');
var global_cfg = cache_dir + '\\ppm\\global.cfg';
var enable_plugin = util.getc('S_ppm#global:plugins').split(',');

if (!~enable_plugin.indexOf(unset_cfg.name)) {
  PPx.Execute('%"ppx-plugin-manager"%I"' + unset_cfg.name + ' is not installed"');
  PPx.Quit(1);
}

/* Initial plugin */
var init_result = ppm.unsetLines(unset_cfg.name, unset_cfg.dryrun);
if (unset_cfg.dryrun !== 0) {
  PPx.Echo('[Unset]\n\n' + init_result);
  PPx.Quit(1);
}

(function () {
  var hasNumber = enable_plugin.indexOf(unset_cfg.name);

  if (~hasNumber) {
    enable_plugin.splice(hasNumber, 1);
    util.setc('S_ppm#global:plugins=' + enable_plugin.join(','));

    var listpath = cache_dir + '\\list\\_pluginlist';
    var lines = util.readLines(listpath);

    for (var i = 0, l = lines.data.length; i < l; i++) {
      var thisLine = lines.data[i];

      if (thisLine.indexOf(';') !== 0 && ~thisLine.indexOf(unset_cfg.name)) {
        lines.data[i] = ';' + thisLine;
      }
    }

    util.write.apply({filepath: listpath, newline: lines.newline}, lines.data);
  }
})();

/* Output settings to file */
unset_cfg.dryrun === 0 &&
  PPx.Execute('%Osbd *ppcust CD ' + global_cfg + ' -mask:"S_ppm#global,S_ppm#plugins"');

PPx.SetPopLineMessage('!"Unset ' + unset_cfg.name);
