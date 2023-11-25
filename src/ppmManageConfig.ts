/* @file Get the path of user configuration files */

import {info, useLanguage, uniqName} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {runPPb} from '@ppmdev/modules/run.ts';
import {colorlize} from '@ppmdev/modules/ansi.ts';
import {coloredEcho} from '@ppmdev/modules/echo.ts';
import {writeLines} from '@ppmdev/modules/io.ts';
import {winpos} from '@ppmdev/modules/window.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {langManageConfig} from './mod/language.ts';

const {scriptName} = pathSelf();
const lang = langManageConfig[useLanguage()];
const cfgdir = ppm.user('cfgdir');
const PPB_WIDTH = 700;
const PPB_HEIGHT = 200;

if (isEmptyStr(cfgdir)) {
  ppm.echo(scriptName, lang.emptyCfgdir);
  PPx.Quit(-1);
}

const desc: string[] = [
  `${colorlize({message: 'CTRL+ENTER', esc: true, fg: 'yellow'})}%%bt${lang.save}`,
  `${colorlize({message: 'ESC', esc: true, fg: 'yellow'})}%%bt%%bt${lang.cancel}`
];
const keyTbl = ppm.setkey('^ENTER', `*execute B${info.ppmID},*string p,ppm_cfgs=%%#;FDC%%:*closeppx %%n`);
ppm.setkey('ESC', `*execute B${info.ppmID},*string p,ppm_cfgs=cancel%%:*closeppx %%n`);

runPPb({bootid: info.ppmID, desc: lang.desc, fg: 'green', x: 0, y: 0, width: PPB_WIDTH, height: PPB_HEIGHT});
const ppbID = `B${info.ppmID}`;
coloredEcho(ppbID, desc.join('\\n'));

{
  const opts = `-bootid:${info.ppmID} -show -single -restoretab:off`;
  const postCmd = `${winpos('%%n', 0, PPB_HEIGHT)}%%:*mapkey use,${keyTbl}%%&`;
  PPx.Execute(`%Osq *ppc ${opts} ${cfgdir} -k ${postCmd}`);
}
ppm.deletekeys();

const ppmcache = ppm.global('ppmcache');
let [errorLevel, cfgs] = ppm.getvalue(ppbID, 'p', 'ppm_cfgs');

if (cfgs === 'cancel') {
  ppm.execute(ppbID, '*closeppx %%n');
  PPx.Quit(1);
} else if (errorLevel !== 0) {
  cfgs = fso.FileExists(`${ppmcache}\\ppm\\${uniqName.nopluginCfg}`)
    ? `${ppmcache}\\ppm\\${uniqName.nopluginCfg}`
    : `${ppmcache}\\backup\\${uniqName.initialCfg}`;
}

const manageFilePath = `${ppmcache}\\list\\${uniqName.manageFiles}`;
const [error, errorMsg] = writeLines({
  path: manageFilePath,
  data: cfgs.split(';'),
  overwrite: true,
  linefeed: info.nlcode
});
const msg = error ? errorMsg : lang.success;

ppm.execute(ppbID, `%%OW echo ${msg}%%:*closeppx %%n`);
