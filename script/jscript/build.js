//!*script
/**
 * Build part of config and write it out
 *
 * @return Error message
 * @arg 0 Plugin name
 * @arg 1 Specify build source, def | user
 * @arg 2 If nonzero, dry run
 */

// Linefeed code for output file
var NEWLINE = '\r\n';

/* Initial */
// Read module
var st = PPx.CreateObject('ADODB.stream');
var module = function (filepath) {
  var data;

  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(filepath);
  data = st.ReadText(-1);
  st.Close;

  return Function(' return ' + data)();
};

// Load module
var util = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\util.js'));
var plugin = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\plugin.js'));
module = null;

var g_args = (function (args) {
  var len = args.length;

  if (len < 2) {
    util.error('arg');
  }

  var pluginName = args.item(0);
  var pluginDir = util.getc('S_ppm#plugins:' + pluginName);

  if (pluginDir === '') {
    PPx.Result = '[NotInstalled]';
    PPx.Quit(1);
  }

  var outputDir = util.getc('S_ppm#global:cache') + '\\ppm';
  var filename = pluginName + '.cfg';
  var source = args.item(1);
  var sourcePath = {
    def: pluginDir + '\\setting\\patch.cfg',
    user: util.getc('S_ppm#global:cache') + '\\config\\' + filename
  }[source];

  if (typeof sourcePath === 'undefined') {
    util.quitMsg('Invalid PPx.Arguments.Item(1)\nSpecify build source, "def" of "user"');
  }

  var output1 = len > 2 && args.item(2) !== '0' ? 'dryrun' : outputDir + '\\setup\\' + filename;
  var output2 = outputDir + '\\unset\\' + filename;
  var output3 = outputDir + '\\unset\\linecust.cfg';

  return {
    name: pluginName,
    source: source,
    basePath: pluginDir + '\\setting\\base.cfg',
    patchPath: sourcePath,
    setupPath: output1,
    unsetPath: output2,
    linecustPath: output3
  };
})(PPx.Arguments());

/* Checking existence of the files */
(function (args) {
  var notExists = util.reply.call({name: 'exists'}, 'path', args.basePath, args.patchPath);

  if (notExists !== '') {
    PPx.Result = 'Not Exists:,' + notExists;
    PPx.Quit(1);
  }
})(g_args);

// Tables & prorerties to de deleted
var g_unsetLines = [];

/* Extract patches from the patch file */
var g_patches = (function (path, unsets) {
  var result = {rep: {}, conv: {}, section: [], linecust: [], unset: []};
  var patchLines = util.lines(path).data;
  var thisLine, thisProp;
  var skip = false;

  var func = function (obj) {
    var reg = {
      rep: /^[@|$]([^\s=,]+)\s*[=,]\s*(.*)/,
      conv: /^(\?[^\s=,]+)\s*[=,]\s*(.*)/
    }[obj];

    skip = false;
    thisLine.replace(reg, function (_p0, p1, p2) {
      thisProp = {key: p1, value: p2};
    });

    if (thisProp.value === '' && obj === 'rep') {
      result[obj][thisProp.key] = null;
      return;
    }

    skip = true;
    result[obj][thisProp.key] = thisProp.value;
    return result;
  };

  var sect = function () {
    var prop = {key: '', value: ''};
    var skip = false;
    var reg1 = /^([^\s-=,]+)\s*[=,]\s*(.*)$/;

    for (i++; i < l; i++) {
      thisLine = patchLines[i];

      if (thisLine === '[endsection]') {
        return;
      }

      if (thisLine.indexOf('}') === 0) {
        result.section.push('}');
        !skip && unsets.push('}');
        skip = false;
        continue;
      }

      if (thisLine.indexOf(';') === 0 || thisLine === '') {
        continue;
      }

      if (
        thisLine.indexOf('--') === 0 ||
        thisLine.indexOf(' ') === 0 ||
        thisLine.indexOf('\t') === 0
      ) {
        result.section.push(thisLine);
        continue;
      }

      if (thisLine.indexOf('-') === 0) {
        thisLine.slice(1).replace(reg1, function (_p0, p1, p2) {
          prop = {key: p1, value: p2};
        });

        result.unset.push(prop.key);
        unsets.push('-|' + prop.key + ' =');

        if (prop.value.indexOf('{') === 0) {
          result.section.push(prop.key + ' = ' + prop.value);
          skip = true;
        }

        continue;
      }

      thisLine.replace(reg1, function (_p0, p1, p2) {
        prop = {key: p1, value: p2};
      });

      if (prop.value.indexOf('{') === 0) {
        result.section.push(thisLine);
        !skip && unsets.push(thisLine);
        continue;
      }

      result.section.push(thisLine);
      !skip && unsets.push('-|' + prop.key + ' =');
    }

    return result;
  };

  // Main loop of the patch
  for (var i = 0, l = patchLines.length; i < l; i++) {
    thisLine = patchLines[i];

    if (thisLine.indexOf(';') === 0 || thisLine === '') {
      continue;
    }

    if (skip && (thisLine.indexOf(' ') === 0 || thisLine.indexOf('\t') === 0)) {
      result.rep[thisProp.key] = result.rep[thisProp.value] + NEWLINE + '\t' + thisLine;
      continue;
    }

    if (thisLine.indexOf('@') === 0 || thisLine.indexOf('$') === 0) {
      func('rep');
      continue;
    }

    if (thisLine.indexOf('?') === 0) {
      func('conv');
      continue;
    }

    skip = false;

    if (thisLine === '[section]') {
      sect();
    }

    if (thisLine === '[linecust]') {
      for (i++; i < l; i++) {
        thisLine = patchLines[i];

        if (thisLine.indexOf(';') === 0 || thisLine === '') {
          continue;
        }

        if (thisLine === '[endlinecust]') {
          break;
        }

        result.linecust.push(thisLine);
      }
    }
  }

  return result;
})(g_args.patchPath, g_unsetLines);

