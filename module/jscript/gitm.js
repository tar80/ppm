(function () {
  /*
    This code is written based on kana/vim-g(https://github.com/kana/vim-g)
    Follow the MIT license kana/vim-g
    */
  var fso = PPx.CreateObject('Scripting.FileSystemObject');
  var readFile = function (path) {
    if (!fso.FileExists(path)) {
      return false;
    }
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LoadFromFile(path);
    var data = st.ReadText(-1);
    st.close;
    return data;
  };

  var detect_head = function (root) {
    var affected_rules = [
      {state: 'Rebase', att: 'file', find: '/rabase-apply/rebasing', identify: '/HEAD'},
      {state: 'Am', att: 'file', find: '/rabase-apply/applying', identify: '/HEAD'},
      {state: 'Am/Rebase', att: 'dir', find: '/rebase-apply', identify: '/HEAD'},
      {
        state: 'Rebase-i',
        att: 'file',
        find: '/rebase-merge/interactive',
        identify: '/rebase-merge/head-name'
      },
      {state: 'Rebase-m', att: 'dir', find: '/rebase-merge', identify: '/rebase-merge/head-name'},
      {state: 'Merging', att: 'file', find: '/MERGE_HEAD', identify: '/HEAD'}
    ];
    for (var i = 0; i < affected_rules.length; i++) {
      var toBranch = affected_rules[i];
      if (toBranch.att === 'file' && fso.FileExists(fso.BuildPath(root, toBranch.find))) {
        return {state: toBranch.state, file: toBranch.identify};
      }
      if (toBranch.att === 'dir' && fso.FileExists(fso.BuildPath(root, toBranch.find))) {
        return {state: toBranch.state, file: toBranch.identify};
      }
    }
    return {state: '', file: '/HEAD'};
  };
  var detect_logs = function (root) {
    var branch = {name: 'Unknown', state: ''};
    var data = readFile(fso.BuildPath(root, 'logs\\head'));
    var checkout = data.lastIndexOf('checkout: moving from');
    if (!!checkout) {
      branch.name = data.slice(checkout).replace(/.*to\s([^\s]+).*/, '$1');
      branch.state = '(Detached)';
    }
    return branch;
  };
  return {
    root: function (pwd) {
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
          if (fso.FolderExists(hasGit)) return String(pwd);
          pwd = pwd.ParentFolder;
          if (pwd === null || pwd.IsRootFolder) break;
        } while (!pwd.IsRootFolder);
      }
      return '';
    },
    branch: function (root) {
      var gitDir = root + '\\.git';
      var branch = detect_head(gitDir);
      var hasBranch = fso.BuildPath(gitDir, branch.file);
      var data = readFile(hasBranch);
      if (!!data) {
        var branchName = ~data.indexOf('refs')
          ? data.replace(/.*refs\/heads\/(.+)\r?\n?/, '$1')
          : '';
        var branchState = branch.state !== '' ? '(' + branch.state + ')' : '';
        if (branchName === '') {
          var logsHead = detect_logs(gitDir);
          branchName = logsHead.name;
          branchState = logsHead.state;
        }
        return {name: branchName, state: branchState};
      }
      return {name: '-', state: ''};
    },
    head: function (root, branch) {
      var hasHead = fso.BuildPath(root, '.git\\refs\\heads\\' + branch);
      if (fso.FileExists(hasHead)) {
        st.Open;
        st.Type = 2;
        st.Charset = 'UTF-8';
        st.LoadFromFile(hasHead);
        var data = st.ReadText(-1);
        st.close;
        return data.slice(0, -1);
      }
      return 'undefined';
    }
  };
})();
