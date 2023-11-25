//!*script
/**
 * Capture ppv in paired ppc window
 *
 * @arg {string} 0 Specify start or close capture-ppv. "start" | "stop"
 */

'use strict';

if (PPx.SyncView !== 0) {
  PPx.setPopLineMessage('Syncview running');
  PPx.Quit(1);
}

const order = PPx.Arguments.length ? PPx.Arguments.Item(0) : 'start';
const ppx_id = PPx.Extract('%n').split('');
let paired_idname = ppx_id[0] === 'V' ? ppx_id[1] : PPx.Extract('%~n').slice(1);

if (order === 'stop') {
  paired_idname === '' && PPx.Quit(1);

  PPx.Execute(`*closeppx V${paired_idname}`);
  const view_size = PPx.getIValue('viewsize');

  if (view_size !== '') {
    PPx.Execute(`*setcust _WinPos:V${paired_idname}=${view_size}`);
    PPx.setIValue('viewsize', '');
  }

  PPx.Quit(1);
}

const start_ppv = (id) => {
  PPx.Execute(`%Oin *ppv -bootid:${id} %R`);
  PPx.Execute(`*string i,viewsize=%*getcust(_WinPos:V${id})`);
  PPx.Execute(`*capturewindow V${id} -pane:~ -selectnoactive`);
};

if (paired_idname === '') {
  const is_combo = PPx.Extract('%*getcust(X_combo)') !== '0';

  if (!is_combo) {
    PPx.Execute('%"capture_ppv.js"%I"Operation abort.%bnMust de set to X_combo=1"');
  } else {
    PPx.Execute('*ppc -noactive');
    PPx.Execute('*wait 100,1');
    paired_idname = PPx.Extract('%~n').slice(1);
    start_ppv(paired_idname);
  }

  PPx.Quit(-1);
}

const has_capture = PPx.Extract(`%NV${paired_idname}`) !== '';
has_capture ? PPx.Execute(`*ppv -r -bootid:${paired_idname} %R`) : start_ppv(paired_idname);