/* Conversion processing of string */
var g_baseLines = (function (base, patches) {
  var result = [];
  var lines = util.lines(base).data;
  var reg1 = /\[\?[^:]+:[^\]]+\]/;
  var reg2 = /\?[^:]+/g;
  var thisLine, thisMatch, thisPatch;
  var match = {};

  var assembly = function (label, value) {
    var reg2 = RegExp('\\[\\' + label + ':([^\\]]+)]', 'g');
    return thisLine.replace(reg2, value);
  };

  for (var i = 0, l = lines.length; i < l; i++) {
    thisLine = lines[i];

    if (thisLine.indexOf(';') === 0 || thisLine === '') {
      continue;
    }

    if (reg1.test(thisLine)) {
      match = thisLine.match(reg2);
      for (var j = 0, k = match.length; j < k; j++) {
        thisMatch = match[j];
        thisPatch = patches.conv[thisMatch];
        thisLine =
          typeof thisPatch === 'undefined'
            ? assembly(thisMatch, '$1')
            : assembly(thisMatch, thisPatch);
      }
    }

    result.push(thisLine);
  }

  return result;
})(g_args.basePath, g_patches);

/* Merge patches with the contents of base file */
var mergeLines = (function (name, source, lines, patches, unsets, linecustpath) {
  var result = {};
  var unsetLines = {};

  result['set'] = (function () {
    var setLines = [];
    var thisProp = {};
    var thisTable = {};
    var skip = false;
    var thisLine;

    //Process merge of lines
    var cleateLines = function (chr) {
      var reg = {
        '@': /^@default:(\S+)\s*=\s*(.*)/,
        '$': /^\$replace:(\S+)\s*(.*)/
      }[chr];
      var cmdline = {
        '@': function (table, key) {
          setLines.push(key + ' = ' + patches.rep[key]);
          unsetLines[table].push('-|' + key + ' =');
        },
        '$': function (table, key, value) {
          setLines.push(patches.rep[key] + ' ' + value);
          unsetLines[table].push('-|' + patches.rep[key] + ' =');
        }
      }[chr];
      var thisKey, thisValue;

      for (var item in patches.rep) {
        skip = false;

        if (Object.prototype.hasOwnProperty.call(patches.rep, item)) {
          thisLine.replace(reg, function (_p0, p1, p2) {
            thisKey = p1;
            thisValue = p2;
            return;
          });

          if (patches.rep[thisKey] === null) {
            setLines.push(thisKey + ' = ' + thisValue);
            unsetLines[thisTable.key].push('-|' + thisKey + ' =');
            return;
          }

          if (thisKey === item) {
            cmdline(thisTable.key, thisKey, thisValue);
            delete patches.rep[thisKey];
            return;
          }
        }
      }

      skip = true;
    };

    // for table
    var reg1 = /^(?:-\|)?([^\s=-]+)\s*=\s*(.*)$/;

    // for property
    var reg2 = /^([^\s=,-]+)\s*([=,]\s*.*)$/;

    // Main loop of the build
    for (var i = 0, l = lines.length; i < l; i++) {
      thisLine = lines[i];

      if (thisLine.indexOf(';') === 0 || thisLine === '') {
        continue;
      }

      lines[i].replace(reg1, function (_p0, p1, p2) {
        thisTable = {key: p1, value: p2};
        return;
      });

      if (thisTable.value.indexOf('{') === 0) {
        // Table label
        setLines.push(thisTable.key + ' = ' + thisTable.value);
        unsetLines[thisTable.key] = [thisTable.value];

        for (i++; i < l; i++) {
          thisLine = lines[i];

          if (thisLine.indexOf('}') === 0) {
            setLines.push('}');
            unsetLines[thisTable.key].push('}');
            break;
          }

          if (thisLine.indexOf(';') === 0 || thisLine === '') {
            continue;
          }

          if (
            !skip &&
            (thisLine.indexOf('--') === 0 ||
              thisLine.indexOf(' ') === 0 ||
              thisLine.indexOf('\t') === 0)
          ) {
            setLines.push(thisLine);
            continue;
          }

          if (thisLine.indexOf('@default:') === 0) {
            cleateLines('@');
            continue;
          }

          if (thisLine.indexOf('$replace:') === 0) {
            cleateLines('$');
            continue;
          }

          thisLine.replace(reg2, function (_p0, p1, p2) {
            thisProp = {key: p1, value: p2};
            return;
          });

          if (typeof thisProp.value !== 'undefined') {
            PPx.Echo('createlines undefined: ' + thisProp.key);
            setLines.push(thisProp.key + ' ' + thisProp.value);
            unsetLines[thisTable.key].push('-|' + thisProp.key + ' =');
            skip = true;
          }
        }

        continue;
      }

      //Property not table element
      thisLine.indexOf('-|') === 0 ? setLines.push(thisLine.slice(2)) : setLines.push(thisLine);
    }

    return setLines.concat(g_patches.section);
  })();

  result['unset'] = (function () {
    var array = [];

    for (var line in unsetLines) {
      if (Object.prototype.hasOwnProperty.call(unsetLines, line)) {
        if (~patches.unset.indexOf(line)) {
          delete unsetLines[line];
          continue;
        }

        unsetLines[line].shift();
        array = array.concat(line + ' = {', unsetLines[line]);
      }
    }

    return unsets.concat(array);
  })();

  result['linecust'] = (function () {
    var linecusts = [];
    var lines = util.lines(linecustpath).data;

    if (source === 'user') {
      var thisLine;
      var reg = /^([^,]+,[^:]+:[^=,]+[=,]).*/;

      for (var i = 0, l = patches.linecust.length; i < l; i++) {
        thisLine = patches.linecust[i];

        if (typeof thisLine !== 'undefined') {
          thisLine_ = thisLine.replace(reg, name + '=$1');
          if (!~lines.indexOf(thisLine_)) {
            linecusts.push(thisLine_);
          }
        }
      }
    }

    return linecusts;
  })();

  return result;
})(g_args.name, g_args.source, g_baseLines, g_patches, g_unsetLines, g_args.linecustPath);

