﻿var validArgs=function(){for(var t=[],e=PPx.Arguments;!e.atEnd();e.moveNext())t.push(e.value);return t},safeArgs=function(){for(var t=[],e=validArgs(),n=0,u=arguments.length;n<u;n++)t.push(_valueConverter(n<0||arguments.length<=n?undefined:arguments[n],e[n]));return t},_valueConverter=function(t,e){if(null==e||""===e)return null!=t?t:undefined;switch(typeof t){case"number":var n=Number(e);return isNaN(n)?t:n;case"boolean":return null!=e&&"false"!==e&&"0"!==e;default:return e}},isEmptyStr=function(t){return""===t},t=PPx.Extract("%n#")||PPx.Extract("%n");isEmptyStr(t)&&PPx.Quit(-1);var main=function(){var e=safeArgs(90,80),n=e[0],u=e[1],r=PPx.Extract("%*getcust(X_bg:O_"+t+")");/^(100)?$/.test(r)?toggleOpacity(n):Number(r)>u?toggleOpacity(u):toggleOpacity(100)},toggleOpacity=function(e){100===e?PPx.Execute("*deletecust X_bg:O_"+t+'%:%K"@LOADCUST"'):PPx.Execute("*customize X_bg:O_"+t+"="+e)};main();
