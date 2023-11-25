import PPx from '@ppmdev/modules/ppx';
global.PPx = Object.create(PPx);
import {lang, errorMethod} from '../errors';

jest.mock('@ppmdev/modules/io');

const name = '_args.js';
const path = `src/lib/__tests__/${name}`;

describe('exportMethod()', function () {
  it('pass wrong path', () => {
    const args = {method: 'arg', message: '', name, path: 'not/exist/path'};
    expect(() => errorMethod['arg'](args)).toThrow();
  });
  it('method "arg"', () => {
    const args = {method: 'arg', message: '', name, path};
    const resp = `${name}: ${lang.notEnough}\n\n@arg 0 {string} - abc\n@arg 1 {number} - 123`;
    expect(errorMethod['arg'](args)).toBe(resp);
  });
  it('method "msg"', () => {
    const message = 'test "test"\ntest';
    const args = {method: 'msg', message, name, path};
    const resp = `${name}: ${message}`;
    expect(errorMethod['msg'](args)).toBe(resp);
  });
});
