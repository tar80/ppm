﻿var validArgs=function(){for(var t=[],e=PPx.Arguments;!e.atEnd();e.moveNext())t.push(e.value);return t},t={actions:"S_ppm#actions",event:"S_ppm#event",global:"S_ppm#global",sources:"S_ppm#sources",staymode:"S_ppm#staymode",user:"S_ppm#user"},e={tempKey:"K_ppmTemp",tempMenu:"M_ppmTemp",lfDset:"ppm_lfdset",virtualEntry:"ppm_ve"},n={storeData:8e4,veHandler:80001,setsel:80002,stackPPb:80003},a=PPx.CreateObject("Scripting.FileSystemObject"),isEmptyStr=function(t){return""===t},capturePPv=function(t,e,n){!e&&PPx.Execute("*launch -nostartmsg -hide -wait:idle %0ppvw.exe -bootid:"+t),PPx.Execute("*capturewindow V"+t+" -pane:~ -selectnoactive%:*wait 0,2"),n&&PPx.Execute("*ppvoption sync "+t)};Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){var n;if(null==this)throw new Error('Array.indexOf: "this" is null or not defined');var a=Object(this),r=a.length>>>0;if(0===r)return-1;var i=null!=e?e:0;if(Math.abs(i)===Infinity&&(i=0),i>=r)return-1;for(n=Math.max(i>=0?i:r-Math.abs(i),0);n<r;){if(n in a&&a[n]===t)return n;n++}return-1});var ppx_Discard=function(t,e){var n;PPx.StayMode=0,e=null!=(n=e)?n:"","DEBUG"===t&&PPx.linemessage("[DEBUG] discard "+e)},r=["KC_main","KV_main","KV_img","KV_crt","KV_page","KB_edit","K_ppe","K_edit","K_lied"],_validTable=function(t){return~r.indexOf(t)?t:"KC_main"},_linecust=function(t,e,n){return"*linecust "+t+","+e+":"+n+","},_discard=function(t){return function(e){var n=e.table,a=e.label,r=e.mapkey,i=e.cond,p=void 0===i?"instantly":i,u=e.debug,c=void 0===u?"0":u,s=PPx.StayMode,o=PPx.Extract("%n"),x=(PPx.Extract("%FDV"),PPx.Extract('%*name(C,"%FDV")')),P=_validTable(n),d=_linecust(""+a+o,P,t),l=_linecust(""+a+o,P,"CLOSEEVENT"),m={instantly:"",once:'*if("'+o+'"=="%n")%:',hold:'*if("'+o+'"=="%n")&&("'+x+'"!="%*name(C,"%FDV")")%:'},v=[d,l];r&&(PPx.Execute("*mapkey use,"+r),v.push("*mapkey delete,"+r)),v.push('*js ":'+s+',ppx_Discard",'+c+","+a),PPx.Execute(d+"%(*if %*stayinfo("+s+")%:"+m[p]+v.join("%:")+"%)"),PPx.Execute(l+"%("+m.once+l+"%:"+d+"%)"),PPx.Execute('*run -breakjob -nostartmsg -wait:no %0pptrayw.exe -c %%K"@LOADCUST"')}},getStaymodeId=function(t){t=~t.indexOf(".")?t.slice(0,t.indexOf(".")):t;var e=Number(PPx.Extract("%*getcust(S_ppm#staymode:"+t+")"));return!isNaN(e)&&e>1e4&&e},i=(_discard("ACTIVEEVENT"),{hold:function(t,e){void 0===e&&(e="0");var n=PPx.StayMode;_setEvent("KC_main","LOADEVENT",t+"%n",'*script ":'+n+',ppx_Discard",'+e+","+t,"hold")},discard:_discard("LOADEVENT")}),_setEvent=function(t,e,n,a,r){var i="*linecust "+n+","+_validTable(t),p=i+":"+e+",",u={instantly:"",once:'*if("%n"=="%%n")',hold:'*if("%n"=="%%n")&&("%FDV"=="%%FDV")'}[r];PPx.Execute(i+":"+e+","+u+"%%:"+p+"%%:"+a),PPx.Execute('%K"@LOADCUST"')},waitMoment=function(t){for(var e=10;t()&&(PPx.Sleep(100),!(0>=--e)););},p=getStaymodeId("veHandler")||n.veHandler,u="restorePPv.js",c=e.virtualEntry,s=t.actions,o="@#_#@",cache={metadata:{},ppv:{}};PPx.StayMode=p;var main=function(){var t=validArgs(),e=t[0],n=t[1],a=t[2],r=t[3],p=t[4],u=t[5];"undefined"!==r&&(cache.metadata=convMetadata(e,n,a,r,p,u),i.discard({table:"KC_main",label:c,mapkey:p,cond:"hold"}))},ppx_resume=function(){},ppx_Action=function(t,e,n){var r=escapedCmdline(cache.metadata.ppm,t);isEmptyStr(r)&&PPx.Quit(1);var i,p="every"===cache.metadata.freq,u=p?function(t){var e=t.entry,n=t.isDup,a=replaceCmdline({cmdline:r,base:cache.metadata.base,dirtype:cache.metadata.dirtype,search:cache.metadata.search,isDup:n,entry:e});PPx.Execute("%OP- *execute ,%("+a+"%)")}:function(t){var e=t.entry;s.push(e.path)},c=blankHandle(e),s=[],x={},P=PPx.Entry;P.FirstMark;do{var d={att:P.Attributes,hl:P.Highlight,path:~P.Comment.indexOf(":")?P.Comment:cache.metadata.base+"\\"+P.Comment,sname:P.ShortName};a.FileExists(d.path)&&(~d.path.indexOf(" ")&&(d.path=c(d.path)),i=x[d.path]||"0",(n||"0"===i)&&(x[d.path]="1",u({entry:d,isDup:i})))}while(P.NextMark);if(!p){var l="dup:0"+o+"search:"+cache.metadata.search+o+"path:"+s.join(" "),m="^dup:(?<dup>0)"+o+"search:(?<search>.*)"+o+"path:(?<path>.+)$";PPx.Execute('%OP *execute ,%%OP- %*regexp("%('+l+'%)","%(/'+m+"/"+r+'/%)")')}},ppx_Syncview=function(t,e,n,a,r){var i="1"===e;if(cache.ppv.id)isEmptyStr(PPx.Extract("%N"+cache.ppv.id))||(PPx.Execute(_selectEvent("")),i?(PPx.Execute("*closeppx "+cache.ppv.id),cache.ppv={}):cache.ppv.id=undefined);else{if(cache.ppv.id=startPPv(t,n,a,r),isEmptyStr(cache.ppv.id))return void PPx.linemessage('!"could not get PPv ID');PPx.Execute(_selectEvent("*if %*stayinfo("+p+')&&("%n"=="%%n")&&("%FDV"=="%%FDV")%%:*js ":'+p+',ppx_SelectEvent",'+r)),PPx.Execute(_closeEvent(cache.ppv.id.slice(-1))),ppx_SelectEvent(r)}},ppx_SelectEvent=function(t){var e=PPx.Extract('%*name(DC,"%*comment")');if("1"===t){var n=PPx.Extract('%*name(SC,"%FSC")');"-"!==n&&(e!==PPx.Extract("%*extract("+cache.ppv.id+',"%%FDC")')&&(PPx.Execute("*execute "+cache.ppv.id+',%%J"'+e+'"'),waitMoment((function(){return PPx.Extract("%*extract("+cache.ppv.id+',"%%FDC")')!==e}))),PPx.Execute("*execute "+cache.ppv.id+",*jumpline "+n))}else PPx.Execute("*execute "+cache.ppv.id+',%%J"'+e+'"')},convMetadata=function(t,e,n,a,r,i){var conv=function(t){return"undefined"!==t?t:""};return{base:conv(t),dirtype:conv(e),search:conv(n),ppm:a,mapkey:conv(r),freq:conv(i)}},escapedCmdline=function(t,e){return(PPx.Extract("%*getcust("+s+":"+t+"_"+e+")")||PPx.Extract("%*getcust("+s+":all_"+e+")")).replace(/\//g,"\\/")},blankHandle=function(t){var e={enclose:function(t){return'"'+t+'"'},double:function(t){return'""'+t+'""'},escape:function(t){return t.replace(/\s/g,"\\ ")}},n=e[t];return null!=n?n:e.enclose},replaceCmdline=function(t){var e,n,a=t.cmdline,r=t.base,i=t.dirtype,p=t.search,u=t.isDup,c=t.entry,s=null!=(e=c.att)?e:"",x=c.hl?String(c.hl):"",P=null!=(n=c.sname)?n:"",d="base:"+r+o+"dirtype:"+i+o+"search:"+p+o+"dup:"+u+o+"path:"+c.path+o+"att:"+s+o+"hl:"+x+o+"option:"+P,l="base:(?<base>.*)"+o+"dirtype:(?<type>.*)"+o+"search:(?<search>.*)"+o+"dup:(?<dup>.+)"+o+"path:(?<path>.+)"+o+"att:(?<att>.*)"+o+"hl:(?<hl>.*)"+o+"option:(?<option>.*)";return PPx.Extract('%OP %*regexp("%('+d+'%)","%(/'+l+"/"+a+'/%)")')},_selectEvent=function(t){return"*linecust "+c+",KC_main:SELECTEVENT,"+t},_closeEvent=function(t){var e="*linecust "+c+",KV_main:CLOSEEVENT,",n=[];if(cache.ppv.lnum&&n.push("*setcust XV_lnum="+cache.ppv.lnum),cache.ppv.tmod&&n.push("*setcust XV_tmod="+cache.ppv.tmod),cache.ppv.xwin&&n.push("*setcust X_win:V="+cache.ppv.xwin),cache.ppv.winpos){var a="-nostartmsg -hide -noppb",r="*script "+("%sgu'ppmlib'\\"+u)+',"'+t+'","'+cache.ppv.winpos+'","DEBUG"';n.push("%Oq *launch "+a+" %0ppbw.exe -c "+r)}return e+'%(*if("V'+t+'"=="%n")%:'+e+"%:"+_selectEvent("")+"%:"+n.join("%:")+"%)"},startPPv=function(t,e,n,a){var r=!isEmptyStr(t),i=2===PPx.Pane.Count,p=["*focus %n","*topmostwindow %N,1"];"1"!==n||isEmptyStr(cache.metadata.search)||p.push('*find "'+cache.metadata.search+'"'),"1"===a&&(cache.ppv.lnum=PPx.Extract("%*getcust(XV_lnum)"),cache.ppv.tmod=PPx.Extract("%*getcust(XV_tmod)"),PPx.Execute("*setcust XV_lnum=1%:*setcust XV_tmod=1"));var u,c=[];if(r?(c.push("-bootid:"+t+" -r"),u="%:V"+t):u='%:%*extract(V,"%%n")',"0"!==e&&i){if(cache.ppv.winpos=PPx.Extract("%*getcust(_WinPos:V"+t+")"),"2"===e){cache.ppv.xwin=PPx.Extract("%*getcust(X_win:V)"),PPx.Execute("*setcust X_win:V=B1"+cache.ppv.xwin.slice(2));var s=PPx.Extract("*launch -nostartmsg -hide -wait:idle %0ppvw.exe "+c.join(" ")+u);return capturePPv(s.slice(-1),!0,!1),s}c.push("-popup:%~N")}return PPx.Extract("*launch -nostartmsg -wait:idle %0ppvw.exe "+c.join(" ")+" -k %("+p.join("%:")+"%)"+u)};main();
