import PPx from '@ppmdev/modules/ppx';
global.PPx = Object.create(PPx);
import {selectSingle, selectMulti} from '../setsel';

describe('selectSingle()', function () {
  it('pass an empty string. the return value must be {w:0, l:0}', () => {
    const text = '';
    const rgx = '()()';
    expect(selectSingle(text, rgx)).toEqual({l: 0, w: 0});
  });
  it('select a range of word', () => {
    const text = '123ABCD890';
    const rgx = '(\\d+)(\\D+)\\d+';
    expect(selectSingle(text, rgx)).toEqual({w: 3, l: 7});
  });
});

describe('selectMulti()', function () {
  afterAll(() => PPx.Extract = ppxt)
  const ppxt = PPx.Extract;

  const rgxstr = '([\\s\\S]*")([^"]*)[\\s\\S]*';
  const text = `0"23"56789
123"56"89
12345"78"0`;

  it('cursor position 0', () => {
    jest.spyOn(PPx, 'Extract').mockImplementation((_) => '0');
    expect(selectMulti(text, rgxstr)).toEqual({w: 0, l: 1});
  });
  it('cursor position 3', () => {
    jest.spyOn(PPx, 'Extract').mockImplementation((_) => '3');
    expect(selectMulti(text, rgxstr)).toEqual({w: 2, l: 4});
  });
  it('cursor position 11', () => {
    jest.spyOn(PPx, 'Extract').mockImplementation((_) => '11');
    expect(selectMulti(text, rgxstr)).toEqual({w: 5, l: 14});
  });
  it('cursor position 30', () => {
    jest.spyOn(PPx, 'Extract').mockImplementation((_) => '30');
    expect(selectMulti(text, rgxstr)).toEqual({w: 30, l: 31});
  });
});
