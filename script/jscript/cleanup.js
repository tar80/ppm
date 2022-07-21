//!*script
// deno-lint-ignore-file no-var
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

var util = module(
  PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\util.js')
);
module = null;

var dry_run = PPx.Arguments.length ? PPx.Arguments.Item(0) | 0 : 0;

var plugin_list = (function () {
  var result = {};
  var list = PPx.Extract('%*getcust(S_ppm#plugins)');
  var linefeed = util.linefeedback(list);
  var listLines = list.split(linefeed);
  var reg = /^(\S+)[\s=]+(\S+)/;
  var thisLine;

  for (var i = 1, l = listLines.length; i < l; i++) {
    thisLine = listLines[i];

    if (thisLine.indexOf('}') === 0) {
      break;
    }

    thisLine.replace(reg, function (_p0, p1, p2) {
      result[p1] = p2;
    });
  }

  return result;
})();

var cleanup_plugins = (function () {
  var repo = util.getc('S_ppm#global:ppm') + '\\repo';
  var result = [];
  var enablePlugins = util.getc('S_ppm#global:plugins');

  for (var plugin in plugin_list) {
    if (Object.prototype.hasOwnProperty.call(plugin_list, plugin)) {
      var thisPath = plugin_list[plugin];

      if (!~enablePlugins.indexOf(plugin) && thisPath.indexOf(repo)) {
        result.push(thisPath);

        if (
          dry_run === 0 &&
          !PPx.Execute('%"ppx-plugin-manager"%Q"Delete ' + thisPath + '?"')
        ) {
          PPx.Execute(
            '*script %*getcust(S_ppm#global:ppm)\\script\\jscript\\unset.js,' +
              plugin
          );
          PPx.Execute('*deletecust S_ppm#plugins:' + plugin);
          PPx.Execute('*delete ' + thisPath);
        }
      }
    }
  }

  return result;
})();

if (dry_run !== 0) {
  var msg = '%"ppx-plugin-manager"%I"Deleted directories:%bn';

  cleanup_plugins.length === 0
    ? PPx.Execute(msg + 'Nothing"')
    : PPx.Execute(msg + cleanup_plugins.join('%bn') + '"');
  PPx.Quit(1);
}

if (cleanup_plugins.length === 0) {
  PPx.SetPopLineMessage('!"No deleted plugin');
}
