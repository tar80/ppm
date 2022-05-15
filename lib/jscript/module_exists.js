//!*script
/**
 * Check for the existence of the PPx modules and common archivers library
 *
 * @return Whether the ppx module exists
 * @arg 0  0=all | 1=exists | 2=not exists
 * @arg 1  Return description. 0:false | 1:true
 * @arg 2+ Comma separated module names
 *
 * NOTE:Module names can abbreviated like this
 * PPXWIN64.dll -> PPXWIN
 */

var script_name = PPx.scriptName;
var current = (function () {
  var fso = PPx.CreateObject('Scripting.FileSystemObject');
  var wd = fso.GetFile(script_name).ParentFolder;

  return {
    wd: wd,
    home: wd.ParentFolder.ParentFolder
  };
})();

var errors = function (method) {
  PPx.Execute('*script "' + current.wd + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var len = args.length;
  if (len < 2) {
    errors('arg');
  }

  var type = {
    0: {state: 'all', desc: 'Module state: '},
    1: {state: true, desc: 'Exist modules: '},
    2: {state: false, desc: 'Not Exist modules: '}
  }[args.item(0)];
  var description = {
    0: false,
    1: true
  }[args.item(1)];

  var array = [];

  for (var i = 2, l = args.length; i < l; i++) {
    array.push(args.item(i));
  }

  return {
    type: type,
    desc: description,
    modules: array
  };
})(PPx.Arguments());

var moduleState = (function (args) {
  var result = {};
  var thisName, thisValue;
  var reg = /^([\w-]*)(\.dll)?/i;
  var modules = PPx.Extract(
    '%*script("' + current.home + '\\lib\\jscript\\stdoutw.js","%0","dir /b")'
  );
  var archivers = PPx.Extract('%*getcust(P_arc)');
  var exists = function (name, match) {
    var name_ = RegExp('^' + name.replace(/32|64/, '') + '(32|64)?.DLL', 'mi');
    return name_.test(match);
  };
  for (var i = 0, l = args.modules.length; i < l; i++) {
    thisName = args.modules[i].replace(reg, '$1').toUpperCase();
    thisValue = exists(thisName, modules);
    if (!thisValue) {
      thisValue = exists(thisName, archivers);
    }

    result[thisName] = thisValue;
  }

  return result;
})(g_args);

PPx.Result = (function (args, items) {
  var result = [];

  for (var item in items) {
    if (Object.prototype.hasOwnProperty.call(items, item)) {
      if (args.type.state === 'all') {
        result.push('"' + item + '": ' + items[item]);
        continue;
      }

      if (items[item] === args.type.state) {
        result.push(item);
      }
    }
  }

  return (function () {
    var desc = args.desc ? args.type.desc : '';

    if (result.length === 0) {
      return desc;
    }

    return desc + result.join(',');
  })();
})(g_args, moduleState);
