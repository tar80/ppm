﻿Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var r;if(null==this)throw new TypeError('Array.indexOf: "this" is null or not defined');var n=Object(this),i=n.length>>>0;if(0===i)return-1;var u=null!=t?t:0;if(Math.abs(u)===Infinity&&(u=0),u>=i)return-1;for(r=Math.max(u>=0?u:i-Math.abs(u),0);r<i;){if(r in n&&n[r]===e)return r;r++}return-1});var e="jp",t="\r\n",r="K_ppmTemp",n=function(){return"cache\\"+PPx.Extract("%0").slice(3).replace(/\\/g,"@")},i=function(e){return""===e},u=PPx.CreateObject("Scripting.FileSystemObject"),c=/^([ABCEFHKMPSVX][BCEVTt]?_|_[CPSUWo]|Mes)/,a=function(e,t){if(0===t.indexOf("@")){if(t=PPx.Extract(t).substring(1),!u.FileExists(t))return 2}else if(!e.test(t))return 13;return 0},s=function(e,t,r){return void 0===t&&(t=""),t=i(t)?"":"/"+t,0===PPx.Execute('%"ppm'+t+'" %OC %'+e+'"'+r+'"')},o=function(){return"undefined"!=typeof ppm_test_run&&ppm_test_run<=2},x=function(e){return"."!==e},p={lang:e},l=function(e){var t=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return p[e]=t,t},P="K_ppmTemp",f={echo:function(e,t,r){var n=r?"("+String(r)+")":"";return s("I",""+e,""+t+n)},question:function(e,t){return s("Q",""+e,t)},choice:function(e,t,r,n,i,u,c){void 0===n&&(n="ynC");var a="Mes0411",s=a+":IMYE",o=a+":IMNO",x=a+":IMTC",p="."===e,l=p?'%K"@LOADCUST"':'%%K"@LOADCUST"',P=[],d=P[0],m=P[1],v=P[2],g="",E="",b="",h=!1;i&&(d=PPx.Extract("%*getcust("+s+")"),g="*setcust "+s+"="+i+"%:",h=!0),u&&(m=PPx.Extract("%*getcust("+o+")"),E="*setcust "+o+"="+u+"%:",h=!0),c&&(v=PPx.Extract("%*getcust("+x+")"),b="*setcust "+x+"="+c+"%:",h=!0),h&&(PPx.Execute(""+g+E+b),f.execute(e,l));var O=p?"":e,S=PPx.Extract("%OCP %*extract("+O+'"%%*choice(-text""'+r+'"" -title:""'+t+'"" -type:'+n+')")');return h&&(d&&PPx.Execute("*setcust "+s+"="+d),m&&PPx.Execute("*setcust "+o+"="+m),v&&PPx.Execute("*setcust "+x+"= "+v),f.execute(e,l)),{0:"cancel",1:"yes",2:"no"}[S]},execute:function(e,t){return i(t)?1:o()?2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)"):"tray"===e?PPx.Execute("*pptray -c "+t):x(e)?PPx.Execute("*execute "+e+","+t):PPx.Execute(t)},execSync:function(e,t){if(i(t))return 1;if(o())return 2===ppm_test_run&&PPx.Execute("*execute B,*linemessage %%bx1b[2F[Execute] "+e+",%("+t+"%)");if(1===e.length)e="b"+e;else if(0!==e.toUpperCase().indexOf("B"))return 6;return Number(PPx.Extract("%*extract("+e.toUpperCase()+',"'+t+'%%:%%*exitcode")'))},extract:function(e,t){if(i(t))return[13,""];var r=x(e)?PPx.Extract("%*extract("+e+',"'+t+'")'):PPx.Extract(t);return[Number(PPx.Extract()),r]},lang:function(){var t=p.lang;if(!i(t))return t;var r=PPx.Extract("%*getcust(S_ppm#global:lang)");return t="en"===r||"jp"===r?r:e,p.lang=t,t},global:function(e){var t,r,u=p[e];if(u)return u;if(/^ppm[ahrcl]?/.test(e)){if(u=PPx.Extract("%sgu'"+e+"'"),i(u)){var c=e.replace("ppm","");switch(c){case"":u=null!=(t=p.ppm)?t:PPx.Extract("%*getcust(S_ppm#global:ppm)");break;case"home":u=null!=(r=p.home)?r:PPx.Extract("%*getcust(S_ppm#global:home)");break;case"lib":var a;u=(null!=(a=p.ppm)?a:l("ppm"))+"\\dist\\lib";break;default:var s,o=null!=(s=p.home)?s:l("home");"cache"===c&&(u=o+"\\"+n())}}}else u=PPx.Extract("%*getcust(S_ppm#global:"+e+")");return p[e]=u,u},user:function(e){return PPx.Extract('%*extract("%%*getcust(S_ppm#user:'+e+')")')},setuser:function(e,t){return i(t)?1:PPx.Execute("*setcust S_ppm#user:"+e+"="+t)},getpath:function(e,t,r){void 0===r&&(r="");var n=a(/^[CXTDHLKBNPRVSU]+$/,e);if(0!==n)return[n,""];if(i(t))return[1,""];var u=i(r)?"":',"'+r+'"',c=PPx.Extract("%*name("+e+',"'+t+'"'+u+")");return[n=Number(PPx.Extract()),c]},getcust:function(e){if(i(e))return[1,""];var t=a(c,e);if(0!==t)return[t,""];var r=PPx.Extract("%*getcust("+e+")");return[t=Number(PPx.Extract()),r]},setcust:function(e,t){if(void 0===t&&(t=!1),i(e))return 1;var r=a(c,e);if(0!==r)return r;var n=t?"%OC ":"";return PPx.Execute(n+"*setcust "+e)},deletecust:function(e,t,r){var n="boolean"==typeof t,u=/^\s*"?([^"\s]+)"?\s*?$/,s=e.replace(u,"$1"),o=String(t),x=a(c,s);if(0!==x)return x;var p=null==t||n||i(o)?'"'+s+'"':s+","+("string"==typeof t?'"'+t.replace(u,"$1")+'"':""+t);return PPx.Execute("*deletecust "+p),r&&PPx.Execute('%K"loadcust"'),0},setkey:function(e,t,n){if(void 0===n&&(n=!1),i(e))throw new Error("SubId is empty");var u=n?"%OC ":"";return PPx.Execute(u+"*setcust "+r+":"+e+","+t),r},deletekeys:function(){PPx.Execute('*deletecust "'+r+'"')},linecust:function(e){var t=e.label,r=e.id,n=e.sep,u=void 0===n?"=":n,c=e.value,a=void 0===c?"":c,s=e.esc,o=void 0!==s&&s,x=e.once,p=void 0!==x&&x?"*linecust "+t+","+r+",%%:":"";!i(a)&&o&&(a="%("+a+"%)"),PPx.Execute("*linecust "+t+","+r+u+p+a)},getvalue:function(e,t,r){if(i(r))return[1,""];var n=x(e)?PPx.Extract("%*extract("+e+',"%%s'+t+"'"+r+"'\")"):PPx.Extract("%s"+t+"'"+r+"'");return[i(n)?13:0,n]},setvalue:function(e,t,r,n){return i(r)?1:x(e)?PPx.Execute("*execute "+e+",*string "+t+","+r+"="+n):PPx.Execute("*string "+t+","+r+"="+n)},getinput:function(e){var t,r=e.message,n=void 0===r?"":r,i=e.title,u=void 0===i?"":i,c=e.mode,s=void 0===c?"g":c,o=e.select,x=void 0===o?"a":o,p=e.multi,l=void 0!==p&&p,f=e.leavecancel,d=void 0!==f&&f,m=e.forpath,v=void 0!==m&&m,g=e.fordijit,E=void 0!==g&&g,b=e.autoselect,h=void 0!==b&&b,O=e.k,S=void 0===O?"":O,C=l?" -multi":"",y=d?" -leavecancel":"",R=v?" -forpath":"",T=E?" -fordijit":"";h&&(t=S,PPx.Execute("%OC *setcust "+P+':ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),PPx.Execute("%OC *setcust "+P+':\\ENTER,*if -1==%%*sendmessage(%%N-L,392,0,0)%%:%%K"@DOWN"%bn%bt%%K"@ENTER"'),S="*mapkey use,"+P+"%%:"+t);var N=""!==S?" -k %%OP- "+S:"",j=a(/^[gnmshdcfuxeREOUX][gnmshdcfuxeSUX,]*$/,s);if(0!==j)return[j,""];var F=PPx.Extract('%OCP %*input("'+n+'" -title:"'+u+'" -mode:'+s+" -select:"+x+C+y+R+T+N+")");return j=Number(PPx.Extract()),h&&PPx.Execute('*deletecust "'+P+'"'),[j,F]},linemessage:function(e,t,r,n){var i,u="B"===PPx.Extract("%n").substring(0,1);if("object"==typeof t){var c=n?"%%bn":" ";i=t.join(c)}else i=t;e="."===e?"":e,i=r&&!u?'!"'+i:i,PPx.Execute("%OC *execute "+e+",*linemessage "+i)},report:function(e){var r="string"==typeof e?e:e.join(t);0===PPx.Extract("%n").indexOf("B")?PPx.linemessage(r):PPx.report(r)},close:function(e){PPx.Execute("*closeppx "+e)},jobstart:function(e){return f.execute(e,"*job start"),function(){return f.execute(e,"*job end")}}},d={TypeToCode:{crlf:"\r\n",cr:"\r",lf:"\n"},CodeToType:{"\r\n":"crlf","\r":"cr","\n":"lf"},Ppx:{lf:"%%bl",cr:"%%br",crlf:"%%bn",unix:"%%bl",mac:"%%br",dos:"%%bn","\n":"%%bl","\r":"%%br","\r\n":"%%bn"},Ascii:{lf:"10",cr:"13",crlf:"-1",unix:"10",mac:"13",dos:"-1","\n":"10","\r":"13","\r\n":"-1"}},m=function(e,t){try{var r;return[!1,null!=(r=t())?r:""]}catch(n){return[!0,""]}finally{e.Close()}},v=function(e){var t=e.path,r=e.enc,n=function(e){var t=e.path,r=e.enc,n=void 0===r?"utf8":r;if(!u.FileExists(t))return[!0,t+" not found"];var i=u.GetFile(t);if(0===i.Size)return[!0,t+" has no data"];var c=!1,a="";if("utf8"===n){var s=PPx.CreateObject("ADODB.Stream"),o=m(s,(function(){return s.Open(),s.Charset="UTF-8",s.LoadFromFile(t),s.ReadText(-1)}));c=o[0],a=o[1]}else{var x="utf16le"===n?-1:0,p=i.OpenAsTextStream(1,x),l=m(p,(function(){return p.ReadAll()}));c=l[0],a=l[1]}return c?[!0,"Unable to read "+t]:[!1,a]}({path:t,enc:void 0===r?"utf8":r}),c=n[0],a=n[1];if(c)return[!0,a];var s=function(e){var t="\n",r=e.indexOf("\r");return~r&&(t="\r\n"==e.substring(r,r+2)?"\r\n":"\r"),t}(a.slice(0,1e3)),o=a.split(s);return i(o[o.length-1])&&o.pop(),[!1,{lines:o,nl:s}]},g=function(e){var r=e.path,n=e.data,i=e.enc,c=void 0===i?"utf8":i,a=e.append,s=void 0!==a&&a,o=e.overwrite,x=void 0!==o&&o,p=e.linefeed,l=void 0===p?t:p;if(!x&&!s&&u.FileExists(r))return[!0,r+" already exists"];var P,f=u.GetParentFolderName(r);if(u.FolderExists(f)||PPx.Execute("*makedir "+f),"utf8"===c){if("ClearScriptV8"===PPx.ScriptEngineName){var v=n.join(l),g=s?"AppendAllText":"WriteAllText";return[!1,NETAPI.System.IO.File[g](r,v)]}var E=x||s?2:1,b=PPx.CreateObject("ADODB.Stream");P=m(b,(function(){b.Open(),b.Charset="UTF-8",b.LineSeparator=Number(d.Ascii[l]),s?(b.LoadFromFile(r),b.Position=b.Size,b.SetEOS):b.Position=0,b.WriteText(n.join(l),1),b.SaveToFile(r,E)}))[0]}else{var h=s?8:x?2:1,O="utf16le"===c?-1:0,S=u.GetFile(r).OpenAsTextStream(h,O);P=m(S,(function(){S.Write(n.join(l)+l)}))[0]}return P?[!0,"Could not write to "+r]:[!1,""]},E=";[ppm]",b=";[endppm]",h=function(){var e,t,r=PPx.ScriptName;return~r.indexOf("\\")?(e=r.replace(/^.*\\/,""),t=PPx.Extract("%*name(DKN,"+r+")")):(e=r,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}}(),O=h.scriptName,S=h.parentDir,C={en:{registered:"Registered *ppmRestore",notRegistered:"Not registered *ppmRestore",reg:"*ppmRestore registered",unreg:"*ppmRestore unregistered",failed:"*ppmRestore registration failed"},jp:{registered:"*ppmRestoreは登録済みです",notRegistered:"*ppmRestoreは未登録です",reg:"*ppmRestoreを登録しました",unreg:"*ppmRestoreを解除しました",failed:"*ppmRestoreの登録に失敗しました"}}[function(){var t=PPx.Extract("%*getcust(S_ppm#global:lang)");return"en"===t||"jp"===t?t:e}()],y={reset:function(e,t,r){for(var n=/^ppmRestore\s=\s\*script ".+\\restore\.js",".+/,i=f.global("ppmcache"),u=f.global("ppm"),c=!1,a=0,s=t.length-1;a<s;a++)if(n.test(t[a])){t[a]='ppmRestore = *script "'+S+'\\ppmRestore.js","'+i+'","'+u+'"',c=!0;break}return c?g({path:e,data:t,overwrite:!0,linefeed:r}):[!1,""]},set:function(e,t,r){if(~t.indexOf(E))return[!0,C.registered];var n=f.global("ppmcache"),i=f.global("ppm");return g({path:e,data:[E,"_Command = {",'ppmRestore = *script "'+S+'\\ppmRestore.js","'+n+'","'+i+'"',"}",b],append:!0,linefeed:r})},unset:function(e,t,r){var n,i=[];if(f.deletecust("_Command","ppmRestore"),!~t.indexOf(E))return[!0,C.notRegistered];for(var u=0,c=t.length-1;u<c;u++)if(~(n=t[u]).indexOf(E))for(u+=1;u<c&&!~(n=t[u]).indexOf(b);u++);else i.push(n);return g({path:e,data:i,overwrite:!0,linefeed:r})}};!function(){var e=0!==PPx.Arguments.length?PPx.Arguments.Item(0):"";/^(un|re)?set$/.test(e)||PPx.Execute("*script "+S+'\\lib\\errors.js",arg,'+O);var t=PPx.Extract("%0%\\PPXDEF.CFG"),r=v({path:t}),n=r[0],i=r[1];(function(e,t){return e&&"string"==typeof t})(n,i)&&(f.echo(O,i),PPx.Quit(-1));var u=i,c=u.lines,a=u.nl,s=y[e](t,c,a);n=s[0],i=s[1];var o=n?i:"unset"!==e?C.reg:C.unreg;f.linemessage(".",o,!0)}();