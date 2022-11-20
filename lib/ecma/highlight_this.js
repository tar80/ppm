//!*script
/**
 * Highlight matching lines
 *
 * @version 1.0
 * @arg {string} 0 Target information of entries. Name|ShortName|Attributes|Size|State|ExtColor|Comment
 */

'use strict';

const match_value = (args = PPx.Arguments) => {
  const method = args.length ? args.Item(0) : 'Name';
  const reg = /^(name|shortname|attributes|size|state|extcolor|comment)$/i;

  if (!reg.test(method)) {
    PPx.Echo(`Unsupported ${method}`);
    PPx.Quit(-1);
  }

  return method;
};

const use_highlight = () => {
  const cached = PPx.getIValue('ppmlibhl');

  if (cached === '') {
    PPx.Execute('*linecust ppmlibhl,KC_main:LOADEVENT,*string i,ppmlibhl=');
    PPx.setIValue('ppmlibhl', 1);
    return 1;
  }

  const stored = cached.split(',');
  const entryHl = PPx.Entry.Highlight;

  if (entryHl !== 0) {
    stored[entryHl - 1] = 0;
    PPx.setIValue('ppmlibhl', stored.join(','));

    return 0;
  }

  for (let i = 0; i < 7; i++) {
    if (stored[i] !== '1') {
      stored[i] = 1;
      PPx.setIValue('ppmlibhl', stored.join(','));

      return i + 1;
    }
  }

  return 7;
};

const method = match_value();
const term = PPx.Entry[method];
const hl_number = use_highlight();

for (const en = PPx.Entry.AllEntry; !en.atEnd(); en.moveNext()) {
  if (term === en[method]) {
    en.highlight = hl_number;
  }
}
