﻿function t(){return t=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},t.apply(this,arguments)}var e,r,n,o;Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){var r;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var n=Object(this),o=n.length>>>0;if(0===o)return-1;var u=null!=e?e:0;if(Math.abs(u)===Infinity&&(u=0),u>=o)return-1;for(r=Math.max(u>=0?u:o-Math.abs(u),0);r<o;){if(r in n&&n[r]===t)return r;r++}return-1}),Object.keys||(Object.keys=(e=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),o=(n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(t){if("function"!=typeof t&&("object"!=typeof t||null==t))throw new TypeError("Object.keys: called on non-object");var u,f,i=[];for(u in t)e.call(t,u)&&i.push(u);if(r)for(f=0;f<o;f++)e.call(t,n[f])&&i.push(n[f]);return i})),function(){if("object"!=typeof JSON){JSON={};var t,e,r,n,o=/^[\],:{}\s]*$/,u=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,f=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,i=/(?:^|:|,)(?:\s*\[)+/g,a=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,c=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+l(this.getUTCMonth()+1)+"-"+l(this.getUTCDate())+"T"+l(this.getUTCHours())+":"+l(this.getUTCMinutes())+":"+l(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,o,u){var f;if(t="",e="","number"==typeof u)for(f=0;f<u;f+=1)e+=" ";else"string"==typeof u&&(e=u);if(n=o,o&&"function"!=typeof o&&("object"!=typeof o||"number"!=typeof o.length))throw new Error("JSON.stringify");return s("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(t,e){var r;if(t=String(t),c.lastIndex=0,c.test(t)&&(t=t.replace(c,(function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))),o.test(t.replace(u,"@").replace(f,"]").replace(i,"")))return r=Function("return ("+t+")")(),"function"==typeof e?function n(t,r){var o,u,f=t[r];if(f&&"object"==typeof f)for(o in f)Object.prototype.hasOwnProperty.call(f,o)&&((u=n(f,o))!==undefined?f[o]=u:delete f[o]);return e.call(t,r,f)}({"":r},""):r;throw new Error("JSON.parse")})}function l(t){return t<10?"0"+t:t}function p(t){return a.lastIndex=0,a.test(t)?'"'+t.replace(a,(function(t){var e=r[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+t+'"'}function s(r,o){var u,f,i,a,c,l=t,y=o[r];switch(y&&"object"==typeof y&&"function"==typeof y.toJSON&&(y=y.toJSON(r)),"function"==typeof n&&(y=n.call(o,r,y)),typeof y){case"string":return p(y);case"number":return isFinite(y)?String(y):"null";case"boolean":return String(y);case"object":if(!y)return"null";if(t+=e,c=[],"[object Array]"===Object.prototype.toString.apply(y)){for(a=y.length,u=0;u<a;u+=1)c[u]=s(String(u),y)||"null";return i=0===c.length?"[]":t?"[\n"+t+c.join(",\n"+t)+"\n"+l+"]":"["+c.join(",")+"]",t=l,i}if(n&&"object"==typeof n)for(a=n.length,u=0;u<a;u+=1)"string"==typeof n[u]&&(i=s(f=String(n[u]),y))&&c.push(p(f)+(t?": ":":")+i);else for(f in y)Object.prototype.hasOwnProperty.call(y,f)&&(i=s(f,y))&&c.push(p(f)+(t?": ":":")+i);return i=0===c.length?"{}":t?"{\n"+t+c.join(",\n"+t)+"\n"+l+"}":"{"+c.join(",")+"}",t=l,i}return"null"}}();PPx.CreateObject("Scripting.FileSystemObject");var u=function(e){var r=PPx.Extract("%*getcust(S_ppm#sources:"+e+")");return""===r?undefined:function(e,r){var n=JSON.parse(r.replace(/\\/g,"\\\\"));return n.path="remote"===n.location?PPx.Extract("%*getcust(S_ppm#global:home)")+"\\repo\\"+e:n.path,t({name:e},n)}(e,r)};PPx.Extract('%sgu"ppmcache"');var f=function(t){void 0===t&&(t=PPx.Arguments);for(var e=["","path"],r=0,n=t.length;r<n;r++)e[r]=t.Item(r);return{name:e[0],field:e[1]}};PPx.result=function(){var t=f(),e=u(t.name);if(e){var r=e[t.field];return null!=r?r:""}return"[error]"}();
