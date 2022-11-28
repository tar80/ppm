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

var require = (function (args) {
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
    usejs: Number(args.item(3)),
    ppmver: len > 4 && Number(args.item(4))
  };
})(PPx.Arguments);

var actual = {
  codetype: PPx.CodeType,
  ppxver: PPx.PPxVersion,
  scriptver: PPx.ModuleVersion,
  usejs: Number(PPx.Extract('%*getcust(_others:usejs9)')),
  ppmver: Number(PPx.Extract('%*getcust(S_ppm#global:version)'))
};

var result = [];

if (require.codetype && require.codetype + actual.codetype !== 2) {
  result.push('Not Support PPx ' + {0: 'MultiByte', 1: 'Unicode'}[codetype]);
}

if (require.ppxver > actual.ppxver) {
  result.push('Requires PPx version ' + require.ppxver + ' or later');
}

if (require.scriptver > actual.scriptver) {
  result.push('Requires ScriptModule R' + require.scriptver + ' or later');
}

(function () {
  if (require.usejs && require.usejs !== actual.usejs) {
    var typeS = {
      1: 'JS9(5.7)',
      2: 'JS9(5.8)',
      3: 'JS9(ES5)',
      4: 'Chakra(ES6)'
    }[require.usejs];

    result.push(
      'Must be use ' + typeS + '. Set the value of _others:userjs9=' + require.usejs
    );
  }
})();

if (require.ppmver > actual.ppmver) {
  result.push('Requires ppx-plugin-manager version ' + require.ppmver + ' or later');
}

PPx.Result = result.toString();
