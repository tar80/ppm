/* @file Handle virtual entries
 * @arg 0 {string} - Matadata base
 * @arg 1 {string} - Metadata dirtype
 * @arg 2 {string} - Metadata search
 * @arg 3 {string} - Metadata ppm
 * @arg 4 {string} - Metadata mapkey
 * @arg 5 {string} - Metadata freq
 */

import {validArgs} from '@ppmdev/modules/argument.ts';
import {ppmTable, staymodeID, uniqID} from '@ppmdev/modules/data.ts';
import debug from '@ppmdev/modules/debug.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {isEmptyStr} from '@ppmdev/modules/guard.ts';
import {capturePPv} from '@ppmdev/modules/ppv.ts';
import {atLoadEvent, getStaymodeId} from '@ppmdev/modules/staymode.ts';
import type {Letters} from '@ppmdev/modules/types.ts';
import {waitMoment} from '@ppmdev/modules/util.ts';

const STAYMODE_ID = getStaymodeId('veHandler') || staymodeID.veHandler;
const RESTORE_SCRIPT_NAME = 'restorePPv.js';
const EVENT_LABEL = uniqID.virtualEntry;
const TABLE_ACTIONS = ppmTable.actions;
const DELIM = '@#_#@';

type MetadataKey = 'base' | 'dirtype' | 'ppm' | 'search' | 'mapkey' | 'freq';
type Metadata = {[key in MetadataKey]: string};
type PPv = {id?: string; lnum?: string; tmod?: string; winpos?: string; xwin?: string};
type EntryDetails = {att: PPxEntry.Attribute; hl: number; path: string; sname: string};
type BoolStr = '0' | '1';
type Cache = {metadata: Metadata; ppv: PPv};
const cache = {metadata: {}, ppv: {}} as Cache;
PPx.StayMode = STAYMODE_ID;

const main = (): void => {
  const [base, dirtype, search, ppm, mapkey, freq] = validArgs();

  if (ppm === 'undefined') {
    return;
  }

  cache.metadata = convMetadata(base, dirtype, search, ppm, mapkey, freq);
  atLoadEvent.discard({table: 'KC_main', label: EVENT_LABEL, mapkey, cond: 'hold'});
};

const ppx_resume = (): void => {};

const ppx_Action = (cmdAlias: string, escBlank: string, allowDup: string) => {
  const cmdline = escapedCmdline(cache.metadata.ppm, cmdAlias);

  if (isEmptyStr(cmdline)) {
    PPx.Quit(1);
  }

  const isEvery = cache.metadata.freq === 'every';
  const actionCmd = isEvery
    ? ({entry, isDup}: {entry: EntryDetails; isDup: BoolStr}): void => {
        const _cmdline = replaceCmdline({
          cmdline,
          base: cache.metadata.base,
          dirtype: cache.metadata.dirtype,
          search: cache.metadata.search,
          isDup,
          entry
        });
        PPx.Execute(`%OP- *execute ,%(${_cmdline}%)`);
      }
    : ({entry}: {entry: EntryDetails}): void => {
        entries.push(entry.path);
      };
  const blankReplacer = blankHandle(escBlank);
  const entries: string[] = [];
  const duplicates: Record<string, typeof isDup> = {};
  let isDup: BoolStr;

  const e = PPx.Entry;
  e.FirstMark;

  do {
    const entry: EntryDetails = {
      att: e.Attributes,
      hl: e.Highlight,
      path: ~e.Comment.indexOf(':') ? e.Comment : `${cache.metadata.base}\\${e.Comment}`,
      sname: e.ShortName
    };

    if (fso.FileExists(entry.path)) {
      if (~entry.path.indexOf(' ')) {
        entry.path = blankReplacer(entry.path);
      }

      isDup = duplicates[entry.path] || '0';

      if (allowDup || isDup === '0') {
        duplicates[entry.path] = '1';
        actionCmd({entry, isDup});
      }
    }
  } while (e.NextMark);

  if (!isEvery) {
    const data = `dup:0${DELIM}search:${cache.metadata.search}${DELIM}path:${entries.join(' ')}`;
    const rgx = `^dup:(?<dup>0)${DELIM}search:(?<search>.*)${DELIM}path:(?<path>.+)$`;
    debug.log(PPx.Extract(`%*regexp("%(${data}%)","%(/${rgx}/${cmdline}/%)")`));
    PPx.Execute(`%OP *execute ,%%OP- %*regexp("%(${data}%)","%(/${rgx}/${cmdline}/%)")`);
  }
};

