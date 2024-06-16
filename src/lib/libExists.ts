/* @file Check for the existence of the PPx Modules and Common Archivers Library
 * @args {string} - 0+ Specifies comma separated module names
 * @return - JSON style list { "module name": exist, ... }: {[string]: boolean}
 *
 * NOTE: Module name can abbreviated like this
 *  PPXWIN64.dll -> PPXWIN
 */

import {pathSelf} from '@ppmdev/modules/path.ts';
import {validArgs} from '@ppmdev/modules/argument.ts';
import debug from '@ppmdev/modules/debug.ts';

const {scriptName, parentDir} = pathSelf();

const main = (): string => {
  const args = validArgs();

  if (args.length === 0) {
    PPx.Execute(`*script "${parentDir}\\errors.js",arg,${scriptName}`);
    PPx.Quit(-1);
  }

  const libs = PPx.Extract(`%*script("${parentDir}\\getEntries.js",%0,file,.dll)`);

  return getLibs(libs, args);
};

const getLibs = (libs: string, args: string[]): string => {
  const result: string[] = [];
  let rgx: RegExp;
  let match: RegExpExecArray | null;

  for (const arg of args) {
    rgx = RegExp(`${arg.replace(/\.dll$/, '')}(32|64)?.dll`, 'i');
    match = rgx.exec(libs);

    result.push(`"${arg}": ${match != null}`);
  }

  return `{${result.join(',')}}`;
};

if (!debug.jestRun()) PPx.result = main();
// export {getLibs}
