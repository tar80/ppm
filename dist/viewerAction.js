﻿function t(){return t=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},t.apply(this,arguments)}var e,r,n,u,c="jp",i="\r\n",o="_updateLog",a=function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")},s="K_ppmTemp",f="M_ppmTemp",l=PPx.CreateObject("Scripting.FileSystemObject"),p=function(t){return""===t},x=function(t,e){return t&&"string"==typeof e},P=function(t,e){try{var r;return[!1,null!=(r=e())?r:""]}catch(n){return[!0,""]}finally{t.Close()}},g=function(t){var e=t.path,r=t.enc,n=function(t){var e=t.path,r=t.enc,n=void 0===r?"utf8":r;if(!l.FileExists(e))return[!0,e+" not found"];var u=l.GetFile(e);if(0===u.Size)return[!0,e+" has no data"];var c=!1,i="";if("utf8"===n){var o=PPx.CreateObject("ADODB.Stream"),a=P(o,(function(){return o.Open(),o.Charset="UTF-8",o.LoadFromFile(e),o.ReadText(-1)}));c=a[0],i=a[1]}else{var s="utf16le"===n?-1:0,f=u.OpenAsTextStream(1,s),p=P(f,(function(){return f.ReadAll()}));c=p[0],i=p[1]}return c?[!0,"Unable to read "+e]:[!1,i]}({path:e,enc:void 0===r?"utf8":r}),u=n[0],c=n[1];if(u)return[!0,c];var i=function(t){var e="\n",r=t.indexOf("\r");return~r&&(e="\r\n"==t.substring(r,r+2)?"\r\n":"\r"),e}(c.slice(0,1e3)),o="\r"!==i?/\r?\n/:i,a=c.split(o);return p(a[a.length-1])&&a.pop(),[!1,{lines:a,nl:i}]},d=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,v=function(t,e){if(0===e.indexOf("@")){if(e=PPx.Extract(e).substring(1),!l.FileExists(e))return 2}else if(!t.test(e))return 13;return 0},m=function(t,e,r){return void 0===e&&(e=""),e=p(e)?"":"/"+e,0===PPx.Execute('%"ppm'+e+'" %OC %'+t+'"'+r+'"')},E=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},b=function(t){return"."!==t},h={lang:c},y=function(t){var e=PPx.Extract("%*getcust(S_ppm#global:"+t+")");return h[t]=e,e},O={echo:function(t,e,r){var n=r?"("+String(r)+")":"";return m("I",""+t,""+e+n)},question:function(t,e){return m("Q",""+t,e)},choice:function(t,e,r,n,u,c,i){void 0===n&&(n="ynC");var o="Mes0411",a=o+":IMYE",s=o+":IMNO",f=o+":IMTC",l="."===t,p=l?'%K"@LOADCUST"':'%%K"@LOADCUST"',x=[],P=x[0],g=x[1],d=x[2],v="",m="",E="",b=!1;u&&(P=PPx.Extract("%*getcust("+a+")"),v="*setcust "+a+"="+u+"%:",b=!0),c&&(g=PPx.Extract("%*getcust("+s+")"),m="*setcust "+s+"="+c+"%:",b=!0),i&&(d=PPx.Extract("%*getcust("+f+")"),E="*setcust "+f+"="+i+"%:",b=!0),b&&(PPx.Execute(""+v+m+E),O.execute(t,p));var h=l?"":t,y=PPx.Extract("%OCP %*extract("+h+'"%%*choice(-text""'+r+'"" -title:""'+e+'"" -type:'+n+')")');return b&&(P&&PPx.Execute("*setcust "+a+"="+P),g&&PPx.Execute("*setcust "+s+"="+g),d&&PPx.Execute("*setcust "+f+"= "+d),O.execute(t,p)),{0:"cancel",1:"yes",2:"no"}[y]},execute:function(t,e,r){return void 0===r&&(r=!1),p(e)?1:E()?2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+t+",%("+e+"%)"):"tray"===t?PPx.Execute("*pptray -c "+e):b(t)?r?Number(PPx.Extract("%*extract("+t+',"'+e+'%%:0")')):PPx.Execute("*execute "+t+","+e):PPx.Execute(e)},execSync:function(t,e){if(p(e))return 1;if(E())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+t+",%("+e+"%)");if(1===t.length)t="b"+t;else if(0!==t.toUpperCase().indexOf("B"))return 6;return p(PPx.Extract("%N"+t))?6:Number(PPx.Extract("%*extract("+t.toUpperCase()+',"'+e+'%%:%%*exitcode")'))},extract:function(t,e){if(p(e))return[13,""];var r=b(t)?PPx.Extract("%*extract("+t+',"'+e+'")'):PPx.Extract(e);return[Number(PPx.Extract()),r]},lang:function(){var t=h.lang;if(!p(t))return t;var e=PPx.Extract("%*getcust(S_ppm#global:lang)");return t="en"===e||"jp"===e?e:c,h.lang=t,t},global:function(t){var e,r,n=h[t];if(n)return n;if(/^ppm[ahrcl]?/.test(t)){if(n=PPx.Extract("%sgu'"+t+"'"),p(n)){var u=t.replace("ppm","");switch(u){case"":n=null!=(e=h.ppm)?e:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":n=null!=(r=h.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var c;n=(null!=(c=h.ppm)?c:y("ppm"))+"\\dist\\lib";break;default:var i,o=null!=(i=h.home)?i:y("home");"cache"===u&&(n=o+"\\"+a())}}}else n=PPx.Extract("%*getcust(S_ppm#global:"+t+")");return h[t]=n,n},user:function(t){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+t+')")')},setuser:function(t,e){return p(e)?1:PPx.Execute("*setcust S_ppm#user:"+t+"="+e)},getpath:function(t,e,r){void 0===r&&(r="");var n=v(/^[CXTDHLKBNPRVSU]+$/,t);if(0!==n)return[n,""];if(p(e))return[1,""];var u=p(r)?"":',"'+r+'"',c=PPx.Extract("%*name("+t+',"'+e+'"'+u+")");return[n=Number(PPx.Extract()),c]},getcust:function(t){if(p(t))return[1,""];var e=v(d,t);return 0!==e?[e,""]:[e,PPx.Extract("%*getcust("+t+")")]},setcust:function(t,e){if(void 0===e&&(e=!1),p(t))return 1;var r=v(d,t);if(0!==r)return r;var n=e?"%OC ":"";return PPx.Execute(n+"*setcust "+t)},deletecust:function(t,e,r){var n="boolean"==typeof e,u=/^\s*"?([^"\s]+)"?\s*?$/,c=t.replace(u,"$1"),i=String(e),o=v(d,c);if(0!==o)return o;var a=null==e||n||p(i)?'"'+c+'"':c+","+("string"==typeof e?'"'+e.replace(u,"$1")+'"':""+e);return PPx.Execute("*deletecust "+a),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(t,e,r){if(void 0===r&&(r=!1),p(t))throw new Error("SubId is empty");var n=r?"%OC ":"";return PPx.Execute(n+"*setcust "+s+":"+t+","+e),s},deletemenu:function(){PPx.Execute('*deletecust "'+f+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+s+'"')},linecust:function(t){var e=t.label,r=t.id,n=t.sep,u=void 0===n?"=":n,c=t.value,i=void 0===c?"":c,o=t.esc,a=void 0!==o&&o,s=t.once,f=void 0!==s&&s?"*linecust "+e+","+r+",%%:":"";!p(i)&&a&&(i="%("+i+"%)"),PPx.Execute("*linecust "+e+","+r+u+f+i)},getvalue:function(t,e,r){if(p(r))return[1,""];var n=b(t)?PPx.Extract("%*extract("+t+',"%%s'+e+"'"+r+"'\")"):PPx.Extract("%s"+e+"'"+r+"'");return[p(n)?13:0,n]},setvalue:function(t,e,r,n){return p(r)?1:b(t)?PPx.Execute("*execute "+t+",*string "+e+","+r+"="+n):PPx.Execute("*string "+e+","+r+"="+n)},getinput:function(t){var e,r=t.message,n=void 0===r?"":r,u=t.title,c=void 0===u?"":u,i=t.mode,o=void 0===i?"g":i,a=t.select,f=void 0===a?"a":a,l=t.multi,p=void 0!==l&&l,x=t.leavecancel,P=void 0!==x&&x,g=t.forpath,d=void 0!==g&&g,m=t.fordijit,E=void 0!==m&&m,b=t.autoselect,h=void 0!==b&&b,y=t.k,O=void 0===y?"":y,S=p?" -multi":"",j=P?" -leavecancel":"",C=d?" -forpath":"",N=E?" -fordijit":"";h&&(e=O,PPx.Execute("%OC *setcust "+s+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+s+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),O="*mapkey use,"+s+"%%:"+e);var _=""!==O?" -k %%OP- "+O:"",T=v(/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,o);if(0!==T)return[T,""];var w=PPx.Extract('%OCP %*input("'+n+'" -title:"'+c+'" -mode:'+o+" -select:"+f+S+j+C+N+_+")");return T=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[T,w]},linemessage:function(t,e,r,n){var u,c="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof e){var i=n?"%%bn":" ";u=e.join(i)}else u=e;t="."===t?"":t,u=r&&!c?'!"'+u:u,PPx.Execute("%OC *execute "+t+",*linemessage "+u)},report:function(t){var e="string"==typeof t?t:t.join(i);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(e):PPx.report(e)},close:function(t){PPx.Execute("*closeppx "+t)},jobstart:function(t){return O.execute(t,"*job start"),function(){return O.execute(t,"*job end")}},getVersion:function(t){var e=g({path:t+="\\package.json"}),r=e[0],n=e[1];if(!x(r,n))for(var u=/^\s*"version":\s*"([0-9\.]+)"\s*,/,c=2,i=n.lines.length;c<i;c++)if(~n.lines[c].indexOf('"version":'))return n.lines[c].replace(u,"$1")}};Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){var r;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var n=Object(this),u=n.length>>>0;if(0===u)return-1;var c=null!=e?e:0;if(Math.abs(c)===Infinity&&(c=0),c>=u)return-1;for(r=Math.max(c>=0?c:u-Math.abs(c),0);r<u;){if(r in n&&n[r]===t)return r;r++}return-1}),Object.keys||(Object.keys=(e=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),u=(n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(t){if("function"!=typeof t&&("object"!=typeof t||null==t))throw new TypeError("Object.keys: called on non-object");var c,i,o=[];for(c in t)e.call(t,c)&&o.push(c);if(r)for(i=0;i<u;i++)e.call(t,n[i])&&o.push(n[i]);return o})),function(){if("object"!=typeof JSON){JSON={};var t,e,r,n,u=/^[\],:{}\s]*$/,c=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,i=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,o=/(?:^|:|,)(?:\s*\[)+/g,a=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,u,c){var i;if(t="",e="","number"==typeof c)for(i=0;i<c;i+=1)e+=" ";else"string"==typeof c&&(e=c);if(n=u,u&&"function"!=typeof u&&("object"!=typeof u||"number"!=typeof u.length))throw new Error("JSON.stringify");return p("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(t,e){var r;if(t=String(t),s.lastIndex=0,s.test(t)&&(t=t.replace(s,(function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))),u.test(t.replace(c,"@").replace(i,"]").replace(o,"")))return r=Function("return ("+t+")")(),"function"==typeof e?function n(t,r){var u,c,i=t[r];if(i&&"object"==typeof i)for(u in i)Object.prototype.hasOwnProperty.call(i,u)&&((c=n(i,u))!==undefined?i[u]=c:delete i[u]);return e.call(t,r,i)}({"":r},""):r;throw new Error("JSON.parse")})}function f(t){return t<10?"0"+t:t}function l(t){return a.lastIndex=0,a.test(t)?'"'+t.replace(a,(function(t){var e=r[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+t+'"'}function p(r,u){var c,i,o,a,s,f=t,x=u[r];switch(x&&"object"==typeof x&&"function"==typeof x.toJSON&&(x=x.toJSON(r)),"function"==typeof n&&(x=n.call(u,r,x)),typeof x){case"string":return l(x);case"number":return isFinite(x)?String(x):"null";case"boolean":return String(x);case"object":if(!x)return"null";if(t+=e,s=[],"[object Array]"===Object.prototype.toString.apply(x)){for(a=x.length,c=0;c<a;c+=1)s[c]=p(String(c),x)||"null";return o=0===s.length?"[]":t?"[\n"+t+s.join(",\n"+t)+"\n"+f+"]":"["+s.join(",")+"]",t=f,o}if(n&&"object"==typeof n)for(a=n.length,c=0;c<a;c+=1)"string"==typeof n[c]&&(o=p(i=String(n[c]),x))&&s.push(l(i)+(t?": ":":")+o);else for(i in x)Object.prototype.hasOwnProperty.call(x,i)&&(o=p(i,x))&&s.push(l(i)+(t?": ":":")+o);return o=0===s.length?"{}":t?"{\n"+t+s.join(",\n"+t)+"\n"+f+"}":"{"+s.join(",")+"}",t=f,o}return"null"}}();var S=function(e){var r=PPx.Extract("%*getcust(S_ppm#sources:"+e+")");return p(r)?undefined:function(e,r){var n=JSON.parse(r.replace(/\\/g,"\\\\"));return n.path="remote"===n.location?PPx.Extract("%*getcust(S_ppm#global:home)")+"\\repo\\"+e:n.path,t({name:e},n)}(e,r)};PPx.Extract('%sgu"ppmcache"');var j,C={en:{couldNotGet:"Could not get",notFind:"Could not find plugin name",customize:"Do you want to edit the configuration file?"},jp:{couldNotGet:"取得できませんでした",notFind:"プラグイン名が見つかりませんでした",customize:"設定ファイルを編集しますか?"}}[function(){var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===t||"jp"===t?t:c}()],N=O.global("ppmcache")+"\\ppm\\"+o,_=(j=PPx.Extract('%*extract(C,"%%*temp()")'),{dir:j,file:j+"_ppmtemp",lf:j+"_temp.xlf",stdout:j+"_stdout",stderr:j+"_stderr",ppmDir:function(){var t=PPx.Extract("%'temp'%\\ppm");return PPx.Execute("*makedir "+t),t}}).file,T=function(t,e){for(var r,n=/^\x1b\[42;30m\s*([\S]+)\s*\x1b\[49;39m$/,u=t;u>=0;u--)if(~(r=e[u]).indexOf("[42;30m"))return r.replace(n,"$1");return""},w={update:function(t,e){var r=/^(\x1b\[\d+m)?(\w{0,8})\x1b\[m\s.+$/;if(r.test(e)){var n=S(t);if(n){var u=e.replace(r,"$2");return void PPx.Execute("*pptray -c %%Obd git -C "+n.path+" show --color=always --compact-summary "+u+" | %0ppvw -utf8 -esc:on -history:off")}}},customize:function(t){O.question(""+t,C.customize)&&O.execute("","%*getcust(S_ppm#user:editor) %%sgu'ppmcache'\\config\\"+t+".cfg")}};!function(){var t,e=PPx.Extract("%FDC");if(e===N)t="update";else{if(e!==_)return;t="customize"}var r=g({path:e}),n=r[0],u=r[1];x(n,u)&&(O.linemessage(".",C.couldNotGet),PPx.Quit(-1));var c=Number(PPx.Extract("%lV"))-1,i=T(c,u.lines);p(i)&&(O.linemessage(".",C.notFind),PPx.Quit(1)),w[t](i,u.lines[c])}();