const ppx_Syncview = (ppvid: Letters, close: string, position: string, search: string, jumpline: string): void => {
  const isClose = close === '1';

  if (!cache.ppv.id) {
    cache.ppv.id = startPPv(ppvid, position, search, jumpline);

    if (isEmptyStr(cache.ppv.id)) {
      PPx.linemessage('!"could not get PPv ID');

      return;
    }

    PPx.Execute(
      _selectEvent(`*if %*stayinfo(${STAYMODE_ID})&&("%n"=="%%n")&&("%FDV"=="%%FDV")%%:*js ":${STAYMODE_ID},ppx_SelectEvent",${jumpline}`)
    );
    PPx.Execute(_closeEvent(cache.ppv.id.slice(-1)));
    ppx_SelectEvent(jumpline);
  } else if (!isEmptyStr(PPx.Extract(`%N${cache.ppv.id}`))) {
    PPx.Execute(_selectEvent(''));
    if (isClose) {
      PPx.Execute(`*closeppx ${cache.ppv.id}`);
      cache.ppv = {};
    } else {
      cache.ppv.id = undefined;
    }
  }
};

const ppx_SelectEvent = (jumpline: string): void => {
  const path = PPx.Extract(`%*name(DC,"%*comment")`);

  if (jumpline !== '1') {
    PPx.Execute(`*execute ${cache.ppv.id},%%J"${path}"`);

    return;
  }

  const row = PPx.Extract(`%*name(SC,"%FSC")`);

  if (row === '-') {
    return;
  }

  if (path !== PPx.Extract(`%*extract(${cache.ppv.id},"%%FDC")`)) {
    PPx.Execute(`*execute ${cache.ppv.id},%%J"${path}"`);
    waitMoment(() => PPx.Extract(`%*extract(${cache.ppv.id},"%%FDC")`) !== path);
  }

  PPx.Execute(`*execute ${cache.ppv.id},*jumpline ${row}`);
};

const convMetadata = (base: string, dirtype: string, search: string, ppm: string, mapkey: string, freq: string): Metadata => {
  const conv = (value: string): string => (value !== 'undefined' ? value : '');

  return {base: conv(base), dirtype: conv(dirtype), search: conv(search), ppm, mapkey: conv(mapkey), freq: conv(freq)} as const;
};

