//!*script
// deno-lint-ignore-file no-var
/**
 * Check the existence of the file or directory path
 *
 * @version 1.1
 * @return Whether the files exists
 * @arg 0  Specify method. bool | path | number(return=0:false|1:true)
 * @arg 1  Speciry attribute. file | dir | both
 * @arg 2+ Comma separated files or directories
 */

var g_args = (function (args) {
  var len = args.length;

  if (len < 3) {
    PPx.Quit(1);
  }

  var attribute = {
    'file': function (path) {
      return fso.FileExists(path);
    },
    'dir': function (path) {
      return fso.FolderExists(path);
    },
    'both': function (path) {
      return fso.FileExists(path) || fso.FolderExists(path);
    }
  }[args.Item(1)];
  var array = [];

  for (var i = 2, l = args.length; i < l; i++) {
    array.push(args.item(i));
  }

  return {
    method: args.Item(0),
    att: attribute,
    path: array
  };
})(PPx.Arguments);

var fso = PPx.CreateObject('Scripting.FileSystemObject');
var not_exists = [];

for (var i = 0, l = g_args.path.length; i < l; i++) {
  var thisPath = g_args.path[i];
  if (g_args.att(thisPath)) {
    continue;
  }

  not_exists.push(thisPath);
}

var method = {};

/**
 * If it exists returns true
 *
 * @return {boolean} true | false
 */
method['bool'] = function () {
  return not_exists.length ? false : true;
};

/**
 * If it exists returns 1
 *
 * @return {number} 1 | 0
 */
method['number'] = function () {
  return not_exists.length ? 0 : 1;
};

/**
 * Returns not existent paths
 *
 * @return {string} paths
 */
method['path'] = function () {
  return not_exists.join(',');
};

PPx.Result = method[g_args.method]();
