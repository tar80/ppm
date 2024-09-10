/* @file Set ListFile metadata
 * @arg 0 {string} - Specify the ListFile path
 * @arg 1 {string} - Specify the metadata name
 * @arg 2 {string} - Specify the file encoding. "sjis" | "utf8" | "utf16le"(default)
 * @return - The value of metadata name
 */

import '@ppmdev/polyfills/objectKeys.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';
import {confirmFileEncoding, readLines} from '@ppmdev/modules/io.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {getLfMeta} from '@ppmdev/parsers/listfile.ts';

const main = (): string => {
  const [path, metaName, enc] = safeArgs('', 'base', 'utf16le');
  const fileEncode = confirmFileEncoding(enc);
  const [error, data] = readLines({path: path, enc: fileEncode});

  if (error) {
    const {scriptName} = pathSelf();
    PPx.report(`[ppm/${scriptName}] ${data}`);
    PPx.Quit(-1);
  }

  return getLfMeta(data.lines)[metaName.toLowerCase()] ?? '';
};

PPx.result = main();
