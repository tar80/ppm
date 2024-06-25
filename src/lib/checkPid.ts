/* @file Check if the process is started
 * @arg 0 {string} - Specify the process ID
 * @return - 0(false) or -1(true)
 */

import {validArgs} from '@ppmdev/modules/argument.ts';
import {isBottom} from '@ppmdev/modules/guard.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';

const [pid] = validArgs();

if (isBottom(pid)) {
  const {scriptName, parentDir} = pathSelf();
  PPx.Execute(`*script "${parentDir}\\errors.js",arg,${scriptName}`);
  PPx.Quit(-1);
}

const wmi = PPx.CreateObject('WbemScripting.SWbemLocator' as any).ConnectServer();
const process = wmi.ExecQuery(`SELECT ProcessID FROM Win32_Process WHERE ProcessID = "${pid}"`);

PPx.result = process.Count > 0;
