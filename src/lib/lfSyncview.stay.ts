/* @file Supports SyncView for virtual entries
 * @arg 0 {string} - Key to press when the ListFile does not have metadata ppm. default="@\Y"
 * @arg 1 {number} - PPv starting position. 0=normal | 1=on pair window | 2=capture into pair window
 * @arg 2 {number} - If 1 is specified, PPv closes when SyncView ends
 * @arg 3 {string} - Displays debug messages when "DEBUG" is specified
 */

import {safeArgs} from '@ppmdev/modules/argument.ts';
import {uniqID} from '@ppmdev/modules/data.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import debug from '@ppmdev/modules/debug.ts';

const STAYMODE_ID = 80000;
const EVENT_LABEL = 'ppm_lfsyncview';
const cache = {ppvid: '', close: false, debug: false};

const main = (): void => {
  const [keyspec, style, closeppv, debugMode] = safeArgs('@\\Y', 0, 0, '0');
  const userData = PPx.Extract(`%*extract(%%su'${uniqID.lfDset}%n')`);

  if (isEmptyStr(userData)) {
    PPx.Execute(`%K"${keyspec}"`);

    return;
  }

  cache.close = closeppv === 1;
  cache.debug = debugMode === 'DEBUG';
  cache.debug && debugMsg('start');

  startPPv(style);
  PPx.StayMode = STAYMODE_ID;
  ppx_Syncview();
  PPx.Execute(`*linecust ${EVENT_LABEL},KC_main:SELECTEVENT,*if ("%n"=="%%n")%%:*script ":${STAYMODE_ID},ppx_Syncview"`);
};

const ppx_Syncview = (): void => {
  PPx.Execute(`*execute ${cache.ppvid},%%J"%*name(DC,"%*comment")"`);
  isEmptyStr(PPx.Extract(`%N${cache.ppvid}`)) && ppx_resume();
};

const ppx_resume = () => {
  PPx.StayMode = 0;
  PPx.SyncView = 0;
  PPx.Execute(`*linecust ${EVENT_LABEL},KC_main:SELECTEVENT,`);
  cache.close && PPx.Execute(`*closeppx ${cache.ppvid}`);
  cache.debug && debugMsg('discard');
};

const startPPv = (style: number) => {
  const option = style === 1 ? '-popup:%~N' : '';
  PPx.Execute(`%Oa *ppv ${option}`);
  PPx.Sleep(100);
  cache.ppvid = PPx.Extract('%*extract(V,"%%n")');

  if (style === 2) {
    PPx.Execute(`*capturewindow ${cache.ppvid} -pane:~ -selectnoactive`);
  }
};

const debugMsg = (msg: string): void => PPx.linemessage(`[DEBUG] lfSyncView ${msg}`);

main();
