//!*script
/**
 * Manipulate lines in an UTF8 encoded file
 *
 * @version 1.0
 * @arg 0 Target file path
 * @arg 1 Specify the method for the line, delete | replace
 * @arg 2 Character string to start-line the operation
 * @arg 3 Character string to end-line the operation
 * @arg 4+ Comma separated text-lines
 */

var script_name = PPx.scriptName;

var errors = function (method) {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var len = args.length;
  if (len < 4) {
    errors('arg');
  }

  var path = args.item(0);

  if (
    !~path.indexOf(PPx.Extract('%*getcust(S_ppm#global:cache)')) &&
    !~path.indexOf(PPx.Extract("%'temp'"))
  ) {
    PPx.Execute('%"ppx-plugin-manager"%I"Error: Not ppm management file%bn%bn' + path + '"');
    PPx.Quit(-1);
  }

  var array = [];

  for (var i = 4; i < len; i++) {
    array.push(args.item(i));
  }

  return {
    filepath: path,
    method: args.item(1),
    start: args.item(2),
    end: args.item(3),
    methodArg: array
  };
})(PPx.Arguments);

var result = function (args, callback) {
  var st = PPx.CreateObject('ADODB.stream');
  var data, data_;
  var linefeed = '';
  var codes = ['\r\n', '\n', '\r'];
  var ad = {'\n': '10', '\r': '13', '\r\n': '-1'};

  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(args.filepath);
  data = st.ReadText(-1);
  data_ = data.slice(0, 100);
  st.Close;

  for (var i = 0, l = codes.length; i < l; i++) {
    linefeed = codes[i];
    if (~data_.indexOf(linefeed)) {
      break;
    }
  }

  var processedData = callback[args.method](args, data.split(linefeed), linefeed);

  st.Open;
  st.LineSeparator = ad[linefeed];
  st.WriteText(processedData, 1);
  st.SaveToFile(args.filepath, 2);
  st.Close;
};

var method = {};

// Delete specified line range
method['delete'] = function (args, lines, linefeed) {
  var result = [];
  var thisLine, saveLine;

  for (var i = 0, l = lines.length; i < l; i++) {
    thisLine = lines[i];
    if (~thisLine.indexOf(args.start)) {
      saveLine = thisLine;

      for (var j = i + 1, k = l; j < k; j++) {
        thisLine = lines[j];

        if (~thisLine.indexOf(args.start)) {
          result.push(saveLine);
          break;
        }

        if (~thisLine.indexOf(args.end)) {
          i = j;
          break;
        }
      }

      if (i === l && ~thisLine.indexOf(args.start)) {
        result.push(saveLine);
        break;
      }

      continue;
    }

    result.push(thisLine);
  }

  if (result[result.length - 1] === '') {
    result.pop();
  }

  return result.join(linefeed);
};

// Replace specified line range for specified string
method['replace'] = function (args, data, linefeed) {
  var result = [];
  var thisLine, saveLine;

  for (var i = 0, l = data.length; i < l; i++) {
    thisLine = data[i];

    if (~thisLine.indexOf(args.start)) {
      saveLine = thisLine;

      for (var j = i + 1, k = l; j < k; j++) {
        thisLine = data[j];

        if (~thisLine.indexOf(args.start)) {
          result.push(saveLine);
          break;
        }

        if (~thisLine.indexOf(args.end)) {
          i = j;
          result.push(args.methodArg.join(linefeed));
          break;
        }
      }

      if (j === k) {
        result.push(saveLine);
        break;
      }

      continue;
    }

    result.push(thisLine);
  }

  return result.join(linefeed);
};

PPx.Result = result(g_args, method);
