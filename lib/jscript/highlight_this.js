//!*script
/**
 * Highlight matching lines
 *
 * @version 1.0
 * @arg {string} 0 Target information of entries. Name|ShortName|Attributes|Size|State|ExtColor|Comment
 */

var match_value = function (args) {
  var args = args || PPx.Arguments;
  var method = args.length ? args.Item(0) : 'Name';
  var reg = /^(name|shortname|attributes|size|state|extcolor|comment)$/i;

  if (!reg.test(method)) {
    PPx.Echo('Unsupported ' + method);
    PPx.Quit(-1);
  }

  return method;
};

var use_highlight = function () {
  var cached = PPx.getIValue('ppmlibhl');

  if (cached === '') {
    PPx.Execute('*linecust ppmlibhl,KC_main:LOADEVENT,*string i,ppmlibhl=');
    PPx.setIValue('ppmlibhl', 1);
    return 1;
  }

  var stored = cached.split(',');
  var entryHl = PPx.Entry.Highlight;

  if (entryHl !== 0) {
    stored[entryHl - 1] = 0;
    PPx.setIValue('ppmlibhl', stored.join(','));

    return 0;
  }

  for (var i = 0; i < 7; i++) {
    if (stored[i] !== '1') {
      stored[i] = 1;
      PPx.setIValue('ppmlibhl', stored.join(','));

      return i + 1;
    }
  }

  return 7;
};

var method = match_value();
var term = PPx.Entry[method];
var hl_number = use_highlight();

for (var en = PPx.Entry.AllEntry; !en.atEnd(); en.moveNext()) {
  if (term === en[method]) {
    en.highlight = hl_number;
  }
}
