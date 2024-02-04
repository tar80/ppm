/* @file Restore ppm settings
 * @arg 0 {string} - Specify the path of ppmcache
 * @arg 1 {string} - Specify the path to the ppm installation directory
 */

import fso from '@ppmdev/modules/filesystem.ts';
import {useLanguage, uniqName} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {msgBox} from '@ppmdev/modules/ppm.ts';
import {langRestore} from './mod/language.ts';

const {scriptName} = pathSelf();
const lang = langRestore[useLanguage()];

const data = ((args = PPx.Arguments): {ppmcache: string; ppmDir: string} | string => {
  const arr: string[] = ['', ''];
  const len = args.length;

  if (len < 2) {
    return lang.notEnoughArgument;
  }

  for (let i = 0; i < len; i++) {
    arr[i] = args.Item(i);

    if (!fso.FolderExists(arr[i])) {
      return `${arr[i]} ${lang.notExist}`;
    }
  }

  return {ppmcache: arr[0], ppmDir: arr[1]};
})();

if (typeof data === 'string') {
  msgBox(scriptName, data);
  PPx.Quit(-1);
}

PPx.Execute(`*string u,ppmcache=${data.ppmcache}`);
PPx.Execute(`*setcust @${data.ppmcache}\\ppm\\${uniqName.globalCfg}`);
PPx.Execute(`*script ${data.ppmDir}\\dist\\pluginRegister.js,all,restore,user`);
