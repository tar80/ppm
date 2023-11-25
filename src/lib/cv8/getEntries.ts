/* Get the entries in the specified directory
 * @arg 0 {string} - Specify the target directory path
 * @arg 1 {string} - Specify the target file attributes. both(default) | dir | file
 * @arg 2 {string} - Specify the entry name to extract
 * @arg 3 {number} - If non-zero, search for files recursively up to the specified number of files
 * @return - Comma sepalated entries list
 */

import fso from '@ppmdev/modules/filesystem.ts';

const adjustArg = (args = PPx.Arguments) => {
  const arr = ['', 'both', '', '0'];

  for (let i = 0, l = args.length; i < l; i++) {
    arr[i] = args.Item(i);
  }

  return {path: arr[0], attribute: arr[1], pattern: arr[2], recursive: Number(arr[3])} as const;
};

const extractEntries = (path: string, collection: any): void => {
  for (const item of collection) {
    if (args.recursive > 0 && entries.length >= args.recursive) {
      return;
    }

    if (~item.Name.indexOf(args.pattern)) {
      entries.push(fso.BuildPath(path, item.Name));
    }
  }

  return;
};

const getEntries = (path: string = ''): void => {
  const direnv: any = fso.GetFolder(fso.BuildPath(args.path, path));
  const subDirenv = direnv.SubFolders;

  if (args.attribute !== 'file') {
    extractEntries(path, subDirenv);
  }

  if (args.attribute !== 'dir') {
    extractEntries(path, direnv.Files);
  }

  if (args.recursive > 0) {
    if (entries.length >= args.recursive) {
      return;
    }

    for (const subDir of subDirenv) {
      getEntries(fso.BuildPath(path, subDir.Name));
    }
  }

  return;
};

/* main */
const entries: string[] = [];
const args = adjustArg();
getEntries();
PPx.result = entries.join(',');

// const getEntriesNet = ({path, att, pattern}: typeof target): string[] => {
//   // @ts-ignore
//   const si = NETAPI.System.IO;
//   const di = si.Directory;

//   if (!di.Exists(path)) {
//     PPx.result = '';
//     PPx.Quit(1);
//   }

//   const method = {both: 'EnumerateFiles', dir: 'GetDirectories', file: 'GetFiles'}[att];
//   const entries = di[method](path, pattern);
//   const result = [];

//   for (const entry of entries) {
//     result.push(entry);
//   }

//   return result;
// };
