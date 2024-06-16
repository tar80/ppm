/* @file ppx-plugin-manager uninstaller
 * @arg 0 {"restart"} - Restart in PPc when executed from PPb
 */

import debug from '@ppmdev/modules/debug.ts';
import {info, useLanguage} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {runPPb} from '@ppmdev/modules/run.ts';
import {langUninstaller} from './mod/language.ts';
import {installer as core} from './mod/core.ts';

const ppmVersion = ppm.global('version');
const {scriptName} = pathSelf();
const lang = langUninstaller[useLanguage()];
const ppbID = `B${info.ppmID}`;
const restart = PPx.Arguments.length !== 0 && PPx.Argument(0) === 'restart';

if (!restart) {
  if (isEmptyStr(ppmVersion)) {
    ppm.echo(scriptName, lang.notRegistered);
    PPx.Quit(1);
  }

  const ok = ppm.question(scriptName, lang.start);

  if (!ok) {
    PPx.Quit(1);
  }

  if (PPx.Extract('%n') !== ppbID) {
    const title = `${info.ppmName} ver${ppmVersion}`;
    runPPb({bootid: info.ppmID, desc: title, fg: 'cyan', x: 0, y: 0, width: 700, height: 500});
  } else {
    ppm.execute('C', `*script ${scriptName},restart`);
    PPx.Quit(1);
  }
}

/* Delete plugin settings */
PPx.Execute('*script %sgu"ppm"\\dist\\pluginRegister.js,all,unset');

/* Delete *ppmRestore */
ppm.execute(ppbID, '*script %sgu"ppm"\\dist\\ppmRestoreRegister.js,unset');
PPx.Execute('*wait 1000');

/* Delete _User variables */
const exitcode = ppm.setcust(`@%sgu"ppmcache"\\ppm\\unset\\${info.ppmName}.cfg`);
exitcode !== 0 && debug.log(String(exitcode));

ppm.deletecust('S_ppm#global');
ppm.deletecust('S_ppm#user');
ppm.deletecust('S_ppm#sources');

//TODO: S_ppm#plugins will remove v1.0.0
ppm.deletecust('S_ppm#plugins');

/* Delete directories */
PPx.Execute('*delete %sgu"ppmarch"');
PPx.Execute('*delete %sgu"ppmrepo"');

core.globalPath.unset();

ppm.execute(ppbID, `%%OWq echo ${lang.finish} %%:*closeppx C*%%:*wait 100,2%%:*ppc%%:*wait 500,2%%:*closeppx %%n`);
