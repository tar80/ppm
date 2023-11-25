/* @file Check for the existence of the executable files
 * @arg 0+ {string} - Comma separated executable files
 * @return - JSON style list { "executable1": boolean, ... }
 */

import {pathSelf} from '@ppmdev/modules/path.ts';
import debug from '@ppmdev/modules/debug.ts';

const {scriptName, parentDir} = pathSelf();

const main = (): void => {
  if (PPx.Arguments.length === 0) {
    PPx.Execute(`*script ${parentDir}\\errors.js",arg,${scriptName}`);
    PPx.Quit(-1);
  }

  const args = adjustArgs();
  PPx.result = getExists(args);
};

const adjustArgs = (args = PPx.Arguments): typeof arr => {
  const arr: string[] = [];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  return arr;
};

const getExists = (executables: string[]): string => {
  const fso = PPx.CreateObject('Scripting.FileSystemObject');
  const paths = PPx.Extract("%'path';%0").split(';');
  const result: string[] = [];
  let name = '';
  let exist = false;

  for (const executable of executables) {
    name = /\.exe$/.test(executable) ? executable : `${executable}.exe`;
    exist = false;

    if (~name.indexOf(':') && fso.FileExists(name)) {
      name = name.replace(/^.+\\(.+)/, '$1');
      exist = true;
    } else {
      for (const path of paths) {
        if (fso.FileExists(`${path}\\${name}`)) {
          exist = true;
          break;
        }
      }
    }

    result.push(`"${name}": ${exist}`);
  }

  return `{${result.join(',')}}`;
};

if (!debug.jestRun()) main();
// export {getExists};
