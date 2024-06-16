/* @file Registrer user command *ppmRestore
 * @arg 0 {string} - Specify processing method. "set"|"unset"|"reset"
 */

import '@ppmdev/polyfills/arrayIndexOf.ts';
import {NlCodes, Error_String} from '@ppmdev/modules/types.ts';
import {useLanguage} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {readLines, writeLines} from '@ppmdev/modules/io.ts';
import {langRestoreRegister} from './mod/language.ts';

const RANGE_START = ';[ppm]';
const RANGE_END = ';[endppm]';
const {scriptName, parentDir} = pathSelf();
const lang = langRestoreRegister[useLanguage()];

type RegisterMethod = 'set' | 'unset' | 'reset';
const main = (): void => {
  const proc = PPx.Arguments.length !== 0 ? PPx.Argument(0) : '';
  const rgx = /^(un|re)?set$/;

  if (!rgx.test(proc)) {
    PPx.Execute(`*script ${parentDir}\\lib\\errors.js",arg,${scriptName}`);
  }

  const path = PPx.Extract('%0%\\PPXDEF.CFG');
  const [error, errorMsg] = readLines({path});

  if (error) {
    ppm.echo(scriptName, errorMsg);
    PPx.Quit(-1);
  }

  const {lines, nl} = errorMsg;

  const [error2, errorMsg2] = register[proc as RegisterMethod](path, lines, nl);
  const msg = error2 ? errorMsg2 : proc !== 'unset' ? lang.reg : lang.unreg;
  ppm.linemessage('.', msg, true);
};

const register = {
  // TODO: delete this v1.0.0
  reset(path: string, lines: string[], linefeed: NlCodes): Error_String {
    const rgx = /^ppmRestore\s=\s\*script ".+\\restore\.js",".+/;
    const ppmcache = ppm.global('ppmcache');
    const ppmDir = ppm.global('ppm');
    let resetFlag = false;

    for (let i = 0, k = lines.length - 1; i < k; i++) {
      if (rgx.test(lines[i])) {
        lines[i] = `ppmRestore = *script "${parentDir}\\ppmRestore.js","${ppmcache}","${ppmDir}"`;
        resetFlag = true;
        break;
      }
    }

    return resetFlag ? writeLines({path, data: lines, overwrite: true, linefeed}) : [false, ''];
  },

  set(path: string, lines: string[], linefeed: NlCodes): Error_String {
    if (~lines.indexOf(RANGE_START)) {
      return [true, lang.registered];
    }

    const ppmcache = ppm.global('ppmcache');
    const ppmDir = ppm.global('ppm');
    const data: string[] = [
      RANGE_START,
      '_Command = {',
      `ppmRestore = *script "${parentDir}\\ppmRestore.js","${ppmcache}","${ppmDir}"`,
      '}',
      RANGE_END
    ];

    return writeLines({path, data, append: true, linefeed});
  },

  unset(path: string, lines: string[], linefeed: NlCodes): Error_String {
    const addData: string[] = [];
    ppm.deletecust('_Command', 'ppmRestore');

    if (!~lines.indexOf(RANGE_START)) {
      return [true, lang.notRegistered];
    }

    let currentLine: string;

    for (let i = 0, k = lines.length - 1; i < k; i++) {
      currentLine = lines[i];

      if (~currentLine.indexOf(RANGE_START)) {
        for (i = i + 1; i < k; i++) {
          currentLine = lines[i];

          if (~currentLine.indexOf(RANGE_END)) {
            break;
          }
        }

        continue;
      }

      addData.push(currentLine);
    }

    return writeLines({path, data: addData, overwrite: true, linefeed});
  }
} as const;

main();
