/* @file XOR encryption and decryption
 * @arg 0 {number} - Specify key number
 * @arg 1 {string} - Specify password
 * @return - Encrypted or decrypted password
 */

import {safeArgs} from '@ppmdev/modules/argument.ts';

const main = (): string => {
  const [key, text] = safeArgs(156474, '');

  return cryptString(key, text);
};

const cryptString = (key: number, text: string): string => {
  let encText = '';

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key;
    encText += String.fromCharCode(charCode);
  }

  return encText;
};

PPx.result = main();
