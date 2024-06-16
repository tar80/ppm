/* Get the number of entries in the specified directory
 * @arg 0 {string} - Specify the target directory path. default is %FD
 * @arg 1 {string} - Specify the target file attributes. both(default) | dir | file
 * @arg 2 {number} - Specify the limit of count
 * @return - Number of entries
 */

import fso from '@ppmdev/modules/filesystem.ts';
import {safeArgs} from '@ppmdev/modules/argument.ts';
import {pathSelf} from '@ppmdev/modules/path.ts';
import debug from '@ppmdev/modules/debug.ts';

const main = (): number => {
  const [path, att, limit] = safeArgs(PPx.Extract('%FD'), 'both', 0);
  const searchSpec = att.toLowerCase();

  if (!isSearchSpec(searchSpec)) {
    const {scriptName, parentDir} = pathSelf();
    PPx.Execute(`*script "${parentDir}\\errors.js",arg,${scriptName}`);
    PPx.Quit(-1);
  }

  return counter(path, att as SearchSpec, limit);
};

type SearchSpec = 'both' | 'dir' | 'file';
const isSearchSpec = (v: string): v is SearchSpec => v === 'both' || v === 'file' || v === 'dir';

const counter = (() => {
  let entryCount = 0;

  return (path: string, attribute: SearchSpec, limit: number): number => {
    if (limit <= entryCount) {
      return entryCount;
    }

    const direnv = fso.GetFolder(path);
    const subDirenv = direnv.SubFolders;

    if (attribute !== 'file') {
      entryCount = entryCount + subDirenv.Count;
    }

    if (attribute !== 'dir') {
      entryCount = entryCount + direnv.Files.Count;
    }

    for (var dir = PPx.Enumerator(subDirenv); !dir.atEnd(); dir.moveNext()) {
      counter(dir.Item(), attribute, limit);
    }

    return entryCount;
  };
})();

PPx.result = main();
