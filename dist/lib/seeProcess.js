﻿var validArgs=function(){for(var e=[],r=PPx.Arguments;!r.atEnd();r.moveNext())e.push(r.value);return e},safeArgs=function(){for(var e=[],r=validArgs(),t=0,n=arguments.length;t<n;t++)e.push(_valueConverter(t<0||arguments.length<=t?undefined:arguments[t],r[t]));return e},_valueConverter=function(e,r){if(null==r||""===r)return null!=e?e:undefined;switch(typeof e){case"number":var t=Number(r);return Number.isNaN(t)?e:t;case"boolean":return null!=r&&"false"!==r&&"0"!==r;default:return r}},isEmptyStr=function(e){return""===e},pathSelf=function(){var e,r,t=PPx.ScriptName;return~t.indexOf("\\")?(e=extractFileName(t),r=PPx.Extract("%*name(DKN,"+t+")")):(e=t,r=PPx.Extract("%FDN")),{scriptName:e,parentDir:r.replace(/\\$/,"")}},extractFileName=function(e,r){return void 0===r&&(r="\\"),"\\"!==r&&"/"!==r&&(r="\\"),e.slice(e.lastIndexOf(r)+1)},e=6e3,r=500,main=function(){var t=PPx.CreateObject("WScript.Shell"),n=safeArgs(undefined,e,"",1),a=n[0],u=n[1],i=n[2],c=n[3];if(null==a){var o=pathSelf(),f=o.scriptName,P=o.parentDir;PPx.Execute("*script "+P+'\\errors.js",arg,'+f),PPx.Quit(-1)}var l=/.+\.exe$/i.test(a)?a:a+".exe",x=processRunning(l);if(PPx.result=x,u>0&&!x){var s=isEmptyStr(i)?l:i;t.Run(s,c);for(var m=0,v=0,d=0,p=r;;){if(m+=r,PPx.Execute("*wait "+(p-Math.floor(p/10))+",2"),m>=u){PPx.linemessage('!"Abort. Waiting time exceeded');break}if(v=Date.now(),x=processRunning(l),d=Date.now(),x)break;p=r-(d-v)}}},t=PPx.CreateObject("WbemScripting.SWbemLocator").ConnectServer(),processRunning=function(e){return t.ExecQuery('SELECT Name FROM Win32_Process WHERE Name = "'+e+'"').Count>0};main();
