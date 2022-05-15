//!*script
/**
 * Install plugins
 *
 * @rag 0 If nonzero dry run
 */

PPx.Execute('*job start');
PPx.Execute('*set ppm_running=1');
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

var resultMsg = (function () {
  var list = util.lines(util.getc('S_ppm#global:cache') + '\\list\\_pluginlist');
  var enable = util.getc('S_ppm#global:plugins').split(',');
  var ppm = {name: 'ppx-plugin-manager', path: util.getc('S_ppm#global:ppm')};
  var result = [ppm.name];
  var msg = [];
  var thisLine = [];
  var name, path, url, errorlevel, errorMsg;
  var reg = /^([^\s]+)\s+['"](.+)['"]/;
  var fso = PPx.CreateObject('Scripting.FileSystemObject');

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

      if (~enable.indexOf(name) && fso.FolderExists(path)) {
        result.push(name);
        msg.push('Holding: ' + path);
        continue;
      }

      if (dry_run !== 0) {
        msg.push('Installation target: ' + path);
        continue;
      }

      if (!fso.FolderExists(path)) {
        url = 'https://raw.githubusercontent.com/' + thisLine[1] + '/master/setting/base.cfg';
        errorlevel = PPx.Extract('%Os curl -fsL ' + url + '>nul %: %*errorlevel');

        if (errorlevel !== '0') {
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

      errorMsg = PPx.Extract('%*script("' + path + '\\install.js")');

      if (errorMsg !== '') {
        msg.push('Failed: ' + name + ',%%bt' + errorMsg.slice(0, -1).replace(/,/g, ',%%bt'));
        continue;
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
      msg.push('Success: ' + thisLine[1]);
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

      errorMsg = PPx.Extract('%*script("' + path + '\\install.js")');

      if (errorMsg !== '') {
        msg.push('Failed: ' + name + ',%%bn%%bt' + errorMsg.slice(0, -1).replace(/,/g, '%%bn%%bt'));
        continue;
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
      msg.push('Install: ' + path);
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

PPx.Execute('*set ppm_running=');
PPx.Execute('*job end');

resultMsg.length
  ? util.print.apply({cmd: 'ppe', title: 'PLUGIN INSTALLATION RESULT'}, resultMsg)
  : util.print.call({cmd: 'ppe', title: 'PLUGIN INSTALLATION RESULT'}, 'Not specify plugin.');

PPx.Execute('*closeppx BP');