if (g_args.setupPath === 'dryrun') {
  (function (name) {
    PPx.Echo('[Build setup ' + name + '.cfg]\n\n' + mergeLines.set.join(NEWLINE));
    PPx.Echo('[Build unset ' + name + '.cfg]\n\n' + mergeLines.unset.join(NEWLINE));

    var setline = g_patches.linecust;
    var unsetline = mergeLines.linecust;
    setline.length !== 0 && PPx.Echo('[Linecust ' + name + ']\n\nset: \n' +
      setline.join(NEWLINE) + '\n\nunset: \n' +
      unsetline.join(NEWLINE));

    PPx.Quit(1);
  })(g_args.name);
}

/* Make part of PPxcfg */
var save = function (data, savefile, load) {
  st.open;

  if (load === 1) {
    st.LoadFromFile(savefile);
    st.Position = st.Size;
    st.SetEOS;
  } else {
    st.Position = 0;
  }

  st.WriteText(data.join(NEWLINE), 1);
  st.SaveToFile(savefile, 2);
  st.Close;
  PPx.Execute('*wait 10');
};

// File to add plugin settings
save(mergeLines.set, g_args.setupPath, 0);

// File to delete plugin settings
save(mergeLines.unset, g_args.unsetPath, 0);

// File to delete linecust settinges
(function (add, del, filepath) {
  if (add.length !== 0) {
    PPx.Execute(plugin.addline.apply({}, add));
  }

  if (del.length !== 0) {
    save(del, filepath, 1);
  }
})(g_patches.linecust, mergeLines.linecust, g_args.linecustPath);
