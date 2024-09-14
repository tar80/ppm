﻿function _extends(){return _extends=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)({}).hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},_extends.apply(null,arguments)}Array.isArray||(Array.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var r;if(null==this)throw new Error('Array.indexOf: "this" is null or not defined');var n=Object(this),i=n.length>>>0;if(0===i)return-1;var a=null!=t?t:0;if(Math.abs(a)===Infinity&&(a=0),a>=i)return-1;for(r=Math.max(a>=0?a:i-Math.abs(a),0);r<i;){if(r in n&&n[r]===e)return r;r++}return-1});var e,isEmptyStr=function(e){return""===e},isEmptyObj=function(e){if(e===undefined)return!1;if(null===e)return!0;for(var t in e)return!1;return!0},isError=function(e,t){return e&&"string"==typeof t},isInteger=function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e},isBottom=function(e){return null==e},t={fg:{black:"30",red:"31",green:"32",yellow:"33",blue:"34",magenta:"35",cyan:"36",white:"37",def:"39"},bg:{black:"40",red:"41",green:"42",yellow:"43",blue:"44",magenta:"45",cyan:"46",white:"47",def:"49"}},getEscSeq=function(e){return e?"\\x1b[":"["},colorlize=function(e){var r=e.message,n=e.esc,i=void 0!==n&&n,a=e.fg,u=e.bg;if(isEmptyStr(r))return"";var o=getEscSeq(i);return!a||isEmptyStr(a)?""+r:""+(""+o+(u?t.bg[u]+";":"")+t.fg[a]+"m")+r+o+"49;39m"},validArgs=function(){for(var e=[],t=PPx.Arguments;!t.atEnd();t.moveNext())e.push(t.value);return e},safeArgs=function(){for(var e=[],t=validArgs(),r=0,n=arguments.length;r<n;r++)e.push(_valueConverter(r<0||arguments.length<=r?undefined:arguments[r],t[r]));return e},_valueConverter=function(e,t){if(null==t||""===t)return null!=e?e:undefined;switch(typeof e){case"number":var r=Number(t);return Number.isNaN(r)?e:r;case"boolean":return null!=t&&"false"!==t&&"0"!==t;default:return t}},r={ppmName:"ppx-plugin-manager",ppmVersion:.95,language:"ja",encode:"utf16le",nlcode:"\r\n",nltype:"crlf",ppmID:"P",ppmSubID:"Q"},useLanguage=function(){var e=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===e||"ja"===e?e:r.language},n={initialCfg:"_initial.cfg",globalCfg:"_global.cfg",nopluginCfg:"_noplugin.cfg",pluginList:"_pluginlist",manageFiles:"_managefiles",updateLog:"_updateLog",repoDir:"repo",archDir:"arch",cacheDir:function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")}},i={tempKey:"K_ppmTemp",tempMenu:"M_ppmTemp",lfDset:"ppm_lfdset",virtualEntry:"ppm_ve"},tmp=function(){var e=PPx.Extract('%*extract(C,"%%*temp()")');return{dir:e,file:e+"_ppmtemp",lf:e+"_temp.xlf",stdout:e+"_stdout",stderr:e+"_stderr",ppmDir:function(){var e=PPx.Extract("%'temp'%\\ppm");return PPx.Execute("*makedir "+e),e}}},a=(e=PPx.Extract("%*getcust(S_ppm#global:git)"),isEmptyStr(e)?"echo":'"'+e+'\\usr\\bin\\echo.exe"'),coloredEcho=function(e,t,r){void 0===r&&(r=!1),t=t.replace(/\\/g,"\\\\");var n=r?"W":"",i="."===e?"%OP"+n+" "+a+" -ne '%("+t+"%)'":"*execute "+e+",%%OP"+n+" "+a+" -ne '%%("+t+"%%)'";return PPx.Execute(i)},u=PPx.CreateObject("Scripting.FileSystemObject"),_create=function(e,t,r,n,i,a){void 0===a&&(a=!1);try{u[e](t,r,a)}catch(o){return n&&u.DeleteFolder(i),[!0,"Could not create "+r]}return[!1,""]},copyFile=function(e,t,r){var n=!1;if(!u.FileExists(e))return[!0,e+" is not exist"];var i=u.GetParentFolderName(t);return u.FolderExists(i)||(u.CreateFolder(i),n=!0),_create("CopyFile",e,t,n,i,r)},o={TypeToCode:{crlf:"\r\n",cr:"\r",lf:"\n"},CodeToType:{"\r\n":"crlf","\r":"cr","\n":"lf"},Ppx:{lf:"%%bl",cr:"%%br",crlf:"%%bn",unix:"%%bl",mac:"%%br",dos:"%%bn","\n":"%%bl","\r":"%%br","\r\n":"%%bn"},Ascii:{lf:"10",cr:"13",crlf:"-1",unix:"10",mac:"13",dos:"-1","\n":"10","\r":"13","\r\n":"-1"}},expandNlCode=function(e){var t="\n",r=e.indexOf("\r");return~r&&(t="\r\n"===e.substring(r,r+2)?"\r\n":"\r"),t},isCV8=function(){return"ClearScriptV8"===PPx.ScriptEngineName},_exec=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},read=function(e){var t=e.path,r=e.enc,n=void 0===r?"utf8":r;if(!u.FileExists(t))return[!0,t+" not found"];var i=u.GetFile(t);if(0===i.Size)return[!0,t+" has no data"];var a=!1,o="";if("utf8"===n){var s=PPx.CreateObject("ADODB.Stream"),c=_exec(s,(function(){return s.Open(),s.Charset="UTF-8",s.LoadFromFile(t),s.ReadText(-1)}));a=c[0],o=c[1]}else{var l="utf16le"===n?-1:0,p=i.OpenAsTextStream(1,l),g=_exec(p,(function(){return p.ReadAll()}));a=g[0],o=g[1]}return a?[!0,"Unable to read "+t]:[!1,o]},readLines=function(e){var t,r=e.path,n=e.enc,i=void 0===n?"utf8":n,a=e.linefeed,u=read({path:r,enc:i}),o=u[0],s=u[1];if(o)return[!0,s];a=null!=(t=a)?t:expandNlCode(s.slice(0,1e3));var c=s.split(a);return isEmptyStr(c[c.length-1])&&c.pop(),[!1,{lines:c,nl:a}]},writeLines=function(e){var t=e.path,n=e.data,i=e.enc,a=void 0===i?"utf8":i,s=e.append,c=void 0!==s&&s,l=e.overwrite,p=void 0!==l&&l,g=e.linefeed,x=void 0===g?r.nlcode:g;if(!p&&!c&&u.FileExists(t))return[!0,t+" already exists"];var d,m=u.GetParentFolderName(t);if(u.FolderExists(m)||PPx.Execute("*makedir "+m),"utf8"===a){if(isCV8()){var v=n.join(x),h=c?"AppendAllText":"WriteAllText";return[!1,NETAPI.System.IO.File[h](t,v)]}var P=p||c?2:1,b=PPx.CreateObject("ADODB.Stream");d=_exec(b,(function(){b.Open(),b.Charset="UTF-8",b.LineSeparator=Number(o.Ascii[x]),c?(b.LoadFromFile(t),b.Position=b.Size,b.SetEOS):b.Position=0,b.WriteText(n.join(x),1),b.SaveToFile(t,P)}))[0]}else{var E=c?8:p?2:1;u.FileExists(t)||PPx.Execute("%Osq *makefile "+t);var y="utf16le"===a?-1:0,O=u.GetFile(t).OpenAsTextStream(E,y);d=_exec(O,(function(){O.Write(n.join(x)+x)}))[0]}return d?[!0,"Could not write to "+t]:[!1,""]},pathSelf=function(){var e,t,r=PPx.ScriptName;return~r.indexOf("\\")?(e=extractFileName(r),t=PPx.Extract("%*name(DKN,"+r+")")):(e=r,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}},pathJoin=function(){for(var e=[],t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];for(var i=0;i<r.length;i++){var a=r[i];isEmptyStr(a)||e.push(a)}return e.join("\\")||""},extractFileName=function(e,t){return void 0===t&&(t="\\"),"\\"!==t&&"/"!==t&&(t="\\"),e.slice(e.lastIndexOf(t)+1)},createBackup=function(e){var t=e.path,r=e.comment,n=void 0!==r&&r,i=e.sort,a=void 0===i||i,u=e.discover,o=void 0!==u&&u,s=e.mask,c=~t.indexOf("\\")?t:PPx.Extract('%sgu"ppmcache"\\backup\\'+t),l=n?"":" -nocomment",p=a?"":" -nosort",g=o?" -discover":"",x=s?'-mask:"'+s.join(",")+'"':"";return PPx.Execute("*cd %0%:%Osbd *ppcust CD "+c+l+p+g+x+"%&")},s=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,rejectInvalidString=function(e,t){if(0===t.indexOf("@")){if(t=PPx.Extract(t).substring(1),!u.FileExists(t))return 2}else if(!e.test(t))return 13;return 0},dialog=function(e,t,r){return void 0===t&&(t=""),t=isEmptyStr(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+r+'"')},runPPmTest=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},hasTargetId=function(e){return"."!==e},c={lang:r.language},createCache=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return c[e]=t,t},autoselectEnter=function(e){return PPx.Execute("%OC *setcust "+i.tempKey+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+i.tempKey+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),"*mapkey use,"+i.tempKey+"%%:"+e},l={echo:function(e,t,r){var n=r?"("+String(r)+")":"";return dialog("I",""+e,""+t+n)},question:function(e,t){return dialog("Q",""+e,t)},choice:function(e,t,r,n,i,a,u){void 0===n&&(n="ynC");var o="Mes0411",s={yes:o+":IMYE",no:o+":IMNO",cancel:o+":IMTC"},c="."===e,p=c?'%K"@LOADCUST"':'%%K"@LOADCUST"',g=[],x=g[0],d=g[1],m=g[2],v="",h="",P="",b=!1;i&&(x=PPx.Extract("%*getcust("+s.yes+")"),v="*setcust "+s.yes+"="+i+"%:",b=!0),a&&(d=PPx.Extract("%*getcust("+s.no+")"),h="*setcust "+s.no+"="+a+"%:",b=!0),u&&(m=PPx.Extract("%*getcust("+s.cancel+")"),P="*setcust "+s.cancel+"="+u+"%:",b=!0),b&&(PPx.Execute(""+v+h+P),l.execute(e,p));var E={0:"cancel",1:"yes",2:"no"},y=c?"":e,O=PPx.Extract("%OCP %*extract("+y+'"%%*choice(-text""'+r+'"" -title:""'+t+'"" -type:'+n+')")');return b&&(x&&PPx.Execute("*setcust "+s.yes+"="+x),d&&PPx.Execute("*setcust "+s.no+"="+d),m&&PPx.Execute("*setcust "+s.cancel+"= "+m),l.execute(e,p)),E[O]},execute:function(e,t,r){if(void 0===r&&(r=!1),isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if("tray"===e)return PPx.Execute("*pptray -c "+t);if(hasTargetId(e)){if(r){var n=PPx.Extract("%*extract("+e+',"'+t+'%%&0")');return isEmptyStr(n)?1:Number(n)}return PPx.Execute("*execute "+e+","+t)}if(r){var i=PPx.Extract(t+"%&0");return isEmptyStr(i)?1:Number(i)}return PPx.Execute(t)},execSync:function(e,t){if(isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return isEmptyStr(PPx.Extract("%N"+e))?6:Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(isEmptyStr(t))return[13,""];var r=hasTargetId(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),r]},lang:function(){var e=c.lang;if(!isEmptyStr(e))return e;var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return e="en"===t||"ja"===t?t:r.language,c.lang=e,e},global:function(e){var t,r,i=c[e];if(i)return i;if(/^ppm[ahrcl]?/.test(e)){if(i=PPx.Extract("%sgu'"+e+"'"),isEmptyStr(i)){var a=e.replace("ppm","");switch(a){case"":i=null!=(t=c.ppm)?t:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":i=null!=(r=c.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var u;i=(null!=(u=c.ppm)?u:createCache("ppm"))+"\\dist\\lib";break;default:var o,s=null!=(o=c.home)?o:createCache("home");"cache"===a&&(i=s+"\\"+n.cacheDir())}}}else i=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return c[e]=i,i},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return isEmptyStr(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,r){void 0===r&&(r="");var n=rejectInvalidString(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==n)return[n,""];if(isEmptyStr(t))return[1,""];var i=isEmptyStr(r)?"":',"'+r+'"',a=PPx.Extract("%*name("+e+',"'+t+'"'+i+")");return[n=Number(PPx.Extract()),a]},getcust:function(e){if(isEmptyStr(e))return[1,""];var t=rejectInvalidString(s,e);return 0!==t?[t,""]:[t,PPx.Extract("%*getcust("+e+")")]},setcust:function(e,t){if(void 0===t&&(t=!1),isEmptyStr(e))return 1;var r=rejectInvalidString(s,e);if(0!==r)return r;var n=t?"%OC ":"";return PPx.Execute(n+"*setcust "+e)},deletecust:function(e,t,r){var n="boolean"==typeof t,i=/^\s*"?([^"\s]+)"?\s*?$/,a=e.replace(i,"$1"),u=String(t),o=rejectInvalidString(s,a);if(0!==o)return o;var c=null==t||n||isEmptyStr(u)?'"'+a+'"':a+","+("string"==typeof t?'"'+t.replace(i,"$1")+'"':""+t);return PPx.Execute("*deletecust "+c),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,r,n){if(void 0===r&&(r=!1),void 0===n&&(n=""),isEmptyStr(e))throw new Error("SubId not specified");isEmptyStr(n)||(n="*skip "+n+"%bn%bt",r=!0);var a=r?"%OC ":"";return PPx.Execute(a+"*setcust "+i.tempKey+":"+e+","+n+t),i.tempKey},deletemenu:function(){PPx.Execute('*deletecust "'+i.tempMenu+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+i.tempKey+'"')},linecust:function(e){var t=e.label,r=e.id,n=e.sep,i=void 0===n?"=":n,a=e.value,u=void 0===a?"":a,o=e.esc,s=void 0!==o&&o,c=e.once,l=void 0!==c&&c?"*linecust "+t+","+r+",%%:":"";!isEmptyStr(u)&&s&&(u="%("+u+"%)"),PPx.Execute("*linecust "+t+","+r+i+l+u)},getvalue:function(e,t,r){if(isEmptyStr(r))return[1,""];var n=hasTargetId(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+r+"'\")"):PPx.Extract("%s"+t+"'"+r+"'");return[isEmptyStr(n)?13:0,n]},setvalue:function(e,t,r,n){return isEmptyStr(r)?1:hasTargetId(e)?PPx.Execute("*execute "+e+",*string "+t+","+r+"="+n):PPx.Execute("*string "+t+","+r+"="+n)},getinput:function(e){var t=e.message,r=void 0===t?"":t,n=e.title,i=void 0===n?"":n,a=e.mode,u=void 0===a?"g":a,o=e.select,s=void 0===o?"a":o,c=e.multi,l=void 0!==c&&c,p=e.leavecancel,g=void 0!==p&&p,x=e.forpath,d=void 0!==x&&x,m=e.fordijit,v=void 0!==m&&m,h=e.autoselect,P=void 0!==h&&h,b=e.k,E=void 0===b?"":b,y=/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,O=l?" -multi":"",w=g?" -leavecancel":"",S=d?" -forpath":"",k=v?" -fordijit":"";P&&(E=autoselectEnter(E));var C=""!==E?" -k %%OP- "+E:"",_=rejectInvalidString(y,u);if(0!==_)return[_,""];var j=PPx.Extract('%OCP %*input("'+r+'" -title:"'+i+'" -mode:'+u+" -select:"+s+O+w+S+k+C+")");return _=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[_,j]},linemessage:function(e,t,r,n){var i,a="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var u=n?"%%bn":" ";i=t.join(u)}else i=t;e="."===e?"":e,i=r&&!a?'!"'+i:i,PPx.Execute("%OC *execute "+e+",*linemessage "+i)},report:function(e){var t="string"==typeof e?e:e.join(r.nlcode);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(t):PPx.report(t)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return l.execute(e,"*job start"),function(){return l.execute(e,"*job end")}},getVersion:function(e){var t=readLines({path:e+="\\package.json"}),r=t[0],n=t[1];if(!r)for(var i=/^\s*"version":\s*"([0-9\.]+)"\s*,/,a=2,u=n.lines.length;a<u;a++)if(~n.lines[a].indexOf('"version":'))return n.lines[a].replace(i,"$1")}};String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/,"")}),Array.prototype.removeEmpty||(Array.prototype.removeEmpty=function(){for(var e=[],t=0,r=this.length;t<r;t++){var n=this[t];null==n||""===n||n instanceof Array&&0===n.length||n instanceof Object&&isEmptyObj(n)||e.push(n)}return e});var p,g,x,d,winpos=function(e,t,r){return isInteger(t)&&isInteger(r)?"*windowposition "+e+","+(t<0?0:t)+","+(r<0?0:r):""},winsize=function(e,t,r){return isInteger(t)&&isInteger(r)?"*windowsize "+e+","+(t<200?200:t)+","+(r<200?200:r):""},_runCmdline=function(e){var t=e.startwith,r=void 0===t?"":t,n=e.wait,i=void 0===n?"":n,a=e.startmsg,u=void 0===a||a,o=e.priority,s=e.breakjob,c=e.newgroup,l=e.log,p=e.wd,g=e.x,x=e.y,d=e.width,m=e.height,v={"":"",min:"-min",max:"-max",noactive:"-noactive",bottom:"-noactive"}[r],h={"":"",wait:"-wait",idle:"-wait:idle",later:"-wait:later",no:"-wait:no"}[i],P="";if(p){if(!PPx.CreateObject("Scripting.FileSystemObject").FolderExists(p))return[!1,["[WARN] Specified working directory is not exist"]];P="-d:"+p}var b=u?"":"-nostartmsg",E=o?"-"+o:"",y=s?"-breakjob":"",O=c?"-newgroup":"",w=l?"-log":"",S=PPx.Extract("%*getcust(S_ppm#global:disp_width)"),k=PPx.Extract("%*getcust(S_ppm#global:disp_height)");return g&&g>Number(S)&&(g=0),x&&x>Number(k)&&(x=0),[!0,["*run","-noppb",v,h,b,E,y,O,w,P,g&&x?"-pos:"+g+","+x:"",d&&m?"-size:"+d+","+m:""]]},_ppbCmdline=function(e){var t=e.bootid,r=e.bootmax,n=e.q,i=e.c,a=e.k;return{id:t?"-bootid:"+t:"",max:r?"-bootmax:"+r:"",quiet:n?"-q":"",postcmd:i||(a||"")}},runPPb=function(e){var t=e.bootid,r=e.bootmax,n=e.q,i=e.c,u=e.k,o=e.startwith,s=void 0===o?"":o,c=e.wait,l=void 0===c?"":c,p=e.priority,g=e.breakjob,x=e.newgroup,d=e.log,m=e.wd,v=e.x,h=e.y,P=e.width,b=e.height,E=e.desc,y=e.fg,O=e.bg;if(-1!==PPx.Extract("%*ppxlist(-B)").indexOf("B_"+t))return PPx.Execute("*focus B"+t),!0;var w=_runCmdline({startwith:s,wait:l,priority:p,breakjob:g,newgroup:x,log:d,wd:m}),S=w[0],k=w[1];if(!S)return!1;var C=_ppbCmdline({bootid:t,bootmax:r,q:n,c:i,k:u}),_=[];"min"===s||"max"===s||i||(_.push(winpos("%%n",v,h)),_.push(winsize("%%n",P,b)),"bottom"!==s||i||_.push("*selectppx %n")),E&&!isEmptyStr(E)&&_.push(a+' -e "'+colorlize({esc:!0,message:E,fg:y,bg:O})+' \\n"'),_.push(C.postcmd);var j="";_.length>0&&(j=(i?"-c ":"-k ")+_.removeEmpty().join("%%:"));var N=[].concat(k,["%0ppbw.exe",C.id,C.max,C.quiet]).removeEmpty().join(" "),F=!0;try{/^-k $/.test(j)&&(j=""),PPx.Execute(N+" "+j+"%:*wait 500,2")}catch(A){F=!1}return F};Object.keys||(Object.keys=(p=Object.prototype.hasOwnProperty,g=!{toString:null}.propertyIsEnumerable("toString"),d=(x=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(e){if("function"!=typeof e&&("object"!=typeof e||null==e))throw new Error("Object.keys: called on non-object");var t,r,n=[];for(t in e)p.call(e,t)&&n.push(t);if(g)for(r=0;r<d;r++)p.call(e,x[r])&&n.push(x[r]);return n})),function(){if("object"!=typeof JSON){JSON={};var e,t,r,n,i=/^[\],:{}\s]*$/,a=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,u=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,o=/(?:^|:|,)(?:\s*\[)+/g,s=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,c=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,i,a){var u;if(e="",t="","number"==typeof a)for(u=0;u<a;u+=1)t+=" ";else"string"==typeof a&&(t=a);if(n=i,i&&"function"!=typeof i&&("object"!=typeof i||"number"!=typeof i.length))throw new Error("JSON.stringify");return str("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(e,t){var r;function walk(e,r){var n,i,a=e[r];if(a&&"object"==typeof a)for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&((i=walk(a,n))!==undefined?a[n]=i:delete a[n]);return t.call(e,r,a)}if(e=String(e),c.lastIndex=0,c.test(e)&&(e=e.replace(c,(function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))),i.test(e.replace(a,"@").replace(u,"]").replace(o,"")))return r=Function("return ("+e+")")(),"function"==typeof t?walk({"":r},""):r;throw new Error("JSON.parse")})}function f(e){return e<10?"0"+e:e}function quote(e){return s.lastIndex=0,s.test(e)?'"'+e.replace(s,(function(e){var t=r[e];return"string"==typeof t?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+e+'"'}function str(r,i){var a,u,o,s,c,l=e,p=i[r];switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(r)),"function"==typeof n&&(p=n.call(i,r,p)),typeof p){case"string":return quote(p);case"number":return isFinite(p)?String(p):"null";case"boolean":return String(p);case"object":if(!p)return"null";if(e+=t,c=[],"[object Array]"===Object.prototype.toString.apply(p)){for(s=p.length,a=0;a<s;a+=1)c[a]=str(String(a),p)||"null";return o=0===c.length?"[]":e?"[\n"+e+c.join(",\n"+e)+"\n"+l+"]":"["+c.join(",")+"]",e=l,o}if(n&&"object"==typeof n)for(s=n.length,a=0;a<s;a+=1)"string"==typeof n[a]&&(o=str(u=String(n[a]),p))&&c.push(quote(u)+(e?": ":":")+o);else for(u in p)Object.prototype.hasOwnProperty.call(p,u)&&(o=str(u,p))&&c.push(quote(u)+(e?": ":":")+o);return o=0===c.length?"{}":e?"{\n"+e+c.join(",\n"+e)+"\n"+l+"}":"{"+c.join(",")+"}",e=l,o}return"null"}}();var parseSource=function(e,t){var r=JSON.parse(t.replace(/\\/g,"\\\\"));return r.path="remote"===r.location?PPx.Extract("%*getcust(S_ppm#global:home)")+"\\repo\\"+e:r.path,_extends({name:e},r)},expandSource=function(e){var t=PPx.Extract("%*getcust(S_ppm#sources:"+e+")");return isEmptyStr(t)?undefined:parseSource(e,t)},owSource=function(e,t){var r=PPx.Extract("%*getcust(S_ppm#sources:"+e+")");if(isEmptyObj(t)||isEmptyStr(r))return undefined;for(var n=0,i=Object.keys(t);n<i.length;n++){var a=i[n],u=RegExp('"'+a+'":[^,}]+'),o="boolean"==typeof t[a]?t[a]:'"'+t[a]+'"';r=r.replace(u,'"'+a+'":'+o)}return PPx.Execute("*setcust S_ppm#sources:"+e+"="+r),parseSource(e,r)},setSource=function(e){var t=e.name,r=e.enable,n=void 0===r||r,i=e.setup,a=void 0!==i&&i,u=e.version,o=void 0===u?"0.1.0":u,s=e.location,c=void 0===s?"remote":s,l=e.path,p=void 0===l?"":l,g=e.branch,x=void 0===g?"":g,d=e.commit,m=void 0===d?"":d,v=['"enable":'+n,'"setup":'+a,'"version":"'+o+'"','"location":"'+c+'"'];if("local"===c){if(isEmptyStr(p))throw new Error("Path not specified");v.push('"path":"'+p+'"')}return!isEmptyStr(x)&&v.push('"branch":"'+x+'"'),!isEmptyStr(m)&&v.push('"commit":"'+m+'"'),PPx.Execute("*setcust S_ppm#sources:"+t+"={"+v.join(",")+"}")},sourceNames=function(){for(var e=PPx.Extract("%*getcust(S_ppm#sources)").split(r.nlcode),t=[],n=1,i=e.length-2;n<i;n++)t.push(e[n].split(/\t/)[0]);return t},m=PPx.Extract('%sgu"ppmcache"')+"\\complist\\ppmsources.txt",v={prefix:{installed:"!",enable:"",disable:"~"},getPrefix:function(e){var t="enable";return e.enable?e.setup||(t="installed"):t="disable",this.prefix[t]},expandName:function(e){return e.replace(/^[~!]/,"")},getName:function(e){var t=expandSource(this.expandName(e));if(t){var r=this.prefix.enable;return t.enable?t.setup||(r=this.prefix.installed):r=this.prefix.disable,""+r+e}},fix:function(e){var t=readLines({path:m}),r=t[0],n=t[1];if(r){for(var i=[],a=0;a<e.length;a++){var u=e[a];i.push(""+this.getPrefix(u)+u.name)}return this.write(i)}for(var o=/^[\!~]/,s={},c=0;c<e.length;c++){var l=e[c];s[l.name]=this.getPrefix(l)}for(var p,g,x=0,d=n.lines.length;x<d;x++)"string"==typeof(g=s[p=n.lines[x].replace(o,"")])&&(n.lines[x]=""+g+p);return this.write(n.lines)},write:function(e,t){void 0===t&&(t=!1);var r=t?[!1,!0]:[!0,!1],n=r[0],i=r[1];return writeLines({path:m,data:e,overwrite:n,append:i})}};String.prototype.precedes||(String.prototype.precedes=function(e){var t=this.indexOf(e);return~t?this.slice(0,t):this});var h={en:{notRegistered:" is not registerd.",failedOverride:"Failed to update S_ppm#sources",failedPluginList:"Failed to update the pluginlist",failedCompList:"Failed to update the plugin CompList",cannotUndo:"There are no configuration files to undo",undo:"Undo completed. Please restart PPx",completed:"Exit with ESC key"},ja:{notRegistered:" は未登録です",failedOverride:"S_ppm#sourcesを更新できませんでした",failedPluginList:"プラグインリストを更新できませんでした",failedCompList:"プラグイン補完リストを更新できませんでした",cannotUndo:"アンドゥ対象の設定ファイルはありません",undo:"アンドゥが完了しました。PPxを再起動してください",completed:"ESCキーで終了します"}},P={en:{badGrammar:"Bad grammar found",isEarlier:"is declared even though the section has not started",badDeletion:"You cannot specify a value for the deletion setting",doNotDelete:"Deleting prorerties in the base.cfg is not allowed",failedToGet:"Failed to get installation information for",isNotPlugin:" is not a ppm-plugin repository"},ja:{badGrammar:"書式が間違っています",isEarlier:"の開始が宣言されていません",badDeletion:"削除設定には値を指定できません",doNotDelete:"base.cfg内でのプロパティの削除はできません",failedToGet:"インストール情報を取得できません",isNotPlugin:"はppmプラグインではありません"}}[l.lang()],getProp=function(e){var t="@ppm!delim#",r=(/^'/.test(e)?e.replace(/^((?:'''|'[^']+')\s*)([=,])\s*(.*)$/,"$1"+t+"$2"+t+"$3"):e.replace(/^([^=,]+)([=,])\s*(.*)$/,"$1"+t+"$2"+t+"$3")).split(t);return{key:r[0].replace(/[\s\uFEFF\xA0]+$/,""),sep:r[1],value:r[2]}},specItem=function(e,t,n,i,a){var u,o=/^([\\&]*\^[\\&]*)J$/,s=getProp(n),c=s.key,l=s.sep,p=s.value;if(0===c.indexOf("$"))~(p=p.trim().toUpperCase()).indexOf("J")&&(p=p.replace(o,"$1V_H4A")),u="replace";else if(0===c.indexOf("@")){var g=[p];for(e++;e<t;e++){if(0!==(n=i[e]).indexOf("\t")){e--;break}g.push(n)}p=g.join(r.nlcode),u="default"}else{if(0!==c.indexOf("?"))return[P.badGrammar,a,e];p=p.trim(),u="convert"}return a[u][c.substring(1)]={sep:l,value:p},[!1,a,e]},b=/^--[\s]+=[\s]*/,E="--\t=",setFmt=function(e,t,r){return e+"\t"+t+" "+r},unsetFmt=function(e){return"-|"+e+"\t="},ignoreProps=function(e){return/^(A_|X_|XB_|XC_|XV_|KC_main|KV_main)/i.test(e)},replacer=function(e,t){for(var r,n=0;n<t.length;n++){var i=t[n];~e.indexOf("[/"+i.key+"]")&&(r=RegExp("\\[/"+i.key+"]","g"),e=e.replace(r,i.value))}return e},sectionItems=function(e,t,r,n){var i=[],a=[],u=[],o=[],s=o[0],c=o[1],l=o[2],p=o[3];for(e++;e<t;e++)if(p=r[e],!(isEmptyStr(p)||/^[\s;}]/.test(p)||b.test(p))){if(0===p.indexOf("[endsection]"))break;if(0!==p.indexOf("/")){p=replacer(p,i);var g=getProp(p);if(s=g.key,c=g.sep,l=g.value,!c&&!l)return[P.badGrammar,e,n];if("="!==c||0!==l.indexOf("{"))0!==s.indexOf("-")?(a.push(setFmt(s,c,l)),!ignoreProps(s)&&u.push(unsetFmt(s))):0===s.indexOf("-|")||/^-[0-9\.]*\|.+/.test(s)?a.push(setFmt(s,c,l)):!ignoreProps(s)&&u.push("-|"+s.substring(1)+"\t=");else{var x=!0;if(0===s.indexOf("-")){if(/^-[0-9\.]*\|.+/.test(s))return[P.badDeletion,e,n];s=s.substring(1),ignoreProps(s)?u.push(setFmt(s,c,l)):(x=!1,u.push(unsetFmt(s)))}else u.push(setFmt(s,c,l));for(a.push(setFmt(s,c,l)),e++;e<t;e++)if(p=r[e],!isEmptyStr(p)&&0!==p.indexOf(";")){if(0===p.indexOf("[endsection]")||0===p.indexOf("}")){a.push("}"),x&&u.push("}");break}if(p=replacer(p,i),/^[\s]/.test(p)||b.test(p))a.push(p);else{var d=getProp(p);s=d.key,c=d.sep,l=d.value,a.push(setFmt(s,c,l)),x&&u.push(unsetFmt(s))}}}}else i.push(getProp(p.substring(1)))}var m=[a,u];return n.section=m[0],n.unset=m[1],[!1,e,n]},linecustItems=function(e,t,r,n){for(var i,a={},u=/^(\w+),([^,=]+)([,=])(.*)$/;e<t&&0!==(i=r[e]).indexOf("[endlinecust]");e++)i.replace(u,(function(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];var u,o=[].concat(r),s=o[0],c=o[1],l=o[2],p=o[3];l&&(p=null!=(u=p)?u:"",a[s]={id:c,sep:l,value:p});return i}));return n.linecust=a,[e,n]},executeItems=function(e,t,r,n){var i,a=[];for(e++;e<t&&0!==(i=r[e]).indexOf("[endexecute]");e++)0!==i.indexOf(";")&&a.push(i);return n.execute=a,[e,n]},errorDetail=function(e,t,r){return e+"\nLine:"+(t+1)+":"+r},convertLine=function(e,t){var r=e.match(/\[\?[^:]+/g);if(isBottom(r))return e;for(var n,i=[],a=i[0],u=i[1],o=e,s=0,c=r.length;s<c;s++)u=t[a=r[s].substring(2)]?t[a].value:"",u=isEmptyStr(u)||isBottom(u)?"$1":u,n=RegExp("\\[\\?"+a+":([^\\]]*)]","g"),o=o.replace(n,u);return o},y=[],isRegistered=function(e,t,r){var n=!1,i=unsetFmt(t);e?y.push(i):y=[];for(var a=0;a<r.length;a++){var u=r[a];if(i===u&&(0===y.length||y.indexOf(u))){n=!0;break}}return n},mergeProp=function(e,t,r,n,i){var a,u="@default:",o="$replace:",s=[],c=s[0],l=s[1],p=t,g=r,x=n;if(0===t.indexOf(u)){if(p=t.substring(u.length),a=i["default"][p]){var d=[a.sep,a.value];g=d[0],x=d[1]}}else if(0===t.indexOf(o)){if(p=(p=t.substring(o.length)).replace(/^["'](.+)["']/,"$1"),!(a=i.replace[p])||isEmptyStr(a.value))return undefined;p=a.value}return c=setFmt(p,g,x),isRegistered(e,p,i.unset)||(l=unsetFmt(p)),{set:c,unset:l}},merge=function(e,t){for(var r=[],n=[],i=n[0],a=n[1],u=n[2],o=n[3],s=!1,c=!0,l=0,p=e.length;l<p;l++)if(o=e[l],!(isEmptyStr(o)||/^[\s;}]/.test(o)||b.test(o))){if(0===o.indexOf("-|"))throw new Error(P.doNotDelete);o=convertLine(o,t.convert);var g=getProp(o);if(i=g.key,a=g.sep,u=g.value,!a&&!u)throw new Error(P.badGrammar);if("="!==a||0!==u.indexOf("{")){var x=mergeProp(!1,i,a,u,t);x?(r.push(x.set),x.unset&&!ignoreProps&&t.unset.push(x.unset),s=!1):s=!0}else{if(0===i.indexOf("-"))throw new Error(P.badGrammar);for(r.push(setFmt(i,a,u)),isRegistered(!1,i,t.unset)?c=!1:(c=!0,t.unset.push(setFmt(i,a,u))),l++;l<p;l++)if(o=e[l],!isEmptyStr(o)&&0!==o.indexOf(";")){if(0===o.indexOf("-|"))throw new Error(P.doNotDelete);if(0===o.indexOf("}")){r.push("}"),c&&t.unset.push("}"),s=!1;break}if(b.test(o))r.push(E),s=!1;else if(o=convertLine(o,t.convert),/^\s+/.test(o))!s&&r.push(o);else{var d=getProp(o);i=d.key,a=d.sep,u=d.value;var m=mergeProp(!0,i,a,u,t);m?(r.push(m.set),c&&m.unset&&t.unset.push(m.unset),s=!1):s=!0}}}}return{set:[].concat(r,t.section),unset:t.unset,linecust:t.linecust,execute:t.execute}},parseLinecust=function(e){var t=l.global("ppmcache")+"\\ppm\\unset\\linecust.cfg",r=readLines({path:t}),n=r[0],i=r[1],a=/^[^=]+=(.+)$/,u=[];if(n)return[!0,i];for(var o=0,s=i.lines;o<s.length;o++){var c=s[o];~c.indexOf(e)&&u.push(c.replace(a,"*linecust $1"))}return[!1,u]},O={patch:function(e,t){for(var r,n=!1,i=[0,t.length],a=i[0],u=i[1],o={"default":{},replace:{},convert:{},section:[],execute:[],unset:[],linecust:{}};a<u;a++)if(r=t[a],!(isEmptyStr(r)||/^[\s;}]/.test(r)||b.test(r))){if(0===r.indexOf("[end"))throw new Error(errorDetail(r+" "+P.isEarlier,a,r));if(0===r.indexOf("[section]")||0===r.indexOf("[linecust]")||0===r.indexOf("[execute"))break;var s=specItem(a,u,r,t,o);if(n=s[0],o=s[1],a=s[2],n)throw new Error(errorDetail(n,a,r))}for(;a<u;a++)if(0===(r=t[a]).indexOf("[section]")){var c=sectionItems(a,u,t,o);if(n=c[0],a=c[1],o=c[2],n)throw new Error(errorDetail(n,a,r))}else if("user"===e&&0===r.indexOf("[linecust]")){var l=linecustItems(a,u,t,o);a=l[0],o=l[1]}else if(0===r.indexOf("[execute]")){var p=executeItems(a,u,t,o);a=p[0],o=p[1]}return o},merge:merge},checkRegisteredLinecusts=function(e,t){if(isEmptyObj(t))return{};var r=_extends({},t),n=l.global("ppmcache")+"\\ppm\\unset\\linecust.cfg",i=readLines({path:n}),a=i[0],u=i[1],o=/^[^=]+=([^,]+),.+,$/;if(a)~u.indexOf("not found")&&PPx.Execute("*makefile "+n);else for(var s=0,c=u.lines;s<c.length;s++){var p=c[s];if(~p.indexOf(e)){var g=p.replace(o,"$1");r[g]&&delete r[g]}}return r},getLog=function(e,t,r,n){var i=n?colorlize({message:" LOAD ",fg:"black",bg:"green"}):"LOAD: ",a=n?colorlize({message:" LINECUST ",fg:"black",bg:"magenta"}):"LINECUST: ",u=n?colorlize({message:" EXECUTE ",fg:"black",bg:"yellow"}):"EXECUTE: ",o=n?colorlize({message:" ERROR ",fg:"black",bg:"red"}):"ERROR: ";return 0===e?{load:i,linecust:a,execute:u}[t]+" "+r:o+" ["+t+"] "+r},w={init:function(e,t){var r=l.global("ppmcache");return copyFile(t+"\\setting\\patch.cfg",r+"\\config\\"+e+".cfg",!1)},merge:function(e,t,r){var n=l.global("ppmcache"),i={patch:"default"===r?t+"\\setting\\patch.cfg":n+"\\config\\"+e+".cfg",base:t+"\\setting\\base.cfg"},a=readLines({path:i.patch}),u=a[0],o=a[1];if(u)throw new Error(o);var s=O.patch(r,o.lines),c=readLines({path:i.base}),p=c[0],g=c[1];if(p)throw new Error(g);return O.merge(g.lines,s)},mergeLinecust:function(e){for(var t=[],r=0,n=Object.keys(e);r<n.length;r++){var i=n[r],a=e[i];t.push(i+","+a.id+a.sep+a.value)}return t},write:function(e,t){var r=l.global("ppmcache"),n=r+"\\ppm\\unset\\linecust.cfg",i={setup:r+"\\ppm\\setup\\"+e+".cfg",unset:r+"\\ppm\\unset\\"+e+".cfg"},a=writeLines({path:i.setup,data:t.set,overwrite:!0}),u=a[0],o=a[1],s=u?[u,o]:writeLines({path:i.unset,data:t.unset,overwrite:!0});if(u=s[0],o=s[1],isError(u,o))throw new Error(o);for(var c=checkRegisteredLinecusts(e,t.linecust),p=[],g=0,x=Object.keys(c);g<x.length;g++){var d=x[g],m=c[d].id;p.push(e+"="+d+","+m+",")}if(p.length>0){var v=writeLines({path:n,data:p,append:!0}),h=v[0],P=v[1];if(h)throw new Error(P)}return t.linecust},register:function(e,t,r,n,i){var a,u=[],o=l.global("ppmcache")+"\\ppm\\setup\\"+e+".cfg";n=null==(a=n)||a;var s=!1;i?l.execute("B","*linemessage @"+o+"%%bn%%:*ppcust CA "+o+"%%&"):(l.setcust("@"+o),u.push(getLog(0,"load",e,n)));for(var c=0,p=Object.keys(r);c<p.length;c++){var g=p[c],x=r[g],d=x.id,m=x.sep,v=x.value,h=PPx.Execute("*linecust "+g+","+d+m+v);u.push(getLog(h,"linecust",(g+","+d+m+v).replace(/\\/g,"\\\\"),n)),s=0!==h}for(var P=0;P<t.length;P++){var b=t[P],E=PPx.Execute(b);u.push(getLog(E,"execute",b.replace(/\\/g,"\\\\"),n)),s=0!==E}return[s,u]}},S={extractGitDir:function(){var e="C:/Program Files/git";if(u.FolderExists(e))return e;var t="C:/Program Files (x86)/git";if(u.FolderExists(t))return t;var r=PPx.Extract("%'git_install_root'");if(""!==r)return r;var n=PPx.Extract("%'path'");return/[\/\\]git[\/\\]cmd[\/\\]?[;$]/.test(n)?(n=(n=n.replace(/(.+[\/\\]git)[\/\\]cmd[\/\\]?[;$]/,"$1")).replace(/^(.+;)?/,"")).replace(/\//g,"\\"):""},globalPath:{keys:{ppm:"",ppmhome:"",ppmarch:"%%su'ppmhome'\\arch",ppmrepo:"%%su'ppmhome'\\repo",ppmcache:"%%su'ppmhome'\\"+n.cacheDir(),ppmlib:"%%su'ppm'\\dist\\lib"},set:function(e,t){this.keys.ppmhome=e,this.keys.ppm=t;for(var r=0,n=Object.keys(this.keys);r<n.length;r++){var i=n[r];PPx.Execute("*string u,"+i+"="+this.keys[i])}},unset:function(){for(var e=0,t=Object.keys(this.keys);e<t.length;e++){var r=t[e];PPx.Execute("*deletecust _User:"+r)}}},homeSpec:function(e){var t=e;return isEmptyStr(t)&&(t=PPx.Extract("%'home'"),t=isEmptyStr(t)?pathJoin(PPx.Extract("%'appdata'"),r.ppmName):pathJoin(t,".ppm")),t}},getManageFiles=function(e){var t=e+"\\list\\"+n.manageFiles;if(u.FileExists(t)){var r=readLines({path:t}),i=r[0],a=r[1];if(!i)return a.lines}return t=e+"\\ppm\\"+n.nopluginCfg,u.FileExists(t)?[t]:[e+"\\backup\\"+n.initialCfg]},k={getManageFiles:getManageFiles,updateLists:function(e){var t=l.global("ppmcache")+"\\list\\"+n.pluginList,r=readLines({path:t}),i=r[0],a=r[1];if(i)return[!0,"pluginlist read error"];for(var u={},o=[],s=[],c=/^(;\s*)?(remote|local)\s+['"].+[/\\](.+)['"]/,p=!0,g=0,x=a.lines.length;g<x;g++)p?0===a.lines[g].indexOf(";----")&&(p=!1):u[a.lines[g].replace(c,"$3")]=g;for(var d=!1,m=0;m<e.length;m++){var h=e[m];if(h){var P=u[h.name];"number"==typeof P&&(h.enable?0===a.lines[P].indexOf(";")&&(a.lines[P]=a.lines[P].replace(/^;\s*/,""),d=!0):0!==a.lines[P].indexOf(";")&&(a.lines[P]=";"+a.lines[P],d=!0)),o.push(h)}}if(d){var b=writeLines({path:t,data:a.lines,overwrite:!0,linefeed:a.nl}),E=b[0],y=b[1];E&&s.push(y)}var O=v.fix(o),w=O[0],S=O[1];return w&&s.push(S),[w,s.join("\\n")]}},C=h[useLanguage()],_=l.global("ppmcache"),j="B"+r.ppmID,main=function(){var e=l.jobstart("."),t=safeArgs("all","reset","default",!1),a=t[0].replace(/^[\!~]/,""),u=/^(set|restore|unset)$/.test(t[1])?t[1]:"reset",o="default"===t[2]?"default":"user",s=t[3],c="reset"===u||"restore"===u,p="all"===a,g=getSources(a,p);if(g)if(s){var x="24",d=doDryrun(g,o);PPx.Execute("*ppv -esc:on -tab:"+x+" "+d)}else{if(c){var m=r.ppmName+" ver"+l.global("version");if(runPPb({bootid:r.ppmID,desc:m,fg:"cyan",x:0,y:0,width:700,height:500,k:"*mapkey use,"+i.tempKey}),"reset"===u){var v=tmp().ppmDir()+"\\_user.cfg";createBackup({path:v,sort:!1,mask:["_User"]}),l.execute(j,"*ppcust CINIT%%&*setcust @"+v),l.execute(j,"*ppcust CA "+_+"\\ppm\\"+n.globalCfg+"%%&")}}initialState(c,g);var h=PPx.Extract("%*now(date)");if(c||p){var P=_+"\\ppm\\"+n.nopluginCfg;createBackup({path:P}),copyFile(P,_+"\\backup\\"+h+"_"+n.nopluginCfg,!0)}"unset"!==u&&loadPlugins(c,o,g),(c||p)&&createBackup({path:_+"\\backup\\"+h+".cfg"}),k.updateLists(g);var b="%sgu'ppmcache'\\ppm\\"+n.globalCfg;createBackup({path:b,mask:["S_ppm#global","S_ppm#sources","S_ppm#plugins","A_color"]}),c&&(l.setkey("ESC",'*deletecust "'+i.tempKey+'"%%:*ppc%%:*wait 200%%:*closeppx %%n'),l.linemessage(j,""+C.completed))}else{var E=pathSelf().scriptName;l.echo(E,a+" "+C.notRegistered)}e()},getSources=function(e,t){var r=[];if(t)for(var n=sourceNames(),i=0;i<n.length;i++){var a=n[i];r.push(expandSource(a))}else{var u=expandSource(e);u&&r.push(u)}return r},loadManageFiles=function(){for(var e=k.getManageFiles(_),t=1===e.length?"CS":"CA",r=/^.+\\/,n=0;n<e.length;n++){var i=e[n];isEmptyStr(i)||(coloredEcho(j,colorlize({message:i.replace(r,""),esc:!0})),l.execute(j,"%%Oa *ppcust "+t+" "+i+"%%&"))}},unsetPlugin=function(e){var t=_+"\\ppm\\unset\\"+e.name+".cfg",r=parseLinecust(e.name),n=r[0],i=r[1];if(!isError(n,i))for(var a=0,u=(i="").length;a<u;a++)PPx.Execute(i[a]);return l.setcust("@"+t),[n,i]},initialState=function(e,t){if(e)l.close("C*"),loadManageFiles(),S.globalPath.set(l.global("home"),l.global("ppm"));else{for(var r=0,n=t.length;r<n;r++){var i=t[r],a=unsetPlugin(i),u=a[0],o=(a[1],owSource(i.name,{enable:!1})?[!1,""]:[!0,C.failedOverride]);u=o[0],o[1],u||(t[r].enable=!1)}PPx.Execute('%K"LOADCUST"')}},setPlugin=function(e,t,r){var n=w.merge(e.name,e.path,t),i=w.write(e.name,n);return w.register(e.name,n.execute,i,r,r)},loadPlugins=function(e,t,n){for(var i=[],a=["Failed:"],u=0,o=n.length;u<o;u++){var s=n[u];if(!~i.indexOf(s.name)&&(!e||s.enable)){i.push(s.name),n[u]=_extends({},s,{enable:!0,setup:!0});var c=[0!==setSource(n[u]),C.failedOverride],p=c[0],g=c[1];l.setcust("S_ppm#plugins:"+s.name+"="+s.path),p&&(e?coloredEcho(j,colorlize({message:g,esc:!0,fg:"red"})):a.push(g));var x=setPlugin(s,t,e);p=x[0],g=x[1],p?e?coloredEcho(j,g.join("\\n")):a.push.apply(a,g):e&&coloredEcho(j,"%("+g.join("\\n")+"%)")}}e?PPx.Execute('%K"LOADCUST"'):a.length>1&&l.report(""+a.join(r.nlcode))},doDryrun=function(e,t){for(var r=tmp().file,n=colorlize({message:"Reference of plugin settings",fg:"cyan"}),i=colorlize({message:" linecust ",fg:"black",bg:"magenta"}),a=colorlize({message:" execute ",fg:"black",bg:"yellow"}),u=colorlize({message:" unset ",fg:"black",bg:"red"}),o=[n],s=0,c=e.length;s<c;s++){var l=colorlize({message:" "+e[s].name+" ",fg:"black",bg:"green"}),p=w.merge(e[s].name,e[s].path,t),g=w.mergeLinecust(p.linecust);o.push.apply(o,[l].concat(p.set)),g.length>0&&o.push.apply(o,[i].concat(g)),p.execute.length>0&&o.push.apply(o,[a].concat(p.execute)),o.push.apply(o,[u].concat(p.unset))}var x=writeLines({path:r,data:o,overwrite:!0}),d=x[0],m=x[1];if(d)throw new Error(m);return r};main();
