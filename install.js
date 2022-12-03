//!*script
/**
 * Install ppx-plugin-manager
 *
 * @version 0.87
 * @arg 0 Install process. 0=user | 1=developer | 2=update
 * @arg 1 If nonzero, only check the permission. do not install.
 */

var NL_CODE = 'crlf';
var NL_CHAR = '\r\n';

/* Initial */
var fso = PPx.CreateObject('Scripting.FileSystemObject');
var parent_dir = PPx.Extract('%*name(D,"' + PPx.ScriptName + '")');
var script_name = PPx.Extract('%*name(C,"' + PPx.ScriptName + '")');

/* constants */
var PLUGIN_NAME = 'ppx-plugin-manager';
var PPX_VERSION = 186;
var SCRIPT_VERSION = 18;
var PPM_VERSION = 0.87;

// Require modules
var MODULES = ['ppxkey', 'ppxmes'];

// Reguire executables
var EXECUTABLES = ['git.exe'];

// CodeType permisson, 0:No restriction | 1:Not use multiByte | 2:Not use unicode
var CODETYPE_PERMISSION = 1;

// ScriptType permisson, 0:No restriction | 1:JS9(5.7) | 2:JS9(5.8) | 3:JS9(ES5) | 4:Chakra(ES6)
var SCRIPTTYPE_PERMISSION = 0;

var quitMsg = function (msg) {
  PPx.Echo(script_name + NL_CHAR + NL_CHAR + msg);
  PPx.Quit(-1);
};

var getc = function (item) {
  return PPx.Extract('%*getcust(' + item + ')');
};

var setc = function (item) {
  return PPx.Execute('*setcust ' + item);
};

var reply = function () {
  var args = [].slice.call(arguments);
  var path = parent_dir + '\\lib\\jscript\\' + this.name + '.js';

  if (!fso.FileExists(path)) {
    quitMsg('Not found:\n' + path);
  }

  return PPx.Extract('%*script("' + path + '",' + args + ')');
};

var print = function () {
  var args = [].slice.call(arguments);
  PPx.Execute(
    '*script "' +
      parent_dir +
      '\\lib\\jscript\\' +
      'print.js' +
      '",' +
      this.cmd +
      ',' +
      NL_CODE +
      ',' +
      this.title +
      ',' +
      args
  );
};

var install = (function (args) {
  var len = args.length;
  var proc = len === 0 ? 0 : args.Item(0) | 0;

  if (proc > 2) {
    reply.call({name: 'errors'}, 'arg', PPx.ScriptName);
    PPx.Quit(-1);
  }

  var dryrun = len > 1 ? args.Item(1) | 0 : 0;
  return {
    proc: proc,
    dryrun: dryrun
  };
})(PPx.Arguments);

var use_js = (function () {
  var num = getc('_others:usejs9');

  return num === '4' ? 'ecma' : 'jscript';
})();

var home_dir = (function () {
  var home = PPx.Extract("%'HOME'");

  return home !== ''
    ? fso.BuildPath(PPx.Extract("%'home'"), '.ppm')
    : fso.BuildPath(PPx.Extract("%'appdata'"), PLUGIN_NAME);
})();
var repo_dir = fso.BuildPath(home_dir, 'repo');
var arch_dir = fso.BuildPath(home_dir, 'arch');
var ppm_dir = {
  2: getc('S_ppm#global:ppm'),
  1: parent_dir,
  0: fso.BuildPath(repo_dir, PLUGIN_NAME)
}[install.proc];
var lib_dir = fso.BuildPath(ppm_dir + '\\lib', use_js);
var module_dir = fso.BuildPath(ppm_dir + '\\module', use_js);
var cache_dir = fso.BuildPath(home_dir + '\\cache', PPx.Extract('%0').slice(3).replace(/\\/g, '@'));
var config_dir = fso.BuildPath(cache_dir, 'config');
var backup_dir = fso.BuildPath(cache_dir, 'backup');
var script_dir = fso.BuildPath(cache_dir, 'script');
var list_dir = fso.BuildPath(cache_dir, 'list');

