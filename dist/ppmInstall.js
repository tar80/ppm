﻿function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},e.apply(this,arguments)}var t,r,n,i;Object.keys||(Object.keys=(t=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),i=(n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(e){if("function"!=typeof e&&("object"!=typeof e||null==e))throw new TypeError("Object.keys: called on non-object");var o,a,u=[];for(o in e)t.call(e,o)&&u.push(o);if(r)for(a=0;a<i;a++)t.call(e,n[a])&&u.push(n[a]);return u}));var o=PPx.CreateObject("Scripting.FileSystemObject"),a=function(e,t,r){void 0===t&&(t=!0),void 0===r&&(r=!1);var n,i=!1,a="";try{n=o.CreateTextFile(e,t,r)}catch(s){var u=[!0,s.message];i=u[0],a=u[1]}finally{n&&n.Close()}return[i,a]},u=function(e,t,r,n,i,a){try{o[e](t,r,a)}catch(u){return n&&o.DeleteFolder(i),[!0,"Could not create "+r]}return[!1,""]},s=function(e,t,r){var n=!1;if(!o.FileExists(e))return[!0,e+" is not exist"];var i=o.GetParentFolderName(t);return o.FolderExists(i)||(o.CreateFolder(i),n=!0),u("CopyFile",e,t,n,i,r)},c=function(e,t,r){var n=!1;if(!o.FolderExists(e))return[!0,e+" is not exist"];var i=o.GetParentFolderName(t);return o.FolderExists(i)||(o.CreateFolder(i),n=!0),u("CopyFolder",e,t,n,i,r)},p="ppx-plugin-manager",l=.93,f="jp",x="\r\n",d="P",g={ppxVersion:19400,codeType:2,scriptType:0,scriptModule:function(){return"ClearScriptV8"===PPx.ScriptEngineName?3:21},modules:["ppxkey","ppxmes","ppxtext"],executables:["git"]},v="_initial.cfg",m="_global.cfg",h="_pluginlist",P="K_ppmTemp",b=function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")},E=function(){var e=PPx.Extract('%*extract(C,"%%*temp()")');return{dir:e,file:e+"_ppmtemp",lf:e+"_temp.xlf",stdout:e+"_stdout",stderr:e+"_stderr",ppmDir:function(){var e=PPx.Extract("%'temp'%\\ppm");return PPx.Execute("*makedir "+e),e}}},y=function(e){return"string"==typeof e},O=function(e){return""===e},S=function(e){if(e===undefined)return!1;if(null===e)return!0;for(var t in e)return!1;return!0},w=function(e,t){return e&&"string"==typeof t},C=function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e},j={TypeToCode:{crlf:"\r\n",cr:"\r",lf:"\n"},CodeToType:{"\r\n":"crlf","\r":"cr","\n":"lf"},Ppx:{lf:"%%bl",cr:"%%br",crlf:"%%bn",unix:"%%bl",mac:"%%br",dos:"%%bn","\n":"%%bl","\r":"%%br","\r\n":"%%bn"},Ascii:{lf:"10",cr:"13",crlf:"-1",unix:"10",mac:"13",dos:"-1","\n":"10","\r":"13","\r\n":"-1"}},N=function(){for(var e=[],t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];for(var i=0;i<r.length;i++){var o=r[i];O(o)||e.push(o)}return e.join("\\")||""};Array.prototype.removeEmpty||(Array.prototype.removeEmpty=function(){for(var e=[],t=0,r=this.length;t<r;t++){var n=this[t];null!=n&&""!==n&&(n instanceof Array&&0===n.length||n instanceof Object&&S(n)||e.push(n))}return e});var _,k=function(e,t){void 0===t&&(t=!1);var r="00";return e&&(r=1===e.length?"0"+e:e),t&&"00"===r&&(r="0."),r},F=function(e){var t=String(e).split(".");return t[0]=k(t[0],!0),t[1]=k(t[1]),t[2]=k(t[2]),Number([t[0],t[1],t[2]].join(""))},T=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},R=function(e){var t=e.path,r=e.enc,n=void 0===r?"utf8":r;if(!o.FileExists(t))return[!0,t+" not found"];var i=o.GetFile(t);if(0===i.Size)return[!0,t+" has no data"];var a=!1,u="";if("utf8"===n){var s=PPx.CreateObject("ADODB.Stream"),c=T(s,(function(){return s.Open(),s.Charset="UTF-8",s.LoadFromFile(t),s.ReadText(-1)}));a=c[0],u=c[1]}else{var p="utf16le"===n?-1:0,l=i.OpenAsTextStream(1,p),f=T(l,(function(){return l.ReadAll()}));a=f[0],u=f[1]}return a?[!0,"Unable to read "+t]:[!1,u]},V=function(e){var t=e.path,r=e.enc,n=R({path:t,enc:void 0===r?"utf8":r}),i=n[0],o=n[1];if(i)return[!0,o];var a=function(e){var t="\n",r=e.indexOf("\r");return~r&&(t="\r\n"==e.substring(r,r+2)?"\r\n":"\r"),t}(o.slice(0,1e3)),u=o.split(a);return O(u[u.length-1])&&u.pop(),[!1,{lines:u,nl:a}]},A=function(e){var t=e.path,r=e.data,n=e.enc,i=void 0===n?"utf8":n,a=e.append,u=void 0!==a&&a,s=e.overwrite,c=void 0!==s&&s,p=e.linefeed,l=void 0===p?x:p;if(!c&&!u&&o.FileExists(t))return[!0,t+" already exists"];var f,d=o.GetParentFolderName(t);if(o.FolderExists(d)||PPx.Execute("*makedir "+d),"utf8"===i){if("ClearScriptV8"===PPx.ScriptEngineName){var g=r.join(l),v=u?"AppendAllText":"WriteAllText";return[!1,NETAPI.System.IO.File[v](t,g)]}var m=c||u?2:1,h=PPx.CreateObject("ADODB.Stream");f=T(h,(function(){h.Open(),h.Charset="UTF-8",h.LineSeparator=Number(j.Ascii[l]),u?(h.LoadFromFile(t),h.Position=h.Size,h.SetEOS):h.Position=0,h.WriteText(r.join(l),1),h.SaveToFile(t,m)}))[0]}else{var P=u?8:c?2:1,b="utf16le"===i?-1:0,E=o.GetFile(t).OpenAsTextStream(P,b);f=T(E,(function(){E.Write(r.join(l)+l)}))[0]}return f?[!0,"Could not write to "+t]:[!1,""]},I=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,D=function(e,t){if(0===t.indexOf("@")){if(t=PPx.Extract(t).substring(1),!o.FileExists(t))return 2}else if(!e.test(t))return 13;return 0},$=function(e,t,r){return void 0===t&&(t=""),t=O(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+r+'"')},M=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},U=function(e){return"."!==e},J={lang:f},B=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return J[e]=t,t},L="K_ppmTemp",G={echo:function(e,t,r){var n=r?"("+String(r)+")":"";return $("I",""+e,""+t+n)},question:function(e,t){return $("Q",""+e,t)},choice:function(e,t,r,n,i,o,a){void 0===n&&(n="ynC");var u="Mes0411",s=u+":IMYE",c=u+":IMNO",p=u+":IMTC",l="."===e,f=l?'%K"@LOADCUST"':'%%K"@LOADCUST"',x=[],d=x[0],g=x[1],v=x[2],m="",h="",P="",b=!1;i&&(d=PPx.Extract("%*getcust("+s+")"),m="*setcust "+s+"="+i+"%:",b=!0),o&&(g=PPx.Extract("%*getcust("+c+")"),h="*setcust "+c+"="+o+"%:",b=!0),a&&(v=PPx.Extract("%*getcust("+p+")"),P="*setcust "+p+"="+a+"%:",b=!0),b&&(PPx.Execute(""+m+h+P),G.execute(e,f));var E=l?"":e,y=PPx.Extract("%OCP %*extract("+E+'"%%*choice(-text""'+r+'"" -title:""'+t+'"" -type:'+n+')")');return b&&(d&&PPx.Execute("*setcust "+s+"="+d),g&&PPx.Execute("*setcust "+c+"="+g),v&&PPx.Execute("*setcust "+p+"= "+v),G.execute(e,f)),{0:"cancel",1:"yes",2:"no"}[y]},execute:function(e,t){return O(t)?1:M()?2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)"):"tray"===e?PPx.Execute("*pptray -c "+t):U(e)?PPx.Execute("*execute "+e+","+t):PPx.Execute(t)},execSync:function(e,t){if(O(t))return 1;if(M())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(O(t))return[13,""];var r=U(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),r]},lang:function(){var e=J.lang;if(!O(e))return e;var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return e="en"===t||"jp"===t?t:f,J.lang=e,e},global:function(e){var t,r,n=J[e];if(n)return n;if(/^ppm[ahrcl]?/.test(e)){if(n=PPx.Extract("%sgu'"+e+"'"),O(n)){var i=e.replace("ppm","");switch(i){case"":n=null!=(t=J.ppm)?t:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":n=null!=(r=J.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var o;n=(null!=(o=J.ppm)?o:B("ppm"))+"\\dist\\lib";break;default:var a,u=null!=(a=J.home)?a:B("home");"cache"===i&&(n=u+"\\"+b())}}}else n=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return J[e]=n,n},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return O(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,r){void 0===r&&(r="");var n=D(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==n)return[n,""];if(O(t))return[1,""];var i=O(r)?"":',"'+r+'"',o=PPx.Extract("%*name("+e+',"'+t+'"'+i+")");return[n=Number(PPx.Extract()),o]},getcust:function(e){if(O(e))return[1,""];var t=D(I,e);return 0!==t?[t,""]:[t,PPx.Extract("%*getcust("+e+")")]},setcust:function(e,t){if(void 0===t&&(t=!1),O(e))return 1;var r=D(I,e);if(0!==r)return r;var n=t?"%OC ":"";return PPx.Execute(n+"*setcust "+e)},deletecust:function(e,t,r){var n="boolean"==typeof t,i=/^\s*"?([^"\s]+)"?\s*?$/,o=e.replace(i,"$1"),a=String(t),u=D(I,o);if(0!==u)return u;var s=null==t||n||O(a)?'"'+o+'"':o+","+("string"==typeof t?'"'+t.replace(i,"$1")+'"':""+t);return PPx.Execute("*deletecust "+s),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,r){if(void 0===r&&(r=!1),O(e))throw new Error("SubId is empty");var n=r?"%OC ":"";return PPx.Execute(n+"*setcust "+P+":"+e+","+t),P},deletekeys:function(){PPx.Execute('*deletecust "'+P+'"')},linecust:function(e){var t=e.label,r=e.id,n=e.sep,i=void 0===n?"=":n,o=e.value,a=void 0===o?"":o,u=e.esc,s=void 0!==u&&u,c=e.once,p=void 0!==c&&c?"*linecust "+t+","+r+",%%:":"";!O(a)&&s&&(a="%("+a+"%)"),PPx.Execute("*linecust "+t+","+r+i+p+a)},getvalue:function(e,t,r){if(O(r))return[1,""];var n=U(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+r+"'\")"):PPx.Extract("%s"+t+"'"+r+"'");return[O(n)?13:0,n]},setvalue:function(e,t,r,n){return O(r)?1:U(e)?PPx.Execute("*execute "+e+",*string "+t+","+r+"="+n):PPx.Execute("*string "+t+","+r+"="+n)},getinput:function(e){var t,r=e.message,n=void 0===r?"":r,i=e.title,o=void 0===i?"":i,a=e.mode,u=void 0===a?"g":a,s=e.select,c=void 0===s?"a":s,p=e.multi,l=void 0!==p&&p,f=e.leavecancel,x=void 0!==f&&f,d=e.forpath,g=void 0!==d&&d,v=e.fordijit,m=void 0!==v&&v,h=e.autoselect,P=void 0!==h&&h,b=e.k,E=void 0===b?"":b,y=l?" -multi":"",O=x?" -leavecancel":"",S=g?" -forpath":"",w=m?" -fordijit":"";P&&(t=E,PPx.Execute("%OC *setcust "+L+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+L+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),E="*mapkey use,"+L+"%%:"+t);var C=""!==E?" -k %%OP- "+E:"",j=D(/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,u);if(0!==j)return[j,""];var N=PPx.Extract('%OCP %*input("'+n+'" -title:"'+o+'" -mode:'+u+" -select:"+c+y+O+S+w+C+")");return j=Number(PPx.Extract()),P&&PPx.Execute('*deletecust "'+L+'"'),[j,N]},linemessage:function(e,t,r,n){var i,o="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var a=n?"%%bn":" ";i=t.join(a)}else i=t;e="."===e?"":e,i=r&&!o?'!"'+i:i,PPx.Execute("%OC *execute "+e+",*linemessage "+i)},report:function(e){var t="string"==typeof e?e:e.join(x);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(t):PPx.report(t)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return G.execute(e,"*job start"),function(){return G.execute(e,"*job end")}},getVersion:function(e){var t=V({path:e+="\\package.json"}),r=t[0],n=t[1];if(!w(r,n))for(var i=/^\s*"version":\s*"([0-9\.]+)"\s*,/,o=2,a=n.lines.length;o<a;o++)if(~n.lines[o].indexOf('"version":'))return n.lines[o].replace(i,"$1")}},K=(_=PPx.Extract("%*getcust(S_ppm#global:git)"),O(_)?"echo":'"'+_+'\\usr\\bin\\echo.exe"'),X=function(e,t){t=t.replace(/\\/g,"\\\\");var r="."===e?"%OP "+K+" -ne '%("+t+"%)'":"*execute "+e+",%%OP "+K+" -ne '%%("+t+"%%)'";return PPx.Execute(r)},q={black:"30",red:"31",green:"32",yellow:"33",blue:"34",magenta:"35",cyan:"36",white:"37",def:"39"},Y={black:"40",red:"41",green:"42",yellow:"43",blue:"44",magenta:"45",cyan:"46",white:"47",def:"49"},W=function(e){var t=e.message,r=e.esc,n=void 0!==r&&r,i=e.fg,o=e.bg;if(O(t))return"";var a=n?"\\x1b[":"[";return!i||O(i)?""+t:""+(""+a+(o?Y[o]+";":"")+q[i]+"m")+t+a+"49;39m"},z=function(e){var t=e.bootid,r=e.bootmax,n=e.q,i=e.c,o=e.k,a=e.startwith,u=void 0===a?"":a,s=e.wait,c=void 0===s?"":s,p=e.priority,l=e.job,f=e.log,x=e.wd,d=e.x,g=e.y,v=e.width,m=e.height,h=e.desc,P=e.fg,b=e.bg;if(-1!==PPx.Extract("%*ppxlist(-B)").indexOf("B_"+t))return PPx.Execute("*focus B"+t),!0;var E=function(e){var t=e.startwith,r=void 0===t?"":t,n=e.wait,i=void 0===n?"":n,o=e.priority,a=e.job,u=e.log,s=e.wd,c=e.x,p=e.y,l=e.width,f=e.height,x={"":"",min:"-min",max:"-max",noactive:"-noactive",bottom:"-noactive"}[r],d={"":"",wait:"-wait",idle:"-wait:idle",later:"-wait:later",no:"-wait:no"}[i],g="";if(s){if(!PPx.CreateObject("Scripting.FileSystemObject").FolderExists(s))return[!1,["[WARNING] Specified working directory is not exist"]];g="-d:"+s}var v=o?"-"+o:"",m=a?"-"+a:"",h=u?"-log":"";return c&&c>Number(G.global("disp_width"))&&(c=0),p&&p>Number(G.global("disp_height"))&&(p=0),[!0,["*run","-noppb",x,d,v,m,h,g,c&&p?"-pos:"+c+","+p:"",l&&f?"-size:"+l+","+f:""]]}({startwith:u,wait:c,priority:p,job:l,log:f,wd:x}),y=E[0],S=E[1];if(!y)return!1;var w=function(e){var t=e.bootid,r=e.bootmax,n=e.q,i=e.c,o=e.k;return{id:t?"-bootid:"+t:"",max:r?"-bootmax:"+r:"",quiet:n?"-q":"",postcmd:i||o||""}}({bootid:t,bootmax:r,q:n,c:i,k:o}),j=[];"min"===u||"max"===u||i||(j.push(function(e,t,r){return C(t)&&C(r)?"*windowposition "+e+","+(t<0?0:t)+","+(r<0?0:r):""}("%%n",d,g)),j.push(function(e,t,r){return C(t)&&C(r)?"*windowsize "+e+","+(t<200?200:t)+","+(r<200?200:r):""}("%%n",v,m)),"bottom"!==u||i||j.push("*selectppx %n")),h&&!O(h)&&j.push(K+' -e "'+W({esc:!0,message:h,fg:P,bg:b})+' \\n"'),j.push(w.postcmd);var N="";j.length>0&&(N=(i?"-c ":"-k ")+j.removeEmpty().join("%%:"));var _=[].concat(S,["%0ppbw.exe",w.id,w.max,w.quiet]).removeEmpty().join(" "),k=!0;try{/^-k $/.test(N)&&(N=""),PPx.Execute(_+" "+N+"%:*wait 500,2")}catch(F){k=!1}finally{return k}};Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var r;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var n=Object(this),i=n.length>>>0;if(0===i)return-1;var o=null!=t?t:0;if(Math.abs(o)===Infinity&&(o=0),o>=i)return-1;for(r=Math.max(o>=0?o:i-Math.abs(o),0);r<i;){if(r in n&&n[r]===e)return r;r++}return-1}),function(){if("object"!=typeof JSON){JSON={};var e,t,r,n,i=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,a=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,u=/(?:^|:|,)(?:\s*\[)+/g,s=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,c=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+p(this.getUTCMonth()+1)+"-"+p(this.getUTCDate())+"T"+p(this.getUTCHours())+":"+p(this.getUTCMinutes())+":"+p(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,i,o){var a;if(e="",t="","number"==typeof o)for(a=0;a<o;a+=1)t+=" ";else"string"==typeof o&&(t=o);if(n=i,i&&"function"!=typeof i&&("object"!=typeof i||"number"!=typeof i.length))throw new Error("JSON.stringify");return f("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(e,t){var r;if(e=String(e),c.lastIndex=0,c.test(e)&&(e=e.replace(c,(function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))),i.test(e.replace(o,"@").replace(a,"]").replace(u,"")))return r=Function("return ("+e+")")(),"function"==typeof t?function n(e,r){var i,o,a=e[r];if(a&&"object"==typeof a)for(i in a)Object.prototype.hasOwnProperty.call(a,i)&&((o=n(a,i))!==undefined?a[i]=o:delete a[i]);return t.call(e,r,a)}({"":r},""):r;throw new Error("JSON.parse")})}function p(e){return e<10?"0"+e:e}function l(e){return s.lastIndex=0,s.test(e)?'"'+e.replace(s,(function(e){var t=r[e];return"string"==typeof t?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+e+'"'}function f(r,i){var o,a,u,s,c,p=e,x=i[r];switch(x&&"object"==typeof x&&"function"==typeof x.toJSON&&(x=x.toJSON(r)),"function"==typeof n&&(x=n.call(i,r,x)),typeof x){case"string":return l(x);case"number":return isFinite(x)?String(x):"null";case"boolean":return String(x);case"object":if(!x)return"null";if(e+=t,c=[],"[object Array]"===Object.prototype.toString.apply(x)){for(s=x.length,o=0;o<s;o+=1)c[o]=f(String(o),x)||"null";return u=0===c.length?"[]":e?"[\n"+e+c.join(",\n"+e)+"\n"+p+"]":"["+c.join(",")+"]",e=p,u}if(n&&"object"==typeof n)for(s=n.length,o=0;o<s;o+=1)"string"==typeof n[o]&&(u=f(a=String(n[o]),x))&&c.push(l(a)+(e?": ":":")+u);else for(a in x)Object.prototype.hasOwnProperty.call(x,a)&&(u=f(a,x))&&c.push(l(a)+(e?": ":":")+u);return u=0===c.length?"{}":e?"{\n"+e+c.join(",\n"+e)+"\n"+p+"}":"{"+c.join(",")+"}",e=p,u}return"null"}}();var H,Q=function(t,r){var n=JSON.parse(r.replace(/\\/g,"\\\\"));return n.path="remote"===n.location?PPx.Extract("%*getcust(S_ppm#global:home)")+"\\repo\\"+t:n.path,e({name:t},n)},Z=function(e){var t=PPx.Extract("%*getcust(S_ppm#sources:"+e+")");return O(t)?undefined:Q(e,t)},ee=function(e){var t=e.name,r=e.enable,n=void 0===r||r,i=e.setup,o=void 0!==i&&i,a=e.version,u=void 0===a?"0.1.0":a,s=e.location,c=void 0===s?"remote":s,p=e.path,l=void 0===p?"":p,f=e.branch,x=void 0===f?"":f,d=e.commit,g=void 0===d?"":d,v=['"enable":'+n,'"setup":'+o,'"version":"'+u+'"','"location":"'+c+'"'];if("local"===c){if(O(l))throw new Error("Path not specified");v.push('"path":"'+l+'"')}return!O(x)&&v.push('"branch":"'+x+'"'),!O(g)&&v.push('"commit":"'+g+'"'),PPx.Execute("*setcust S_ppm#sources:"+t+"={"+v.join(",")+"}")},te=PPx.Extract('%sgu"ppmcache"')+"\\complist\\ppmsources.txt",re={prefix:{installed:"!",enable:"",disable:"~"},getPrefix:function(e){var t="enable";return e.enable?e.setup||(t="installed"):t="disable",this.prefix[t]},expandName:function(e){return e.replace(/^[~!]/,"")},getName:function(e){var t=Z(this.expandName(e));if(t){var r=this.prefix.enable;return t.enable?t.setup||(r=this.prefix.installed):r=this.prefix.disable,""+r+e}},fix:function(e){var t=V({path:te}),r=t[0],n=t[1];if(w(r,n)){for(var i=[],o=0;o<e.length;o++){var a=e[o];i.push(""+this.getPrefix(a)+a.name)}return this.write(i)}for(var u=/^[\!~]/,s={},c=0;c<e.length;c++){var p=e[c];s[p.name]=this.getPrefix(p)}for(var l,f,x=0,d=n.lines.length;x<d;x++)"string"==typeof(f=s[l=n.lines[x].replace(u,"")])&&(n.lines[x]=""+f+l);return this.write(n.lines)},write:function(e,t){void 0===t&&(t=!1);var r=t?[!1,!0]:[!0,!1];return A({path:te,data:e,overwrite:r[0],append:r[1]})}},ne=W({esc:!0,message:" PASS ",fg:"black",bg:"green"}),ie=W({esc:!0,message:" FAIL ",fg:"black",bg:"red"}),oe=function(e,t){return e?[!0,ie+" "+t]:[!1,ne+" "+t]},ae=function(e,t,r){var n;if(r="string"==typeof r?r:r.join(","),O(r))return oe(!0,"There are no items");var i=(H=null!=(n=H)?n:G.global("ppmlib"))+"\\"+e+".js";if(!o.FileExists(i))return oe(!0,i.replace(/\\/g,"/")+" is not found");var a=G.extract(".","%*script("+i+","+r+")"),u=a[0],s=a[1];if(0!==u)return oe(!0,"An error has occurred("+u+")");for(var c=JSON.parse(s),p=!1,l=[],f=0,x=Object.keys(c);f<x.length;f++){var d=x[f];c[d]||(p=!0,d=W({esc:!0,message:d,fg:"yellow"})),l.push(d)}var g=t+": "+l.join(", ");return oe(p,g)},ue={pluginVersion:function(e,t){var r=Z(t),n={"false":t+" version "+e,"true":t+" has not been updated}"};if(!r)return oe(!1,n["false"]);var i=F(r.version)>=F(e);return oe(i,n[i.toString()])},ppmVersion:function(e){var t=F(G.global("version")),r=F(e);return oe(t<r,"ppx-plugin-manager version "+e+" or later")},ppxVersion:function(e){e=Number(e);var t=PPx.PPxVersion,r=e<1e3?100*e:e;return oe(t<r,"PPx version "+r+" or later")},scriptVersion:function(e){var t=PPx.ModuleVersion,r="ScriptModule R"+e+" or later";return oe(t<Number(e),r)},scriptType:function(e){e=Number(e);var t="ClearScriptV8"===PPx.ScriptEngineName?5:Number(PPx.Extract("%*getcust(_others:usejs9)"));return oe(0!==e&&t!==e,"Use JScript version "+["anything","JS9(5.7)","JS9(5.8)","JS9(ES5)","Chakra(ES6)","CV8(ESNEXT)"][e])},codeType:function(e){e=Number(e);var t=PPx.CodeType,r={0:["MultiByte","Unicode"],1:["Unicode","MultiByte"]}[t],n="Using PPx "+r[0],i=0!==e&&t+1===e;return i&&(n=n+". Required "+r[1]),oe(i,n)},libRegexp:function(e){return oe("bregonig"!==e,"Using bregonig.dll")},useExecutables:function(e){return ae("exeExists","Required executables",e)},useModules:function(e){return ae("libExists","Required modules",e)},dependencies:function(e){return[!1,e]}};String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}),String.prototype.precedes||(String.prototype.precedes=function(e){var t=this.indexOf(e);return~t?this.slice(0,t):this});var se={en:{badGrammar:"Bad grammar found",isEarlier:"is declared even though the section has not started",badDeletion:"You cannot specify a value for the deletion setting",doNotDelete:"Deleting prorerties in the base.cfg is not allowed",failedToGet:"Failed to get installation information for",isNotPlugin:" is not a ppm-plugin repository"},jp:{badGrammar:"書式が間違っています",isEarlier:"の開始が宣言されていません",badDeletion:"削除設定には値を指定できません",doNotDelete:"base.cfg内でのプロパティの削除はできません",failedToGet:"インストール情報を取得できません",isNotPlugin:"はppmプラグインではありません"}}[G.lang()],ce={pluginVersion:"0.0.1",copyFlag:!1,copyScript:!1,copySpec:[]},pe={VERSION:"pluginVersion",PPM_VERSION:"ppmVersion",PPX_VERSION:"ppxVersion",SCRIPT_VERSION:"scriptVersion",CV8_VERSION:"scriptVersion",EXECUTABLES:"useExecutables",MODULES:"useModules",DEPENDENCIES:"dependencies",CODETYPE_PERMISSION:"codeType",SCRIPTTYPE_PERMISSION:"scriptType",COPY_FLAG:"copyFlag",COPY_SCRIPT:"copyScript",SPECIFIC_COPY_DIR:"copySpec"},le=function(e,t){var r=[],n=[],i=n[0],o=n[1],a=V({path:t}),u=a[0],s=a[1];if(w(u,s))return[!0,se.failedToGet+" "+e];if(~s.lines[0].indexOf("404:"))return[!0,e+" "+se.isNotPlugin];var c=s.lines,p="JScript"===PPx.ScriptEngineName?"CV8_VERSION":"SCRIPT_VERSION";if(null==typeof c[0]||!~c[0].indexOf(e))return[!0,e+" "+se.isNotPlugin];for(var l=1,f=c.length;l<f;l++){var x=c[l].split("=");if(i=x[0],o=x[1],!(O(c[l])||0===i.indexOf("#")||~i.indexOf("PPMCV8_VERSION")||~i.indexOf(p))&&(i=pe[i],null!=o)){if("copyFlag"===i||"copyScript"===i){o&&(ce[i]=!0);continue}if("copySpec"===i){O(o)||(ce[i]=o.split(","));continue}if("pluginVersion"===i){ce[i]=o;var d=ue.pluginVersion(o,e);u=d[0],s=d[1]}else{var g=ue[i](o);u=g[0],s=g[1]}u&&r.push(s)}}return[u,r.join("\n")]},fe=function(e){var t="@ppm!delim#",r=(/^'/.test(e)?e.replace(/^('[^']+'\s*)([=,])\s*(.*)$/,"$1"+t+"$2"+t+"$3"):e.replace(/^([^=,]+)([=,])\s*(.*)$/,"$1"+t+"$2"+t+"$3")).split(t);return{key:r[0].replace(/[\s\uFEFF\xA0]+$/,""),sep:r[1],value:r[2]}},xe=function(e,t,r,n,i){var o,a=fe(r),u=a.key,s=a.sep,c=a.value;if(0===u.indexOf("$"))~(c=c.trim().toUpperCase()).indexOf("J")&&(c=c.replace(/^([\\&]*\^[\\&]*)J$/,"$1V_H4A")),o="replace";else if(0===u.indexOf("@")){var p=[c];for(e++;e<t;e++){if(0!==(r=n[e]).indexOf("\t")){e--;break}p.push(r)}c=p.join(x),o="default"}else{if(0!==u.indexOf("?"))return[se.badGrammar,i,e];c=c.trim(),o="convert"}return i[o][u.substring(1)]={sep:s,value:c},[!1,i,e]},de=/^--[\s]+=[\s]*/,ge=function(e,t,r){return e+"\t"+t+" "+r},ve=function(e){return"-|"+e+"\t="},me=function(e){return/^(A_|X_|XB_|XC_|XV_|KC_main|KV_main)/i.test(e)},he=function(e,t){for(var r,n=0;n<t.length;n++){var i=t[n];~e.indexOf("[/"+i.key+"]")&&(r=RegExp("\\[/"+i.key+"]","g"),e=e.replace(r,i.value))}return e},Pe=function(e,t,r,n){var i=[],o=[],a=[],u=[],s=u[0],c=u[1],p=u[2],l=u[3];for(e++;e<t;e++)if(""!==(l=r[e])&&!/^[\s;}]/.test(l)&&!de.test(l)){if(0==l.indexOf("[endsection]"))break;if(0!==l.indexOf("/")){l=he(l,i);var f=fe(l);if(s=f.key,c=f.sep,p=f.value,!c&&!p)return[se.badGrammar,e,n];if("="!==c||0!==p.indexOf("{"))0!==s.indexOf("-")?(o.push(ge(s,c,p)),!me(s)&&a.push(ve(s))):0===s.indexOf("-|")||/^-[0-9\.]*\|.+/.test(s)?o.push(ge(s,c,p)):!me(s)&&a.push("-|"+s.substring(1)+"\t=");else{var x=!0;if(0===s.indexOf("-")){if(/^-[0-9\.]*\|.+/.test(s))return[se.badDeletion,e,n];x=!1,s=s.substring(1),!me(s)&&a.push(ve(s))}else!me(s)&&a.push(ge(s,c,p));for(o.push(ge(s,c,p)),e++;e<t;e++)if(""!==(l=r[e])&&0!==l.indexOf(";")){if(0===l.indexOf("[endsection]")||0===l.indexOf("}")){o.push("}"),x&&a.push("}");break}if(l=he(l,i),/^[\s]/.test(l)||de.test(l))o.push(l);else{var d=fe(l);s=d.key,c=d.sep,p=d.value,o.push(ge(s,c,p)),x&&a.push(ve(s))}}}}else i.push(fe(l.substring(1)))}var g=[o,a];return n.section=g[0],n.unset=g[1],[!1,e,n]},be=function(e,t,r,n){for(var i,o={},a=/^(\w+),([^,=]+)([,=])(.*)$/;e<t&&0!==(i=r[e]).indexOf("[endlinecust]");e++)i.replace(a,(function(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];var a,u=[].concat(r),s=u[0],c=u[1],p=u[2],l=u[3];p&&(l=null!=(a=l)?a:"",o[s]={id:c,sep:p,value:l});return i}));return n.linecust=o,[e,n]},Ee=function(e,t,r,n){var i,o=[];for(e++;e<t&&0!==(i=r[e]).indexOf("[endexecute]");e++)o.push(i);return n.execute=o,[e,n]},ye=function(e,t,r){return e+"\nLine:"+(t+1)+":"+r},Oe=function(e,t){var r=e.match(/\[\?[^:]+/g);if(null==r)return e;for(var n,i=[],o=i[0],a=i[1],u=e,s=0,c=r.length;s<c;s++)a=t[o=r[s].substring(2)]?t[o].value:"",a=O(a)||null==a?"$1":a,n=RegExp("\\[\\?"+o+":([^\\]]*)]","g"),u=u.replace(n,a);return u},Se=[],we=function(e,t,r){var n=!1,i=ve(t);e?Se.push(i):Se=[];for(var o=0;o<r.length;o++){var a=r[o];if(i===a&&(0===Se.length||Se.indexOf(a))){n=!0;break}}return n},Ce=function(e,t,r,n,i){var o,a,u="@default:",s="$replace:",c=[],p=c[1],l=t,f=r,x=n;if(0===t.indexOf(u)){if(l=t.substring(9),a=i["default"][l]){var d=[a.sep,a.value];f=d[0],x=d[1]}}else if(0===t.indexOf(s)){if(l=(l=t.substring(9)).replace(/^["'](.+)["']/,"$1"),!(a=i.replace[l])||O(a.value))return undefined;l=a.value}return o=ge(l,f,x),we(e,l,i.unset)||(p=ve(l)),{set:o,unset:p}},je=function(e,t){for(var r,n=!1,i=[0,t.length],o=i[0],a=i[1],u={"default":{},replace:{},convert:{},section:[],execute:[],unset:[],linecust:{}};o<a;o++)if(""!==(r=t[o])&&!/^[\s;}]/.test(r)&&!de.test(r)){if(0===r.indexOf("[end"))throw new Error(ye(r+" "+se.isEarlier,o,r));if(0===r.indexOf("[section]")||0===r.indexOf("[linecust]")||0===r.indexOf("[execute"))break;var s=xe(o,a,r,t,u);if(n=s[0],u=s[1],o=s[2],n)throw new Error(ye(n,o,r))}for(;o<a;o++)if(0===(r=t[o]).indexOf("[section]")){var c=Pe(o,a,t,u);if(n=c[0],o=c[1],u=c[2],n)throw new Error(ye(n,o,r))}else if("user"===e&&0===r.indexOf("[linecust]")){var p=be(o,a,t,u);o=p[0],u=p[1]}else if(0===r.indexOf("[execute]")){var l=Ee(o,a,t,u);o=l[0],u=l[1]}return u},Ne=function(e,t){for(var r=[],n=[],i=n[0],o=n[1],a=n[2],u=n[3],s=!1,c=!0,p=0,l=e.length;p<l;p++)if(u=e[p],!(O(u)||/^[\s;}]/.test(u)||de.test(u))){if(0===u.indexOf("-|"))throw new Error(se.doNotDelete);u=Oe(u,t.convert);var f=fe(u);if(i=f.key,o=f.sep,a=f.value,!o&&!a)throw new Error(se.badGrammar);if("="!==o||0!==a.indexOf("{")){var x=Ce(!1,i,o,a,t);x?(r.push(x.set),x.unset&&!me&&t.unset.push(x.unset),s=!1):s=!0}else{if(0===i.indexOf("-"))throw new Error(se.badGrammar);for(r.push(ge(i,o,a)),we(!1,i,t.unset)?c=!1:(c=!0,t.unset.push(ge(i,o,a))),p++;p<l;p++)if(""!==(u=e[p])&&0!==u.indexOf(";")){if(0===u.indexOf("-|"))throw new Error(se.doNotDelete);if(0===u.indexOf("}")){r.push("}"),c&&t.unset.push("}"),s=!1;break}if(de.test(u))r.push("--\t="),s=!1;else if(u=Oe(u,t.convert),/^\s+/.test(u))!s&&r.push(u);else{var d=fe(u);i=d.key,o=d.sep,a=d.value;var g=Ce(!0,i,o,a,t);g?(r.push(g.set),c&&g.unset&&t.unset.push(g.unset),s=!1):s=!0}}}}return{set:[].concat(r,t.section),unset:t.unset,linecust:t.linecust,execute:t.execute}},_e=function(e,t,r,n){var i=n?W({message:" LOAD ",fg:"black",bg:"green"}):"LOAD: ",o=n?W({message:" LINECUST ",fg:"black",bg:"magenta"}):"LINECUST: ",a=n?W({message:" EXECUTE ",fg:"black",bg:"yellow"}):"EXECUTE: ",u=n?W({message:" ERROR ",fg:"black",bg:"red"}):"ERROR: ";return 0===e?{load:i,linecust:o,execute:a}[t]+" "+r:u+" ["+t+"] "+r},ke=function(e,t){var r=G.global("ppmcache");return s(t+"\\setting\\patch.cfg",r+"\\config\\"+e+".cfg",!1)},Fe=function(e,t,r){var n=G.global("ppmcache"),i={patch:"default"===r?t+"\\setting\\patch.cfg":n+"\\config\\"+e+".cfg",base:t+"\\setting\\base.cfg"},o=V({path:i.patch}),a=o[0],u=o[1];if(w(a,u))throw new Error(u);var s=je(r,u.lines),c=V({path:i.base});if(a=c[0],u=c[1],w(a,u))throw new Error(u);return Ne(u.lines,s)},Te=function(t,r){var n=G.global("ppmcache"),i=n+"\\ppm\\unset\\linecust.cfg",o={setup:n+"\\ppm\\setup\\"+t+".cfg",unset:n+"\\ppm\\unset\\"+t+".cfg"},a=A({path:o.setup,data:r.set,overwrite:!0}),u=a[0],s=a[1],c=u?[u,s]:A({path:o.unset,data:r.unset,overwrite:!0});if(u=c[0],s=c[1],w(u,s))throw new Error(s);for(var p=function(t,r){if(S(r))return{};var n=e({},r),i=G.global("ppmcache"),o=V({path:i+"\\ppm\\unset\\linecust.cfg"}),a=o[0],u=o[1],s=/^[^=]+=([^,]+),.+,$/;if(w(a,u))throw new Error(u);for(var c=0,p=u.lines;c<p.length;c++){var l=p[c];if(~l.indexOf(t)){var f=l.replace(s,"$1");n[f]&&delete n[f]}}return n}(t,r.linecust),l=[],f=0,x=Object.keys(p);f<x.length;f++){var d=x[f],g=p[d].id;l.push(t+"="+d+","+g+",")}if(l.length>0){var v=A({path:i,data:l,append:!0});if(u=v[0],s=v[1],w(u,s))throw new Error(s)}return r.linecust},Re=function(e,t,r,n,i){var o,a=[],u=G.global("ppmcache")+"\\ppm\\setup\\"+e+".cfg";n=null==(o=n)||o;var s=!1;i?G.execute("B","*linemessage @"+u+"%%bn%%:*ppcust CA "+u+"%%&"):(G.setcust("@"+u),a.push(_e(0,"load",e,n)));for(var c=0,p=Object.keys(r);c<p.length;c++){var l=p[c],f=r[l],x=f.id,d=f.sep,g=f.value,v=PPx.Execute("*linecust "+l+","+x+d+g);a.push(_e(v,"linecust",(l+","+x+d+g).replace(/\\/g,"\\\\"),n)),s=0!==v}for(var m=0;m<t.length;m++){var h=t[m],P=PPx.Execute(h);a.push(_e(P,"execute",h.replace(/\\/g,"\\\\"),n)),s=0!==P}return[s,a]};var Ve,Ae,Ie,De={keys:{ppm:"",ppmhome:"",ppmarch:"%%su'ppmhome'\\arch",ppmrepo:"%%su'ppmhome'\\repo",ppmcache:"%%su'ppmhome'\\"+b(),ppmlib:"%%su'ppm'\\dist\\lib"},set:function(e,t){this.keys.ppmhome=e,this.keys.ppm=t;for(var r=0,n=Object.keys(this.keys);r<n.length;r++){var i=n[r];PPx.Execute("*string u,"+i+"="+this.keys[i])}},unset:function(){for(var e=0,t=Object.keys(this.keys);e<t.length;e++){var r=t[e];PPx.Execute("*deletecust _User:"+r)}}},$e={extractGitDir:function(){var e="C:/Program Files/git";if(o.FolderExists(e))return e;var t="C:/Program Files (x86)/git";if(o.FolderExists(t))return t;var r=PPx.Extract("%'git_install_root'");if(""!==r)return r;var n=PPx.Extract("%'path'");return/[\/\\]git[\/\\]cmd[\/\\]?[;$]/.test(n)?(n=(n=n.replace(/(.+[\/\\]git)[\/\\]cmd[\/\\]?[;$]/,"$1")).replace(/^(.+;)?/,"")).replace(/\//g,"\\"):""},globalPath:De,homeSpec:function(e){var t=e;return O(t)&&(t=PPx.Extract("%'home'"),t=O(t)?N(PPx.Extract("%'appdata'"),p):N(t,".ppm")),t}},Me=[],Ue=function(e,t,r){var n={load:"green",install:"cyan",error:"red",warn:"yellow"}[t],i=" "+t.toUpperCase()+" ",o=W({esc:!0,message:i,fg:"black",bg:n});switch(y(r)&&(r=r.replace(/\\/g,"\\\\")),t){case"error":case"warn":r=y(r)?W({esc:!0,message:r,fg:"white"}):"";break;default:var a=W({esc:!0,message:"Dependencies => "+r,fg:"yellow"});r=y(r)?e+"\\n  "+a:e}return o+" "+r},Je=function(e){return{name:e.name,enable:!0,setup:!1,version:e.version,location:e.location,path:e.path,branch:e.branch,commit:e.commit}},Be=function(e){var t=re.getName(e);t&&Me.push(t)},Le=function(){re.write(Me)},Ge="B"+d,Ke=["backup","config","userscript","list","complist","ppm\\setup","ppm\\unset"],Xe=p,qe=b(),Ye=function(){var e,t,r=PPx.ScriptName;return~r.indexOf("\\")?(e=r.replace(/^.*\\/,""),t=PPx.Extract("%*name(DKN,"+r+")")):(e=r,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}}(),We=Ye.parentDir,ze={en:{abort:"Installation aborted.",success:"Installation will de successful.",complete:"Installation completed.",beforeEdit:"Run",beforeCompare:"Default settings updated.",afterMsg:"and set up ppx-plugin-manager!",choice:"Chose an action"},jp:{abort:"インストールを中止しました",success:"インストール可能です",complete:"インストールが完了しました",beforeEdit:"初期設定のため",beforeCompare:"初期設定が更新されたため",afterMsg:"を実行してください",choice:"コマンドを選択してください"}}[function(){var e=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===e||"jp"===e?e:f}()],He=We.replace(/^(.+)\\(dist|dev)$/,"$1"),Qe=(Ve=G.global("home"),Ae=G.global("ppm"),{home:Ve,root:Ae,arch:N(Ve,"arch"),repo:N(Ve,"repo"),cache:N(Ve,qe),lib:N(Ae,"dist","lib")}),Ze=(Ie=G.getVersion(He))?F(Ie):l,et=function(e){void 0===e&&(e=PPx.Arguments);for(var t=[G.global("dev"),"0"],r=0,n=e.length;r<n;r++)t[r]=e.Item(r);return{installMode:t[0],dryRun:t[1]}},tt=function(){var e=function(e){var t=null!=e?e:PPx.Extract('%sgu"ppmlib"');O(t)&&(t=PPx.Extract("%*getcust(S_ppm#global:ppm)\\dist\\lib"));var r=t+"\\seeProcess.js",n="ielowutil.exe",i=PPx.Extract("%*script("+r+","+n+",0)"),o=PPx.CreateObject("InternetExplorer.Application");o.Navigate("about:blank");var a=o.Document.parentWindow.screen,u=[a.width,a.height];return o.Quit(),"0"===i&&PPx.Execute("%Obd taskkill /F /IM "+n),u}(We+"\\lib"),t=e[0],r=e[1],n="4"===G.getcust("_others:usejs9")[1]?"ecma":"jscript",i=N(Qe.root,"lib",n),o=N(Qe.root,"module",n);return{home:Qe.home,ppm:Qe.root,cache:Qe.cache,scripttype:n,lib:i,module:o,disp_width:t,disp_height:r}},rt=function(e,t){for(var r=[e.arch,e.repo],n=0;n<r.length;n++){var i=r[n];PPx.Execute("*makedir "+i)}for(var o=0;o<t.length;o++){var a=t[o];PPx.Execute("*makedir "+N(e.cache,a))}},nt=function(e){PPx.setValue("ppm_overwrite",""),PPx.Execute("*script "+We+"\\pluginRegister.js,"+Xe+",unset"),PPx.Execute("*script "+We+"\\ppmRestoreRegister.js,reset"),function(e,t){var r=PPx.Extract("%*getcust(S_ppm#sources:"+e+")");if(S(t)||O(r))return undefined;for(var n=0,i=Object.keys(t);n<i.length;n++){var o=i[n],a=RegExp('"'+o+'":[^,}]+'),u="boolean"==typeof t[o]?t[o]:'"'+t[o]+'"';r=r.replace(a,'"'+o+'":'+u)}PPx.Execute("*setcust S_ppm#sources:"+e+"="+r),Q(e,r)}(Xe,{enable:!0});var t=e.cache+"\\script",r=e.cache+"\\userscript";o.FolderExists(t)&&c(t,r,!0)},it=function(){var e={ppxVersion:g.ppxVersion,scriptVersion:g.scriptModule(),scriptType:g.scriptType,codeType:g.codeType,libRegexp:PPx.Extract("%*regexp(?)"),useModules:g.modules,useExecutables:g.executables},t=[],r=!1,n="";H=We+"\\lib";for(var i=0,o=Object.keys(e);i<o.length;i++){var a=o[i],u=ue[a](e[a]);r=u[0],n=u[1],t.push(n)}return[r,t]},ot=function(){if(o.FolderExists(Qe.repo+"\\tar80")){var t=Qe.repo+"\\tar80\\*",r=Qe.repo;PPx.Execute("%Os *file !move,"+t+","+r+",-min -querycreatedirectory:off -error:abort"),PPx.Execute("*delete "+Qe.repo+"\\tar80")}for(var n=function(t){var r=null!=t?t:G.global("ppmcache")+"\\list\\"+h,n=V({path:r}),i=n[0],o=n[1];if(w(i,o))throw new Error(o);for(var a=G.global("ppmrepo"),u=/^(local|remote)[\s]+["']([^"']+)["'][\s,]?[\s]*(.+)?/i,s=[],c=0,p=o.lines;c<p.length;c++){var l=p[c];0!==l.indexOf(";")&&(0!==l.indexOf("local")&&0!==l.indexOf("remote")||l.precedes(" ;").replace(u,(function(t,r,n,i){var o=n.replace(/^(.+)[\/\\](.+)/,"$1;$2").split(";"),u=o[0],c=o[1],p=Function("return "+i)();return"remote"===r&&(n=a+"\\"+c),s.push(e({name:c,autor:u,enable:!0,setup:!1,version:"0.1.0",location:r,path:n},p)),""})))}return s}(),i=0,a=n.length;i<a;i++){var u=!0,s="",c=n[i];if(c.path&&o.FolderExists(c.path)){var p=le(c.name,c.path+"\\install");if(u=p[0],s=p[1],w(u,s)){X(Ge,Ue(c.name,"error",s));continue}X(Ge,Ue(c.name,"load")),c.version=ce.pluginVersion,ee(Je(c)),Be(c.name)}}Le()};!function(){var e=G.jobstart("."),t=function(t){e(),PPx.Quit(t)},r=et(),n=r.installMode,i=r.dryRun;"2"!==n&&z({bootid:d,desc:Xe+" ver"+Ze,k:"*option terminal",fg:"cyan",x:0,y:0,width:700,height:500});var o=it(),u=o[0],l=o[1];u&&($e.globalPath.unset(),G.deletecust("S_ppm#global"),l.push("\\n"+ze.abort),X(Ge,l.join("\\n")),t(-1)),"0"!==i&&(l.push("\\n"+ze.success),X(Ge,l.join("\\n")),t(1));var f=tt();rt(Qe,Ke),a(Qe.cache+"\\ppm\\unset\\linecust.cfg",!1),a(te,!1),G.setcust("S_ppm#global:version="+Ze),"2"===n&&t(1),G.deletecust("S_ppm#sources"),G.deletecust("S_ppm#plugins"),G.setcust("S_ppm#plugins:"+Xe+"="+Qe.root);var x="1"===n?"local":"remote";ee({name:Xe,version:Ze,location:x,path:Qe.root});for(var g=0,P=Object.keys(f);g<P.length;g++){var b=P[g];G.setcust("S_ppm#global:"+b+"="+f[b])}var y,O,S,w,C,j,N,_,k,F,T,R,V,A,I="1"===PPx.getValue("ppm_overwrite");I&&nt(Qe),O=(y={path:Qe.cache+"\\ppm\\"+m,mask:["S_ppm#global","S_ppm#sources","S_ppm#plugins","A_color"]}).path,S=y.comment,w=void 0!==S&&S,C=y.sort,j=void 0===C||C,N=y.discover,_=void 0!==N&&N,k=y.mask,F=~O.indexOf("\\")?O:PPx.Extract('%sgu"ppmcache"\\backup\\'+O),T=w?"":" -nocomment",R=j?"":" -nosort",V=_?" -discover":"",A=k?'-mask:"'+k.join(",")+'"':"",PPx.Execute("*cd %0%:%Osbd *ppcust CD "+F+T+R+V+A+"%&");var D=Qe.cache+"\\backup\\";s(E().dir+"\\"+v,D,!1),s(He+"\\sheet\\"+h,Qe.cache+"\\list\\",!1),ke(Xe,He),"0"===n&&c(He,Qe.repo+"\\"+Xe,!0);var $=Fe(Xe,He,"default"),M=Te(Xe,$),U=Re(Xe,$.execute,M),J=(U[0],U[1]),B=re.fix([{name:Xe,version:Ze,location:x,path:Qe.root,setup:!1}]),L=B[0],K=B[1];L&&J.push(K),I&&ot();var q=I?ze.beforeCompare+" "+W({message:"*ppmCompare",fg:"yellow"}):ze.beforeEdit+" "+W({message:"*ppmEdit",fg:"yellow"}),Y=[ze.complete,q+" "+ze.afterMsg];X(Ge,[].concat(J,[""],Y).join("\\n"));var H=I?"yNc":"Ync",Q=G.choice(Ge,ze.choice,"",H,"edit(&Y)","compare with vimdiff(&N)","close(&C)");if("yes"===Q)G.execute("C",'%*getcust(S_ppm#user:editor) %sgu"ppmcache"\\config\\'+p+".cfg");else if("no"===Q){var Z='%%sgu"ppmcache"\\config\\'+p+".cfg";G.execute("C","*ppb -c %*getcust(S_ppm#user:compare) "+Z+' %%sgu"ppm"\\setting\\patch.cfg')}PPx.Execute("*closeppx "+Ge),e()}();
