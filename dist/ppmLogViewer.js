﻿var t=PPx.CreateObject("Scripting.FileSystemObject"),e="jp",r="\r\n",n="P",u="_updateLog",c=function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")},i="K_ppmTemp",a="M_ppmTemp",s=function(t){return""===t},x=function(t,e){try{var r;return[!1,null!=(r=e())?r:""]}catch(n){return[!0,""]}finally{t.Close()}},o=function(e){var r=e.path,n=e.enc,u=function(e){var r=e.path,n=e.enc,u=void 0===n?"utf8":n;if(!t.FileExists(r))return[!0,r+" not found"];var c=t.GetFile(r);if(0===c.Size)return[!0,r+" has no data"];var i=!1,a="";if("utf8"===u){var s=PPx.CreateObject("ADODB.Stream"),o=x(s,(function(){return s.Open(),s.Charset="UTF-8",s.LoadFromFile(r),s.ReadText(-1)}));i=o[0],a=o[1]}else{var P="utf16le"===u?-1:0,p=c.OpenAsTextStream(1,P),l=x(p,(function(){return p.ReadAll()}));i=l[0],a=l[1]}return i?[!0,"Unable to read "+r]:[!1,a]}({path:r,enc:void 0===n?"utf8":n}),c=u[0],i=u[1];if(c)return[!0,i];var a=function(t){var e="\n",r=t.indexOf("\r");return~r&&(e="\r\n"==t.substring(r,r+2)?"\r\n":"\r"),e}(i.slice(0,1e3)),o="\r"!==a?/\r?\n/:a,P=i.split(o);return s(P[P.length-1])&&P.pop(),[!1,{lines:P,nl:a}]},P=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,p=function(e,r){if(0===r.indexOf("@")){if(r=PPx.Extract(r).substring(1),!t.FileExists(r))return 2}else if(!e.test(r))return 13;return 0},l=function(t,e,r){return void 0===e&&(e=""),e=s(e)?"":"/"+e,0===PPx.Execute('%"ppm'+e+'" %OC %'+t+'"'+r+'"')},f=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},E=function(t){return"."!==t},m={lang:e},v=function(t){var e=PPx.Extract("%*getcust(S_ppm#global:"+t+")");return m[t]=e,e},d={echo:function(t,e,r){var n=r?"("+String(r)+")":"";return l("I",""+t,""+e+n)},question:function(t,e){return l("Q",""+t,e)},choice:function(t,e,r,n,u,c,i){void 0===n&&(n="ynC");var a="Mes0411",s=a+":IMYE",x=a+":IMNO",o=a+":IMTC",P="."===t,p=P?'%K"@LOADCUST"':'%%K"@LOADCUST"',l=[],f=l[0],E=l[1],m=l[2],v="",g="",b="",h=!1;u&&(f=PPx.Extract("%*getcust("+s+")"),v="*setcust "+s+"="+u+"%:",h=!0),c&&(E=PPx.Extract("%*getcust("+x+")"),g="*setcust "+x+"="+c+"%:",h=!0),i&&(m=PPx.Extract("%*getcust("+o+")"),b="*setcust "+o+"="+i+"%:",h=!0),h&&(PPx.Execute(""+v+g+b),d.execute(t,p));var O=P?"":t,_=PPx.Extract("%OCP %*extract("+O+'"%%*choice(-text""'+r+'"" -title:""'+e+'"" -type:'+n+')")');return h&&(f&&PPx.Execute("*setcust "+s+"="+f),E&&PPx.Execute("*setcust "+x+"="+E),m&&PPx.Execute("*setcust "+o+"= "+m),d.execute(t,p)),{0:"cancel",1:"yes",2:"no"}[_]},execute:function(t,e,r){return void 0===r&&(r=!1),s(e)?1:f()?2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+t+",%("+e+"%)"):"tray"===t?PPx.Execute("*pptray -c "+e):E(t)?r?Number(PPx.Extract("%*extract("+t+',"'+e+'%%:0")')):PPx.Execute("*execute "+t+","+e):PPx.Execute(e)},execSync:function(t,e){if(s(e))return 1;if(f())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+t+",%("+e+"%)");if(1===t.length)t="b"+t;else if(0!==t.toUpperCase().indexOf("B"))return 6;return s(PPx.Extract("%N"+t))?6:Number(PPx.Extract("%*extract("+t.toUpperCase()+',"'+e+'%%:%%*exitcode")'))},extract:function(t,e){if(s(e))return[13,""];var r=E(t)?PPx.Extract("%*extract("+t+',"'+e+'")'):PPx.Extract(e);return[Number(PPx.Extract()),r]},lang:function(){var t=m.lang;if(!s(t))return t;var r=PPx.Extract("%*getcust(S_ppm#global:lang)");return t="en"===r||"jp"===r?r:e,m.lang=t,t},global:function(t){var e,r,n=m[t];if(n)return n;if(/^ppm[ahrcl]?/.test(t)){if(n=PPx.Extract("%sgu'"+t+"'"),s(n)){var u=t.replace("ppm","");switch(u){case"":n=null!=(e=m.ppm)?e:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":n=null!=(r=m.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var i;n=(null!=(i=m.ppm)?i:v("ppm"))+"\\dist\\lib";break;default:var a,x=null!=(a=m.home)?a:v("home");"cache"===u&&(n=x+"\\"+c())}}}else n=PPx.Extract("%*getcust(S_ppm#global:"+t+")");return m[t]=n,n},user:function(t){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+t+')")')},setuser:function(t,e){return s(e)?1:PPx.Execute("*setcust S_ppm#user:"+t+"="+e)},getpath:function(t,e,r){void 0===r&&(r="");var n=p(/^[CXTDHLKBNPRVSU]+$/,t);if(0!==n)return[n,""];if(s(e))return[1,""];var u=s(r)?"":',"'+r+'"',c=PPx.Extract("%*name("+t+',"'+e+'"'+u+")");return[n=Number(PPx.Extract()),c]},getcust:function(t){if(s(t))return[1,""];var e=p(P,t);return 0!==e?[e,""]:[e,PPx.Extract("%*getcust("+t+")")]},setcust:function(t,e){if(void 0===e&&(e=!1),s(t))return 1;var r=p(P,t);if(0!==r)return r;var n=e?"%OC ":"";return PPx.Execute(n+"*setcust "+t)},deletecust:function(t,e,r){var n="boolean"==typeof e,u=/^\s*"?([^"\s]+)"?\s*?$/,c=t.replace(u,"$1"),i=String(e),a=p(P,c);if(0!==a)return a;var x=null==e||n||s(i)?'"'+c+'"':c+","+("string"==typeof e?'"'+e.replace(u,"$1")+'"':""+e);return PPx.Execute("*deletecust "+x),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(t,e,r){if(void 0===r&&(r=!1),s(t))throw new Error("SubId is empty");var n=r?"%OC ":"";return PPx.Execute(n+"*setcust "+i+":"+t+","+e),i},deletemenu:function(){PPx.Execute('*deletecust "'+a+'"')},deletekeys:function(){PPx.Execute('*deletecust "'+i+'"')},linecust:function(t){var e=t.label,r=t.id,n=t.sep,u=void 0===n?"=":n,c=t.value,i=void 0===c?"":c,a=t.esc,x=void 0!==a&&a,o=t.once,P=void 0!==o&&o?"*linecust "+e+","+r+",%%:":"";!s(i)&&x&&(i="%("+i+"%)"),PPx.Execute("*linecust "+e+","+r+u+P+i)},getvalue:function(t,e,r){if(s(r))return[1,""];var n=E(t)?PPx.Extract("%*extract("+t+',"%%s'+e+"'"+r+"'\")"):PPx.Extract("%s"+e+"'"+r+"'");return[s(n)?13:0,n]},setvalue:function(t,e,r,n){return s(r)?1:E(t)?PPx.Execute("*execute "+t+",*string "+e+","+r+"="+n):PPx.Execute("*string "+e+","+r+"="+n)},getinput:function(t){var e,r=t.message,n=void 0===r?"":r,u=t.title,c=void 0===u?"":u,a=t.mode,s=void 0===a?"g":a,x=t.select,o=void 0===x?"a":x,P=t.multi,l=void 0!==P&&P,f=t.leavecancel,E=void 0!==f&&f,m=t.forpath,v=void 0!==m&&m,d=t.fordijit,g=void 0!==d&&d,b=t.autoselect,h=void 0!==b&&b,O=t.k,_=void 0===O?"":O,S=l?" -multi":"",C=E?" -leavecancel":"",N=v?" -forpath":"",y=g?" -fordijit":"";h&&(e=_,PPx.Execute("%OC *setcust "+i+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+i+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),_="*mapkey use,"+i+"%%:"+e);var j=""!==_?" -k %%OP- "+_:"",T=p(/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,s);if(0!==T)return[T,""];var k=PPx.Extract('%OCP %*input("'+n+'" -title:"'+c+'" -mode:'+s+" -select:"+o+S+C+N+y+j+")");return T=Number(PPx.Extract()),this.deletemenu(),this.deletekeys(),[T,k]},linemessage:function(t,e,r,n){var u,c="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof e){var i=n?"%%bn":" ";u=e.join(i)}else u=e;t="."===t?"":t,u=r&&!c?'!"'+u:u,PPx.Execute("%OC *execute "+t+",*linemessage "+u)},report:function(t){var e="string"==typeof t?t:t.join(r);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(e):PPx.report(e)},close:function(t){PPx.Execute("*closeppx "+t)},jobstart:function(t){return d.execute(t,"*job start"),function(){return d.execute(t,"*job end")}},getVersion:function(t){var e=o({path:t+="\\package.json"}),r=e[0],n=e[1];if(!function(t,e){return t&&"string"==typeof e}(r,n))for(var u=/^\s*"version":\s*"([0-9\.]+)"\s*,/,c=2,i=n.lines.length;c<i;c++)if(~n.lines[c].indexOf('"version":'))return n.lines[c].replace(u,"$1")}},g=function(){var t,e,r=PPx.ScriptName;return~r.indexOf("\\")?(t=r.replace(/^.*\\/,""),e=PPx.Extract("%*name(DKN,"+r+")")):(t=r,e=PPx.Extract("%FDN")),{scriptName:t,parentDir:e.replace(/\\$/,"")}}(),b=g.scriptName,h=g.parentDir,O={en:{notExist:"No data"},jp:{notExist:"ログはありません"}}[function(){var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===t||"jp"===t?t:e}()],_=function(t){void 0===t&&(t=PPx.Arguments);for(var e,r=["",32],n=0,u=t.length;n<u;n++)r[n]=t.Item(n);if(e=r[0],/update|customize/.test(e))return[r[0],r[1]]},S=function(){var t="XV_tmod";return"0"===d.getcust(t)[1]?(d.setcust(t+"=1"),function(){return d.setcust(t+"=0")}):function(){}};!function(){var e=_();e||(PPx.Execute('*script "'+h+'\\errors.js",arg,'+b),PPx.Quit(-1));var r,c={update:{path:d.global("ppmcache")+"\\ppm\\"+u,opts:""},customize:{path:(r=PPx.Extract('%*extract(C,"%%*temp()")'),{dir:r,file:r+"_ppmtemp",lf:r+"_temp.xlf",stdout:r+"_stdout",stderr:r+"_stderr",ppmDir:function(){var t=PPx.Extract("%'temp'%\\ppm");return PPx.Execute("*makedir "+t),t}}).file,opts:"-tab:"+e[1]}}[e[0]];t.FileExists(c.path)||(d.linemessage(".",O.notExist,!0),PPx.Quit(-1));var i=d.setkey("ENTER",'*script %%sgu"ppm"\\dist\\viewerAction.js'),a="ppmLogViewer",s="KV_main:CLOSEEVENT";d.linecust({label:a,id:s,sep:",",esc:!0,value:"*ifmatch V"+n+",%n%:*linecust "+a+","+s+',%:*deletecust "'+i+'"'});var x=S();PPx.Execute("*ppv -r -bootid:"+n+" -utf8 -esc:on -history:off "+c.opts+" "+c.path+" -k *mapkey use,"+i),x()}();
