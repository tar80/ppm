//!*script
// deno-lint-ignore-file no-var
/**
 * Build part of config and write it out
 *
 * @return Error message
 * @arg 0 Plugin name
 * @arg 1 Specify build source, def | user
 * @arg 2 If nonzero, dry run
 */

var NL_CHAR = '\r\n';

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
var ppm = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\ppm.js'));
module = null;

var g_cfg = (function (args) {
  var len = args.length;

  if (len < 2) {
    util.error('arg');
  }

  var pluginName = args.Item(0).replace(/^@/, '');
  var disable = util.getc('S_ppm#plugins:@' + pluginName);
  var pluginDir = disable || util.getc('S_ppm#plugins:' + pluginName);

  if (pluginDir === '') {
    PPx.result = 'Not Installed ppx-plugin-manager.';
    PPx.Quit(1);
  }

  var baseDir = util.getc('S_ppm#global:cache') + '\\ppm';
  var userCfg = pluginName + '.cfg';
  var sourceCfg = args.Item(1);
  var source = {
    def: pluginDir + '\\setting\\patch.cfg',
    user: util.getc('S_ppm#global:cache') + '\\config\\' + userCfg
  }[sourceCfg];

  if (typeof source === 'undefined') {
    util.quitMsg('Invalid PPx.Arguments.Item(1)\nSpecify build source, "def" of "user"');
  }

  var setupCfg = len > 2 && args.item(2) !== '0' ? 'dryrun' : baseDir + '\\setup\\' + userCfg;
  var unsetCfg = baseDir + '\\unset\\' + userCfg;
  var linecustCfg = baseDir + '\\unset\\linecust.cfg';

  return {
    name: pluginName,
    source: sourceCfg,
    basePath: pluginDir + '\\setting\\base.cfg',
    sourcePath: source,
    setupPath: setupCfg,
    unsetPath: unsetCfg,
    linecustPath: linecustCfg
  };
})(PPx.Arguments);

/* Checking existence of the files */
(function (args) {
  var notExists = util.reply.call({name: 'exists'}, 'path', 'both', args.basePath, args.sourcePath);

  if (notExists !== '') {
    PPx.result = 'Not Exists:,' + notExists;
    PPx.Quit(1);
  }
})(g_cfg);

// Tables & prorerties to de deleted
var g_unsetLines = [];

