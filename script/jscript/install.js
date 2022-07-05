//!*script
/**
 * Install plugins
 *
 * @rag 0 If nonzero dry run
 */

PPx.Execute('*job start');
PPx.Execute('%Oa *ppb -bootid:p');
PPx.Execute('*wait 200,2');

/* Line feed code for output file */
var NEWLINE = '\r\n';

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

var dry_run = PPx.Arguments.Length ? PPx.Arguments.Item(0) | 0 : 0;

var fso = PPx.CreateObject('Scripting.FileSystemObject');

var install = function (pluginname, path, lines) {
  var wd = fso.getFile(PPx.ScriptName).ParentFolder;
  var line = function (num) {
    var data = lines[num].split('=');
    return {key: data[0], value: data[1]};
  };
  var info = {};
  var thisLine;

  for (var i = 1, l = lines.length; i < l; i++) {
    thisLine = line(i);

    if (thisLine.key === '' || thisLine.key.indexOf('#') === 0) {
      continue;
    }

    if (typeof thisLine.value !== 'undefined') {
      info[thisLine.key] = thisLine.value;
    }
  }

  /* Check versions */
  var versions = util.reply.call({name: 'version'}, [
    info.PPX_VERSION +
      ',' +
      info.SCRIPT_VERSION +
      ',' +
      info.CODETYPE_PERMISSION +
      ',' +
      info.SCRIPTTYPE_PERMISSION +
      ',' +
      info.PPM_VERSION
  ]);

  /* Check executables */
  var exeNames = (function (exe) {
    var result = exe.length > 0 ? util.reply.call({name: 'exe_exists'}, 2, 0, exe) : '';

    if (result !== '') {
      result = 'Not exist executables: ' + result + ',';
    }

    return result;
  })(info.EXECUTABLES);

  /* Check modules */
  var moduleNames = (function (mod) {
    var result = mod.length > 0 ? util.reply.call({name: 'module_exists'}, 2, 0, mod) : '';

    if (result !== '') {
      result = 'Not exist modules: ' + result + ',';
    }

    return result;
  })(info.MODULES);

  var thisDep = (function (dep) {
    var dep_ = dep.split(',');
    var result = dep_[0] !== '' ? '>Dependent plugins: ' + dep_.join(' ') : '';
    return result;
  })(info.DEPENDENCIES);

  (function (files, scripts, specdir) {
    var copyfile = function (send, dest) {
      var destDir = PPx.Extract('%*getcust(S_ppm#global:cache)') + '\\' + dest + '\\';
      var sendDir = path + '\\' + send + '\\*';

      if (!fso.FolderExists(destDir)) {
        PPx.Execute('*makedir ' + destDir);
      }

      try {
        fso.CopyFile(sendDir, destDir, false);
      } catch (_err) {
        null;
      }
    };

    if (dry_run === 0 && files === 'true') {
      copyfile('sheet', 'list');
    }

    if (dry_run === 0 && scripts === 'true') {
      copyfile('userscript', 'script');
    }

    if (dry_run === 0 && specdir !== '') {
      copyfile(specdir, specdir);
    }
  })(info.COPY_FLAG, info.COPY_SCRIPT, info.SPECIFIC_COPY_DIR);

  return versions + exeNames + moduleNames + thisDep;
};

