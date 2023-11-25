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

import {isEmptyStr} from '@ppmdev/modules/guard.ts';

const WAIT_MSEC = '6000';
const LOOP_MSEC = 500;

const main = (): void => {
  const sh = PPx.CreateObject('WScript.Shell');
  const target = adjustArgs();
  let isRun = processRunning(target.name);
  PPx.result = isRun;

  if (target.limit > 0 && isRun === '0') {
    const cmd = isEmptyStr(target.cmdline) ? target.name : target.cmdline;
    sh.Run(cmd, target.style);

    let [i, s, e, w] = [0, 0, 0, LOOP_MSEC];

    do {
      i = i + LOOP_MSEC;
      PPx.Execute(`*wait ${w - Math.floor(w / 10)},2`);

      if (i >= target.limit) {
        PPx.linemessage('!"Abort. Waiting time exceeded');
        break;
      }

      s = Date.now();
      isRun = processRunning(target.name);
      e = Date.now();

      if (isRun === '-1') {
        break;
      }

      w = LOOP_MSEC - (e - s);
    } while (true);
  }
};

const adjustArgs = (
  args = PPx.Arguments
): {name: string; limit: number; cmdline: string; style: IWshRuntimeLibrary.WindowStyle} => {
  const arr: string[] = ['', WAIT_MSEC, '', '1'];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  const name = /.+\.exe$/i.test(arr[0]) ? arr[0] : `${arr[0]}.exe`;
  const msec = Number(arr[1]);
  const style = Number(arr[3]) as IWshRuntimeLibrary.WindowStyle;

  return {name, limit: msec, cmdline: arr[2], style};
};

const wmi = PPx.CreateObject('WbemScripting.SWbemLocator' as any).ConnectServer();
const processRunning = (procName: string): string => {
  const process = wmi.ExecQuery(`SELECT Name FROM Win32_Process WHERE Name = "${procName}"`);

  return process.Count > 0 ? '-1' : '0';
};

main();
