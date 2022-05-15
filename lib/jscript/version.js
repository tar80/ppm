//!*script
/**
 * Check for the PPx versions
 *
 * @version 1.0
 * @return Error message
 * @arg 0 Requires PPxVersion. Specified version or later
 * @arg 1 Requires ScriptModuleRevision. Specified Revision or later
 * @arg 2 CodeType restrictions, 0=No restriction | 1=Not use multiByte | 2=Not use unicode
 * @arg 3 ScriptType restrictions, 0=No restriction | 1=JS9(5.7) | 2=JS9(5.8) | 3=JS9(ES5) | 4=Chakra(ES6)
 * @arg 4 Requires ppmVersion. Specified version or later
 */

var script_name = PPx.scriptName;

var errors = function (method) {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var len = args.length;
  var version = (function (v) {
    return v.length === 3 ? v + '00' : v;
  })(args.item(0));

  if (len < 4) {
    errors('arg');
  }

  return {
    ppxver: Number(version),
    scriptver: Number(args.item(1)),
    codetype: Number(args.item(2)),
    scripttype: Number(args.item(3)),
    ppmver: len > 4 && Number(args.item(4))
  };
})(PPx.Arguments());
var codetype = PPx.CodeType;
var ppxversion = PPx.PPxVersion;
var moduleversion = PPx.ModuleVersion;
var usejs = Number(PPx.Extract('%*getcust(_others:usejs9)'));
var ppmversion = Number(PPx.Extract('%*getcust(S_ppm#global:version)'));
var result = {};

result.codetype = (function () {
  var ct = '';
  if (g_args.codetype && g_args.codetype + codetype !== 2) {
    ct = 'Not Support ' + {0: 'MultiByte', 1: 'Unicode'}[codetype] + ' PPx,';
  }

  return ct;
})();

result.ppxver = (function () {
  var pv = '';
  if (g_args.ppxver > ppxversion) {
    pv = 'Requires PPx version ' + g_args.ppxver + ' or later,';
  }

  return pv;
})();

result.scriptver = (function () {
  var sv = '';
  if (g_args.scriptver > moduleversion) {
    sv = 'Requires ScriptModule R' + g_args.scriptver + ' or later,';
  }

  return sv;
})();

result.scripttype = (function () {
  var st = '';
  if (g_args.scripttype && g_args.scripttype !== usejs) {
    var typeS = {
      1: 'JS9(5.7)',
      2: 'JS9(5.8)',
      3: 'JS9(ES5)',
      4: 'Chakra(ES6)'
    }[g_args.scripttype];

    st = 'Must be use ' + typeS + '. Set the value of _others:userjs9=' + g_args.scripttype + ',';
  }

  return st;
})();

result.ppmver = (function () {
  var pm = '';
  if (g_args.ppmver > ppmversion) {
    pm = 'Requires ppx-plugin-manager version ' + g_args.ppmver + ' or later,';
  }

  return pm;
})();

PPx.Result = result.codetype + result.ppxver + result.scriptver + result.scripttype + result.ppmver;