var resultMsg = (function () {
  var list = util.readLines(util.getc('S_ppm#global:cache') + '\\list\\_pluginlist');
  var enable = util.getc('S_ppm#global:plugins').split(',');
  var ppm = {name: 'ppx-plugin-manager', path: util.getc('S_ppm#global:ppm')};
  var curlOutput = PPx.Extract('%*temp()%\\curl_stdout');
  var result = [ppm.name];
  var msg = [];
  var thisLine = [];
  var depends = '';
  var name, path, url, lines, errorlevel, errorMsg;
  var reg = /^([^\s]+)\s+['"](.+)['"]/;

  var setcPlugins = function (key, value) {
    return PPx.Execute('*setcust S_ppm#plugins:' + key + '=' + value);
  };

  var copyPatch = function (wd, plugin) {
    try {
      fso.CopyFile(
        wd + '\\setting\\patch.cfg',
        util.getc('S_ppm#global:cache') + '\\config\\' + plugin + '.cfg',
        false
      );
    } catch (_err) {
      null;
    }
  };

  for (var i = 0, l = list.data.length; i < l; i++) {
    thisLine = list.data[i].replace(reg, '$1,$2').split(',');

    if (thisLine[0] === 'remote') {
      name = thisLine[1].slice(thisLine[1].indexOf('/') + 1);
      path = util.getc('S_ppm#global:home') + '\\repo\\' + thisLine[1].replace('/', '\\');

      if (fso.FolderExists(path)) {
        !~enable.indexOf(name) && setcPlugins(name, path);
        result.push(name);
        msg.push('Holding: ' + path);
        continue;
      }

      if (dry_run !== 0) {
        msg.push('Installation target: ' + path);
        continue;
      }

      if (!fso.FolderExists(path)) {
        url = 'https://raw.githubusercontent.com/' + thisLine[1] + '/master/install';
        PPx.Execute('%Os curl -fsL ' + url + '>"' + curl_output + '"');
        lines = util.readLines(curl_output).data;

        if (typeof lines[0] === 'undefined' || !~lines[0].indexOf(name)) {
          msg.push(
            'Failed: ' + thisLine[1] + ' [URL does not exist or not a ppm-plugin repository]'
          );
          continue;
        }

        url = 'https://github.com/' + thisLine[1];
        errorlevel = PPx.Extract('%Os git clone ' + url + ' ' + path + ' %: %*errorlevel');

        if (errorlevel !== '0') {
          msg.push('Failed: ' + thisLine[1] + ' [Git clone failed]');
          continue;
        }
      }

      setcPlugins(name, path);

      errorMsg = install(name, path, lines);

      if (errorMsg !== '') {
        if (errorMsg.indexOf('>Dependent plugins:') !== 0) {
          msg.push(
            'Failed: ' + name + '%%bn%%bt' + errorMsg.slice(0, -1).replace(/,/g, '%%bn%%bt')
          );
          continue;
        }

        depends = '%%bn%%bt' + errorMsg;
      }

      errorMsg = PPx.Extract(
        '%*script("' +
          util.getc('S_ppm#global:ppm') +
          '\\script\\jscript\\build.js",' +
          name +
          ',def,0)'
      );

      if (errorMsg !== '') {
        msg.push('Failed: ' + name + ' ' + errorMsg);
        continue;
      }

      result.push(name);
      copyPatch(path, name);
      msg.push('Install: ' + thisLine[1]);
      continue;
    }

    if (thisLine[0] === 'local') {
      name = thisLine[1].slice(thisLine[1].lastIndexOf('\\') + 1);
      path = thisLine[1];

      if (~enable.indexOf(name)) {
        result.push(name);
        msg.push('Holding: ' + path);
        continue;
      }

      if (dry_run !== 0) {
        msg.push('Installation target: ' + path);
        continue;
      }

      if (!fso.FolderExists(path)) {
        msg.push('Failed: ' + name + ',%%bn%%bt' + 'Not exist ' + path);
        continue;
      }

      lines = util.readLines(path + '\\install').data;

      if (!~lines[0].indexOf(name)) {
        msg.push('Failed: ' + thisLine[1] + ' [Not a ppm-plugin repository]');
        continue;
      }

      errorMsg = install(name, path, lines);

      if (errorMsg !== '') {
        if (errorMsg.indexOf('>Dependent plugins:') !== 0) {
          msg.push(
            'Failed: ' + name + '%%bn%%bt' + errorMsg.slice(0, -1).replace(/,/g, '%%bn%%bt')
          );
          continue;
        }

        depends = '%%bn%%bt' + errorMsg;
      }

      setcPlugins(name, path);

      errorMsg = PPx.Extract(
        '%*script("' +
          util.getc('S_ppm#global:ppm') +
          '\\script\\jscript\\build.js",' +
          name +
          ',def,0)'
      );

      if (errorMsg !== '') {
        msg.push('Failed: ' + name + ' ' + errorMsg.replace(',', '%%bn%%bt'));
        continue;
      }

      result.push(name);
      copyPatch(path, name);
      msg.push('Install: ' + path + depends);
      continue;
    }
  }

  if (dry_run === 0) {
    util.setc('S_ppm#global:plugins=' + result.join());
    util.write.apply(
      {filepath: util.getc('S_ppm#global:cache') + '\\list\\enable_plugins.txt', newline: NEWLINE},
      result
    );
  }

  return msg;
})();

PPx.Execute('*job end');

resultMsg.length
  ? util.print.apply({cmd: 'ppe', title: 'PLUGIN INSTALLATION RESULT'}, resultMsg)
  : util.print.call({cmd: 'ppe', title: 'PLUGIN INSTALLATION RESULT'}, 'Not specify plugin.');

PPx.Execute('*closeppx BP');
