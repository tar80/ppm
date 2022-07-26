//!*script
// deno-lint-ignore-file no-var
/**
 * Delete not used plugins
 *
 * @ 0 If nonzero dry run
 */

var NL_CHAR = '\r\n';

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

var dry_run = PPx.Arguments.length ? PPx.Arguments.Item(0) | 0 : 0;

var cleanup_plugins = (function () {
  var result = [];
  var plugins = util.getc('S_ppm#plugins').split(NL_CHAR);
  var repo = util.getc('S_ppm#global:ppm') + '\\repo';
  var reg = /^@(\S+)[\s=]+(\S+)/;

  for (var i = 1, l = plugins.length - 2; i < l; i++) {
    var thisLine = plugins[i];

    if (~thisLine.indexOf(repo)) {
      thisLine.replace(reg, function (_p0, p1, p2) {
        result.push(p2);

        if (dry_run === 0 && !PPx.Execute('%"ppx-plugin-manager"%Q"Delete ' + p2 + '?"')) {
          PPx.Execute('*script %*getcust(S_ppm#global:ppm)\\script\\jscript\\unset.js,' + p1);
          PPx.Execute('*deletecust S_ppm#plugins:' + p1);
          PPx.Execute('*delete ' + p2);
        }
      });
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
  PPx.SetPopLineMessage('!"No deleted plugins');
}
