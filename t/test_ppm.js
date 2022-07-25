//!*script
// deno-lint-ignore-file no-var
/**
 * test module linecust
 *
 * @arg 0 THIS
 * @arg 1 IS
 * @arg 2 TEST
 * @arg 3 MESSAGE
 */

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

var ppm = module(
  PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\ppm.js')
);
module = null;

PPx.Execute(
  ppm.addCmdline.call(
    {},
    'THIS,KC_main:FIRSTEVENT,',
    'IS,KC_main:FIRSTEVENT,',
    'TEST,KC_main:FIRSTEVENT,',
    'MESSAGE,KC_main:FIRSTEVENT,'
  )
);
PPx.Echo(
  '>plugin.addCmdline.call()\n\n' + PPx.Extract('%*getcust(KC_main:FIRSTEVENT)')
);
var new_cmdline = ppm.delCmdline.call({}, 'test=THIS,KC_main:FIRSTEVENT,', 'test=IS,KC_main:FIRSTEVENT,', 'test=TEST,KC_main:FIRSTEVENT,', 'test=MESSAGE,KC_main:FIRSTEVENT,');

PPx.Execute(new_cmdline.set);
PPx.Echo(
  '>plugin.deleteline.call()\n\n' + PPx.Extract('%*getcust(KC_main:FIRSTEVENT)')
);
