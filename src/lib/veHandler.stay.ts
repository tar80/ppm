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
import {atLoadEvent, getStaymodeId} from '@ppmdev/modules/staymode.ts';
import {waitMoment} from '@ppmdev/modules/util.ts';

const STAYMODE_ID = getStaymodeId('veHandler') || staymodeID.veHandler;
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

const main = (): void => {
  const [base, dirtype, search, ppm, mapkey, freq] = validArgs();

  if (ppm === 'undefined') {
    return;
  }

  PPx.StayMode = STAYMODE_ID;
  cache.metadata = _convMetadata(base, dirtype, search, ppm, mapkey, freq);
  atLoadEvent.discard({table: 'KC_main', label: EVENT_LABEL, mapkey, cond: 'hold'});
};

const _convMetadata = (base: string, dirtype: string, search: string, ppm: string, mapkey: string, freq: string): Metadata => {
  const conv = (value: string): string => (value !== 'undefined' ? value : '');

  return {base: conv(base), dirtype: conv(dirtype), search: conv(search), ppm, mapkey: conv(mapkey), freq: conv(freq)} as const;
};

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

const ppx_Syncview = (ppvid: string, close: string, position: string, search: string, jumpline: string): void => {
  if (!cache.ppv.id) {
    startPPv(ppvid, position, search, jumpline);
    PPx.Execute(
      _selectevent(
        `*if %*stayinfo(${STAYMODE_ID})&&("%n"=="%%n")&&("%FDV"=="%%FDV")%%:*script ":${STAYMODE_ID},ppx_SelectEvent",${jumpline}`
      )
    );
    PPx.Execute(_activeevent(`*if ("%%N%n"=="")%%:${_selectevent('')}%%:${_activeevent('')}`));
    ppx_SelectEvent(jumpline);
  } else if (!isEmptyStr(PPx.Extract(`%N${cache.ppv.id}`))) {
    PPx.SyncView = 0;
    PPx.Execute(`${_selectevent('')}%:${_activeevent('')}`);
    close === '1' && PPx.Execute(`*closeppx ${cache.ppv.id}`);
    PPx.Execute(`*setcust XV_lnum=${cache.ppv.lnum}%:*setcust XV_tmod=${cache.ppv.tmod}`);

    if (position !== '0') {
      PPx.Execute(`*setcust _WinPos:${cache.ppv.id}=${cache.ppv.winpos}`);
      position === '2' && PPx.Execute(`*setcust X_win:V=${cache.ppv.xwin}`);
    }

    cache.ppv = {};
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

const _selectevent = (cmdline: string): string => `*linecust ${EVENT_LABEL},KC_main:SELECTEVENT,${cmdline}`;
const _activeevent = (cmdline: string): string => `*linecust ${EVENT_LABEL},KC_main:ACTIVEEVENT,${cmdline}`;

const startPPv = (ppvid: string, position: string, search: string, jumpline: string) => {
  const hasPairedWindow = PPx.Pane.Count > 1;
  const hasId = !isEmptyStr(ppvid);

  if (position !== '0' && hasPairedWindow) {
    if (hasId && !isEmptyStr(PPx.Extract(`%NV${ppvid}`))) {
      PPx.Execute(`*closeppx V${ppvid}`);
    }

    cache.ppv.winpos = PPx.Extract(`%*getcust(_WinPos:V${ppvid})`);

    if (position === '2') {
      cache.ppv.xwin = PPx.Extract('%*getcust(X_win:V)');
      PPx.Execute(`*setcust X_win:V=B1${cache.ppv.xwin.slice(2)}`);
    }
  }

  let ppvOptions = '';

  if (hasId) {
    ppvOptions = `-bootid:${ppvid}`;
    ppvOptions = position === '1' ? `${ppvOptions} -popup:%~N` : '';
  }

  let postOptions = '*topmostwindow %N,1';

  if (search === '1' && !isEmptyStr(cache.metadata.search)) {
    postOptions = `${postOptions}%:*find "${cache.metadata.search}"`;
  }

  if (jumpline === '1') {
    cache.ppv.lnum = PPx.Extract('%*getcust(XV_lnum)');
    cache.ppv.tmod = PPx.Extract('%*getcust(XV_tmod)');
    PPx.Execute('*setcust XV_lnum=1%:*setcust XV_tmod=1');
  }

  cache.ppv.id = PPx.Extract(`%Oai *ppv ${ppvOptions} -k %(${postOptions}%)%%:*focus %n%:%*extract(V,"%%n")`);

  if (position === '2' && hasPairedWindow) {
    cache.ppv.winpos = cache.ppv.winpos ?? PPx.Extract(`%*getcust(_WinPos:${cache.ppv.id})`);
    PPx.Execute(`*capturewindow ${cache.ppv.id} -pane:~ -selectnoactive`);
  }
};

if (!debug.jestRun()) main();
// export {blankHandle, replaceCmdline};
