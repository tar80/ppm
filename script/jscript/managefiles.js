//!*script
/**
 * Manage Local Configuration files
 *
 */

PPx.Execute('*script %sgu"ppm"\\dist\\ppmManageConfig.js');

// var NL_CODE = 'crlf';

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
// module = null;

// var cache_dir = util.getc('S_ppm#global:cache');
// var over_write = cache_dir + '\\list\\_managefiles';

// var manage_files = (function () {
//   var userCfgs = [];
//   var markCount = PPx.EntryMarkCount;
//   var thisEntry = PPx.Entry;
//   var wd = PPx.Extract('%FD');
//   var path;

//   if (
//     markCount === 0 &&
//     !PPx.Execute(
//       '%"ppx-plugin-manager"' +
//         '%Q"No entries marked. Add noplugin.cfg to your _managefiles?%bn%bn' +
//         'NOTE:%btThe noplugin.cfg is a user configuration excluding ppm settings.%bn' +
//         '%btIt is generated at the time of *ppmSetup execution'
//     )
//   ) {
//     path = cache_dir + '\\ppm\\noplugin.cfg';
//     path = util.fileexists(path) ? path : cache_dir + '\\backup\\initial.cfg';

//     return [path];
//   }

//   thisEntry.FirstMark;

//   do {
//     if (PPx.Extract('%*name(T,"' + thisEntry.Name + '")').toUpperCase() === 'CFG') {
//       userCfgs.push(wd + '\\' + thisEntry.Name);
//     }
//   } while (thisEntry.NextMark);

//   return userCfgs;
// })();

// util.write.apply(
//   {
//     filepath: over_write,
//     newline: NL_CODE
//   },
//   manage_files
// );

// PPx.Execute('*deletecust "K_ppmTemp" %: *closeppx CP');
