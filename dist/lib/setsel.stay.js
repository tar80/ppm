﻿var validArgs=function(){for(var e=[],t=PPx.Arguments;!t.atEnd();t.moveNext())e.push(t.value);return e},safeArgs=function(){for(var e=[],t=validArgs(),n=0,r=arguments.length;n<r;n++)e.push(_valueConverter(n<0||arguments.length<=n?undefined:arguments[n],t[n]));return e},_valueConverter=function(e,t){if(null==t||""===t)return null!=e?e:undefined;switch(typeof e){case"number":var n=Number(t);return isNaN(n)?e:n;case"boolean":return null!=t&&"false"!==t&&"0"!==t;default:return t}},isEmptyStr=function(e){return""===e},isZero=function(e){return null!=e&&("0"===e||0===e)},pathSelf=function(){var e,t,n=PPx.ScriptName;return~n.indexOf("\\")?(e=extractFileName(n),t=PPx.Extract("%*name(DKN,"+n+")")):(e=n,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}},extractFileName=function(e,t){return void 0===t&&(t="\\"),"\\"!==t&&"/"!==t&&(t="\\"),e.slice(e.lastIndexOf(t)+1)},e=pathSelf(),t=e.scriptName,n=e.parentDir,main=function(){var e=safeArgs("","0","0"),r=e[0],u=e[1],a=e[2];(isEmptyStr(r)||r.split(")").length<3)&&(PPx.Execute('*script "'+n+'\\errors.js",arg,'+t),PPx.Quit(-1)),isZero(a)||(PPx.StayMode=2),ppx_resume(r,u)},ppx_resume=function(e,t){var n=PPx.Extract("%*edittext()"),r=isZero(t)?selectSingle(n,e):selectMulti(n,e);r&&r.w!==r.l&&PPx.Execute("*sendmessage %N,177,"+r.w+","+r.l)},selectSingle=function(e,t){var n=RegExp(t),r=e.match(n);if(r){var u=r[1].length;return{w:u,l:u+r[2].length}}},selectMulti=function(e,t){var n=Number(PPx.Extract("%*editprop(start)")),r=e.slice(0,n),u=e.slice(n),a=RegExp(t.slice(0,t.lastIndexOf(")")+1),"m"),i=RegExp(t.slice(t.lastIndexOf("(")),"m"),l=!1,c=r.replace(a,(function(e,t){return l=!0,t})).length;return{w:l||c!==n?c:0,l:n+u.replace(i,"$1").length}};main();
