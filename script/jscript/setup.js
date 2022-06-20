//!*script
/**
 * Setup plugin settings
 *
 * @arg 0 Setup process. reset | set | unset
 * @arg 1 If nonzero dry run
 */

/* Initial */
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

var util = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\util.js'));
var plugin = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\plugin.js'));
module = null;

if (PPx.Extract('%n').charAt(0) !== 'B') {
  PPx.Echo(util.script.name + ': This script can only be run PPb');
  PPx.Quit(-1);
}

var g_args = (function (args) {
  var len = args.length;

  return {
    process: len ? args.item(0) : 'reset',
    dryrun: len > 1 ? args.item(1) | 0 : 0
  };
})(PPx.Arguments());

var g_ppm = (function () {
  var cache = util.getc('S_ppm#global:cache');

  return {
    cache: cache,
    currentSet: util.getc('S_ppm#global:plugins').split(','),
    cfgFiles: util.lines(cache + '\\list\\_managefiles'),
    linecust: cache + '\\ppm\\unset\\linecust.cfg'
  };
})();

/* Initial plugins */
if (g_args.process !== 'set') {
  (function (cache, plugins, dryrun) {
    var result = ['[Unset]'];
    var msg;
    for (var i = 0, l = plugins.length; i < l; i++) {
      result.push(plugin.unset(plugins[i], dryrun));
    }

    if (dryrun !== 0) {
      if (result.length) {
        PPx.Execute('*execute BP,*linemessage ' + plugin.complete('cmd', result.join('\n')));
      }

      return;
    }

    PPx.Execute('*ppcust CD ' + cache + '\\ppm\\noplugin.cfg -nocomment');
  })(g_ppm.cache, g_ppm.currentSet, g_args.dryrun);
}

if (g_args.process !== 'unset') {
  /* Load settings */
  (function (cache, managefiles, plugins, linecust, dryrun) {
    var result = ['[Load]'];
    var len = managefiles.length;
    var post = (function () {
      var result = 'CA';
      if (
        len === 1 &&
        (~managefiles[0].indexOf('noplugin.cfg') || ~managefiles[0].indexOf('initial.cfg'))
      ) {
        result = 'CS';
      }

      return result;
    })();
    var cmdline =
      dryrun === 0
        ? function (path) {
            return PPx.Execute(
              '*execute BP,*linemessage *setcust @' + path + '%%bn %%: *ppcust ' + post + ' ' + path
            );
          }
        : function (path) {
            result.push(path);
            return result;
          };
    var thisFile;

    for (var i = 0; i < len; i++) {
      thisFile = managefiles[i];
      cmdline(thisFile);
    }

    dryrun !== 0 && PPx.Execute('*execute BP, *linemessage ' + result.join('%%bn'));

    /* Build settings */
    (function () {
      var result = [];
      var thisPlugin, msg;

      dryrun === 0 && PPx.Execute('@type nul>' + linecust);

      for (var i = 0, l = plugins.length; i < l; i++) {
        thisPlugin = plugins[i];
        msg = PPx.Extract(
          '%*script("' +
            util.getc('S_ppm#global:ppm') +
            '\\script\\jscript\\build.js",' +
            thisPlugin +
            ',user,' +
            dryrun +
            ')'
        );
        if (msg !== '') {
          result.push('Failed: ' + thisPlugin + ' ' + msg);
          continue;
        }
      }

      if (result.length) {
        util.print.apply({cmd: 'edit', title: 'BUILD CONFIG FILE ABORTING'}, result);
        PPx.Quit(-1);
      }
    })();

    for (var j = 0, k = plugins.length; j < k; j++) {
      thisFile = cache + '\\ppm\\setup\\' + plugins[j] + '.cfg';
      cmdline(thisFile);
    }
  })(g_ppm.cache, g_ppm.cfgFiles.data, g_ppm.currentSet, g_ppm.linecust, g_args.dryrun);
}

g_args.dryrun && PPx.Quit(1);

/* Output settings to file */
PPx.Execute(
  '*string o, path=' +
    g_ppm.cache +
    '\\backup\\%*now(date) %:' +
    '*ppcust CD ' +
    g_ppm.cache +
    '\\ppm\\global.cfg' +
    ' -mask:"S_ppm#global,S_ppm#plugins" %:' +
    '*ppcust CD %so"path".cfg -nocomment %:' +
    'copy /Y ' +
    g_ppm.cache +
    '\\ppm\\noplugin.cfg %so"path"_noplugin.cfg'
);

var postcmd = g_args.process !== 'unset' ? '*focus BP' : '*closeppx BP';

PPx.Execute(
  '*execute BP,%%"ppx-plugin-manager"%%Q"セットアップが完了しました%%bnPPcを再起動します" %%: *closeppx C* %%: *wait 200,2 %%: *ppc -k ' +
    postcmd
);
