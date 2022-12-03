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

var script_name = PPx.scriptName;

var errors = function (method, msg) {
  PPx.Execute(
    '*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name + ',' + msg
  );
  PPx.Quit(-1);
};

var match_value = function (method) {
  var method = method || 'Name';
  var reg =
    /^(name|shortname|attributes|size|state|extcolor|DateCreated|DateLastAccessed|DateLastModified|comment)$/i;

  if (!reg.test(method)) {
    PPx.Echo('Unsupported ' + method);
    PPx.Quit(-1);
  }

  return method;
};

var collect_items = function (args) {
  var args = args || PPx.Arguments;
  var arr = ['0', '+', 'Name'];

  for (var i = 0, l = args.length; i < l; i++) {
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

var items = collect_items();
var marked_count = PPx.EntryMarkCount;

({
  '-': function (marked, limit) {
    if (marked > limit) {
      errors('msg', 'Too many marked entries');
    }
  },
  '+': function (marked, limit) {
    if (marked <= limit) {
      errors('msg', 'Not enough marked entries');
    }
  },
  '=': function (marked, limit) {
    if (marked !== limit) {
      PPx.Echo(marked, limit, marked !== limit);
      errors('msg', 'Number of marks must be ' + limit);
    }
  }
}[items.limit](marked_count, items.count));

var result = function () {
  var result = [];
  var thisValue;

  for (var en = PPx.Entry.AllMark; !en.atEnd(); en.moveNext()) {
    thisValue = en[items.value];
    thisValue !== '' && result.push(thisValue);
  }

  return result.join(',');
};

PPx.Result = result();
