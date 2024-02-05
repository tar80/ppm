/* @file Display logs in PPv
 * @arg 0 {string} - Type of the log. "update"|"customize"
 * @arg 1 {number} - Customization detail log tab width
 */

import fso from '@ppmdev/modules/filesystem.ts';
import {info, tmp, uniqName, useLanguage} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {langLogViewer} from './mod/language.ts';

type LogType = 'update' | 'customize';

const {scriptName, parentDir} = pathSelf();
const lang = langLogViewer[useLanguage()];

const main = (): void => {
  const args = adjustArgs();

  if (!args) {
    PPx.Execute(`*script "${parentDir}\\errors.js",arg,${scriptName}`);
    PPx.Quit(-1);
  }

  const log = {
    update: {path: `${ppm.global('ppmcache')}\\ppm\\${uniqName.updateLog}`, opts: ''},
    customize: {path: tmp().file, opts: `-tab:${args[1]}`}
  }[args[0]];

  if (!fso.FileExists(log.path)) {
    ppm.linemessage('.', lang.notExist, true);
    PPx.Quit(-1);
  }

  const keyTbl = ppm.setkey('ENTER', '*script %%sgu"ppm"\\dist\\viewerAction.js');
  const [label, id, sep, esc] = ['ppmLogViewer', 'KV_main:CLOSEEVENT', ',', true];
  ppm.linecust({
    label,
    id,
    sep,
    esc,
    value: `*ifmatch V${info.ppmID},%n%:*linecust ${label},${id},%:*deletecust "${keyTbl}"`
  });

  const resetCaret = setCaret();
  PPx.Execute(
    `%Oi *ppv -r -bootid:${info.ppmID} -utf8 -esc:on -history:off ${log.opts} ${log.path} -k *mapkey use,${keyTbl}`
  );
  resetCaret();
};

const adjustArgs = (args = PPx.Arguments): [LogType, number] | void => {
  const arr: [string, number] = ['', 32];
  const isLogType = (arg: string): arg is LogType => /update|customize/.test(arg);

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  if (isLogType(arr[0])) {
    return [arr[0], arr[1]];
  }
};

const setCaret = (): Function => {
  const FIELD_ID = 'XV_tmod';
  const caretMode = ppm.getcust(FIELD_ID)[1];

  if (caretMode === '0') {
    ppm.setcust(`${FIELD_ID}=1`);

    return () => ppm.setcust(`${FIELD_ID}=0`);
  }

  return () => {};
};

main();
