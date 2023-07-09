(function () {
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
  var linecustItems = function (items, reg, label, value) {
    var result = {};
    var thisLabel;
    for (var i = 0, l = items.length; i < l; i++) {
      items[i].replace(reg, function (_p0, p1, p2, p3, p4) {
        thisLabel = label(p1, p2, p3, p4);
        if (typeof result[thisLabel] === 'undefined') {
          result[thisLabel] = [];
        }
        result[thisLabel].push(value(p1, p2, p3, p4));
      });
    }
    return result;
  };
  obj.complcode = function (format, data) {
    var fmt = {

      internal: {reg: /%/g, rep: {'%': '%%'}},
      cmd: {reg: /[%\n]/g, rep: {'%': '%%%%', '\n': '%%bn'}}
    }[format];
    return data.replace(fmt.reg, function (c) {
      return fmt.rep[c];
    });
  };
  obj.linefeedback = function (data) {
    var codes = ['\r\n', '\n', '\r'];
    for (var i = 0, l = codes.length; i < l; i++) {
      if (~data.indexOf(codes[i])) return codes[i];
    }
    return '\r\n';
  };
  obj.readLines = function (filepath) {
    if (typeof util === 'object' && typeof util.readLines === 'function') {
      return util.readLines(filepath);
    }
    var data, data_;
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
    var linefeed = obj.linefeedback(data_);
    data_ = data.split(linefeed);
    if (data_.length === 0) {
      return {newline: '', data: ''};
    }
    if (data_[data_.length - 1] === '') {
      data_.pop();
    }
    return {newline: linefeed, data: data_};
  };
  obj.unsetLines = function (name, dryrun) {
    var cfgPath = PPx.Extract('%*getcust(S_ppm#global:cache)') + '\\ppm\\unset\\' + name + '.cfg';
    var filepath = PPx.Extract('%*getcust(S_ppm#global:cache)') + '\\ppm\\unset\\linecust.cfg';
    var deleteLine = obj.delCmdline.call({name: name, path: filepath});
    if (dryrun !== 0) {
      return cfgPath + (deleteLine.omit ? '\n' + deleteLine.omit : '');
    }

    PPx.Execute('*setcust @' + cfgPath);
    deleteLine.set && PPx.Execute(deleteLine.set);
  };
  obj.addCmdline = function () {
    var args = [].slice.call(arguments);
    var result = [];
    var linefeed = '%%bn';
    var reg = /^([^,]+),([^:]+:)([^,=]+[,=])(.*)/;
    var delim = '@#=#@';
    var label = function (_p1, p2, p3, _p4) {
      return p2 + p3.toUpperCase();
    };
    var value = function (p1, _p2, _p3, p4) {
      return '%%m' + p1 + delim + p4;
    };
    var items = linecustItems(args, reg, label, value);
    var queue, thisItem;
    for (var item in items) {
      if (Object.prototype.hasOwnProperty.call(items, item)) {
        queue = PPx.Extract('%*getcust(' + item + ')');
        if (queue !== '') {
          linefeed = obj.linefeedback(queue);
          queue = obj.complcode('internal', queue);
        }
        for (var i = 0, l = items[item].length; i < l; i++) {
          thisItem = items[item][i].split(delim);
          if (i === 0) {
            if (queue === '') {
              result.push('*setcust ' + item + thisItem.join(' '));
              continue;
            }
            result.push('*setcust ' + item + queue);
          }
          if (~queue.indexOf(thisItem[0])) {
            continue;
          }
          result.push(thisItem.join(' '));
        }
      }
    }
    return result.length !== 0 ? '%OC ' + result.join(linefeed + '\t') : '';
  };
  obj.delCmdline = function () {
    var args = [].slice.call(arguments);
    var reg = /^([^=]+)=([^,]+),([^:]+:)([^,=]+[,=])/;
    var data = (function (path) {
      if (typeof path === 'undefined') {
        return args;
      }
      return PPx.Extract(
        '%*script("%*getcust(S_ppm#global:ppm)\\lib\\jscript\\exists.js",path,file,' + path + ')'
      ) !== ''
        ? args
        : obj.readLines(path).data;
    })(this.path);
    var lines = (function (name) {
      var result = [];
      if (typeof name === 'undefined') {
        return data;
      }
      for (var i = 0, l = data.length; i < l; i++) {
        var thisData = data[i];
        if (thisData.indexOf(name) === 0) {
          result.push(thisData);
        }
      }
      return result;
    })(this.name);
    if (lines.length === 0) {
      return '';
    }
    var label = function (_p1, _p2, p3, p4) {
      return p3 + p4.toUpperCase();
    };
    var value = function (_p1, p2, _p3, _p4) {
      return p2;
    };
    var items = linecustItems(lines, reg, label, value);
    var omits = [];
    var cmdline = (function () {
      var result = [];
      var thisLine, thisItem, linefeed, queue, queue_;
      for (var item in items) {
        if (Object.prototype.hasOwnProperty.call(items, item)) {
          omits.push(item);
          queue = PPx.Extract('%*getcust(' + item + ')');
          if (queue === '') {
            break;
          }
          linefeed = obj.linefeedback(queue);
          queue_ = linefeed !== '' ? queue.split(linefeed) : [queue];
          for (var l = queue_.length; l--; ) {
            thisLine = queue_[l];
            for (var k = items[item].length; k--; ) {
              thisItem = '%m' + items[item][k];
              if (~thisLine.indexOf(thisItem)) {
                queue_.splice(l, 1);
                items[item].splice(k, 1);
                omits.push(thisItem);
                break;
              }
            }
          }
          result.push('*setcust ' + item + obj.complcode('internal', queue_.join(linefeed)));
        }
      }
      return result.length !== 0 ? '%OC ' + result : '';
    })();
    return {set: cmdline, omit: omits.join(' ')};
  };
  return obj;
})();
