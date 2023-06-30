(function () {
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = (function (Object, max, min) {
      return function indexOf(member, fromIndex) {
        if (this === null || this === undefined)
          throw TypeError('Array.prototype.indexOf called on null or undefined');
        var that = Object(this),
          Len = that.length >>> 0,
          i = min(fromIndex | 0, Len);
        if (i < 0) i = max(0, Len + i);
        else if (i >= Len) return -1;
        if (member === void 0) {
          for (; i !== Len; ++i) if (that[i] === void 0 && i in that) return i;
        } else if (member !== member) {
          return -1;
        } else for (; i !== Len; ++i) if (that[i] === member) return i;
        return -1;
      };
    })(Object, Math.max, Math.min);
  }
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
  var NL_CHAR = '\r\n';
  var jscript = PPx.Extract('%*getcust(S_ppm#global:ppm)') + '\\lib\\jscript';
  var processID = PPx.WindowIDName.slice(0, 1);
  var sort_ppx_process = function (ppxid) {
    ppxid = ppxid.toUpperCase().slice(0, 1);
    if (ppxid === processID) {
      return true;
    }
    return /^[^CV]/.test(ppxid);
  };
  var path_restrictions = function (path) {
    if (
      ~path.indexOf(PPx.Extract("%'temp'")) &&
      ~path.indexOf(PPx.Extract('%*getcust(S_ppm#global:cache)'))
    ) {
      PPx.Execute('%"ppx-plugin-manager"%I"Error: Not ppm management file%bn%bn' + path + '"');
      PPx.Quit(-1);
    }
  };
  var util = {};
  util.script = (function () {
    var path = PPx.ScriptName.replace(/\//g, '\\');
    return {
      name: PPx.Extract('%*name(C,' + path + ')'),
      path: PPx.Extract('%*name(D,' + path + ')')
    };
  })();
  util.quitMsg = function () {
    var args = [].slice.call(arguments);
    var nl = this.newline || NL_CHAR;
    PPx.Echo(util.script.name + ': ' + args.join(nl));
    ppm_test_run === 'undefined' && PPx.Quit(exitcode);
  };
  util.error = function (method) {
    PPx.Execute('*script "' + jscript + '\\errors.js",' + method + ',' + PPx.ScriptName);
    PPx.Quit(-1);
  };
  util.log = function (msg, newline) {
    var testrun = typeof ppm_test_run !== 'undefined' ? ppm_test_run : 0;
    if (typeof newline !== 'undefined') {
      newline = '%' + newline.metaNewline('ppx') + (testrun > 0 ? '[Log] ' : '');
      msg = msg.join(newline);
    }
    if (testrun > 0) {
      return testrun >= 2 && PPx.Execute('*execute B,*linemessage [Log] ' + msg);
    }
    var logview = PPx.Extract('%*getcust(X_combos)').slice(28, 29) === '1';
    var useppb = !logview && PPx.Extract('%NB') !== '' ? '*execute B,' : '*execute ,';
    return PPx.Execute(useppb + '*linemessage ' + msg);
  };
  util.fileexists = function (filepath) {
    return PPx.Execute('*ifmatch "o:e,a:d-",' + filepath + '%:*stop') === 0 ? false : true;
  };
  util.extract = function (ppxid, macro) {
    return sort_ppx_process(ppxid)
      ? PPx.Extract('%*extract("' + macro + '")')
      : PPx.Extract('%*extract(' + ppxid + ',"' + macro + '")');
  };
  util.extractJS = function (ppxid, macro) {
    sort_ppx_process(ppxid)
      ? PPx[macro]
      : PPx.Extract('%*extract(' + ppxid + ',"%%*js(PPx.Result=PPx.' + macro + ';)")');
  };
  util.expand = function (ppxid, command) {
    var exitcode;
    if (typeof ppm_test_run !== 'undefined' && ppm_test_run <= 2) {
      ppm_test_run === 2 &&
        PPx.Execute('*execute B,*linemessage %%bx1b[2F[Expand]' + ppxid + ', %(' + command + '%)');
      return '1';
    }
    if (sort_ppx_process(ppxid)) {
      exitcode = PPx.Extract('%*extract("' + command + '%%&0")');
    } else {
      PPx.Execute('*execute ' + ppxid + ',' + command + '%%&*string u,ppm_util_expand=0');
      PPx.Execute('*wait 0,1');
      exitcode = PPx.Extract('%su"ppm_util_expand"');
      PPx.Execute('*deletecust _User:ppm_util_expand');
    }
    return exitcode === '0' ? 0 : 1223;
  };
  util.execute = function (ppxid, command) {
    if (typeof ppm_test_run !== 'undefined' && ppm_test_run <= 2) {
      return (
        ppm_test_run === 2 &&
        PPx.Execute('*execute B,*linemessage %%bx1b[2F[Execute]' + ppxid + ', %(' + command + '%)')
      );
    }
    return sort_ppx_process(ppxid)
      ? PPx.Execute('*execute ,' + command)
      : PPx.Execute('*execute ' + ppxid + ',' + command);
  };
  util.setc = function (item) {
    return PPx.Execute('*setcust ' + item);
  };
  util.getc = function (item) {
    return PPx.Extract('%*getcust(' + item + ')');
  };
  util.lib = function () {
    var args = [].slice.call(arguments);
    var path = jscript + '\\' + this.name + '.js';
    if (!util.fileexists(path)) return util.quitMsg('Not exist ' + path);
    return PPx.Execute('*script "' + path + '",' + args);
  };
  util.reply = function () {
    var args = [].slice.call(arguments);
    var path = jscript + '\\' + this.name + '.js';
    if (!util.fileexists(path)) return 'Not exist ' + path;
    return PPx.Extract('%*script("' + path + '",' + args + ')');
  };
  util.print = function () {
    var args = [].slice.call(arguments);
    var linefeed = PPx.Extract('%*getcust(S_ppm#user:newline)');
    var tab = this.tab || 8;
    PPx.Execute(
      '*' +
        this.cmd +
        ' -utf8bom -' +
        linefeed +
        ' -tab:' +
        tab +
        ' -k %(*editmode -modify:silent -modify:readonly%:*setcaption ' + this.title +
        '%: *insert ' + args.join(linefeed.metaNewline('ppx')) + '%)'
    );
  };
  util.printw = function () {
    var args = [].slice.call(arguments);
    var linefeed = PPx.Extract('%*getcust(S_ppm#user:newline)');
    var tab = this.tab || 8;
    var path = PPx.Extract('%*temp()%\\printw.txt');
    util.write.apply({filepath: path, newline: linefeed}, args);
    PPx.Execute(
      '*' +
        this.cmd +
        ' -utf8bom -' +
        linefeed +
        ' -tab:' +
        tab +
        ' ' +
        path +
        ' -k %(*editmode -modify:silent -modify:readonly%:*setcaption ' +
        this.title + '%)'
    );
  };
  util.esconv = function (notation, text) {
    var reg = {
      esc: /./g,
      nor: /\\./g
    }[notation];
    return text.replace(reg, function (match) {
      return match.metaRegexp('notation') || match;
    });
  };
  util.linefeedback = function (data) {
    var r = data.indexOf('\r');
    var n = data.indexOf('\n');
    // could not find newline code
    if (r === n) return '';
    if (n === -1) return '\r';
    if (r === -1) return '\n';
    if (r + 1 == n) return '\r\n';
    return r < n ? '\r' : '\n';
  };
  util.readLines = function (filepath, newline) {
    var data, data_, datalines;
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
    var linefeed = newline || util.linefeedback(data_) || NL_CHAR;
    datalines = data.split(linefeed);
    if (datalines.length === 0) return {data: [], newline: '', size: 0};
    if (datalines[datalines.length - 1] === '') datalines.pop();
    return {data: datalines, newline: linefeed, size: size};
  };
  util.append = function () {
    path_restrictions(this.filepath);
    var lines = util.readLines(this.filepath, this.newline);
    var args = [].slice.call(arguments);
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LineSeparator = lines.newline.metaNewline('ansi');
    st.LoadFromFile(this.filepath);
    if (this.ignoreblank) {
      var baseByte = lines.newline === '\r\n' ? 2 : 1;
      var omitByte = 0;
      for (var i = lines.data.length; i--; ) {
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
    var args = [].slice.call(arguments);
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
    var rep = {
      0: [/"/g, {'"': '""'}],
      1: [/["%]/g, {'"': '""', '%': '%%'}]
    }[this.type || 0];
    var text = this.text || '';
    var title = this.title || 'input.js';
    var mode = this.mode || 'g';
    var select = this.select || 'a';
    var postcmd = this.k ? ' -k ' + this.k : '';
    var result =
      PPx.Extract(
        '%*input(%("' +
          text +
          '" -title:"' +
          title +
          '"%) -mode:' +
          mode +
          ' -select:' +
          select +
          postcmd +
          ')'
      ) || PPx.Quit(-1);
    return result.replace(rep[0], function (c) {
      return rep[1][c];
    });
  };
  util.auxlocalpath = function (wd) {
    return wd.replace(/^aux:([\\/]{2})?[MS]_[^\\/]+[\\/](.*)/, function (_p0, p1, p2) {
      return typeof p1 === 'undefined' ? p2 : '';
    });
  };
  util.basepath = function (filepath) {
    if (!util.fileexists(filepath)) return '';
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-16LE';
    st.LoadFromFile(filepath);
    st.LineSeparator = -1;
    st.SkipLine = 1;
    var data = st.ReadText(-2);
    st.Close;
    return data.replace(/^;Base=(.*)\|\d*/, '$1');
  };
  util.interactive = function (title, msg) {
    if (typeof ppm_test_run !== 'undefined' && ppm_test_run <= 2) {
      ppm_test_run === 2 &&
        PPx.Execute('*execute B, *linemessage [interactive] ' + title + ': ' + msg);
      return true;
    }
    return PPx.Execute('%OC %"' + title + '"%Q"' + msg + '"') === 0;
  };
  util.jobstart = function (key) {
    if (PPx.getValue(key) === '1') PPx.Quit(1);
    PPx.setValue(key, '1');
    PPx.Execute('*job start');
  };
  util.jobend = function (key) {
    PPx.setValue(key, '');
    PPx.Execute('*job end');
  };
  return util;
})();
