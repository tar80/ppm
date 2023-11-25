/* @file Extract S_ppm#sources data
 * @arg 0 {string} - Plugin name
 * @arg 1 {string} - Specifies the field name. Default field is "path"
 * @return - The value of the specified field
 */

import {expandSource} from '@ppmdev/modules/source.ts';

const main = (): string | number | boolean => {
  const plugin = adjustArgs();
  const source = expandSource(plugin.name);

  if (!!source) {
    type Key = keyof typeof source;
    const value = source[plugin.field as Key];

    return value ?? '';
  } else {
    return '[error]';
  }
};

const adjustArgs = (args = PPx.Arguments): {name: string; field: string} => {
  const arr: string[] = ['', 'path'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  return {name: arr[0], field: arr[1]};
};

PPx.result = main();
