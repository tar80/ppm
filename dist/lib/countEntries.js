﻿const t=PPx.CreateObject("Scripting.FileSystemObject"),e=(()=>{let r=0;return({path:i,attribute:n,limit:u})=>{if(u<=r)return r;const l=t.GetFolder(i),o=l.SubFolders;"file"!==n&&(r+=o.Count),"dir"!==n&&(r+=l.Files.Count);for(const t of o)e({path:t,attribute:n,limit:u});return r}})(),r=((t=PPx.Arguments)=>{const e=["","both","0"];for(let r=0,i=t.length;r<i;r++)e[r]=t.Item(r);return{path:e[0],attribute:e[1],limit:Number(e[2])}})();PPx.result=e(r);