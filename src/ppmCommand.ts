/* @file Get specified data from specified source
 * @arg 0  {string} - Specify the command
 * @arg 1  {string} - Specify a plugin name
 * @arg 2+ {any}    - Options
 */

import type {Level_String} from '@ppmdev/modules/types.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {expandSource, sourceComp, sourceComplistPath} from '@ppmdev/modules/source.ts';
import {info, useLanguage, uniqName} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {langCommand} from './mod/language.ts';

const {scriptName} = pathSelf();
const lang = langCommand[useLanguage()];

const main = (): void => {
  const plugin = adjustArgs();

  switch (plugin.cmd) {
    case 'help':
      {
        const [exitcode, name] = pluginSpec('', '*ppmHelp');

        if (exitcode === 0) {
          const source = expandSource(name);
          source?.path
            ? ppm.execute('C', `%*getcust(S_ppm#user:help) ${source.path}\\doc\\help.txt`)
            : ppm.echo(scriptName, `${name} ${lang.invalidName}`);
        }
      }
      break;

    case 'pluginInstall':
      {
        doScript('pluginInstall');
      }
      break;

    case 'pluginUpdate':
      {
        const [level, name] = pluginSpec('all', '*ppmUpdate');
        level === 0 && doScript('pluginUpdate', name, true);
      }
      break;

    case 'pluginlist':
      {
        ppm.execute('C', `%*getcust(S_ppm#user:editor) %sgu"ppmcache"\\list\\${uniqName.pluginList}`);
        doScript('pluginInstall');
      }
      break;

    case 'edit':
      {
        const [level, name] = pluginSpec('', '*ppmEdit', true);
        const withShift = ppm.extract('.', '%*shiftkeys')[1] === '1024';

        if (level === 0) {
          const path = `%%sgu"ppmcache"\\config\\${name}.cfg`;
          ppm.execute('C', `%*getcust(S_ppm#user:editor) ${path}`);
          withShift && doScript('pluginRegister', `${name},set,user`, true);
        }
      }
      break;

    case 'compare':
      {
        const [level, name] = pluginSpec('', '*ppmCompare', true);
        const withShift = PPx.Extract('%*shiftkeys') === '1024';

        if (level === 0) {
          const user = `%sgu"ppmcache"\\config\\${name}.cfg`;
          const source = expandSource(name);

          if (!source?.path) {
            ppm.echo(scriptName, `${name} ${lang.invalidName}`);
          } else {
            const patch = `${source.path}\\setting\\patch.cfg`;
            ppm.execute('', `%*getcust(S_ppm#user:compare) ${user} ${patch}`);
            withShift && doScript('pluginRegister', `${name},set,user`, true);
          }
        }
      }
      break;

    case 'set':
      {
        const [exitcode, name] = pluginSpec('all', '*ppmSet');

        exitcode === 0 && doScript('pluginRegister', `${name},set,user`, true);
      }
      break;

    case 'setDefault':
      {
        const [exitcode, name] = pluginSpec('all', '*ppmSetDefault');

        exitcode === 0 && doScript('pluginRegister', `${name},set,default`);
      }
      break;

    case 'unset':
      {
        const [exitcode, name] = pluginSpec('all', '*ppmUnset');

        if (name === info.ppmName) {
          ppm.echo(scriptName, `${info.ppmName} ${lang.cannotUnset}`);
        } else if (exitcode === 0) {
          doScript('pluginRegister', `${name},unset,user`);
        }
      }
      break;

    case 'load':
      {
        const [level, path] = ppm.getinput({
          message: '%sgu"ppmcache"\\backup\\',
          title: `*ppmLoadCfg ${lang.loadCfg}`,
          mode: 'c',
          select: 'l',
          autoselect: true,
          k: '*completelist'
        });

        level === 0 &&
          PPx.Execute(
            `*cd %0%:*ppb -k %%OWq *ppcust CS ${path}%%:*closeppx C*%%:*wait 100,2%%:*ppc%%:*wait 500,2%%:*closeppx %%n`
          );
      }
      break;

    case 'open':
      {
        const [exitcode, path] = pathSpec(plugin.opts[0], lang.open);
        exitcode === 0 && ppm.execute('C', `%*getcust(S_ppm#user:editor) ${path}`);
      }
      break;

    case 'opendiff':
      {
        const paths: string[] = [];
        let [exitcode, path] = [0, ''];

        for (let i = 0, k = 2; i < k; i++) {
          if (!fso.FileExists(plugin.opts[i])) {
            [exitcode, path] = pathSpec(plugin.opts[i], lang.opendiff);

            switch (exitcode) {
              case 0:
                fso.FileExists(path) && paths.push(path);
                break;
              case 13:
                PPx.Quit(-1);
            }
          } else {
            paths.push(plugin.opts[i]);
          }
        }

        exitcode === 0 && ppm.execute('C', `%*getcust(S_ppm#user:compare) ${paths.join(' ')}`);
      }
      break;

    default:
  }
};

const adjustArgs = (args = PPx.Arguments): {cmd: string; opts: string[]} => {
  const arr: string[] = ['', ''];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  const [, ...opts] = arr;
  return {cmd: arr[0], opts};
};

const pathSpec = (parent: string, cmd: string): Level_String => {
  let [errorlevel, data] = ppm.getinput({
    message: parent,
    title: `ppm${cmd}`,
    mode: 'c',
    select: 'l',
    autoselect: true,
    k: '*completelist'
  });

  if (isEmptyStr(data)) {
    errorlevel = 13;
  }

  return [errorlevel, data];
};

const pluginSpec = (name: string, cmd: string, shift?: boolean): Level_String => {
  const dialog = shift ? lang.shiftEnter : '';
  const [level, name_] = ppm.getinput({
    message: name,
    title: `${cmd} ${lang.nameSpec} ${dialog}`,
    mode: 'e',
    autoselect: true,
    k: `*completelist -module:off -file:"${sourceComplistPath}"`
  });

  return [level, sourceComp.expandName(name_)];
};

type LangKeys = keyof typeof lang;
const doScript = (name: LangKeys, opts?: string, choice?: boolean) => {
  if (!choice) {
    const ok = ppm.question(name, lang[name]);
    ok && PPx.Execute(`*script %sgu"ppm"\\dist\\${name}.js,${opts}`);
  } else {
    const answer = ppm.choice('C', `ppm/${name}`, lang[name], 'Ync', undefined, lang.updateTrial);
    const dryrun = answer === 'no' ? '1' : '0';

    answer !== 'cancel' && PPx.Execute(`*script %sgu"ppm"\\dist\\${name}.js,${opts},${dryrun}`);
    ppm.linemessage('C', lang.finish, true);
  }
};

main();
