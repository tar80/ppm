//!*script
/**
 * Return the information of the repository
 *
 * @return {string} git-branch-name,repository-root,head-hash
 * NOTE: Returns when current directory is not a repository
 *        git-branch-name: undefined
 *        repository-root:  ''
 *        head-hash:       undefined
 */

var fso = PPx.CreateObject('Scripting.FileSystemObject');
var st = PPx.CreateObject('ADODB.stream');

var repo_root = (function () {
  var pwd = PPx.Extract('%*name(DCK,%1)');
  var hasGit;

  if (pwd.indexOf('aux:') === 0) {
    pwd = pwd.replace(/aux:([\\/])*[SM]_[^\\]*\\(.*)?/, function (_p0, p1, p2) {
      return typeof p1 === 'undefined' ? p2 : '';
    });
  }

  if (pwd !== '') {
    pwd = fso.GetFolder(pwd);

    do {
      hasGit = fso.BuildPath(pwd, '.git');
      if (fso.FolderExists(hasGit)) {
        return String(pwd);
      }

      pwd = pwd.ParentFolder;

      if (pwd === null || pwd.IsRootFolder) {
        break;
      }
    } while (!pwd.IsRootFolder);
  }

  return '';
})();

var branch_name = (function () {
  var hasHead = fso.BuildPath(repo_root, '.git\\head');

  if (fso.FileExists(hasHead)) {
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LoadFromFile(hasHead);
    var data = st.ReadText(-1);
    st.close;

    return ~data.indexOf('ref:') ? data.slice(16, -1) : data.slice(0, -1);
  }
})();

var head_hash = (function () {
  var hasHeads = fso.BuildPath(repo_root, '.git\\refs\\heads\\' + branch_name);

  if (fso.FileExists(hasHeads)) {
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LoadFromFile(hasHeads);
    var data = st.ReadText(-1);
    st.close;
    return data.slice(0, -1);
  }
})();

PPx.Result = branch_name + ',' + repo_root + ',' + head_hash;
