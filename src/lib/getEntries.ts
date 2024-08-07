/* Get the entries in the specified directory
 * @arg 0 {string} - Specify the target directory path. default is %FD
 * @arg 1 {string} - Specify the target file attributes. both(default) | dir | file
 * @arg 2 {string} - Specify the entry name to extract
 * @arg 3 {number} - If non-zero, search for files recursively up to the specified number of files
 * @return - Comma sepalated entries list
 */

import fso from '@ppmdev/modules/filesystem.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import debug from '@ppmdev/modules/debug.ts';

const main = (): string => {
  const [parent, att, pattern, limit] = safeArgs(PPx.Extract('%FD'), 'both', '', 0);
  const searchSpec = att.toLowerCase();

  if (!isSearchSpec(searchSpec)) {
    const {scriptName, parentDir} = pathSelf();
    PPx.Execute(`*script "${parentDir}\\errors.js",arg,${scriptName}`);
    PPx.Quit(-1);
  }

  const entries = getEntries(parent, searchSpec, pattern.toLowerCase(), limit);

  return entries.join(',');
};

type SearchSpec = 'both' | 'dir' | 'file';
const isSearchSpec = (v: string): v is SearchSpec => v === 'both' || v === 'file' || v === 'dir';

const getEntries = (parent: string, att: SearchSpec, pattern: string, limit: number): string[] => {
  const extractEntries = (collection: any, path: string): void => {
    for (var v = PPx.Enumerator(collection); !v.atEnd(); v.moveNext()) {
      //for (const item of collection) {
      if (limit > 0 && entries.length >= limit) {
        return;
      }

      if (~v.Item().Name.toLowerCase().indexOf(pattern)) {
        entries.push(fso.BuildPath(path, v.Item().Name));
      }
    }

    return;
  };

  const detectItem = (path = ''): void => {
    const direnv: any = fso.GetFolder(fso.BuildPath(parent, path));
    const subDirenv = direnv.SubFolders;

    if (att !== 'file') {
      extractEntries(subDirenv, path);
    }

    if (att !== 'dir') {
      extractEntries(direnv.Files, path);
    }

    if (limit > 0) {
      if (entries.length >= limit) {
        return;
      }

      for (const subDir of subDirenv) {
        detectItem(fso.BuildPath(path, subDir.Name));
      }
    }

    return;
  };

  const entries: string[] = [];
  detectItem();

  return entries;
};

PPx.result = main();
