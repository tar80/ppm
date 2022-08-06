(() => {
  'use strict';
  const obj = PPx.CreateObject('Scripting.FileSystemObject');
  return {
    root: (pwd) => {
      let hasGit;
      if (pwd.indexOf('aux:') === 0) {
        pwd = pwd.replace(/aux:([\\/])*[SM]_[^\\]*\\(.*)?/, (_p0, p1, p2) =>
          typeof p1 === 'undefined' ? p2 : ''
        );
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
    branch: (root) => {
      const hasHead = obj.BuildPath(root, '.git\\head');
      if (obj.FileExists(hasHead)) {
        st.Open;
        st.Type = 2;
        st.Charset = 'UTF-8';
        st.LoadFromFile(hasHead);
        const data = st.ReadText(-1);
        st.close;
        return ~data.indexOf('ref:') ? data.slice(16, -1) : data.slice(0, -1);
      }
      return '-';
    },
    head: (root, branch) => {
      const hasHeads = obj.BuildPath(root, '.git\\refs\\heads\\' + branch);
      if (obj.FileExists(hasHeads)) {
        st.Open;
        st.Type = 2;
        st.Charset = 'UTF-8';
        st.LoadFromFile(hasHeads);
        const data = st.ReadText(-1);
        st.close;
        return data.slice(0, -1);
      }
      return 'undefined';
    }
  };
})();
