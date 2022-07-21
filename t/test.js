//!*script
/**
 * test functions
 *
 */

var fso = PPx.CreateObject('Scripting.FileSystemObject');
var wd = fso.getFile(PPx.ScriptName).ParentFolder;
var pwd = wd.ParentFolder;

if (PPx.Extract('%*getcust(S_ppm#global:ppm)') === '') {
  PPx.Echo('Must be installed ppm.');
  PPx.Quit(1);
}

var reply = function () {
  var args = [].slice.call(arguments);
  return PPx.Extract('%*script("' + pwd + '\\lib\\jscript\\' + this.name + '.js",' + args + ')');
};

var print = function (errors) {
  /**
   * errors
   *
   * @param 0 {string} key
   * @param 1 {boolean} multi lines
   * @param 2 {string} message
   */
  var errMsg = '';

  for (var item in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, item)) {
      if (errors[item].multi === true) {
        errMsg = errors[item].key + ': [,%%bt' + errors[item].msg + '],';
        continue;
      }

      errMsg += '"' + errors[item].key + ': ' + errors[item].msg + '",';
    }
  }

  PPx.Execute(
    '*script "' +
      pwd +
      '\\lib\\jscript\\print.js",ppe,crlf,' +
      test_func.toUpperCase() +
      ',' +
      errMsg
  );
};

var test_func =
  PPx.Extract(
    '%*input("" -title:"test.." -k *completelist -list:off -detail:"user" -file:"' +
      wd +
      '\\compl.txt")'
  ) || PPx.Quit(-1);

var test = {};

test['operating_conditions'] = function () {
  var e = {};

  // Check versions
  var ver = 'version';
  e[ver] = {
    key: ver,
    multi: true,
    msg: reply.call({name: ver}, 999, 999, 2, 3, 999).replace(/,/g, ',%%bt')
  };

  // Check executables
  var exe = 'exe_exists';
  e[exe] = {
    key: exe,
    multi: false,
    msg: reply.call({name: exe}, 2, 1, 'test-ppm1.exe,test-ppm2,git')
  };

  // Check modules
  var mod = 'module_exists';
  e[mod] = {
    key: mod,
    multi: false,
    msg: reply.call({name: mod}, 2, 1, 'ppxtest.dll,test64')
  };

  // Check regular expression library
  var lib = 'Reguler expression';
  var regexp = 'bregxxx';
  e[lib] = {
    key: lib,
    multi: false,
    msg: PPx.Extract('%*regexp(?)') !== regexp && 'Requires ' + regexp + '.dll'
  };

  print(e);
};

test['build'] = function () {
  PPx.Extract('%*script(' + pwd + '\\script\\jscript\\build.js,ppx-plugin-manager,def,1)');
};

test['setup_reset'] = function () {
  PPx.Execute(
    '*ppb -bootid:p%:*wait 300%:%On *ppb -c *script ' + pwd + '\\script\\jscript\\setup.js,reset,1'
  );
};

test['cleanup'] = function () {
  PPx.Extract('%*script(' + pwd + '\\script\\jscript\\cleanup.js,1)');
};

test[test_func]();
