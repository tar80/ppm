﻿function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},e.apply(this,arguments)}var t,r,n,u,c="jp",i="\r\n",o=function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")},a="K_ppmTemp",s="M_ppmTemp",f=function(e){return""===e},l=function(e,t){return e&&"string"==typeof t},p=PPx.CreateObject("Scripting.FileSystemObject"),x=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},P=function(e){var t,r,n,u,c=e.path,i=e.enc,o=void 0===i?"utf8":i,a=e.linefeed,s=function(e){var t=e.path,r=e.enc,n=void 0===r?"utf8":r;if(!p.FileExists(t))return[!0,t+" not found"];var u=p.GetFile(t);if(0===u.Size)return[!0,t+" has no data"];var c=!1,i="";if("utf8"===n){var o=PPx.CreateObject("ADODB.Stream"),a=x(o,(function(){return o.Open(),o.Charset="UTF-8",o.LoadFromFile(t),o.ReadText(-1)}));c=a[0],i=a[1]}else{var s="utf16le"===n?-1:0,f=u.OpenAsTextStream(1,s),l=x(f,(function(){return f.ReadAll()}));c=l[0],i=l[1]}return c?[!0,"Unable to read "+t]:[!1,i]}({path:c,enc:o}),l=s[0],P=s[1];if(l)return[!0,P];a=null!=(t=a)?t:(r=P.slice(0,1e3),n="\n",~(u=r.indexOf("\r"))&&(n="\r\n"==r.substring(u,u+2)?"\r\n":"\r"),n);var g=P.split(a);return f(g[g.length-1])&&g.pop(),[!1,{lines:g,nl:a}]},g=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,d=function(e,t){if(0===t.indexOf("@")){if(t=PPx.Extract(t).substring(1),!p.FileExists(t))return 2}else if(!e.test(t))return 13;return 0},v=function(e,t,r){return void 0===t&&(t=""),t=f(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+r+'"')},E=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},m=function(e){return"."!==e},b={lang:c},h=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return b[e]=t,t},y={echo:function(e,t,r){var n=r?"("+String(r)+")":"";return v("I",""+e,""+t+n)},question:function(e,t){return v("Q",""+e,t)},choice:function(e,t,r,n,u,c,i){void 0===n&&(n="ynC");var o="Mes0411",a=o+":IMYE",s=o+":IMNO",f=o+":IMTC",l="."===e,p=l?'%K"@LOADCUST"':'%%K"@LOADCUST"',x=[],P=x[0],g=x[1],d=x[2],v="",E="",m="",b=!1;u&&(P=PPx.Extract("%*getcust("+a+")"),v="*setcust "+a+"="+u+"%:",b=!0),c&&(g=PPx.Extract("%*getcust("+s+")"),E="*setcust "+s+"="+c+"%:",b=!0),i&&(d=PPx.Extract("%*getcust("+f+")"),m="*setcust "+f+"="+i+"%:",b=!0),b&&(PPx.Execute(""+v+E+m),y.execute(e,p));var h=l?"":e,O=PPx.Extract("%OCP %*extract("+h+'"%%*choice(-text""'+r+'"" -title:""'+t+'"" -type:'+n+')")');return b&&(P&&PPx.Execute("*setcust "+a+"="+P),g&&PPx.Execute("*setcust "+s+"="+g),d&&PPx.Execute("*setcust "+f+"= "+d),y.execute(e,p)),{0:"cancel",1:"yes",2:"no"}[O]},execute:function(e,t,r){return void 0===r&&(r=!1),f(t)?1:E()?2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)"):"tray"===e?PPx.Execute("*pptray -c "+t):m(e)?r?Number(PPx.Extract("%*extract("+e+',"'+t+'%%:0")')):PPx.Execute("*execute "+e+","+t):PPx.Execute(t)},execSync:function(e,t){if(f(t))return 1;if(E())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return f(PPx.Extract("%N"+e))?6:Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(f(t))return[13,""];var r=m(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),r]},lang:function(){var e=b.lang;if(!f(e))return e;var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return e="en"===t||"jp"===t?t:c,b.lang=e,e},global:function(e){var t,r,n=b[e];if(n)return n;if(/^ppm[ahrcl]?/.test(e)){if(n=PPx.Extract("%sgu'"+e+"'"),f(n)){var u=e.replace("ppm","");switch(u){case"":n=null!=(t=b.ppm)?t:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":n=null!=(r=b.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var c;n=(null!=(c=b.ppm)?c:h("ppm"))+"\\dist\\lib";break;default:var i,a=null!=(i=b.home)?i:h("home");"cache"===u&&(n=a+"\\"+o())}}}else n=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return b[e]=n,n},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return f(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,r){void 0===r&&(r="");var n=d(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==n)return[n,""];if(f(t))return[1,""];var u=f(r)?"":',"'+r+'"',c=PPx.Extract("%*name("+e+',"'+t+'"'+u+")");return[n=Number(PPx.Extract()),c]},getcust:function(e){if(f(e))return[1,""];var t=d(g,e);return 0!==t?[t,""]:[t,PPx.Extract("%*getcust("+e+")")]},setcust:function(e,t){if(void 0===t&&(t=!1),f(e))return 1;var r=d(g,e);if(0!==r)return r;var n=t?"%OC ":"";return PPx.Execute(n+"*setcust "+e)},deletecust:function(e,t,r){var n="boolean"==typeof t,u=/^\s*"?([^"\s]+)"?\s*?$/,c=e.replace(u,"$1"),i=String(t),o=d(g,c);if(0!==o)return o;var a=null==t||n||f(i)?'"'+c+'"':c+","+("string"==typeof t?'"'+t.replace(u,"$1")+'"':""+t);return PPx.Execute("*deletecust "+a),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,r,n){if(void 0===r&&(r=!1),void 0===n&&(n=""),f(e))throw new Error("SubId not specified");f(n)||(n="*skip "+n+"%bn%bt",r=!0);var u=r?"%OC ":"";return PPx.Execute(u+"*setcust "+a+":"+e+","+n+t),a},deletemenu:function(){PPx.Execute('*deletecust "'+s+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+a+'"')},linecust:function(e){var t=e.label,r=e.id,n=e.sep,u=void 0===n?"=":n,c=e.value,i=void 0===c?"":c,o=e.esc,a=void 0!==o&&o,s=e.once,l=void 0!==s&&s?"*linecust "+t+","+r+",%%:":"";!f(i)&&a&&(i="%("+i+"%)"),PPx.Execute("*linecust "+t+","+r+u+l+i)},getvalue:function(e,t,r){if(f(r))return[1,""];var n=m(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+r+"'\")"):PPx.Extract("%s"+t+"'"+r+"'");return[f(n)?13:0,n]},setvalue:function(e,t,r,n){return f(r)?1:m(e)?PPx.Execute("*execute "+e+",*string "+t+","+r+"="+n):PPx.Execute("*string "+t+","+r+"="+n)},getinput:function(e){var t,r=e.message,n=void 0===r?"":r,u=e.title,c=void 0===u?"":u,i=e.mode,o=void 0===i?"g":i,s=e.select,f=void 0===s?"a":s,l=e.multi,p=void 0!==l&&l,x=e.leavecancel,P=void 0!==x&&x,g=e.forpath,v=void 0!==g&&g,E=e.fordijit,m=void 0!==E&&E,b=e.autoselect,h=void 0!==b&&b,y=e.k,O=void 0===y?"":y,S=p?" -multi":"",j=P?" -leavecancel":"",C=v?" -forpath":"",N=m?" -fordijit":"";h&&(t=O,PPx.Execute("%OC *setcust "+a+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+a+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),O="*mapkey use,"+a+"%%:"+t);var T=""!==O?" -k %%OP- "+O:"",_=d(/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,o);if(0!==_)return[_,""];var k=PPx.Extract('%OCP %*input("'+n+'" -title:"'+c+'" -mode:'+o+" -select:"+f+S+j+C+N+T+")");return _=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[_,k]},linemessage:function(e,t,r,n){var u,c="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var i=n?"%%bn":" ";u=t.join(i)}else u=t;e="."===e?"":e,u=r&&!c?'!"'+u:u,PPx.Execute("%OC *execute "+e+",*linemessage "+u)},report:function(e){var t="string"==typeof e?e:e.join(i);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(t):PPx.report(t)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return y.execute(e,"*job start"),function(){return y.execute(e,"*job end")}},getVersion:function(e){var t=P({path:e+="\\package.json"}),r=t[0],n=t[1];if(!l(r,n))for(var u=/^\s*"version":\s*"([0-9\.]+)"\s*,/,c=2,i=n.lines.length;c<i;c++)if(~n.lines[c].indexOf('"version":'))return n.lines[c].replace(u,"$1")}};Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var r;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var n=Object(this),u=n.length>>>0;if(0===u)return-1;var c=null!=t?t:0;if(Math.abs(c)===Infinity&&(c=0),c>=u)return-1;for(r=Math.max(c>=0?c:u-Math.abs(c),0);r<u;){if(r in n&&n[r]===e)return r;r++}return-1}),Object.keys||(Object.keys=(t=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),u=(n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(e){if("function"!=typeof e&&("object"!=typeof e||null==e))throw new TypeError("Object.keys: called on non-object");var c,i,o=[];for(c in e)t.call(e,c)&&o.push(c);if(r)for(i=0;i<u;i++)t.call(e,n[i])&&o.push(n[i]);return o})),function(){if("object"!=typeof JSON){JSON={};var e,t,r,n,u=/^[\],:{}\s]*$/,c=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,i=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,o=/(?:^|:|,)(?:\s*\[)+/g,a=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,u,c){var i;if(e="",t="","number"==typeof c)for(i=0;i<c;i+=1)t+=" ";else"string"==typeof c&&(t=c);if(n=u,u&&"function"!=typeof u&&("object"!=typeof u||"number"!=typeof u.length))throw new Error("JSON.stringify");return p("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(e,t){var r;if(e=String(e),s.lastIndex=0,s.test(e)&&(e=e.replace(s,(function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))),u.test(e.replace(c,"@").replace(i,"]").replace(o,"")))return r=Function("return ("+e+")")(),"function"==typeof t?function n(e,r){var u,c,i=e[r];if(i&&"object"==typeof i)for(u in i)Object.prototype.hasOwnProperty.call(i,u)&&((c=n(i,u))!==undefined?i[u]=c:delete i[u]);return t.call(e,r,i)}({"":r},""):r;throw new Error("JSON.parse")})}function f(e){return e<10?"0"+e:e}function l(e){return a.lastIndex=0,a.test(e)?'"'+e.replace(a,(function(e){var t=r[e];return"string"==typeof t?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+e+'"'}function p(r,u){var c,i,o,a,s,f=e,x=u[r];switch(x&&"object"==typeof x&&"function"==typeof x.toJSON&&(x=x.toJSON(r)),"function"==typeof n&&(x=n.call(u,r,x)),typeof x){case"string":return l(x);case"number":return isFinite(x)?String(x):"null";case"boolean":return String(x);case"object":if(!x)return"null";if(e+=t,s=[],"[object Array]"===Object.prototype.toString.apply(x)){for(a=x.length,c=0;c<a;c+=1)s[c]=p(String(c),x)||"null";return o=0===s.length?"[]":e?"[\n"+e+s.join(",\n"+e)+"\n"+f+"]":"["+s.join(",")+"]",e=f,o}if(n&&"object"==typeof n)for(a=n.length,c=0;c<a;c+=1)"string"==typeof n[c]&&(o=p(i=String(n[c]),x))&&s.push(l(i)+(e?": ":":")+o);else for(i in x)Object.prototype.hasOwnProperty.call(x,i)&&(o=p(i,x))&&s.push(l(i)+(e?": ":":")+o);return o=0===s.length?"{}":e?"{\n"+e+s.join(",\n"+e)+"\n"+f+"}":"{"+s.join(",")+"}",e=f,o}return"null"}}();var O=function(t){var r=PPx.Extract("%*getcust(S_ppm#sources:"+t+")");return f(r)?undefined:function(t,r){var n=JSON.parse(r.replace(/\\/g,"\\\\"));return n.path="remote"===n.location?PPx.Extract("%*getcust(S_ppm#global:home)")+"\\repo\\"+t:n.path,e({name:t},n)}(t,r)};PPx.Extract('%sgu"ppmcache"');var S,j,C,N=function(){var e,t,r=PPx.ScriptName;return~r.indexOf("\\")?(e=r.replace(/^.*\\/,""),t=PPx.Extract("%*name(DKN,"+r+")")):(e=r,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}}(),T=N.scriptName,_={en:{clean:"There is nothing to clean",askContinue:"Would you like to clean the following plugins?",success:"Cleaning completed",failed:"Cleaning failed"},jp:{clean:"削除できるプラグインはありません",askContinue:"これらのプラグインを削除しますか？",success:"未使用のプラグインを削除しました",failed:"削除に失敗しました"}}[function(){var e=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===e||"jp"===e?e:c}()],k=(S=y.getcust("S_ppm#sources"),j=S[0],C=S[1],0===j?[!1,C.split(i)]:[!0,_.clean]),w=k[1];l(k[0],w)&&(y.echo(T,w),PPx.Quit(1));for(var F,U={name:"",source:"",repo:""},D=1,A=w.length-2;D<A;D++)(F=O(w[D].split("\t=")[0]))&&!F.enable&&(U.name=""+U.name+i+F.name,U.source=U.source+"*deletecust S_ppm#sources:"+F.name+"%:",U.repo=U.repo+"*delete "+F.path+"%:");f(U.name)&&(y.echo(T,_.clean),PPx.Quit(1));var J=""+_.askContinue+U.name;!y.question(T,J)&&PPx.Quit(1);var M=0==PPx.Execute(U.source);(M=M&&0==PPx.Execute(U.repo))?y.linemessage(".",_.success,!0):y.echo(T,_.failed);
