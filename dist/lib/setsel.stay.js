﻿var isEmptyStr=function(e){return""===e},isZero=function(e){return"string"==typeof e?"0"===e:0===e},pathSelf=function(){var e,t,n=PPx.ScriptName;return~n.indexOf("\\")?(e=n.replace(/^.*\\/,""),t=PPx.Extract("%*name(DKN,"+n+")")):(e=n,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}},validArgs=function(){for(var e=[],t=PPx.Arguments;!t.atEnd();t.moveNext())e.push(t.value);return e},safeArgs=function(){for(var e=[],t=validArgs(),n=0,r=arguments.length;n<r;n++)e.push(_valueConverter(n<0||arguments.length<=n?undefined:arguments[n],t[n]));return e},_valueConverter=function(e,t){if(null==t||""===t)return null!=e?e:undefined;switch(typeof e){case"number":var n=Number(t);return isNaN(n)?e:n;case"boolean":return"false"!==t&&"0"!==t&&null!=t;default:return t}},ppx_Discard=function(e,t){var n;PPx.StayMode=0,t=null!=(n=t)?n:"","DEBUG"===e&&PPx.linemessage("[DEBUG] discard "+t)},e={hold:function(e,t){void 0===t&&(t="0");var n=PPx.Extract("%N"),r='KC_main:ACTIVEEVENT,*script ":'+PPx.StayMode+',ppx_Discard",'+t+","+e+"%%:*linecust "+e+"_"+n+",KC_main:ACTIVEEVENT,";PPx.Execute("*linecust "+e+"_"+n+","+r)}},main=function(){var t=safeArgs("","0",""),n=t[0],r=t[1],a=t[2];if(isEmptyStr(n)||n.split(")").length<3){var i=pathSelf(),u=i.scriptName,c=i.parentDir;PPx.Execute('*script "'+c+'\\errors.js",arg,'+u),PPx.Quit(-1)}"1"===a&&(PPx.StayMode=2,e.hold("ppm_setsel")),ppx_resume(n,r)},ppx_finally=function(){return PPx.Echo("[WARN] instance remain setsel.stay.js")},ppx_resume=function(e,t){var n=PPx.Extract("%*edittext()"),r=isZero(t)?selectSingle(n,e):selectMulti(n,e);r&&r.w!==r.l&&PPx.Execute("*sendmessage %N,177,"+r.w+","+r.l)},selectSingle=function(e,t){var n=RegExp(t),r=e.match(n);if(r){var a=r[1].length;return{w:a,l:a+r[2].length}}},selectMulti=function(e,t){var n=Number(PPx.Extract("%*editprop(start)")),r=e.slice(0,n),a=e.slice(n),i=RegExp(t.slice(0,t.lastIndexOf(")")+1),"m"),u=RegExp(t.slice(t.lastIndexOf("(")),"m"),c=!1,l=r.replace(i,(function(e,t){return c=!0,t})).length;return{w:c||l!==n?l:0,l:n+a.replace(u,"$1").length}};main();
