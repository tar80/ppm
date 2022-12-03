//!*script
/**
 * Check for the existence of the PPx Modules and Common Archivers Library
 *
 * @return Whether the PPx Module exists
 * @arg 0  0=all | 1=exists | 2=not exists
 * @arg 1  Return description. 0:false | 1:true
 * @arg 2+ Comma separated module names
 *
 * NOTE:Module names can abbreviated like this
 * PPXWIN64.dll -> PPXWIN
 */

var script_name = PPx.scriptName;
var path = (function () {
  var fso = PPx.CreateObject('Scripting.FileSystemObject');
  var wd = fso.GetFile(script_name).ParentFolder;

  return {
    wd: wd,
    home: fso.GetAbsolutePathName(wd + '\\..\\..\\')
  };
})();

var errors = function (method) {
  PPx.Execute('*script "' + path.wd + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

PPx.result = (function (args) {
  var len = args.length;
  if (len < 2) {
    errors('arg');
  }

  var returns = {
    0: {state: 'all', desc: 'Module state.'},
    1: {state: true, desc: 'Exist modules.'},
    2: {state: false, desc: 'Not Exist modules.'}
  }[args.Item(0)];
  var description = {
    0: false,
    1: true
  }[args.Item(1)];

  var modules = (function () {
    result = [];

    for (var i = 2; i < len; i++) {
      result.push(args.Item(i));
    }

    return result;
  })();

  var files = PPx.Extract('%*script("' + path.home + '\\lib\\jscript\\stdoutw.js","%0","dir /b")');

  var existenceOf = function (name) {
    reg = RegExp('^' + name.replace(/32\.dll|64\.dll|32|64|\.dll/, '') + '(32|64)?.DLL', 'mi');

    return reg.test(files);
  };

  var result = [];
  var reg = /^([\w-]*)(\.dll)?/i;
  var thisName, bool;

  for (var i = 0, l = modules.length; i < l; i++) {
    thisName = modules[i];
    bool = existenceOf(thisName);

    if (returns.state === 'all') {
      result.push('"' + thisName + '": ' + bool);
      continue;
    }

    if (returns.state === bool) {
      result.push(thisName);
    }
  }

  var desc = [description ? returns.desc : ''];

  if (result.length === 0) {
    return desc;
  }

  return desc.concat(result.join(' '));
})(PPx.Arguments);
