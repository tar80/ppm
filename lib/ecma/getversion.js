//!*script
/**
 * Return plugin current version
 *
 * @version 1.0
 * @return {string} Plugin version
 * @arg {string} 0 Target plugin name
 */

'use strict';

/* Import modules */
const st = PPx.CreateObject('ADODB.stream');
let module = function (filepath) {
  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(filepath);
  const data = st.ReadText(-1);
  st.Close;

  return Function(' return ' + data)();
};

// Load modules
const util = module(PPx.Extract('%*getcust(S_ppm#global:module)\\util.js'));
module = null;

if (PPx.Arguments.length === 0) {
  util.error('arg');
}

const VERSION_INFO = 'VERSION=';
const plugin_name = PPx.Arguments.Item(0);
const info_file = PPx.Extract(`%*getcust(S_ppm#plugins:${plugin_name})\\install`);

const fso = PPx.CreateObject('Scripting.FileSystemObject');

if (!fso.FileExists(info_file)) {
  util.quitMsg('not found install information');
}

const install_info = util.readLines(info_file).data;

for (let i = 0; i < install_info.length; i++) {
  if (install_info[i].indexOf(VERSION_INFO) === 0) {
    PPx.Result = install_info[i].replace(VERSION_INFO, '');
    PPx.Quit(1);
  }
}

PPx.Result = '???'
