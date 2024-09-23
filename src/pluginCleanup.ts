/* @file Clean up disabled plugins */

import type {Error_Data} from '@ppmdev/modules/types.ts';
import {info, useLanguage} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {type Source, expandSource} from '@ppmdev/modules/source.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {langPluginCleanup} from './mod/language.ts';
import debug from '@ppmdev/modules/debug.ts';

/* main */
const {scriptName} = pathSelf();
const lang = langPluginCleanup[useLanguage()];
const [error, sources] = ((): Error_Data => {
  const [errorlevel, data] = ppm.getcust('S_ppm#sources');

  return errorlevel === 0 ? [false, data.split(info.nlcode)] : [true, lang.clean];
})();

if (error) {
  ppm.echo(scriptName, sources);
  PPx.Quit(1);
}

const cleanupPlugins = {name: '', source: '', repo: ''};
let plugin: Source | undefined;

for (let i = 1, k = sources.length - 2; i < k; i++) {
  plugin = expandSource(sources[i].split('\t=')[0]);

  if (plugin && !plugin.enable) {
    cleanupPlugins.name = `${cleanupPlugins.name}${info.nlcode}${plugin.name}`;
    cleanupPlugins.source = `${cleanupPlugins.source}*deletecust S_ppm#sources:${plugin.name}%:`;
    cleanupPlugins.repo = `${cleanupPlugins.repo}*delete ${plugin.path}%:`;
  }
}

if (isEmptyStr(cleanupPlugins.name)) {
  ppm.echo(scriptName, lang.clean);
  PPx.Quit(1);
}

{
  const msg = `${lang.askContinue}${cleanupPlugins.name}`;
  !ppm.question(scriptName, msg) && PPx.Quit(1);
}

debug.log(`source: ${cleanupPlugins.source}\nrepo:${cleanupPlugins.repo}`);

let code = PPx.Execute(cleanupPlugins.source) === 0;
code = code && PPx.Execute(cleanupPlugins.repo) === 0;
code ? ppm.linemessage('.', lang.success, true) : ppm.echo(scriptName, lang.failed);
