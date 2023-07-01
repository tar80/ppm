(() => {
  /*
    This code is written based on kana/vim-g(https://github.com/kana/vim-g)
    Follow the MIT license kana/vim-g
    */
  'use strict';
  const fso = PPx.CreateObject('Scripting.FileSystemObject');
  const readFile = (path) => {
    if (!fso.FileExists(path)) {
      return false;
    }
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LoadFromFile(path);
    const data = st.ReadText(-1);
    st.close;
    return data;
  };
  const detect_head = (root) => {
    const affected_rules = [
      {state: 'Rebase', att: 'file', find: '/rabase-apply/rebasing', identify: '/HEAD'},
      {state: 'Am', att: 'file', find: '/rabase-apply/applying', identify: '/HEAD'},
      {state: 'Am/Rebase', att: 'dir', find: '/rebase-apply', identify: '/HEAD'},
      {state: 'Rebase-i', att: 'file', find: '/rebase-merge/interactive', identify: '/rebase-merge/head-name'},
      {state: 'Rebase-m', att: 'dir', find: '/rebase-merge', identify: '/rebase-merge/head-name'},
      {state: 'Merging', att: 'file', find: '/MERGE_HEAD', identify: '/HEAD'}
    ];
    for (let i = 0; i < affected_rules.length; i++) {
      const toBranch = affected_rules[i];
      if (toBranch.att === 'file' && fso.FileExists(fso.BuildPath(root, toBranch.find))) {
        return {state: toBranch.state, file: toBranch.identify};
      }
      if (toBranch.att === 'dir' && fso.FileExists(fso.BuildPath(root, toBranch.find))) {
        return {state: toBranch.state, file: toBranch.identify};
      }
    }
    return {state: '', file: '/HEAD'};
  };
  const detect_logs = (root) => {
    let branch = {name: 'Unknown', state: ''};
    const data = readFile(fso.BuildPath(root, 'logs\\head'));
    const checkout = data.lastIndexOf('checkout: moving from');
    if (!!checkout) {
      data = data.slice(checkout).split('\n')[0];
      branch.name = data.replace(/.*to\s([^\s]+).*/, '$1');
      branch.state = '(Detached)';
    }
    return branch;
  };
  return {
    root: (pwd) => {
      let hasGit;
      if (pwd.indexOf('aux:') === 0) {
        pwd = pwd.replace(/aux:([\\/])*[SM]_[^\\]*\\(.*)?/, (_p0, p1, p2) =>
          typeof p1 === 'undefined' ? p2 : ''
        );
      }
      if (pwd !== '') {
        pwd = fso.GetFolder(pwd);
        do {
          hasGit = fso.BuildPath(pwd, '.git');
          if (fso.FolderExists(hasGit)) return String(pwd);
          pwd = pwd.ParentFolder;
          if (pwd === null || pwd.IsRootFolder) break;
        } while (!pwd.IsRootFolder);
      }
      return '';
    },
    branch: (root) => {
      const gitDir = `${root}\\.git`;
      const branch = detect_head(gitDir);
      const hasBranch = fso.BuildPath(gitDir, branch.file);
      const data = readFile(hasBranch);
      if (!!data) {
        let branchName = ~data.indexOf('refs') ? data.replace(/.*refs\/heads\/(.+)\r?\n?/, '$1') : '';
        let branchState = branch.state !== '' ? `(${branch.state})` : '';
        if (branchName === '') {
          const logsHead = detect_logs(gitDir);
          branchName = logsHead.name;
          branchState = logsHead.state;
        }
        return {name: branchName, state: branchState};
      }
      return {name: '-', state: ''};
    },
    head: (root, branch) => {
      const hasHead = fso.BuildPath(root, '.git\\refs\\heads\\' + branch);
      if (fso.FileExists(hasHead)) {
        st.Open;
        st.Type = 2;
        st.Charset = 'UTF-8';
        st.LoadFromFile(hasHead);
        const data = st.ReadText(-1);
        st.close;
        return data.slice(0, -1);
      }
      return 'undefined';
    }
  };
})();
