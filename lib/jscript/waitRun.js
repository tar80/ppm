//!*script
/**
 * Waiting for start the command
 *
 * @version 1.0
 * @arg 0 Waiting time (milliseconds)
 * @arg 1 Number of times to turn the loop
 * @arg 2 Target class-name
 */

var args = {
  ms: PPx.Arguments.Item(0),
  loop: PPx.Arguments.Item(1),
  cname: PPx.Arguments.Item(2)
};

var i = args.loop;
var pid = 0;

while (pid === 0) {
  PPx.Execute('*wait ' + args.ms);
  pid = PPx.Extract('%*findwindowclass("' + args.cname + '")') | 0;

  i--;

  if (i === 0) {
    PPx.SetPopLineMessage('Loop is over');
    PPx.Quit(1);
  }
}
