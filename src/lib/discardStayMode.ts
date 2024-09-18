/* @file Discard instance of Stay-Mode
 * @arg 0 {string} - Specify the PPx ID
 * @arg 1 {number} - Scecify the instance number of StayMode
 * @arg 2 {string} - Displays debug messages when "DEBUG" is specified
 */

import {validArgs} from '@ppmdev/modules/argument.ts';
import debug from '@ppmdev/modules/debug.ts';

const main = (): void => {
  const [ppxid, instance, debugMode] = validArgs();

  if (!instance) {
    return;
  }

  const hasInstance = PPx.Extract(`%*extract(${ppxid},"%%*stayinfo(${instance})")`) === '1';

  if (hasInstance) {
    keepStayMode(ppxid, instance, debugMode);
    PPx.Execute(`*execute ${ppxid},*js ":${instance},ppx_Discard",${debugMode},${instance}`);
  }
};

const keepStayMode = (ppxid: string, instance: string, debugMode: string): void => {
  const count = Number(PPx.Extract(`%*extract(${ppxid},"%%*js("":${instance}"",""PPx.result=cache.debounce"")")`));

  if (count > 0) {
    debugMode === 'DEBUG' && PPx.Execute(`*execute C,*linemessage [DEBUG] keep ${instance}`);
    PPx.Execute(`*execute ${ppxid},*js ":${instance}","cache.debounce='0';"`)
    PPx.Sleep(count);
    keepStayMode(ppxid, instance, debugMode);
  }
};

main();
