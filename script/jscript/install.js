//!*script
/**
 * Install plugins
 *
 * @rag 0 If nonzero dry run
 */

var NL_CHAR = '\r\n';

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
module = null;

var DEP_TITLE = '>Dependent plugins:';
var curl_output = PPx.Extract('%*temp()%\\curl_stdout');
var dry_run = PPx.Arguments.length ? PPx.Arguments.Item(0) | 0 : 0;
var cache_dir = util.getc('S_ppm#global:cache');
var ppm_dir = util.getc('S_ppm#global:ppm');

var fso = PPx.CreateObject('Scripting.FileSystemObject');

var resultMsg = (function () {
  var newPlugins = ['ppx-plugin-manager'];
  var disablePlugins = util.getc('S_ppm#plugins').split(NL_CHAR);
  var candidates = util.readLines(cache_dir + '\\list\\_pluginlist');
  var reg = /^([^\s]+)\s+['"](.+)['"]/;
  var installInfo = {};
  var msg = [];
  var lines = [];
  var name, path, url, errorlevel, errorMsg;

  var permissions = function () {
    var line = function (num) {
      var data = lines[num].split('=');

      return {key: data[0], value: data[1]};
    };

    if (typeof lines[0] === 'undefined' || !~lines[0].indexOf(name)) {
      return 'Failed: ' + lines[1] + ' [Not a ppm-plugin repository]';
    }

    for (var i = 1, l = lines.length; i < l; i++) {
      var thisLine = line(i);

      if (thisLine.key === '' || thisLine.key.indexOf('#') === 0) {
        continue;
      }

      if (typeof thisLine.value !== 'undefined') {
        installInfo[thisLine.key] = thisLine.value;
      }
    }

    // Check versions
    var versions = (function () {
      var result = util.reply.call(
        {name: 'version'},
        installInfo.PPX_VERSION,
        installInfo.SCRIPT_VERSION,
        installInfo.CODETYPE_PERMISSION,
        installInfo.SCRIPTTYPE_PERMISSION,
        installInfo.PPM_VERSION
      );

      return result.split(',').length > 1 ? result + ',' : '';
    })();

    // Check executables
    var exeNames = (function (exe) {
      var result = exe.length > 0 ? util.reply.call({name: 'exe_exists'}, 2, 1, exe) : '';

      return result.split(',').length > 1 ? result.replace(/,/g, ' ') + ',' : '';
    })(installInfo.EXECUTABLES);

    // Check modules
    var moduleNames = (function (mod) {
      var result = mod.length > 0 ? util.reply.call({name: 'module_exists'}, 2, 1, mod) : '';

      return result.split(',').length > 1 ? result.replace(/,/g, ' ') + ',' : '';
    })(installInfo.MODULES);

    // Check dependencies
    var thisDep = (function (dep) {
      var dep_ = dep.split(',');

      return dep_[0] !== '' ? DEP_TITLE + dep_.join(' ') : '';
    })(installInfo.DEPENDENCIES);

    return versions + exeNames + moduleNames + thisDep;
  };

  var setcPlugins = function () {
    var copyFiles = function (send, dest) {
      var tempFile = PPx.Extract('%*temp()%\\copyfiles.txt');
      var sendDir = path + '\\' + send;
      var destDir = cache_dir + '\\' + dest;

      if (!fso.FolderExists(destDir)) {
        fso.CreateFolder(destDir);
      }

      PPx.Execute('*whereis -name -utf8 -dir -path:"' + sendDir + '" -listfile:"' + tempFile + '"');

      var text = fso.OpenTextFile(tempFile, 1, -1);

      if (text.atEndOfStream) {
        return;
      }

      var paths = text.ReadAll().split(NL_CHAR);

      text.Close();

      var copy = function (callback) {
        for (var i = 0, l = paths.length - 1; i < l; i++) {
          var sendPath = paths[i];
          var destPath = fso.BuildPath(destDir, sendPath.slice(sendDir.length));

          callback(sendPath, destPath);
        }
      };

      copy(function (source, dest) {
        if (fso.FolderExists(source) && !fso.FolderExists(dest)) {
          fso.CreateFolder(dest);
        }
      });
      copy(function (source, dest) {
        if (fso.FileExists(source) && !fso.FileExists(dest)) {
          fso.copyFile(source, dest);
        }
      });
    };

    if (dry_run === 0 && installInfo.COPY_FLAG === 'true') {
      copyFiles('sheet', 'list');
    }

    if (dry_run === 0 && installInfo.COPY_SCRIPT === 'true') {
      copyFiles('userscript', 'script');
    }

    var spec_dir, thisDir;

    if (dry_run === 0 && installInfo.SPECIFIC_COPY_DIR !== '') {
      spec_dir = installInfo.SPECIFIC_COPY_DIR.split(',');
      for (var i = 0; i < spec_dir.length; i++) {
        thisDir = spec_dir[i];
        copyFiles(thisDir, thisDir);
      }
    }

    var userPatch = cache_dir + '\\config\\' + name + '.cfg';

    if (dry_run === 0 && !fso.FileExists(userPatch)) {
      fso.CopyFile(path + '\\setting\\patch.cfg', userPatch, false);
    }

    util.setc('S_ppm#plugins:' + name + '=' + path);

    for (var j = 1, k = disablePlugins.length - 2; j < k; j++) {
      var thisPlugin = disablePlugins[j];
      if (~thisPlugin.indexOf(name)) {
        disablePlugins.splice(j, 1);
      }
    }
  };

  // Check use Jscript version
  (function () {
    var useJs = util.getc('_others:usejs9');
    var type = useJs === '4' ? 'ecma' : 'jscript';
    var pwd = util.getc('S_ppm#global:ppm');

    util.setc('S_ppm#global:scripttype=' + type);
    util.setc('S_ppm#global:module=' + pwd + '\\module\\' + type);
    util.setc('S_ppm#global:lib=' + pwd + '\\lib\\' + type);
  })();

  /* Main loop */
  PPx.Execute('*deletecust "S_ppm#plugins"');
  PPx.Execute('*setcust S_ppm#plugins:ppx-plugin-manager=' + ppm_dir);

  for (var i = 0, l = candidates.data.length; i < l; i++) {
    var depends = '';
    var thisLine = candidates.data[i].replace(reg, '$1,$2').split(',');

    if (thisLine[0] === 'remote') {
      name = thisLine[1].slice(thisLine[1].indexOf('/') + 1);
      path = util.getc('S_ppm#global:home') + '\\repo\\' + thisLine[1].replace('/', '\\');

      if (dry_run !== 0) {
        msg.push('Installation target: ' + path);
        continue;
      }

      if (fso.FolderExists(path)) {
        lines = util.readLines(path + '\\install').data;

        errorMsg = permissions();

        if (errorMsg !== '') {
          if (errorMsg.indexOf(DEP_TITLE) !== 0) {
            msg.push(
              'Failed: ' + name + '%%bn%%bt' + errorMsg.slice(0, -1).replace(/,/g, '%%bn%%bt')
            );
            continue;
          }

          depends = '%%bn%%bt' + errorMsg;
        }
      } else {
        url = 'https://raw.githubusercontent.com/' + thisLine[1] + '/master/install';
        PPx.Execute('%Os @curl -fsL ' + url + '>"' + curl_output + '"');
        lines = util.readLines(curl_output).data;

        if (lines[0] === undefined || !~lines[0].indexOf(name)) {
          msg.push('Failed: ' + lines[1] + ' [URL does not exist of not a ppm-plugin repository]');
          continue;
        }

        errorMsg = permissions();

        if (errorMsg !== '') {
          if (errorMsg.indexOf(DEP_TITLE) !== 0) {
            msg.push(
              'Failed: ' + name + '%%bn%%bt' + errorMsg.slice(0, -1).replace(/,/g, '%%bn%%bt')
            );
            continue;
          }

          depends = '%%bn%%bt' + errorMsg;
        }

        url = 'https://github.com/' + thisLine[1];
        errorlevel = PPx.Extract('%Os git clone ' + url + ' ' + path + ' %: %*errorlevel');

        if (errorlevel !== '0') {
          msg.push('Failed: ' + thisLine[1] + ' [Git clone failed]');
          continue;
        }
      }

      setcPlugins();
      errorMsg = PPx.Extract(
        '%*script("' + ppm_dir + '\\script\\jscript\\build.js",' + name + ',def,0)'
      );

      if (errorMsg !== '') {
        msg.push('Failed: ' + name + ' ' + errorMsg.replace(',', '%%bn%%bt'));
        continue;
      }

      newPlugins.push(name);
      msg.push('Install: ' + thisLine[1]);
      continue;
    }

    if (thisLine[0] === 'local') {
      name = thisLine[1].slice(thisLine[1].lastIndexOf('\\') + 1);
      path = thisLine[1];

      if (dry_run !== 0) {
        msg.push('Installation target: ' + path);
        continue;
      }

      if (!fso.FolderExists(path)) {
        msg.push('Failed: ' + name + ',%%bn%%bt' + 'Not exist ' + path);
        continue;
      }

      lines = util.readLines(path + '\\install').data;

      errorMsg = permissions();

      if (errorMsg !== '') {
        if (errorMsg.indexOf(DEP_TITLE) !== 0) {
          msg.push(
            'Failed: ' + name + '%%bn%%bt' + errorMsg.slice(0, -1).replace(/,/g, '%%bn%%bt')
          );
          continue;
        }

        depends = '%%bn%%bt' + errorMsg;
      }

      setcPlugins();
      errorMsg = PPx.Extract(
        '%*script("' + ppm_dir + '\\script\\jscript\\build.js",' + name + ',def,0)'
      );

      if (errorMsg !== '') {
        PPx.Echo(name, errorMsg);
        msg.push('Failed: ' + name + ' ' + errorMsg.replace(',', '%%bn%%bt'));
        continue;
      }

      newPlugins.push(name);
      msg.push('Install: ' + path + depends);
      continue;
    }
  }

  (function () {
    if (dry_run !== 0) {
      return;
    }

    for (var i = 1, l = disablePlugins.length - 2; i < l; i++) {
      var thisPlugin = disablePlugins[i].replace(/^@/, '');

      if (thisPlugin.indexOf('ppx-plugin-manager') === 0) {
        continue;
      }

      newPlugins.push('@' + thisPlugin.split(/\s/)[0]);
      util.setc('S_ppm#plugins:@' + thisPlugin.replace(/^@/, ''));
    }

    util.write.apply(
      {
        filepath: cache_dir + '\\list\\enable_plugins.txt',
        newline: NL_CHAR
      },
      newPlugins
    );
  })();

  return msg;
})();

resultMsg.length
  ? util.print.apply({cmd: 'ppe', title: 'PLUGIN INSTALLATION RESULT'}, resultMsg)
  : util.print.call({cmd: 'ppe', title: 'PLUGIN INSTALLATION RESULT'}, 'Plugin not specified.');

PPx.Execute('*closeppx BP');
PPx.Execute('*job end');
