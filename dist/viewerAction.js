﻿function t(){return t=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},t.apply(this,arguments)}var e,r,n,u,c="jp",i="\r\n",o="_updateLog",a="K_ppmTemp",s=function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")},f=PPx.CreateObject("Scripting.FileSystemObject"),p=function(t){return""===t},l=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,x=function(t,e){if(0===e.indexOf("@")){if(e=PPx.Extract(e).substring(1),!f.FileExists(e))return 2}else if(!t.test(e))return 13;return 0},P=function(t,e,r){return void 0===e&&(e=""),e=p(e)?"":"/"+e,0===PPx.Execute('%"ppm'+e+'" %OC %'+t+'"'+r+'"')},g=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},d=function(t){return"."!==t},v={lang:c},m=function(t){var e=PPx.Extract("%*getcust(S_ppm#global:"+t+")");return v[t]=e,e},b="K_ppmTemp",E={echo:function(t,e,r){var n=r?"("+String(r)+")":"";return P("I",""+t,""+e+n)},question:function(t,e){return P("Q",""+t,e)},choice:function(t,e,r,n,u,c,i){void 0===n&&(n="ynC");var o="Mes0411",a=o+":IMYE",s=o+":IMNO",f=o+":IMTC",p="."===t,l=p?'%K"@LOADCUST"':'%%K"@LOADCUST"',x=[],P=x[0],g=x[1],d=x[2],v="",m="",b="",h=!1;u&&(P=PPx.Extract("%*getcust("+a+")"),v="*setcust "+a+"="+u+"%:",h=!0),c&&(g=PPx.Extract("%*getcust("+s+")"),m="*setcust "+s+"="+c+"%:",h=!0),i&&(d=PPx.Extract("%*getcust("+f+")"),b="*setcust "+f+"="+i+"%:",h=!0),h&&(PPx.Execute(""+v+m+b),E.execute(t,l));var y=p?"":t,O=PPx.Extract("%OCP %*extract("+y+'"%%*choice(-text""'+r+'"" -title:""'+e+'"" -type:'+n+')")');return h&&(P&&PPx.Execute("*setcust "+a+"="+P),g&&PPx.Execute("*setcust "+s+"="+g),d&&PPx.Execute("*setcust "+f+"= "+d),E.execute(t,l)),{0:"cancel",1:"yes",2:"no"}[O]},execute:function(t,e){return p(e)?1:g()?2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+t+",%("+e+"%)"):"tray"===t?PPx.Execute("*pptray -c "+e):d(t)?PPx.Execute("*execute "+t+","+e):PPx.Execute(e)},execSync:function(t,e){if(p(e))return 1;if(g())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+t+",%("+e+"%)");if(1===t.length)t="b"+t;else if(0!==t.toUpperCase().indexOf("B"))return 6;return Number(PPx.Extract("%*extract("+t.toUpperCase()+',"'+e+'%%:%%*exitcode")'))},extract:function(t,e){if(p(e))return[13,""];var r=d(t)?PPx.Extract("%*extract("+t+',"'+e+'")'):PPx.Extract(e);return[Number(PPx.Extract()),r]},lang:function(){var t=v.lang;if(!p(t))return t;var e=PPx.Extract("%*getcust(S_ppm#global:lang)");return t="en"===e||"jp"===e?e:c,v.lang=t,t},global:function(t){var e,r,n=v[t];if(n)return n;if(/^ppm[ahrcl]?/.test(t)){if(n=PPx.Extract("%sgu'"+t+"'"),p(n)){var u=t.replace("ppm","");switch(u){case"":n=null!=(e=v.ppm)?e:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":n=null!=(r=v.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var c;n=(null!=(c=v.ppm)?c:m("ppm"))+"\\dist\\lib";break;default:var i,o=null!=(i=v.home)?i:m("home");"cache"===u&&(n=o+"\\"+s())}}}else n=PPx.Extract("%*getcust(S_ppm#global:"+t+")");return v[t]=n,n},user:function(t){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+t+')")')},setuser:function(t,e){return p(e)?1:PPx.Execute("*setcust S_ppm#user:"+t+"="+e)},getpath:function(t,e,r){void 0===r&&(r="");var n=x(/^[CXTDHLKBNPRVSU]+$/,t);if(0!==n)return[n,""];if(p(e))return[1,""];var u=p(r)?"":',"'+r+'"',c=PPx.Extract("%*name("+t+',"'+e+'"'+u+")");return[n=Number(PPx.Extract()),c]},getcust:function(t){if(p(t))return[1,""];var e=x(l,t);if(0!==e)return[e,""];var r=PPx.Extract("%*getcust("+t+")");return[e=Number(PPx.Extract()),r]},setcust:function(t,e){if(void 0===e&&(e=!1),p(t))return 1;var r=x(l,t);if(0!==r)return r;var n=e?"%OC ":"";return PPx.Execute(n+"*setcust "+t)},deletecust:function(t,e,r){var n="boolean"==typeof e,u=/^\s*"?([^"\s]+)"?\s*?$/,c=t.replace(u,"$1"),i=String(e),o=x(l,c);if(0!==o)return o;var a=null==e||n||p(i)?'"'+c+'"':c+","+("string"==typeof e?'"'+e.replace(u,"$1")+'"':""+e);return PPx.Execute("*deletecust "+a),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(t,e,r){if(void 0===r&&(r=!1),p(t))throw new Error("SubId is empty");var n=r?"%OC ":"";return PPx.Execute(n+"*setcust "+a+":"+t+","+e),a},deletekeys:function(){PPx.Execute('*deletecust "'+a+'"')},linecust:function(t){var e=t.label,r=t.id,n=t.sep,u=void 0===n?"=":n,c=t.value,i=void 0===c?"":c,o=t.esc,a=void 0!==o&&o,s=t.once,f=void 0!==s&&s?"*linecust "+e+","+r+",%%:":"";!p(i)&&a&&(i="%("+i+"%)"),PPx.Execute("*linecust "+e+","+r+u+f+i)},getvalue:function(t,e,r){if(p(r))return[1,""];var n=d(t)?PPx.Extract("%*extract("+t+',"%%s'+e+"'"+r+"'\")"):PPx.Extract("%s"+e+"'"+r+"'");return[p(n)?13:0,n]},setvalue:function(t,e,r,n){return p(r)?1:d(t)?PPx.Execute("*execute "+t+",*string "+e+","+r+"="+n):PPx.Execute("*string "+e+","+r+"="+n)},getinput:function(t){var e,r=t.message,n=void 0===r?"":r,u=t.title,c=void 0===u?"":u,i=t.mode,o=void 0===i?"g":i,a=t.select,s=void 0===a?"a":a,f=t.multi,p=void 0!==f&&f,l=t.leavecancel,P=void 0!==l&&l,g=t.forpath,d=void 0!==g&&g,v=t.fordijit,m=void 0!==v&&v,E=t.autoselect,h=void 0!==E&&E,y=t.k,O=void 0===y?"":y,S=p?" -multi":"",j=P?" -leavecancel":"",C=d?" -forpath":"",N=m?" -fordijit":"";h&&(e=O,PPx.Execute("%OC *setcust "+b+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+b+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),O="*mapkey use,"+b+"%%:"+e);var _=""!==O?" -k %%OP- "+O:"",T=x(/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,o);if(0!==T)return[T,""];var w=PPx.Extract('%OCP %*input("'+n+'" -title:"'+c+'" -mode:'+o+" -select:"+s+S+j+C+N+_+")");return T=Number(PPx.Extract()),h&&PPx.Execute('*deletecust "'+b+'"'),[T,w]},linemessage:function(t,e,r,n){var u,c="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof e){var i=n?"%%bn":" ";u=e.join(i)}else u=e;t="."===t?"":t,u=r&&!c?'!"'+u:u,PPx.Execute("%OC *execute "+t+",*linemessage "+u)},report:function(t){var e="string"==typeof t?t:t.join(i);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(e):PPx.report(e)},close:function(t){PPx.Execute("*closeppx "+t)},jobstart:function(t){return E.execute(t,"*job start"),function(){return E.execute(t,"*job end")}}},h=function(t,e){try{var r;return[!1,null!=(r=e())?r:""]}catch(n){return[!0,""]}finally{t.Close()}},y=function(t){var e=t.path,r=t.enc,n=function(t){var e=t.path,r=t.enc,n=void 0===r?"utf8":r;if(!f.FileExists(e))return[!0,e+" not found"];var u=f.GetFile(e);if(0===u.Size)return[!0,e+" has no data"];var c=!1,i="";if("utf8"===n){var o=PPx.CreateObject("ADODB.Stream"),a=h(o,(function(){return o.Open(),o.Charset="UTF-8",o.LoadFromFile(e),o.ReadText(-1)}));c=a[0],i=a[1]}else{var s="utf16le"===n?-1:0,p=u.OpenAsTextStream(1,s),l=h(p,(function(){return p.ReadAll()}));c=l[0],i=l[1]}return c?[!0,"Unable to read "+e]:[!1,i]}({path:e,enc:void 0===r?"utf8":r}),u=n[0],c=n[1];if(u)return[!0,c];var i=function(t){var e="\n",r=t.indexOf("\r");return~r&&(e="\r\n"==t.substring(r,r+2)?"\r\n":"\r"),e}(c.slice(0,1e3)),o=c.split(i);return p(o[o.length-1])&&o.pop(),[!1,{lines:o,nl:i}]};Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){var r;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var n=Object(this),u=n.length>>>0;if(0===u)return-1;var c=null!=e?e:0;if(Math.abs(c)===Infinity&&(c=0),c>=u)return-1;for(r=Math.max(c>=0?c:u-Math.abs(c),0);r<u;){if(r in n&&n[r]===t)return r;r++}return-1}),Object.keys||(Object.keys=(e=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),u=(n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(t){if("function"!=typeof t&&("object"!=typeof t||null==t))throw new TypeError("Object.keys: called on non-object");var c,i,o=[];for(c in t)e.call(t,c)&&o.push(c);if(r)for(i=0;i<u;i++)e.call(t,n[i])&&o.push(n[i]);return o})),function(){if("object"!=typeof JSON){JSON={};var t,e,r,n,u=/^[\],:{}\s]*$/,c=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,i=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,o=/(?:^|:|,)(?:\s*\[)+/g,a=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,u,c){var i;if(t="",e="","number"==typeof c)for(i=0;i<c;i+=1)e+=" ";else"string"==typeof c&&(e=c);if(n=u,u&&"function"!=typeof u&&("object"!=typeof u||"number"!=typeof u.length))throw new Error("JSON.stringify");return l("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(t,e){var r;if(t=String(t),s.lastIndex=0,s.test(t)&&(t=t.replace(s,(function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))),u.test(t.replace(c,"@").replace(i,"]").replace(o,"")))return r=Function("return ("+t+")")(),"function"==typeof e?function n(t,r){var u,c,i=t[r];if(i&&"object"==typeof i)for(u in i)Object.prototype.hasOwnProperty.call(i,u)&&((c=n(i,u))!==undefined?i[u]=c:delete i[u]);return e.call(t,r,i)}({"":r},""):r;throw new Error("JSON.parse")})}function f(t){return t<10?"0"+t:t}function p(t){return a.lastIndex=0,a.test(t)?'"'+t.replace(a,(function(t){var e=r[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+t+'"'}function l(r,u){var c,i,o,a,s,f=t,x=u[r];switch(x&&"object"==typeof x&&"function"==typeof x.toJSON&&(x=x.toJSON(r)),"function"==typeof n&&(x=n.call(u,r,x)),typeof x){case"string":return p(x);case"number":return isFinite(x)?String(x):"null";case"boolean":return String(x);case"object":if(!x)return"null";if(t+=e,s=[],"[object Array]"===Object.prototype.toString.apply(x)){for(a=x.length,c=0;c<a;c+=1)s[c]=l(String(c),x)||"null";return o=0===s.length?"[]":t?"[\n"+t+s.join(",\n"+t)+"\n"+f+"]":"["+s.join(",")+"]",t=f,o}if(n&&"object"==typeof n)for(a=n.length,c=0;c<a;c+=1)"string"==typeof n[c]&&(o=l(i=String(n[c]),x))&&s.push(p(i)+(t?": ":":")+o);else for(i in x)Object.prototype.hasOwnProperty.call(x,i)&&(o=l(i,x))&&s.push(p(i)+(t?": ":":")+o);return o=0===s.length?"{}":t?"{\n"+t+s.join(",\n"+t)+"\n"+f+"}":"{"+s.join(",")+"}",t=f,o}return"null"}}();var O=function(e){var r=PPx.Extract("%*getcust(S_ppm#sources:"+e+")");return p(r)?undefined:function(e,r){var n=JSON.parse(r.replace(/\\/g,"\\\\"));return n.path="remote"===n.location?PPx.Extract("%*getcust(S_ppm#global:home)")+"\\repo\\"+e:n.path,t({name:e},n)}(e,r)};PPx.Extract('%sgu"ppmcache"');var S,j={en:{couldNotGet:"Could not get",notFind:"Could not find plugin name",customize:"Do you want to edit the configuration file?"},jp:{couldNotGet:"取得できませんでした",notFind:"プラグイン名が見つかりませんでした",customize:"設定ファイルを編集しますか?"}}[function(){var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===t||"jp"===t?t:c}()],C=E.global("ppmcache")+"\\ppm\\"+o,N=(S=PPx.Extract('%*extract(C,"%%*temp()")'),{dir:S,file:S+"_ppmtemp",stdout:S+"_stdout",stderr:S+"_stderr",ppmDir:function(){var t=PPx.Extract("%'temp'%\\ppm");return PPx.Execute("*makedir "+t),t}}).file,_=function(t,e){for(var r,n=/^\x1b\[42;30m\s*([\S]+)\s*\x1b\[49;39m$/,u=t;u>=0;u--)if(~(r=e[u]).indexOf("[42;30m"))return r.replace(n,"$1");return""},T={update:function(t,e){var r=/^(\x1b\[\d+m)?(\w{0,8})\x1b\[m\s.+$/;if(r.test(e)){var n=O(t);if(n){var u=e.replace(r,"$2");return void PPx.Execute("*pptray -c %%Obd git -C "+n.path+" show --color=always --compact-summary "+u+" | %0ppvw")}}},customize:function(t){E.question(""+t,j.customize)&&E.execute("","%*getcust(S_ppm#user:editor) %%sgu'ppmcache'\\config\\"+t+".cfg")}};!function(){var t,e=PPx.Extract("%FDC");if(e===C)t="update";else{if(e!==N)return;t="customize"}var r=y({path:e}),n=r[0],u=r[1];(function(t,e){return t&&"string"==typeof e})(n,u)&&(E.linemessage(".",j.couldNotGet),PPx.Quit(-1));var c=Number(PPx.Extract("%lV"))-1,i=_(c,u.lines);p(i)&&(E.linemessage(".",j.notFind),PPx.Quit(1)),T[t](i,u.lines[c])}();
