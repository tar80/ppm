//!*script
/**
 * Description
 *
 */

var quitMsg = function (msg) {
  PPx.Echo(msg);
  PPx.Quit(-1);
};

var getc = function (item) {
  return PPx.Extract('%*getcust(' + item + ')');
};

var reply = function () {
  var args = [].slice.call(arguments);
  var path = lib_dir + this.name + '.js';

  if (!fso.FileExists(path)) {
    quitMsg('Not found:\n' + path);
  }

  return PPx.Extract('%*script("' + path + '",' + args + ')');
};

var print = function () {
  var args = [].slice.call(arguments);

  PPx.Execute(
    '*script "' + lib_dir + '\\print.js",edit,%*getcust(S_ppm#user:newline),' +
      this.title +
      ',' +
      args
  );
};

var fso = PPx.CreateObject('Scripting.FileSystemObject');
var ppm_dir = getc('S_ppm#global:ppm')
var home_dir = getc('S_ppm#global:home');
var cache_dir = getc('S_ppm#global:cache');
var lib_dir = ppm_dir + '\\lib\\jscript\\';

/* Restore setting at initialization */
(function () {
  var ppxdef = '%0%\\ppxdef.cfg';
  var text =
    '";[ppm]%%%%bn' +
    '_Command = {%%%%bn' +
    'ppmRestore = %%%%%%%%Osbd *ppcust CS ""' + cache_dir + '\\ppm\\global.cfg""%%%%bn' +
    '%%%%bt*script ""' + ppm_dir + '\\script\\jscript\\restore.js"",""' + home_dir + '"" %%%%bn' +
    '}%%%%bn' +
    ';[endppm]"'

  if (reply.call({name: 'read_utf8'}, ppxdef, 'exists', ';[ppm]') !== '0') {
    print.call({title: 'COPY THIS TEXT IN PPXDEF.CFG'},  text);
    PPx.Quit(-1);
  }
})();

