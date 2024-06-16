import PPx from '@ppmdev/modules/ppx.ts';
global.PPx = Object.create(PPx);
import {
  type ParsedPatch,
  parsePluginlist,
  parseInstall,
  parseConfig,
  specItem,
  sectionItems,
  linecustItems,
  convertLine,
  mergeProp
} from '../parser.ts';
import {useLanguage} from '@ppmdev/modules/data.ts';
import {ppm} from '@ppmdev/modules/ppm.ts';
import {langParser} from '../language.ts';

jest.mock('@ppmdev/modules/io');

const lang = langParser[useLanguage()];
let parsed: ParsedPatch = {default: {}, replace: {}, convert: {}, section: [], linecust: {}, unset: [], execute: []};
let lines: string[] = [];

describe('parseInstall()', function () {
  const name = 'fake_plugin';

  it('read not exist path', () => {
    const path = 'nox/exist/path';
    expect(parseInstall(name, path, false)).toEqual([true, `${lang.failedToGet} ${name}`]);
  });
  it('read dummy_install and different plugin-name', () => {
    const path = `${process.cwd()}\\src\\mod\\__tests__\\dummy_install`;
    expect(parseInstall(name, path, false)).toEqual([true, `${name} ${lang.isNotPlugin}`]);
  });
  it('read dummy_install', () => {
    const name = 'someplugin';
    const path = `${process.cwd()}\\src\\mod\\__tests__\\dummy_install`;
    const data = parseInstall(name, path, false);
    //NOTE: The PPx variables returned by the script are not real values, but dummy values returned by ppx.ts
    expect(data).toEqual([
      true,
      `\x1b[31m DROP \x1b[49;39m ppx-plugin-manager version 9.00 or later\\n` +
        `\x1b[31m DROP \x1b[49;39m PPx version 999999 or later\\n` +
        `\x1b[31m DROP \x1b[49;39m Required executables: \x1b[33msomeexe.exe\x1b[49;39m\\n` +
        `\x1b[31m DROP \x1b[49;39m Required modules: \x1b[33mmod1\x1b[49;39m, \x1b[33mmod2\x1b[49;39m`,
      'somedepend'
    ]);
  });
});

describe('parsePluginlist()', function () {
  it('read dummy_pluginlist', () => {
    const path = `${process.cwd()}\\src\\mod\\__tests__\\dummy_pluginlist`;
    const data = parsePluginlist(path);
    expect(data[0]).toEqual({
      'autor': 'autor',
      'location': 'remote',
      'name': '1_plugin',
      'path': `${ppm.global('ppmrepo')}\\1_plugin`,
      'enable': true,
      'setup': false,
      'version': '0.1.0'
    });
    expect(data[1]).toEqual({
      'autor': 'autor',
      'branch': 'dev',
      'location': 'remote',
      'name': '2_plugin',
      'path': `${ppm.global('ppmrepo')}\\2_plugin`,
      'enable': true,
      'setup': false,
      'version': '0.1.0'
    });
    expect(data[2].branch).toBe('test');
    expect(data[2].commit).toBe('abc1234');
  });
});

describe('specItem()', function () {
  const lines = [
    '!first = echo 0',
    '@first = echo 1',
    '@first = first line',
    '	next line',
    '	final line',
    '$second = j',
    '$second = ^J',
    "$second = ':'",
    '?third = echo 3'
  ];
  const len = lines.length;

  beforeEach(() => {
    parsed = {default: {}, replace: {}, convert: {}, section: [], linecust: {}, unset: [], execute: []};
  });
  afterAll(() => {
    parsed = {default: {}, replace: {}, convert: {}, section: [], linecust: {}, unset: [], execute: []};
  });

  it(`returns error "${lang.badGrammar}"`, () => {
    expect(specItem(0, len, lines[0], lines, parsed)[0]).toBe(lang.badGrammar);
  });
  it('default item', () => {
    expect(specItem(1, len, lines[1], lines, parsed)[1].default).toEqual({'first': {'sep': '=', 'value': 'echo 1'}});
  });
  it('multi-line default item', () => {
    expect(specItem(2, len, lines[2], lines, parsed)[1].default).toEqual({
      first: {sep: '=', value: 'first line\r\n\tnext line\r\n\tfinal line'}
    });
  });
  it('replace item', () => {
    expect(specItem(5, len, lines[5], lines, parsed)[1].replace).toEqual({'second': {'sep': '=', 'value': 'J'}});
  });
  it('replace item, and converting to virtual-key', () => {
    expect(specItem(6, len, lines[6], lines, parsed)[1].replace).toEqual({'second': {'sep': '=', 'value': '^V_H4A'}});
  });
  it('replace item, the item is enclosed in parentheses', () => {
    expect(specItem(7, len, lines[7], lines, parsed)[1].replace).toEqual({'second': {'sep': '=', 'value': "':'"}});
  });
  it('convert item', () => {
    expect(specItem(8, len, lines[8], lines, parsed)[1].convert).toEqual({'third': {'sep': '=', 'value': 'echo 3'}});
  });
});

