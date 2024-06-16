import PPx from '@ppmdev/modules/ppx.ts';
global.PPx = Object.create(PPx);
import {parseArgs, inputOptions, postOptions} from '../input.ts';

describe('parseArgs()', function () {
  it('pass unicode strings', () => {
    const title = 'テスト';
    const args = `{"title":"${title}"}`;
    expect(parseArgs(args)).toEqual({title});
  });
  it('pass a path with backslash', () => {
    const text = 'c:\\a\\b\\c.txt';
    const args = `{"text": "${text}"}`;
    expect(parseArgs(args)).toEqual({text});
  });
  it('pass a string containing quotes', () => {
    const input = `test "test" 'test'`;
    const resp = `test "test" 'test'`;
    const args = `{"text": "${input}"}`;
    expect(parseArgs(args)).toEqual({text: resp});
  });
});

describe('inputOptions()', function () {
  it('default options', () => {
    expect(inputOptions({})).toBe('-title:"ppm/input.js" -mode:e -select:a');
  });
  it('all options', () => {
    const opts = {
      text: 'abc',
      title: 'テスト',
      mode: 'e',
      select: 'l',
      forpath: true,
      fordigit: true,
      leavecancel: true,
      multi: true
    };
    expect(inputOptions(opts)).toBe(
      '-text:"abc" -title:"テスト" -mode:e -select:l -forpath -fordigit -leavecancel -multi'
    );
  });
});

describe('postOptions()', function () {
  it('default options', () => {
    expect(postOptions({})).toBe('-k *completelist -list:off -module:off');
  });
  it('all options', () => {
    const opts = {list: 'on', module: 'on', match: '3', detail: 'entry env', file: 'c:\\a\\b\\c'};
    expect(postOptions(opts)).toBe(
      '-k *completelist -list:on -module:on -match:3 -detail:"entry env" -file:"c:\\a\\b\\c"'
    );
  });
});
