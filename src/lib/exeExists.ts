/* @file Check for the existence of the executable files
 * @arg 0+ {string} - Comma separated executable files
 * @return - JSON style list { "executable1": boolean, ... }
 */

import {pathSelf} from '@ppmdev/modules/path.ts';
import {validArgs} from '@ppmdev/modules/argument.ts';
import debug from '@ppmdev/modules/debug.ts';

const main = (): string => {
  const args = validArgs();

  if (args.length === 0) {
    const {scriptName, parentDir} = pathSelf();
    PPx.Execute(`*script ${parentDir}\\errors.js",arg,${scriptName}`) === 0 && PPx.Quit(-1);
    PPx.Quit(-1);
  }

  return getExists(args);
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

if (!debug.jestRun()) {
  PPx.result = main();
}
// export {getExists};
