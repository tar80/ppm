﻿var e={ppmName:"ppx-plugin-manager",ppmVersion:.95,language:"ja",encode:"utf16le",nlcode:"\r\n",nltype:"crlf",ppmID:"P",ppmSubID:"Q"},useLanguage=function(){var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===t||"ja"===t?t:e.language},t={initialCfg:"_initial.cfg",globalCfg:"_global.cfg",nopluginCfg:"_noplugin.cfg",pluginList:"_pluginlist",manageFiles:"_managefiles",updateLog:"_updateLog",repoDir:"repo",archDir:"arch",cacheDir:function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")}},r={tempKey:"K_ppmTemp",tempMenu:"M_ppmTemp",lfDset:"ppm_lfdset",virtualEntry:"ppm_ve"},isEmptyStr=function(e){return""===e},isEmptyObj=function(e){if(e===undefined)return!1;if(null===e)return!0;for(var t in e)return!1;return!0},isInteger=function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e},n={TypeToCode:{crlf:"\r\n",cr:"\r",lf:"\n"},CodeToType:{"\r\n":"crlf","\r":"cr","\n":"lf"},Ppx:{lf:"%%bl",cr:"%%br",crlf:"%%bn",unix:"%%bl",mac:"%%br",dos:"%%bn","\n":"%%bl","\r":"%%br","\r\n":"%%bn"},Ascii:{lf:"10",cr:"13",crlf:"-1",unix:"10",mac:"13",dos:"-1","\n":"10","\r":"13","\r\n":"-1"}},pathSelf=function(){var e,t,r=PPx.ScriptName;return~r.indexOf("\\")?(e=extractFileName(r),t=PPx.Extract("%*name(DKN,"+r+")")):(e=r,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}},extractFileName=function(e,t){return void 0===t&&(t="\\"),"\\"!==t&&"/"!==t&&(t="\\"),e.slice(e.lastIndexOf(t)+1)},i=PPx.CreateObject("Scripting.FileSystemObject"),expandNlCode=function(e){var t="\n",r=e.indexOf("\r");return~r&&(t="\r\n"===e.substring(r,r+2)?"\r\n":"\r"),t},isCV8=function(){return"ClearScriptV8"===PPx.ScriptEngineName},_exec=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},read=function(e){var t=e.path,r=e.enc,n=void 0===r?"utf8":r;if(!i.FileExists(t))return[!0,t+" not found"];var c=i.GetFile(t);if(0===c.Size)return[!0,t+" has no data"];var a=!1,u="";if("utf8"===n){var o=PPx.CreateObject("ADODB.Stream"),s=_exec(o,(function(){return o.Open(),o.Charset="UTF-8",o.LoadFromFile(t),o.ReadText(-1)}));a=s[0],u=s[1]}else{var l="utf16le"===n?-1:0,p=c.OpenAsTextStream(1,l),x=_exec(p,(function(){return p.ReadAll()}));a=x[0],u=x[1]}return a?[!0,"Unable to read "+t]:[!1,u]},readLines=function(e){var t,r=e.path,n=e.enc,i=void 0===n?"utf8":n,c=e.linefeed,a=read({path:r,enc:i}),u=a[0],o=a[1];if(u)return[!0,o];c=null!=(t=c)?t:expandNlCode(o.slice(0,1e3));var s=o.split(c);return isEmptyStr(s[s.length-1])&&s.pop(),[!1,{lines:s,nl:c}]},writeLines=function(t){var r=t.path,c=t.data,a=t.enc,u=void 0===a?"utf8":a,o=t.append,s=void 0!==o&&o,l=t.overwrite,p=void 0!==l&&l,x=t.linefeed,f=void 0===x?e.nlcode:x;if(!p&&!s&&i.FileExists(r))return[!0,r+" already exists"];var P,g=i.GetParentFolderName(r);if(i.FolderExists(g)||PPx.Execute("*makedir "+g),"utf8"===u){if(isCV8()){var m=c.join(f),d=s?"AppendAllText":"WriteAllText";return[!1,NETAPI.System.IO.File[d](r,m)]}var v=p||s?2:1,b=PPx.CreateObject("ADODB.Stream");P=_exec(b,(function(){b.Open(),b.Charset="UTF-8",b.LineSeparator=Number(n.Ascii[f]),s?(b.LoadFromFile(r),b.Position=b.Size,b.SetEOS):b.Position=0,b.WriteText(c.join(f),1),b.SaveToFile(r,v)}))[0]}else{var E=s?8:p?2:1;i.FileExists(r)||PPx.Execute("%Osq *makefile "+r);var h="utf16le"===u?-1:0,y=i.GetFile(r).OpenAsTextStream(E,h);P=_exec(y,(function(){y.Write(c.join(f)+f)}))[0]}return P?[!0,"Could not write to "+r]:[!1,""]},c=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,rejectInvalidString=function(e,t){if(0===t.indexOf("@")){if(t=PPx.Extract(t).substring(1),!i.FileExists(t))return 2}else if(!e.test(t))return 13;return 0},dialog=function(e,t,r){return void 0===t&&(t=""),t=isEmptyStr(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+r+'"')},runPPmTest=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},hasTargetId=function(e){return"."!==e},cache={lang:e.language},createCache=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return cache[e]=t,t},autoselectEnter=function(e){return PPx.Execute("%OC *setcust "+r.tempKey+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+r.tempKey+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),"*mapkey use,"+r.tempKey+"%%:"+e},a={echo:function(e,t,r){var n=r?"("+String(r)+")":"";return dialog("I",""+e,""+t+n)},question:function(e,t){return dialog("Q",""+e,t)},choice:function(e,t,r,n,i,c,u){void 0===n&&(n="ynC");var o="Mes0411",s={yes:o+":IMYE",no:o+":IMNO",cancel:o+":IMTC"},l="."===e,p=l?'%K"@LOADCUST"':'%%K"@LOADCUST"',x=[],f=x[0],P=x[1],g=x[2],m="",d="",v="",b=!1;i&&(f=PPx.Extract("%*getcust("+s.yes+")"),m="*setcust "+s.yes+"="+i+"%:",b=!0),c&&(P=PPx.Extract("%*getcust("+s.no+")"),d="*setcust "+s.no+"="+c+"%:",b=!0),u&&(g=PPx.Extract("%*getcust("+s.cancel+")"),v="*setcust "+s.cancel+"="+u+"%:",b=!0),b&&(PPx.Execute(""+m+d+v),a.execute(e,p));var E={0:"cancel",1:"yes",2:"no"},h=l?"":e,y=PPx.Extract("%OCP %*extract("+h+'"%%*choice(-text""'+r+'"" -title:""'+t+'"" -type:'+n+')")');return b&&(f&&PPx.Execute("*setcust "+s.yes+"="+f),P&&PPx.Execute("*setcust "+s.no+"="+P),g&&PPx.Execute("*setcust "+s.cancel+"= "+g),a.execute(e,p)),E[y]},execute:function(e,t,r){if(void 0===r&&(r=!1),isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if("tray"===e)return PPx.Execute("*pptray -c "+t);if(hasTargetId(e)){if(r){var n=PPx.Extract("%*extract("+e+',"'+t+'%%&0")');return isEmptyStr(n)?1:Number(n)}return PPx.Execute("*execute "+e+","+t)}if(r){var i=PPx.Extract(t+"%&0");return isEmptyStr(i)?1:Number(i)}return PPx.Execute(t)},execSync:function(e,t){if(isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return isEmptyStr(PPx.Extract("%N"+e))?6:Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(isEmptyStr(t))return[13,""];var r=hasTargetId(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),r]},lang:function(){var t=cache.lang;if(!isEmptyStr(t))return t;var r=PPx.Extract("%*getcust(S_ppm#global:lang)");return t="en"===r||"ja"===r?r:e.language,cache.lang=t,t},global:function(e){var r,n,i=cache[e];if(i)return i;if(/^ppm[ahrcl]?/.test(e)){if(i=PPx.Extract("%sgu'"+e+"'"),isEmptyStr(i)){var c=e.replace("ppm","");switch(c){case"":i=null!=(r=cache.ppm)?r:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":i=null!=(n=cache.home)?n:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var a;i=(null!=(a=cache.ppm)?a:createCache("ppm"))+"\\dist\\lib";break;default:var u,o=null!=(u=cache.home)?u:createCache("home");"cache"===c&&(i=o+"\\"+t.cacheDir())}}}else i=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return cache[e]=i,i},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return isEmptyStr(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,r){void 0===r&&(r="");var n=rejectInvalidString(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==n)return[n,""];if(isEmptyStr(t))return[1,""];var i=isEmptyStr(r)?"":',"'+r+'"',c=PPx.Extract("%*name("+e+',"'+t+'"'+i+")");return[n=Number(PPx.Extract()),c]},getcust:function(e){if(isEmptyStr(e))return[1,""];var t=rejectInvalidString(c,e);return 0!==t?[t,""]:[t,PPx.Extract("%*getcust("+e+")")]},setcust:function(e,t){if(void 0===t&&(t=!1),isEmptyStr(e))return 1;var r=rejectInvalidString(c,e);if(0!==r)return r;var n=t?"%OC ":"";return PPx.Execute(n+"*setcust "+e)},deletecust:function(e,t,r){var n="boolean"==typeof t,i=/^\s*"?([^"\s]+)"?\s*?$/,a=e.replace(i,"$1"),u=String(t),o=rejectInvalidString(c,a);if(0!==o)return o;var s=null==t||n||isEmptyStr(u)?'"'+a+'"':a+","+("string"==typeof t?'"'+t.replace(i,"$1")+'"':""+t);return PPx.Execute("*deletecust "+s),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,n,i){if(void 0===n&&(n=!1),void 0===i&&(i=""),isEmptyStr(e))throw new Error("SubId not specified");isEmptyStr(i)||(i="*skip "+i+"%bn%bt",n=!0);var c=n?"%OC ":"";return PPx.Execute(c+"*setcust "+r.tempKey+":"+e+","+i+t),r.tempKey},deletemenu:function(){PPx.Execute('*deletecust "'+r.tempMenu+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+r.tempKey+'"')},linecust:function(e){var t=e.label,r=e.id,n=e.sep,i=void 0===n?"=":n,c=e.value,a=void 0===c?"":c,u=e.esc,o=void 0!==u&&u,s=e.once,l=void 0!==s&&s?"*linecust "+t+","+r+",%%:":"";!isEmptyStr(a)&&o&&(a="%("+a+"%)"),PPx.Execute("*linecust "+t+","+r+i+l+a)},getvalue:function(e,t,r){if(isEmptyStr(r))return[1,""];var n=hasTargetId(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+r+"'\")"):PPx.Extract("%s"+t+"'"+r+"'");return[isEmptyStr(n)?13:0,n]},setvalue:function(e,t,r,n){return isEmptyStr(r)?1:hasTargetId(e)?PPx.Execute("*execute "+e+",*string "+t+","+r+"="+n):PPx.Execute("*string "+t+","+r+"="+n)},getinput:function(e){var t=e.message,r=void 0===t?"":t,n=e.title,i=void 0===n?"":n,c=e.mode,a=void 0===c?"g":c,u=e.select,o=void 0===u?"a":u,s=e.multi,l=void 0!==s&&s,p=e.leavecancel,x=void 0!==p&&p,f=e.forpath,P=void 0!==f&&f,g=e.fordijit,m=void 0!==g&&g,d=e.autoselect,v=void 0!==d&&d,b=e.k,E=void 0===b?"":b,h=/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,y=l?" -multi":"",S=x?" -leavecancel":"",w=P?" -forpath":"",O=m?" -fordijit":"";v&&(E=autoselectEnter(E));var C=""!==E?" -k %%OP- "+E:"",_=rejectInvalidString(h,a);if(0!==_)return[_,""];var F=PPx.Extract('%OCP %*input("'+r+'" -title:"'+i+'" -mode:'+a+" -select:"+o+y+S+w+O+C+")");return _=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[_,F]},linemessage:function(e,t,r,n){var i,c="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var a=n?"%%bn":" ";i=t.join(a)}else i=t;e="."===e?"":e,i=r&&!c?'!"'+i:i,PPx.Execute("%OC *execute "+e+",*linemessage "+i)},report:function(t){var r="string"==typeof t?t:t.join(e.nlcode);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(r):PPx.report(r)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return a.execute(e,"*job start"),function(){return a.execute(e,"*job end")}},getVersion:function(e){var t=readLines({path:e+="\\package.json"}),r=t[0],n=t[1];if(!r)for(var i=/^\s*"version":\s*"([0-9\.]+)"\s*,/,c=2,a=n.lines.length;c<a;c++)if(~n.lines[c].indexOf('"version":'))return n.lines[c].replace(i,"$1")}};String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/,"")}),Array.prototype.removeEmpty||(Array.prototype.removeEmpty=function(){for(var e=[],t=0,r=this.length;t<r;t++){var n=this[t];null==n||""===n||n instanceof Array&&0===n.length||n instanceof Object&&isEmptyObj(n)||e.push(n)}return e}),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var r;if(null==this)throw new Error('Array.indexOf: "this" is null or not defined');var n=Object(this),i=n.length>>>0;if(0===i)return-1;var c=null!=t?t:0;if(Math.abs(c)===Infinity&&(c=0),c>=i)return-1;for(r=Math.max(c>=0?c:i-Math.abs(c),0);r<i;){if(r in n&&n[r]===e)return r;r++}return-1});var u,o={fg:{black:"30",red:"31",green:"32",yellow:"33",blue:"34",magenta:"35",cyan:"36",white:"37",def:"39"},bg:{black:"40",red:"41",green:"42",yellow:"43",blue:"44",magenta:"45",cyan:"46",white:"47",def:"49"}},getEscSeq=function(e){return e?"\\x1b[":"["},colorlize=function(e){var t=e.message,r=e.esc,n=void 0!==r&&r,i=e.fg,c=e.bg;if(isEmptyStr(t))return"";var a=getEscSeq(n);return!i||isEmptyStr(i)?""+t:""+(""+a+(c?o.bg[c]+";":"")+o.fg[i]+"m")+t+a+"49;39m"},s=(u=PPx.Extract("%*getcust(S_ppm#global:git)"),isEmptyStr(u)?"echo":'"'+u+'\\usr\\bin\\echo.exe"'),coloredEcho=function(e,t,r){void 0===r&&(r=!1),t=t.replace(/\\/g,"\\\\");var n=r?"W":"",i="."===e?"%OP"+n+" "+s+" -ne '%("+t+"%)'":"*execute "+e+",%%OP"+n+" "+s+" -ne '%%("+t+"%%)'";return PPx.Execute(i)},winpos=function(e,t,r){return isInteger(t)&&isInteger(r)?"*windowposition "+e+","+(t<0?0:t)+","+(r<0?0:r):""},winsize=function(e,t,r){return isInteger(t)&&isInteger(r)?"*windowsize "+e+","+(t<200?200:t)+","+(r<200?200:r):""},_runCmdline=function(e){var t=e.startwith,r=void 0===t?"":t,n=e.wait,i=void 0===n?"":n,c=e.startmsg,a=void 0===c||c,u=e.priority,o=e.breakjob,s=e.newgroup,l=e.log,p=e.wd,x=e.x,f=e.y,P=e.width,g=e.height,m={"":"",min:"-min",max:"-max",noactive:"-noactive",bottom:"-noactive"}[r],d={"":"",wait:"-wait",idle:"-wait:idle",later:"-wait:later",no:"-wait:no"}[i],v="";if(p){if(!PPx.CreateObject("Scripting.FileSystemObject").FolderExists(p))return[!1,["[WARN] Specified working directory is not exist"]];v="-d:"+p}var b=a?"":"-nostartmsg",E=u?"-"+u:"",h=o?"-breakjob":"",y=s?"-newgroup":"",S=l?"-log":"",w=PPx.Extract("%*getcust(S_ppm#global:disp_width)"),O=PPx.Extract("%*getcust(S_ppm#global:disp_height)");return x&&x>Number(w)&&(x=0),f&&f>Number(O)&&(f=0),[!0,["*run","-noppb",m,d,b,E,h,y,S,v,x&&f?"-pos:"+x+","+f:"",P&&g?"-size:"+P+","+g:""]]},_ppbCmdline=function(e){var t=e.bootid,r=e.bootmax,n=e.q,i=e.c,c=e.k;return{id:t?"-bootid:"+t:"",max:r?"-bootmax:"+r:"",quiet:n?"-q":"",postcmd:i||(c||"")}},runPPb=function(e){var t=e.bootid,r=e.bootmax,n=e.q,i=e.c,c=e.k,a=e.startwith,u=void 0===a?"":a,o=e.wait,l=void 0===o?"":o,p=e.priority,x=e.breakjob,f=e.newgroup,P=e.log,g=e.wd,m=e.x,d=e.y,v=e.width,b=e.height,E=e.desc,h=e.fg,y=e.bg;if(-1!==PPx.Extract("%*ppxlist(-B)").indexOf("B_"+t))return PPx.Execute("*focus B"+t),!0;var S=_runCmdline({startwith:u,wait:l,priority:p,breakjob:x,newgroup:f,log:P,wd:g}),w=S[0],O=S[1];if(!w)return!1;var C=_ppbCmdline({bootid:t,bootmax:r,q:n,c:i,k:c}),_=[];"min"===u||"max"===u||i||(_.push(winpos("%%n",m,d)),_.push(winsize("%%n",v,b)),"bottom"!==u||i||_.push("*selectppx %n")),E&&!isEmptyStr(E)&&_.push(s+' -e "'+colorlize({esc:!0,message:E,fg:h,bg:y})+' \\n"'),_.push(C.postcmd);var F="";_.length>0&&(F=(i?"-c ":"-k ")+_.removeEmpty().join("%%:"));var k=[].concat(O,["%0ppbw.exe",C.id,C.max,C.quiet]).removeEmpty().join(" "),N=!0;try{/^-k $/.test(F)&&(F=""),PPx.Execute(k+" "+F+"%:*wait 500,2")}catch(j){N=!1}return N},l={en:{emptyCfgdir:'"S_ppm#user:cfgdir" value is invalid.',desc:'Please mark entries you want to read\\nIf you close PPc with anything other than ""ESC"", there will be no selection.',save:"Save selected entries",cancel:"Cancel",success:"Saved"},ja:{emptyCfgdir:"S_ppm#user:cfgdir の値が不正です",desc:'読み込みたい順番にマークしてください\\n""ESC""以外で終了すると指定なしになります',save:"選択したエントリを保存",cancel:"中止",success:"保存しました"}},p=pathSelf().scriptName,x=l[useLanguage()],f=a.user("cfgdir"),P=700,g=200;(function(){isEmptyStr(f)&&(a.echo(p,x.emptyCfgdir),PPx.Quit(-1));var r=[colorlize({message:"CTRL+ENTER",esc:!0,fg:"yellow"})+"%bt"+x.save,colorlize({message:"ESC",esc:!0,fg:"yellow"})+"%bt%bt"+x.cancel],n=a.setkey("^ENTER","*maxlength 32000%%:*execute B"+e.ppmID+",*string p,ppm_cfgs=%%#;FDC%%:*closeppx %%n");a.setkey("ESC","*execute B"+e.ppmID+",*string p,ppm_cfgs=cancel%%:*closeppx %%n"),runPPb({bootid:e.ppmID,desc:x.desc,fg:"green",x:0,y:0,width:P,height:g});var c="B"+e.ppmID;coloredEcho(c,r.join("\\n"));var u="-bootid:"+e.ppmID+" -show -single -restoretab:off",o=winpos("%%n",0,g)+"%%:*mapkey use,"+n;PPx.Execute("%Osq *ppc "+u+" "+f+" -k "+o+"%%&"),a.deletekeys();var s=a.global("ppmcache"),l=a.getvalue(c,"p","ppm_cfgs"),m=l[0],d=l[1];"cancel"===d?(a.execute(c,"*closeppx %%n"),PPx.Quit(1)):0!==m&&(d=i.FileExists(s+"\\ppm\\"+t.nopluginCfg)?s+"\\ppm\\"+t.nopluginCfg:s+"\\backup\\"+t.initialCfg);var v=s+"\\list\\"+t.manageFiles,b=d.split(";"),E=writeLines({path:v,data:b,overwrite:!0,linefeed:e.nlcode}),h=E[0],y=E[1],S=h?y:x.success;a.linemessage("B"+e.ppmID,b,!1,!0),a.execute(c,"%%OW echo "+S+"%%:*closeppx %%n")})();
