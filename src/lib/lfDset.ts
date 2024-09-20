/* @file Set ListFile metadata
 * @arg 0 {string} - Specify the ViewStyle
 * @arg 1 {string} - Specify the file encoding. "sjis" | "utf8" | "utf16le"(default)
 * @return - "cmd" parameter in metadata
 */

import '@ppmdev/polyfills/objectKeys.ts';
import '@ppmdev/polyfills/objectIsEmpty.ts';
import {validArgs} from '@ppmdev/modules/argument.ts';
import {staymodeID} from '@ppmdev/modules/data.ts';
import debug from '@ppmdev/modules/debug.ts';
import {isEmptyStr, isZero} from '@ppmdev/modules/guard.ts';
import {confirmFileEncoding, readLines} from '@ppmdev/modules/io.ts';
import {getStaymodeId} from '@ppmdev/modules/staymode.ts';
import {getLfMeta} from '@ppmdev/parsers/listfile.ts';

const VE_HANDLER_PATH = '%sgu"ppmlib"\\veHandler.stay.js';
const VE_HANDLER_ID = getStaymodeId('veHandler') || staymodeID.veHandler;

const main = (): string => {
  if (PPx.DirectoryType !== 4) {
    return noExecution('', 'Not a ListFile');
  }

  const path = PPx.Extract('%FDV');
  const [yes, cmdline] = hasDset(path);

  if (yes) {
    return cmdline;
  }

  const args = validArgs();
  const enc = confirmFileEncoding(args[1]);
  const [error, data] = readLines({path, enc});

  if (error) {
    return noExecution(args[0], data);
  }

  const meta = getLfMeta(data.lines);

  if (Object.isEmpty(meta)) {
    return noExecution(args[0], 'no metadata');
  }

  if (isZero(PPx.Extract(`%*stayinfo(${VE_HANDLER_ID})`))) {
    PPx.Execute(
      `*script ${VE_HANDLER_PATH},"${meta.base}","${meta.dirtype}","${meta.search}","${meta.ppm}","${meta.mapkey}","${meta.freq}"`
    );
  }

  return meta.cmd ?? '';
};

const hasDset = (path: string): [boolean, string] => {
  const rgx = /^B\d+,[-,B0-9]+(?:disp:"[^"]+" )?(?:mask:"[^"]+" )?cmd:"([^"]*)".*$/;
  let dset = PPx.Extract(`%*getcust(XC_dset:${path})`);

  do {
    if (!isEmptyStr(dset)) {
      const cmdline = ~dset.indexOf('cmd:') ? dset.replace(rgx, '$1') : '';

      return [true, cmdline];
    }

    path = path.slice(0, path.lastIndexOf('\\'));
    dset = PPx.Extract(`%*getcust(XC_dset:${path}%\\)`);
  } while (~path.indexOf('\\'));

  return [false, ''];
};

const noExecution = (style: string, message: string): string => {
  debug.log(message);

  return isEmptyStr(style) ? '' : `*viewstyle -temp "${style}"`;
};

PPx.result = main();
