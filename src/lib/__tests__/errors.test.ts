import PPx from '@ppmdev/modules/ppx.ts';
global.PPx = Object.create(PPx);
import {lang, errorMethod} from '../errors.ts';

jest.mock('@ppmdev/modules/io');

const name = '_args.js';
const path = `src/lib/__tests__/${name}`;

describe('exportMethod()', function () {
  it('pass wrong path', () => {
    const path = 'not/exits/path';
    expect(() => errorMethod['arg'](path, name, '')).toThrow();
  });
  it('method "arg"', () => {
    const resp = `${name}: ${lang.notEnough}\n\n@arg 0 {string} - abc\n@arg 1 {number} - 123`;
    expect(errorMethod['arg'](path, name, '')).toBe(resp);
  });
  it('method "msg"', () => {
    const message = 'test "test"\ntest';
    const resp = `${name}: ${message}`;
    expect(errorMethod['msg'](path, name, message)).toBe(resp);
  });
});
