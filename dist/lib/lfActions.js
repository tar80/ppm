﻿var t=function(t){return""===t},e=function(t){if(t===undefined)return!1;if(null===t)return!0;for(var e in t)return!1;return!0};Array.prototype.removeEmpty||(Array.prototype.removeEmpty=function(){for(var t=[],n=0,r=this.length;n<r;n++){var u=this[n];null!=u&&""!==u&&(u instanceof Array&&0===u.length||u instanceof Object&&e(u)||t.push(u))}return t}),function(){if("object"!=typeof JSON){JSON={};var t,e,n,r,u=/^[\],:{}\s]*$/,i=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,a=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,o=/(?:^|:|,)(?:\s*\[)+/g,f=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,c=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+p(this.getUTCMonth()+1)+"-"+p(this.getUTCDate())+"T"+p(this.getUTCHours())+":"+p(this.getUTCMinutes())+":"+p(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(n={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(n,u,i){var a;if(t="",e="","number"==typeof i)for(a=0;a<i;a+=1)e+=" ";else"string"==typeof i&&(e=i);if(r=u,u&&"function"!=typeof u&&("object"!=typeof u||"number"!=typeof u.length))throw new Error("JSON.stringify");return l("",{"":n})}),"function"!=typeof JSON.parse&&(JSON.parse=function(t,e){var n;if(t=String(t),c.lastIndex=0,c.test(t)&&(t=t.replace(c,(function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))),u.test(t.replace(i,"@").replace(a,"]").replace(o,"")))return n=Function("return ("+t+")")(),"function"==typeof e?function r(t,n){var u,i,a=t[n];if(a&&"object"==typeof a)for(u in a)Object.prototype.hasOwnProperty.call(a,u)&&((i=r(a,u))!==undefined?a[u]=i:delete a[u]);return e.call(t,n,a)}({"":n},""):n;throw new Error("JSON.parse")})}function p(t){return t<10?"0"+t:t}function s(t){return f.lastIndex=0,f.test(t)?'"'+t.replace(f,(function(t){var e=n[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+t+'"'}function l(n,u){var i,a,o,f,c,p=t,h=u[n];switch(h&&"object"==typeof h&&"function"==typeof h.toJSON&&(h=h.toJSON(n)),"function"==typeof r&&(h=r.call(u,n,h)),typeof h){case"string":return s(h);case"number":return isFinite(h)?String(h):"null";case"boolean":return String(h);case"object":if(!h)return"null";if(t+=e,c=[],"[object Array]"===Object.prototype.toString.apply(h)){for(f=h.length,i=0;i<f;i+=1)c[i]=l(String(i),h)||"null";return o=0===c.length?"[]":t?"[\n"+t+c.join(",\n"+t)+"\n"+p+"]":"["+c.join(",")+"]",t=p,o}if(r&&"object"==typeof r)for(f=r.length,i=0;i<f;i+=1)"string"==typeof r[i]&&(o=l(a=String(r[i]),h))&&c.push(s(a)+(t?": ":":")+o);else for(a in h)Object.prototype.hasOwnProperty.call(h,a)&&(o=l(a,h))&&c.push(s(a)+(t?": ":":")+o);return o=0===c.length?"{}":t?"{\n"+t+c.join(",\n"+t)+"\n"+p+"}":"{"+c.join(",")+"}",t=p,o}return"null"}}();var n=function(t){if(1===t.length)return{name:t[0].slice(1,-1)};for(var e={name:t[0],sname:t[1]},n=2,r=t.length,u=/^([^:]+):["H]?(.+)$/;n<r;n++)t[n].replace(u,(function(t,n,r){return"T"===n&&(r=r.slice(0,-1)),e[n]=r,""}));return e},r=PPx.CreateObject("Scripting.FileSystemObject"),u="jp",i=function(t,e){try{var n;return[!1,null!=(n=e())?n:""]}catch(r){return[!0,""]}finally{t.Close()}},a=function(e){var n=e.path,u=e.enc,a=function(t){var e=t.path,n=t.enc,u=void 0===n?"utf8":n;if(!r.FileExists(e))return[!0,e+" not found"];var a=r.GetFile(e);if(0===a.Size)return[!0,e+" has no data"];var o=!1,f="";if("utf8"===u){var c=PPx.CreateObject("ADODB.Stream"),p=i(c,(function(){return c.Open(),c.Charset="UTF-8",c.LoadFromFile(e),c.ReadText(-1)}));o=p[0],f=p[1]}else{var s="utf16le"===u?-1:0,l=a.OpenAsTextStream(1,s),h=i(l,(function(){return l.ReadAll()}));o=h[0],f=h[1]}return o?[!0,"Unable to read "+e]:[!1,f]}({path:n,enc:void 0===u?"utf8":u}),o=a[0],f=a[1];if(o)return[!0,f];var c=function(t){var e="\n",n=t.indexOf("\r");return~n&&(e="\r\n"==t.substring(n,n+2)?"\r\n":"\r"),e}(f.slice(0,1e3)),p=f.split(c);return t(p[p.length-1])&&p.pop(),[!1,{lines:p,nl:c}]};r.FileExists(PPx.Extract("%OR %FDC"))&&PPx.Quit(1);var o="@#_#@",f={en:{noAction:"No action registered"},jp:{noAction:"対応するコマンドが登録されていません"}}[function(){var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===t||"jp"===t?t:u}()],c=function(t){void 0===t&&(t=PPx.Arguments);for(var e=["*ppv","enclose","0","utf8"],n=0,r=t.length;n<r;n++)e[n]=t.Item(n);return/enclose|escape|double/.test(e[1])||(e[1]="enclose"),/sjis|utf16le|utf8/.test(e[3])||(e[3]="utf8"),{act:e[0],spc:e[1],dup:"0"!==e[2],enc:e[3]}},p=function(t){return{enclose:function(t){return'"'+t+'"'},double:function(t){return'""'+t+'""'},escape:function(t){return t.replace(/\s/g,"\\ ")}}[t]},s=function(t){var e,n,r,u=t.cmdline,i=t.base,a=t.dirtype,f=t.isDup,c=t.path,p=t.search,s=t.entry,l=null!=(e=s.A)?e:"",h=null!=(n=s.H)?n:"",g=null!=(r=s.T)?r:"",y="base:"+i+o+"dirtype:"+a+o+"search:"+p+o+"dup:"+f+o+"path:"+c+o+"att:"+l+o+"hl:"+h+o+"comment:"+g;return PPx.Extract('%%OP %*regexp("%('+y+'%)","%(/base:(?<base>.*)@#_#@type:(?<type>.*)@#_#@search(?<search>.*)@#_#@dup:(?<dup>.+)@#_#@path:(?<path>.+)@#_#@att:(?<att>.*)@#_#@hl:(?<hl>.*)@#_#@comment:(?<comment>.*)/'+u+'/%)")')};!function(){var e,u=function(){var t,e,n=PPx.ScriptName;return~n.indexOf("\\")?(t=n.replace(/^.*\\/,""),e=PPx.Extract("%*name(DKN,"+n+")")):(t=n,e=PPx.Extract("%FDN")),{scriptName:t,parentDir:e.replace(/\\$/,"")}}(),i=u.scriptName,l=c(),h=PPx.Extract("%FDV"),g=a({path:h,enc:l.enc}),y=g[0],v=g[1];(function(t,e){return t&&"string"==typeof e})(y,v)&&(PPx.report("[ppm/"+i+"] "+v),PPx.Quit(-1));var x=function(t){for(var e={},n=/^;([^=]+)=(.+)$/,r=0,u=t.length;r<u&&0===t[r].indexOf(";");r++)t[r].replace(n,(function(t,n,r){return e[n.toLowerCase()]=r,""}));return e}(v.lines),P=x.base.split("|"),d=P[0],b=P[1],m=PPx.Extract("%#;X").split(";"),O=PPx.Extract("%*getcust(S_ppm#actions:"+x.ppm+"_"+l.act+")").replace(/[\r\n]/g,(function(t){return{"\r":"%br","\n":"%bl"}[t]}));t(O)&&(PPx.report("[ppm/"+i+"] "+f.noAction),PPx.Quit(-1));for(var S,j="every"===x.freq,E=null!=(e=x.search)?e:"",N=p(l.spc),A=function(){var t=[],e=/^"(.+)",(A:H.+)(,T:".+")?(,Size,.+)?$/,n=function(e,n,r,u){var i=n.split('","'),a=r.split(","),o=u?[u.slice(1)]:[];return t=[].concat(i,a,o),""};return function(r){t=[r];var u=r.indexOf(",Size,");return~u&&(r=r.substring(0,u)),r.replace(e,n),t}}(),F=j?function(t){var e=t.path,n=t.entry,r=t.isDup;return PPx.Execute("%OP- *execute ,"+s({cmdline:O,base:d,dirtype:b,isDup:r,path:e,search:E,entry:n}))}:function(t){var e=t.path;return D.push(e)},D=[],C={},T=0,J=m.length;T<J;T++)for(var _=0,w=v.lines;_<w.length;_++){var U=w[_];if(~U.indexOf(m[T])){var $=n(A(U));if($&&$.sname&&r.FileExists($.sname)){var H=d+"\\"+$.sname;~H.indexOf(" ")&&(H=N(H)),S=C[H]||"0",(l.dup||"0"===S)&&(C[H]="1",F({path:H,entry:$,isDup:S}))}break}}if(!j){var I="search:"+E+o+"path:"+D.join(" ");PPx.Execute('%OP *execute ,%%OP- %*regexp("%('+I+'%)","%(/^search:(?<search>.*)@#_#@path:(?<path>.+)$/'+O+'/%)")')}PPx.Quit(-1)}();