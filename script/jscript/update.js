//!*script
/**
 * Update remote plugins
 *
 * @arg 0 If nonzero dry run
 */

PPx.Execute('*job start');
PPx.Execute('%Oa *ppb -bootid:p');
PPx.Execute('*wait 200,2');

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
var git = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\gitm.js'));
module = null;

var dry_run = PPx.Arguments.length && PPx.Arguments(0) | 0;

var resultMsg = (function () {
  var list = util.lines(util.getc('S_ppm#global:cache') + '\\list\\_pluginlist');
  var msg = [];
  var update = false;
  var thisLine = [];
  var name, path;
  var reg = /^([^\s]+)\s+['"](.+)['"]/;

  var change = function (pwd) {
    var branch = git.branch(pwd);
    var localHead = git.head(pwd, branch);

    PPx.Execute(
      '%Os *cd ' +
        pwd +
        ' %:git ls-remote origin ' +
        branch +
        '|%0pptrayw -c *string u,stdout=%%*stdin(-utf8) %&'
    );
    var remoteHead = PPx.Extract('%*getcust(_User:stdout)').split('\t');

    if (remoteHead[0] === '') {
      msg.push('URL not found: ' + name[1]);
      return;
    }

    if (localHead !== remoteHead[0]) {
      if (dry_run === 0) {
        PPx.Execute('%Os *cd ' + pwd + ' %: git pull');
        PPx.Execute('%Os *execute BP,*cd ' + pwd + ' %%:git log --oneline head...' + localHead);
      }

      update = true;
      return;
    }
  };

  if (util.getc('S_ppm#global:dev') !== '1') {
    name = ['tar80', 'ppx-plugin-manager'];
    change(util.getc('S_ppm#global:ppm'));
  }

  var fso = PPx.CreateObject('Scripting.FileSystemObject');

  for (var i = 0, l = list.data.length; i < l; i++) {
    thisLine = list.data[i].replace(reg, '$1,$2').split(',');
    if (thisLine[0] === 'remote') {
      name = thisLine[1].split('/');
      path = util.getc('S_ppm#plugins:' + name[1]);

      if (fso.FolderExists(path)) {
        change(path);
        continue;
      }
    }
  }

  update
    ? msg.push('To apply the change, run *ppmCompare <plugin-name> and edit the difference.')
    : msg.push('No updates.');
  return msg;
})();

PPx.Execute('*deletecust _User:stdout');
PPx.Execute('*job end');

if (!PPx.Execute('*script %*getcust(S_ppm#global:ppm)\\install.js,2')) {
  PPx.Execute('*execute BP,*linemessage ' + resultMsg);
}