describe('sectionItems()', function () {
  let receive;

  beforeEach(() => {
    parsed = {default: {}, replace: {}, convert: {}, section: [], linecust: {}, unset: [], execute: []};
  });
  afterAll(() => {
    parsed = {default: {}, replace: {}, convert: {}, section: [], linecust: {}, unset: [], execute: []};
  });

  it('patterns that does not add any items', () => {
    lines = ['[section]', '[endsection]', 'key = value', '}'];
    expect(sectionItems(0, lines.length, lines, parsed)[2].section).toEqual([]);
    lines = ['[section]', '', '\t', '-- =', '--	=', '}'];
    expect(sectionItems(0, lines.length, lines, parsed)[2].section).toEqual([]);
  });
  it('patterns error', () => {
    lines = ['[section]', '-|label = {**comment**', 'key = value', '}'];
    expect(sectionItems(0, lines.length, lines, parsed)[0]).toBe(lang.badDeletion);
    lines = ['[section]', '-1.92|label = {**comment**', 'key = value', '}'];
    expect(sectionItems(0, lines.length, lines, parsed)[0]).toBe(lang.badDeletion);
    lines = ['[section]', 'abcdefg'];
    expect(sectionItems(0, lines.length, lines, parsed)[0]).toBe(lang.badGrammar);
  });
  it('a bunch of properties', () => {
    lines = ['[section]', 'label	=	 {', 'key =	value', '[endsection]'];
    receive = {...parsed};
    receive.section = ['label	= {', 'key	= value', '}'];
    receive.unset = ['label	= {', '-|key	=', '}'];

    expect(sectionItems(0, lines.length, lines, parsed)).toEqual([false, 4, receive]);
  });
  it('a bunch of properties, with unset', () => {
    lines = ['section', '-label	=	 {', 'key =	value', '}'];
    receive = {...parsed};
    receive.section = ['label	= {', 'key	= value', '}'];
    receive.unset = ['-|label	='];

    expect(sectionItems(0, lines.length, lines, parsed)).toEqual([false, 4, receive]);
  });
  it('add by replacing some properties', () => {
    lines = [
      'section',
      '/rep = REPLACED',
      '/rep2	= MOREOVER',
      'prop1 = is the [/rep] string',
      '[/rep] =	[/rep]',
      '[/rep2]=1:[/rep], 2:[/rep2]'
    ];
    receive = {...parsed};
    receive.section = ['prop1	= is the REPLACED string', 'REPLACED	= REPLACED', 'MOREOVER	= 1:REPLACED, 2:MOREOVER'];
    receive.unset = ['-|prop1	=', '-|REPLACED	=', '-|MOREOVER	='];

    expect(sectionItems(0, lines.length, lines, parsed)).toEqual([false, 6, receive]);
  });
  it('properties that ignore unset', () => {
    lines = ['section', '-A_exec = {', 'key =	value', '}'];
    receive = {...parsed};
    receive.section = ['A_exec	= {', 'key	= value', '}'];
    receive.unset = [];

    expect(sectionItems(0, lines.length, lines, parsed)).toEqual([false, 4, receive]);

    lines = ['section', 'X_test = value', 'key =	value'];
    receive = {...parsed};
    receive.section = ['X_test	= value', 'key	= value'];
    receive.unset = ['-|key	='];

    expect(sectionItems(0, lines.length, lines, parsed)).toEqual([false, 3, receive]);
  });
  it('pattern deletion properties', () => {
    lines = ['section', 'M_remain = {', 'key =	value', '}', '-|X_ignore =', '-|M_delete1=', '-1.90|M_delete2=', '-K_normal=value'];
    receive = {...parsed};
    receive.section = ['M_remain	= {', 'key	= value', '}', '-|X_ignore	= ', '-|M_delete1	= ', '-1.90|M_delete2	= '];
    receive.unset = ['M_remain	= {', '-|key	=', '}', '-|K_normal	='];

    expect(sectionItems(0, lines.length, lines, parsed)).toEqual([false, 8, receive]);
  });
});

