import PPx from '@ppmdev/modules/ppx';
global.PPx = Object.create(PPx);
import {blankHandleSpec, replaceCmdline} from '../lfActions';

describe('blankHandleSpec()', function () {
  const path = 'test test test';

  it('specify "enclose". return value must be enclosed in double quotes', () => {
    const replacer = blankHandleSpec('enclose');
    expect(replacer(path)).toBe(`"test test test"`);
  });
  it('specify "double". return value must be enclosed in two double quotes', () => {
    const replacer = blankHandleSpec('double');
    expect(replacer(path)).toBe(`""test test test""`);
  });
  it('specify "double". return value must be enclosed in two double quotes', () => {
    const replacer = blankHandleSpec('escape');
    expect(replacer(path)).toBe(`test\\ test\\ test`);
  });
});

type BoolStr = '1';
describe.only('replaceCmdline()', function () {
  const DELIM = '@#_#@';
  const cmdline = `*if 0==\${dup}%: *copy \${path},\${path}back%br%bl%Oi sed -i -r \${comment}"s#\${search}#prod#" \${path}`;
  const base = 'c:\\path\\to';
  const dirtype = '1';
  const isDup = '1' as BoolStr;
  const path = 'c:\\path\\to\\file';
  const search = 'test';
  const entry = {name: 'entry string', T: '100'};
  const obj = {cmdline, base, dirtype, isDup, path, search, entry};
  const resp = {
    cmdline,
    data: `base:${base}${DELIM}dirtype:${dirtype}${DELIM}search:${search}${DELIM}dup:${isDup}${DELIM}path:${path}${DELIM}att:${DELIM}hl:${DELIM}comment:${entry.T}`,
    rgx: `base:(?<base>.*)${DELIM}type:(?<type>.*)${DELIM}search(?<search>.*)${DELIM}dup:(?<dup>.+)${DELIM}path:(?<path>.+)${DELIM}att:(?<att>.*)${DELIM}hl:(?<hl>.*)${DELIM}comment:(?<comment>.*)`
  };
  it('command executed at each path', () => {
    expect(replaceCmdline(obj)).toEqual(resp);
  });
});
