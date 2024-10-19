﻿var t,e,n,i;Object.keys||(Object.keys=(t=Object.prototype.hasOwnProperty,e=!{toString:null}.propertyIsEnumerable("toString"),i=(n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(r){if("function"!=typeof r&&("object"!=typeof r||null==r))throw new Error("Object.keys: called on non-object");var a,c,p=[];for(a in r)t.call(r,a)&&p.push(a);if(e)for(c=0;c<i;c++)t.call(r,n[c])&&p.push(n[c]);return p}));var validArgs=function(){for(var t=[],e=PPx.Arguments;!e.atEnd();e.moveNext())t.push(e.value);return t},r={actions:"S_ppm#actions",event:"S_ppm#event",global:"S_ppm#global",sources:"S_ppm#sources",staymode:"S_ppm#staymode",user:"S_ppm#user"},a={storeData:8e4,veHandler:80001,setsel:80002,stackPPb:80003},isEmptyStr=function(t){return""===t},isZero=function(t){return null!=t&&("0"===t||0===t)},c=r.event,p={set:function(t,e){PPx.Execute("*setcust "+c+":"+t+"=%("+e+"%)")},unset:function(t){var e=PPx.Extract("%*getcust("+c+":"+t+")");!isEmptyStr(e)&&PPx.Execute("*deletecust "+c+":"+t)},"do":function(t){var e=PPx.Extract("%*getcust("+c+":"+t+")");!isEmptyStr(e)&&PPx.Execute(e)},once:function(t){var e=PPx.Extract("%*getcust("+c+":"+t+")");isEmptyStr(e)||(PPx.Execute(e),PPx.Execute("*deletecust "+c+":"+t))}},pathSelf=function(){var t,e,n=PPx.ScriptName;return~n.indexOf("\\")?(t=extractFileName(n),e=PPx.Extract("%*name(DKN,"+n+")")):(t=n,e=PPx.Extract("%FDN")),{scriptName:t,parentDir:e.replace(/\\$/,"")}},extractFileName=function(t,e){return void 0===e&&(e="\\"),"\\"!==e&&"/"!==e&&(e="\\"),t.slice(t.lastIndexOf(e)+1)};Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){var n;if(null==this)throw new Error('Array.indexOf: "this" is null or not defined');var i=Object(this),r=i.length>>>0;if(0===r)return-1;var a=null!=e?e:0;if(Math.abs(a)===Infinity&&(a=0),a>=r)return-1;for(n=Math.max(a>=0?a:r-Math.abs(a),0);n<r;){if(n in i&&i[n]===t)return n;n++}return-1});var ppx_Discard$1=function(t,e){var n;PPx.StayMode=0,e=null!=(n=e)?n:"","DEBUG"===t&&PPx.linemessage("[DEBUG] discard "+e)},s=["KC_main","KV_main","KV_img","KV_crt","KV_page","KB_edit","K_ppe","K_edit","K_lied"],_validTable=function(t){return~s.indexOf(t)?t:"KC_main"},_linecust=function(t,e,n){return"*linecust "+t+","+e+":"+n+","},_discard=function(t){return function(e){var n=e.table,i=e.label,r=e.mapkey,a=e.cond,c=void 0===a?"instantly":a,p=e.debug,s=void 0===p?"0":p,o=PPx.StayMode,u=PPx.Extract("%n"),P=PPx.Extract('%*name(C,"%FDV")'),x=_validTable(n),l=_linecust(""+i+u,x,t),f=_linecust(""+i+u,x,"CLOSEEVENT"),d={instantly:"",once:'*if("'+u+'"=="%n")%:',hold:'*if("'+u+'"=="%n")&&("'+P+'"!="%*name(C,"%FDV")")%:'},E=[l,f];r&&(PPx.Execute("*mapkey use,"+r),E.push("*mapkey delete,"+r)),E.push('*js ":'+o+',ppx_Discard",'+s+","+i),PPx.Execute(l+"%(*if %*stayinfo("+o+")%:"+d[c]+E.join("%:")+"%)"),PPx.Execute(f+"%("+d.once+f+"%:"+l+"%)"),PPx.Execute('*launch -breakjob -nostartmsg -wait:no %0pptrayw.exe -c %%K"@LOADCUST"')}},getStaymodeId=function(t){t=~t.indexOf(".")?t.slice(0,t.indexOf(".")):t;var e=Number(PPx.Extract("%*getcust(S_ppm#staymode:"+t+")"));return!isNaN(e)&&e>1e4&&e},o=(_discard("ACTIVEEVENT"),_discard("LOADEVENT"),function(t,e,n,i,r){var a="*linecust "+n+","+_validTable(t),c=a+":"+e+",",p={instantly:"",once:'*if("%n"=="%%n")',hold:'*if("%n"=="%%n")&&("%FDV"=="%%FDV")'}[r];PPx.Execute(a+":"+e+","+p+"%%:"+c+"%%:"+i),PPx.Execute('%K"@LOADCUST"')}),u=getStaymodeId("stackPPb")||a.stackPPb,P="ppm_stackppb",x="DoneStackPPb",l={J:0,K:1,L:2,M:3,N:4},f=400,d=10,E=30,b=50,h="SE",S={STANDBY:"READY",INITIAL:"STARTING",ACTIVE:"ACTIVATE"},cache={dispWidth:Number(PPx.Extract("%*getcust(S_ppm#global:disp_width)")),dispHeight:Number(PPx.Extract("%*getcust(S_ppm#global:disp_height)"))-b,ppbWidth:f,ppbHeight:0,ppbState:{J:S.STANDBY,K:S.STANDBY,L:S.STANDBY,M:S.STANDBY,N:S.STANDBY},enableIds:Object.keys(l),instances:0,ppcid:PPx.Extract("%n"),finish:!1,stack:[]};if(isZero(cache.dispWidth)||isZero(cache.dispHeight)){var m=pathSelf().scriptName;PPx.Echo("[ERROR] "+m+" S_ppm#global:disp_width & disp_height needs to be set."),PPx.Quit(-1)}var main=function(){var t=validArgs(),e=t[0],n=t[1],i=t[2];cache.ppbWidth=setPPbWidth(e),cache.ppbHeight=Math.floor(cache.dispHeight/5),cache.direction=getDirection(n),PPx.StayMode=u,PPx.Execute("*linecust "+P+",KB_edit:CLOSEEVENT,*execute "+cache.ppcid+",%(*if 0%%*stayinfo("+u+')%%:*js ":'+u+',ppx_Completion",%n%)'),ppx_resume(e,n,i)},ppx_resume=function(t,e,n){if(!cache.finish)if(null!=t){if(!(cache.instances>=E)){cache.instances++;for(var i=0,r=cache.enableIds;i<r.length;i++){var a=r[i];if(isEmptyStr(PPx.Extract("%NB"+a))&&cache.ppbState[a]!==S.INITIAL)return cache.ppbState[a]=S.INITIAL,void stackPPb(cache.ppcid,a,cache.direction,n)}cache.stack.push(n)}}else cache.stack=[]},ppx_Activate=function(t){cache.ppbState[t]=S.ACTIVE},ppx_Completion=function(t){var e=t.slice(1);if(cache.ppbState[e]=S.STANDBY,cache.instances--,0!==cache.instances||cache.finish){if(cache.stack.length>0){var n=cache.stack.splice(0,1)[0];n&&(cache.ppbState[e]=S.INITIAL,stackPPb(cache.ppcid,e,cache.direction,n))}}else ppx_Discard()},ppx_Discard=function(){cache.finish=!0;for(var t=0,e=cache.enableIds;t<e.length;t++){var n=e[t];PPx.Execute("*deletecust _WinPos:B"+n)}PPx.Execute("*linecust "+P+",KB_edit:CLOSEEVENT,"),p.once(x),PPx.StayMode=0},setPPbWidth=function(t){var e=Number(t);return isNaN(e)?f:e},getDirection=function(t){return/^(NW|NE|SW|SE|MIN)$/i.test(t)?t.toUpperCase():h},g={NW:function(t){return[0,cache.ppbHeight*t]},NE:function(t){return[cache.dispWidth-cache.ppbWidth-d,cache.ppbHeight*t]},SW:function(t){return[0,cache.ppbHeight*(4-t)]},SE:function(t){return[cache.dispWidth-cache.ppbWidth-d,cache.ppbHeight*(4-t)]}},stackPPb=function(t,e,n,i){var r=l[e],a=["-breakjob","-noppb","-nostartmsg","-wait:no"],c="-bootid:"+e+" -q",p="*execute "+t+',*js ":'+u+',ppx_Activate",'+e,s="*closeppx B"+e,o="*linemessage %("+i+"%)",P="";if("MIN"!==n){var x=g[n](r);P="*windowsize %N,"+cache.ppbWidth+","+cache.ppbHeight,PPx.Execute("*setcust _WinPos:B"+e+"="+x.join(",")+","+cache.ppbWidth+","+cache.ppbHeight+",0"),a.push("-noactive")}else a.push("-min");PPx.Execute("*maxlength 3000%:%OP *run "+a.join(" ")+" %0ppbw.exe "+c+" -k %("+P+"%:"+p+"%:"+o+"%:"+i+"%:"+s+"%)")};PPx.result="DONE:"+x,main();
