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
  var obj = {};
  var jscript = PPx.Extract('%*getcust(S_ppm#global:ppm)') + '\\lib\\jscript';
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
  obj.script = (function () {
    var path = PPx.ScriptName;
    return {
      name: PPx.Extract('%*name(C,' + path + ')'),
      path: PPx.Extract('%*name(D,' + path + ')')
    };
  })();
  obj.quitMsg = function (msg) {
    PPx.Echo(obj.script.name + '\r\n\r\n' + msg);
    PPx.Quit(-1);
  };
  obj.error = function (method) {
    PPx.Execute('*script "' + jscript + '\\errors.js",' + method + ',' + PPx.ScriptName);
    PPx.Quit(-1);
  };
  obj.fileexists = function (filepath) {
    return PPx.Execute('*ifmatch "o:e,a:d-",' + filepath + '%:*stop') === 0 ? false : true;
  };
  obj.setc = function (item) {
    return PPx.Execute('*setcust ' + item);
  };
  obj.getc = function (item) {
    return PPx.Extract('%*getcust(' + item + ')');
  };
  obj.plugScript = function (plug, scr) {
    return PPx.Extract('%*getcust(S_ppm#plugins:' + plug + ')') + '\\script\\' + scr + '.js';
  };
  obj.lib = function () {
    var args = [].slice.call(arguments);
    var path = jscript + '\\' + this.name + '.js';
    if (!obj.fileexists(path)) return obj.quitMsg('Not exist\n\n' + path);
    return PPx.Execute('*script "' + path + '",' + args);
  };
  obj.reply = function () {
    var args = [].slice.call(arguments);
    var path = jscript + '\\' + this.name + '.js';
    if (!obj.fileexists(path)) return 'Not exist: ' + path;
    return PPx.Extract('%*script("' + path + '",' + args + ')');
  };
  obj.print = function () {
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
        ' -k *editmode -modify:silent -modify:readonly %%: *setcaption ' +
        this.title +
        '%%: *insert ' +
        args.join(obj.metaNewline.ppx[linefeed])
    );
  };
  obj.printw = function () {
    var args = [].slice.call(arguments);
    var linefeed = PPx.Extract('%*getcust(S_ppm#user:newline)');
    var tab = this.tab || 8;
    var path = PPx.Extract('%*temp()%\\printw.txt');
    obj.write.apply({filepath: path, newline: linefeed}, args);
    PPx.Execute(
      '*' +
        this.cmd +
        ' -utf8bom -' +
        linefeed +
        ' -tab:' +
        tab +
        ' ' +
        path +
        ' -k *editmode -modify:silent -modify:readonly %%: *setcaption ' +
        this.title
    );
  };
  obj.esconv = function (format, text) {
    var reg = {
      esc: /./g,
      nor: /\\./g
    }[format];
    return text.replace(reg, function (match) {
      return obj.metaRegexp[format][match] || match;
    });
  };
  obj.linefeedback = function (data) {
    var codes = ['\r\n', '\n', '\r'];
    for (var i = 0, l = codes.length; i < l; i++) {
      if (~data.indexOf(codes[i])) return codes[i];
    }
    return '';
  };
  obj.readLines = function (filepath) {
    var data, data_;
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
    var linefeed = obj.linefeedback(data_);
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
    var args = [].slice.call(arguments);
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LineSeparator = obj.metaNewline.ansi[this.newline];
    st.WriteText(args.join(obj.metaNewline.esc[this.newline]), 1);
    st.SaveToFile(this.filepath, 2);
    st.Close;
  };
  obj.input = function () {
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
  obj.auxlocalpath = function (wd) {
    return wd.replace(/^aux:([\\/]{2})?[MS]_[^\\/]+[\\/](.*)/, function (_p0, p1, p2) {
      return typeof p1 === 'undefined' ? p2 : '';
    });
  };
  obj.basepath = function (filepath) {
    var data;
    if (!obj.fileexists(filepath)) return '';
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-16LE';
    st.LoadFromFile(filepath);
    st.LineSeparator = -1;
    st.SkipLine = 1;
    data = st.ReadText(-2);
    st.Close;
    return data.replace(/^;Base=(.*)\|\d*/, '$1');
  };
  return obj;
})();