describe('linecustItems()', function () {
  it('pattern correct', () => {
    lines = ['label1,ID:SubID,command', 'label2,ID:SubID=param', 'label3,ID=param'];
    expect(linecustItems(0, lines.length, lines, parsed)[1].linecust).toEqual({
      label1: {id: 'ID:SubID', sep: ',', value: 'command'},
      label2: {id: 'ID:SubID', sep: '=', value: 'param'},
      label3: {id: 'ID', sep: '=', value: 'param'}
    });
  });
  it('pattern incorrect', () => {
    lines = ['ID:SubID,command', 'label=SubID=param', 'ID=param'];
    expect(linecustItems(0, lines.length, lines, parsed)[1].linecust).toEqual({});
  });
});

describe('convertLine()', function () {
  let line: string;
  const noconvert = '[?noconvert:default]';
  const def1 = '[?repl1:default1]';
  const def2 = '[?repl2:default2]';
  const repl1 = 'replaced element1';
  const repl2 = 'replaced element2';
  const repl = {
    repl1: {sep: '=', value: repl1},
    repl2: {sep: '=', value: repl2}
  };
  it('no elements to convert within the line', () => {
    line = '@noconvert = param';
    expect(convertLine(line, repl)).toBe(line);
  });
  it('with default', () => {
    line = `@convertion\t, echo "${noconvert}"`;
    expect(convertLine(line, repl)).toBe('@convertion\t, echo "default"');
  });
  it('with replacement', () => {
    line = `@convertion\t, echo "${def1}"`;
    expect(convertLine(line, repl)).toBe(`@convertion\t, echo "${repl1}"`);
  });
  it('contains multiple replacement elements', () => {
    line = `@convertion\t, echo "${def1}${def2}${noconvert}${def1}${def2}"`;
    expect(convertLine(line, repl)).toBe(`@convertion\t, echo "${repl1}${repl2}default${repl1}${repl2}"`);
  });
  it('forgot to close parenthesis', () => {
    line = `@convertion\t, echo "[?repl1:non-close parenthesis"`;
    expect(convertLine(line, repl)).toBe('@convertion\t, echo "[?repl1:non-close parenthesis"');
  });
});

describe('mergeProp()', function () {
  beforeAll(() => {
    parsed = {
      default: {
        def1: {sep: '=', value: 'user parameter'},
        def2: {sep: ',', value: 'user command'}
      },
      replace: {
        C: {sep: '=', value: '^C'},
        D: {sep: '=', value: '^D'},
        ';': {sep: '=', value: "'?'"}
      },
      convert: {},
      section: [],
      linecust: {},
      unset: ['-|def2\t=', '-|def3\t=', '-|B\t=', '-|^D\t=', '-|inner2\t='],
      execute: []
    };
  });
  afterAll(() => {
    parsed = {default: {}, replace: {}, convert: {}, section: [], linecust: {}, unset: [], execute: []};
  });

  it('@default value', () => {
    expect(mergeProp(false, '@default:def', '=', 'default parameter', parsed)).toEqual({
      set: 'def\t= default parameter',
      unset: '-|def\t='
    });
  });
  it('@default value, and unset is already registered', () => {
    expect(mergeProp(false, '@default:def3', '=', 'default parameter', parsed)).toEqual({
      set: 'def3\t= default parameter',
      unset: undefined
    });
  });
  it('@user value', () => {
    expect(mergeProp(true, '@default:def1', '=', 'default parameter', parsed)).toEqual({
      set: 'def1\t= user parameter',
      unset: '-|def1\t='
    });
  });
  it('@user value, and unset is already registered', () => {
    expect(mergeProp(true, '@default:def2', ',', 'default command', parsed)).toEqual({
      set: 'def2\t, user command',
      unset: undefined
    });
  });
  it('$default key', () => {
    expect(mergeProp(true, '$replace:A', '=', 'parameter', parsed)).toEqual(undefined);
  });
  it('$default key, and unset is already registered', () => {
    expect(mergeProp(true, '$replace:B', ',', 'command', parsed)).toEqual(undefined);
  });
  it('$user key', () => {
    expect(mergeProp(true, '$replace:C', '=', 'parameter', parsed)).toEqual({
      set: '^C	= parameter',
      unset: '-|^C\t='
    });
  });
  it('$user key, and unset is already registered', () => {
    expect(mergeProp(true, '$replace:D', ',', 'command', parsed)).toEqual({
      set: '^D	, command',
      unset: undefined
    });
  });
  it('$user key, the key is enclosed in parentheses', () => {
    expect(mergeProp(true, "$replace:';'", '=', 'parameter', parsed)).toEqual({
      set: "'?'	= parameter",
      unset: "-|'?'\t="
    });
  });
  it('internal property', () => {
    expect(mergeProp(true, 'inner1', '=', 'parameter', parsed)).toEqual({
      set: 'inner1	= parameter',
      unset: '-|inner1\t='
    });
  });
  it('internal property, and unset is already registered', () => {
    expect(mergeProp(true, 'inner2', ',', 'command', parsed)).toEqual({
      set: 'inner2	, command',
      unset: undefined
    });
  });
});

