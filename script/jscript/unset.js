//!*script
/**
 *  Unset plugin settings
 *
 * @arg 0 Plugin name
 * @arg 1 If nonzero dry run
 */

PPx.Execute('*script %sgu"ppm"\\dist\\pluginRegister.js,ppx-plugin-manager,set,user');
PPx.Execute('*script %sgu"ppm"\\dist\\ppmCommand.js,unset');

/* Initial */
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

// var unset_plugin = (function (args) {
//   var len = args.length;

//   if (len < 1) {
//     util.error('arg');
//   }

//   var pluginName = args.Item(0);
//   var pluginDir = util.getc('S_ppm#plugins:' + pluginName);

//   if (~pluginName.indexOf('ppx-plugin-manager')) {
//     PPx.Execute('%"ppx-plugin-manager"%I"the ppx-plugin-manager can not unset"');
//     PPx.Quit(1);
//   }

//   return {
//     name: pluginName.replace(/^@/, ''),
//     dir: pluginDir,
//     dryrun: len > 1 ? args.Item(1) | 0 : 0
//   };
// })(PPx.Arguments);

// var cache_dir = util.getc('S_ppm#global:cache');
// var global_cfg = cache_dir + '\\ppm\\global.cfg';

// if (util.getc('S_ppm#plugins:' + unset_plugin.name) === '') {
//   PPx.Execute('%"ppx-plugin-manager"%I"' + unset_plugin.name + ' is not installed"');
//   PPx.Quit(1);
// }

// /* Initial plugin */
// var init_result = ppm.unsetLines(unset_plugin.name, unset_plugin.dryrun);
// if (unset_plugin.dryrun !== 0) {
//   PPx.Echo('[Unset]\n\n' + init_result);
//   PPx.Quit(1);
// }

// (function () {
//   util.setc('S_ppm#plugins:@' + unset_plugin.name + '=' + unset_plugin.dir);
//   PPx.Execute('*deletecust S_ppm#plugins:' + unset_plugin.name);

//   var overWrite = function (name, prefix) {
//     var listPath = cache_dir + '\\list\\' + name;
//     var lines = util.readLines(listPath);

//     for (var i = 0, l = lines.data.length; i < l; i++) {
//       var thisLine = lines.data[i];

//       if (thisLine.indexOf(unset_plugin.name) === 0) {
//         lines.data[i] = prefix + thisLine;
//         continue;
//       }
//     }

//     util.write.apply({filepath: listPath, newline: lines.newline}, lines.data);
//   };

//   overWrite('_pluginlist', ';');
//   overWrite('enable_plugins.txt', '@');
// })();

// /* Output settings to file */
// unset_plugin.dryrun === 0 &&
//   PPx.Execute('%Osbd *ppcust CD ' + global_cfg + ' -mask:"S_ppm#global,S_ppm#plugins"');

// PPx.SetPopLineMessage('!"Unset ' + unset_plugin.name);
