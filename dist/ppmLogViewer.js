﻿var e=PPx.CreateObject("Scripting.FileSystemObject"),t="jp",r="\r\n",n="P",u="_updateLog",c=function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")},i="K_ppmTemp",a="M_ppmTemp",s=function(e){return""===e},x=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},o=function(t){var r,n,u,c,i=t.path,a=t.enc,o=void 0===a?"utf8":a,P=t.linefeed,p=function(t){var r=t.path,n=t.enc,u=void 0===n?"utf8":n;if(!e.FileExists(r))return[!0,r+" not found"];var c=e.GetFile(r);if(0===c.Size)return[!0,r+" has no data"];var i=!1,a="";if("utf8"===u){var s=PPx.CreateObject("ADODB.Stream"),o=x(s,(function(){return s.Open(),s.Charset="UTF-8",s.LoadFromFile(r),s.ReadText(-1)}));i=o[0],a=o[1]}else{var P="utf16le"===u?-1:0,p=c.OpenAsTextStream(1,P),l=x(p,(function(){return p.ReadAll()}));i=l[0],a=l[1]}return i?[!0,"Unable to read "+r]:[!1,a]}({path:i,enc:o}),l=p[0],f=p[1];if(l)return[!0,f];P=null!=(r=P)?r:(n=f.slice(0,1e3),u="\n",~(c=n.indexOf("\r"))&&(u="\r\n"==n.substring(c,c+2)?"\r\n":"\r"),u);var E=f.split(P);return s(E[E.length-1])&&E.pop(),[!1,{lines:E,nl:P}]},P=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,p=function(t,r){if(0===r.indexOf("@")){if(r=PPx.Extract(r).substring(1),!e.FileExists(r))return 2}else if(!t.test(r))return 13;return 0},l=function(e,t,r){return void 0===t&&(t=""),t=s(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+r+'"')},f=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},E=function(e){return"."!==e},v={lang:t},m=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return v[e]=t,t},d={echo:function(e,t,r){var n=r?"("+String(r)+")":"";return l("I",""+e,""+t+n)},question:function(e,t){return l("Q",""+e,t)},choice:function(e,t,r,n,u,c,i){void 0===n&&(n="ynC");var a="Mes0411",s=a+":IMYE",x=a+":IMNO",o=a+":IMTC",P="."===e,p=P?'%K"@LOADCUST"':'%%K"@LOADCUST"',l=[],f=l[0],E=l[1],v=l[2],m="",g="",b="",h=!1;u&&(f=PPx.Extract("%*getcust("+s+")"),m="*setcust "+s+"="+u+"%:",h=!0),c&&(E=PPx.Extract("%*getcust("+x+")"),g="*setcust "+x+"="+c+"%:",h=!0),i&&(v=PPx.Extract("%*getcust("+o+")"),b="*setcust "+o+"="+i+"%:",h=!0),h&&(PPx.Execute(""+m+g+b),d.execute(e,p));var O=P?"":e,_=PPx.Extract("%OCP %*extract("+O+'"%%*choice(-text""'+r+'"" -title:""'+t+'"" -type:'+n+')")');return h&&(f&&PPx.Execute("*setcust "+s+"="+f),E&&PPx.Execute("*setcust "+x+"="+E),v&&PPx.Execute("*setcust "+o+"= "+v),d.execute(e,p)),{0:"cancel",1:"yes",2:"no"}[_]},execute:function(e,t,r){return void 0===r&&(r=!1),s(t)?1:f()?2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)"):"tray"===e?PPx.Execute("*pptray -c "+t):E(e)?r?Number(PPx.Extract("%*extract("+e+',"'+t+'%%:0")')):PPx.Execute("*execute "+e+","+t):PPx.Execute(t)},execSync:function(e,t){if(s(t))return 1;if(f())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return s(PPx.Extract("%N"+e))?6:Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(s(t))return[13,""];var r=E(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),r]},lang:function(){var e=v.lang;if(!s(e))return e;var r=PPx.Extract("%*getcust(S_ppm#global:lang)");return e="en"===r||"jp"===r?r:t,v.lang=e,e},global:function(e){var t,r,n=v[e];if(n)return n;if(/^ppm[ahrcl]?/.test(e)){if(n=PPx.Extract("%sgu'"+e+"'"),s(n)){var u=e.replace("ppm","");switch(u){case"":n=null!=(t=v.ppm)?t:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":n=null!=(r=v.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var i;n=(null!=(i=v.ppm)?i:m("ppm"))+"\\dist\\lib";break;default:var a,x=null!=(a=v.home)?a:m("home");"cache"===u&&(n=x+"\\"+c())}}}else n=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return v[e]=n,n},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return s(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,r){void 0===r&&(r="");var n=p(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==n)return[n,""];if(s(t))return[1,""];var u=s(r)?"":',"'+r+'"',c=PPx.Extract("%*name("+e+',"'+t+'"'+u+")");return[n=Number(PPx.Extract()),c]},getcust:function(e){if(s(e))return[1,""];var t=p(P,e);return 0!==t?[t,""]:[t,PPx.Extract("%*getcust("+e+")")]},setcust:function(e,t){if(void 0===t&&(t=!1),s(e))return 1;var r=p(P,e);if(0!==r)return r;var n=t?"%OC ":"";return PPx.Execute(n+"*setcust "+e)},deletecust:function(e,t,r){var n="boolean"==typeof t,u=/^\s*"?([^"\s]+)"?\s*?$/,c=e.replace(u,"$1"),i=String(t),a=p(P,c);if(0!==a)return a;var x=null==t||n||s(i)?'"'+c+'"':c+","+("string"==typeof t?'"'+t.replace(u,"$1")+'"':""+t);return PPx.Execute("*deletecust "+x),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,r,n){if(void 0===r&&(r=!1),void 0===n&&(n=""),s(e))throw new Error("SubId not specified");s(n)||(n="*skip "+n+"%bn%bt",r=!0);var u=r?"%OC ":"";return PPx.Execute(u+"*setcust "+i+":"+e+","+n+t),i},deletemenu:function(){PPx.Execute('*deletecust "'+a+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+i+'"')},linecust:function(e){var t=e.label,r=e.id,n=e.sep,u=void 0===n?"=":n,c=e.value,i=void 0===c?"":c,a=e.esc,x=void 0!==a&&a,o=e.once,P=void 0!==o&&o?"*linecust "+t+","+r+",%%:":"";!s(i)&&x&&(i="%("+i+"%)"),PPx.Execute("*linecust "+t+","+r+u+P+i)},getvalue:function(e,t,r){if(s(r))return[1,""];var n=E(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+r+"'\")"):PPx.Extract("%s"+t+"'"+r+"'");return[s(n)?13:0,n]},setvalue:function(e,t,r,n){return s(r)?1:E(e)?PPx.Execute("*execute "+e+",*string "+t+","+r+"="+n):PPx.Execute("*string "+t+","+r+"="+n)},getinput:function(e){var t,r=e.message,n=void 0===r?"":r,u=e.title,c=void 0===u?"":u,a=e.mode,s=void 0===a?"g":a,x=e.select,o=void 0===x?"a":x,P=e.multi,l=void 0!==P&&P,f=e.leavecancel,E=void 0!==f&&f,v=e.forpath,m=void 0!==v&&v,d=e.fordijit,g=void 0!==d&&d,b=e.autoselect,h=void 0!==b&&b,O=e.k,_=void 0===O?"":O,S=l?" -multi":"",C=E?" -leavecancel":"",N=m?" -forpath":"",y=g?" -fordijit":"";h&&(t=_,PPx.Execute("%OC *setcust "+i+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+i+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),_="*mapkey use,"+i+"%%:"+t);var j=""!==_?" -k %%OP- "+_:"",T=p(/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,s);if(0!==T)return[T,""];var k=PPx.Extract('%OCP %*input("'+n+'" -title:"'+c+'" -mode:'+s+" -select:"+o+S+C+N+y+j+")");return T=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[T,k]},linemessage:function(e,t,r,n){var u,c="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var i=n?"%%bn":" ";u=t.join(i)}else u=t;e="."===e?"":e,u=r&&!c?'!"'+u:u,PPx.Execute("%OC *execute "+e+",*linemessage "+u)},report:function(e){var t="string"==typeof e?e:e.join(r);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(t):PPx.report(t)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return d.execute(e,"*job start"),function(){return d.execute(e,"*job end")}},getVersion:function(e){var t=o({path:e+="\\package.json"}),r=t[0],n=t[1];if(!function(e,t){return e&&"string"==typeof t}(r,n))for(var u=/^\s*"version":\s*"([0-9\.]+)"\s*,/,c=2,i=n.lines.length;c<i;c++)if(~n.lines[c].indexOf('"version":'))return n.lines[c].replace(u,"$1")}},g=function(){var e,t,r=PPx.ScriptName;return~r.indexOf("\\")?(e=r.replace(/^.*\\/,""),t=PPx.Extract("%*name(DKN,"+r+")")):(e=r,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}}(),b=g.scriptName,h=g.parentDir,O={en:{notExist:"No data"},jp:{notExist:"ログはありません"}}[function(){var e=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===e||"jp"===e?e:t}()],_=function(e){void 0===e&&(e=PPx.Arguments);for(var t,r=["",32],n=0,u=e.length;n<u;n++)r[n]=e.Item(n);if(t=r[0],/update|customize/.test(t))return[r[0],r[1]]},S=function(){var e="XV_tmod";return"0"===d.getcust(e)[1]?(d.setcust(e+"=1"),function(){return d.setcust(e+"=0")}):function(){}};!function(){var t=_();t||(PPx.Execute('*script "'+h+'\\errors.js",arg,'+b),PPx.Quit(-1));var r,c={update:{path:d.global("ppmcache")+"\\ppm\\"+u,opts:""},customize:{path:(r=PPx.Extract('%*extract(C,"%%*temp()")'),{dir:r,file:r+"_ppmtemp",lf:r+"_temp.xlf",stdout:r+"_stdout",stderr:r+"_stderr",ppmDir:function(){var e=PPx.Extract("%'temp'%\\ppm");return PPx.Execute("*makedir "+e),e}}).file,opts:"-tab:"+t[1]}}[t[0]];e.FileExists(c.path)||(d.linemessage(".",O.notExist,!0),PPx.Quit(-1));var i=d.setkey("ENTER",'*script %%sgu"ppm"\\dist\\viewerAction.js'),a="ppmLogViewer",s="KV_main:CLOSEEVENT";d.linecust({label:a,id:s,sep:",",esc:!0,value:"*ifmatch V"+n+",%n%:*linecust "+a+","+s+',%:*deletecust "'+i+'"'});var x=S();PPx.Execute("%Oi *ppv -r -bootid:"+n+" -utf8 -esc:on -history:off "+c.opts+" "+c.path+" -k *mapkey use,"+i),x()}();
