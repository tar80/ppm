﻿var e=PPx.CreateObject("Scripting.FileSystemObject"),validArgs=function(){for(var e=[],t=PPx.Arguments;!t.atEnd();t.moveNext())e.push(t.value);return e},safeArgs=function(){for(var e=[],t=validArgs(),r=0,n=arguments.length;r<n;r++)e.push(_valueConverter(r<0||arguments.length<=r?undefined:arguments[r],t[r]));return e},_valueConverter=function(e,t){if(null==t||""===t)return null!=e?e:undefined;switch(typeof e){case"number":var r=Number(t);return Number.isNaN(r)?e:r;case"boolean":return null!=t&&"false"!==t&&"0"!==t;default:return t}},pathSelf=function(){var e,t,r=PPx.ScriptName;return~r.indexOf("\\")?(e=extractFileName(r),t=PPx.Extract("%*name(DKN,"+r+")")):(e=r,t=PPx.Extract("%FDN")),{scriptName:e,parentDir:t.replace(/\\$/,"")}},extractFileName=function(e,t){return void 0===t&&(t="\\"),"\\"!==t&&"/"!==t&&(t="\\"),e.slice(e.lastIndexOf(t)+1)},main=function(){var e=safeArgs(PPx.Extract("%FD"),"both","",0),t=e[0],r=e[1],n=e[2],u=e[3],a=r.toLowerCase();if(!isSearchSpec(a)){var i=pathSelf(),o=i.scriptName,f=i.parentDir;PPx.Execute('*script "'+f+'\\errors.js",arg,'+o),PPx.Quit(-1)}return getEntries(t,a,n.toLowerCase(),u).join(",")},isSearchSpec=function(e){return"both"===e||"file"===e||"dir"===e},getEntries=function(t,r,n,u){var extractEntries=function(t,r){for(var a=PPx.Enumerator(t);!a.atEnd();a.moveNext()){if(u>0&&i.length>=u)return;~a.Item().Name.toLowerCase().indexOf(n)&&i.push(e.BuildPath(r,a.Item().Name))}},a=function detectItem(n){void 0===n&&(n="");var a=e.GetFolder(e.BuildPath(t,n)),o=a.SubFolders;if("file"!==r&&extractEntries(o,n),"dir"!==r&&extractEntries(a.Files,n),u>0){if(i.length>=u)return;for(var f=0;f<o.length;f++){var c=o[f];detectItem(e.BuildPath(n,c.Name))}}},i=[];return a(),i};PPx.result=main();
