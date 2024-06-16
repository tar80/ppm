﻿function _extends(){return _extends=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)({}).hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},_extends.apply(null,arguments)}var t,e,r,n,validArgs=function(){for(var t=[],e=PPx.Arguments;!e.atEnd();e.moveNext())t.push(e.value);return t},safeArgs=function(){for(var t=[],e=validArgs(),r=0,n=arguments.length;r<n;r++)t.push(_valueConverter(r<0||arguments.length<=r?undefined:arguments[r],e[r]));return t},_valueConverter=function(t,e){if(null==e||""===e)return null!=t?t:undefined;switch(typeof t){case"number":var r=Number(e);return isNaN(r)?t:r;case"boolean":return"false"!==e&&"0"!==e&&null!=e;default:return e}};Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){var r;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var n=Object(this),u=n.length>>>0;if(0===u)return-1;var o=null!=e?e:0;if(Math.abs(o)===Infinity&&(o=0),o>=u)return-1;for(r=Math.max(o>=0?o:u-Math.abs(o),0);r<u;){if(r in n&&n[r]===t)return r;r++}return-1}),Object.keys||(Object.keys=(t=Object.prototype.hasOwnProperty,e=!{toString:null}.propertyIsEnumerable("toString"),n=(r=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(u){if("function"!=typeof u&&("object"!=typeof u||null==u))throw new TypeError("Object.keys: called on non-object");var o,i,a=[];for(o in u)t.call(u,o)&&a.push(o);if(e)for(i=0;i<n;i++)t.call(u,r[i])&&a.push(r[i]);return a})),function(){if("object"!=typeof JSON){JSON={};var t,e,r,n,u=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,i=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,a=/(?:^|:|,)(?:\s*\[)+/g,c=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,l=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,u,o){var i;if(t="",e="","number"==typeof o)for(i=0;i<o;i+=1)e+=" ";else"string"==typeof o&&(e=o);if(n=u,u&&"function"!=typeof u&&("object"!=typeof u||"number"!=typeof u.length))throw new Error("JSON.stringify");return str("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(t,e){var r;function walk(t,r){var n,u,o=t[r];if(o&&"object"==typeof o)for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&((u=walk(o,n))!==undefined?o[n]=u:delete o[n]);return e.call(t,r,o)}if(t=String(t),l.lastIndex=0,l.test(t)&&(t=t.replace(l,(function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))),u.test(t.replace(o,"@").replace(i,"]").replace(a,"")))return r=Function("return ("+t+")")(),"function"==typeof e?walk({"":r},""):r;throw new Error("JSON.parse")})}function f(t){return t<10?"0"+t:t}function quote(t){return c.lastIndex=0,c.test(t)?'"'+t.replace(c,(function(t){var e=r[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+t+'"'}function str(r,u){var o,i,a,c,l,s=t,p=u[r];switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(r)),"function"==typeof n&&(p=n.call(u,r,p)),typeof p){case"string":return quote(p);case"number":return isFinite(p)?String(p):"null";case"boolean":return String(p);case"object":if(!p)return"null";if(t+=e,l=[],"[object Array]"===Object.prototype.toString.apply(p)){for(c=p.length,o=0;o<c;o+=1)l[o]=str(String(o),p)||"null";return a=0===l.length?"[]":t?"[\n"+t+l.join(",\n"+t)+"\n"+s+"]":"["+l.join(",")+"]",t=s,a}if(n&&"object"==typeof n)for(c=n.length,o=0;o<c;o+=1)"string"==typeof n[o]&&(a=str(i=String(n[o]),p))&&l.push(quote(i)+(t?": ":":")+a);else for(i in p)Object.prototype.hasOwnProperty.call(p,i)&&(a=str(i,p))&&l.push(quote(i)+(t?": ":":")+a);return a=0===l.length?"{}":t?"{\n"+t+l.join(",\n"+t)+"\n"+s+"}":"{"+l.join(",")+"}",t=s,a}return"null"}}();var isEmptyStr=function(t){return""===t};PPx.CreateObject("Scripting.FileSystemObject");var parseSource=function(t,e){var r=JSON.parse(e.replace(/\\/g,"\\\\"));return r.path="remote"===r.location?PPx.Extract("%*getcust(S_ppm#global:home)")+"\\repo\\"+t:r.path,_extends({name:t},r)},expandSource=function(t){var e=PPx.Extract("%*getcust(S_ppm#sources:"+t+")");return isEmptyStr(e)?undefined:parseSource(t,e)};PPx.Extract('%sgu"ppmcache"');var main=function(){var t=safeArgs("","path"),e=t[0],r=t[1],n=expandSource(e);if(n){var u=n[r];return null!=u?u:""}return"[error]"};PPx.result=main();
