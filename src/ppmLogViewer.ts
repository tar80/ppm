/* @file Display logs in PPv
 * @arg 0 {string} - Type of the log. "update"|"customize"
 * @arg 1 {number} - Customization detail log tab width
 */

import {safeArgs} from '@ppmdev/modules/argument.ts';
import {info, tmp, uniqName, useLanguage} from '@ppmdev/modules/data.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {langLogViewer} from './mod/language.ts';

const {scriptName, parentDir} = pathSelf();
const lang = langLogViewer[useLanguage()];

const main = (): void => {
  const [logType, tabWidth] = safeArgs('customize', 32);

  if (!isLogType(logType)) {
    PPx.Execute(`*script "${parentDir}\\errors.js",arg,${scriptName}`);
    PPx.Quit(-1);
  }

  const log = {
    update: {path: `${ppm.global('ppmcache')}\\ppm\\${uniqName.updateLog}`, opts: ''},
    customize: {path: tmp().file, opts: `-tab:${tabWidth}`}
  }[logType];

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
  PPx.Execute(`%Oi *ppv -r -bootid:${info.ppmID} -utf8 -esc:on -history:off ${log.opts} ${log.path} -k *mapkey use,${keyTbl}`);
  resetCaret();
};

type LogType = 'update' | 'customize';
const isLogType = (arg: string): arg is LogType => /update|customize/.test(arg);

const setCaret = (): (() => number | void) => {
  const FIELD_ID = 'XV_tmod';
  const caretMode = ppm.getcust(FIELD_ID)[1];

  if (caretMode === '0') {
    ppm.setcust(`${FIELD_ID}=1`);

    return () => ppm.setcust(`${FIELD_ID}=0`);
  }

  return () => {};
};

main();
