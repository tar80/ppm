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

// Load module
const input = module(PPx.Extract('%*getcust(S_ppm#global:module)\\input.js'));
module = null;

describe('method .adjust', function () {
  it('Send normal patterns', function () {
    assert.equal('^\\1', input.adjust('^\\1').join(''));
    assert.equal('&^\\A', input.adjust('&^\\a').join(''));
  });
  it('Send symbol patterns', function () {
    assert.equal('\\1', input.adjust('!').join(''));
    assert.equal('^\\1', input.adjust("^'!'").join(''));
    assert.equal("^\\'\\'", input.adjust("^'|'").join(''));
  });
  it('Send wrong patterns', function () {
    assert.equal('^\\1', input.adjust("^\\'1'").join(''));
    assert.equal('^\\1', input.adjust('^!').join(''));
    assert.equal('~&\\A', input.adjust("~&\\'a'").join(''));
  });
});
describe('method .sortM', function () {
  it('Send worng modifier pattern', function () {
    assert.equal('~&^\\', input.sortM('\\^&~'));
    assert.equal('~&\\', input.sortM('\\&~'));
  });
  it('Send normal pattern', function () {
    assert.equal('~^\\', input.sortM('\\^~'));
    assert.equal('^\\', input.sortM('\\^'));
    assert.equal("^", input.sortM('^'));
  });
});
describe('method .keystring', function () {
  it('Send Virtual key', function () {
    assert.equal('Shift+&\\', input.keystring('\\', 'V_HDC'));
    assert.equal('Ctrl+&1', input.keystring('^', 'V_H31'));
    assert.equal('Shift+Ctrl+&1', input.keystring('^\\', 'V_H31'));
    assert.equal('Ctrl+&^', input.keystring('^', "'^'"));
  });
});
describe('method .keycode', function () {
  it('Send single key', function () {
    assert.equal('1', input.keycode('', '1'));
    assert.equal('A', input.keycode('', 'A'));
  });
  it('Send symbol key', function () {
    assert.equal("'-'", input.keycode('', "'-'"));
    assert.equal("'='", input.keycode('', "'='"));
    assert.equal("'''", input.keycode('', "'''"));
    assert.equal("'^'", input.keycode('', "'^'"));
    assert.equal("'~'", input.keycode('', "'~'"));
    assert.equal("' '", input.keycode('', "' '"));
  });
  it('Send numlock', function () {
    assert.equal('NUMLOCK', input.keycode('', 'NUMLOCK'));
    assert.equal('\\NUMLOCK', input.keycode('\\', 'NUMLOCK'));
    assert.equal('^PAUSE', input.keycode('^', 'NUMLOCK'));
  });
  it('Send Special key', function () {
    assert.equal('^V_HE5', input.keycode('^', 'BS'));
  });
  it('Send key J', function () {
    assert.equal('J', input.keycode('', 'J'));
    assert.equal('\\J', input.keycode('\\', 'J'));
    assert.notEqual('^J', input.keycode('^', 'J'));
    assert.notEqual('^\\J', input.keycode('^\\', 'J'));
    assert.equal('&J', input.keycode('&', 'J'));
    assert.equal('~&J', input.keycode('~&', 'J'));
  });
  it('Send multi-charactor key', function () {
    assert.equal('F1', input.keycode('', 'F1'));
    // assert.notEqual('ABC', input.keycode('', 'ABC'));
  });
  it('Send symbol with modifier shift key', function () {
    assert.equal("\\'='", input.keycode('\\', "'='"));
    assert.equal("\\'~'", input.keycode('\\', "'~'"));
    assert.equal("\\'!'", input.keycode('\\', "'!'"));
    assert.equal("\\'|'", input.keycode('\\', "'\\'"));
    assert.equal("\\' '", input.keycode('\\', "' '"));
    assert.equal("\\'''", input.keycode('\\', "'''"));
  });
  it('Send symbol with modifier keys', function () {
    assert.equal('^V_H31', input.keycode('^', '1'));
    assert.equal('^V_HDC', input.keycode('^', "'\\'"));
    assert.equal('^\\V_HBD', input.keycode('^\\', "'-'"));
    assert.equal('^\\V_HDE', input.keycode('^\\', "'^'"));
    assert.equal('^\\V_H31', input.keycode('^\\', '1'));
    assert.equal('^\\SPACE', input.keycode('^\\', "' '"));
    assert.equal('^\\V_H37', input.keycode('^\\', '7'));
  });
  it('Send alphanumeric key', function () {
    assert.equal('\\1', input.keycode('\\', '1'));
    assert.equal('^V_H31', input.keycode('^', '1'));
    assert.equal('^\\V_H31', input.keycode('^\\', '1'));
    assert.equal('&1', input.keycode('&', '1'));
    assert.equal('&\\1', input.keycode('&\\', '1'));
    assert.notEqual('&^1', input.keycode('&^', '1'));
    assert.equal('~\\1', input.keycode('~\\', '1'));
    assert.equal('~^V_H31', input.keycode('~^', '1'));
  });
});
describe('method .addkey', function () {
  it('Send Shift+Symbol', function () {
    const msg = 'test key';
    const mod = '\\';
    const char = "'\\'";
    const keycode = input.keycode(mod, char);
    const keystring = input.keystring(mod, char);
    const keyvalue = '%mTestMessage';
    input.addkey(keycode, '%(' + keyvalue + '%)', msg);
    const keyContents = PPx.Extract('%*getcust(K_ppmInputTemp:' + keycode + ')');
    const menuContents = PPx.Extract('%*getcust(M_ppmInputTemp:' + msg + '%bt' + keystring + ')');
    assert.equal(keyvalue, keyContents);
    assert.equal(keyvalue, menuContents);
  });
  it('Send Ctrl+Symbol', function () {
    const msg = 'test key';
    const mod = '^\\';
    const char = "'\\'";
    const keycode = input.keycode(mod, char);
    const keystring = input.keystring(mod, char);
    const keyvalue = '%mTestMessage';
    input.addkey(keycode, '%(' + keyvalue + '%)', msg);
    const keyContents = PPx.Extract('%*getcust(K_ppmInputTemp:' + keycode + ')');
    const menuContents = PPx.Extract('%*getcust(M_ppmInputTemp:' + msg + '%bt' + keystring + ')');
    assert.equal(keyvalue, keyContents);
    assert.equal(keyvalue, menuContents);
  });
  it('Send Ctrl+Shift+Number', function () {
    const msg = 'test key';
    const mod = '^\\';
    const char = '1';
    const keycode = input.keycode(mod, char);
    const keystring = input.keystring(mod,char);
    const keyvalue = '%mTestMessage';
    input.addkey(keycode, '%(' + keyvalue + '%)', msg);
    const keyContents = PPx.Extract('%*getcust(K_ppmInputTemp:' + keycode + ')');
    const menuContents = PPx.Extract('%*getcust(M_ppmInputTemp:' + msg + '%bt' + keystring + ')');
    assert.equal(keyvalue, keyContents);
    assert.equal(keyvalue, menuContents);
  });
  it('Send Ctrl+Shift+Char', function () {
    const msg = 'test key';
    const mod = '^\\';
    const char = 'A';
    const keycode = input.keycode(mod, char);
    const keystring = input.keystring(mod, char);
    const keyvalue = '%mTestMessage';
    input.addkey(keycode, '%(' + keyvalue + '%)', msg);
    const keyContents = PPx.Extract('%*getcust(K_ppmInputTemp:' + keycode + ')');
    const menuContents = PPx.Extract('%*getcust(M_ppmInputTemp:' + msg + '%bt' + keystring + ')');
    assert.equal(keyvalue, keyContents);
    assert.equal(keyvalue, menuContents);
  });
});
PPx.setValue('utilinput', '');
PPx.Execute('*deletecust "K_ppmInputTemp"%:*deletecust "M_ppmInputTemp"');
