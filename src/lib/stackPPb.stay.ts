/* @file Step through tasks in PPb
 * @arg 0 {number} - Specify PPb width. default is 400
 * @arg 1 {string} - Specify direction. "NW" | "NE" | "SW" | "SE"(default)
 * @arg 2 {string} - Specify the command line to run in PPb
 *
 * NOTE: Passing no arguments will abort all pending tasks.
 */

import '@ppmdev/polyfills/objectKeys.ts';
import {validArgs} from '@ppmdev/modules/argument.ts';
import {staymodeID} from '@ppmdev/modules/data.ts';
import debug from '@ppmdev/modules/debug.ts';
import {userEvent} from '@ppmdev/modules/event.ts';
import {isEmptyStr, isZero} from '@ppmdev/modules/guard.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {getStaymodeId} from '@ppmdev/modules/staymode.ts';

const STAYMODE_ID = getStaymodeId('stachPPb') || staymodeID.stackPPb;
const EVENT_LABEL = 'ppm_stackppb';
const EVENT_DONE = 'DoneStackPPb';
const ENABLED_IDS = {J: 0, K: 1, L: 2, M: 3, N: 4} as const;
const PPB_WIDTH = 400;
const PPB_PADDING = 10;
const PPB_CONCURRENCY_LIMIT = 10;
const TASKBAR_MARGIN = 50;
const DEFAULT_DIRECTION = 'SE';
const STATUS = {STANDBY: 'READY', INITIAL: 'STARTING', ACTIVE: 'ACTIVATE', BREAK: 'BREAKING'} as const;

type EnableId = keyof typeof ENABLED_IDS;
type Direction = 'NE' | 'NW' | 'SE' | 'SW';
type PPbStatus = typeof STATUS.STANDBY | typeof STATUS.INITIAL | typeof STATUS.ACTIVE;
type Cache = {
  dispWidth: number;
  dispHeight: number;
  ppbWidth: number;
  ppbHeight: number;
  ppbState: {[K in EnableId]: PPbStatus};
  enableIds: EnableId[];
  instances: number;
  ppcid: string;
  direction: Direction;
};
const cache = {
  dispWidth: Number(PPx.Extract('%*getcust(S_ppm#global:disp_width)')),
  dispHeight: Number(PPx.Extract('%*getcust(S_ppm#global:disp_height)')) - TASKBAR_MARGIN,
  ppbWidth: PPB_WIDTH,
  ppbHeight: 0,
  ppbState: {J: STATUS.STANDBY, K: STATUS.STANDBY, L: STATUS.STANDBY, M: STATUS.STANDBY, N: STATUS.STANDBY},
  enableIds: Object.keys(ENABLED_IDS),
  instances: 0,
  ppcid: PPx.Extract('%n')
} as Cache;

if (isZero(cache.dispWidth) || isZero(cache.dispHeight)) {
  const {scriptName} = pathSelf();
  PPx.Echo(`[ERROR] ${scriptName} S_ppm#global:disp_width & disp_height needs to be set.`);
  PPx.Quit(-1);
}

type State = typeof STATUS.STANDBY | typeof STATUS.BREAK;
let _internalStatus: State;

const main = (): void => {
  const [widthSpec, dirSpec, cmdline] = validArgs();
  cache.ppbWidth = setPPbWidth(widthSpec);
  cache.ppbHeight = Math.floor(cache.dispHeight / 5);
  cache.direction = getDirection(dirSpec);

  PPx.StayMode = STAYMODE_ID;
  PPx.Execute(
    `*linecust ${EVENT_LABEL},` +
      `KC_main:LOADEVENT,*execute ${cache.ppcid},%(*if 0%%*stayinfo(${STAYMODE_ID})%%:*js ":${STAYMODE_ID},ppx_Discard"%)`
  );
  PPx.Execute('%K"@LOADCUST"');
  ppx_resume(widthSpec, dirSpec, cmdline);
};

