﻿function _extends(){return _extends=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)({}).hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},_extends.apply(null,arguments)}var e,t,r,n;Array.isArray||(Array.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var r;if(null==this)throw new Error('Array.indexOf: "this" is null or not defined');var n=Object(this),u=n.length>>>0;if(0===u)return-1;var i=null!=t?t:0;if(Math.abs(i)===Infinity&&(i=0),i>=u)return-1;for(r=Math.max(i>=0?i:u-Math.abs(i),0);r<u;){if(r in n&&n[r]===e)return r;r++}return-1}),Object.keys||(Object.keys=(e=Object.prototype.hasOwnProperty,t=!{toString:null}.propertyIsEnumerable("toString"),n=(r=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(u){if("function"!=typeof u&&("object"!=typeof u||null==u))throw new Error("Object.keys: called on non-object");var i,a,c=[];for(i in u)e.call(u,i)&&c.push(i);if(t)for(a=0;a<n;a++)e.call(u,r[a])&&c.push(r[a]);return c})),function(){if("object"!=typeof JSON){JSON={};var e,t,r,n,u=/^[\],:{}\s]*$/,i=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,a=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,c=/(?:^|:|,)(?:\s*\[)+/g,o=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(r={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(r,u,i){var a;if(e="",t="","number"==typeof i)for(a=0;a<i;a+=1)t+=" ";else"string"==typeof i&&(t=i);if(n=u,u&&"function"!=typeof u&&("object"!=typeof u||"number"!=typeof u.length))throw new Error("JSON.stringify");return str("",{"":r})}),"function"!=typeof JSON.parse&&(JSON.parse=function(e,t){var r;function walk(e,r){var n,u,i=e[r];if(i&&"object"==typeof i)for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&((u=walk(i,n))!==undefined?i[n]=u:delete i[n]);return t.call(e,r,i)}if(e=String(e),s.lastIndex=0,s.test(e)&&(e=e.replace(s,(function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))),u.test(e.replace(i,"@").replace(a,"]").replace(c,"")))return r=Function("return ("+e+")")(),"function"==typeof t?walk({"":r},""):r;throw new Error("JSON.parse")})}function f(e){return e<10?"0"+e:e}function quote(e){return o.lastIndex=0,o.test(e)?'"'+e.replace(o,(function(e){var t=r[e];return"string"==typeof t?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+e+'"'}function str(r,u){var i,a,c,o,s,l=e,p=u[r];switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(r)),"function"==typeof n&&(p=n.call(u,r,p)),typeof p){case"string":return quote(p);case"number":return isFinite(p)?String(p):"null";case"boolean":return String(p);case"object":if(!p)return"null";if(e+=t,s=[],"[object Array]"===Object.prototype.toString.apply(p)){for(o=p.length,i=0;i<o;i+=1)s[i]=str(String(i),p)||"null";return c=0===s.length?"[]":e?"[\n"+e+s.join(",\n"+e)+"\n"+l+"]":"["+s.join(",")+"]",e=l,c}if(n&&"object"==typeof n)for(o=n.length,i=0;i<o;i+=1)"string"==typeof n[i]&&(c=str(a=String(n[i]),p))&&s.push(quote(a)+(e?": ":":")+c);else for(a in p)Object.prototype.hasOwnProperty.call(p,a)&&(c=str(a,p))&&s.push(quote(a)+(e?": ":":")+c);return c=0===s.length?"{}":e?"{\n"+e+s.join(",\n"+e)+"\n"+l+"}":"{"+s.join(",")+"}",e=l,c}return"null"}}();var u={ppmName:"ppx-plugin-manager",ppmVersion:.95,language:"ja",encode:"utf16le",nlcode:"\r\n",nltype:"crlf",ppmID:"P",ppmSubID:"Q"},i={initialCfg:"_initial.cfg",globalCfg:"_global.cfg",nopluginCfg:"_noplugin.cfg",pluginList:"_pluginlist",manageFiles:"_managefiles",updateLog:"_updateLog",repoDir:"repo",archDir:"arch",cacheDir:function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")}},a={tempKey:"K_ppmTemp",tempMenu:"M_ppmTemp",lfDset:"ppm_lfdset",virtualEntry:"ppm_ve"},tmp=function(){var e=PPx.Extract('%*extract(C,"%%*temp()")');return{dir:e,file:e+"_ppmtemp",lf:e+"_temp.xlf",stdout:e+"_stdout",stderr:e+"_stderr",ppmDir:function(){var e=PPx.Extract("%'temp'%\\ppm");return PPx.Execute("*makedir "+e),e}}},isEmptyStr=function(e){return""===e},c=PPx.CreateObject("Scripting.FileSystemObject"),o={TypeToCode:{crlf:"\r\n",cr:"\r",lf:"\n"},CodeToType:{"\r\n":"crlf","\r":"cr","\n":"lf"},Ppx:{lf:"%%bl",cr:"%%br",crlf:"%%bn",unix:"%%bl",mac:"%%br",dos:"%%bn","\n":"%%bl","\r":"%%br","\r\n":"%%bn"},Ascii:{lf:"10",cr:"13",crlf:"-1",unix:"10",mac:"13",dos:"-1","\n":"10","\r":"13","\r\n":"-1"}},expandNlCode=function(e){var t="\n",r=e.indexOf("\r");return~r&&(t="\r\n"===e.substring(r,r+2)?"\r\n":"\r"),t},isCV8=function(){return"ClearScriptV8"===PPx.ScriptEngineName},_exec=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},read=function(e){var t=e.path,r=e.enc,n=void 0===r?"utf8":r;if(!c.FileExists(t))return[!0,t+" not found"];var u=c.GetFile(t);if(0===u.Size)return[!0,t+" has no data"];var i=!1,a="";if("utf8"===n){var o=PPx.CreateObject("ADODB.Stream"),s=_exec(o,(function(){return o.Open(),o.Charset="UTF-8",o.LoadFromFile(t),o.ReadText(-1)}));i=s[0],a=s[1]}else{var l="utf16le"===n?-1:0,p=u.OpenAsTextStream(1,l),x=_exec(p,(function(){return p.ReadAll()}));i=x[0],a=x[1]}return i?[!0,"Unable to read "+t]:[!1,a]},readLines=function(e){var t,r=e.path,n=e.enc,u=void 0===n?"utf8":n,i=e.linefeed,a=read({path:r,enc:u}),c=a[0],o=a[1];if(c)return[!0,o];i=null!=(t=i)?t:expandNlCode(o.slice(0,1e3));var s=o.split(i);return isEmptyStr(s[s.length-1])&&s.pop(),[!1,{lines:s,nl:i}]},writeLines=function(e){var t=e.path,r=e.data,n=e.enc,i=void 0===n?"utf8":n,a=e.append,s=void 0!==a&&a,l=e.overwrite,p=void 0!==l&&l,x=e.linefeed,g=void 0===x?u.nlcode:x;if(!p&&!s&&c.FileExists(t))return[!0,t+" already exists"];var P,d=c.GetParentFolderName(t);if(c.FolderExists(d)||PPx.Execute("*makedir "+d),"utf8"===i){if(isCV8()){var m=r.join(g),v=s?"AppendAllText":"WriteAllText";return[!1,NETAPI.System.IO.File[v](t,m)]}var b=p||s?2:1,h=PPx.CreateObject("ADODB.Stream");P=_exec(h,(function(){h.Open(),h.Charset="UTF-8",h.LineSeparator=Number(o.Ascii[g]),s?(h.LoadFromFile(t),h.Position=h.Size,h.SetEOS):h.Position=0,h.WriteText(r.join(g),1),h.SaveToFile(t,b)}))[0]}else{var y=s?8:p?2:1;c.FileExists(t)||PPx.Execute("%Osq *makefile "+t);var E="utf16le"===i?-1:0,O=c.GetFile(t).OpenAsTextStream(y,E);P=_exec(O,(function(){O.Write(r.join(g)+g)}))[0]}return P?[!0,"Could not write to "+t]:[!1,""]},parseSource=function(e,t){var r=JSON.parse(t.replace(/\\/g,"\\\\"));return r.path="remote"===r.location?PPx.Extract("%*getcust(S_ppm#global:home)")+"\\repo\\"+e:r.path,_extends({name:e},r)},expandSource=function(e){var t=PPx.Extract("%*getcust(S_ppm#sources:"+e+")");return isEmptyStr(t)?undefined:parseSource(e,t)},sourceNames=function(){for(var e=PPx.Extract("%*getcust(S_ppm#sources)").split(u.nlcode),t=[],r=1,n=e.length-2;r<n;r++)t.push(e[r].split(/\t/)[0]);return t};PPx.Extract('%sgu"ppmcache"');var s=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,rejectInvalidString=function(e,t){if(0===t.indexOf("@")){if(t=PPx.Extract(t).substring(1),!c.FileExists(t))return 2}else if(!e.test(t))return 13;return 0},dialog=function(e,t,r){return void 0===t&&(t=""),t=isEmptyStr(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+r+'"')},runPPmTest=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},hasTargetId=function(e){return"."!==e},l={lang:u.language},createCache=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return l[e]=t,t},autoselectEnter=function(e){return PPx.Execute("%OC *setcust "+a.tempKey+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+a.tempKey+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),"*mapkey use,"+a.tempKey+"%%:"+e},p={echo:function(e,t,r){var n=r?"("+String(r)+")":"";return dialog("I",""+e,""+t+n)},question:function(e,t){return dialog("Q",""+e,t)},choice:function(e,t,r,n,u,i,a){void 0===n&&(n="ynC");var c="Mes0411",o={yes:c+":IMYE",no:c+":IMNO",cancel:c+":IMTC"},s="."===e,l=s?'%K"@LOADCUST"':'%%K"@LOADCUST"',x=[],g=x[0],P=x[1],d=x[2],m="",v="",b="",h=!1;u&&(g=PPx.Extract("%*getcust("+o.yes+")"),m="*setcust "+o.yes+"="+u+"%:",h=!0),i&&(P=PPx.Extract("%*getcust("+o.no+")"),v="*setcust "+o.no+"="+i+"%:",h=!0),a&&(d=PPx.Extract("%*getcust("+o.cancel+")"),b="*setcust "+o.cancel+"="+a+"%:",h=!0),h&&(PPx.Execute(""+m+v+b),p.execute(e,l));var y={0:"cancel",1:"yes",2:"no"},E=s?"":e,O=PPx.Extract("%OCP %*extract("+E+'"%%*choice(-text""'+r+'"" -title:""'+t+'"" -type:'+n+')")');return h&&(g&&PPx.Execute("*setcust "+o.yes+"="+g),P&&PPx.Execute("*setcust "+o.no+"="+P),d&&PPx.Execute("*setcust "+o.cancel+"= "+d),p.execute(e,l)),y[O]},execute:function(e,t,r){if(void 0===r&&(r=!1),isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if("tray"===e)return PPx.Execute("*pptray -c "+t);if(hasTargetId(e)){if(r){var n=PPx.Extract("%*extract("+e+',"'+t+'%%&0")');return isEmptyStr(n)?1:Number(n)}return PPx.Execute("*execute "+e+","+t)}if(r){var u=PPx.Extract(t+"%&0");return isEmptyStr(u)?1:Number(u)}return PPx.Execute(t)},execSync:function(e,t){if(isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return isEmptyStr(PPx.Extract("%N"+e))?6:Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(isEmptyStr(t))return[13,""];var r=hasTargetId(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),r]},lang:function(){var e=l.lang;if(!isEmptyStr(e))return e;var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return e="en"===t||"ja"===t?t:u.language,l.lang=e,e},global:function(e){var t,r,n=l[e];if(n)return n;if(/^ppm[ahrcl]?/.test(e)){if(n=PPx.Extract("%sgu'"+e+"'"),isEmptyStr(n)){var u=e.replace("ppm","");switch(u){case"":n=null!=(t=l.ppm)?t:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":n=null!=(r=l.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var a;n=(null!=(a=l.ppm)?a:createCache("ppm"))+"\\dist\\lib";break;default:var c,o=null!=(c=l.home)?c:createCache("home");"cache"===u&&(n=o+"\\"+i.cacheDir())}}}else n=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return l[e]=n,n},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return isEmptyStr(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,r){void 0===r&&(r="");var n=rejectInvalidString(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==n)return[n,""];if(isEmptyStr(t))return[1,""];var u=isEmptyStr(r)?"":',"'+r+'"',i=PPx.Extract("%*name("+e+',"'+t+'"'+u+")");return[n=Number(PPx.Extract()),i]},getcust:function(e){if(isEmptyStr(e))return[1,""];var t=rejectInvalidString(s,e);return 0!==t?[t,""]:[t,PPx.Extract("%*getcust("+e+")")]},setcust:function(e,t){if(void 0===t&&(t=!1),isEmptyStr(e))return 1;var r=rejectInvalidString(s,e);if(0!==r)return r;var n=t?"%OC ":"";return PPx.Execute(n+"*setcust "+e)},deletecust:function(e,t,r){var n="boolean"==typeof t,u=/^\s*"?([^"\s]+)"?\s*?$/,i=e.replace(u,"$1"),a=String(t),c=rejectInvalidString(s,i);if(0!==c)return c;var o=null==t||n||isEmptyStr(a)?'"'+i+'"':i+","+("string"==typeof t?'"'+t.replace(u,"$1")+'"':""+t);return PPx.Execute("*deletecust "+o),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,r,n){if(void 0===r&&(r=!1),void 0===n&&(n=""),isEmptyStr(e))throw new Error("SubId not specified");isEmptyStr(n)||(n="*skip "+n+"%bn%bt",r=!0);var u=r?"%OC ":"";return PPx.Execute(u+"*setcust "+a.tempKey+":"+e+","+n+t),a.tempKey},deletemenu:function(){PPx.Execute('*deletecust "'+a.tempMenu+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+a.tempKey+'"')},linecust:function(e){var t=e.label,r=e.id,n=e.sep,u=void 0===n?"=":n,i=e.value,a=void 0===i?"":i,c=e.esc,o=void 0!==c&&c,s=e.once,l=void 0!==s&&s?"*linecust "+t+","+r+",%%:":"";!isEmptyStr(a)&&o&&(a="%("+a+"%)"),PPx.Execute("*linecust "+t+","+r+u+l+a)},getvalue:function(e,t,r){if(isEmptyStr(r))return[1,""];var n=hasTargetId(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+r+"'\")"):PPx.Extract("%s"+t+"'"+r+"'");return[isEmptyStr(n)?13:0,n]},setvalue:function(e,t,r,n){return isEmptyStr(r)?1:hasTargetId(e)?PPx.Execute("*execute "+e+",*string "+t+","+r+"="+n):PPx.Execute("*string "+t+","+r+"="+n)},getinput:function(e){var t=e.message,r=void 0===t?"":t,n=e.title,u=void 0===n?"":n,i=e.mode,a=void 0===i?"g":i,c=e.select,o=void 0===c?"a":c,s=e.multi,l=void 0!==s&&s,p=e.leavecancel,x=void 0!==p&&p,g=e.forpath,P=void 0!==g&&g,d=e.fordijit,m=void 0!==d&&d,v=e.autoselect,b=void 0!==v&&v,h=e.k,y=void 0===h?"":h,E=/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,O=l?" -multi":"",S=x?" -leavecancel":"",j=P?" -forpath":"",C=m?" -fordijit":"";b&&(y=autoselectEnter(y));var _=""!==y?" -k %%OP- "+y:"",N=rejectInvalidString(E,a);if(0!==N)return[N,""];var F=PPx.Extract('%OCP %*input("'+r+'" -title:"'+u+'" -mode:'+a+" -select:"+o+O+S+j+C+_+")");return N=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[N,F]},linemessage:function(e,t,r,n){var u,i="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var a=n?"%%bn":" ";u=t.join(a)}else u=t;e="."===e?"":e,u=r&&!i?'!"'+u:u,PPx.Execute("%OC *execute "+e+",*linemessage "+u)},report:function(e){var t="string"==typeof e?e:e.join(u.nlcode);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(t):PPx.report(t)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return p.execute(e,"*job start"),function(){return p.execute(e,"*job end")}},getVersion:function(e){var t=readLines({path:e+="\\package.json"}),r=t[0],n=t[1];if(!r)for(var u=/^\s*"version":\s*"([0-9\.]+)"\s*,/,i=2,a=n.lines.length;i<a;i++)if(~n.lines[i].indexOf('"version":'))return n.lines[i].replace(u,"$1")}},x={fg:{black:"30",red:"31",green:"32",yellow:"33",blue:"34",magenta:"35",cyan:"36",white:"37",def:"39"},bg:{black:"40",red:"41",green:"42",yellow:"43",blue:"44",magenta:"45",cyan:"46",white:"47",def:"49"}},getEscSeq=function(e){return e?"\\x1b[":"["},colorlize=function(e){var t=e.message,r=e.esc,n=void 0!==r&&r,u=e.fg,i=e.bg;if(isEmptyStr(t))return"";var a=getEscSeq(n);return!u||isEmptyStr(u)?""+t:""+(""+a+(i?x.bg[i]+";":"")+x.fg[u]+"m")+t+a+"49;39m"};String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/,"")}),String.prototype.precedes||(String.prototype.precedes=function(e){var t=this.indexOf(e);return~t?this.slice(0,t):this}),p.lang();var getProp=function(e){var t="@ppm!delim#",r=(/^'/.test(e)?e.replace(/^((?:'''|'[^']+')\s*)([=,])\s*(.*)$/,"$1"+t+"$2"+t+"$3"):e.replace(/^([^=,]+)([=,])\s*(.*)$/,"$1"+t+"$2"+t+"$3")).split(t);return{key:r[0].replace(/[\s\uFEFF\xA0]+$/,""),sep:r[1],value:r[2]}},g=0,main=function(){var e=sourceNames(),t=""+tmp().file,r=getUseIds(e),n=writeLines({path:t,data:r,overwrite:!0}),u=n[0],i=n[1];u?p.linemessage(".",i,!0):PPx.Execute("*script %sgu'ppm'\\dist\\ppmLogViewer.js,customize,"+g)},getData=function(e,t){for(var r=[""+colorlize({message:" "+e+" ",fg:"black",bg:"green"})],n=4,u=0;u<t.length;u++){var i=t[u],a=getProp(i),c=a.key,o=a.sep,s=a.value;"{"===s?r.push(""+colorlize({message:"["+c+"]",fg:"cyan"})):"}"===c||isEmptyStr(c)?r.push(""):0===c.indexOf("\t")?r.push(i):s&&(r.push(c+"\t"+o+" "+s),n=Math.max(n,c.length))}return isEmptyStr(r[r.length-1])||r.push(""),n=Math.min(32,4*(Math.floor(n/4)+1)),g=Math.max(g,n),r},getUseIds=function(e){for(var t=p.global("ppmcache")+"\\ppm\\setup",r=colorlize({message:" Read error ",fg:"red",bg:"black"}),n=[],i=0;i<e.length;i++){var a=e[i],c=expandSource(a);if(null!=c&&c.enable||a===u.ppmName){var o=readLines({path:t+"\\"+a+".cfg"}),s=o[0],l=o[1];s?n.push(r+" "+a):n.push.apply(n,getData(a,l.lines))}}return n};main();
