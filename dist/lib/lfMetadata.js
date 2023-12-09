﻿var t,e,r,n;Object.keys||(Object.keys=(t=Object.prototype.hasOwnProperty,e=!{toString:null}.propertyIsEnumerable("toString"),n=(r=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(u){if("function"!=typeof u&&("object"!=typeof u||null==u))throw new TypeError("Object.keys: called on non-object");var o,i,f=[];for(o in u)t.call(u,o)&&f.push(o);if(e)for(i=0;i<n;i++)t.call(u,r[i])&&f.push(r[i]);return f}));var u=function(t){if(t===undefined)return!1;if(null===t)return!0;for(var e in t)return!1;return!0};Array.prototype.removeEmpty||(Array.prototype.removeEmpty=function(){for(var t=[],e=0,r=this.length;e<r;e++){var n=this[e];null!=n&&""!==n&&(n instanceof Array&&0===n.length||n instanceof Object&&u(n)||t.push(n))}return t}),function(){if("object"!=typeof JSON){JSON={};var t,e,r,n,u=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,i=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,f=/(?:^|:|,)(?:\s*\[)+/g,a=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,c=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+l(this.getUTCMonth()+1)+"-"+l(this.getUTCDate())+"T"+l(this.getUTCHours())+":"+l(this.getUTCMinutes())+":"+l(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,u,o){var i;if(t="",e="","number"==typeof o)for(i=0;i<o;i+=1)e+=" ";else"string"==typeof o&&(e=o);if(n=u,u&&"function"!=typeof u&&("object"!=typeof u||"number"!=typeof u.length))throw new Error("JSON.stringify");return p("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(t,e){var r;if(t=String(t),c.lastIndex=0,c.test(t)&&(t=t.replace(c,(function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))),u.test(t.replace(o,"@").replace(i,"]").replace(f,"")))return r=Function("return ("+t+")")(),"function"==typeof e?function n(t,r){var u,o,i=t[r];if(i&&"object"==typeof i)for(u in i)Object.prototype.hasOwnProperty.call(i,u)&&((o=n(i,u))!==undefined?i[u]=o:delete i[u]);return e.call(t,r,i)}({"":r},""):r;throw new Error("JSON.parse")})}function l(t){return t<10?"0"+t:t}function s(t){return a.lastIndex=0,a.test(t)?'"'+t.replace(a,(function(t){var e=r[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+t+'"'}function p(r,u){var o,i,f,a,c,l=t,y=u[r];switch(y&&"object"==typeof y&&"function"==typeof y.toJSON&&(y=y.toJSON(r)),"function"==typeof n&&(y=n.call(u,r,y)),typeof y){case"string":return s(y);case"number":return isFinite(y)?String(y):"null";case"boolean":return String(y);case"object":if(!y)return"null";if(t+=e,c=[],"[object Array]"===Object.prototype.toString.apply(y)){for(a=y.length,o=0;o<a;o+=1)c[o]=p(String(o),y)||"null";return f=0===c.length?"[]":t?"[\n"+t+c.join(",\n"+t)+"\n"+l+"]":"["+c.join(",")+"]",t=l,f}if(n&&"object"==typeof n)for(a=n.length,o=0;o<a;o+=1)"string"==typeof n[o]&&(f=p(i=String(n[o]),y))&&c.push(s(i)+(t?": ":":")+f);else for(i in y)Object.prototype.hasOwnProperty.call(y,i)&&(f=p(i,y))&&c.push(s(i)+(t?": ":":")+f);return f=0===c.length?"{}":t?"{\n"+t+c.join(",\n"+t)+"\n"+l+"}":"{"+c.join(",")+"}",t=l,f}return"null"}}();var o=PPx.CreateObject("Scripting.FileSystemObject"),i=function(t,e){try{var r;return[!1,null!=(r=e())?r:""]}catch(n){return[!0,""]}finally{t.Close()}},f=function(t){var e=t.path,r=t.enc,n=function(t){var e=t.path,r=t.enc,n=void 0===r?"utf8":r;if(!o.FileExists(e))return[!0,e+" not found"];var u=o.GetFile(e);if(0===u.Size)return[!0,e+" has no data"];var f=!1,a="";if("utf8"===n){var c=PPx.CreateObject("ADODB.Stream"),l=i(c,(function(){return c.Open(),c.Charset="UTF-8",c.LoadFromFile(e),c.ReadText(-1)}));f=l[0],a=l[1]}else{var s="utf16le"===n?-1:0,p=u.OpenAsTextStream(1,s),y=i(p,(function(){return p.ReadAll()}));f=y[0],a=y[1]}return f?[!0,"Unable to read "+e]:[!1,a]}({path:e,enc:void 0===r?"utf8":r}),u=n[0],f=n[1];if(u)return[!0,f];var a=function(t){var e="\n",r=t.indexOf("\r");return~r&&(e="\r\n"==t.substring(r,r+2)?"\r\n":"\r"),e}(f.slice(0,1e3)),c=f.split(a);return""===c[c.length-1]&&c.pop(),[!1,{lines:c,nl:a}]},a=function(t){void 0===t&&(t=PPx.Arguments);for(var e=["","Base","utf8"],r=0,n=t.length;r<n;r++)e[r]=t.Item(r);return/sjis|utf16le/.test(e[2])||(e[2]="utf8"),{path:e[0],id:e[1],enc:e[2]}},c=function(t){for(var e=[],r=0,n=Object.keys(t);r<n.length;r++){var u=n[r];e.push('"'+u+'":"'+(t[u].replace(/["\\]/g,(function(t){return{'"':'\\"',"\\":"\\\\"}[t]}))+'"'))}return"{"+e.join(",")+"}"};!function(){var t=a(),e=f({path:t.path,enc:t.enc}),r=e[0],n=e[1];if(function(t,e){return t&&"string"==typeof e}(r,n)){var u=function(){var t,e,r=PPx.ScriptName;return~r.indexOf("\\")?(t=r.replace(/^.*\\/,""),e=PPx.Extract("%*name(DKN,"+r+")")):(t=r,e=PPx.Extract("%FDN")),{scriptName:t,parentDir:e.replace(/\\$/,"")}}(),o=u.scriptName;PPx.report("[ppm/"+o+"] "+n),PPx.Quit(-1)}var i=function(t){for(var e={},r=/^;([^=]+)=(.+)$/,n=0,u=t.length;n<u&&0===t[n].indexOf(";");n++)t[n].replace(r,(function(t,r,n){if("Base"===r){var u=n.split("|");e.base=u[0],e.dirtype=u[1]}else e[r.toLowerCase()]=n;return""}));return e}(n.lines),l="ppmlfmetadata,KC_main:LOADEVENT";PPx.setIValue("meta",c(i)),PPx.Execute("*linecust "+l+',*if ("%%n"=="%n") && (4!=%%*js("PPx.result=PPx.DirectoryType"))%%:*string i,meta=%%:*linecust '+l+","),PPx.result=i[t.id]}();
