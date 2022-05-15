//!*script
/**
 * Check the existence of the file or directory path
 *
 * @version 1.0
 * @return Whether the files exists
 * @arg 0  Specify method. bool | path | number(return=0:false|1:true)
 * @arg 1+ Comma separated files or directories
 */

'use strict';

const script_name = PPx.scriptName;

const errors = (method) => {
  PPx.Execute(`*script "%*name(D,"${script_name}")\\errors.js",${method},${script_name}`);
  PPx.Quit(-1);
};

const g_args = ((args = PPx.Arguments()) => {
  const len = args.length;

  if (len < 2) {
    errors('arg');
  }

  const array = [];
  for (let i = 1, l = args.length; i < l; i++) {
    array.push(args.item(i));
  }

  return {
    method: args.item(0),
    path: array
  };
})();

const fso = PPx.CreateObject('Scripting.FileSystemObject');
const not_exists = [];

for (let i = 0, l = g_args.path.length; i < l; i++) {
  const thisPath = g_args.path[i];
  if (fso.FileExists(thisPath) || fso.FolderExists(thisPath)) {
    continue;
  }

  not_exists.push(thisPath);
}

const method = {};

/**
 * If it exists returns true
 *
 * @return {boolean} true | false
 */
method['bool'] = () => (not_exists.length ? false : true);

/**
 * If it exists returns 1
 *
 * @return {number} 1 | 0
 */
method['number'] = () => (not_exists.length ? 0 : 1);

/**
 * Returns not existent paths
 *
 * @return {string} paths
 */
method['path'] = () => not_exists.join(',');

PPx.Result = method[g_args.method]();
