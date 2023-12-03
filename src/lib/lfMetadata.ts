/* @file Get ListFile metadata
 * @arg 0 {string} - Specify the ListFile path
 * @arg 1 {string} - Specify the metadata id
 * @arg 2 {string} - Specify the file encoding
 * @return - Table of metadata
 */

import type {FileEncode} from '@ppmdev/modules/types.ts';
import {getLfMeta} from '@ppmdev/parsers/listfile.ts';
import {isError} from '@ppmdev/modules/guard.ts';
import {readLines} from '@ppmdev/modules/io.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';

const main = (): void => {
  const args = adjustArgs();
  const [error, data] = readLines({path: args.path, enc: args.enc});

  if (isError(error, data)) {
    const {scriptName} = pathSelf();
    PPx.report(`[ppm/${scriptName}] ${data}`);
    PPx.Quit(-1);
  }

  PPx.result = getLfMeta(data.lines)[args.id];
};

const adjustArgs = (args = PPx.Arguments): {path: string; id: string; enc: FileEncode} => {
  const arr: string[] = ['', 'Base', 'utf8'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  if (!/sjis|utf16le/.test(arr[2])) {
    arr[2] = 'utf8';
  }

  return {path: arr[0], id: arr[1], enc: arr[2] as FileEncode};
};

main();
