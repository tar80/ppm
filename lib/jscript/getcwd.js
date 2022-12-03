//!*script
/**
 * Return current entity working directory
 *
 * @version 1.0
 * @return {string} current working direcotry path
 * @param {string} 0 whether to use slash(/) or backslash(\) as separators. l=slash | k=backslash
 */

var result = function (path) {
  var path_ = path.replace(RegExp(sep[1], 'g'), sep[0]);
  var fso = PPx.CreateObject('Scripting.FileSystemObject');
  if (!fso.FolderExists(path_) && !fso.FileExists(path_)) {
    PPx.Execute('%"ppx-plugin-manager"%I"lib/getcwd.js: parent directory is not exists"');
    PPx.Quit(-1);
  }

  PPx.Result = path_;
  PPx.Quit(1);
};

var sep = (function () {
  var char = PPx.Arguments.length ? PPx.Arguments.Item(0).toUpperCase() : 'K';
  return {K: ['\\', '/'], L: ['/', '\\\\']}[char];
})();

var file_name = PPx.Extract('%R');

/^[a-zA-Z]+:.*/.test(file_name) && result(file_name.replace(/(.+)[\/\\].+/, '$1'));

var pwd;
var reg = RegExp('^aux:(//)?S_[^/\\\\]+[/\\\\](.+)');
// var blank_msg = PPx.Extract('%*getcust(Mes0411:NOEL)');

if (PPx.DirectoryType === 4) {
  pwd = PPx.Extract('%FDV');
  result(pwd.replace(reg, '$2'));
}

pwd = PPx.Extract('%FD');
result(pwd.replace(reg, '$2'));
