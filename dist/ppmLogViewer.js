﻿var e=PPx.CreateObject("Scripting.FileSystemObject"),t={ppmName:"ppx-plugin-manager",ppmVersion:.95,language:"ja",encode:"utf16le",nlcode:"\r\n",nltype:"crlf",ppmID:"P",ppmSubID:"Q"},useLanguage=function(){var e=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===e||"ja"===e?e:t.language},r={initialCfg:"_initial.cfg",globalCfg:"_global.cfg",nopluginCfg:"_noplugin.cfg",pluginList:"_pluginlist",manageFiles:"_managefiles",updateLog:"_updateLog",repoDir:"repo",archDir:"arch",cacheDir:function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")}},n={tempKey:"K_ppmTemp",tempMenu:"M_ppmTemp",lfDset:"ppmlfdset"},tmp=function(){var e=PPx.Extract('%*extract(C,"%%*temp()")');return{dir:e,file:e+"_ppmtemp",lf:e+"_temp.xlf",stdout:e+"_stdout",stderr:e+"_stderr",ppmDir:function(){var e=PPx.Extract("%'temp'%\\ppm");return PPx.Execute("*makedir "+e),e}}},isEmptyStr=function(e){return""===e},pathSelf=function(){var e,t,r=PPx.ScriptName;return~r.indexOf("\\")?(e=r.replace(/^.*\\/,""),t=PPx.Extract("%*name(DKN,"+r+")")):(e=r,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}},expandNlCode=function(e){var t="\n",r=e.indexOf("\r");return~r&&(t="\r\n"==e.substring(r,r+2)?"\r\n":"\r"),t},exec=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},read=function(t){var r=t.path,n=t.enc,u=void 0===n?"utf8":n;if(!e.FileExists(r))return[!0,r+" not found"];var c=e.GetFile(r);if(0===c.Size)return[!0,r+" has no data"];var a=!1,i="";if("utf8"===u){var s=PPx.CreateObject("ADODB.Stream"),o=exec(s,(function(){return s.Open(),s.Charset="UTF-8",s.LoadFromFile(r),s.ReadText(-1)}));a=o[0],i=o[1]}else{var x="utf16le"===u?-1:0,l=c.OpenAsTextStream(1,x),p=exec(l,(function(){return l.ReadAll()}));a=p[0],i=p[1]}return a?[!0,"Unable to read "+r]:[!1,i]},readLines=function(e){var t,r=e.path,n=e.enc,u=void 0===n?"utf8":n,c=e.linefeed,a=read({path:r,enc:u}),i=a[0],s=a[1];if(i)return[!0,s];c=null!=(t=c)?t:expandNlCode(s.slice(0,1e3));var o=s.split(c);return isEmptyStr(o[o.length-1])&&o.pop(),[!1,{lines:o,nl:c}]},u=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,rejectInvalidString=function(t,r){if(0===r.indexOf("@")){if(r=PPx.Extract(r).substring(1),!e.FileExists(r))return 2}else if(!t.test(r))return 13;return 0},dialog=function(e,t,r){return void 0===t&&(t=""),t=isEmptyStr(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+r+'"')},runPPmTest=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},hasTargetId=function(e){return"."!==e},c={lang:t.language},createCache=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return c[e]=t,t},autoselectEnter=function(e){return PPx.Execute("%OC *setcust "+n.tempKey+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+n.tempKey+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),"*mapkey use,"+n.tempKey+"%%:"+e},a={echo:function(e,t,r){var n=r?"("+String(r)+")":"";return dialog("I",""+e,""+t+n)},question:function(e,t){return dialog("Q",""+e,t)},choice:function(e,t,r,n,u,c,i){void 0===n&&(n="ynC");var s="Mes0411",o={yes:s+":IMYE",no:s+":IMNO",cancel:s+":IMTC"},x="."===e,l=x?'%K"@LOADCUST"':'%%K"@LOADCUST"',p=[],P=p[0],f=p[1],m=p[2],g="",d="",v="",E=!1;u&&(P=PPx.Extract("%*getcust("+o.yes+")"),g="*setcust "+o.yes+"="+u+"%:",E=!0),c&&(f=PPx.Extract("%*getcust("+o.no+")"),d="*setcust "+o.no+"="+c+"%:",E=!0),i&&(m=PPx.Extract("%*getcust("+o.cancel+")"),v="*setcust "+o.cancel+"="+i+"%:",E=!0),E&&(PPx.Execute(""+g+d+v),a.execute(e,l));var b={0:"cancel",1:"yes",2:"no"},h=x?"":e,y=PPx.Extract("%OCP %*extract("+h+'"%%*choice(-text""'+r+'"" -title:""'+t+'"" -type:'+n+')")');return E&&(P&&PPx.Execute("*setcust "+o.yes+"="+P),f&&PPx.Execute("*setcust "+o.no+"="+f),m&&PPx.Execute("*setcust "+o.cancel+"= "+m),a.execute(e,l)),b[y]},execute:function(e,t,r){if(void 0===r&&(r=!1),isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if("tray"===e)return PPx.Execute("*pptray -c "+t);if(hasTargetId(e)){if(r){var n=PPx.Extract("%*extract("+e+',"'+t+'%%&0")');return isEmptyStr(n)?1:Number(n)}return PPx.Execute("*execute "+e+","+t)}if(r){var u=PPx.Extract(t+"%&0");return isEmptyStr(u)?1:Number(u)}return PPx.Execute(t)},execSync:function(e,t){if(isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return isEmptyStr(PPx.Extract("%N"+e))?6:Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(isEmptyStr(t))return[13,""];var r=hasTargetId(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),r]},lang:function(){var e=c.lang;if(!isEmptyStr(e))return e;var r=PPx.Extract("%*getcust(S_ppm#global:lang)");return e="en"===r||"ja"===r?r:t.language,c.lang=e,e},global:function(e){var t,n,u=c[e];if(u)return u;if(/^ppm[ahrcl]?/.test(e)){if(u=PPx.Extract("%sgu'"+e+"'"),isEmptyStr(u)){var a=e.replace("ppm","");switch(a){case"":u=null!=(t=c.ppm)?t:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":u=null!=(n=c.home)?n:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var i;u=(null!=(i=c.ppm)?i:createCache("ppm"))+"\\dist\\lib";break;default:var s,o=null!=(s=c.home)?s:createCache("home");"cache"===a&&(u=o+"\\"+r.cacheDir())}}}else u=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return c[e]=u,u},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return isEmptyStr(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,r){void 0===r&&(r="");var n=rejectInvalidString(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==n)return[n,""];if(isEmptyStr(t))return[1,""];var u=isEmptyStr(r)?"":',"'+r+'"',c=PPx.Extract("%*name("+e+',"'+t+'"'+u+")");return[n=Number(PPx.Extract()),c]},getcust:function(e){if(isEmptyStr(e))return[1,""];var t=rejectInvalidString(u,e);return 0!==t?[t,""]:[t,PPx.Extract("%*getcust("+e+")")]},setcust:function(e,t){if(void 0===t&&(t=!1),isEmptyStr(e))return 1;var r=rejectInvalidString(u,e);if(0!==r)return r;var n=t?"%OC ":"";return PPx.Execute(n+"*setcust "+e)},deletecust:function(e,t,r){var n="boolean"==typeof t,c=/^\s*"?([^"\s]+)"?\s*?$/,a=e.replace(c,"$1"),i=String(t),s=rejectInvalidString(u,a);if(0!==s)return s;var o=null==t||n||isEmptyStr(i)?'"'+a+'"':a+","+("string"==typeof t?'"'+t.replace(c,"$1")+'"':""+t);return PPx.Execute("*deletecust "+o),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,r,u){if(void 0===r&&(r=!1),void 0===u&&(u=""),isEmptyStr(e))throw new Error("SubId not specified");isEmptyStr(u)||(u="*skip "+u+"%bn%bt",r=!0);var c=r?"%OC ":"";return PPx.Execute(c+"*setcust "+n.tempKey+":"+e+","+u+t),n.tempKey},deletemenu:function(){PPx.Execute('*deletecust "'+n.tempMenu+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+n.tempKey+'"')},linecust:function(e){var t=e.label,r=e.id,n=e.sep,u=void 0===n?"=":n,c=e.value,a=void 0===c?"":c,i=e.esc,s=void 0!==i&&i,o=e.once,x=void 0!==o&&o?"*linecust "+t+","+r+",%%:":"";!isEmptyStr(a)&&s&&(a="%("+a+"%)"),PPx.Execute("*linecust "+t+","+r+u+x+a)},getvalue:function(e,t,r){if(isEmptyStr(r))return[1,""];var n=hasTargetId(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+r+"'\")"):PPx.Extract("%s"+t+"'"+r+"'");return[isEmptyStr(n)?13:0,n]},setvalue:function(e,t,r,n){return isEmptyStr(r)?1:hasTargetId(e)?PPx.Execute("*execute "+e+",*string "+t+","+r+"="+n):PPx.Execute("*string "+t+","+r+"="+n)},getinput:function(e){var t=e.message,r=void 0===t?"":t,n=e.title,u=void 0===n?"":n,c=e.mode,a=void 0===c?"g":c,i=e.select,s=void 0===i?"a":i,o=e.multi,x=void 0!==o&&o,l=e.leavecancel,p=void 0!==l&&l,P=e.forpath,f=void 0!==P&&P,m=e.fordijit,g=void 0!==m&&m,d=e.autoselect,v=void 0!==d&&d,E=e.k,b=void 0===E?"":E,h=/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,y=x?" -multi":"",_=p?" -leavecancel":"",N=f?" -forpath":"",O=g?" -fordijit":"";v&&(b=autoselectEnter(b));var C=""!==b?" -k %%OP- "+b:"",S=rejectInvalidString(h,a);if(0!==S)return[S,""];var D=PPx.Extract('%OCP %*input("'+r+'" -title:"'+u+'" -mode:'+a+" -select:"+s+y+_+N+O+C+")");return S=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[S,D]},linemessage:function(e,t,r,n){var u,c="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var a=n?"%%bn":" ";u=t.join(a)}else u=t;e="."===e?"":e,u=r&&!c?'!"'+u:u,PPx.Execute("%OC *execute "+e+",*linemessage "+u)},report:function(e){var r="string"==typeof e?e:e.join(t.nlcode);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(r):PPx.report(r)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return a.execute(e,"*job start"),function(){return a.execute(e,"*job end")}},getVersion:function(e){var t=readLines({path:e+="\\package.json"}),r=t[0],n=t[1];if(!r)for(var u=/^\s*"version":\s*"([0-9\.]+)"\s*,/,c=2,a=n.lines.length;c<a;c++)if(~n.lines[c].indexOf('"version":'))return n.lines[c].replace(u,"$1")}},i={en:{notExist:"No data"},ja:{notExist:"ログはありません"}},validArgs=function(){for(var e=[],t=PPx.Arguments;!t.atEnd();t.moveNext())e.push(t.value);return e},safeArgs=function(){for(var e=[],t=validArgs(),r=0,n=arguments.length;r<n;r++)e.push(_valueConverter(r<0||arguments.length<=r?undefined:arguments[r],t[r]));return e},_valueConverter=function(e,t){if(null==t||""===t)return null!=e?e:undefined;switch(typeof e){case"number":var r=Number(t);return isNaN(r)?e:r;case"boolean":return"false"!==t&&"0"!==t&&null!=t;default:return t}},s=pathSelf(),o=s.scriptName,x=s.parentDir,l=i[useLanguage()],main=function(){var n=safeArgs("customize",32),u=n[0],c=n[1];isLogType(u)||(PPx.Execute('*script "'+x+'\\errors.js",arg,'+o),PPx.Quit(-1));var i={update:{path:a.global("ppmcache")+"\\ppm\\"+r.updateLog,opts:""},customize:{path:tmp().file,opts:"-tab:"+c}}[u];e.FileExists(i.path)||(a.linemessage(".",l.notExist,!0),PPx.Quit(-1));var s=a.setkey("ENTER",'*script %%sgu"ppm"\\dist\\viewerAction.js'),p="ppmLogViewer",P="KV_main:CLOSEEVENT",f=",",m=!0;a.linecust({label:p,id:P,sep:f,esc:m,value:"*ifmatch V"+t.ppmID+",%n%:*linecust "+p+","+P+',%:*deletecust "'+s+'"'});var g=setCaret();PPx.Execute("%Oi *ppv -r -bootid:"+t.ppmID+" -utf8 -esc:on -history:off "+i.opts+" "+i.path+" -k *mapkey use,"+s),g()},isLogType=function(e){return/update|customize/.test(e)},setCaret=function(){var e="XV_tmod";return"0"===a.getcust(e)[1]?(a.setcust(e+"=1"),function(){return a.setcust(e+"=0")}):function(){}};main();
