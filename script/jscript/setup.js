//!*script
/**
 * Setup plugin settings
 *
 * @arg 0 Setup process. reset | set | unset
 * @arg 1 If nonzero no load manageFiles
 * @arg 2 If nonzero dry run
 */

PPx.Execute('*script %sgu"ppm"\\dist\\pluginRegister.js,all,set,user');

// var NL_CHAR = '\r\n';

// /* Initial */
// var st = PPx.CreateObject('ADODB.stream');
// var module = function (filepath) {
//   var data;

//   st.Open;
//   st.Type = 2;
//   st.Charset = 'UTF-8';
//   st.LoadFromFile(filepath);
//   data = st.ReadText(-1);
//   st.Close;

//   return Function(' return ' + data)();
// };

// var util = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\util.js'));
// var ppm = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\ppm.js'));
// module = null;

// if (PPx.Extract('%n').charAt(0) !== 'B') {
//   PPx.Echo(util.script.name + ': This script can only be run on PPb');
//   PPx.Quit(-1);
// }

// var g_args = (function (args) {
//   var len = args.length;

//   return {
//     process: len ? args.Item(0) : 'reset',
//     localcfg: len > 1 ? args.Item(1) | 0 : 0,
//     dryrun: len > 2 ? args.Item(2) | 0 : 0
//   };
// })(PPx.Arguments);

// var g_ppm = (function () {
//   var cache = util.getc('S_ppm#global:cache');
//   var plugins = util.getc('S_ppm#plugins').split(NL_CHAR);
//   var enable = [];

//   for (var i = 1, l = plugins.length - 2; i < l; i++) {
//     var thisPlugin = plugins[i];

//     if (thisPlugin.indexOf('@') === 0) {
//       continue;
//     }

//     enable.push(thisPlugin.split(/\s/)[0]);
//   }

//   return {
//     cache: cache,
//     currentSet: enable,
//     cfgFiles: util.readLines(cache + '\\list\\_managefiles'),
//     linecust: cache + '\\ppm\\unset\\linecust.cfg'
//   };
// })();

// /* Initial plugins */
// if (g_args.process !== 'set') {
//   (function (cache, plugins, dryrun) {
//     var unsets = ['[Unset]'];

//     for (var i = 0, l = plugins.length; i < l; i++) {
//       unsets.push(ppm.unsetLines(plugins[i], dryrun));
//     }

//     if (dryrun !== 0) {
//       if (unsets.length) {
//         PPx.Execute('*execute BP,*linemessage ' + ppm.complcode('cmd', unsets.join('\n')));
//       }

//       return;
//     }

//     PPx.Execute('*ppcust CD ' + cache + '\\ppm\\noplugin.cfg -nocomment');
//   })(g_ppm.cache, g_ppm.currentSet, g_args.dryrun);
// }

// if (g_args.process !== 'unset') {
//   /* Load settings */
//   (function (cache, manageFiles, plugins, linecust, ignoreLocalCfg, dryrun) {
//     var settings = ['[Load]'];
//     var len = manageFiles.length;
//     var custOpt = (function () {
//       var result = 'CA';
//       if (
//         len === 1 &&
//         (~manageFiles[0].indexOf('noplugin.cfg') || ~manageFiles[0].indexOf('initial.cfg'))
//       ) {
//         result = 'CS';
//       }

//       return result;
//     })();
//     var cmdline =
//       dryrun !== 0
//         ? function (path) {
//             settings.push(path);
//             return settings;
//           }
//         : function (path) {
//             return PPx.Execute(
//               '*execute BP,*linemessage *setcust @' +
//                 path +
//                 '%%bn %%: *ppcust ' +
//                 custOpt +
//                 ' ' +
//                 path
//             );
//           };

//     if (ignoreLocalCfg === 0) {
//       for (var i = 0; i < len; i++) {
//         cmdline(manageFiles[i]);
//       }
//     }

//     dryrun !== 0 && PPx.Execute('*execute BP,*linemessage ' + settings.join('%%bn'));

//     /* Build settings */
//     (function () {
//       var result = [];
//       var thisPlugin, msg;

//       // Initial linecust.cfg
//       dryrun === 0 && PPx.Execute('@type nul>' + linecust);

//       for (var i = 0, l = plugins.length; i < l; i++) {
//         thisPlugin = plugins[i];
//         msg = PPx.Extract(
//           '%*script("' +
//             util.getc('S_ppm#global:ppm') +
//             '\\script\\jscript\\build.js",' +
//             thisPlugin +
//             ',user,' +
//             dryrun +
//             ')'
//         );
//         if (msg !== '') {
//           result.push('Failed: ' + thisPlugin + ' ' + msg);
//           continue;
//         }
//       }

//       if (result.length) {
//         util.print.apply({cmd: 'edit', title: 'BUILD CONFIG FILE ABORTING'}, result);
//         PPx.Quit(-1);
//       }
//     })();

//     var thisFile;

//     for (var j = 0, k = plugins.length; j < k; j++) {
//       thisFile = cache + '\\ppm\\setup\\' + plugins[j] + '.cfg';
//       cmdline(thisFile);
//     }
//   })(
//     g_ppm.cache,
//     g_ppm.cfgFiles.data,
//     g_ppm.currentSet,
//     g_ppm.linecust,
//     g_args.localcfg,
//     g_args.dryrun
//   );
// }

// g_args.dryrun && PPx.Quit(1);

// /* Output settings to file */
// PPx.Execute(
//   '*string o,backupcfg=' +
//     g_ppm.cache +
//     '\\backup\\%*now(date) %:' +
//     '*string o,noplugincfg=' +
//     g_ppm.cache +
//     '\\ppm\\noplugin.cfg %:' +
//     '*ppcust CD ' +
//     g_ppm.cache +
//     '\\ppm\\global.cfg' +
//     ' -mask:"S_ppm#global,S_ppm#plugins" %:' +
//     '*ppcust CD %so"backupcfg".cfg -nocomment %:' +
//     '*ifmatch "o:e,a:d-",%so"noplugincfg" %:' +
//     '@copy /Y %so"noplugincfg" %so"backupcfg"_noplugin.cfg>nul'
// );

// var postcmd = g_args.process !== 'unset' ? '*focus BP' : '*closeppx BP';

// PPx.Execute(
//   '*execute BP,%%"ppx-plugin-manager"%%Q"Setup complete.%%bnRestart PPc now?"%%:' +
//     '*closeppx C*%%:' +
//     '*wait 200,2%%:' +
//     '*ppc -k ' +
//     postcmd
// );
