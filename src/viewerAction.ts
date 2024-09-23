/* @file Perform actions based on file contents */

import {tmp, uniqName, useLanguage} from '@ppmdev/modules/data.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {readLines} from '@ppmdev/modules/io.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {expandSource} from '@ppmdev/modules/source.ts';
import {langViewerAction} from './mod/language.ts';

const lang = langViewerAction[useLanguage()];
const log = {
  update: `${ppm.global('ppmcache')}\\ppm\\${uniqName.updateLog}`,
  customize: tmp().file
};

type LogType = 'update' | 'customize';
const main = (): void => {
  const path = PPx.Extract('%FDC');
  let logType: LogType;

  if (path === log.update) {
    logType = 'update';
  } else if (path === log.customize) {
    logType = 'customize';
  } else {
    return;
  }

  const [error, data] = readLines({path});

  if (error) {
    ppm.linemessage('.', lang.couldNotGet);
    PPx.Quit(-1);
  }

  const lnum = Number(PPx.Extract('%lV')) - 1;
  const pluginName = getPluginName(lnum, data.lines);

  if (isEmptyStr(pluginName)) {
    ppm.linemessage('.', lang.notFind);
    PPx.Quit(1);
  }

  doAction[logType](pluginName, data.lines[lnum]);
};

const getPluginName = (lnum: number, lines: string[]): string => {
  const rgx = /^\x1b\[42;30m\s*([\S]+)\s*\x1b\[49;39m$/;

  for (let i = lnum; i >= 0; i--) {
    const line = lines[i];

    if (~line.indexOf('\x1b[42;30m')) {
      return line.replace(rgx, '$1');
    }
  }

  return '';
};

const doAction = {
  update(name: string, text: string): void {
    const SHOW_OPTS = '--color=always --compact-summary';
    const rgx = /^(\x1b\[\d+m)?(\w{0,8})\x1b\[m\s.+$/;

    if (rgx.test(text)) {
      const source = expandSource(name);

      if (source) {
        const hash = text.replace(rgx, '$2');
        PPx.Execute(`*pptray -c %%Obd git -C ${source.path} show ${SHOW_OPTS} ${hash} | %0ppvw -utf8 -esc:on -history:off`);
        return;
      }
    }
  },
  customize(name: string): void {
    const ok = ppm.question(`${name}`, lang.customize);
    ok && ppm.execute('', `%*getcust(S_ppm#user:editor) %%sgu'ppmcache'\\config\\${name}.cfg`);
  }
};

main();
