(() => {
  const symbolTo = {
    '!': '\\1',
    '"': '\\2',
    '#': '\\3',
    '$': '\\4',
    '%': '\\5',
    '&': '\\6',
    "'": '\\7',
    '(': '\\8',
    ')': '\\9',
    '=': "\\'-'",
    '~': "\\'^'",
    '|': "\\'\\'",
    '`': "\\'@'",
    '{': "\\'['",
    '}': "\\']'",
    '*': "\\':'",
    '+': "\\';'",
    '<': "\\','",
    '>': "\\'.'",
    '?': "\\'/'",
    '-': "'-'",
    '^': "'^'",
    '\\': "'\\'",
    '@': "'@'",
    '[': "'['",
    ';': "';'",
    ':': "':'",
    ']': "']'",
    ',': "','",
    '.': "'.'",
    '/': "'/'"
  };
  const toSymbol = {
    1: "'!'",
    2: "'\"'",
    3: "'#'",
    4: "'$'",
    5: "'%'",
    6: "'&'",
    7: "'''",
    8: "'('",
    9: "')'",
    "'-'": "'='",
    "'^'": "'~'",
    "'\\'": "'|'",
    "'@'": "'`'",
    "'['": "'{'",
    "';'": "'+'",
    "':'": "'*'",
    "']'": "'}'",
    "','": "'<'",
    "'.'": "'>'",
    "'/'": "'?'"
  };
  const toChr = {
    'V_H30': '0',
    'V_H31': '1',
    'V_H32': '2',
    'V_H33': '3',
    'V_H34': '4',
    'V_H35': '5',
    'V_H36': '6',
    'V_H37': '7',
    'V_H38': '8',
    'V_H39': '9',
    'V_HBD': '-',
    'V_H41': 'A',
    'V_H42': 'B',
    'V_H43': 'C',
    'V_H44': 'D',
    'V_H45': 'E',
    'V_H46': 'F',
    'V_H47': 'G',
    'V_H48': 'H',
    'V_H49': 'I',
    'V_H4A': 'J',
    'V_H4B': 'K',
    'V_H4C': 'L',
    'V_H4D': 'M',
    'V_H4E': 'N',
    'V_H4F': 'O',
    'V_H50': 'P',
    'V_H51': 'Q',
    'V_H52': 'R',
    'V_H53': 'S',
    'V_H54': 'T',
    'V_H55': 'U',
    'V_H56': 'V',
    'V_H57': 'W',
    'V_H58': 'X',
    'V_H59': 'Y',
    'V_H5A': 'Z',
    'V_HBA': ':',
    'V_HBB': ';',
    'V_HBC': ',',
    'V_HBD': '-',
    'V_HBE': '.',
    'V_HBF': '/',
    'V_HC0': '@',
    'V_HDB': '[',
    'V_HDC': '\\',
    'V_HDD': ']',
    'V_HDE': '^',
    'V_HE2': '\\',
    'V_HE5': 'BS',
    'V_HF3': 'HAN/ZEN',
    'V_HF4': 'HAN/ZEN',
    'V_HF5': 'KANA',
    'V_HF6': 'KANA',
    'V_HF7': 'NFER',
    'V_HF8': 'KANJI',
    'V_HFA': 'CAPS',
    'V_HFB': 'CAPS'
  };
  const toCode = {
    0: 'V_H30',
    1: 'V_H31',
    2: 'V_H32',
    3: 'V_H33',
    4: 'V_H34',
    5: 'V_H35',
    6: 'V_H36',
    7: 'V_H37',
    8: 'V_H38',
    9: 'V_H39',
    A: 'V_H41',
    B: 'V_H42',
    C: 'V_H43',
    D: 'V_H44',
    E: 'V_H45',
    F: 'V_H46',
    G: 'V_H47',
    H: 'V_H48',
    I: 'V_H49',
    J: 'V_H4A',
    K: 'V_H4B',
    L: 'V_H4C',
    M: 'V_H4D',
    N: 'V_H4E',
    O: 'V_H4F',
    P: 'V_H50',
    Q: 'V_H51',
    R: 'V_H52',
    S: 'V_H53',
    T: 'V_H54',
    U: 'V_H55',
    V: 'V_H56',
    W: 'V_H57',
    X: 'V_H58',
    Y: 'V_H59',
    Z: 'V_H5A',
    "'-'": 'V_HBD',
    "':'": 'V_HBA',
    "';'": 'V_HBB',
    "','": 'V_HBC',
    "'-'": 'V_HBD',
    "'.'": 'V_HBE',
    "'/'": 'V_HBF',
    "'@'": 'V_HC0',
    "'['": 'V_HDB',
    "'\\'": 'V_HDC',
    "']'": 'V_HDD',
    "'^'": 'V_HDE',
    "' '": 'SPACE',
    BS: 'V_HE5',
    KANA: 'V_HF5',
    NFER: 'V_HF7',
    KANJI: 'V_HF8',
    CAPS: 'V_HFA',
    NUMLOCK: 'PAUSE'
  };
  const multi_chr = {
    BS: true,
    INS: true,
    DEL: true,
    HOME: true,
    ESC: true,
    END: true,
    ENTER: true,
    TAB: true,
    SPACE: true,
    APPS: true,
    PAUSE: true,
    NUMLOCK: true,
    CANCEL: true,
    SCROLL: true,
    PUP: true,
    PDOWN: true,
    UP: true,
    DOWN: true,
    LFET: true,
    RIGHT: true,
    LWIN: true,
    RWIN: true,
    NFER: true,
    XFER: true
  };
  const fso = PPx.CreateObject('Scripting.FileSystemObject');
  const invalid_key = (keyspec) => {
    PPx.Echo(`mod/input.js: can not assign ${keyspec}`);
    PPx.Quit(1);
  };
  const not_allowed = (keyspec, spec) => {
    if (spec.chr === 'A' && ~spec.mod.indexOf('~') && ~spec.mod.indexOf('\\')) {
      invalid_key(keyspec);
    }
    if (spec.chr === 'J' && ~spec.mod.indexOf('^\\') && !~spec.mod.indexOf('&')) {
      invalid_key(keyspec);
    }
    if (spec.chr.length === 1) return;
    if (spec.chr.length === 3 && ~spec.chr.indexOf("'")) return;
    if (/F[0-9]+/.test(spec.chr)) return;
    if (~spec.chr.indexOf('V_H')) return;
    if (multi_chr[spec.chr]) return;
    invalid_key(keyspec);
  };
  const post_cmd = (complist, cmd) => {
    let cmdString = [];
    if (typeof complist !== 'undefined') {
      complist = PPx.Extract(
        ~complist.indexOf(':') ? complist : `%*getcust(S_ppm#global:cache)\\list\\${complist}`
      );
      if (fso.FileExists(complist)) {
        cmdString.push(`*completelist -file:${complist}`);
        input.addkey(
          '^o',
          `*edit ${complist}%%:*completelist -file:${complist}`,
          'Edit complist with ppe'
        );
        const cmdlines =
          '%OC %%"ppx-plugin-manager"%%Q"Append edited text to the CompletList?"%bn' +
          `%bt%(*script %*getcust(S_ppm#global:lib)\\append_utf8.js,${complist},match,1,"%*edittext()"%)%bn` +
          '%bt*linemessage Finish append edited text.';
        input.addkey('^s', cmdlines, 'Append edited text');
      }
    }
    if (typeof cmd !== 'undefined') {
      cmdString.push(cmd);
    }
    return cmdString.length > 0 ? cmdString : '';
  };
  const sort_symbol = (chrs) => {
    if (/[0-9A-Z]/.test(chrs)) return chrs;
    const shiftchr = symbolTo[chrs];
    return typeof shiftchr === 'undefined' ? chrs : shiftchr;
  };
  const delete_keys = (quit) => {
    if (PPx.getValue('utilinput') === '1') {
      PPx.Execute('*deletecust "K_ppmInputTemp"%:*deletecust "M_ppmInputTemp"');
      PPx.setValue('utilinput', '');
    }
    if (quit) PPx.Quit(-1);
  };
  const input = {};
  input.adjust = (keyspec) => {
    keyspec = keyspec.toUpperCase();
    keyspec.replace(/.*'(.+)'/, (_match, p1) => {
      if (p1.length > 1) invalid_key(keyspec);
    });
    if (/'.'/.test(keyspec.slice(-3))) {
      keyspec = keyspec.slice(0, -3) + sort_symbol(keyspec.slice(-2, -1));
    } else if (/[^0-9A-Z]/.test(keyspec.slice(-1))) {
      keyspec = keyspec.slice(0, -1) + sort_symbol(keyspec.slice(-1));
    }
    const reg = /^([~&^\\]*)(.+)/;
    let chr = {};
    keyspec.replace(reg, (_match, p1, p2) => {
      chr = {
        modifier: p1,
        string: p2
      };
    });
    if (chr.modifier === '') return ['', chr.string];
    return [chr.modifier, chr.string];
  };
  input.sortM = (mod) => {
    const modifier = [];
    if (~mod.indexOf('~')) modifier.push('~');
    if (~mod.indexOf('&')) modifier.push('&');
    if (~mod.indexOf('^')) modifier.push('^');
    if (~mod.indexOf('\\')) modifier.push('\\');
    return modifier.join('');
  };
  input.keycode = (mod, chr) => {
    if (~chr.indexOf('V_H')) return mod + chr;
    if (chr === "' '" && (~mod.indexOf('&') || ~mod.indexOf('^\\'))) {
      return mod + toCode[chr];
    }
    if (chr === '0' && (~mod.indexOf('^') || ~mod.indexOf('\\'))) {
      return mod + toCode[chr];
    }
    if (chr.length > 1 && /^[A-Z]+$/.test(chr)) {
      typeof multi_chr[chr] === 'undefined' && invalid_key(mod + chr);
    }
    if (!~mod.indexOf('^')) {
      if (~chr.indexOf("'") && ~mod.indexOf('\\')) {
        const chr_ = toSymbol[chr];
        chr = typeof chr_ !== 'undefined' ? chr_ : chr;
      }
      return mod + chr;
    }
    if (chr === 'J') {
      return mod + toCode[chr];
    }
    if (chr.length === 1) {
      if (/[^A-Z]/.test(chr)) {
        chr = toCode[chr];
      } else if (~mod.indexOf('&')) {
        chr = toCode[chr];
      }
      return mod + chr;
    }
    if (~chr.indexOf("'")) {
      return mod + toCode[chr];
    }
    if (mod === '^' && /BS|NUMLOCK/.test(chr)) {
      return mod + toCode[chr];
    }
    PPx.Echo('leavng key:' + mod + chr);
  };
  input.keystring = (mod, chr) => {
    const modifier = [];
    let chrstring = chr;
    if (~mod.indexOf('\\')) modifier.push('Shift');
    if (~mod.indexOf('^')) modifier.push('Ctrl');
    if (~mod.indexOf('&')) modifier.push('Alt');
    if (~mod.indexOf('~')) modifier.push('Ex');
    if (~chr.indexOf('V_H')) chrstring = toChr[chr];
    if (chr.length === 3 && ~chr.indexOf("'")) chrstring = chr.slice(1, 2);
    return `${modifier.join('+')}+&${chrstring}`;
  };
  input.addkey = (keyspec, code, comment) => {
    const adjust = (() => {
      const k = input.adjust(keyspec);
      return {mod: input.sortM(k[0]), chr: k[1]};
    })();
    not_allowed(keyspec, adjust);
    PPx.Execute(`%OC *setcust K_ppmInputTemp:${input.keycode(adjust.mod, adjust.chr)},${code}`);
    PPx.Execute(
      `%OC *setcust M_ppmInputTemp:${comment}%bt${input.keystring(adjust.mod, adjust.chr)}=${code}`
    );
    PPx.setValue('utilinput', 1);
  };
  input.lied = function () {
    const rep = {
      0: [/"/g, {'"': '""'}],
      1: [/["%]/g, {'"': '""', '%': '%%'}]
    }[this.esc || 0];
    const text = this.text || '';
    const title = this.title || 'ppm_input';
    const mode = this.mode || 'g';
    const select = this.select || 'a';
    let postcmd = post_cmd(this.listname, this.k);
    let posttile = '';
    if (postcmd !== '') {
      if (PPx.getValue('utilinput') === '1') {
        PPx.Execute('*setcust K_ppmInputTemp:^V_HBE,%%M_ppmInputTemp');
        PPx.Execute(`*linecust K_lied`);
        postcmd.unshift('*mapkey use,K_ppmInputTemp');
        posttile = '  [Keymap: ctrl+.]';
      }
      postcmd = ` -k ${postcmd.join('%%:')}`;
    }
    const result =
      PPx.Extract(
        `%*input(%("${text}" -title:"${
          title + posttile
        }"%) -mode:${mode} -select:${select}${postcmd})`
      ) || delete_keys(true);
    delete_keys();
    return result.replace(rep[0], (c) => rep[1][c]);
  };
  return input;
})();
