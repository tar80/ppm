﻿var t={ppmName:"ppx-plugin-manager",ppmVersion:.95,language:"ja",encode:"utf16le",nlcode:"\r\n",nltype:"crlf",ppmID:"P",ppmSubID:"Q"},useLanguage=function(){var e=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===e||"ja"===e?e:t.language},e={initialCfg:"_initial.cfg",globalCfg:"_global.cfg",nopluginCfg:"_noplugin.cfg",pluginList:"_pluginlist",manageFiles:"_managefiles",updateLog:"_updateLog",repoDir:"repo",archDir:"arch",cacheDir:function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")}},r={tempKey:"K_ppmTemp",tempMenu:"M_ppmTemp",lfDset:"ppm_lfdset",virtualEntry:"ppm_ve"},isEmptyStr=function(t){return""===t},isEmptyObj=function(t){if(t===undefined)return!1;if(null===t)return!0;for(var e in t)return!1;return!0},isInteger=function(t){return"number"==typeof t&&Number.isFinite(t)&&Math.floor(t)===t},pathSelf=function(){var t,e,r=PPx.ScriptName;return~r.indexOf("\\")?(t=extractFileName(r),e=PPx.Extract("%*name(DKN,"+r+")")):(t=r,e=PPx.Extract("%FDN")),{scriptName:t,parentDir:e.replace(/\\$/,"")}},pathJoin=function(){for(var t=[],e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];for(var i=0;i<r.length;i++){var u=r[i];isEmptyStr(u)||t.push(u)}return t.join("\\")||""},extractFileName=function(t,e){return void 0===e&&(e="\\"),"\\"!==e&&"/"!==e&&(e="\\"),t.slice(t.lastIndexOf(e)+1)},n=PPx.CreateObject("Scripting.FileSystemObject"),expandNlCode=function(t){var e="\n",r=t.indexOf("\r");return~r&&(e="\r\n"===t.substring(r,r+2)?"\r\n":"\r"),e},_exec=function(t,e){try{var r;return[!1,null!=(r=e())?r:""]}catch(n){return[!0,""]}finally{t.Close()}},read=function(t){var e=t.path,r=t.enc,i=void 0===r?"utf8":r;if(!n.FileExists(e))return[!0,e+" not found"];var u=n.GetFile(e);if(0===u.Size)return[!0,e+" has no data"];var o=!1,a="";if("utf8"===i){var c=PPx.CreateObject("ADODB.Stream"),s=_exec(c,(function(){return c.Open(),c.Charset="UTF-8",c.LoadFromFile(e),c.ReadText(-1)}));o=s[0],a=s[1]}else{var p="utf16le"===i?-1:0,l=u.OpenAsTextStream(1,p),x=_exec(l,(function(){return l.ReadAll()}));o=x[0],a=x[1]}return o?[!0,"Unable to read "+e]:[!1,a]},readLines=function(t){var e,r=t.path,n=t.enc,i=void 0===n?"utf8":n,u=t.linefeed,o=read({path:r,enc:i}),a=o[0],c=o[1];if(a)return[!0,c];u=null!=(e=u)?e:expandNlCode(c.slice(0,1e3));var s=c.split(u);return isEmptyStr(s[s.length-1])&&s.pop(),[!1,{lines:s,nl:u}]},i=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,rejectInvalidString=function(t,e){if(0===e.indexOf("@")){if(e=PPx.Extract(e).substring(1),!n.FileExists(e))return 2}else if(!t.test(e))return 13;return 0},dialog=function(t,e,r){return void 0===e&&(e=""),e=isEmptyStr(e)?"":"/"+e,0===PPx.Execute('%"ppm'+e+'" %OC %'+t+'"'+r+'"')},runPPmTest=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},hasTargetId=function(t){return"."!==t},u={lang:t.language},createCache=function(t){var e=PPx.Extract("%*getcust(S_ppm#global:"+t+")");return u[t]=e,e},autoselectEnter=function(t){return PPx.Execute("%OC *setcust "+r.tempKey+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+r.tempKey+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),"*mapkey use,"+r.tempKey+"%%:"+t},o={echo:function(t,e,r){var n=r?"("+String(r)+")":"";return dialog("I",""+t,""+e+n)},question:function(t,e){return dialog("Q",""+t,e)},choice:function(t,e,r,n,i,u,a){void 0===n&&(n="ynC");var c="Mes0411",s={yes:c+":IMYE",no:c+":IMNO",cancel:c+":IMTC"},p="."===t,l=p?'%K"@LOADCUST"':'%%K"@LOADCUST"',x=[],g=x[0],P=x[1],m=x[2],d="",h="",v="",b=!1;i&&(g=PPx.Extract("%*getcust("+s.yes+")"),d="*setcust "+s.yes+"="+i+"%:",b=!0),u&&(P=PPx.Extract("%*getcust("+s.no+")"),h="*setcust "+s.no+"="+u+"%:",b=!0),a&&(m=PPx.Extract("%*getcust("+s.cancel+")"),v="*setcust "+s.cancel+"="+a+"%:",b=!0),b&&(PPx.Execute(""+d+h+v),o.execute(t,l));var y={0:"cancel",1:"yes",2:"no"},E=p?"":t,O=PPx.Extract("%OCP %*extract("+E+'"%%*choice(-text""'+r+'"" -title:""'+e+'"" -type:'+n+')")');return b&&(g&&PPx.Execute("*setcust "+s.yes+"="+g),P&&PPx.Execute("*setcust "+s.no+"="+P),m&&PPx.Execute("*setcust "+s.cancel+"= "+m),o.execute(t,l)),y[O]},execute:function(t,e,r){if(void 0===r&&(r=!1),isEmptyStr(e))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+t+",%("+e+"%)");if("tray"===t)return PPx.Execute("*pptray -c "+e);if(hasTargetId(t)){if(r){var n=PPx.Extract("%*extract("+t+',"'+e+'%%&0")');return isEmptyStr(n)?1:Number(n)}return PPx.Execute("*execute "+t+","+e)}if(r){var i=PPx.Extract(e+"%&0");return isEmptyStr(i)?1:Number(i)}return PPx.Execute(e)},execSync:function(t,e){if(isEmptyStr(e))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+t+",%("+e+"%)");if(1===t.length)t="b"+t;else if(0!==t.toUpperCase().indexOf("B"))return 6;return isEmptyStr(PPx.Extract("%N"+t))?6:Number(PPx.Extract("%*extract("+t.toUpperCase()+',"'+e+'%%:%%*exitcode")'))},extract:function(t,e){if(isEmptyStr(e))return[13,""];var r=hasTargetId(t)?PPx.Extract("%*extract("+t+',"'+e+'")'):PPx.Extract(e);return[Number(PPx.Extract()),r]},lang:function(){var e=u.lang;if(!isEmptyStr(e))return e;var r=PPx.Extract("%*getcust(S_ppm#global:lang)");return e="en"===r||"ja"===r?r:t.language,u.lang=e,e},global:function(t){var r,n,i=u[t];if(i)return i;if(/^ppm[ahrcl]?/.test(t)){if(i=PPx.Extract("%sgu'"+t+"'"),isEmptyStr(i)){var o=t.replace("ppm","");switch(o){case"":i=null!=(r=u.ppm)?r:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":i=null!=(n=u.home)?n:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var a;i=(null!=(a=u.ppm)?a:createCache("ppm"))+"\\dist\\lib";break;default:var c,s=null!=(c=u.home)?c:createCache("home");"cache"===o&&(i=s+"\\"+e.cacheDir())}}}else i=PPx.Extract("%*getcust(S_ppm#global:"+t+")");return u[t]=i,i},user:function(t){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+t+')")')},setuser:function(t,e){return isEmptyStr(e)?1:PPx.Execute("*setcust S_ppm#user:"+t+"="+e)},getpath:function(t,e,r){void 0===r&&(r="");var n=rejectInvalidString(/^[CXTDHLKBNPRVSU]+$/,t);if(0!==n)return[n,""];if(isEmptyStr(e))return[1,""];var i=isEmptyStr(r)?"":',"'+r+'"',u=PPx.Extract("%*name("+t+',"'+e+'"'+i+")");return[n=Number(PPx.Extract()),u]},getcust:function(t){if(isEmptyStr(t))return[1,""];var e=rejectInvalidString(i,t);return 0!==e?[e,""]:[e,PPx.Extract("%*getcust("+t+")")]},setcust:function(t,e){if(void 0===e&&(e=!1),isEmptyStr(t))return 1;var r=rejectInvalidString(i,t);if(0!==r)return r;var n=e?"%OC ":"";return PPx.Execute(n+"*setcust "+t)},deletecust:function(t,e,r){var n="boolean"==typeof e,u=/^\s*"?([^"\s]+)"?\s*?$/,o=t.replace(u,"$1"),a=String(e),c=rejectInvalidString(i,o);if(0!==c)return c;var s=null==e||n||isEmptyStr(a)?'"'+o+'"':o+","+("string"==typeof e?'"'+e.replace(u,"$1")+'"':""+e);return PPx.Execute("*deletecust "+s),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(t,e,n,i){if(void 0===n&&(n=!1),void 0===i&&(i=""),isEmptyStr(t))throw new Error("SubId not specified");isEmptyStr(i)||(i="*skip "+i+"%bn%bt",n=!0);var u=n?"%OC ":"";return PPx.Execute(u+"*setcust "+r.tempKey+":"+t+","+i+e),r.tempKey},deletemenu:function(){PPx.Execute('*deletecust "'+r.tempMenu+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+r.tempKey+'"')},linecust:function(t){var e=t.label,r=t.id,n=t.sep,i=void 0===n?"=":n,u=t.value,o=void 0===u?"":u,a=t.esc,c=void 0!==a&&a,s=t.once,p=void 0!==s&&s?"*linecust "+e+","+r+",%%:":"";!isEmptyStr(o)&&c&&(o="%("+o+"%)"),PPx.Execute("*linecust "+e+","+r+i+p+o)},getvalue:function(t,e,r){if(isEmptyStr(r))return[1,""];var n=hasTargetId(t)?PPx.Extract("%*extract("+t+',"%%s'+e+"'"+r+"'\")"):PPx.Extract("%s"+e+"'"+r+"'");return[isEmptyStr(n)?13:0,n]},setvalue:function(t,e,r,n){return isEmptyStr(r)?1:hasTargetId(t)?PPx.Execute("*execute "+t+",*string "+e+","+r+"="+n):PPx.Execute("*string "+e+","+r+"="+n)},getinput:function(t){var e=t.message,r=void 0===e?"":e,n=t.title,i=void 0===n?"":n,u=t.mode,o=void 0===u?"g":u,a=t.select,c=void 0===a?"a":a,s=t.multi,p=void 0!==s&&s,l=t.leavecancel,x=void 0!==l&&l,g=t.forpath,P=void 0!==g&&g,m=t.fordijit,d=void 0!==m&&m,h=t.autoselect,v=void 0!==h&&h,b=t.k,y=void 0===b?"":b,E=/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,O=p?" -multi":"",S=x?" -leavecancel":"",w=P?" -forpath":"",j=d?" -fordijit":"";v&&(y=autoselectEnter(y));var N=""!==y?" -k %%OP- "+y:"",_=rejectInvalidString(E,o);if(0!==_)return[_,""];var C=PPx.Extract('%OCP %*input("'+r+'" -title:"'+i+'" -mode:'+o+" -select:"+c+O+S+w+j+N+")");return _=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[_,C]},linemessage:function(t,e,r,n){var i,u="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof e){var o=n?"%%bn":" ";i=e.join(o)}else i=e;t="."===t?"":t,i=r&&!u?'!"'+i:i,PPx.Execute("%OC *execute "+t+",*linemessage "+i)},report:function(e){var r="string"==typeof e?e:e.join(t.nlcode);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(r):PPx.report(r)},close:function(t){PPx.Execute("*closeppx "+t)},jobstart:function(t){return o.execute(t,"*job start"),function(){return o.execute(t,"*job end")}},getVersion:function(t){var e=readLines({path:t+="\\package.json"}),r=e[0],n=e[1];if(!r)for(var i=/^\s*"version":\s*"([0-9\.]+)"\s*,/,u=2,o=n.lines.length;u<o;u++)if(~n.lines[u].indexOf('"version":'))return n.lines[u].replace(i,"$1")}};String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/,"")}),Array.prototype.removeEmpty||(Array.prototype.removeEmpty=function(){for(var t=[],e=0,r=this.length;e<r;e++){var n=this[e];null==n||""===n||n instanceof Array&&0===n.length||n instanceof Object&&isEmptyObj(n)||t.push(n)}return t}),Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){var r;if(null==this)throw new Error('Array.indexOf: "this" is null or not defined');var n=Object(this),i=n.length>>>0;if(0===i)return-1;var u=null!=e?e:0;if(Math.abs(u)===Infinity&&(u=0),u>=i)return-1;for(r=Math.max(u>=0?u:i-Math.abs(u),0);r<i;){if(r in n&&n[r]===t)return r;r++}return-1});var a,c,s,p,l,x={fg:{black:"30",red:"31",green:"32",yellow:"33",blue:"34",magenta:"35",cyan:"36",white:"37",def:"39"},bg:{black:"40",red:"41",green:"42",yellow:"43",blue:"44",magenta:"45",cyan:"46",white:"47",def:"49"}},getEscSeq=function(t){return t?"\\x1b[":"["},colorlize=function(t){var e=t.message,r=t.esc,n=void 0!==r&&r,i=t.fg,u=t.bg;if(isEmptyStr(e))return"";var o=getEscSeq(n);return!i||isEmptyStr(i)?""+e:""+(""+o+(u?x.bg[u]+";":"")+x.fg[i]+"m")+e+o+"49;39m"},g=(a=PPx.Extract("%*getcust(S_ppm#global:git)"),isEmptyStr(a)?"echo":'"'+a+'\\usr\\bin\\echo.exe"'),winpos=function(t,e,r){return isInteger(e)&&isInteger(r)?"*windowposition "+t+","+(e<0?0:e)+","+(r<0?0:r):""},winsize=function(t,e,r){return isInteger(e)&&isInteger(r)?"*windowsize "+t+","+(e<200?200:e)+","+(r<200?200:r):""},_runCmdline=function(t){var e=t.startwith,r=void 0===e?"":e,n=t.wait,i=void 0===n?"":n,u=t.startmsg,o=void 0===u||u,a=t.priority,c=t.breakjob,s=t.newgroup,p=t.log,l=t.wd,x=t.x,g=t.y,P=t.width,m=t.height,d={"":"",min:"-min",max:"-max",noactive:"-noactive",bottom:"-noactive"}[r],h={"":"",wait:"-wait",idle:"-wait:idle",later:"-wait:later",no:"-wait:no"}[i],v="";if(l){if(!PPx.CreateObject("Scripting.FileSystemObject").FolderExists(l))return[!1,["[WARN] Specified working directory is not exist"]];v="-d:"+l}var b=o?"":"-nostartmsg",y=a?"-"+a:"",E=c?"-breakjob":"",O=s?"-newgroup":"",S=p?"-log":"",w=PPx.Extract("%*getcust(S_ppm#global:disp_width)"),j=PPx.Extract("%*getcust(S_ppm#global:disp_height)");return x&&x>Number(w)&&(x=0),g&&g>Number(j)&&(g=0),[!0,["*run","-noppb",d,h,b,y,E,O,S,v,x&&g?"-pos:"+x+","+g:"",P&&m?"-size:"+P+","+m:""]]},_ppbCmdline=function(t){var e=t.bootid,r=t.bootmax,n=t.q,i=t.c,u=t.k;return{id:e?"-bootid:"+e:"",max:r?"-bootmax:"+r:"",quiet:n?"-q":"",postcmd:i||(u||"")}},runPPb=function(t){var e=t.bootid,r=t.bootmax,n=t.q,i=t.c,u=t.k,o=t.startwith,a=void 0===o?"":o,c=t.wait,s=void 0===c?"":c,p=t.priority,l=t.breakjob,x=t.newgroup,P=t.log,m=t.wd,d=t.x,h=t.y,v=t.width,b=t.height,y=t.desc,E=t.fg,O=t.bg;if(-1!==PPx.Extract("%*ppxlist(-B)").indexOf("B_"+e))return PPx.Execute("*focus B"+e),!0;var S=_runCmdline({startwith:a,wait:s,priority:p,breakjob:l,newgroup:x,log:P,wd:m}),w=S[0],j=S[1];if(!w)return!1;var N=_ppbCmdline({bootid:e,bootmax:r,q:n,c:i,k:u}),_=[];"min"===a||"max"===a||i||(_.push(winpos("%%n",d,h)),_.push(winsize("%%n",v,b)),"bottom"!==a||i||_.push("*selectppx %n")),y&&!isEmptyStr(y)&&_.push(g+' -e "'+colorlize({esc:!0,message:y,fg:E,bg:O})+' \\n"'),_.push(N.postcmd);var C="";_.length>0&&(C=(i?"-c ":"-k ")+_.removeEmpty().join("%%:"));var k=[].concat(j,["%0ppbw.exe",N.id,N.max,N.quiet]).removeEmpty().join(" "),F=!0;try{/^-k $/.test(C)&&(C=""),PPx.Execute(k+" "+C+"%:*wait 500,2")}catch(D){F=!1}return F},P={en:{notRegistered:"Not installed",start:"Start uninstalling ppm",finish:"Uninstallation completed. Restart PPc"},ja:{notRegistered:"インストールされていません",start:"ppmのアンインストールを開始します",finish:"アンインストールが完了しました。PPcを再起動します"}};Object.keys||(Object.keys=(c=Object.prototype.hasOwnProperty,s=!{toString:null}.propertyIsEnumerable("toString"),l=(p=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(t){if("function"!=typeof t&&("object"!=typeof t||null==t))throw new Error("Object.keys: called on non-object");var e,r,n=[];for(e in t)c.call(t,e)&&n.push(e);if(s)for(r=0;r<l;r++)c.call(t,p[r])&&n.push(p[r]);return n})),function(){if("object"!=typeof JSON){JSON={};var t,e,r,n,i=/^[\],:{}\s]*$/,u=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,o=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,a=/(?:^|:|,)(?:\s*\[)+/g,c=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,i,u){var o;if(t="",e="","number"==typeof u)for(o=0;o<u;o+=1)e+=" ";else"string"==typeof u&&(e=u);if(n=i,i&&"function"!=typeof i&&("object"!=typeof i||"number"!=typeof i.length))throw new Error("JSON.stringify");return str("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(t,e){var r;function walk(t,r){var n,i,u=t[r];if(u&&"object"==typeof u)for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&((i=walk(u,n))!==undefined?u[n]=i:delete u[n]);return e.call(t,r,u)}if(t=String(t),s.lastIndex=0,s.test(t)&&(t=t.replace(s,(function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))),i.test(t.replace(u,"@").replace(o,"]").replace(a,"")))return r=Function("return ("+t+")")(),"function"==typeof e?walk({"":r},""):r;throw new Error("JSON.parse")})}function f(t){return t<10?"0"+t:t}function quote(t){return c.lastIndex=0,c.test(t)?'"'+t.replace(c,(function(t){var e=r[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+t+'"'}function str(r,i){var u,o,a,c,s,p=t,l=i[r];switch(l&&"object"==typeof l&&"function"==typeof l.toJSON&&(l=l.toJSON(r)),"function"==typeof n&&(l=n.call(i,r,l)),typeof l){case"string":return quote(l);case"number":return isFinite(l)?String(l):"null";case"boolean":return String(l);case"object":if(!l)return"null";if(t+=e,s=[],"[object Array]"===Object.prototype.toString.apply(l)){for(c=l.length,u=0;u<c;u+=1)s[u]=str(String(u),l)||"null";return a=0===s.length?"[]":t?"[\n"+t+s.join(",\n"+t)+"\n"+p+"]":"["+s.join(",")+"]",t=p,a}if(n&&"object"==typeof n)for(c=n.length,u=0;u<c;u+=1)"string"==typeof n[u]&&(a=str(o=String(n[u]),l))&&s.push(quote(o)+(t?": ":":")+a);else for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(a=str(o,l))&&s.push(quote(o)+(t?": ":":")+a);return a=0===s.length?"{}":t?"{\n"+t+s.join(",\n"+t)+"\n"+p+"}":"{"+s.join(",")+"}",t=p,a}return"null"}}(),PPx.Extract('%sgu"ppmcache"');var m={extractGitDir:function(){var t="C:/Program Files/git";if(n.FolderExists(t))return t;var e="C:/Program Files (x86)/git";if(n.FolderExists(e))return e;var r=PPx.Extract("%'git_install_root'");if(""!==r)return r;var i=PPx.Extract("%'path'");return/[\/\\]git[\/\\]cmd[\/\\]?[;$]/.test(i)?(i=(i=i.replace(/(.+[\/\\]git)[\/\\]cmd[\/\\]?[;$]/,"$1")).replace(/^(.+;)?/,"")).replace(/\//g,"\\"):""},globalPath:{keys:{ppm:"",ppmhome:"",ppmarch:"%%su'ppmhome'\\arch",ppmrepo:"%%su'ppmhome'\\repo",ppmcache:"%%su'ppmhome'\\"+e.cacheDir(),ppmlib:"%%su'ppm'\\dist\\lib"},set:function(t,e){this.keys.ppmhome=t,this.keys.ppm=e;for(var r=0,n=Object.keys(this.keys);r<n.length;r++){var i=n[r];PPx.Execute("*string u,"+i+"="+this.keys[i])}},unset:function(){for(var t=0,e=Object.keys(this.keys);t<e.length;t++){var r=e[t];PPx.Execute("*deletecust _User:"+r)}}},homeSpec:function(e){var r=e;return isEmptyStr(r)&&(r=PPx.Extract("%'home'"),r=isEmptyStr(r)?pathJoin(PPx.Extract("%'appdata'"),t.ppmName):pathJoin(r,".ppm")),r}},d=o.global("version"),h=pathSelf().scriptName,v=P[useLanguage()],b="B"+t.ppmID;if(!(0!==PPx.Arguments.length&&"restart"===PPx.Argument(0)))if(isEmptyStr(d)&&(o.echo(h,v.notRegistered),PPx.Quit(1)),o.question(h,v.start)||PPx.Quit(1),PPx.Extract("%n")!==b){var y=t.ppmName+" ver"+d;runPPb({bootid:t.ppmID,desc:y,fg:"cyan",x:0,y:0,width:700,height:500})}else o.execute("C","*script "+h+",restart"),PPx.Quit(1);PPx.Execute('*script %sgu"ppm"\\dist\\pluginRegister.js,all,unset'),o.execute(b,'*script %sgu"ppm"\\dist\\ppmRestoreRegister.js,unset'),PPx.Execute("*wait 1000"),o.setcust('@%sgu"ppmcache"\\ppm\\unset\\'+t.ppmName+".cfg"),o.deletecust("S_ppm#global"),o.deletecust("S_ppm#user"),o.deletecust("S_ppm#sources"),o.deletecust("S_ppm#plugins"),PPx.Execute('*delete %sgu"ppmarch"'),PPx.Execute('*delete %sgu"ppmrepo"'),m.globalPath.unset(),o.execute(b,"%%OWq echo "+v.finish+" %%:*closeppx C*%%:*wait 100,2%%:*ppc%%:*wait 500,2%%:*closeppx %%n");
