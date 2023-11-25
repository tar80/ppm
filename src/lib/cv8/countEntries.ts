/* Get the number of entries in the specified directory
 * @arg 0 {string} - Specify the target directory path
 * @arg 1 {string} - Specify the target file attributes. both(default) | dir | file
 * @arg 2 {number} - Specify the limit of count
 * @return - Number of entries
 */

import fso from '@ppmdev/modules/filesystem.ts';

const adjustArg = (args = PPx.Arguments) => {
  const arr = ['', 'both', '0'];

  for (let i = 0, l = args.length; i < l; i++) {
    arr[i] = args.Item(i);
  }

  return {path: arr[0], attribute: arr[1], limit: Number(arr[2])};
};

const counter = (() => {
  let entryCount = 0;

  return ({path, attribute, limit}: typeof target): number => {
    if (limit <= entryCount) {
      return entryCount;
    }

    const direnv: any = fso.GetFolder(path);
    const subDir = direnv.SubFolders;

    if (attribute !== 'file') {
      entryCount = entryCount + subDir.Count;
    }

    if (attribute !== 'dir') {
      entryCount = entryCount + direnv.Files.Count;
    }

    for (const dir of subDir) {
      counter({path: dir, attribute: attribute, limit});
    }

    return entryCount;
  };
})();

/* main */
const target = adjustArg();
PPx.result = counter(target);
