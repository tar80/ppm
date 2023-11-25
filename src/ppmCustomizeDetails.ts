/* @file Display details of the parameters set by ppm */

import '@ppmdev/polyfills/arrayIsArray.ts';
import {sourceNames, expandSource} from '@ppmdev/modules/source.ts';
import {info, tmp} from '@ppmdev/modules/data.ts';
import {isEmptyStr, isError} from '@ppmdev/modules/guard.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {readLines, writeLines} from '@ppmdev/modules/io.ts';
import {colorlize} from '@ppmdev/modules/ansi.ts';
import {getProp} from './mod/parser.ts';

let tabWidth = 0;

const main = () => {
  const pluginNames = sourceNames();
  const path = `${tmp().file}`;
  const data = getUseIds(pluginNames);
  const [error, errorMsg] = writeLines({path, data, overwrite: true});

  error
    ? ppm.linemessage('.', errorMsg, true)
    : PPx.Execute(`*script %sgu'ppm'\\dist\\ppmLogViewer.js,customize,${tabWidth}`);
};

const getData = (name: string, lines: string[]): typeof result => {
  const result: string[] = [`${colorlize({message: ` ${name} `, fg: 'black', bg: 'green'})}`];
  let tab = 4;

  for (const line of lines) {
    const {key, sep, value} = getProp(line);

    if (value === '{') {
      result.push(`${colorlize({message: `[${key}]`, fg: 'cyan'})}`);
    } else if (key === '}' || isEmptyStr(key)) {
      result.push('');
    } else if (key.indexOf('\t') === 0) {
      result.push(line);
    } else if (value) {
      result.push(`${key}\t${sep} ${value}`);
      tab = Math.max(tab, key.length);
    }
  }

  if (!isEmptyStr(result[result.length - 1])) {
    result.push('');
  }

  tab = Math.min(32, (Math.floor(tab / 4) + 1) * 4);
  tabWidth = Math.max(tabWidth, tab);

  return result;
};

const getUseIds = (names: string[]): typeof lines => {
  const setupDir = `${ppm.global('ppmcache')}\\ppm\\setup`;
  const readError = colorlize({message: ' Read error ', fg: 'red', bg: 'black'});
  const lines: string[] = [];

  for (const name of names) {
    const p = expandSource(name);

    if ((!p || !p.setup) && name !== info.ppmName) {
      continue;
    }

    const [error, resp] = readLines({path: `${setupDir}\\${name}.cfg`});

    if (isError(error, resp)) {
      lines.push(`${readError} ${name}`);
      continue;
    }

    lines.push(...getData(name, resp.lines));
  }

  return lines;
};

main();
