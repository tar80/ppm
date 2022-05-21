(function () {
  var obj = PPx.CreateObject('Scripting.FileSystemObject');
  return {
    root: function (pwd) {
      var hasGit;
      if (pwd.indexOf('aux:') === 0) {
        pwd = pwd.replace(/aux:([\\/])*[SM]_[^\\]*\\(.*)?/, function (_p0, p1, p2) {
          return typeof p1 === 'undefined' ? p2 : '';
        });
      }
      if (pwd !== '') {
        pwd = obj.GetFolder(pwd);
        do {
          hasGit = obj.BuildPath(pwd, '.git');
          if (obj.FolderExists(hasGit)) return String(pwd);
          pwd = pwd.ParentFolder;
          if (pwd === null || pwd.IsRootFolder) break;
        } while (!pwd.IsRootFolder);
      }
      return '';
    },
    branch: function (root) {
      var hasHead = obj.BuildPath(root, '.git\\head');
      if (obj.FileExists(hasHead)) {
        st.Open;
        st.Type = 2;
        st.Charset = 'UTF-8';
        st.LoadFromFile(hasHead);
        var data = st.ReadText(-1);
        st.close;
        return ~data.indexOf('ref:') ? data.slice(16, -1) : data.slice(0, -1);
      }
    },
    head: function (root, branch) {
      var hasHeads = obj.BuildPath(root, '.git\\refs\\heads\\' + branch);
      if (obj.FileExists(hasHeads)) {
        st.Open;
        st.Type = 2;
        st.Charset = 'UTF-8';
        st.LoadFromFile(hasHeads);
        var data = st.ReadText(-1);
        st.close;
        return data.slice(0, -1);
      }
    }
  };
})();
