/* @file Work with a menu item
 * @arg 0 {string} - "insert"|"replace"|"delete"
 * @arg 1 {string} - Menu ID
 * @arg 2 {number} - Menu number
 * @arg 3 {string} - Menu SubID
 * @arg 4 {string} - Value of SubID
 * @return - Result message
 */

import '@ppmdev/polyfills/objectKeys.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';
import {info, useLanguage} from '@ppmdev/modules/data.ts';
import debug from '@ppmdev/modules/debug.ts';
import {isEmptyObj} from '@ppmdev/modules/guard.ts';
import {writeLines} from '@ppmdev/modules/io.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {properties} from '@ppmdev/parsers/table.ts';

const main = (): string => {
  const [order, menuId, itemNum, subId, itemValue] = safeArgs('insert', '', -1, undefined, '');

  if (subId == null) {
    const {scriptName, parentDir} = pathSelf();
    PPx.Execute(`*script "${parentDir}\\errors.js",args,${scriptName}`);
    PPx.Quit(1);
  }

  const props = properties(menuId);

  if (isEmptyObj(props)) {
    return lang.noProps;
  }

  const hasId = props[subId] != null;

  if (hasId) {
    if (order === 'insert') {
      return lang.hasProp;
    }
  } else if (order !== 'insert') {
    return `${menuId} ${lang.notHasProp}`;
  }

  const items = rebuildMenu(menuId, props);
  const numSpec = Math.max(1, itemNum < 0 ? items.length + itemNum : Math.floor(itemNum));
  const newProp = `${subId}\t= ${itemValue}`;
  const newTbl = adjustTable[order as Order](items, numSpec, newProp);

  debug.log(newTbl.join(info.nlcode));
  const tmpFile = `${PPx.Extract("%'temp'%\\ppm")}\\_menu.cfg`;
  const [error, errorMsg] = writeLines({path: tmpFile, data: newTbl, overwrite: true});

  if (error) {
    return errorMsg;
  }

  PPx.Execute(`*setcust @${tmpFile}`);

  return lang.finish;
};

const lang = {
  en: {
    noProps: 'No property',
    hasProp: 'Property already exists',
    notHasProp: 'is missing',
    finish: 'Menu has been regenerated. Please restart PPx'
  },
  ja: {
    noProps: '項目がありません',
    hasProp: 'すでに項目があります',
    notHasProp: 'はありません',
    finish: 'メニューを再生成しました。PPxを再起動してください'
  }
}[useLanguage()];

type Order = 'insert' | 'replace' | 'delete';

const rebuildMenu = (id: string, props: ReturnType<typeof properties>): typeof items => {
  const items = [`-|${id} =${info.nlcode}${id}\t= {`];

  for (const subid of Object.keys(props)) {
    items.push(`${subid}\t${props[subid].sep} ${props[subid].value.join(info.nlcode)}`);
  }

  items.push('}');

  return items;
};

const adjustTable: {[key in Order]: (items: string[], num: number, prop: string) => string[]} = {
  insert(items: string[], num: number, prop: string) {
    items.splice(num, 0, prop);

    return items;
  },
  replace(items: string[], num: number, prop: string) {
    items.splice(num, 1, prop);

    return items;
  },
  delete(items: string[], num: number, _: string) {
    items.splice(num - 1, 1);

    return items;
  }
};

if (!debug.jestRun()) {
  PPx.result = main();
}
