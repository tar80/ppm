﻿function _extends(){return _extends=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)({}).hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},_extends.apply(null,arguments)}var e,t,r,n;Object.keys||(Object.keys=(e=Object.prototype.hasOwnProperty,t=!{toString:null}.propertyIsEnumerable("toString"),n=(r=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(i){if("function"!=typeof i&&("object"!=typeof i||null==i))throw new Error("Object.keys: called on non-object");var a,u,o=[];for(a in i)e.call(i,a)&&o.push(a);if(t)for(u=0;u<n;u++)e.call(i,r[u])&&o.push(r[u]);return o}));var i={ppmName:"ppx-plugin-manager",ppmVersion:.95,language:"ja",encode:"utf16le",nlcode:"\r\n",nltype:"crlf",ppmID:"P",ppmSubID:"Q"},useLanguage=function(){var e=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===e||"ja"===e?e:i.language},a={initialCfg:"_initial.cfg",globalCfg:"_global.cfg",nopluginCfg:"_noplugin.cfg",pluginList:"_pluginlist",manageFiles:"_managefiles",updateLog:"_updateLog",repoDir:"repo",archDir:"arch",cacheDir:function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")}},u={tempKey:"K_ppmTemp",tempMenu:"M_ppmTemp",lfDset:"ppmlfdset"},o=PPx.CreateObject("Scripting.FileSystemObject"),expandNlCode=function(e){var t="\n",r=e.indexOf("\r");return~r&&(t="\r\n"==e.substring(r,r+2)?"\r\n":"\r"),t},isCV8=function(){return"ClearScriptV8"===PPx.ScriptEngineName},isEmptyStr=function(e){return""===e},isEmptyObj=function(e){if(e===undefined)return!1;if(null===e)return!0;for(var t in e)return!1;return!0},isInteger=function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e},isZero=function(e){return"string"==typeof e?"0"===e:0===e},c={TypeToCode:{crlf:"\r\n",cr:"\r",lf:"\n"},CodeToType:{"\r\n":"crlf","\r":"cr","\n":"lf"},Ppx:{lf:"%%bl",cr:"%%br",crlf:"%%bn",unix:"%%bl",mac:"%%br",dos:"%%bn","\n":"%%bl","\r":"%%br","\r\n":"%%bn"},Ascii:{lf:"10",cr:"13",crlf:"-1",unix:"10",mac:"13",dos:"-1","\n":"10","\r":"13","\r\n":"-1"}},exec=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},read=function(e){var t=e.path,r=e.enc,n=void 0===r?"utf8":r;if(!o.FileExists(t))return[!0,t+" not found"];var i=o.GetFile(t);if(0===i.Size)return[!0,t+" has no data"];var a=!1,u="";if("utf8"===n){var c=PPx.CreateObject("ADODB.Stream"),s=exec(c,(function(){return c.Open(),c.Charset="UTF-8",c.LoadFromFile(t),c.ReadText(-1)}));a=s[0],u=s[1]}else{var l="utf16le"===n?-1:0,p=i.OpenAsTextStream(1,l),x=exec(p,(function(){return p.ReadAll()}));a=x[0],u=x[1]}return a?[!0,"Unable to read "+t]:[!1,u]},readLines=function(e){var t,r=e.path,n=e.enc,i=void 0===n?"utf8":n,a=e.linefeed,u=read({path:r,enc:i}),o=u[0],c=u[1];if(o)return[!0,c];a=null!=(t=a)?t:expandNlCode(c.slice(0,1e3));var s=c.split(a);return isEmptyStr(s[s.length-1])&&s.pop(),[!1,{lines:s,nl:a}]},writeLines=function(e){var t=e.path,r=e.data,n=e.enc,a=void 0===n?"utf8":n,u=e.append,s=void 0!==u&&u,l=e.overwrite,p=void 0!==l&&l,x=e.linefeed,d=void 0===x?i.nlcode:x;if(!p&&!s&&o.FileExists(t))return[!0,t+" already exists"];var g,m=o.GetParentFolderName(t);if(o.FolderExists(m)||PPx.Execute("*makedir "+m),"utf8"===a){if(isCV8()){var v=r.join(d),P=s?"AppendAllText":"WriteAllText";return[!1,NETAPI.System.IO.File[P](t,v)]}var b=p||s?2:1,h=PPx.CreateObject("ADODB.Stream");g=exec(h,(function(){h.Open(),h.Charset="UTF-8",h.LineSeparator=Number(c.Ascii[d]),s?(h.LoadFromFile(t),h.Position=h.Size,h.SetEOS):h.Position=0,h.WriteText(r.join(d),1),h.SaveToFile(t,b)}))[0]}else{var E=s?8:p?2:1;o.FileExists(t)||PPx.Execute("%Osq *makefile "+t);var y="utf16le"===a?-1:0,O=o.GetFile(t).OpenAsTextStream(E,y);g=exec(O,(function(){O.Write(r.join(d)+d)}))[0]}return g?[!0,"Could not write to "+t]:[!1,""]};Array.prototype.removeEmpty||(Array.prototype.removeEmpty=function(){for(var e=[],t=0,r=this.length;t<r;t++){var n=this[t];null!=n&&""!==n&&(n instanceof Array&&0===n.length||n instanceof Object&&isEmptyObj(n)||e.push(n))}return e}),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var r;if(null==this)throw new Error('Array.indexOf: "this" is null or not defined');var n=Object(this),i=n.length>>>0;if(0===i)return-1;var a=null!=t?t:0;if(Math.abs(a)===Infinity&&(a=0),a>=i)return-1;for(r=Math.max(a>=0?a:i-Math.abs(a),0);r<i;){if(r in n&&n[r]===e)return r;r++}return-1});var s,l=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,rejectInvalidString=function(e,t){if(0===t.indexOf("@")){if(t=PPx.Extract(t).substring(1),!o.FileExists(t))return 2}else if(!e.test(t))return 13;return 0},dialog=function(e,t,r){return void 0===t&&(t=""),t=isEmptyStr(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+r+'"')},runPPmTest=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},hasTargetId=function(e){return"."!==e},p={lang:i.language},createCache=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return p[e]=t,t},autoselectEnter=function(e){return PPx.Execute("%OC *setcust "+u.tempKey+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+u.tempKey+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),"*mapkey use,"+u.tempKey+"%%:"+e},x={echo:function(e,t,r){var n=r?"("+String(r)+")":"";return dialog("I",""+e,""+t+n)},question:function(e,t){return dialog("Q",""+e,t)},choice:function(e,t,r,n,i,a,u){void 0===n&&(n="ynC");var o="Mes0411",c={yes:o+":IMYE",no:o+":IMNO",cancel:o+":IMTC"},s="."===e,l=s?'%K"@LOADCUST"':'%%K"@LOADCUST"',p=[],d=p[0],g=p[1],m=p[2],v="",P="",b="",h=!1;i&&(d=PPx.Extract("%*getcust("+c.yes+")"),v="*setcust "+c.yes+"="+i+"%:",h=!0),a&&(g=PPx.Extract("%*getcust("+c.no+")"),P="*setcust "+c.no+"="+a+"%:",h=!0),u&&(m=PPx.Extract("%*getcust("+c.cancel+")"),b="*setcust "+c.cancel+"="+u+"%:",h=!0),h&&(PPx.Execute(""+v+P+b),x.execute(e,l));var E={0:"cancel",1:"yes",2:"no"},y=s?"":e,O=PPx.Extract("%OCP %*extract("+y+'"%%*choice(-text""'+r+'"" -title:""'+t+'"" -type:'+n+')")');return h&&(d&&PPx.Execute("*setcust "+c.yes+"="+d),g&&PPx.Execute("*setcust "+c.no+"="+g),m&&PPx.Execute("*setcust "+c.cancel+"= "+m),x.execute(e,l)),E[O]},execute:function(e,t,r){if(void 0===r&&(r=!1),isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if("tray"===e)return PPx.Execute("*pptray -c "+t);if(hasTargetId(e)){if(r){var n=PPx.Extract("%*extract("+e+',"'+t+'%%&0")');return isEmptyStr(n)?1:Number(n)}return PPx.Execute("*execute "+e+","+t)}if(r){var i=PPx.Extract(t+"%&0");return isEmptyStr(i)?1:Number(i)}return PPx.Execute(t)},execSync:function(e,t){if(isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return isEmptyStr(PPx.Extract("%N"+e))?6:Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(isEmptyStr(t))return[13,""];var r=hasTargetId(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),r]},lang:function(){var e=p.lang;if(!isEmptyStr(e))return e;var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return e="en"===t||"ja"===t?t:i.language,p.lang=e,e},global:function(e){var t,r,n=p[e];if(n)return n;if(/^ppm[ahrcl]?/.test(e)){if(n=PPx.Extract("%sgu'"+e+"'"),isEmptyStr(n)){var i=e.replace("ppm","");switch(i){case"":n=null!=(t=p.ppm)?t:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":n=null!=(r=p.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var u;n=(null!=(u=p.ppm)?u:createCache("ppm"))+"\\dist\\lib";break;default:var o,c=null!=(o=p.home)?o:createCache("home");"cache"===i&&(n=c+"\\"+a.cacheDir())}}}else n=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return p[e]=n,n},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return isEmptyStr(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,r){void 0===r&&(r="");var n=rejectInvalidString(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==n)return[n,""];if(isEmptyStr(t))return[1,""];var i=isEmptyStr(r)?"":',"'+r+'"',a=PPx.Extract("%*name("+e+',"'+t+'"'+i+")");return[n=Number(PPx.Extract()),a]},getcust:function(e){if(isEmptyStr(e))return[1,""];var t=rejectInvalidString(l,e);return 0!==t?[t,""]:[t,PPx.Extract("%*getcust("+e+")")]},setcust:function(e,t){if(void 0===t&&(t=!1),isEmptyStr(e))return 1;var r=rejectInvalidString(l,e);if(0!==r)return r;var n=t?"%OC ":"";return PPx.Execute(n+"*setcust "+e)},deletecust:function(e,t,r){var n="boolean"==typeof t,i=/^\s*"?([^"\s]+)"?\s*?$/,a=e.replace(i,"$1"),u=String(t),o=rejectInvalidString(l,a);if(0!==o)return o;var c=null==t||n||isEmptyStr(u)?'"'+a+'"':a+","+("string"==typeof t?'"'+t.replace(i,"$1")+'"':""+t);return PPx.Execute("*deletecust "+c),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,r,n){if(void 0===r&&(r=!1),void 0===n&&(n=""),isEmptyStr(e))throw new Error("SubId not specified");isEmptyStr(n)||(n="*skip "+n+"%bn%bt",r=!0);var i=r?"%OC ":"";return PPx.Execute(i+"*setcust "+u.tempKey+":"+e+","+n+t),u.tempKey},deletemenu:function(){PPx.Execute('*deletecust "'+u.tempMenu+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+u.tempKey+'"')},linecust:function(e){var t=e.label,r=e.id,n=e.sep,i=void 0===n?"=":n,a=e.value,u=void 0===a?"":a,o=e.esc,c=void 0!==o&&o,s=e.once,l=void 0!==s&&s?"*linecust "+t+","+r+",%%:":"";!isEmptyStr(u)&&c&&(u="%("+u+"%)"),PPx.Execute("*linecust "+t+","+r+i+l+u)},getvalue:function(e,t,r){if(isEmptyStr(r))return[1,""];var n=hasTargetId(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+r+"'\")"):PPx.Extract("%s"+t+"'"+r+"'");return[isEmptyStr(n)?13:0,n]},setvalue:function(e,t,r,n){return isEmptyStr(r)?1:hasTargetId(e)?PPx.Execute("*execute "+e+",*string "+t+","+r+"="+n):PPx.Execute("*string "+t+","+r+"="+n)},getinput:function(e){var t=e.message,r=void 0===t?"":t,n=e.title,i=void 0===n?"":n,a=e.mode,u=void 0===a?"g":a,o=e.select,c=void 0===o?"a":o,s=e.multi,l=void 0!==s&&s,p=e.leavecancel,x=void 0!==p&&p,d=e.forpath,g=void 0!==d&&d,m=e.fordijit,v=void 0!==m&&m,P=e.autoselect,b=void 0!==P&&P,h=e.k,E=void 0===h?"":h,y=/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,O=l?" -multi":"",S=x?" -leavecancel":"",w=g?" -forpath":"",j=v?" -fordijit":"";b&&(E=autoselectEnter(E));var N=""!==E?" -k %%OP- "+E:"",C=rejectInvalidString(y,u);if(0!==C)return[C,""];var _=PPx.Extract('%OCP %*input("'+r+'" -title:"'+i+'" -mode:'+u+" -select:"+c+O+S+w+j+N+")");return C=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[C,_]},linemessage:function(e,t,r,n){var i,a="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var u=n?"%%bn":" ";i=t.join(u)}else i=t;e="."===e?"":e,i=r&&!a?'!"'+i:i,PPx.Execute("%OC *execute "+e+",*linemessage "+i)},report:function(e){var t="string"==typeof e?e:e.join(i.nlcode);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(t):PPx.report(t)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return x.execute(e,"*job start"),function(){return x.execute(e,"*job end")}},getVersion:function(e){var t=readLines({path:e+="\\package.json"}),r=t[0],n=t[1];if(!r)for(var i=/^\s*"version":\s*"([0-9\.]+)"\s*,/,a=2,u=n.lines.length;a<u;a++)if(~n.lines[a].indexOf('"version":'))return n.lines[a].replace(i,"$1")}},d=(s=PPx.Extract("%*getcust(S_ppm#global:git)"),isEmptyStr(s)?"echo":'"'+s+'\\usr\\bin\\echo.exe"'),coloredEcho=function(e,t,r){void 0===r&&(r=!1),t=t.replace(/\\/g,"\\\\");var n=r?"W":"",i="."===e?"%OP"+n+" "+d+" -ne '%("+t+"%)'":"*execute "+e+",%%OP"+n+" "+d+" -ne '%%("+t+"%%)'";return PPx.Execute(i)},g={fg:{black:"30",red:"31",green:"32",yellow:"33",blue:"34",magenta:"35",cyan:"36",white:"37",def:"39"},bg:{black:"40",red:"41",green:"42",yellow:"43",blue:"44",magenta:"45",cyan:"46",white:"47",def:"49"}},getEscSeq=function(e){return e?"\\x1b[":"["},colorlize=function(e){var t=e.message,r=e.esc,n=void 0!==r&&r,i=e.fg,a=e.bg;if(isEmptyStr(t))return"";var u=getEscSeq(n);return!i||isEmptyStr(i)?""+t:""+(""+u+(a?g.bg[a]+";":"")+g.fg[i]+"m")+t+u+"49;39m"},winpos=function(e,t,r){return isInteger(t)&&isInteger(r)?"*windowposition "+e+","+(t<0?0:t)+","+(r<0?0:r):""},winsize=function(e,t,r){return isInteger(t)&&isInteger(r)?"*windowsize "+e+","+(t<200?200:t)+","+(r<200?200:r):""},runCmdline=function(e){var t=e.startwith,r=void 0===t?"":t,n=e.wait,i=void 0===n?"":n,a=e.priority,u=e.job,o=e.log,c=e.wd,s=e.x,l=e.y,p=e.width,d=e.height,g={"":"",min:"-min",max:"-max",noactive:"-noactive",bottom:"-noactive"}[r],m={"":"",wait:"-wait",idle:"-wait:idle",later:"-wait:later",no:"-wait:no"}[i],v="";if(c){if(!PPx.CreateObject("Scripting.FileSystemObject").FolderExists(c))return[!1,["[WARNING] Specified working directory is not exist"]];v="-d:"+c}var P=a?"-"+a:"",b=u?"-"+u:"",h=o?"-log":"";return s&&s>Number(x.global("disp_width"))&&(s=0),l&&l>Number(x.global("disp_height"))&&(l=0),[!0,["*run","-noppb",g,m,P,b,h,v,s&&l?"-pos:"+s+","+l:"",p&&d?"-size:"+p+","+d:""]]},ppbCmdline=function(e){var t=e.bootid,r=e.bootmax,n=e.q,i=e.c,a=e.k;return{id:t?"-bootid:"+t:"",max:r?"-bootmax:"+r:"",quiet:n?"-q":"",postcmd:i||(a||"")}},runPPb=function(e){var t=e.bootid,r=e.bootmax,n=e.q,i=e.c,a=e.k,u=e.startwith,o=void 0===u?"":u,c=e.wait,s=void 0===c?"":c,l=e.priority,p=e.job,x=e.log,g=e.wd,m=e.x,v=e.y,P=e.width,b=e.height,h=e.desc,E=e.fg,y=e.bg;if(-1!==PPx.Extract("%*ppxlist(-B)").indexOf("B_"+t))return PPx.Execute("*focus B"+t),!0;var O=runCmdline({startwith:o,wait:s,priority:l,job:p,log:x,wd:g}),S=O[0],w=O[1];if(!S)return!1;var j=ppbCmdline({bootid:t,bootmax:r,q:n,c:i,k:a}),N=[];"min"===o||"max"===o||i||(N.push(winpos("%%n",m,v)),N.push(winsize("%%n",P,b)),"bottom"!==o||i||N.push("*selectppx %n")),h&&!isEmptyStr(h)&&N.push(d+' -e "'+colorlize({esc:!0,message:h,fg:E,bg:y})+' \\n"'),N.push(j.postcmd);var C="";N.length>0&&(C=(i?"-c ":"-k ")+N.removeEmpty().join("%%:"));var _=[].concat(w,["%0ppbw.exe",j.id,j.max,j.quiet]).removeEmpty().join(" "),k=!0;try{/^-k $/.test(C)&&(C=""),PPx.Execute(_+" "+C+"%:*wait 500,2")}catch(A){k=!1}finally{return k}},_setStdin=function(e,t){return e?'-io:string,"'+e+'"':t?'io:send,"'+t.join("%bl")+'"':""},runStdout=function(e){var t=e.cmdline,r=e.wd,n=e.extract,i=void 0!==n&&n,a=e.startmsg,u=void 0!==a&&a,o=e.hide,c=void 0!==o&&o,s=e.utf8,l=void 0===s||s,p=e.single,x=e.multi,d=[c?"-noppb -hide":"-min",u?"":"-nostartmsg",r?"-d:"+r:"",l?"-io:utf8":"",_setStdin(p,x)].join(" ");i||(t="%("+t+"%)");var g=PPx.Extract("%OC %*run("+d+" "+t+")");return[Number(PPx.Extract()),g]};!function(){if("object"!=typeof JSON){JSON={};var e,t,r,n,i=/^[\],:{}\s]*$/,a=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,u=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,o=/(?:^|:|,)(?:\s*\[)+/g,c=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,i,a){var u;if(e="",t="","number"==typeof a)for(u=0;u<a;u+=1)t+=" ";else"string"==typeof a&&(t=a);if(n=i,i&&"function"!=typeof i&&("object"!=typeof i||"number"!=typeof i.length))throw new Error("JSON.stringify");return str("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(e,t){var r;function walk(e,r){var n,i,a=e[r];if(a&&"object"==typeof a)for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&((i=walk(a,n))!==undefined?a[n]=i:delete a[n]);return t.call(e,r,a)}if(e=String(e),s.lastIndex=0,s.test(e)&&(e=e.replace(s,(function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))),i.test(e.replace(a,"@").replace(u,"]").replace(o,"")))return r=Function("return ("+e+")")(),"function"==typeof t?walk({"":r},""):r;throw new Error("JSON.parse")})}function f(e){return e<10?"0"+e:e}function quote(e){return c.lastIndex=0,c.test(e)?'"'+e.replace(c,(function(e){var t=r[e];return"string"==typeof t?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+e+'"'}function str(r,i){var a,u,o,c,s,l=e,p=i[r];switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(r)),"function"==typeof n&&(p=n.call(i,r,p)),typeof p){case"string":return quote(p);case"number":return isFinite(p)?String(p):"null";case"boolean":return String(p);case"object":if(!p)return"null";if(e+=t,s=[],"[object Array]"===Object.prototype.toString.apply(p)){for(c=p.length,a=0;a<c;a+=1)s[a]=str(String(a),p)||"null";return o=0===s.length?"[]":e?"[\n"+e+s.join(",\n"+e)+"\n"+l+"]":"["+s.join(",")+"]",e=l,o}if(n&&"object"==typeof n)for(c=n.length,a=0;a<c;a+=1)"string"==typeof n[a]&&(o=str(u=String(n[a]),p))&&s.push(quote(u)+(e?": ":":")+o);else for(u in p)Object.prototype.hasOwnProperty.call(p,u)&&(o=str(u,p))&&s.push(quote(u)+(e?": ":":")+o);return o=0===s.length?"{}":e?"{\n"+e+s.join(",\n"+e)+"\n"+l+"}":"{"+s.join(",")+"}",e=l,o}return"null"}}();var parseSource=function(e,t){var r=JSON.parse(t.replace(/\\/g,"\\\\"));return r.path="remote"===r.location?PPx.Extract("%*getcust(S_ppm#global:home)")+"\\repo\\"+e:r.path,_extends({name:e},r)},expandSource=function(e){var t=PPx.Extract("%*getcust(S_ppm#sources:"+e+")");return isEmptyStr(t)?undefined:parseSource(e,t)},owSource=function(e,t){var r=PPx.Extract("%*getcust(S_ppm#sources:"+e+")");if(isEmptyObj(t)||isEmptyStr(r))return undefined;for(var n=0,i=Object.keys(t);n<i.length;n++){var a=i[n],u=RegExp('"'+a+'":[^,}]+'),o="boolean"==typeof t[a]?t[a]:'"'+t[a]+'"';r=r.replace(u,'"'+a+'":'+o)}return PPx.Execute("*setcust S_ppm#sources:"+e+"="+r),parseSource(e,r)},sourceNames=function(){for(var e=PPx.Extract("%*getcust(S_ppm#sources)").split(i.nlcode),t=[],r=1,n=e.length-2;r<n;r++)t.push(e[r].split(/\t/)[0]);return t};PPx.Extract('%sgu"ppmcache"');var validArgs=function(){for(var e=[],t=PPx.Arguments;!t.atEnd();t.moveNext())e.push(t.value);return e},safeArgs=function(){for(var e=[],t=validArgs(),r=0,n=arguments.length;r<n;r++)e.push(_valueConverter(r<0||arguments.length<=r?undefined:arguments[r],t[r]));return e},_valueConverter=function(e,t){if(null==t||""===t)return null!=e?e:undefined;switch(typeof e){case"number":var r=Number(t);return isNaN(r)?e:r;case"boolean":return"false"!==t&&"0"!==t&&null!=t;default:return t}},m={en:{detached:"Branch is detached",failedToGet:"Failed to get branch",updates:"Update has been completed",failedPull:"git pull failed"},ja:{detached:"ブランチはデタッチ状態です",failedToGet:"ブランチの取得に失敗しました",updates:"更新が完了しました",failedPull:"git pull できませんでした"}},v=[{state:"Rebase",att:"file",parent:"/rabase-apply/rebasing",filename:"/HEAD"},{state:"Am",att:"file",parent:"/rabase-apply/applying",filename:"/HEAD"},{state:"Am/Rebase",att:"dir",parent:"/rebase-apply",filename:"/HEAD"},{state:"Rebase-i",att:"file",parent:"/rebase-merge/interactive",filename:"/rebase-merge/head-name"},{state:"Rebase-m",att:"dir",parent:"/rebase-merge",filename:"/rebase-merge/head-name"},{state:"Merging",att:"file",parent:"/MERGE_HEAD",filename:"/HEAD"}],nameAndState=function(e,t,r){var n="(unknown)",i=readLines({path:t}),a=i[0],u=i[1];if(a)return[n,r];if(~u.lines[0].indexOf("refs/heads/"))return[u.lines[0].replace(/^(ref: )?refs\/heads\/(.+)/,"$2"),r];var c=n,s=e+"/logs/HEAD";if(o.FileExists(s)){var l=readLines({path:s}),p=l[0],x=l[1];if(p)return[n,r];for(var d=x.lines,g=d.length-1;0<g;g--)if(~d[g].indexOf("checkout: moving from")){c=d[g].replace(/.*to\s(.+)$/,"$1"),r="Detached";break}}return[c,r]};function branchName(e){var t="",r="";if(!o.FolderExists(e))return[t,r];for(var n=e+"\\.git",i=[],a=i[0],u=i[1],c=0;c<v.length;c++){var s=v[c];if(a=n+"\\"+s.parent,"file"===s.att&&o.FileExists(a)){if(u=n+"\\"+s.filename,o.FileExists(u)){var l=nameAndState(n,u,s.state);t=l[0],r=l[1];break}}else if("dir"===s.att&&o.FolderExists(a)&&(u=n+"\\"+s.filename,o.FileExists(u))){var p=nameAndState(n,u,s.state);t=p[0],r=p[1];break}var x=nameAndState(n,n+"\\HEAD","");t=x[0],r=x[1]}return[t,r]}function branchHead(e){if(void 0===e&&(e=""),!o.FolderExists(e))return[!0,e+" is not exists"];var t=e+"\\.git\\HEAD",r=read({path:t}),n=r[0],i=r[1];if(n)return[!0,i];var a=/^ref:\s(\S+)[\s\S]*/;if(~i.indexOf("ref: ")){t=e+"\\.git\\"+(i=i.replace(a,"$1")).replace(/\//g,"\\");var u=read({path:t});if(n=u[0],i=u[1],n)return[!0,i]}return[!1,i.replace(/\s*$/,"")]}a.cacheDir();var P={checkUpdate:function(e){var t=branchHead(e),r=t[0],n=t[1];if(r)return[!0,"failedToGet"];var i=branchName(e),a=i[0],u=i[1];if(!isEmptyStr(u))return[!0,"detached"];var o=runStdout({cmdline:"git ls-remote origin "+a,wd:e,hide:!0}),c=o[0],s=o[1];return isZero(c)?n===s.split("\t")[0]?[!0,"noUpdates"]:[!1,n]:[!0,s]}},b="--oneline --color=always",h=x.global("ppmcache")+"\\ppm\\"+a.updateLog,E=m[useLanguage()],main=function(){var e=x.jobstart("."),t="B"+i.ppmID,r=x.global("version"),n=i.ppmName+" ver"+r;runPPb({bootid:i.ppmID,desc:n,k:"*option terminal",fg:"cyan",x:0,y:0,width:700,height:500});var a,u=safeArgs("all",!1),o=u[0],c=u[1],s="all"!==o?[o]:sourceNames(),l=colorlize({message:" CHECK ",esc:!0,fg:"black",bg:"cyan"}),p=colorlize({message:"ERROR  ",esc:!0,fg:"red"}),d=colorlize({message:"UPDATED",esc:!0,fg:"green"}),g=!1;if(!c){coloredEcho(t,l+" "+i.ppmName);var m=updatePpm(),v=m[0],y=m[1];g=!v,v&&"noUpdates"!==y&&(coloredEcho(t,p+" "+y,!0),e(),PPx.Quit(-1))}for(var O=0;O<s.length;O++){var S,w=s[O];if(w!==i.ppmName){a=expandSource(w);var j=null!=(S=x.getVersion(a.path))?S:"0.0.0";if("local"!==a.location){coloredEcho(t,l+" "+w);var N=P.checkUpdate(a.path),C=N[0],_=N[1];if(C)"noUpdates"!==_&&coloredEcho(t,p+" "+E[_]);else if("noUpdates"!==_)if(c)coloredEcho(t,d+" "+_);else{var k=x.execute(".","@git -C "+a.path+" pull",!0);if(!isZero(k)){coloredEcho(t,p+" "+E.failedPull);continue}writeTitle(a.name,g),g=!0,PPx.Execute("%Obds git -C "+a.path+" log "+b+" head..."+_+">> "+h),owSource(a.name,{version:j})}}else j>a.version&&owSource(a.name,{version:j})}}g?x.execute(t,"*script %sgu'ppm'\\dist\\ppmLogViewer.js,update%%:*closeppx %%n"):x.execute(t,'%%OW echo "" %%:*closeppx %%n'),e()},writeTitle=function(e,t){var r=i.nlcode,n=t?{append:!0}:{overwrite:!0},a=colorlize({message:e,fg:"black",bg:"green"});writeLines(_extends({path:h,data:[a],linefeed:r},n))},updatePpm=function(){var e=x.global("ppm"),t=P.checkUpdate(e),r=t[0],n=t[1];if(r||"noUpdates"===n){var a=x.global("version"),u=expandSource("ppx-plugin-manager");u&&a!==u.version&&owSource("ppx-plugin-manager",{version:a})}else{var o,c=x.execute(".","@git -C "+e+" pull",!0);if(!isZero(c))return[!0,E.failedPull];writeTitle(i.ppmName,!1),PPx.Execute("%Obds git -C "+e+" log "+b+" head..."+n+">> "+h);var s=null!=(o=x.getVersion(e))?o:i.ppmVersion;owSource(i.ppmName,{version:s}),x.setcust("S_ppm#global:version="+s),PPx.Execute('*script %sgu"ppm"\\dist\\ppmInstall.js,2')}return[r,n]};main();
