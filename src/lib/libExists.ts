/* @file Check for the existence of the PPx Modules and Common Archivers Library
 * @args {string} - 0+ Specifies comma separated module names
 * @return - JSON style list { "module name": exist, ... }: {[string]: boolean}
 *
 * NOTE: Module name can abbreviated like this
 *  PPXWIN64.dll -> PPXWIN
 */

import {pathSelf} from '@ppmdev/modules/path.ts';
import {isCV8} from '@ppmdev/modules/util.ts';
import debug from '@ppmdev/modules/debug.ts';

const {scriptName, parentDir} = pathSelf();

const main = (): void => {
  if (PPx.Arguments.length === 0) {
    errors('arg');
    PPx.Quit(-1);
  }

  const args = adjustArgs();
  const ext = isCV8() ? 'js' : 'vbs';
  const libs = PPx.Extract(`%*script("${parentDir}\\getEntries.${ext}",%0,file,.dll)`);

  PPx.result = getLibs(libs, args);
};

const errors = (method: string): number => PPx.Execute(`*script "${parentDir}\\errors.js",${method},${scriptName}`);
const adjustArgs = (args = PPx.Arguments): string[] => {
  const arr: string[] = [];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  return arr;
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

if (!debug.jestRun()) main();
// export {getLibs}
