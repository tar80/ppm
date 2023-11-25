/* @file Check if the process is started
 * @arg 0 {string} - Specify the process ID
 * @return - "0"(false) or "-1"(true)
 */

import {pathSelf} from '@ppmdev/modules/path.ts';

const {scriptName, parentDir} = pathSelf();

if (PPx.Arguments.length === 0) {
  PPx.Execute(`*script "${parentDir}\\errors.js",arg,${scriptName}`);
  PPx.Quit(-1);
}

const pid = PPx.Arguments.Item(0);
const wmi = PPx.CreateObject('WbemScripting.SWbemLocator' as any).ConnectServer();
const process = wmi.ExecQuery(`SELECT ProcessID FROM Win32_Process WHERE ProcessID = "${pid}"`);

PPx.result = process.Count > 0 ? '-1' : '0';
