﻿var validArgs=function(){for(var e=[],t=PPx.Arguments;!t.atEnd();t.moveNext())e.push(t.value);return e},isEmptyStr=function(e){return""===e},main=function(){var e=validArgs(),t=e[0],n=e[1],u=e[2];if(!isEmptyStr(n)){var r="_WinPos:V"+t;PPx.Execute("*setcust "+r+"="+n),debugMsg(u,"restorePPv setcust:"+r+"="+n)}},debugMsg=function(e,t){"DEBUG"===e&&PPx.Execute("*execute C,*linemessage [DEBUG] "+t)};main();