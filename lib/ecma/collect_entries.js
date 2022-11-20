//!*script
/**
 * Extract the actual value of ListFile entries
 *
 * @version 1.0
 * @arg {number} 0 Marked count limit
 * @arg {number} 1 Limit operator. "-"=less and equal | "+"=more | "="=equal
 * @arg {string} 2 Target value of entries. Name|ShortName|Attributes|Size|State|ExtColor|Date...|Comment
 * NOTE: Default arguments values are not limit. "0,+,Name"
 */

'use strict';

const script_name = PPx.scriptName;

const errors = (method, msg) => {
  PPx.Execute(`*script "%*name(D,"${script_name}")\\errors.js",${method},${script_name},${msg}`);
  PPx.Quit(-1);
};

const match_value = (method = 'Name') => {
  const reg =
    /^(name|shortname|attributes|size|state|extcolor|DateCreated|DateLastAccessed|DateLastModified|comment)$/i;

  if (!reg.test(method)) {
    PPx.Echo(`Unsupported ${method}`);
    PPx.Quit(-1);
  }

  return method;
};

const collect_items = (args = PPx.Arguments) => {
  const arr = ['0', '+', 'Name'];

  for (let i = 0, l = args.length; i < l; i++) {
    arr[i] = args.Item(i);
  }

  if (!~arr[1].indexOf('-') && !~arr[1].indexOf('+') && !~arr[1].indexOf('=')) {
    errors('arg');
  }

  return {
    count: arr[0] | 0,
    limit: arr[1],
    value: match_value(arr[2])
  };
};

const items = collect_items();
const marked_count = PPx.EntryMarkCount;

({
  '-': (marked, limit) => {
    if (marked > limit) {
      errors('msg', 'Too many marked entries');
    }
  },
  '+': (marked, limit) => {
    if (marked <= limit) {
      errors('msg', 'Not enough marked entries');
    }
  },
  '=': (marked, limit) => {
    if (marked !== limit) {
      PPx.Echo(marked, limit, marked !== limit);
      errors('msg', `Number of marks must be ${limit}`);
    }
  }
}[items.limit](marked_count, items.count));

const result = () => {
  const result = [];
  let thisValue;

  for (const en = PPx.Entry.AllMark; !en.atEnd(); en.moveNext()) {
    thisValue = en[items.value];
    thisValue !== '' && result.push(thisValue);
  }

  return result.join(',');
};

PPx.Result = result();