const ppx_resume = (widthSpec: string, _dirSpec: string, cmdline: string): void => {
  /**
   * NOTE: Not running a message loop may lead to an infinite loop
   * if more than 5 commands are passed in concurrently.
   */
  PPx.Execute('*wait 0,2');

  cache.instances++;

  if (widthSpec == null) {
    _internalStatus = STATUS.BREAK;

    return;
  }

  if (cache.instances >= PPB_CONCURRENCY_LIMIT) {
    return;
  }

  while (true) {
    for (const ppbid of cache.enableIds) {
      const isInactive = isEmptyStr(PPx.Extract(`%NB${ppbid}`));
      const state = cache.ppbState[ppbid];

      if (isInactive && state !== STATUS.INITIAL) {
        cache.ppbState[ppbid] = STATUS.INITIAL;
        stackPPb(cache.ppcid, ppbid, cache.direction, cmdline);

        return;
      }
    }

    const waitCount = 1000 + Math.floor(Math.random() * 100);
    PPx.Execute(`*wait ${waitCount},2`);

    if (_internalStatus === STATUS.BREAK) {
      cache.instances--;

      break;
    }
  }
};

const ppx_Activate = (ppbid: EnableId): void => {
  cache.ppbState[ppbid] = STATUS.ACTIVE;
};

const ppx_Success = (ppbid: EnableId): void => {
  cache.ppbState[ppbid] = STATUS.STANDBY;
  cache.instances--;
  PPx.Execute(`*closeppx B${ppbid}`);
  ppx_Discard();
};

const ppx_Discard = (): void => {
  if (cache.instances >= 0) {
    const alivePPbList = PPx.Extract('%*ppxlist(-B)');

    for (const ppbid of cache.enableIds) {
      if (~alivePPbList.indexOf(`B_${ppbid}`)) {
        return;
      }
    }
  }

  for (const ppbid of cache.enableIds) {
    PPx.Execute(`*deletecust _WinPos:B${ppbid}`);
  }

  userEvent.once(EVENT_DONE);
  PPx.Execute(`*linecust ${EVENT_LABEL},KC_main:LOADEVENT,`);
  PPx.StayMode = 0;
};

const setPPbWidth = (widthSpec: string): number => {
  const userSpec = Number(widthSpec);

  return isNaN(userSpec) ? PPB_WIDTH : userSpec;
};

const getDirection = (direction: string): Direction => {
  const rgx = /^(NW|NE|SW|SE)$/i;

  return rgx.test(direction) ? (direction.toUpperCase() as Direction) : DEFAULT_DIRECTION;
};

const _screenAlignment = {
  NW(order: number) {
    const posX = 0;
    const posY = cache.ppbHeight * order;

    return [posX, posY];
  },
  NE(order: number) {
    const posX = cache.dispWidth - cache.ppbWidth - PPB_PADDING;
    const posY = cache.ppbHeight * order;

    return [posX, posY];
  },
  SW(order: number) {
    const posX = 0;
    const posY = cache.ppbHeight * (4 - order);

    return [posX, posY];
  },
  SE(order: number) {
    const posX = cache.dispWidth - cache.ppbWidth - PPB_PADDING;
    const posY = cache.ppbHeight * (4 - order);

    return [posX, posY];
  }
};

const stackPPb = (ppcid: string, ppbid: EnableId, direction: Direction, cmdline: string): void => {
  const order = ENABLED_IDS[ppbid as EnableId];
  const pos = _screenAlignment[direction](order);
  const runOptions = '-breakjob -noppb -noactive -nostartmsg -wait:no';
  const ppbOptions = `-bootid:${ppbid} -q`;
  const winsize = `*windowsize %N,${cache.ppbWidth},${cache.ppbHeight}`;
  const activate = `*execute ${ppcid},*js ":${STAYMODE_ID},ppx_Activate",${ppbid}`;
  const info = `*linemessage %(${cmdline}%)`;
  const postProc = `*execute ${ppcid},*js ":${STAYMODE_ID},ppx_Success",${ppbid}`;

  PPx.Execute(`*setcust _WinPos:B${ppbid}=${pos.join(',')},${cache.ppbWidth},${cache.ppbHeight},0`);
  PPx.Execute(
    `*maxlength 3000%:%OP *run ${runOptions} %0ppbw.exe ${ppbOptions} -k %(${winsize}%:${activate}%:${info}%:${cmdline}%:${postProc}%)`
  );
};

PPx.result = `DONE:${EVENT_DONE}`;

main();
