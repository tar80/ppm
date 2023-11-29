/* @file Work with a menu item
 * @arg 0 {string} - "insert"|"replace"|"delete"
 * @arg 1 {string} - Menu ID
 * @arg 2 {number} - Menu number
 * @arg 3 {string} - Menu SubID
 * @arg 4 {string} - Value of SubID
 * @return - Result message
 */

import '@ppmdev/polyfills/objectKeys.ts';
import {properties} from '@ppmdev/parsers/table.ts';
import {isEmptyObj, isEmptyStr} from '@ppmdev/modules/guard.ts';
import {info, useLanguage, tmp} from '@ppmdev/modules/data.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import {writeLines} from '@ppmdev/modules/io.ts';
import debug from '@ppmdev/modules/debug.ts';

const {scriptName, parentDir} = pathSelf();

const main = (): string => {
  const args = adjustArgs();

  if (isEmptyStr(args.subid) || isEmptyStr(args.value)) {
    PPx.Execute(`*script "${parentDir}\\errors.js",args,${scriptName}`);
    PPx.Quit(1);
  }

  const props = properties(args.id);

  if (isEmptyObj(props)) {
    return lang.noProps;
  }

  const hasId = props[args.subid] != null;

  if (hasId) {
    if (args.order === 'insert') {
      return lang.hasProp;
    }
  } else if (args.order !== 'insert') {
    return `${args.id} ${lang.notHasProp}`;
  }

  const items = rebuildMenu(args, props);
  const numSpec = Math.max(1, args.num < 0 ? items.length + args.num : args.num);
  const newProp = `${args.subid}\t= ${args.value}`;
  const newTbl = adjustTable[args.order](items, numSpec, newProp);

  debug.log(newTbl.join(info.nlcode));
  const tmpFile = tmp().file;
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
  jp: {
    noProps: '項目がありません',
    hasProp: 'すでに項目があります',
    notHasProp: 'はありません',
    finish: 'メニューを再生成しました。PPxを再起動してください'
  }
}[useLanguage()];

type Order = 'insert' | 'replace' | 'delete';
type Args = {order: Order; id: string; num: number; subid: string; value: string};

const adjustArgs = (args = PPx.Arguments): Args => {
  const arr: string[] = ['insert', '-1', '', ''];

  for (let i = 0, k = args.length; i < k; i++) {
    arr[i] = args.Item(i);
  }

  return {order: arr[0] as Order, id: arr[1], num: Math.floor(Number(arr[2])), subid: arr[3], value: arr[4]};
};

const rebuildMenu = (args: Args, props: properties): typeof items => {
  const items = [`-|${args.id} =${info.nlcode}${args.id}\t= {`];

  for (const subid of Object.keys(props)) {
    items.push(`${subid}\t${props[subid].sep} ${props[subid].value.join(info.nlcode)}`);
  }

  items.push('}');

  return items;
};

const adjustTable: {[key in Order]: Function} = {
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
