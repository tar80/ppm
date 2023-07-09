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

PPx.Result = (function (args) {
  var len = args.length;
  if (len < 2) {
    errors('arg');
  }

  var result = [];
  var fso = PPx.CreateObject('Scripting.FileSystemObject');
  var paths = PPx.Extract("%'path';%0").split(';');
  var returns = {
    '0': {state: 'all', desc: 'Executable state.'},
    '1': {state: true, desc: 'Exist executables.'},
    '2': {state: false, desc: 'Not Exist executables.'}
  }[args.Item(0)];
  var description = {
    '0': false,
    '1': true
  }[args.Item(1)];

  var executables = [];

  for (var i = 2, l = len; i < l; i++) {
    executables.push(args.Item(i));
  }

  var thisExe, bool;

  for (var i = 0, l = executables.length; i < l; i++) {
    thisExe = ~executables[i].indexOf('.exe') ? executables[i] : executables[i] + '.exe';
    bool = false;

    if (~thisExe.indexOf(':') && fso.FileExists(thisExe)) {
      thisExe = thisExe.replace(/^.+\\(.+)/, '$1');
      bool = true;
    } else {
      for (var j = 0, k = paths.length; j < k; j++) {
        var thisPath = paths[j];

        if (fso.FileExists(fso.BuildPath(thisPath, thisExe))) {
          bool = true;
          break;
        }
      }
    }

    if (returns.state === 'all') {
      result.push('"' + thisExe + '": ' + bool);
      continue;
    }

    if (returns.state === bool) {
      result.push(thisExe);
      continue;
    }
  }

  var desc = [description ? returns.desc : ''];

  if (result.length === 0) {
    return desc;
  }

  return desc.concat(result.join(' '));
})(PPx.Arguments);
