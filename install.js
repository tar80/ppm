//!*script
/**
 * Install ppx-plugin-manager
 *
 * @version 0.6
 * @arg 0 Install process. 0:user | 1:developer | 2:update
 */

/* constants */
var PPX_VERSION = 18403;
var SCRIPT_VERSION = 18;
var PPM_VERSION = 0.6;
var NEWLINE_CODE = 'crlf';

// Require modules
var MODULES = ['ppxkey', 'ppxmes'];

// Reguire executables
var EXECUTABLES = ['git.exe'];

// CodeType permisson, 0:No restriction | 1:Not use multiByte | 2:Not use unicode
var CODETYPE_PERMISSION = 1;

// ScriptType permisson, 0:No restriction | 1:JS9(5.7) | 2:JS9(5.8) | 3:JS9(ES5) | 4:Chakra(ES6)
var SCRIPTTYPE_PERMISSION = 0;

/* Initial */
var fso = PPx.CreateObject('Scripting.FileSystemObject');
var wd = fso.getFile(PPx.ScriptName).ParentFolder;

var quitMsg = function (msg) {
  PPx.Echo(msg);
  PPx.Quit(-1);
};

var setc = function (item) {
  return PPx.Execute('*setcust ' + item);
};

var reply = function () {
  var args = [].slice.call(arguments);
  var path = wd + '\\lib\\jscript\\' + this.name + '.js';

  if (!fso.FileExists(path)) {
    quitMsg('Not found:\n' + path);
  }

  return PPx.Extract('%*script("' + path + '",' + args + ')');
};

var print = function () {
  var args = [].slice.call(arguments);
  PPx.Execute(
    '*script "' +
      wd +
      '\\lib\\jscript\\' +
      'print.js' +
      '",' +
      this.cmd +
      ',' +
      NEWLINE_CODE +
      ',' +
      this.title +
      ',' +
      args
  );
};

var g_arg = (function (arg) {
  var len = arg.length;
  var result = len === 0 ? 0 : PPx.Arguments(0) | 0;

  if (result > 2) {
    reply.call({name: 'errors'}, 'arg', PPx.ScriptName);
    PPx.Quit(-1);
  }

  return result;
})(PPx.Arguments());

var g_usejs = (function () {
  var num = PPx.Extract('%*getcust(_others:usejs9)') | 0;

  return num === 4 ? 'ecma' : 'jscript';
})();

var plugin_name = 'ppx-plugin-manager';
var home_dir = (function () {
  var home = PPx.Extract("%'HOME'");

  return home !== ''
    ? fso.BuildPath(PPx.Extract("%'home'"), '.ppm')
    : fso.BuildPath(PPx.Extract("%'appdata'"), plugin_name);
})();
var repo_dir = fso.BuildPath(home_dir, 'repo');
var arch_dir = fso.BuildPath(home_dir, 'arch');
var ppm_dir = {
  2: PPx.Extract('%*getcust(S_ppm#global:ppm)'),
  1: wd,
  0: fso.BuildPath(repo_dir, plugin_name)
}[g_arg];
var lib_dir = fso.BuildPath(ppm_dir + '\\lib', g_usejs);
var module_dir = fso.BuildPath(ppm_dir + '\\module', g_usejs);
var cache_dir = fso.BuildPath(home_dir + '\\cache', PPx.Extract('%0').slice(3).replace(/\\/g, '@'));
var config_dir = fso.BuildPath(cache_dir, 'config');
var backup_dir = fso.BuildPath(cache_dir, 'backup');
var script_dir = fso.BuildPath(cache_dir, 'script');
var list_dir = fso.BuildPath(cache_dir, 'list');
var errors = '';

/* Check versions */
(function () {
  var permissions = reply.call(
    {name: 'version'},
    PPX_VERSION + ',' + SCRIPT_VERSION + ',' + CODETYPE_PERMISSION + ',' + SCRIPTTYPE_PERMISSION
  );

  if (permissions) {
    errors += permissions;
  }
})();

/* Check modules */
(function () {
  var notExists = reply.call({name: 'module_exists'}, 2, 0, MODULES);

  if (notExists) {
    errors += 'Not exist modules: ' + notExists.replace(/,/g, ';') + ',';
  }
})();

/* Check executables */
(function () {
  var notExists = reply.call({name: 'exe_exists'}, 2, 0, EXECUTABLES);

  if (notExists) {
    errors += 'Not exist executables: ' + notExists.replace(/,/g, ';') + ',';
  }
})();

/* Check regular expression library */
if (PPx.Extract('%*regexp(?)') !== 'bregonig') {
  errors += 'Requires bregonig.dll';
}

if (errors !== '') {
  g_arg !== 2
    ? print.call({cmd: 'ppe', title: 'INSTALL ABORTING'}, errors)
    : PPx.Execute('*execute BP,*linemessage ' + errors);
  PPx.Quit(-1);
}

/* Local directories and files preparation */
PPx.Execute('*makedir ' + arch_dir);
PPx.Execute('*makedir ' + repo_dir);
PPx.Execute('*makedir ' + config_dir);
PPx.Execute('*makedir ' + backup_dir);
PPx.Execute('*makedir ' + list_dir);
PPx.Execute('*makedir ' + script_dir);
PPx.Execute('*makedir ' + cache_dir + '\\ppm\\setup');
PPx.Execute('*makedir ' + cache_dir + '\\ppm\\unset');
fso.CreateTextFile(cache_dir + '\\ppm\\unset\\linecust.cfg');

if (g_arg === 2) {
  setc('S_ppm#global:version=' + PPM_VERSION);
  PPx.Quit(1);
}

try {
  fso.CopyFile(wd + '\\setting\\patch.cfg', config_dir + '\\' + plugin_name + '.cfg', false);
} catch (_err) {
  null;
}

try {
  fso.CopyFile(wd + '\\sheet\\_pluginlist', list_dir + '\\', false);
} catch (_err) {
  null;
}

try {
  g_arg === 0 && fso.CopyFolder(wd, repo_dir + '\\' + plugin_name, false);
} catch (_err) {
  null;
}

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
setc('S_ppm#global:scripttype=' + g_usejs);
setc('S_ppm#global:dev=' + g_arg);
setc('S_ppm#global:plugins=' + plugin_name);

/* Plugin information */
setc('S_ppm#plugins:' + plugin_name + '=' + ppm_dir);

/* Output settings to file */
PPx.Execute(
  '%Osbd *ppcust CD ' + cache_dir + '\\ppm\\global.cfg' + ' -mask:"S_ppm#global,S_ppm#plugins"'
);

/* Make default setting */
(function () {
  var resultMsg = PPx.Extract(
    '%*script("' + wd + '\\script\\jscript\\build.js",' + plugin_name + ',def,0)'
  );
  !!resultMsg && print.apply({cmd: 'ppe', title: 'BUILD ERROR'}, resultMsg);
})();

/* Set ppm default setting */
setc('@' + cache_dir + '\\ppm\\setup\\' + plugin_name + '.cfg');

/* Print tutorial */
print.call(
  {cmd: 'ppe', title: 'INSTALL SUCCESS'},
  'Installation is complete.',
  'Execute *ppmEdit and complete the ppx-plugin-manager settings.',
  '%%%%: *find "*ppmEdit" -back'
);

PPx.Execute('%K"@SAVECUST"');
