//!*script
/**
 * Restore plugin settings
 *
 * @arg 0 ppm home directory path
 */

var fso = PPx.CreateObject('Scripting.FileSystemObject');
var cache_dir = fso.BuildPath(
  PPx.Arguments.Item(0) + '\\cache',
  PPx.Extract('%0').slice(3).replace(/\\/g, '@')
);

if (!fso.FolderExists(cache_dir)) {
  PPx.Echo('Configuration directory does not exist.\nCancel ppx-plugin-manager restore');
  PPx.Quit(-1);
}

PPx.Execute('%Os *setcust @' + cache_dir + '\\ppm\\global.cfg');
PPx.Execute(
  '*ppb -bootid:p %: *wait 300 %: %On *ppb -c *script %*getcust(S_ppm#global:ppm)\\script\\jscript\\setup.js,set,0'
);
