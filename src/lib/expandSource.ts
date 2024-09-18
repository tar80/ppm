/* @file Extract S_ppm#sources data
 * @arg 0 {string} - Plugin name
 * @arg 1 {string} - Specifies the field name. Default field is "path"
 * @return - The value of the specified field
 */

import {safeArgs} from '@ppmdev/modules/argument.ts';
import {expandSource} from '@ppmdev/modules/source.ts';

const main = (): string | number | boolean => {
  const [name, field] = safeArgs('', 'path');
  const source = expandSource(name);

  if (source) {
    type Key = keyof typeof source;
    const value = source[field as Key];

    return value ?? '';
  } else {
    return '[error]';
  }
};

PPx.result = main();
