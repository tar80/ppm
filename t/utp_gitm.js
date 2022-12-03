const st = PPx.CreateObject('ADODB.stream');
let module = function (filepath) {
  st.Open;
  st.Type = 2;
  st.Charset = 'UTF-8';
  st.LoadFromFile(filepath);
  const data = st.ReadText(-1);
  st.Close;

  return Function(' return ' + data)();
};
var gitm = module(PPx.Extract('%*getcust(S_ppm#global:ppm)\\module\\jscript\\gitm.js'));
module = null;

describe('module gitm', function () {
  var ppmRoot = PPx.Extract('%*getcust(S_ppm#global:ppm)');
  var notRepository = 'C:\\not-repository-dir';
  it('repository root path', function () {
    var parent = PPx.Extract('%*name(D,"' + PPx.ScriptName + '")');
    var gitRoot = gitm.root(parent);
    var plugRoot = PPx.Extract('%*getcust(S_ppm#plugins:ppm-test)');
    assert.equal(plugRoot, gitRoot);
  });
  it('not repository path', function () {
    var gitRoot = gitm.root(notRepository);
    assert.equal('', gitRoot);
  });
  it('ppm branch name', function () {
    assert.equal('main', gitm.branch(ppmRoot).name);
  });
  it('not branch name', function () {
    assert.equal('-', gitm.branch(notRepository).name);
  });
  it('branch information', function () {
    assert.equal('', gitm.branch(PPx.Extract('%FD')).info);
  });
  it('branch hash', function () {
    var branch = 'main';
    PPx.Execute(
      '*cd %*getcust(S_ppm#global:ppm)%:@git rev-parse ' +
        branch +
        '|%0pptrayw -c *setcust _user:utp_temp=%%*stdin(-utf8)%&'
    );
    PPx.Execute('*wait 0,1');
    assert.equal(PPx.Extract('%*getcust(_user:utp_temp)'), gitm.head(ppmRoot, branch));
  });
  it('not exist branch hash', function () {
    var branch = 'notexistbranch';
    PPx.Execute(
      '@git rev-parse ' + branch + '|%0pptrayw -c *setcust _user:utp_temp=%%*stdin(-utf8)%&'
    );
    PPx.Execute('*wait 0,1');
    assert.equal('unknown', gitm.head(ppmRoot, branch));
    PPx.Execute('*deletecust _user:utp_temp');
  });
  it('purpose, staged entries', function () {
    var stage = gitm.stage(ppmRoot);
    assert.equal(['staged', 'unstaged'], [stage.s, stage.u]);
  });
});
