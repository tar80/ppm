﻿var e,r,t,n;Object.keys||(Object.keys=(e=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),n=(t=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(i){if("function"!=typeof i&&("object"!=typeof i||null==i))throw new TypeError("Object.keys: called on non-object");var a,o,u=[];for(a in i)e.call(i,a)&&u.push(a);if(r)for(o=0;o<n;o++)e.call(i,t[o])&&u.push(t[o]);return u}));var i={ppmName:"ppx-plugin-manager",ppmVersion:.95,language:"ja",nlcode:"\r\n",nltype:"crlf",ppmID:"P",ppmSubID:"Q"},useLanguage=function(){var e=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===e||"ja"===e?e:i.language},tmp=function(){var e=PPx.Extract('%*extract(C,"%%*temp()")');return{dir:e,file:e+"_ppmtemp",lf:e+"_temp.xlf",stdout:e+"_stdout",stderr:e+"_stderr",ppmDir:function(){var e=PPx.Extract("%'temp'%\\ppm");return PPx.Execute("*makedir "+e),e}}},properties=function(e){for(var r=PPx.Extract("%*getcust("+e+")").split(i.nlcode),t={},n=/^([^,=]+)([,=])\s*(.*)/,a="",o=1,u=r.length-2;o<u;o++){""!==r[o].replace(n,(function(e,r,n,i){return a=r.replace(/[\s\uFEFF\xA0]+$/,""),t[a]={sep:n,value:[i]},""}))&&t[a].value.push(r[o].replace(/^\s*/,""))}return t},isEmptyObj=function(e){if(e===undefined)return!1;if(null===e)return!0;for(var r in e)return!1;return!0},a={TypeToCode:{crlf:"\r\n",cr:"\r",lf:"\n"},CodeToType:{"\r\n":"crlf","\r":"cr","\n":"lf"},Ppx:{lf:"%%bl",cr:"%%br",crlf:"%%bn",unix:"%%bl",mac:"%%br",dos:"%%bn","\n":"%%bl","\r":"%%br","\r\n":"%%bn"},Ascii:{lf:"10",cr:"13",crlf:"-1",unix:"10",mac:"13",dos:"-1","\n":"10","\r":"13","\r\n":"-1"}},pathSelf=function(){var e,r,t=PPx.ScriptName;return~t.indexOf("\\")?(e=t.replace(/^.*\\/,""),r=PPx.Extract("%*name(DKN,"+t+")")):(e=t,r=PPx.Extract("%FDN")),{scriptName:e,parentDir:r.replace(/\\$/,"")}},o=PPx.CreateObject("Scripting.FileSystemObject"),isCV8=function(){return"ClearScriptV8"===PPx.ScriptEngineName},exec=function(e,r){try{var t;return[!1,null!=(t=r())?t:""]}catch(n){return[!0,""]}finally{e.Close()}},writeLines=function(e){var r=e.path,t=e.data,n=e.enc,u=void 0===n?"utf8":n,l=e.append,s=void 0!==l&&l,c=e.overwrite,p=void 0!==c&&c,f=e.linefeed,P=void 0===f?i.nlcode:f;if(!p&&!s&&o.FileExists(r))return[!0,r+" already exists"];var x,d=o.GetParentFolderName(r);if(o.FolderExists(d)||PPx.Execute("*makedir "+d),"utf8"===u){if(isCV8()){var m=t.join(P),v=s?"AppendAllText":"WriteAllText";return[!1,NETAPI.System.IO.File[v](r,m)]}var h=p||s?2:1,b=PPx.CreateObject("ADODB.Stream");x=exec(b,(function(){b.Open(),b.Charset="UTF-8",b.LineSeparator=Number(a.Ascii[P]),s?(b.LoadFromFile(r),b.Position=b.Size,b.SetEOS):b.Position=0,b.WriteText(t.join(P),1),b.SaveToFile(r,h)}))[0]}else{var g=s?8:p?2:1;o.FileExists(r)||PPx.Execute("%Osq *makefile "+r);var y="utf16le"===u?-1:0,E=o.GetFile(r).OpenAsTextStream(g,y);x=exec(E,(function(){E.Write(t.join(P)+P)}))[0]}return x?[!0,"Could not write to "+r]:[!1,""]},validArgs=function(){for(var e=[],r=PPx.Arguments;!r.atEnd();r.moveNext())e.push(r.value);return e},safeArgs=function(){for(var e=[],r=validArgs(),t=0,n=arguments.length;t<n;t++)e.push(_valueConverter(t<0||arguments.length<=t?undefined:arguments[t],r[t]));return e},_valueConverter=function(e,r){if(null==r||""===r)return null!=e?e:undefined;switch(typeof e){case"number":var t=Number(r);return isNaN(t)?e:t;case"boolean":return"false"!==r&&"0"!==r&&null!=r;default:return r}},main=function(){var e=safeArgs("insert","",-1,undefined,""),r=e[0],t=e[1],n=e[2],i=e[3],a=e[4];if(null==i){var o=pathSelf(),s=o.scriptName,c=o.parentDir;PPx.Execute('*script "'+c+'\\errors.js",args,'+s),PPx.Quit(1)}var p=properties(t);if(isEmptyObj(p))return u.noProps;if(null!=p[i]){if("insert"===r)return u.hasProp}else if("insert"!==r)return t+" "+u.notHasProp;var f=rebuildMenu(t,p),P=Math.max(1,n<0?f.length+n:Math.floor(n)),x=i+"\t= "+a,d=l[r](f,P,x),m=tmp().file,v=writeLines({path:m,data:d,overwrite:!0}),h=v[0],b=v[1];return h?b:(PPx.Execute("*setcust @"+m),u.finish)},u={en:{noProps:"No property",hasProp:"Property already exists",notHasProp:"is missing",finish:"Menu has been regenerated. Please restart PPx"},ja:{noProps:"項目がありません",hasProp:"すでに項目があります",notHasProp:"はありません",finish:"メニューを再生成しました。PPxを再起動してください"}}[useLanguage()],rebuildMenu=function(e,r){for(var t=["-|"+e+" ="+i.nlcode+e+"\t= {"],n=0,a=Object.keys(r);n<a.length;n++){var o=a[n];t.push(o+"\t"+r[o].sep+" "+r[o].value.join(i.nlcode))}return t.push("}"),t},l={insert:function(e,r,t){return e.splice(r,0,t),e},replace:function(e,r,t){return e.splice(r,1,t),e},"delete":function(e,r,t){return e.splice(r-1,1),e}};PPx.result=main();
