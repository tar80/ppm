//!*script
// deno-lint-ignore-file no-var
/**
 * Get the file names in a specific directory
 *
 * @version 1.0
 * @return Files contained in a specific directory
 * @arg 0 Specific directory path
 */

var script_name = PPx.scriptName;

var errors = function (method) {
  PPx.Execute('*script "%*name(D,"' + script_name + '")\\errors.js",' + method + ',' + script_name);
  PPx.Quit(-1);
};

PPx.Result = (function (args) {
  var len = args.length;
  if (len < 1) {
    errors('arg');
  }

  var spec_dir = args.item(0);
  var temp_file = PPx.Extract('%*temp(ppm_files.txt,f)');
  PPx.Execute(
    '*execute C,*whereis -path:"' +
      spec_dir +
      '" -listfile:' +
      temp_file +
      ' -dir:off -subdir:off -name'
  );

  var fso = PPx.CreateObject('Scripting.FileSystemObject');
  var result = [];
  var data = fso.OpenTextFile(temp_file, 1, false, -1);

  while (!data.AtEndOfStream) {
    result.push(data.ReadLine());
  }

  data.Close();
  return result.join();
})(PPx.Arguments);