const escapedCmdline = (plugin: string, command: string): string => {
  const value =
    PPx.Extract(`%*getcust(${TABLE_ACTIONS}:${plugin}_${command})`) || PPx.Extract(`%*getcust(${TABLE_ACTIONS}:all_${command})`);

  return value.replace(/\//g, '\\/');
};

const blankHandle = (escSpec: string): ((path: string) => string) => {
  const o = {
    enclose(path: string): string {
      return `"${path}"`;
    },
    double(path: string): string {
      return `""${path}""`;
    },
    escape(path: string): string {
      return path.replace(/\s/g, '\\ ');
    }
  };
  const func = o[escSpec as never];

  return func ?? o.enclose;
};

type CmdParameters = {cmdline: string; base: string; dirtype: string; search: string; isDup: BoolStr; entry: EntryDetails};
const replaceCmdline = ({cmdline, base, dirtype, search, isDup, entry}: CmdParameters): string => {
  const att = entry.att ?? '';
  const hl = entry.hl ? String(entry.hl) : '';
  const sname = entry.sname ?? '';
  const data = `base:${base}${DELIM}dirtype:${dirtype}${DELIM}search:${search}${DELIM}dup:${isDup}${DELIM}path:${entry.path}${DELIM}att:${att}${DELIM}hl:${hl}${DELIM}option:${sname}`;
  const rgx = `base:(?<base>.*)${DELIM}dirtype:(?<type>.*)${DELIM}search:(?<search>.*)${DELIM}dup:(?<dup>.+)${DELIM}path:(?<path>.+)${DELIM}att:(?<att>.*)${DELIM}hl:(?<hl>.*)${DELIM}option:(?<option>.*)`;

  if (debug.jestRun()) {
    // @ts-ignore
    return {data, rgx, cmdline};
  }

  return PPx.Extract(`%OP %*regexp("%(${data}%)","%(/${rgx}/${cmdline}/%)")`);
};

const _selectEvent = (cmdline: string): string => `*linecust ${EVENT_LABEL},KC_main:SELECTEVENT,${cmdline}`;
const _closeEvent = (id: string): string => {
  const closeevent = `*linecust ${EVENT_LABEL},KV_main:CLOSEEVENT,`;
  const cmdline: string[] = [];
  cache.ppv.lnum && cmdline.push(`*setcust XV_lnum=${cache.ppv.lnum}`);
  cache.ppv.tmod && cmdline.push(`*setcust XV_tmod=${cache.ppv.tmod}`);
  cache.ppv.xwin && cmdline.push(`*setcust X_win:V=${cache.ppv.xwin}`);

  if (cache.ppv.winpos) {
    const path = `%sgu'ppmlib'\\${RESTORE_SCRIPT_NAME}`;
    const launchOpts = '-nostartmsg -hide -noppb';
    const ppbCmdline = `*script ${path},"${id}","${cache.ppv.winpos}","DEBUG"`;
    cmdline.push(`%Oq *launch ${launchOpts} %0ppbw.exe -c ${ppbCmdline}`);
  }

  return `${closeevent}%(*if("V${id}"=="%n")%:${closeevent}%:${_selectEvent('')}%:${cmdline.join('%:')}%)`;
};

const startPPv = (ppvid: Letters, position: string, search: string, jumpline: string): string => {
  const hasId = !isEmptyStr(ppvid);
  const hasPair = PPx.Pane.Count === 2;
  const postOpts: string[] = ['*topmostwindow %N,1'];

  if (search === '1' && !isEmptyStr(cache.metadata.search)) {
    postOpts.push(`*find "${cache.metadata.search}"`);
  }

  if (jumpline === '1') {
    cache.ppv.lnum = PPx.Extract('%*getcust(XV_lnum)');
    cache.ppv.tmod = PPx.Extract('%*getcust(XV_tmod)');
    PPx.Execute('*setcust XV_lnum=1%:*setcust XV_tmod=1');
  }

  const ppvOpts: string[] = [];
  let cmdGetId: string;

  if (hasId) {
    ppvOpts.push(`-bootid:${ppvid} -r`);
    cmdGetId = `%:V${ppvid}`;
  } else {
    cmdGetId = '%:%*extract(V,"%%n")';
  }

  if (position !== '0' && hasPair) {
    cache.ppv.winpos = PPx.Extract(`%*getcust(_WinPos:V${ppvid})`);

    if (position === '2') {
      cache.ppv.xwin = PPx.Extract('%*getcust(X_win:V)');
      PPx.Execute(`*setcust X_win:V=B1${cache.ppv.xwin.slice(2)}`);
      const id = PPx.Extract(`*launch -nostartmsg -hide -wait:idle %0ppvw.exe ${ppvOpts.join(' ')}${cmdGetId}`);
      capturePPv(id.slice(-1) as Letters, true, false);

      return id;
    } else {
      ppvOpts.push('-popup:%~N');
    }
  }

  return PPx.Extract(`*launch -nostartmsg -wait:idle %0ppvw.exe ${ppvOpts.join(' ')} -k %(${postOpts.join('%:')}%)%%:*focus %n${cmdGetId}`);
};

if (!debug.jestRun()) main();
// export {blankHandle, replaceCmdline};
