//!*script
/**
 * test module functions
 *
 * @arg 0 THIS
 * @arg 1 IS
 * @arg 2 TEST
 * @arg 3 MESSAGE
 */

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
var fs = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\filesystem.js'));
var git = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\gitm.js'));
module = null;

var result = (function () {
  var result = [];
  var u = ['[util]'];
  u.push('.script: {name: ' + util.script.name + ', path: ' + util.script.path + '}');
  u.push(".getc('S_ppm#global:version'): " + util.getc('S_ppm#global:version'));
  u.push(".metaRegexp('esc', '^$(){|=:+?./\\'): " + util.esconv('esc', '^$(){|=:+?./\\'));
  u.push(".metaRegexp('nor', '\\^\\$\\(\\)\\{\\|\\=\\:\\+\\?\\.\\/\\\\'): " + util.esconv('nor', '\\^\\$\\(\\)\\{\\|\\=\\:\\+\\?\\.\\/\\\\'));
  u.push(
    ".reply.call({name: 'files'}, util.script.path): " +
      util.reply.call({name: 'files'}, util.script.path)
  );

  var f = ['[filesystem]'];
  f.push('.exists(' + PPx.ScriptName + '): ' + fs.exists(PPx.ScriptName));
  f.push(".exists('NotExistFileName'): " + fs.exists('NotExistsFileName'));
  f.push(".getPath('c:', 'path', 'to', 'test'): " + fs.getPath('c:', 'path', 'to', 'test'));
  f.push('.files(util.script.path): ' + fs.files(util.script.path));

  var g = ['[git]'];
  var root = git.root(util.getc('S_ppm#global:module'));
  g.push(".root(getc('S_ppm#global:module')): " + root);
  var branch = git.branch(root);
  g.push('.branch(' + root + '): ' + branch);
  g.push('.head(' + root + ',' + branch + '): ' + git.head(root, branch));

  result = u.concat(f, g);
  return result;
})();

util.printw.apply({cmd: 'ppe', title: 'MODULE RESULT'}, result);
