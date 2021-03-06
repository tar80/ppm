(() => {
  const obj = {};
  const ecma = `${PPx.Extract('%*getcust(S_ppm#global:ppm)')}\\lib\\ecma`;
  obj.metaRegexp = {
    esc: {
      '^': '\\^',
      '$': '\\$',
      '(': '\\(',
      ')': '\\)',
      '[': '\\[',
      '|': '\\|',
      '=': '\\=',
      '*': '\\*',
      '+': '\\+',
      '?': '\\?',
      '.': '\\.',
      '/': '\\/',
      '\\': '\\\\'
    },
    nor: {
      '\\^': '^',
      '\\$': '$',
      '\\(': '(',
      '\\)': ')',
      '\\[': '[',
      '\\]': ']',
      '\\|': '|',
      '\\=': '=',
      '\\*': '*',
      '\\+': '+',
      '\\?': '?',
      '\\.': '.',
      '\\/': '/',
      '\\s': ' ',
      '\\t': '\t',
      '\\\\': '\\'
    }
  };
  obj.metaNewline = {
    esc: {
      lf: '\n',
      cr: '\r',
      crlf: '\r\n',
      unix: '\n',
      mac: '\r',
      dos: '\r\n',
      '%bl': '\n',
      '%br': '\r',
      '%bn': '\r\n',
      '\n': '\n',
      '\r': '\r',
      '\r\n': '\r\n'
    },
    ppx: {
      lf: '%%bl',
      cr: '%%br',
      crlf: '%%bn',
      unix: '%%bl',
      mac: '%%br',
      dos: '%%bn',
      '\n': '%%bl',
      '\r': '%%br',
      '\r\n': '%%bn'
    },
    ansi: {
      lf: '10',
      cr: '13',
      crlf: '-1',
      unix: '10',
      mac: '13',
      dos: '-1',
      '\n': '10',
      '\r': '13',
      '\r\n': '-1'
    }
  };
  obj.script = (() => {
    const path = PPx.ScriptName;
    return {
      name: path.slice(path.lastIndexOf('\\') + 1),
      path: PPx.Extract(`%*name(D,${path})`)
    };
  })();
  obj.plugScript = (plug, scr) =>
    `${PPx.Extract(`%*getcust(S_ppm#plugins:${plug})`)}\\script\\${scr}.js`;
  obj.quitMsg = (msg) => {
    PPx.Echo(`${obj.script.name}: ${msg}`);
    PPx.Quit(-1);
  };
  obj.error = (method) => {
    PPx.Execute(`*script "${ecma}\\errors.js",${method},${PPx.ScriptName}`);
    PPx.Quit(-1);
  };
  obj.fileexists = (filepath) =>
    PPx.Execute('*ifmatch "o:e,a:d-",' + filepath + '%:*stop') === 0 ? false : true;
  obj.setc = (item) => PPx.Execute(`*setcust ${item}`);
  obj.getc = (item) => PPx.Extract(`%*getcust(${item})`);
  obj.lib = function () {
    const args = [].slice.call(arguments);
    const path = `${ecma}\\${this.name}.js,${args}`;
    if (!obj.fileexists(path)) return obj.quitMsg(`Not exist\r\n\r\n${path}`);
    return PPx.Execute(`*script "${path}",${args}`);
  };
  obj.reply = function () {
    const args = [].slice.call(arguments);
    const path = `${ecma}\\${this.name}.js`;
    if (!obj.fileexists(path)) return `Not exist: ${path}`;
    return PPx.Extract(`%*script("${path}",${args})`);
  };
  obj.print = function () {
    const args = [].slice.call(arguments);
    const linefeed = PPx.Extract('%*getcust(S_ppm#user:newline)');
    const tab = this.tab || 8;
    PPx.Execute(
      `*${
        this.cmd
      } -utf8bom -${linefeed} -tab:${tab} -k *editmode -modify:silent -modify:readonly %%: *setcaption ${
        this.title
      }%%: *insert ${args.join(obj.metaNewline.ppx[linefeed])}`
    );
  };
  obj.printw = function () {
    const args = [].slice.call(arguments);
    const linefeed = PPx.Extract('%*getcust(S_ppm#user:newline)');
    const tab = this.tab || 8;
    const path = PPx.Extract('%*temp()%\\printw.txt');
    obj.write.apply({filepath: path, newline: linefeed}, args);
    PPx.Execute(
      `*${this.cmd} -utf8bom -${linefeed} -tab:${tab} ${path} -k *editmode -modify:silent -modify:readonly %%: *setcaption ${this.title}`
    );
  };
  obj.esconv = (format, text) => {
    const reg = {
      esc: /./g,
      nor: /\\./g
    }[format];
    return text.replace(reg, (match) => obj.metaRegexp[format][match] || match);
  };
  obj.linefeedback = (data) => {
    const codes = ['\r\n', '\n', '\r'];
    for (let i = 0, l = codes.length; i < l; i++) {
      if (~data.indexOf(codes[i])) return codes[i];
    }
    return '';
  };
  obj.readLines = (filepath) => {
    let data, data_;
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    try {
      st.LoadFromFile(filepath);
      data = st.ReadText(-1);
      data_ = data.slice(0, 120);
    } catch (_err) {
      return {data: [], newline: ''};
    } finally {
      st.Close;
    }
    const linefeed = obj.linefeedback(data_);
    data_ = data.split(linefeed);
    if (data_.length === 0) return {data: [], newline: ''};
    if (data_[data_.length - 1] === '') data_.pop();
    return {data: data_, newline: linefeed};
  };
  obj.write = function () {
    if (
      ~this.filepath.indexOf(PPx.Extract("%'temp'")) &&
      ~this.filepath.indexOf(PPx.Extract('%*getcust(S_ppm#global:cache)'))
    ) {
      PPx.Execute(
        '%"ppx-plugin-manager"%I"Error: Not ppm management file%bn%bn' + this.filepath + '"'
      );
      PPx.Quit(-1);
    }
    const args = [].slice.call(arguments);
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LineSeparator = obj.metaNewline.ansi[this.newline];
    st.WriteText(args.join(obj.metaNewline.esc[this.newline]), 1);
    st.SaveToFile(this.filepath, 2);
    st.Close;
  };
  obj.input = function () {
    const rep = {
      0: [/"/g, {'"': '""'}],
      1: [/["%]/g, {'"': '""', '%': '%%'}]
    }[this.type || 0];
    const text = this.text || '';
    const title = this.title || 'input.js';
    const mode = this.mode || 'g';
    const select = this.select || 'a';
    const postcmd = this.k ? ` -k ${this.k}` : '';
    const result =
      PPx.Extract(
        `%*input(%("${text}" -title:"${title}"%) -mode:${mode} -select:${select}${postcmd})`
      ) || PPx.Quit(-1);
    return result.replace(rep[0], (c) => rep[1][c]);
  };
  obj.auxlocalpath = (wd) =>
    wd.replace(/^aux:([\\/]{2})?[MS]_[^\\/]+[\\/](.*)/, (_p0, p1, p2) =>
      typeof p1 === 'undefined' ? p2 : ''
    );
  obj.basepath = (filepath) => {
    if (!obj.fileexists(filepath)) return '';
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-16LE';
    st.LoadFromFile(filepath);
    st.LineSeparator = -1;
    st.SkipLine = 1;
    const data = st.ReadText(-2);
    st.Close;
    return data.replace(/^;Base=(.*)\|\d*/, '$1');
  };
  return obj;
})();
