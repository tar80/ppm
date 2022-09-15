//!*script
/**
 * Return the information of the repository
 *
 * @arg {string} 0 Can specify a single return value. branch | root | head
 * @return {string} git-branch-name,repository-root,head-hash
 * NOTE: Returns when current directory is not a repository
 *        git-branch-name: '-'
 *        repository-root: ''
 *        head-hash:       'undefined'
 */

const fso = PPx.CreateObject('Scripting.FileSystemObject');
const st = PPx.CreateObject('ADODB.stream');

const repo_root = (() => {
  let pwd = PPx.Extract('%*name(DCK,%1)');
  let hasGit;

  if (pwd.indexOf('aux:') === 0) {
    pwd = pwd.replace(/aux:([\\/])*[SM]_[^\\]*\\(.*)?/, (_p0, p1, p2) => {
      return p1 === undefined ? p2 : '';
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

const branch_name = (() => {
  const hasHead = fso.BuildPath(repo_root, '.git\\head');

  if (fso.FileExists(hasHead)) {
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LoadFromFile(hasHead);
    const data = st.ReadText(-1);
    st.close;

    return ~data.indexOf('ref:') ? data.slice(16, -1) : data.slice(0, -1);
  }

  return '-';
})();

const head_hash = (() => {
  const hasHeads = fso.BuildPath(repo_root, '.git\\refs\\heads\\' + branch_name);

  if (fso.FileExists(hasHeads)) {
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LoadFromFile(hasHeads);
    const data = st.ReadText(-1);
    st.close;
    return data.slice(0, -1);
  }
})();

PPx.Result = {
  branch: branch_name,
  root: repo_root,
  head: head_hash,
  0: `${branch_name},${repo_root},${head_hash}`
}[PPx.Arguments.length && PPx.Arguments(0)];
