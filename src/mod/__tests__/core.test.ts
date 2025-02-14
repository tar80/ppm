import PPx from '@ppmdev/modules/ppx.ts';
global.PPx = Object.create(PPx);
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import {colors} from '@ppmdev/modules/ansi.ts';
import {uniqName} from '@ppmdev/modules/data.ts';
import type {Source} from '@ppmdev/modules/source.ts';
import type {AnsiColors} from '@ppmdev/modules/types.ts';
import {installer, pluginInstall, pluginRegister, pluginUpdate} from '../core.ts';

const tempDir = `${os.tmpdir()}\\ppmdevtest`;

const ppxe = PPx.Execute;
jest.mock('@ppmdev/modules/io');

describe('extractGitDir()', function () {
  it('install with scoop', () => {
    const gitInstallDir = process.env.git_install_root;
    expect(installer.extractGitDir()).toBe(gitInstallDir);
  });
});

describe('globalPath()', function () {
  beforeEach(() => {
    PPx.Execute = jest.fn();
  });
  afterAll(() => {
    PPx.Execute = ppxe;
  });
  const cacheDir = PPx.Extract('%0').slice(3).replace(/\\/g, '@');
  it('set globalPaths', () => {
    installer.globalPath.set('home', 'ppm');
    expect(PPx.Execute).toHaveBeenCalledWith('*string u,ppm=ppm');
    expect(PPx.Execute).toHaveBeenCalledWith('*string u,ppmhome=home');
    expect(PPx.Execute).toHaveBeenCalledWith("*string u,ppmarch=%%su'ppmhome'\\arch");
    expect(PPx.Execute).toHaveBeenCalledWith("*string u,ppmrepo=%%su'ppmhome'\\repo");
    expect(PPx.Execute).toHaveBeenCalledWith(`*string u,ppmcache=%%su'ppmhome'\\cache\\${cacheDir}`);
    expect(PPx.Execute).toHaveBeenCalledWith("*string u,ppmlib=%%su'ppm'\\dist\\lib");
    // });
    expect(PPx.Execute).toHaveBeenCalledTimes(6);
  });
  it('unset globalPaths', () => {
    installer.globalPath.unset();
    expect(PPx.Execute).toHaveBeenCalledWith('*deletecust _User:ppm');
    expect(PPx.Execute).toHaveBeenCalledWith('*deletecust _User:ppmhome');
    expect(PPx.Execute).toHaveBeenCalledWith('*deletecust _User:ppmarch');
    expect(PPx.Execute).toHaveBeenCalledWith('*deletecust _User:ppmrepo');
    expect(PPx.Execute).toHaveBeenCalledWith('*deletecust _User:ppmcache');
    expect(PPx.Execute).toHaveBeenCalledWith('*deletecust _User:ppmlib');
    // });
    expect(PPx.Execute).toHaveBeenCalledTimes(6);
  });
});

describe('homespec()', function () {
  it('home is not set yet', () => {
    let ppmdir = process.env.home;
    ppmdir = ppmdir ? `${ppmdir}\\.ppm` : `${process.env.APPDATA}\\ppx-plugin-manager`;

    expect(installer.homeSpec('')).toBe(ppmdir);
  });
  it('home is "c:\\bin\\ppx"', () => {
    expect(installer.homeSpec('c:\\bin\\ppm')).toBe('c:\\bin\\ppm');
  });
});

describe('createLog()', function () {
  const o = (fg: AnsiColors, bg?: AnsiColors) => `\\x1b[${bg ? `${colors.bg[bg]};` : ''}${colors.fg[fg]}m`;
  const c = '\\x1b[49;39m';

  it('message under the heading "load"', () => {
    const header = 'load';
    expect(pluginInstall.decorateLog('test', header, 'message')).toBe(
      `${o('black', 'green')} ${header.toUpperCase()} ${c} test\\n ${o('yellow')}Dependencies => message${c}`
    );
  });
  it('message under the heading "install"', () => {
    const state = 'install';
    expect(pluginInstall.decorateLog('test', state)).toBe(`${o('black', 'cyan')} ${state.toUpperCase()} ${c} test`);
  });
  it('message under the heading "error"', () => {
    const state = 'error';
    expect(pluginInstall.decorateLog('test', state, 'message')).toBe(
      `${o('black', 'red')} ${state.toUpperCase()} ${c} ${o('white')}test${c}`
    );
  });
});

describe('gitSwitch()', function () {
  const testSource: Source = {name: 'test', version: '0.1', location: 'remote', path: tempDir};
  beforeAll(() => {
    !fs.existsSync(tempDir) && fs.mkdirSync(tempDir);
    execSync(`git -C ${tempDir} init`);
    execSync(`git -C ${tempDir} commit --allow-empty -m"test"`);
    execSync(`git -C ${tempDir} branch test`);
  });
  afterAll(() => {
    fs.rmSync(tempDir, {recursive: true, force: true});
  });

  it('switched to branch test', () => {
    testSource.branch = 'test';
    expect(pluginInstall.gitSwitch(testSource)).toEqual("Switched to branch 'test'");
  });
  it('switched to detached head', () => {
    testSource.branch = '--detach head';
    pluginInstall.gitSwitch(testSource);
    expect(execSync(`git -C ${tempDir} rev-parse --abbrev-ref @`).toString()).toBe('HEAD\n');
  });
});

describe('getManageFiles()', function () {
  it('return _initial.cfg', () => {
    expect(pluginRegister.getManageFiles('')).toEqual([`\\backup\\${uniqName.initialCfg}`]);
  });
});

describe('updateLists()', function () {
  it('disable ppx-plugin-manager', () => {
    const name = 'ppx-plugin-manager';
    const ppm = {name, enable: false};
    expect(pluginRegister.updateLists([ppm] as Source[])).toEqual([false, `[{"name":"${name}","enable":false}]`]);
  });
  it('enable ppm-switchmenu', () => {
    const name = 'ppm-switchmenu';
    const sw = {name, enable: false};
    expect(pluginRegister.updateLists([sw] as Source[])).toEqual([true, `[{"name":"${name}","enable":false}]`]);
  });
});

describe.skip('checkUpdate()', function () {
  // const tempDir = `${os.tmpdir()}\\ppmdevtest`;
  const path = `${tempDir}\\ppm`;
  beforeAll(() => {
    !fs.existsSync(tempDir) && fs.mkdirSync(tempDir);
    !fs.existsSync(path) && execSync(`git clone --depth=1 --recurse-submodules --shallow-submodules https://github.com/tar80/ppm ${path}`);
  });
  afterAll(() => {
    fs.rmSync(tempDir, {recursive: true, force: true});
  });

  it('pass non-existent directory', () => {
    const path = 'not\\exist';
    expect(pluginUpdate.checkUpdate(path)).toEqual([true, 'failedToGet']);
  });
  it('pass the pass of ppm', () => {
    expect(pluginUpdate.checkUpdate(path)).toEqual([true, 'noUpdates']);
  });
});
