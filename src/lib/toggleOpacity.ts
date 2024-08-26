/* @file Toggle the opacity of launcher PPx
 * @arg 0 {number} - Specify the higher opacity
 * @arg 1 {number} - Specify the lower opacity
 */

import {safeArgs} from '@ppmdev/modules/argument.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';

const ppxid = PPx.Extract('%n#') || PPx.Extract('%n');

if (isEmptyStr(ppxid)) {
  PPx.Quit(-1);
}

const main = (): void => {
  const [higher, lower] = safeArgs(90, 80);
  const current = PPx.Extract(`%*getcust(X_bg:O_${ppxid})`);

  if (/^(100)?$/.test(current)) {
    toggleOpacity(higher);
  } else if (Number(current) > lower) {
    toggleOpacity(lower);
  } else {
    toggleOpacity(100);
  }
};

const toggleOpacity = (v: number): void => {
  v === 100 ? PPx.Execute(`*deletecust X_bg:O_${ppxid}%:%K"@LOADCUST"`) : PPx.Execute(`*customize X_bg:O_${ppxid}=${v}`);
};

main();
