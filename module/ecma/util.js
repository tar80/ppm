(() => {
  'use strict';
  const obj = {};
  const ecma = `${PPx.Extract('%*getcust(S_ppm#global:ppm)')}\\lib\\ecma`;
  obj.fmt = {
    bregonig: {
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
    }
  };
  obj.newline = {
    js: {
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
    adodb: {
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
  obj.quitMsg = (msg) => {
    PPx.Echo(`${obj.script.name}: ${msg}`);
    PPx.Quit(-1);
  };
  obj.error = (method) => {
    PPx.Execute(`*script "${ecma}\\errors.js",${method},${PPx.ScriptName}`);
    PPx.Quit(-1);
  };
  obj.setc = (item) => PPx.Execute(`*setcust ${item}`);
  obj.getc = (item) => PPx.Extract(`%*getcust(${item})`);
  obj.lib = function () {
    const args = [].slice.call(arguments);
    return PPx.Execute(`*script "${ecma}\\${this.name}.js",${args}`);
  };
  obj.reply = function () {
    const args = [].slice.call(arguments);
    return PPx.Extract(`%*script("${ecma}\\${this.name}.js",${args})`);
  };
  obj.print = function () {
    const args = [].slice.call(arguments);
    const newline = PPx.Extract('%*getcust(S_ppm#user:newline)');
    const tab = this.tab || 8;
    PPx.Execute(
      `*${
        this.cmd
      } -utf8bom -${newline} -tab:${tab} -k *editmode -modify:silent -modify:readonly %%: *setcaption ${
        this.title
      }%%: *insert %%OD ${args.join(obj.newline.ppx[newline])}`
    );
  };
  obj.printw = function () {
    const args = [].slice.call(arguments);
    const newline = PPx.Extract('%*getcust(S_ppm#user:newline)');
    const tab = this.tab || 8;
    const path = PPx.Extract('%*temp()%\\printw.txt');
    obj.write.apply({filepath: path, newline: newline}, args);
    PPx.Execute(
      `*${this.cmd} -utf8bom -${newline} -tab:${tab} ${path} -k *editmode -modify:silent -modify:readonly %%: *setcaption ${this.title}`
    );
  };
  obj.esc = (format, text) => text.replace(/./g, (match) => obj.fmt[format][match] || match);
  obj.check_linefeed = (data) => {
    const codes = ['\r\n', '\n', '\r'];
    for (let i = 0, l = codes.length; i < l; i++) {
      if (~data.indexOf(codes[i])) return codes[i];
    }
    return '';
  };
  obj.lines = (filepath) => {
    let data, data_;
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    try {
      st.LoadFromFile(filepath);
      data = st.ReadText(-1);
      data_ = data.slice(0, 120);
    } catch (_err) {
      return {newline: '[error]', data: []};
    } finally {
      st.Close;
    }
    const linefeed = obj.check_linefeed(data_);
    data_ = data.split(linefeed);
    if (data_.length === 0) return {newline: '', data: []};
    if (data_[data_.length - 1] === '') data_.pop();
    return {newline: linefeed, data: data_};
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
    st.LineSeparator = obj.newline.adodb[this.newline];
    st.WriteText(args.join(obj.newline.js[this.newline]), 1);
    st.SaveToFile(this.filepath, 2);
    st.Close;
  };
  obj.input = (type, text, title, mode, select, postcmd) => {
    const rep = {
      0: [/"/g, {'"': '""'}],
      1: [/["%]/g, {'"': '""', '%': '%%'}]
    }[type];
    text = text || '';
    title = title || 'input.js';
    mode = mode || 'g';
    select = select || 'a';
    postcmd = postcmd ? ` -k %(${postcmd}%)` : '';
    const result =
      PPx.Extract(
        `%*input(%("${text}"%) -title:"${title}" -mode:${mode} -select:${select}${postcmd})`
      ) || PPx.Quit(-1);
    return result.replace(rep[0], (c) => rep[1][c]);
  };
  return obj;
})();
