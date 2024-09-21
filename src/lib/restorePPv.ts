/* @file Restore PPv settings
 * @arg 0 {string} - Specify a PPv id
 * @arg 1 {string} - value of _WinPos:V
 * @arg 2 {string} - If specified "DEBUG", print debug messages
 */

import {validArgs} from '@ppmdev/modules/argument.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';

const main = (): void => {
  const [idName, winpos, debugMode] = validArgs();

  if (!isEmptyStr(winpos)) {
    const key = `_WinPos:V${idName}`;
    PPx.Execute(`*execute C,*setcust ${key}=${winpos}`);
    debugMsg(debugMode, `restorePPv setcust:${key}=${winpos}`);
  }
};

const debugMsg = (debugMode: string, msg: string): void => {
  debugMode === 'DEBUG' && PPx.Execute(`*execute C,*linemessage [DEBUG] ${msg}`);
};

main();
