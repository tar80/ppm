/* @file Get ListFile metadata
 * @arg 0 {string} - Specify the ListFile path
 * @arg 1 {string} - Specify the metadata id
 * @arg 2 {string} - Specify the file encoding
 * @return - Table of metadata
 */

import '@ppmdev/polyfills/objectKeys.ts';
import type {FileEncode} from '@ppmdev/modules/types.ts';
import {getLfMeta} from '@ppmdev/parsers/listfile.ts';
import {valueEscape as jsonValue} from '@ppmdev/parsers/json.ts';
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

  const meta = getLfMeta(data.lines);
  const labelId = 'ppmlfmetadata,KC_main:LOADEVENT';
  PPx.setIValue('meta', objToJson(meta));
  PPx.Execute(
    `*linecust ${labelId},*if ("%%n"=="%n") && (4!=%%*js("PPx.result=PPx.DirectoryType"))%%:*string i,meta=%%:*linecust ${labelId},`
  );

  PPx.result = meta[args.id];
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

const objToJson = (items: Record<string, string>): string => {
  const arr = [];

  for (const item of Object.keys(items)) {
    arr.push(
      `"${item}":"${jsonValue(items[item as keyof typeof items])}"`
    );
  }

  return `{${arr.join(',')}}`;
};

main();
