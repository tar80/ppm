import PPx from '@ppmdev/modules/ppx';
global.PPx = Object.create(PPx);
import {getLibs} from '../libExists';

describe('getLibs()', function () {
  const libs =
    '7-zip64.dll 7z.dll 7zca64.dll bregonig.dll migemo.dll PPLIB64W.DLL PPXETP64.DLL PPXKEY64.DLL PPXMES64.DLL PPXPOS64.DLL PPXSCR64.DLL PPXTEXT64.DLL PPXWIN64.DLL UNBYPASS.DLL';
  it('found 7zip modules', () => {
    expect(getLibs(libs, ['7z.dll', '7-zip64.dll'])).toBe('{"7z.dll": true,"7-zip64.dll": true}');
  });
  it('pattern of name without the suffix ".dll"', () => {});
    expect(getLibs(libs, ['7z', '7-zip64'])).toBe('{"7z": true,"7-zip64": true}');
  it('pattern of name without the suffix ".dll"', () => {});
    expect(getLibs(libs, ['7-zip'])).toBe('{"7-zip": true}');
});
