/* @file Set ListFile metadata
 * @arg 0 {string} - Specify ViewStyle
 * @arg 1 {string} - Specify the file encoding. "sjis" | "utf8" | "utf16le"(default)
 * @return - "cmd" parameter in metadata
 */

import '@ppmdev/polyfills/objectKeys.ts';
import '@ppmdev/polyfills/objectIsEmpty.ts';
import type {FileEncode} from '@ppmdev/modules/types.ts';
import {getLfMeta} from '@ppmdev/parsers/listfile.ts';
import {valueEscape as jsonValue} from '@ppmdev/parsers/json.ts';
import {isEmptyStr, isError} from '@ppmdev/modules/guard.ts';
import {readLines} from '@ppmdev/modules/io.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {uniqID} from '@ppmdev/modules/data.ts';

const userID = `${uniqID.lfDset}${PPx.Extract('%n')}`

const main = (): string => {
  const path = PPx.Extract('%FDV');
  const dset = PPx.Extract(`%*getcust(XC_dset:${path})`);

  if (!isEmptyStr(dset)) {
    return altExecution(dset);
  }

  const args = adjustArgs();
  const [error, data] = readLines({path, enc: args.enc});

  if (isError(error, data)) {
    const {scriptName} = pathSelf();
    PPx.report(`[ppm/${scriptName}] ${data}`);
    PPx.Quit(-1);
  }

  const meta = getLfMeta(data.lines);

  if (Object.isEmpty(meta)) {
    return isEmptyStr(args.style) ? '' : `*viewstyle -temp "${args.style}"`;
  } else {
    const hasMapkey = !!meta.mapkey && !isEmptyStr(meta.mapkey)
    const mapkey = {
      true: {use: `%:*mapkey use,${meta.mapkey}`, delete: `%%:*mapkey delete,${meta.mapkey}`},
      false: {use: '', delete: ''}
    }[hasMapkey.toString() as 'true' | 'false'];

    const labelId = `${userID},KC_main`;
    PPx.Execute(
      `*linecust ${labelId}:LOADEVENT,*if ("%%n"=="%n")&&(4!=%%*js("PPx.result=PPx.DirectoryType"))` +
        `%%:*deletecust _User:${userID}:LOADEVENT` +
        mapkey.delete +
        `%%:*linecust ${labelId}:CLOSEEVENT,` +
        `%%:*linecust ${labelId}:LOADEVENT,`
    );
    PPx.Execute(`*string u,${userID}=${objToJson(meta)}${mapkey.use}`);

    return meta.cmd;
  }
};

const adjustArgs = (args = PPx.Arguments): {style: string; enc: FileEncode} => {
  const arr: string[] = ['', 'utf16le'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  if (!/sjis|utf8|utf16le/.test(arr[1])) {
    arr[1] = 'utf16le';
  }

  return {style: arr[0], enc: arr[1] as FileEncode};
};

const altExecution = (dset: string): string => {
  const rgx = /^B\d+,[\-B0-9,]+(.+)$/;

  return ~dset.indexOf('cmd') ? dset.replace(rgx, (_, opts) => opts.replace(/^.*cmd:"([^"]*)".*$/, '$1')) : '';
};

const objToJson = (items: Record<string, string>): string => {
  const arr = [];

  for (const item of Object.keys(items)) {
    arr.push(`"${item}":"${jsonValue(items[item as keyof typeof items])}"`);
  }

  return `{${arr.join(',')}}`;
};

PPx.result = main();
