/* @file Step through tasks in PPb
 * @arg 0 {string} - Specify direction. "NW" | "NE" | "SW" | "SE"
 * @arg 1 {string} - Specify the command line to run in PPb
 *
 * NOTE: Passing no arguments will abort all pending tasks.
 */

import '@ppmdev/polyfills/objectKeys.ts';
import {validArgs} from '@ppmdev/modules/argument.ts';
import debug from '@ppmdev/modules/debug.ts';
import {isEmptyStr, isZero} from '@ppmdev/modules/guard.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';

type KeyId = keyof typeof USE_IDS;
const USE_IDS = {J: 0, K: 1, L: 2, M: 3, N: 4} as const;
const PPB_WIDTH = 400;
const PPB_PADDING = 10;
const PPB_CONCURRENCY_LIMIT = 10;
const TASKBAR_MARGIN = 50;
const SI_NAME = 'ppm_stackppb';

const dispWidth = Number(PPx.Extract('%*getcust(S_ppm#global:disp_width)'));
const dispHeight = Number(PPx.Extract('%*getcust(S_ppm#global:disp_height)')) - TASKBAR_MARGIN;
const ppbHeight = Math.floor(dispHeight / 5);

if (isZero(dispWidth) || isZero(dispHeight)) {
  const {scriptName} = pathSelf();
  PPx.linemessage(`[ERROR] ${scriptName} required S_ppm#global:disp_width&disp_height`);
  PPx.Quit(-1);
}

/**
 * NOTE: Not running a message loop may lead to an infinite loop
 * if more than 5 commands are passed in concurrently.
 */
PPx.Execute('*wait 0,2');

const main = (): void => {
  if (Number(PPx.Extract('%*ppxlist(+B)')) >= PPB_CONCURRENCY_LIMIT) {
    return;
  }

  const [dirSpec, cmdline] = validArgs();
  const ppcid = PPx.Extract('%n');
  let direction = getDirection(dirSpec);

  if (!dirSpec) {
    PPx.Execute(`*execute ${ppcid},*string i,${SI_NAME}=break`);
    PPx.Execute('*wait 2000,2');
    PPx.Execute(`*execute ${ppcid},*string i,${SI_NAME}=`);

    return;
  }

  while (true) {
    for (const ppbid of Object.keys(USE_IDS)) {
      const iStatus = siValue(ppcid, ppbid);
      const isInactive = isEmptyStr(PPx.Extract(`%NB${ppbid}`));

      if (isInactive && iStatus !== 'starting') {
        PPx.Execute(`*execute ${ppcid},*string i,${SI_NAME}${ppbid}=starting`);
        stackPPb(ppcid, ppbid as KeyId, direction, cmdline);

        return;
      }
    }

    const waitCount = 1000 + Math.floor(Math.random() * 800);
    PPx.Execute(`*wait ${waitCount},2`);

    if (PPx.Extract(`%*extract(${ppcid},"%%si'${SI_NAME}'")`) === 'break') {
      PPx.Echo(111)
      break;
    }
  }
};

const siValue = (ppcid: string, ppbid: string): string => PPx.Extract(`%*extract(${ppcid},"%%si'${SI_NAME}${ppbid}'")`);

type Direction = 'NE' | 'NW' | 'SE' | 'SW';
const getDirection = (direction: string): Direction => {
  const rgx = /^NW|NE|SW|SE$/i;

  return rgx.test(direction) ? (direction.toUpperCase() as Direction) : 'SE';
};

const _screenAlignment = {
  NW(order: number) {
    const posX = 0;
    const posY = ppbHeight * order;

    return [posX, posY];
  },
  NE(order: number) {
    const posX = dispWidth - PPB_WIDTH - PPB_PADDING;
    const posY = ppbHeight * order;

    return [posX, posY];
  },
  SW(order: number) {
    const posX = 0;
    const posY = ppbHeight * (4 - order);

    return [posX, posY];
  },
  SE(order: number) {
    const posX = dispWidth - PPB_WIDTH - PPB_PADDING;
    const posY = ppbHeight * (4 - order);

    return [posX, posY];
  }
};

const stackPPb = (ppcid: string, ppbid: KeyId, direction: Direction, cmdline: string): void => {
  const order = USE_IDS[ppbid as KeyId];
  const pos = _screenAlignment[direction](order);
  const runOptions = '-breakjob -newgroup -noppb -nostartmsg -noactive -wait:no';
  const ppbOptions = `-bootid:${ppbid} -q`;
  const winsize = `*windowsize %N,${PPB_WIDTH},${ppbHeight}`;
  const setSiActivate = `*execute ${ppcid},*string i,${SI_NAME}${ppbid}=activate`;
  const postProc = `*execute ${ppcid},*string i,${SI_NAME}${ppbid}=%:*closeppx %n`;

  PPx.Execute(`*setcust _WinPos:B${ppbid}=${pos.join(',')},${PPB_WIDTH},${ppbHeight},0`);
  PPx.Execute(`%OP *run ${runOptions} %0ppbw.exe ${ppbOptions} -k %(${winsize}%:${setSiActivate}%:${cmdline}%&${postProc}%)`);
};

main();
