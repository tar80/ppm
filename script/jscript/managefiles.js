//!*script
/**
 * Manage Local Configuration files
 *
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

var files = [];
var mark = PPx.EntryMarkCount;

if (
  mark === 0 &&
  !PPx.Execute(
    '%"ppx-plugin-manager"' +
      '%Q"Entry is not marked. Do you want to add a noplugin.cfg?%bn%bn' +
      'NOTE:%btthe noplugin.cfg contains non-ppm management user-settings.%bn' +
      '%btIt is generated at the time of *ppmSetup execution'
  )
) {
  files.push(util.getc('S_ppm#global:cache') + '\\ppm\\noplugin.cfg');
} else {
  files = (function () {
    var result = [];
    var thisEntry = PPx.Entry;
    var wd = PPx.Extract('%FD%\\');

    thisEntry.FirstMark;
    do {
      if (PPx.Extract('%*name(T,"' + thisEntry.Name + '")').toUpperCase() === 'CFG') {
        result.push(wd + thisEntry.Name);
      }
    } while (thisEntry.NextMark);

    return result;
  })();
}

util.write.apply(
  {
    filepath: util.getc('S_ppm#global:cache') + '\\list\\_managefiles',
    newline: util.getc('S_ppm#user:newline')
  },
  files
);

PPx.Execute('*deletecust "K_ppmTemp" %: *closeppx CP');
