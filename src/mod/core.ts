import '@ppmdev/polyfills/objectKeys.ts';
import {colorlize} from '@ppmdev/modules/ansi.ts';
import {info, uniqName} from '@ppmdev/modules/data.ts';
import debug from '@ppmdev/modules/debug.ts';
import fso from '@ppmdev/modules/filesystem.ts';
import {gitCmd} from '@ppmdev/modules/git.ts';
import {branchHead, branchName} from '@ppmdev/modules/git.ts';
import {isEmptyStr, isString, isZero} from '@ppmdev/modules/guard.ts';
import {readLines, writeLines} from '@ppmdev/modules/io.ts';
import {pathJoin} from '@ppmdev/modules/path.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {runStdout} from '@ppmdev/modules/run.ts';
import {type Source, sourceComp} from '@ppmdev/modules/source.ts';
import type {AnsiColors, Error_String, Level_String} from '@ppmdev/modules/types.ts';

/**
 * Extract the path of the directory where git is installed.
 * @return A path or an empty-string
 */
const extractGitDir = (): string => {
  const programfiles = 'C:/Program Files/git';

  if (fso.FolderExists(programfiles)) {
    return programfiles;
  }

  const programfiles86 = 'C:/Program Files (x86)/git';

  if (fso.FolderExists(programfiles86)) {
    return programfiles86;
  }

  const scoop = PPx.Extract("%'git_install_root'");

  if (scoop !== '') {
    return scoop;
  }

  let path = PPx.Extract("%'path'");

  if (/[\/\\]git[\/\\]cmd[\/\\]?[;$]/.test(path)) {
    path = path.replace(/(.+[\/\\]git)[\/\\]cmd[\/\\]?[;$]/, '$1');
    path = path.replace(/^(.+;)?/, '');

    return path.replace(/\//g, '\\');
  }

  return '';
};

type Keys = 'ppm' | 'ppmhome' | 'ppmarch' | 'ppmrepo' | 'ppmcache' | 'ppmlib';
const globalPath = {
  keys: {
    ppm: '',
    ppmhome: '',
    ppmarch: "%%su'ppmhome'\\arch",
    ppmrepo: "%%su'ppmhome'\\repo",
    ppmcache: `%%su'ppmhome'\\${uniqName.cacheDir()}`,
    ppmlib: "%%su'ppm'\\dist\\lib"
  },

  /** Set ppm global path in table for _User */
  set(home: string, root: string): void {
    this.keys['ppmhome'] = home;
    this.keys['ppm'] = root;

    for (const key of Object.keys(this.keys)) {
      PPx.Execute(`*string u,${key}=${this.keys[key as Keys]}`);
    }
  },

  /** Unset ppm global path from table for _User */
  unset(): void {
    for (const key of Object.keys(this.keys)) {
      PPx.Execute(`*deletecust _User:${key}`);
    }
  }
};

/**
 * Specify the base ppm installation path.
 * @param oldhome - Current `S\_ppm#global:home`
 * @return New `S\_ppm#global:home`
 */
const homeSpec = (oldhome: string): string => {
  let newhome = oldhome;

  if (isEmptyStr(newhome)) {
    newhome = PPx.Extract("%'home'");
    newhome = isEmptyStr(newhome) ? pathJoin(PPx.Extract("%'appdata'"), info.ppmName) : pathJoin(newhome, '.ppm');
  }

  return newhome;
};

export const installer = {extractGitDir, globalPath, homeSpec};

export type LogLevel = 'load' | 'install' | 'error' | 'warn';
type Log = {[key in LogLevel]: AnsiColors};
/** Decorate the installation result log. */
const decorateLog = (name: string, state: LogLevel, message?: string): string => {
  const logLevel: Log = {load: 'green', install: 'cyan', error: 'red', warn: 'yellow'} as const;
  const fg = 'black';
  const bg = logLevel[state];
  const title = ` ${state.toUpperCase()} `;
  const header = colorlize({esc: true, message: title, fg, bg});

  if (isString(message)) {
    message = message.replace(/\\/g, '\\\\');
  }

  switch (state) {
    case 'error':
    case 'warn':
      message = colorlize({esc: true, message: name, fg: 'white'});
      break;
    default: {
      const dep = colorlize({esc: true, message: `Dependencies => ${message}`, fg: 'yellow'});
      message = isString(message) ? `${name}\\n ${dep}` : name;
      break;
    }
  }

  return `${header} ${message}`;
};

/**
 * Switch the current branch of the ppm plugin.
 * NOTE: Not sure why, "git switch" always outputs standard errors,
 * so the error level cannot be determined from the standard output.
 *
 * @return git switch stdout
 */
const gitSwitch = function (item: Source): string {
  let resp: Level_String = [0, ''];
  const cmdline: gitCmd = {wd: item.path, subcmd: 'switch'};

  if (item.commit) {
    cmdline['opts'] = `--detach ${item.commit}`;
    resp = runStdout({cmdline: gitCmd(cmdline), hide: true});
    // resp = stdout({cmd: gitCmd(cmdline)});
  } else if (item.branch) {
    cmdline['opts'] = item.branch;
    resp = runStdout({cmdline: gitCmd(cmdline), hide: true});
    // resp = stdout({cmd: gitCmd(cmdline)});
  }

  return resp[1];
};

const sourceDetails = function (item: Source) {
  return {
    name: item.name,
    enable: true,
    setup: false,
    version: item.version,
    location: item.location,
    path: item.path,
    branch: item.branch,
    commit: item.commit
  } as const;
};

const completeItems: string[] = [];
const setCompItem = (name: string): void => {
  const item = sourceComp.getName(name);
  item && completeItems.push(item);
};

const writeComplist = (): void => {
  completeItems.length > 0 && sourceComp.write(completeItems);
};

export const pluginInstall = {decorateLog, gitSwitch, sourceDetails, setCompItem, writeComplist};

/** Configuration file paths other than plugins. */
const getManageFiles = (ppmcache: string): string[] => {
  let path = `${ppmcache}\\list\\${uniqName.manageFiles}`;

  if (fso.FileExists(path)) {
    const [error, files] = readLines({path: path});

    if (!error) {
      return files.lines;
    }
  }

  path = `${ppmcache}\\ppm\\${uniqName.nopluginCfg}`;

  return fso.FileExists(path) ? [path] : [`${ppmcache}\\backup\\${uniqName.initialCfg}`];
};

const updateLists = (sources: Source[]): Error_String => {
  const pluginlistPath = `${ppm.global('ppmcache')}\\list\\${uniqName.pluginList}`;
  const [error, data] = readLines({path: pluginlistPath});

  if (error) {
    return [true, data];
  }

  const items: Record<string, number> = {};
  const compItems: Source[] = [];
  const failed: string[] = [];

  const rgx = /^(;\s*)?(remote|local)\s+['"].+[/\\](.+)['"]/;
  let skip = true;

  for (let i = 0, k = data.lines.length; i < k; i++) {
    if (skip) {
      if (data.lines[i].indexOf(';----') === 0) {
        skip = false;
      }
      continue;
    }

    items[data.lines[i].replace(rgx, '$3')] = i;
  }

  let writeFlag = false;

  for (const source of sources) {
    if (!source) {
      continue;
    }

    const num = items[source.name];

    if (typeof num === 'number') {
      if (!source.enable) {
        if (data.lines[num].indexOf(';') !== 0) {
          data.lines[num] = `;${data.lines[num]}`;
          writeFlag = true;
        }
      } else if (data.lines[num].indexOf(';') === 0) {
        data.lines[num] = data.lines[num].replace(/^;\s*/, '');
        writeFlag = true;
      }
    }

    compItems.push(source);
  }

  if (debug.jestRun()) {
    return [writeFlag, JSON.stringify(compItems)];
  }

  if (writeFlag) {
    const [error2, data2] = writeLines({path: pluginlistPath, data: data.lines, overwrite: true, linefeed: data.nl});
    error2 && failed.push(data2);
  }

  const [error3, data3] = sourceComp.fix(compItems);
  error3 && failed.push(data3);

  return [error3, failed.join('\\n')];
};

export const pluginRegister = {getManageFiles, updateLists};

/** Check for ppm plugin updates. */
const checkUpdate = (path: string): Error_String => {
  const [error, localHead] = branchHead(path);

  if (error) {
    return [true, 'failedToGet'];
  }

  let [branch, state] = branchName(path);

  if (!isEmptyStr(state)) {
    return [true, 'detached'];
  }

  const [exitcode, remote] = runStdout({cmdline: `git ls-remote origin ${branch}`, wd: path, hide: true});

  if (!isZero(exitcode)) {
    return [true, remote];
  }

  const remoteHead = remote.split('\t')[0];

  return localHead === remoteHead ? [true, 'noUpdates'] : [false, localHead];
};

export const pluginUpdate = {checkUpdate};