/* Extract patches from the patch file */
var regStype = /%\*getcust\(S_ppm#global:scripttype\)/g;
var Stype = util.getc('S_ppm#global:scripttype');
var g_patches = (function (path, source, unsets) {
  var result = {rep: {}, conv: {}, section: [], linecust: [], unset: []};
  var patchLines = util.readLines(path).data;
  var skip = false;
  var thisProp = {};
  var thisLine;

  var regProp = {
    rep: /^[@|$]([^\s=,]+)\s*([=,])\s*(.*)/,
    conv: /^(\?[^\s=,]+)\s*([=,])\s*(.*)/
  };
  var repEx = /^\$([^\s=]+)[\s=]+(\^|\^\\|\\\^)j\s*/i;
  var getProp = function (form) {
    skip = false;

    if (thisLine.indexOf('$') === 0 && repEx.test(thisLine)) {
      thisLine = thisLine.replace(repEx, '$$$1 = $2V_H4A');
    }

    thisLine.replace(regProp[form], function (_p0, p1, p2, p3) {
      thisProp['key'] = p1;
      thisProp['sep'] = p2;
      thisProp['value'] = p3;
    });

    if (thisProp.value === '' && form === 'rep') {
      result[form][thisProp.key] = null;
      return;
    }

    skip = true;
    result[form][thisProp.key] =
      thisLine.indexOf('@') === 0 ? '\t' + thisProp.sep + ' ' + thisProp.value : thisProp.value;
    return result;
  };

  var regSect = /^([^\s-=,]+)\s*[=,]\s*(.*)$/;
  var getSect = function (i, l) {
    var prop = {key: '', value: ''};
    var skip = false;

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

      if (~thisLine.indexOf('%*getcust(S_ppm#global:scripttype)')) {
        thisLine = thisLine.replace(regStype, Stype);
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
        thisLine.slice(1).replace(regSect, function (_p0, p1, p2) {
          prop.key = p1;
          prop.value = p2;
        });

        result.unset.push(prop.key);
        unsets.push('-|' + prop.key + ' =');

        if (prop.value.indexOf('{') === 0) {
          result.section.push(prop.key + ' = ' + prop.value);
          skip = true;
        }

        continue;
      }

      thisLine.replace(regSect, function (_p0, p1, p2) {
        prop.key = p1;
        prop.value = p2;
      });

      if (prop.value.indexOf('{') === 0) {
        result.section.push(thisLine);
        !skip && unsets.push(thisLine);
        continue;
      }

      result.section.push(thisLine.replace(/^(\S+)\s*([,=])\s*(.*)/, '$1\t$2 $3'));
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
      result.rep[thisProp.key] = result.rep[thisProp.value] + NL_CHAR + '\t' + thisLine;
      continue;
    }

    if (thisLine.indexOf('@') === 0 || thisLine.indexOf('$') === 0) {
      getProp('rep');
      continue;
    }

    if (thisLine.indexOf('?') === 0) {
      getProp('conv');
      continue;
    }

    skip = false;

    if (thisLine === '[section]') {
      getSect(i, l);
    }

    if (source === 'user' && thisLine === '[linecust]') {
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
})(g_cfg.sourcePath, g_cfg.source, g_unsetLines);

/* Conversion processing of string */
var g_baseLines = (function (base, patches) {
  var result = [];
  var lines = util.readLines(base).data;
  var reg1 = /\[\?[^:]+:[^\]]*\]/;
  var reg2 = /\[\?[^:]+/g;
  var match = {};
  var thisLine, thisMatch, thisPatch;

  var setValue = function (label, value) {
    var reg3 = RegExp('\\[\\' + label + ':([^\\]]*)]', 'g');
    var result = thisLine.replace(reg3, value);
    return result;
  };

  for (var i = 0, l = lines.length; i < l; i++) {
    thisLine = lines[i];

    if (thisLine.indexOf(';') === 0 || thisLine === '') {
      continue;
    }

    if (reg1.test(thisLine)) {
      match = thisLine.match(reg2);
      for (var j = 0, k = match.length; j < k; j++) {
        thisMatch = match[j].substring(1);
        thisPatch = patches.conv[thisMatch];
        thisLine =
          typeof thisPatch === 'undefined'
            ? setValue(thisMatch, '$1')
            : setValue(thisMatch, thisPatch);
      }
    }

    result.push(thisLine);
  }

  return result;
})(g_cfg.basePath, g_patches);

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
    var regPf = {
      '@': /^@default:(\S+)\s*([=,])\s*(.*)/,
      '$': /^\$replace:(\S+)\s*([=,])\s*(.*)/
    };
    var cleateLines = function (prefix) {
      var cmdline = {
        '@': function (table, key) {
          setLines.push(key + patches.rep[key]);
          unsetLines[table].push('-|' + key + ' =');
        },
        '$': function (table, key, sep, value) {
          setLines.push(patches.rep[key] + '\t' + sep + ' ' + value);
          unsetLines[table].push('-|' + patches.rep[key] + ' =');
        }
      }[prefix];

      var thisKey, thisSep, thisValue;

      for (var item in patches.rep) {
        skip = false;

        if (Object.prototype.hasOwnProperty.call(patches.rep, item)) {
          thisLine.replace(regPf[prefix], function (_p0, p1, p2, p3) {
            thisKey = p1;
            thisSep = p2;
            thisValue = p3;
            return;
          });

          if (patches.rep[thisKey] === null) {
            setLines.push(thisKey + '\t' + thisSep + ' ' + thisValue);
            unsetLines[thisTable.key].push('-|' + thisKey + ' =');
            delete patches.rep[thisKey];
            return;
          }

          if (thisKey === item) {
            cmdline(thisTable.key, thisKey, thisSep, thisValue);
            delete patches.rep[thisKey];
            return;
          }
        }
      }

      if (prefix !== '$') {
        setLines.push(thisKey + '\t' + thisSep + ' ' + thisValue);
        unsetLines[thisTable.key].push('-|' + thisKey + ' =');
        return;
      }

      skip = true;
    };

    // Main loop of the build
    var regTable = /^(?:-\|)?([^\s=-]+)\s*([=,])\s*(.*)$/;
    var regProp = /^([^\s=,-]+)\s*([=,]\s*.*)$/;

    for (var i = 0, l = lines.length; i < l; i++) {
      thisLine = lines[i];

      if (thisLine.indexOf(';') === 0 || thisLine === '') {
        continue;
      }

      lines[i].replace(regTable, function (_p0, p1, p2, p3) {
        thisTable.key = p1;
        thisTable.sep = p2;
        thisTable.value = p3;
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

          if (~thisLine.indexOf('%*getcust(S_ppm#global:scripttype)')) {
            thisLine = thisLine.replace(regStype, Stype);
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

          thisLine.replace(regProp, function (_p0, p1, p2) {
            thisProp.key = p1;
            thisProp.value = p2;
            return;
          });

          if (typeof thisProp.value !== 'undefined') {
            setLines.push(thisProp.key + '\t' + thisProp.value);
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
    var linecusts = {set: [], unset: []};
    var lines = util.readLines(linecustpath).data;

    if (source === 'user') {
      var thisLine, thisLine_;
      var reg = /^([^,]+,[^:]+:[^=,]+[=,]).*/;

      for (var i = 0, l = patches.linecust.length; i < l; i++) {
        thisLine = patches.linecust[i];

        if (typeof thisLine !== 'undefined') {
          thisLine_ = thisLine.replace(reg, name + '=$1');
          if (~lines.indexOf(thisLine_)) {
            linecusts.unset.push(thisLine_);
          } else {
            linecusts.set.push(thisLine_);
          }
        }
      }
    }

    return linecusts;
  })();

  return result;
})(g_cfg.name, g_cfg.source, g_baseLines, g_patches, g_unsetLines, g_cfg.linecustPath);

if (g_cfg.setupPath === 'dryrun') {
  (function (name) {
    var setline = g_patches.linecust;
    var unsetline = mergeLines.linecust.unset;
    PPx.Echo('[Build setup ' + name + '.cfg]\n\n' + mergeLines.set.join(NL_CHAR));
    PPx.Echo('[Build unset ' + name + '.cfg]\n\n' + mergeLines.unset.join(NL_CHAR));

    setline.length !== 0 &&
      PPx.Echo(
        '[Linecust ' +
          name +
          ']\n\nset: \n' +
          setline.join(NL_CHAR) +
          '\n\nunset: \n' +
          unsetline.join(NL_CHAR)
      );

    PPx.Quit(1);
  })(g_cfg.name);
}

/* Make part of PPxcfg */
var save = function (data, savefile, append) {
  st.open;

  if (append === 1) {
    st.LoadFromFile(savefile);
    st.Position = st.Size;
    st.SetEOS;
  } else {
    st.Position = 0;
  }

  st.WriteText(data.join(NL_CHAR), 1);
  st.SaveToFile(savefile, 2);
  st.Close;
  PPx.Execute('*wait 10');
};

// Save plugin settings to a file
save(mergeLines.set, g_cfg.setupPath, 0);

// Save plugin deletion settings to a file
save(mergeLines.unset, g_cfg.unsetPath, 0);

// Save plugin deletion linecusts to a file
(function (linecusts, deletecusts, filepath) {
  if (linecusts.length !== 0) {
    PPx.Execute(ppm.addCmdline.apply({}, linecusts));
  }

  if (deletecusts.length !== 0) {
    save(deletecusts, filepath, 1);
  }
})(g_patches.linecust, mergeLines.linecust.set, g_cfg.linecustPath);

PPx.result = '';
