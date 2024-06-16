/* @file Set ListFile metadata
 * @arg 0 {string} - Specify the ListFile path
 * @arg 1 {string} - Specify the metadata id
 * @arg 2 {string} - Specify the file encoding. "sjis" | "utf8" | "utf16le"(default)
 * @return - Table of metadata
 */

import '@ppmdev/polyfills/objectKeys.ts';
import type {FileEncode} from '@ppmdev/modules/types.ts';
import {getLfMeta} from '@ppmdev/parsers/listfile.ts';
import {readLines} from '@ppmdev/modules/io.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';

const main = (): string => {
  const [path, id, enc] = safeArgs('', 'Base', 'utf16le');
  const fileEncode = /sjis|utf8|utf16le/.test(enc) ? (enc as FileEncode) : 'utf16le';
  const [error, data] = readLines({path: path, enc: fileEncode});

  if (error) {
    const {scriptName} = pathSelf();
    PPx.report(`[ppm/${scriptName}] ${data}`);
    PPx.Quit(-1);
  }

  return getLfMeta(data.lines)[id];
};

PPx.result = main();
