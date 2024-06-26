﻿!function(){if("object"!=typeof JSON){JSON={};var e,t,n,r,u=/^[\],:{}\s]*$/,i=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,c=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,a=/(?:^|:|,)(?:\s*\[)+/g,o=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":"Invalid Date"}),"function"!=typeof JSON.stringify&&(n={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(n,u,i){var c;if(e="",t="","number"==typeof i)for(c=0;c<i;c+=1)t+=" ";else"string"==typeof i&&(t=i);if(r=u,u&&"function"!=typeof u&&("object"!=typeof u||"number"!=typeof u.length))throw new Error("JSON.stringify");return str("",{"":n})}),"function"!=typeof JSON.parse&&(JSON.parse=function(e,t){var n;function walk(e,n){var r,u,i=e[n];if(i&&"object"==typeof i)for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&((u=walk(i,r))!==undefined?i[r]=u:delete i[r]);return t.call(e,n,i)}if(e=String(e),s.lastIndex=0,s.test(e)&&(e=e.replace(s,(function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))),u.test(e.replace(i,"@").replace(c,"]").replace(a,"")))return n=Function("return ("+e+")")(),"function"==typeof t?walk({"":n},""):n;throw new Error("JSON.parse")})}function f(e){return e<10?"0"+e:e}function quote(e){return o.lastIndex=0,o.test(e)?'"'+e.replace(o,(function(e){var t=n[e];return"string"==typeof t?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}))+'"':'"'+e+'"'}function str(n,u){var i,c,a,o,s,l=e,p=u[n];switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(n)),"function"==typeof r&&(p=r.call(u,n,p)),typeof p){case"string":return quote(p);case"number":return isFinite(p)?String(p):"null";case"boolean":return String(p);case"object":if(!p)return"null";if(e+=t,s=[],"[object Array]"===Object.prototype.toString.apply(p)){for(o=p.length,i=0;i<o;i+=1)s[i]=str(String(i),p)||"null";return a=0===s.length?"[]":e?"[\n"+e+s.join(",\n"+e)+"\n"+l+"]":"["+s.join(",")+"]",e=l,a}if(r&&"object"==typeof r)for(o=r.length,i=0;i<o;i+=1)"string"==typeof r[i]&&(a=str(c=String(r[i]),p))&&s.push(quote(c)+(e?": ":":")+a);else for(c in p)Object.prototype.hasOwnProperty.call(p,c)&&(a=str(c,p))&&s.push(quote(c)+(e?": ":":")+a);return a=0===s.length?"{}":e?"{\n"+e+s.join(",\n"+e)+"\n"+l+"}":"{"+s.join(",")+"}",e=l,a}return"null"}}();var valueEscape=function(e){return e.replace(/["\\]/g,(function(e){return{'"':'\\"',"\\":"\\\\"}[e]}))},argParse=function(){var e=PPx.Arguments.length>0&&PPx.Argument(0).replace(/['\\]/g,(function(e){return{"'":'"',"\\":"\\\\"}[e]}));return e&&parseString(e)},parseString=function(e){if(!~e.indexOf("{")||!~e.lastIndexOf("}"))return!1;for(var t,n,r=e.slice(1,-1).split(","),u=/^("[a-z]+"):\s*(.+)$/,i="@#delim#@",c=0,a=r.length;c<a&&null!=r[c];c++){var o=r[c].replace(u,"$1"+i+"$2").split(i);t=o[0],0===(n=o[1]).indexOf('"')&&(n='"'+valueEscape(n.slice(1,-1))+'"'),r[c]=t+":"+n}return"{"+r.join(",")+"}"},e=PPx.CreateObject("Scripting.FileSystemObject"),isEmptyStr=function(e){return""===e},t={ppmName:"ppx-plugin-manager",ppmVersion:.95,language:"ja",encode:"utf16le",nlcode:"\r\n",nltype:"crlf",ppmID:"P",ppmSubID:"Q"},n={initialCfg:"_initial.cfg",globalCfg:"_global.cfg",nopluginCfg:"_noplugin.cfg",pluginList:"_pluginlist",manageFiles:"_managefiles",updateLog:"_updateLog",repoDir:"repo",archDir:"arch",cacheDir:function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")}},r={tempKey:"K_ppmTemp",tempMenu:"M_ppmTemp",lfDset:"ppmlfdset"},expandNlCode=function(e){var t="\n",n=e.indexOf("\r");return~n&&(t="\r\n"==e.substring(n,n+2)?"\r\n":"\r"),t},exec=function(e,t){try{var n;return[!1,null!=(n=t())?n:""]}catch(r){return[!0,""]}finally{e.Close()}},read=function(t){var n=t.path,r=t.enc,u=void 0===r?"utf8":r;if(!e.FileExists(n))return[!0,n+" not found"];var i=e.GetFile(n);if(0===i.Size)return[!0,n+" has no data"];var c=!1,a="";if("utf8"===u){var o=PPx.CreateObject("ADODB.Stream"),s=exec(o,(function(){return o.Open(),o.Charset="UTF-8",o.LoadFromFile(n),o.ReadText(-1)}));c=s[0],a=s[1]}else{var l="utf16le"===u?-1:0,p=i.OpenAsTextStream(1,l),x=exec(p,(function(){return p.ReadAll()}));c=x[0],a=x[1]}return c?[!0,"Unable to read "+n]:[!1,a]},readLines=function(e){var t,n=e.path,r=e.enc,u=void 0===r?"utf8":r,i=e.linefeed,c=read({path:n,enc:u}),a=c[0],o=c[1];if(a)return[!0,o];i=null!=(t=i)?t:expandNlCode(o.slice(0,1e3));var s=o.split(i);return isEmptyStr(s[s.length-1])&&s.pop(),[!1,{lines:s,nl:i}]},u=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,rejectInvalidString=function(t,n){if(0===n.indexOf("@")){if(n=PPx.Extract(n).substring(1),!e.FileExists(n))return 2}else if(!t.test(n))return 13;return 0},dialog=function(e,t,n){return void 0===t&&(t=""),t=isEmptyStr(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+n+'"')},runPPmTest=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},hasTargetId=function(e){return"."!==e},i={lang:t.language},createCache=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return i[e]=t,t},autoselectEnter=function(e){return PPx.Execute("%OC *setcust "+r.tempKey+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+r.tempKey+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),"*mapkey use,"+r.tempKey+"%%:"+e},c={echo:function(e,t,n){var r=n?"("+String(n)+")":"";return dialog("I",""+e,""+t+r)},question:function(e,t){return dialog("Q",""+e,t)},choice:function(e,t,n,r,u,i,a){void 0===r&&(r="ynC");var o="Mes0411",s={yes:o+":IMYE",no:o+":IMNO",cancel:o+":IMTC"},l="."===e,p=l?'%K"@LOADCUST"':'%%K"@LOADCUST"',x=[],P=x[0],g=x[1],d=x[2],m="",v="",E="",b=!1;u&&(P=PPx.Extract("%*getcust("+s.yes+")"),m="*setcust "+s.yes+"="+u+"%:",b=!0),i&&(g=PPx.Extract("%*getcust("+s.no+")"),v="*setcust "+s.no+"="+i+"%:",b=!0),a&&(d=PPx.Extract("%*getcust("+s.cancel+")"),E="*setcust "+s.cancel+"="+a+"%:",b=!0),b&&(PPx.Execute(""+m+v+E),c.execute(e,p));var h={0:"cancel",1:"yes",2:"no"},y=l?"":e,O=PPx.Extract("%OCP %*extract("+y+'"%%*choice(-text""'+n+'"" -title:""'+t+'"" -type:'+r+')")');return b&&(P&&PPx.Execute("*setcust "+s.yes+"="+P),g&&PPx.Execute("*setcust "+s.no+"="+g),d&&PPx.Execute("*setcust "+s.cancel+"= "+d),c.execute(e,p)),h[O]},execute:function(e,t,n){return void 0===n&&(n=!1),isEmptyStr(t)?1:runPPmTest()?2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)"):"tray"===e?PPx.Execute("*pptray -c "+t):hasTargetId(e)?n?Number(PPx.Extract("%*extract("+e+',"'+t+'%%:0")')):PPx.Execute("*execute "+e+","+t):PPx.Execute(t)},execSync:function(e,t){if(isEmptyStr(t))return 1;if(runPPmTest())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return isEmptyStr(PPx.Extract("%N"+e))?6:Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(isEmptyStr(t))return[13,""];var n=hasTargetId(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),n]},lang:function(){var e=i.lang;if(!isEmptyStr(e))return e;var n=PPx.Extract("%*getcust(S_ppm#global:lang)");return e="en"===n||"ja"===n?n:t.language,i.lang=e,e},global:function(e){var t,r,u=i[e];if(u)return u;if(/^ppm[ahrcl]?/.test(e)){if(u=PPx.Extract("%sgu'"+e+"'"),isEmptyStr(u)){var c=e.replace("ppm","");switch(c){case"":u=null!=(t=i.ppm)?t:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":u=null!=(r=i.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var a;u=(null!=(a=i.ppm)?a:createCache("ppm"))+"\\dist\\lib";break;default:var o,s=null!=(o=i.home)?o:createCache("home");"cache"===c&&(u=s+"\\"+n.cacheDir())}}}else u=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return i[e]=u,u},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return isEmptyStr(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,n){void 0===n&&(n="");var r=rejectInvalidString(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==r)return[r,""];if(isEmptyStr(t))return[1,""];var u=isEmptyStr(n)?"":',"'+n+'"',i=PPx.Extract("%*name("+e+',"'+t+'"'+u+")");return[r=Number(PPx.Extract()),i]},getcust:function(e){if(isEmptyStr(e))return[1,""];var t=rejectInvalidString(u,e);return 0!==t?[t,""]:[t,PPx.Extract("%*getcust("+e+")")]},setcust:function(e,t){if(void 0===t&&(t=!1),isEmptyStr(e))return 1;var n=rejectInvalidString(u,e);if(0!==n)return n;var r=t?"%OC ":"";return PPx.Execute(r+"*setcust "+e)},deletecust:function(e,t,n){var r="boolean"==typeof t,i=/^\s*"?([^"\s]+)"?\s*?$/,c=e.replace(i,"$1"),a=String(t),o=rejectInvalidString(u,c);if(0!==o)return o;var s=null==t||r||isEmptyStr(a)?'"'+c+'"':c+","+("string"==typeof t?'"'+t.replace(i,"$1")+'"':""+t);return PPx.Execute("*deletecust "+s),n&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,n,u){if(void 0===n&&(n=!1),void 0===u&&(u=""),isEmptyStr(e))throw new Error("SubId not specified");isEmptyStr(u)||(u="*skip "+u+"%bn%bt",n=!0);var i=n?"%OC ":"";return PPx.Execute(i+"*setcust "+r.tempKey+":"+e+","+u+t),r.tempKey},deletemenu:function(){PPx.Execute('*deletecust "'+r.tempMenu+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+r.tempKey+'"')},linecust:function(e){var t=e.label,n=e.id,r=e.sep,u=void 0===r?"=":r,i=e.value,c=void 0===i?"":i,a=e.esc,o=void 0!==a&&a,s=e.once,l=void 0!==s&&s?"*linecust "+t+","+n+",%%:":"";!isEmptyStr(c)&&o&&(c="%("+c+"%)"),PPx.Execute("*linecust "+t+","+n+u+l+c)},getvalue:function(e,t,n){if(isEmptyStr(n))return[1,""];var r=hasTargetId(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+n+"'\")"):PPx.Extract("%s"+t+"'"+n+"'");return[isEmptyStr(r)?13:0,r]},setvalue:function(e,t,n,r){return isEmptyStr(n)?1:hasTargetId(e)?PPx.Execute("*execute "+e+",*string "+t+","+n+"="+r):PPx.Execute("*string "+t+","+n+"="+r)},getinput:function(e){var t=e.message,n=void 0===t?"":t,r=e.title,u=void 0===r?"":r,i=e.mode,c=void 0===i?"g":i,a=e.select,o=void 0===a?"a":a,s=e.multi,l=void 0!==s&&s,p=e.leavecancel,x=void 0!==p&&p,P=e.forpath,g=void 0!==P&&P,d=e.fordijit,m=void 0!==d&&d,v=e.autoselect,E=void 0!==v&&v,b=e.k,h=void 0===b?"":b,y=/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,O=l?" -multi":"",S=x?" -leavecancel":"",N=g?" -forpath":"",j=m?" -fordijit":"";E&&(h=autoselectEnter(h));var C=""!==h?" -k %%OP- "+h:"",_=rejectInvalidString(y,c);if(0!==_)return[_,""];var T=PPx.Extract('%OCP %*input("'+n+'" -title:"'+u+'" -mode:'+c+" -select:"+o+O+S+N+j+C+")");return _=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[_,T]},linemessage:function(e,t,n,r){var u,i="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var c=r?"%%bn":" ";u=t.join(c)}else u=t;e="."===e?"":e,u=n&&!i?'!"'+u:u,PPx.Execute("%OC *execute "+e+",*linemessage "+u)},report:function(e){var n="string"==typeof e?e:e.join(t.nlcode);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(n):PPx.report(n)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return c.execute(e,"*job start"),function(){return c.execute(e,"*job end")}},getVersion:function(e){var t=readLines({path:e+="\\package.json"}),n=t[0],r=t[1];if(!n)for(var u=/^\s*"version":\s*"([0-9\.]+)"\s*,/,i=2,c=r.lines.length;i<c;i++)if(~r.lines[i].indexOf('"version":'))return r.lines[i].replace(u,"$1")}},main=function(){var e=argParse();e||(PPx.Echo("[wrong argument]: invalid JSON format."),PPx.Quit(-1));var t=JSON.parse(e),n=inputOptions(t),r=postOptions(t),u=c.extract(".","%*input("+n+" "+r+")"),i=u[0],a=u[1];return c.deletemenu(),c.deletekeys(),0!==i?"[error]":a},a={text:"",title:"ppm/input.js",mode:"e",select:"a",k:"",forpath:!1,fordigit:!1,leavecancel:!1,multi:!1,autoselect:!1,list:"off",module:"off",match:"",detail:"",file:""},parseOptions=function(e,t,n){return function(r,u,i){var c,o=null!=(c=t[r])?c:a[r],s=u?'"':"";"string"==typeof o&&o.replace(/\\"/g,'""'),n?""!==o&&e.push("-"+r+":"+s+o+s):i?o&&e.push("-"+r):""!==o&&e.push("-"+r+":"+s+o+s)}},inputOptions=function(e){var t=[],n=parseOptions(t,e);return n("text",!0),n("title",!0),n("mode"),n("select"),n("forpath",!1,!0),n("fordigit",!1,!0),n("leavecancel",!1,!0),n("multi",!1,!0),t.join(" ")},postOptions=function(t){var n=["-k","*completelist"],r=parseOptions(n,t,!0);r("list"),r("module"),r("match"),r("detail",!0),t.file&&(e.FileExists(PPx.Extract(t.file))||(t.file="")),r("file",!0);var u=[n.join(" ")];if(t.autoselect){var i=c.setkey("ENTER",'*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"',!0);u.push("*mapkey use,"+i)}return t.k&&u.push(t.k),u.join("%%:")};PPx.result=main();
