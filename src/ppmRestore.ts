/* @file Restore ppm settings
 * @arg 0 {string} - Specify the path of ppmcache
 * @arg 1 {string} - Specify the path to the ppm installation directory
 */

import fso from '@ppmdev/modules/filesystem.ts';
import {useLanguage, uniqName} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {msgBox} from '@ppmdev/modules/ppm.ts';
import {langRestore} from './mod/language.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';

const {scriptName} = pathSelf();
const lang = langRestore[useLanguage()];

const main = (): void => {
  const [ppmcache, ppmDir] = safeArgs('', '');

  if (!fso.FolderExists(ppmcache)) {
    msgBox(scriptName, `${ppmcache} ${lang.notExist}`);
    PPx.Quit(-1);
  }

  if (!fso.FolderExists(ppmDir)) {
    msgBox(scriptName, `${ppmDir} ${lang.notExist}`);
    PPx.Quit(-1);
  }

  PPx.Execute(`*string u,ppmcache=${ppmcache}`);
  PPx.Execute(`*setcust @${ppmcache}\\ppm\\${uniqName.globalCfg}`);
  PPx.Execute(`*script ${ppmDir}\\dist\\pluginRegister.js,all,restore,user`);
};

main();
