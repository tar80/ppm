/* @file Waits until the specified process is started
 * @arg 0 {string} - Specify the process name
 * @arg 1 {number} - Specify the waiting time (default: 6000)
 * @arg 2 {string} - Specifies the command line to run if there is no process
 * @arg 3 {number} - Specifies the GUI startup state. (WScript.Shell.Run style value)
 * @return - "-1"(true) if the process has been started when the script is executed
 *
 * NOTE: Check for process startup approximately every 500 milliseconds.
 *  If you set the wait time to 0, the process will be checked only once and then terminated.
 */

import {safeArgs} from '@ppmdev/modules/argument.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';

const WAIT_MSEC = 6000;
const LOOP_MSEC = 500;

const main = (): void => {
  const sh = PPx.CreateObject('WScript.Shell');
  const [proc, limit, cmdline, style] = safeArgs(undefined, WAIT_MSEC, '', 1);

  if (proc == null) {
    const {scriptName, parentDir} = pathSelf();
    PPx.Execute(`*script ${parentDir}\\errors.js",arg,${scriptName}`);
    PPx.Quit(-1);
  }

  const processName = /.+\.exe$/i.test(proc) ? proc : `${proc}.exe`;
  let isRun = processRunning(processName);
  PPx.result = isRun;

  if (limit > 0 && !isRun) {
    const cmd = isEmptyStr(cmdline) ? processName : cmdline;
    sh.Run(cmd, style as IWshRuntimeLibrary.WindowStyle);

    let [i, s, e, w] = [0, 0, 0, LOOP_MSEC];

    do {
      i = i + LOOP_MSEC;
      PPx.Execute(`*wait ${w - Math.floor(w / 10)},2`);

      if (i >= limit) {
        PPx.linemessage('!"Abort. Waiting time exceeded');
        break;
      }

      s = Date.now();
      isRun = processRunning(processName);
      e = Date.now();

      if (isRun) {
        break;
      }

      w = LOOP_MSEC - (e - s);
    } while (true);
  }
};

const wmi = PPx.CreateObject('WbemScripting.SWbemLocator' as any).ConnectServer();
const processRunning = (procName: string): boolean => {
  const process = wmi.ExecQuery(`SELECT Name FROM Win32_Process WHERE Name = "${procName}"`);

  return process.Count > 0;
};

main();
