﻿var e={ppmName:"ppx-plugin-manager",ppmVersion:.95,language:"ja",nlcode:"\r\n",nltype:"crlf",ppmID:"P",ppmSubID:"Q"},useLanguage=function(){var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===t||"ja"===t?t:e.language},t={initialCfg:"_initial.cfg",globalCfg:"_global.cfg",nopluginCfg:"_noplugin.cfg",pluginList:"_pluginlist",manageFiles:"_managefiles",updateLog:"_updateLog",repoDir:"repo",archDir:"arch",cacheDir:function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")}},r={tempKey:"K_ppmTemp",tempMenu:"M_ppmTemp",lfDset:"ppmlfdset"},isEmptyStr=function(e){return""===e},isEmptyObj=function(e){if(e===undefined)return!1;if(null===e)return!0;for(var t in e)return!1;return!0},isInteger=function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e},pathSelf=function(){var e,t,r=PPx.ScriptName;return~r.indexOf("\\")?(e=r.replace(/^.*\\/,""),t=PPx.Extract("%*name(DKN,"+r+")")):(e=r,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}},pathJoin=function(){for(var e=[],t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];for(var i=0;i<r.length;i++){var u=r[i];isEmptyStr(u)||e.push(u)}return e.join("\\")||""},n=PPx.CreateObject("Scripting.FileSystemObject"),expandNlCode=function(e){var t="\n",r=e.indexOf("\r");return~r&&(t="\r\n"==e.substring(r,r+2)?"\r\n":"\r"),t},exec=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},read=function(e){var t=e.path,r=e.enc,i=void 0===r?"utf8":r;if(!n.FileExists(t))return[!0,t+" not found"];var u=n.GetFile(t);if(0===u.Size)return[!0,t+" has no data"];var o=!1,c="";if("utf8"===i){var a=PPx.CreateObject("ADODB.Stream"),s=exec(a,(function(){return a.Open(),a.Charset="UTF-8",a.LoadFromFile(t),a.ReadText(-1)}));o=s[0],c=s[1]}else{var p="utf16le"===i?-1:0,l=u.OpenAsTextStream(1,p),x=exec(l,(function(){return l.ReadAll()}));o=x[0],c=x[1]}return o?[!0,"Unable to read "+t]:[!1,c]},readLines=function(e){var t,r=e.path,n=e.enc,i=void 0===n?"utf8":n,u=e.linefeed,o=read({path:r,enc:i}),c=o[0],a=o[1];if(c)return[!0,a];u=null!=(t=u)?t:expandNlCode(a.slice(0,1e3));var s=a.split(u);return isEmptyStr(s[s.length-1])&&s.pop(),[!1,{lines:s,nl:u}]},i=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,rejectInvalidString=function(e,t){if(0===t.indexOf("@")){if(t=PPx.Extract(t).substring(1),!n.FileExists(t))return 2}else if(!e.test(t))return 13;return 0},dialog=function(e,t,r){return void 0===t&&(t=""),t=isEmptyStr(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+r+'"')},runPPmTest=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},hasTargetId=function(e){return"."!==e},u={lang:e.language},createCache=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return u[e]=t,t},autoselectEnter=function(e){return PPx.Execute("%OC *setcust "+r.tempKey+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+r.tempKey+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),"*mapkey use,"+r.tempKey+"%%:"+e},o={echo:function(e,t,r){var n=r?"("+String(r)+")":"";return dialog("I",""+e,""+t+n)},question:function(e,t){return dialog("Q",""+e,t)},choice:function(e,t,r,n,i,u,c){void 0===n&&(n="ynC");var a="Mes0411",s={yes:a+":IMYE",no:a+":IMNO",cancel:a+":IMTC"},p="."===e,l=p?'%K"@LOADCUST"':'%%K"@LOADCUST"',x=[],g=x[0],P=x[1],m=x[2],d="",h="",v="",b=!1;i&&(g=PPx.Extract("%*getcust("+s.yes+")"),d="*setcust "+s.yes+"="+i+"%:",b=!0),u&&(P=PPx.Extract("%*getcust("+s.no+")"),h="*setcust "+s.no+"="+u+"%:",b=!0),c&&(m=PPx.Extract("%*getcust("+s.cancel+")"),v="*setcust "+s.cancel+"="+c+"%:",b=!0),b&&(PPx.Execute(""+d+h+v),o.execute(e,l));var y={0:"cancel",1:"yes",2:"no"},E=p?"":e,O=PPx.Extract("%OCP %*extract("+E+'"%%*choice(-text""'+r+'"" -title:""'+t+'"" -type:'+n+')")');return b&&(g&&PPx.Execute("*setcust "+s.yes+"="+g),P&&PPx.Execute("*setcust "+s.no+"="+P),m&&PPx.Execute("*setcust "+s.cancel+"= "+m),o.execute(e,l)),y[O]},execute:function(e,t,r){return void 0===r&&(r=!1),isEmptyStr(t)?1:runPPmTest()?2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)"):"tray"===e?PPx.Execute("*pptray -c "+t):hasTargetId(e)?r?Number(PPx.Extract("%*extract("+e+',"'+t+'%%:0")')):PPx.Execute("*execute "+e+","+t):PPx.Execute(t)},execSync:function(e,t){if(isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return isEmptyStr(PPx.Extract("%N"+e))?6:Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(isEmptyStr(t))return[13,""];var r=hasTargetId(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),r]},lang:function(){var t=u.lang;if(!isEmptyStr(t))return t;var r=PPx.Extract("%*getcust(S_ppm#global:lang)");return t="en"===r||"ja"===r?r:e.language,u.lang=t,t},global:function(e){var r,n,i=u[e];if(i)return i;if(/^ppm[ahrcl]?/.test(e)){if(i=PPx.Extract("%sgu'"+e+"'"),isEmptyStr(i)){var o=e.replace("ppm","");switch(o){case"":i=null!=(r=u.ppm)?r:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":i=null!=(n=u.home)?n:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var c;i=(null!=(c=u.ppm)?c:createCache("ppm"))+"\\dist\\lib";break;default:var a,s=null!=(a=u.home)?a:createCache("home");"cache"===o&&(i=s+"\\"+t.cacheDir())}}}else i=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return u[e]=i,i},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return isEmptyStr(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,r){void 0===r&&(r="");var n=rejectInvalidString(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==n)return[n,""];if(isEmptyStr(t))return[1,""];var i=isEmptyStr(r)?"":',"'+r+'"',u=PPx.Extract("%*name("+e+',"'+t+'"'+i+")");return[n=Number(PPx.Extract()),u]},getcust:function(e){if(isEmptyStr(e))return[1,""];var t=rejectInvalidString(i,e);return 0!==t?[t,""]:[t,PPx.Extract("%*getcust("+e+")")]},setcust:function(e,t){if(void 0===t&&(t=!1),isEmptyStr(e))return 1;var r=rejectInvalidString(i,e);if(0!==r)return r;var n=t?"%OC ":"";return PPx.Execute(n+"*setcust "+e)},deletecust:function(e,t,r){var n="boolean"==typeof t,u=/^\s*"?([^"\s]+)"?\s*?$/,o=e.replace(u,"$1"),c=String(t),a=rejectInvalidString(i,o);if(0!==a)return a;var s=null==t||n||isEmptyStr(c)?'"'+o+'"':o+","+("string"==typeof t?'"'+t.replace(u,"$1")+'"':""+t);return PPx.Execute("*deletecust "+s),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,n,i){if(void 0===n&&(n=!1),void 0===i&&(i=""),isEmptyStr(e))throw new Error("SubId not specified");isEmptyStr(i)||(i="*skip "+i+"%bn%bt",n=!0);var u=n?"%OC ":"";return PPx.Execute(u+"*setcust "+r.tempKey+":"+e+","+i+t),r.tempKey},deletemenu:function(){PPx.Execute('*deletecust "'+r.tempMenu+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+r.tempKey+'"')},linecust:function(e){var t=e.label,r=e.id,n=e.sep,i=void 0===n?"=":n,u=e.value,o=void 0===u?"":u,c=e.esc,a=void 0!==c&&c,s=e.once,p=void 0!==s&&s?"*linecust "+t+","+r+",%%:":"";!isEmptyStr(o)&&a&&(o="%("+o+"%)"),PPx.Execute("*linecust "+t+","+r+i+p+o)},getvalue:function(e,t,r){if(isEmptyStr(r))return[1,""];var n=hasTargetId(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+r+"'\")"):PPx.Extract("%s"+t+"'"+r+"'");return[isEmptyStr(n)?13:0,n]},setvalue:function(e,t,r,n){return isEmptyStr(r)?1:hasTargetId(e)?PPx.Execute("*execute "+e+",*string "+t+","+r+"="+n):PPx.Execute("*string "+t+","+r+"="+n)},getinput:function(e){var t=e.message,r=void 0===t?"":t,n=e.title,i=void 0===n?"":n,u=e.mode,o=void 0===u?"g":u,c=e.select,a=void 0===c?"a":c,s=e.multi,p=void 0!==s&&s,l=e.leavecancel,x=void 0!==l&&l,g=e.forpath,P=void 0!==g&&g,m=e.fordijit,d=void 0!==m&&m,h=e.autoselect,v=void 0!==h&&h,b=e.k,y=void 0===b?"":b,E=/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,O=p?" -multi":"",S=x?" -leavecancel":"",w=P?" -forpath":"",j=d?" -fordijit":"";v&&(y=autoselectEnter(y));var N=""!==y?" -k %%OP- "+y:"",C=rejectInvalidString(E,o);if(0!==C)return[C,""];var _=PPx.Extract('%OCP %*input("'+r+'" -title:"'+i+'" -mode:'+o+" -select:"+a+O+S+w+j+N+")");return C=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[C,_]},linemessage:function(e,t,r,n){var i,u="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var o=n?"%%bn":" ";i=t.join(o)}else i=t;e="."===e?"":e,i=r&&!u?'!"'+i:i,PPx.Execute("%OC *execute "+e+",*linemessage "+i)},report:function(t){var r="string"==typeof t?t:t.join(e.nlcode);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(r):PPx.report(r)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return o.execute(e,"*job start"),function(){return o.execute(e,"*job end")}},getVersion:function(e){var t=readLines({path:e+="\\package.json"}),r=t[0],n=t[1];if(!r)for(var i=/^\s*"version":\s*"([0-9\.]+)"\s*,/,u=2,o=n.lines.length;u<o;u++)if(~n.lines[u].indexOf('"version":'))return n.lines[u].replace(i,"$1")}};Array.prototype.removeEmpty||(Array.prototype.removeEmpty=function(){for(var e=[],t=0,r=this.length;t<r;t++){var n=this[t];null!=n&&""!==n&&(n instanceof Array&&0===n.length||n instanceof Object&&isEmptyObj(n)||e.push(n))}return e});var c,a,s,p,l,x=(c=PPx.Extract("%*getcust(S_ppm#global:git)"),isEmptyStr(c)?"echo":'"'+c+'\\usr\\bin\\echo.exe"'),g={fg:{black:"30",red:"31",green:"32",yellow:"33",blue:"34",magenta:"35",cyan:"36",white:"37",def:"39"},bg:{black:"40",red:"41",green:"42",yellow:"43",blue:"44",magenta:"45",cyan:"46",white:"47",def:"49"}},getEscSeq=function(e){return e?"\\x1b[":"["},colorlize=function(e){var t=e.message,r=e.esc,n=void 0!==r&&r,i=e.fg,u=e.bg;if(isEmptyStr(t))return"";var o=getEscSeq(n);return!i||isEmptyStr(i)?""+t:""+(""+o+(u?g.bg[u]+";":"")+g.fg[i]+"m")+t+o+"49;39m"},winpos=function(e,t,r){return isInteger(t)&&isInteger(r)?"*windowposition "+e+","+(t<0?0:t)+","+(r<0?0:r):""},winsize=function(e,t,r){return isInteger(t)&&isInteger(r)?"*windowsize "+e+","+(t<200?200:t)+","+(r<200?200:r):""},runCmdline=function(e){var t=e.startwith,r=void 0===t?"":t,n=e.wait,i=void 0===n?"":n,u=e.priority,c=e.job,a=e.log,s=e.wd,p=e.x,l=e.y,x=e.width,g=e.height,P={"":"",min:"-min",max:"-max",noactive:"-noactive",bottom:"-noactive"}[r],m={"":"",wait:"-wait",idle:"-wait:idle",later:"-wait:later",no:"-wait:no"}[i],d="";if(s){if(!PPx.CreateObject("Scripting.FileSystemObject").FolderExists(s))return[!1,["[WARNING] Specified working directory is not exist"]];d="-d:"+s}var h=u?"-"+u:"",v=c?"-"+c:"",b=a?"-log":"";return p&&p>Number(o.global("disp_width"))&&(p=0),l&&l>Number(o.global("disp_height"))&&(l=0),[!0,["*run","-noppb",P,m,h,v,b,d,p&&l?"-pos:"+p+","+l:"",x&&g?"-size:"+x+","+g:""]]},ppbCmdline=function(e){var t=e.bootid,r=e.bootmax,n=e.q,i=e.c,u=e.k;return{id:t?"-bootid:"+t:"",max:r?"-bootmax:"+r:"",quiet:n?"-q":"",postcmd:i||(u||"")}},runPPb=function(e){var t=e.bootid,r=e.bootmax,n=e.q,i=e.c,u=e.k,o=e.startwith,c=void 0===o?"":o,a=e.wait,s=void 0===a?"":a,p=e.priority,l=e.job,g=e.log,P=e.wd,m=e.x,d=e.y,h=e.width,v=e.height,b=e.desc,y=e.fg,E=e.bg;if(-1!==PPx.Extract("%*ppxlist(-B)").indexOf("B_"+t))return PPx.Execute("*focus B"+t),!0;var O=runCmdline({startwith:c,wait:s,priority:p,job:l,log:g,wd:P}),S=O[0],w=O[1];if(!S)return!1;var j=ppbCmdline({bootid:t,bootmax:r,q:n,c:i,k:u}),N=[];"min"===c||"max"===c||i||(N.push(winpos("%%n",m,d)),N.push(winsize("%%n",h,v)),"bottom"!==c||i||N.push("*selectppx %n")),b&&!isEmptyStr(b)&&N.push(x+' -e "'+colorlize({esc:!0,message:b,fg:y,bg:E})+' \\n"'),N.push(j.postcmd);var C="";N.length>0&&(C=(i?"-c ":"-k ")+N.removeEmpty().join("%%:"));var _=[].concat(w,["%0ppbw.exe",j.id,j.max,j.quiet]).removeEmpty().join(" "),k=!0;try{/^-k $/.test(C)&&(C=""),PPx.Execute(_+" "+C+"%:*wait 500,2")}catch(D){k=!1}finally{return k}},P={en:{notRegistered:"Not installed",start:"Start uninstalling ppm",finish:"Uninstallation completed. Restart PPc"},ja:{notRegistered:"インストールされていません",start:"ppmのアンインストールを開始します",finish:"アンインストールが完了しました。PPcを再起動します"}};Object.keys||(Object.keys=(a=Object.prototype.hasOwnProperty,s=!{toString:null}.propertyIsEnumerable("toString"),l=(p=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(e){if("function"!=typeof e&&("object"!=typeof e||null==e))throw new TypeError("Object.keys: called on non-object");var t,r,n=[];for(t in e)a.call(e,t)&&n.push(t);if(s)for(r=0;r<l;r++)a.call(e,p[r])&&n.push(p[r]);return n})),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var r;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var n=Object(this),i=n.length>>>0;if(0===i)return-1;var u=null!=t?t:0;if(Math.abs(u)===Infinity&&(u=0),u>=i)return-1;for(r=Math.max(u>=0?u:i-Math.abs(u),0);r<i;){if(r in n&&n[r]===e)return r;r++}return-1}),function(){if("object"!=typeof JSON){JSON={};var e,t,r,n,i=/^[\],:{}\s]*$/,u=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,o=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,c=/(?:^|:|,)(?:\s*\[)+/g,a=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,i,u){var o;if(e="",t="","number"==typeof u)for(o=0;o<u;o+=1)t+=" ";else"string"==typeof u&&(t=u);if(n=i,i&&"function"!=typeof i&&("object"!=typeof i||"number"!=typeof i.length))throw new Error("JSON.stringify");return str("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(e,t){var r;function walk(e,r){var n,i,u=e[r];if(u&&"object"==typeof u)for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&((i=walk(u,n))!==undefined?u[n]=i:delete u[n]);return t.call(e,r,u)}if(e=String(e),s.lastIndex=0,s.test(e)&&(e=e.replace(s,(function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))),i.test(e.replace(u,"@").replace(o,"]").replace(c,"")))return r=Function("return ("+e+")")(),"function"==typeof t?walk({"":r},""):r;throw new Error("JSON.parse")})}function f(e){return e<10?"0"+e:e}function quote(e){return a.lastIndex=0,a.test(e)?'"'+e.replace(a,(function(e){var t=r[e];return"string"==typeof t?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+e+'"'}function str(r,i){var u,o,c,a,s,p=e,l=i[r];switch(l&&"object"==typeof l&&"function"==typeof l.toJSON&&(l=l.toJSON(r)),"function"==typeof n&&(l=n.call(i,r,l)),typeof l){case"string":return quote(l);case"number":return isFinite(l)?String(l):"null";case"boolean":return String(l);case"object":if(!l)return"null";if(e+=t,s=[],"[object Array]"===Object.prototype.toString.apply(l)){for(a=l.length,u=0;u<a;u+=1)s[u]=str(String(u),l)||"null";return c=0===s.length?"[]":e?"[\n"+e+s.join(",\n"+e)+"\n"+p+"]":"["+s.join(",")+"]",e=p,c}if(n&&"object"==typeof n)for(a=n.length,u=0;u<a;u+=1)"string"==typeof n[u]&&(c=str(o=String(n[u]),l))&&s.push(quote(o)+(e?": ":":")+c);else for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(c=str(o,l))&&s.push(quote(o)+(e?": ":":")+c);return c=0===s.length?"{}":e?"{\n"+e+s.join(",\n"+e)+"\n"+p+"}":"{"+s.join(",")+"}",e=p,c}return"null"}}(),PPx.Extract('%sgu"ppmcache"');var m={extractGitDir:function(){var e="C:/Program Files/git";if(n.FolderExists(e))return e;var t="C:/Program Files (x86)/git";if(n.FolderExists(t))return t;var r=PPx.Extract("%'git_install_root'");if(""!==r)return r;var i=PPx.Extract("%'path'");return/[\/\\]git[\/\\]cmd[\/\\]?[;$]/.test(i)?(i=(i=i.replace(/(.+[\/\\]git)[\/\\]cmd[\/\\]?[;$]/,"$1")).replace(/^(.+;)?/,"")).replace(/\//g,"\\"):""},globalPath:{keys:{ppm:"",ppmhome:"",ppmarch:"%%su'ppmhome'\\arch",ppmrepo:"%%su'ppmhome'\\repo",ppmcache:"%%su'ppmhome'\\"+t.cacheDir(),ppmlib:"%%su'ppm'\\dist\\lib"},set:function(e,t){this.keys.ppmhome=e,this.keys.ppm=t;for(var r=0,n=Object.keys(this.keys);r<n.length;r++){var i=n[r];PPx.Execute("*string u,"+i+"="+this.keys[i])}},unset:function(){for(var e=0,t=Object.keys(this.keys);e<t.length;e++){var r=t[e];PPx.Execute("*deletecust _User:"+r)}}},homeSpec:function(t){var r=t;return isEmptyStr(r)&&(r=PPx.Extract("%'home'"),r=isEmptyStr(r)?pathJoin(PPx.Extract("%'appdata'"),e.ppmName):pathJoin(r,".ppm")),r}},d=o.global("version"),h=pathSelf().scriptName,v=P[useLanguage()],b="B"+e.ppmID;if(!(0!==PPx.Arguments.length&&"restart"===PPx.Argument(0)))if(isEmptyStr(d)&&(o.echo(h,v.notRegistered),PPx.Quit(1)),o.question(h,v.start)||PPx.Quit(1),PPx.Extract("%n")!==b){var y=e.ppmName+" ver"+d;runPPb({bootid:e.ppmID,desc:y,fg:"cyan",x:0,y:0,width:700,height:500})}else o.execute("C","*script "+h+",restart"),PPx.Quit(1);PPx.Execute('*script %sgu"ppm"\\dist\\pluginRegister.js,all,unset'),o.execute(b,'*script %sgu"ppm"\\dist\\ppmRestoreRegister.js,unset'),PPx.Execute("*wait 1000"),o.setcust('@%sgu"ppmcache"\\ppm\\unset\\'+e.ppmName+".cfg"),o.deletecust("S_ppm#global"),o.deletecust("S_ppm#user"),o.deletecust("S_ppm#sources"),o.deletecust("S_ppm#plugins"),PPx.Execute('*delete %sgu"ppmarch"'),PPx.Execute('*delete %sgu"ppmrepo"'),m.globalPath.unset(),o.execute(b,"%%OWq echo "+v.finish+" %%:*closeppx C*%%:*wait 100,2%%:*ppc%%:*wait 500,2%%:*closeppx %%n");