/* Check operating conditions */
(function () {
  var errors = '';
  var permissions = reply.call(
    {name: 'version'},
    PPX_VERSION,
    SCRIPT_VERSION,
    CODETYPE_PERMISSION,
    SCRIPTTYPE_PERMISSION
  );
  var modules = reply.call({name: 'module_exists'}, 2, 1, MODULES);
  var executables = reply.call({name: 'exe_exists'}, 2, 1, EXECUTABLES);

  permissions && (errors += permissions + ',');
  modules.split(',').length > 1 && (errors += modules.replace(/,/g, ' ') + ',');
  executables.split(',').length > 1 && (errors += executables.replace(/,/g, ' ') + ',');

  PPx.Extract('%*regexp(?)') !== 'bregonig' && (errors += 'Requires bregonig.dll,');

  if (errors !== '') {
    install.proc !== 2
      ? print.apply({cmd: 'ppe', title: 'INSTALL ABORTING'}, errors.split(','))
      : PPx.Execute('*execute BP,*linemessage ' + errors.replace(/,/g, '%%bn'));
    PPx.Quit(-1);
  }
})();

if (install.dryrun !== 0) {
  quitMsg('Installation is possible.');
}

/* Local directories and files preparation */
(function () {
  var paths = [
    arch_dir,
    repo_dir,
    config_dir,
    backup_dir,
    list_dir,
    script_dir,
    cache_dir + '\\ppm\\setup',
    cache_dir + '\\ppm\\unset'
  ];

  for (var i = 0, l = paths.length; i < l; i++) {
    PPx.Execute('*makedir ' + paths[i]);
  }

  fso.CreateTextFile(cache_dir + '\\ppm\\unset\\linecust.cfg');

  if (install.proc === 2) {
    setc('S_ppm#global:version=' + PPM_VERSION);
    PPx.Quit(1);
  }

  try {
    fso.CopyFile(
      parent_dir + '\\setting\\patch.cfg',
      config_dir + '\\' + PLUGIN_NAME + '.cfg',
      false
    );
  } catch (_err) {
    null;
  }

  try {
    fso.CopyFile(parent_dir + '\\sheet\\_pluginlist', list_dir + '\\', false);
  } catch (_err) {
    null;
  }

  try {
    install.proc === 0 && fso.CopyFolder(parent_dir, repo_dir + '\\' + PLUGIN_NAME, false);
  } catch (_err) {
    null;
  }
})();

/* Buckup current setting */
PPx.Execute('%Osbd *ppcust CD %*name(DC,"' + backup_dir + '\\initial.cfg") -nocomment');

/* Initial settings */
PPx.Execute('*deletecust "S_ppm#plugins"');
PPx.Execute('*deletecust "S_ppm#user"');

/* Global settings */
setc('S_ppm#global:version=' + PPM_VERSION);
setc('S_ppm#global:home=' + home_dir);
setc('S_ppm#global:ppm=' + ppm_dir);
setc('S_ppm#global:lib=' + lib_dir);
setc('S_ppm#global:module=' + module_dir);
setc('S_ppm#global:cache=' + cache_dir);
setc('S_ppm#global:scripttype=' + use_js);
setc('S_ppm#global:dev=' + install.proc);

/* Plugin information */
setc('S_ppm#plugins:' + PLUGIN_NAME + '=' + ppm_dir);

/* Output settings to file */
PPx.Execute(
  '%Osbd *ppcust CD ' + cache_dir + '\\ppm\\global.cfg -mask:"S_ppm#global,S_ppm#plugins"'
);

/* Make default setting */
(function () {
  var resultMsg = PPx.Extract(
    '%*script("' + parent_dir + '\\script\\jscript\\build.js",' + PLUGIN_NAME + ',def,0)'
  );

  if (resultMsg !== '') {
    print.call({cmd: 'ppe', title: 'BUILD ERROR'}, resultMsg);
    PPx.Quit(1);
  }
})();

/* Set ppm default setting */
setc('@' + cache_dir + '\\ppm\\setup\\' + PLUGIN_NAME + '.cfg');

/* Print tutorial */
print.call(
  {cmd: 'ppe', title: 'INSTALL SUCCESS'},
  'Installation is complete.',
  'Execute *ppmEdit and complete the ppx-plugin-manager settings.',
  '%%%%: *find "*ppmEdit" -back'
);

PPx.Execute('%K"@SAVECUST"');
