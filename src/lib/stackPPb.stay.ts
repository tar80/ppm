/* @file Step through tasks in PPb
 * @arg 0 {number} - Specify PPb width. default is 400
 * @arg 1 {string} - Specify direction. "min" | "nw" | "ne" | "sw" | "se"(default)
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

const STAYMODE_ID = getStaymodeId('stackPPb') || staymodeID.stackPPb;
const EVENT_LABEL = 'ppm_stackppb';
const EVENT_DONE = 'DoneStackPPb';
const ENABLED_IDS = {J: 0, K: 1, L: 2, M: 3, N: 4} as const;
const PPB_WIDTH = 400;
const PPB_PADDING = 10;
const PPB_CONCURRENCY_LIMIT = 30;
const TASKBAR_MARGIN = 50;
const DEFAULT_DIRECTION = 'SE';
const STATUS = {STANDBY: 'READY', INITIAL: 'STARTING', ACTIVE: 'ACTIVATE'} as const;

type EnableId = keyof typeof ENABLED_IDS;
type Direction = 'NE' | 'NW' | 'SE' | 'SW' | 'MIN';
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
  finish: boolean;
  stack: string[];
};
const cache = {
  dispWidth: Number(PPx.Extract('%*getcust(S_ppm#global:disp_width)')),
  dispHeight: Number(PPx.Extract('%*getcust(S_ppm#global:disp_height)')) - TASKBAR_MARGIN,
  ppbWidth: PPB_WIDTH,
  ppbHeight: 0,
  ppbState: {J: STATUS.STANDBY, K: STATUS.STANDBY, L: STATUS.STANDBY, M: STATUS.STANDBY, N: STATUS.STANDBY},
  enableIds: Object.keys(ENABLED_IDS),
  instances: 0,
  ppcid: PPx.Extract('%n'),
  finish: false,
  stack: [] as Cache['stack']
} as Cache;

if (isZero(cache.dispWidth) || isZero(cache.dispHeight)) {
  const {scriptName} = pathSelf();
  PPx.Echo(`[ERROR] ${scriptName} S_ppm#global:disp_width & disp_height needs to be set.`);
  PPx.Quit(-1);
}

const main = (): void => {
  const [widthSpec, dirSpec, cmdline] = validArgs();
  cache.ppbWidth = setPPbWidth(widthSpec);
  cache.ppbHeight = Math.floor(cache.dispHeight / 5);
  cache.direction = getDirection(dirSpec);

  PPx.StayMode = STAYMODE_ID;
  PPx.Execute(
    `*linecust ${EVENT_LABEL},` +
      `KB_edit:CLOSEEVENT,*execute ${cache.ppcid},%(*if 0%%*stayinfo(${STAYMODE_ID})%%:*js ":${STAYMODE_ID},ppx_Completion",%n%)`
  );
  ppx_resume(widthSpec, dirSpec, cmdline);
};

/**
 * @desc The function that actually exeutes PPb.
 * - Tasks with 6 or more will be put on hold until a PPb ID becomes available
 * - More than 30 tasks will de discarded
 * - If there is no argument, the held Tasks will be discarded
 * @arg widthSpec - Specify the length of PPb as a string
 * @arg _dirSpec  - Specify the stacking direction. Not used because it uses caching
 * @arg cmdline   - Specify the command line to execute with PPb
 */
const ppx_resume = (widthSpec: string, _dirSpec: string, cmdline: string): void => {
  if (cache.finish) {
    return;
  }

  if (widthSpec == null) {
    cache.stack = [];

    return;
  }

  if (cache.instances >= PPB_CONCURRENCY_LIMIT) {
    return;
  }

  cache.instances++;

  for (const ppbid of cache.enableIds) {
    const isInActive = isEmptyStr(PPx.Extract(`%NB${ppbid}`));

    if (isInActive && cache.ppbState[ppbid] !== STATUS.INITIAL) {
      cache.ppbState[ppbid] = STATUS.INITIAL;
      stackPPb(cache.ppcid, ppbid, cache.direction, cmdline);

      return;
    }
  }

  cache.stack.push(cmdline);
};

const ppx_Activate = (ppbid: EnableId): void => {
  cache.ppbState[ppbid] = STATUS.ACTIVE;
};

const ppx_Completion = (ppbid: string): void => {
  const id = ppbid.slice(1) as EnableId;
  cache.ppbState[id] = STATUS.STANDBY;
  cache.instances--;

  if (cache.instances === 0 && !cache.finish) {
    ppx_Discard();
  } else if (cache.stack.length > 0) {
    const cmdline = cache.stack.splice(0, 1)[0];

    if (cmdline) {
      cache.ppbState[id] = STATUS.INITIAL;
      stackPPb(cache.ppcid, id, cache.direction, cmdline);
    }
  }
};

const ppx_Discard = (): void => {
  cache.finish = true;

  for (const ppbid of cache.enableIds) {
    PPx.Execute(`*deletecust _WinPos:B${ppbid}`);
  }

  PPx.Execute(`*linecust ${EVENT_LABEL},KB_edit:CLOSEEVENT,`);
  userEvent.once(EVENT_DONE);
  PPx.StayMode = 0;
};

const setPPbWidth = (widthSpec: string): number => {
  const userSpec = Number(widthSpec);

  return isNaN(userSpec) ? PPB_WIDTH : userSpec;
};

const getDirection = (direction: string): Direction => {
  const rgx = /^(NW|NE|SW|SE|MIN)$/i;

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
  const runOptions = ['-breakjob', '-noppb', '-nostartmsg', '-wait:no'];
  const ppbOptions = `-bootid:${ppbid} -q`;
  const activate = `*execute ${ppcid},*js ":${STAYMODE_ID},ppx_Activate",${ppbid}`;
  const postProc = `*closeppx B${ppbid}`;
  const info = `*linemessage %(${cmdline}%)`;
  let winsize = '';

  if (direction !== 'MIN') {
    const pos = _screenAlignment[direction](order);
    winsize = `*windowsize %N,${cache.ppbWidth},${cache.ppbHeight}`;
    PPx.Execute(`*setcust _WinPos:B${ppbid}=${pos.join(',')},${cache.ppbWidth},${cache.ppbHeight},0`);
    runOptions.push('-noactive');
  } else {
    runOptions.push('-min');
  }

  PPx.Execute(
    '*maxlength 3000%:' +
      `%OP *run ${runOptions.join(' ')} %0ppbw.exe ${ppbOptions} -k %(${winsize}%:${activate}%:${info}%:${cmdline}%:${postProc}%)`
  );
};

PPx.result = `DONE:${EVENT_DONE}`;

main();
