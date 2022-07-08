//!*script
// deno-lint-ignore-file no-var
/**
 * Uninstall ppx-plugin-manager
 *
 * @version 0.1
 */

var ppm_dir = PPx.Extract('%*getcust(S_ppm#global:ppm)');

if (ppm_dir === '') {
  PPx.Echo('Failed: Not installed ppm');
  PPx.Quit(1);
}

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
var util = module(ppm_dir + '\\module\\jscript\\util.js');
module = null;

if (PPx.Extract("%'ppm_uninstall'") !== '1') {
  PPx.Echo(util.script.name + ': This script can only be run *ppmUninstall');
  PPx.Quit(-1);
}

/* Delete directories */
PPx.Execute('*delete %*getcust(S_ppm#global:home)\\arch');
PPx.Execute('*delete %*getcust(S_ppm#global:home)\\repo');
/* Delete plugin settings */
var exitcode = PPx.Execute('*script %*getcust(S_ppm#global:ppm)\\script\\jscript\\setup.js,unset');

PPx.Execute(
  '*deletecust _command:ppmRestore %:' +
    '*deletecust "S_ppm#global" %:' +
    '*deletecust "S_ppm#plugins" %:' +
    '*deletecust "S_ppm#user" %:'
);

PPx.Execute('*set ppm_uninstall=');
PPx.Execute(exitcode ? '*focus BP' : '*closeppx BP');
