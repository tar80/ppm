//!*script
/**
 * Check for the existence of the executable files
 *
 * @return Whether the executable files exists
 * @arg 0  Return executable files list. 0=all | 1=exists | 2=not exists
 * @arg 1  Return description. 0:false | 1:true
 * @arg 2+ Comma separated executable files
 */

var script_name = PPx.scriptName;

var errors = function (method) {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var len = args.length;
  if (len < 2) {
    errors('arg');
  }

  var type = {
    0: {state: 'all', desc: 'Executable state: '},
    1: {state: true, desc: 'Exist executables: '},
    2: {state: false, desc: 'Not Exist executables: '}
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
    files: array
  };
})(PPx.Arguments());

PPx.Result = (function (args) {
  var result = [];
  var states = {};
  var paths = PPx.Extract("%'path';%0").split(';');
  var fso = PPx.CreateObject('Scripting.FileSystemObject');

  for (var i = 0, l = args.files.length; i < l; i++) {
    var thisFile = args.files[i].replace(/(\.exe)?$/, '.exe');
    states[thisFile] = false;

    for (var j = 0, k = paths.length; j < k; j++) {
      var thisPath = paths[j];
      if (fso.FileExists(fso.BuildPath(thisPath, thisFile))) {
        states[thisFile] = true;
        continue;
      }
    }
  }

  for (var item in states) {
    if (Object.prototype.hasOwnProperty.call(states, item)) {
      if (args.type.state === 'all') {
        result.push('"' + item + '": ' + states[item]);
        continue;
      }

      if (states[item] === args.type.state) {
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
})(g_args);
