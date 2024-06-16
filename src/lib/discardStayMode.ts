/* @file Discard instance of Stay-Mode
 * @arg 0 {string} - Specify the _User data property name
 * @arg 1 {number} - Scecify the instance number of the Stay-Mode
 * @arg 2 {string} - Displays debug messages when "DEBUG" is specified
 */

import {validArgs} from '@ppmdev/modules/argument.ts';
import debug from '@ppmdev/modules/debug.ts';

const main = (): void => {
  const [propName, instance, debug] = validArgs();

  if (!propName || !instance) {
    return;
  }

  const count = PPx.Extract(`%su'${propName}'`);

  if (Number(count) > 0) {
    debug === 'DEBUG' && PPx.Execute(`*execute C,*linemessage [DEBUG] keep ${instance}`);
    PPx.Execute(`*string u,${propName}=0`);
    PPx.Execute(`%Od *ppb -c *wait ${count}%%:*script ${PPx.ScriptName},${propName},${instance},${debug}`);
  } else {
    PPx.Execute(`*execute C,*script ":${instance},ppx_Discard",${debug}`);
    PPx.Execute(`*deletecust _User:${propName}`);
  }
};

main();
