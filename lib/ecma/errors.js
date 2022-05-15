//!*script
/**
 * Print Error message
 *
 * @version 1.0
 * @arg 0 Specify method. arg
 * @arg 1 Target script path
 */

'use strict';

const script_name = PPx.ScriptName.replace(/^.+\\/, '');

const errorMsg = (msg) => {
  PPx.Echo(`${script_name}: ${msg}`);
  PPx.Quit(-1);
};

if (PPx.Arguments.length < 2) {
  errorMsg('Not enough arguments\n\n 0 Specify method, arg\n 1 Target script path');
}

const g_args = ((args = PPx.Arguments()) => {
  const name = args.item(1).replace(/^.+\\/, '');
  return {
    name: name,
    path: args.item(1),
    method: args.item(0)
  };
})();

const method = {};

method['arg'] = function (args) {
  const result = [`${args.name}: Not enough arguments\n`];
  const codes = ['\r\n', '\n', '\r'];
  let linefeed = '';

  const lines = (() => {
    const st = PPx.CreateObject('ADODB.stream');
    st.Open;
    st.Type = 2;
    st.Charset = 'UTF-8';
    st.LoadFromFile(args.path);
    const data = st.ReadText(-1);
    const data_ = data.slice(0, 100);
    st.Close;

    for (let i = 0, l = codes.length; i < l; i++) {
      linefeed = codes[i];

      if (~data_.indexOf(linefeed)) {
        break;
      }
    }

    return data.split(linefeed);
  })();

  const reg = /\s\*\s@arg\s+/;

  for (let i = 0, l = lines.length; i < l; i++) {
    const thisLine = lines[i];

    if (thisLine.indexOf(' * @arg') === 0) {
      result.push(thisLine.replace(reg, ' '));
    }
  }

  return result.join(linefeed);
};

PPx.Echo(method[g_args.method](g_args));
