//!*script
/**
 * Delete not used plugins
 *
 * @ 0 If nonzero dry run
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
module = null;

var dry_run = PPx.Arguments.Length ? PPx.Arguments.Item(0) | 0 : 0;

var plugins = (function () {
  var result = {};
  var table = PPx.Extract('%*getcust(S_ppm#plugins)');
  var linefeed = util.check_linefeed(table);
  var plugins = table.split(linefeed);
  var reg = /^([^\s=]+)[\s=]+(.+)/;
  var thisPlugin;

  for (var i = 1, l = plugins.length; i < l; i++) {
    thisPlugin = plugins[i];

    if (thisPlugin.indexOf('}') === 0) {
      break;
    }

    thisPlugin.replace(reg, function (_p0, p1, p2) {
      result[p1] = p2;
    });
  }

  return result;
})();

var enable = util.getc('S_ppm#global:plugins').split(',');

var clean = (function () {
  var repo = util.getc('S_ppm#global:ppm') + '\\repo';
  var result = [];
  var thisPlugin;

  for (var plugin in plugins) {
    if (Object.prototype.hasOwnProperty.call(plugins, plugin)) {
      thisPlugin = plugins[plugin];
      if (thisPlugin) {
        if (!~enable.indexOf(plugin)) {
          if (thisPlugin.indexOf(repo)) {
            result.push(thisPlugin);

            if (
              dry_run === 0 &&
              !PPx.Execute('%"ppx-plugin-manager"%Q"Delete ' + thisPlugin + '?"')
            ) {
              PPx.Execute(
                '*script %*getcust(S_ppm#global:ppm)\\script\\jscript\\unset.js,' + plugin
              );
              PPx.Execute('*deletecust S_ppm#plugins:' + plugin);
              PPx.Execute('*delete ' + thisPlugin);
            }
          }
        }
      }
    }
  }

  return result;
})();


if (dry_run !== 0) {
  var cmdline = '%"ppx-plugin-manager"%I"Deleted directories:%bn';
  clean.length === 0
    ? PPx.Execute(cmdline + 'Nothing"')
    : PPx.Execute(cmdline + clean.join('%bn') + '"');
} else if (clean.length === 0) {
  PPx.SetPopLineMessage('!"No deleted plugin');
}