describe('parsePatchConfig()', function () {
  it(`returns error "${lang.isEarlier}"`, () => {
    lines = ['[endsection]', '[section]'];
    expect(() => parseConfig.patch('user', lines)).toThrow(`[endsection] ${lang.isEarlier}`);
  });
  it('returns specItem()', () => {
    lines = [';[section]', '	test', '@spec =	123'];
    expect(parseConfig.patch('user', lines).default).toEqual({'spec': {'sep': '=', 'value': '123'}});
  });
});

describe('mergeConfig()', function () {
  const base = [
    // skip items
    '',
    ';comment',
    '-- =',
    '\tchain command',

    // ignore unset
    'X_prop = test',

    'S_ppm#user	= {',
    '@default:newline = crlf',
    '@default:editor = *edit',
    '@default:editline =',
    '-- =',
    '@default:help = *ppv',
    '@default:compare = *ppb -bootid:v -c vim -d',
    '@default:work = #0:\\',
    '@default:convertUser = [?conv1:echo] "[?conv2:default message]"',
    '@default:convertDef = [?conv1:echo] "[?conv3:default message]"',
    '}',
    'S_ppm#test	={',
    'abc = 123',
    '}',
    'KC_main={',
    '$replace:1=default param',
    '$replace:a,default command',
    "$replace:':'=default param",
    '}'
  ];
  const patch = {
    default: {
      newline: {sep: '=', value: 'lf'},
      editor: {sep: '=', value: 'usereditor'},
      help: {sep: '=', value: 'helpeditor'},
      compare: {sep: '=', value: 'compareeditor'},
      work: {sep: '=', value: "%'HOMEPATH'\\desktop"}
    },
    replace: {
      a: {sep: '=', value: '^V_H4A'},
      ':': {sep: '=', value: "'?'"}
    },
    convert: {
      conv1: {sep: '=', value: '*linemessage'},
      conv2: {sep: '=', value: 'user message'}
    },
    section: ['S_userProps\t= {', 'item1\t= user prop', 'item2\t, user command', '}'],
    unset: ['-|S_ppm#test\t=', '-|S_userProps\t='],
    linecust: {},
    execute: []
  };
  const resp = {
    set: [
      'X_prop\t= test',
      'S_ppm#user\t= {',
      'newline\t= lf',
      'editor\t= usereditor',
      'editline\t= ',
      '--\t=',
      'help\t= helpeditor',
      'compare\t= compareeditor',
      "work\t= %'HOMEPATH'\\desktop",
      'convertUser\t= *linemessage "user message"',
      'convertDef\t= *linemessage "default message"',
      '}',
      'S_ppm#test\t= {',
      'abc\t= 123',
      '}',
      'KC_main\t= {',
      '^V_H4A\t, default command',
      "'?'\t= default param",
      '}',
      'S_userProps\t= {',
      'item1\t= user prop',
      'item2\t, user command',
      '}'
    ],
    unset: [
      '-|S_ppm#test\t=',
      '-|S_userProps\t=',
      'S_ppm#user\t= {',
      '-|newline\t=',
      '-|editor\t=',
      '-|editline\t=',
      '-|help\t=',
      '-|compare\t=',
      '-|work\t=',
      '-|convertUser\t=',
      '-|convertDef\t=',
      '}',
      'KC_main\t= {',
      '-|^V_H4A\t=',
      "-|'?'\t=",
      '}'
    ],
    execute: [],
    linecust: {}
  };

  it('passed test data', () => {
    expect(parseConfig.merge(base, patch)).toEqual(resp);
  });
});
