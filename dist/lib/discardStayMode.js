﻿var validArgs=function(){for(var e=[],t=PPx.Arguments;!t.atEnd();t.moveNext())e.push(t.value);return e};(function(){var e=validArgs(),t=e[0],x=e[1],u=e[2];if(t&&x){var c=PPx.Extract("%su'"+t+"'");Number(c)>0?("DEBUG"===u&&PPx.Execute("*execute C,*linemessage [DEBUG] keep "+x),PPx.Execute("*string u,"+t+"=0"),PPx.Execute("%Od *ppb -c *wait "+c+"%%:*script "+PPx.ScriptName+","+t+","+x+","+u)):(PPx.Execute('*execute C,*script ":'+x+',ppx_Discard",'+u+","+x),PPx.Execute("*deletecust _User:"+t))}})();