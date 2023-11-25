(function () {
  if (fso != null && typeof fso !== 'object') {
    fso = PPx.CreateObject('Scripting.FileSystemObject');
  }
  return {
    exists: function (entry) {
      if (fso.FolderExists(entry)) return [true, 'directory'];
      if (fso.FileExists(entry)) return [true, 'file'];
      return [false, ''];
    },
    joinPath: function () {
      var args = [].slice.call(arguments);
      if (args[0][args[0].length - 1] === '\\') {
        args[0] = args[0].slice(0, -1);
      }
      return args.join('\\');
    },
    copy: function (source, dest, ow) {
      var result, command;
      ow = typeof ow === 'undefined' ? true : Boolean(ow);
      if (fs.FileExists(source)) {
        command = 'CopyFile';
      } else if (fs.FolderExists(source)) {
        command = 'CopyFolder';
      }
      if (fs.FolderExists(dest)) {
        dest = fs.GetFolder(dest) + '\\';
      }
      try {
        fs[command](source, dest, ow);
        result = 'Successful copy';
      } catch (_err) {
        result = 'Failed copy';
      }
      return result;
    },
    dirs: function (wd) {
      var result = [];
      var data;
      var temp_file = PPx.Extract('%*temp(ppm_fs.txt,f)');
      PPx.Execute(
        '*execute C,*whereis -path:"' +
          wd +
          '" -listfile:' +
          temp_file +
          ' -mask:"a:d+" -dir:on -subdir:off -name'
      );
      data = fs.OpenTextFile(temp_file, 1, false, -1);
      while (!data.AtEndOfStream) {
        result.push(data.ReadLine());
      }
      data.Close();
      return result.join();
    },
    files: function (wd) {
      var result = [];
      var data;
      var temp_file = PPx.Extract('%*temp(ppm_fs.txt,f)');
      PPx.Execute(
        '*execute C,*whereis -path:"' +
          wd +
          '" -listfile:' +
          temp_file +
          ' -dir:off -subdir:off -name'
      );
      data = fs.OpenTextFile(temp_file, 1, false, -1);
      while (!data.AtEndOfStream) {
        result.push(data.ReadLine());
      }
      data.Close();
      return result.join();
    }
  };
})();
