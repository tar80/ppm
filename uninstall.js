//!*script
// deno-lint-ignore-file no-var
/**
 * Uninstall ppx-plugin-manager
 *
 */

var ppm_dir = PPx.Extract('%*getcust(S_ppm#global:ppm)');

if (ppm_dir === '') {
  PPx.Echo('Failed: ppm is not installed.');
  PPx.Quit(1);
}

if (PPx.Extract("%'ppm_uninstall'") !== '1') {
  PPx.Echo('Failed: Uninstallation will only be run at *ppmUninstall.');
  PPx.Quit(1);
}

/* Delete directories */
PPx.Execute('*delete %*getcust(S_ppm#global:home)\\arch');
PPx.Execute('*delete %*getcust(S_ppm#global:home)\\repo');

/* Delete *ppmRestore */
PPx.Execute('*script ' + ppm_dir + '\\script\\jscript\\regist_restore.js,unset');

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
