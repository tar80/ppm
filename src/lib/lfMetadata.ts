/* @file Set ListFile metadata
 * @arg 0 {string} - Specify the ListFile path
 * @arg 1 {string} - Specify the metadata id
 * @arg 2 {string} - Specify the file encoding. "sjis" | "utf8" | "utf16le"(default)
 * @return - Table of metadata
 */

import '@ppmdev/polyfills/objectKeys.ts';
import type {FileEncode} from '@ppmdev/modules/types.ts';
import {getLfMeta} from '@ppmdev/parsers/listfile.ts';
import {isError} from '@ppmdev/modules/guard.ts';
import {readLines} from '@ppmdev/modules/io.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';

const main = (): string => {
  const args = adjustArgs();
  const [error, data] = readLines({path: args.path, enc: args.enc});

  if (isError(error, data)) {
    const {scriptName} = pathSelf();
    PPx.report(`[ppm/${scriptName}] ${data}`);
    PPx.Quit(-1);
  }

  return getLfMeta(data.lines)[args.id];
};

const adjustArgs = (args = PPx.Arguments): {path: string; id: string; enc: FileEncode} => {
  const arr: string[] = ['', 'Base', 'utf16le'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  if (!/sjis|utf8|utf16le/.test(arr[2])) {
    arr[2] = 'utf16le';
  }

  return {path: arr[0], id: arr[1], enc: arr[2] as FileEncode};
};

PPx.result = main();
