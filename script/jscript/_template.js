//!*script
/**
 * Description
 *
 * @return
 * @arg 0
 */

var script_name = PPx.ScriptName.replace(/^.*\\/, '');

var errorMsg = function (msg) {
  PPx.Echo(script_name + ': ' + msg);
  PPx.Quit(-1);
};

var g_args = (function (args) {
  var len = args.length;

  if (len < n) {
    PPx.Execute('*script "%*getcust(S_ppm#global:lib)\\errors.js",arg,' + PPx.ScriptName);
    PPx.Quit(-1);
  }

  return {};
})(PPx.Arguments());

var setc = function (item) {
  return PPx.Execute('*setcust ' + item);
};

var getc = function (item) {
  return PPx.Extract('%*getcust(' + item + ')');
};

/**
 * usage: lib.call({name: 'script-name'}, [arg1, arg2, ...]);
 */
var lib = function () {
  var args = [].slice.call(arguments);
  return PPx.Execute('*script "%*getcust(S_ppm#global:lib)\\' + this.name + '.js",' + args);
};

/**
 * usage: reply.call({name: 'script-name'}, [arg1, arg2, ...]);
 */
var reply = function () {
  var args = [].slice.call(arguments);
  return PPx.Extract(
    '%*script("%*getcust(S_ppm#global:lib)\\' + this.name + '.js",' + args + ')'
  );
};

/**
 * usage: print.call({title: 'message-title'}, [line1, line2, ...]);
 */
var print = function () {
  var args = [].slice.call(arguments);
  PPx.Execute(
    '*script "%*getcust(S_ppm#global:lib)\\print.js",%*getcust(S_ppm#user:newline),' +
      this.title +
      ',' +
      args
  );
};
