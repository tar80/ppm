import PPx from '@ppmdev/modules/ppx';
global.PPx = Object.create(PPx)
import {getExists} from '../exeExists'

describe('getExists()', function () {
  it('not exist executable', () => {
    expect(getExists([])).toBe("{}")
  });
  it('pattern with noextension', () => {
    expect(getExists(['git'])).toBe('{"git.exe": true}')
    expect(getExists(['git', 'notexist'])).toBe('{"git.exe": true,"notexist.exe": false}')
  });
  it('pattern with extension', () => {
    expect(getExists(['git.exe', 'notexist.exe'])).toBe('{"git.exe": true,"notexist.exe": false}')
  });
});
