(() => {
  String.prototype.metaRegexp = function (notation) {
    return {
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
      norm: {
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
    }[notation][this];
  };
  String.prototype.metaNewline = function (notation) {
    return {
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
        lf: '%bl',
        cr: '%br',
        crlf: '%bn',
        unix: '%bl',
        mac: '%br',
        dos: '%bn',
        '\n': '%bl',
        '\r': '%br',
        '\r\n': '%bn'
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
    }[notation][this];
  };
  const NL_CHAR = '\r\n';
  const ecma = `${PPx.Extract('%*getcust(S_ppm#global:ppm)')}\\lib\\ecma`;
  const processID = PPx.WindowIDName.slice(0, 1);
  const sort_ppx_process = (ppxid) => {
    ppxid = ppxid.toUpperCase().slice(0, 1);
    if (ppxid === processID) {
      return true;
    }
    return /^[^CV]/.test(ppxid);
  };
  const path_restrictions = (path) => {
    if (
      ~path.indexOf(PPx.Extract("%'temp'")) &&
      ~path.indexOf(PPx.Extract('%*getcust(S_ppm#global:cache)'))
    ) {
      PPx.Execute(`%"ppx-plugin-manager"%I"Error: Not ppm management file%bn%bn${path}"`);
      PPx.Quit(-1);
    }
  };
  const util = {};
  util.script = (() => {
    const path = PPx.ScriptName.replace(/\//g, '\\');
    return {
      name: PPx.Extract(`%*name(C,${path})`),
      path: PPx.Extract(`%*name(D,${path})`)
    };
  })();
  util.quitMsg = function () {
    const args = [].slice.call(arguments);
    const nl = this.newline || NL_CHAR;
    PPx.Echo(`${util.script.name}: ${args.join(nl)}`);
    PPx.Quit(-1);
  };
  util.error = (method) => {
    PPx.Execute(`*script "${ecma}\\errors.js",${method},${PPx.ScriptName}`);
    PPx.Quit(-1);
  };
  util.log = (msg, newline) => {
    const testrun = typeof ppm_test_run !== 'undefined' ? ppm_test_run : 0;
    if (typeof newline !== 'undefined') {
      newline = '%' + newline.metaNewline('ppx') + (testrun > 0 ? '[Log] ' : '');
      msg = msg.join(newline);
    }
    if (testrun > 0) {
      return testrun >= 2 && PPx.Execute('*execute B,*linemessage [Log] ' + msg);
    }
    const logview = PPx.Extract('%*getcust(X_combos)').slice(28, 29) === '1';
    const useppb = !logview && PPx.Extract('%NB') !== '' ? '*execute B,' : '*execute ,';
    return PPx.Execute(useppb + '*linemessage ' + msg);
  };
  util.fileexists = (filepath) =>
    PPx.Execute('*ifmatch "o:e,a:d-",' + filepath + '%:*stop') === 0 ? false : true;
  //NOTE: PPx.Extract('%*extract(ID,"macro")') is slow. Avoid using as much as possible
  util.extract = (ppxid, macro) => {
    return sort_ppx_process(ppxid)
      ? PPx.Extract(`%*extract("${macro}")`)
      : PPx.Extract(`%*extract(${ppxid},"${macro}")`);
  };
  //NOTE: ridiculously slow.
  util.extractJS = (ppxid, macro) =>
    sort_ppx_process(ppxid)
      ? PPx[macro]
      : PPx.Extract(`%*extract(${ppxid},"%%*js(PPx.result=PPx.${macro};)")`);
  util.expand = (ppxid, command) => {
    let exitcode;
    if (typeof ppm_test_run !== 'undefined' && ppm_test_run <= 2) {
      ppm_test_run === 2 &&
        PPx.Execute(`*execute B,*linemessage %%bx1b[2F[Expand] ${ppxid}, %(${command}%)`);
      return '1';
    }
    if (sort_ppx_process(ppxid)) {
      exitcode = PPx.Extract(`%*extract("${command}%%&0")`);
    } else {
      PPx.Execute(`*execute ${ppxid},${command}%%&*string u,ppm_util_expand=0`);
      PPx.Execute('*wait 0,1');
      exitcode = PPx.Extract('%su"ppm_util_expand"');
      PPx.Execute('*deletecust _User:ppm_util_expand');
    }
    return exitcode === '0' ? 0 : 1223;
  };
  util.execute = (ppxid, command) => {
    if (typeof ppm_test_run !== 'undefined' && ppm_test_run <= 2) {
      return (
        ppm_test_run === 2 &&
        PPx.Execute(`*execute B,*linemessage %%bx1b[2F[Execute] ${ppxid}, %(${command}%)`)
      );
    }
    return sort_ppx_process(ppxid)
      ? PPx.Execute(`*execute ,${command}`)
      : PPx.Execute(`*execute ${ppxid},${command}`);
  };
  util.setc = (item) => PPx.Execute(`*setcust ${item}`);
  util.getc = (item) => PPx.Extract(`%*getcust(${item})`);
  util.lib = function () {
    const args = [].slice.call(arguments);
    const path = `${ecma}\\${this.name}.js`;
    if (!util.fileexists(path)) return util.quitMsg(`Not exist ${path}`);
    return PPx.Execute(`*script "${path}",${args}`);
  };
  util.reply = function () {
    const args = [].slice.call(arguments);
    const path = `${ecma}\\${this.name}.js`;
    if (!util.fileexists(path)) return util.quitMsg(`Not exist ${path}`);
    return PPx.Extract(`%*script("${path}",${args})`);
  };
  util.print = function () {
    const args = [].slice.call(arguments);
    const linefeed = PPx.Extract('%*getcust(S_ppm#user:newline)');
    const tab = this.tab || 8;
    PPx.Execute(
      `*${this.cmd} -utf8bom -${linefeed} -tab:${tab} -k *editmode -modify:silent %%: *setcaption ${
        this.title
      }%%: *insert ${args.join(linefeed.metaNewline('ppx'))}`
    );
  };
  util.printw = function () {
    const args = [].slice.call(arguments);
    const linefeed = PPx.Extract('%*getcust(S_ppm#user:newline)');
    const tab = this.tab || 8;
    const path = PPx.Extract('%*temp()%\\printw.txt');
    util.write.apply({filepath: path, newline: linefeed}, args);
    PPx.Execute(
      `*${this.cmd} -utf8bom -${linefeed} -tab:${tab} ${path} -k *editmode -modify:silent %%: *setcaption ${this.title}`
    );
  };
  util.esconv = (notation, text) => {
    const reg = {
      esc: /./g,
      norm: /\\./g
    }[notation];
    return text.replace(reg, (match) => match.metaRegexp('notation') || match);
  };
  util.linefeedback = (data) => {
    const r = data.indexOf('\r');
    const n = data.indexOf('\n');
    // could not find newline code
    if (r === n) return '';
    if (n === -1) return '\r';
    if (r === -1) return '\n';
    if (r + 1 == n) return '\r\n';
    return r < n ? '\r' : '\n';
  };
  util.readLines = (filepath, newline) => {
    let data, data_, datalines;
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    try {
      st.LoadFromFile(filepath);
      data = st.ReadText(-1);
      data_ = data.slice(0, 500);
      size = st.Size;
    } catch (_err) {
      return {data: [], newline: '', size: 0};
    } finally {
      st.Close;
    }
    const linefeed = newline || util.linefeedback(data_) || '\n';
    datalines = data.split(linefeed);
    if (datalines.length === 0) return {data: [], newline: '', size: 0};
    if (datalines[datalines.length - 1] === '') datalines.pop();
    return {data: datalines, newline: linefeed, size: size};
  };
  util.append = function () {
    path_restrictions(this.filepath);
    const lines = util.readLines(this.filepath, this.newline);
    const args = [].slice.call(arguments);
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LineSeparator = lines.newline.metaNewline('ansi');
    st.LoadFromFile(this.filepath);
    if (this.ignoreempty) {
      const baseByte = lines.newline === '\r\n' ? 2 : 1;
      let omitByte = 0;
      for (let i = lines.data.length; i--; ) {
        if (lines.data[i] !== '') {
          if (lines.data.length - 1 === i) {
            omitByte = 0;
          }
          break;
        }
        omitByte = omitByte + baseByte;
      }
      st.Position = lines.size - omitByte;
    } else {
      st.Position = lines.size;
    }
    st.SetEOS;
    try {
      st.WriteText(args.join(lines.newline), 1);
      st.SaveToFile(this.filepath, 2);
    } catch (err) {
      PPx.Echo(err);
      PPx.Quit(1);
    } finally {
      st.Close;
    }
  };
  util.write = function () {
    path_restrictions(this.filepath);
    const args = [].slice.call(arguments);
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LineSeparator = this.newline.metaNewline('ansi');
    try {
      st.WriteText(args.join(this.newline.metaNewline('esc')), 1);
      st.SaveToFile(this.filepath, 2);
    } catch (err) {
      PPx.Echo(err);
      PPx.Quit(1);
    } finally {
      st.Close;
    }
  };
  util.input = function () {
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
  util.auxlocalpath = (wd) =>
    wd.replace(/^aux:([\\/]{2})?[MS]_[^\\/]+[\\/](.*)/, (_p0, p1, p2) =>
      typeof p1 === 'undefined' ? p2 : ''
    );
  util.basepath = (filepath) => {
    if (!util.fileexists(filepath)) return '';
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
  util.interactive = (title, msg) => {
    if (typeof ppm_test_run !== 'undefined' && ppm_test_run <= 2) {
      ppm_test_run === 2 && PPx.Execute(`*execute B,*linemessage [interactive] ${title}: ${msg}`);
      return true;
    }
    return PPx.Execute(`%OC %"${title}"%Q"${msg}"`) === 0;
  };
  return util;
})();
