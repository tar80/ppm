/* @file Select on next PPx
 * @arg 0 {number} - If non-zero, reverse order
 * @arg 1 {number} - If non-zero, activate the opposite window when a single pane
 * @arg 2 {number} - If non-zero, toggle focus between PPc and synced PPv
 * @arg 3 {number} - If non-zero, ignore tabs. valid only if each pane is an independent tab
 * @arg 4 {number} - If non-zero, ignore PPc
 * @arg 5 {number} - If non-zero, ignore PPv
 * @arg 6 {number} - If non-zero, ignore PPb
 */

import '@ppmdev/polyfills/arrayIndexOf.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';
import {isZero} from '@ppmdev/modules/guard.ts';
import {windowID} from '@ppmdev/modules/util.ts';

const main = (): void => {
  const [reverce, opwin, syncview, ignoretab, ignoreppc, ignoreppv, ignoreppb] = safeArgs(false, false, false, false, false, false, false);
  const win = getIDs();

  //syncview
  if (syncview && !ignoreppv) {
    const isSync = PPx.Extract(`%*extract(C,"%%*js(""PPx.result=PPx.SyncView;"")")`);

    if (!isZero(isSync)) {
      PPx.Execute(`*selectppx ${win.pairid}`);

      return;
    }
  }

  const idlist = getList(reverce, ignoreppc, ignoreppv, ignoreppb);
  let nextID = idlist[idlist.indexOf(win.id) + 1] || idlist[0];

  //opposite window
  if (PPx.Pane.Count === 1 && !ignoreppc && opwin && win.id === nextID) {
    PPx.Execute('%K"@TAB"');

    return;
  }

  //tabs
  if (!ignoreppc && ignoretab) {
    const hasSeparate = PPx.Extract('%*getcust(X_combos)').slice(18, 19);

    if (hasSeparate === '1') {
      nextID = tabID(idlist, win.id, nextID);
    }
  }

  PPx.Execute(`*selectppx ${nextID}`);
};

type ArgsKeys = 'order' | 'opwin' | 'syncview' | 'ignoretab' | 'ignoreppc' | 'ignoreppv' | 'ignoreppb';
type Args = {[key in ArgsKeys]: string};

const getIDs = () => {
  PPx.WindowIDName = '1';
  const {id, uid} = windowID();
  const xid = uid.split('_');
  const pairid = xid[0].indexOf('C') === 0 ? 'V' : 'C';

  return {id, pairid, subid: xid[1]};
};

const getList = (reverce: boolean, ignoreppc: boolean, ignoreppv: boolean, ignoreppb: boolean): string[] => {
  const c = !ignoreppc ? PPx.Extract('%*ppxlist(-C)') : '';
  const v = !ignoreppv ? PPx.Extract('%*ppxlist(-V)') : '';
  const b = !ignoreppb ? PPx.Extract('%*ppxlist(-B)') : '';
  const list = `${c}${v}${b}`.slice(0, -1).replace(/_/g, '').split(',');
  const sorter = !reverce ? [-1, 1] : [1, -1];
  list.sort((a, b) => (a < b ? sorter[0] : sorter[1]));

  return list;
};

const tabExtract = (target: number): string[] => {
  const skipTabs: string[] = [];
  const pane = (num: number) => PPx.Pane.Item(num).Tab;
  const currentIdname = pane(-1).IDName;
  let idname: string;

  for (let i = 0, k = pane(target).length; i < k; i++) {
    idname = pane(i).IDName;
    idname !== currentIdname && skipTabs.push(idname);
  }

  return skipTabs;
};

const tabID = (list: string[], currentid: string, nextid: string): string => {
  let skipID = tabExtract(-2);

  if (PPx.Pane.Count > 0 && ~skipID.indexOf(nextid)) {
    return PPx.Extract('%~n');
  }

  skipID = tabExtract(-3);

  let id: string;

  for (let i = list.indexOf(currentid) + 1, k = list.length; i < k; i++) {
    id = list[i];

    for (let i = 0, k = skipID.length; i < k; i++) {
      if (skipID[i] !== id) {
        return id;
      }
    }
  }

  return nextid;
};

main();
