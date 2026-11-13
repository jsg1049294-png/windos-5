(function(global){
"use strict";
var cwd="/", vfs={}, termHist=[], termHi=-1;
function save(){try{localStorage.setItem("vpc_vfs",JSON.stringify(vfs));}catch(e){}}
function load(){
try{vfs=JSON.parse(localStorage.getItem("vpc_vfs")||"{}");}catch(e){vfs={};}
if(!vfs["/"]||vfs["/"].type!=="dir"){vfs={"/":{type:"dir",name:"/",children:{}}};seed();}
}
function seed(){
ensureDir("/Users");ensureDir("/Users/Alessio");ensureDir("/Users/Alessio/Desktop");
ensureDir("/Users/Alessio/Documents");ensureDir("/Users/Alessio/Downloads");
ensureDir("/tmp");ensureDir("/var/log");
writeFile("/Users/Alessio/Documents/readme.txt","Willkommen bei Windos 5 Terminal.\nTippe help.\n");
writeFile("/var/log/system.log","[boot] Windos 5\n[ok] fs ready\n");
save();
}
function norm(p){
if(!p||p===".")return cwd;
if(p==="~")return "/Users/Alessio";
if(p.indexOf("~/")===0)p="/Users/Alessio/"+p.slice(2);
if(p[0]!=="/")p=(cwd==="/"?"/":cwd+"/")+p;
var parts=p.split("/").filter(Boolean),out=[];
for(var i=0;i<parts.length;i++){if(parts[i]===".")continue;if(parts[i]==="..")out.pop();else out.push(parts[i]);}
return "/"+out.join("/");
}
function getNode(path){
path=norm(path);if(path==="/")return vfs["/"]||null;
var parts=path.split("/").filter(Boolean),n=vfs["/"];
for(var i=0;i<parts.length;i++){if(!n||n.type!=="dir"||!n.children||!n.children[parts[i]])return null;n=n.children[parts[i]];}
return n;
}
function parentPath(path){path=norm(path);if(path==="/")return null;var i=path.lastIndexOf("/");return i<=0?"/":path.slice(0,i);}
function baseName(path){path=norm(path);if(path==="/")return"/";return path.split("/").filter(Boolean).pop();}
function ensureDir(path){
path=norm(path);if(getNode(path))return getNode(path);
var parts=path.split("/").filter(Boolean),n=vfs["/"];
for(var i=0;i<parts.length;i++){
if(!n.children[parts[i]])n.children[parts[i]]={type:"dir",name:parts[i],children:{},mtime:Date.now()};
n=n.children[parts[i]];if(n.type!=="dir")return null;
}
return n;
}
function writeFile(path,content,meta){
path=norm(path);var par=parentPath(path),name=baseName(path);var p=ensureDir(par);if(!p)return false;
p.children[name]={type:"file",name:name,content:String(content==null?"":content),size:String(content||"").length,mtime:Date.now(),meta:meta||{}};
return true;
}
function listDir(path){var n=getNode(path);if(!n||n.type!=="dir")return null;return Object.keys(n.children||{}).sort().map(function(k){return n.children[k];});}
function rmPath(path,recursive){
path=norm(path);if(path==="/")return false;
var par=getNode(parentPath(path)),name=baseName(path);if(!par||!par.children[name])return false;
var node=par.children[name];
if(node.type==="dir"&&Object.keys(node.children||{}).length&&!recursive)return false;
delete par.children[name];return true;
}
function copyNode(node){return JSON.parse(JSON.stringify(node));}
function walk(path,fn){var n=getNode(path);if(!n)return;fn(path,n);if(n.type==="dir")Object.keys(n.children||{}).forEach(function(k){walk(norm(path+"/"+k),fn);});}
load();

global.W5FS={norm:norm,getNode:getNode,listDir:listDir,writeFile:writeFile,ensureDir:ensureDir,rmPath:rmPath,cwd:function(){return cwd;},setCwd:function(p){cwd=p;},save:save,baseName:baseName,parentPath:parentPath,copyNode:copyNode,walk:walk};

global.W5runTerminal=function(opts){
var $=opts.$, openApp=opts.openApp, apps=opts.apps, wins=opts.wins, procs=opts.procs, closeW=opts.closeW, toast=opts.toast, enableTyping=opts.enableTyping, proxy=opts.proxy;
return function terminalApp(c,wid){
c.innerHTML='<div class="term"><div class="term-o" id="'+wid+'_o">Windos 5 Shell v2 · help für Befehle · FS '+cwd+'\n\n</div><div class="term-r"><span style="color:#0f0;margin-right:6px" id="'+wid+'_ps">'+cwd+' $</span><input id="'+wid+'_i" autocomplete="off" spellcheck="false"></div></div>';
var o=$(wid+"_o"),i=$(wid+"_i"),ps=$(wid+"_ps");
function print(t){o.textContent+=t+(t&&t.slice(-1)==="\n"?"":"\n");o.scrollTop=1e9;}
function setPs(){ps.textContent=cwd+" $";}
function tokenize(s){var out=[],cur="",q=null;for(var i2=0;i2<s.length;i2++){var ch=s[i2];if(q){if(ch===q)q=null;else cur+=ch;}else if(ch==='"'||ch==="'")q=ch;else if(/\s/.test(ch)){if(cur){out.push(cur);cur="";}}else cur+=ch;}if(cur)out.push(cur);return out;}
async function execCmd(cmd,args){
switch(cmd){
case "help":case "?":return "DATEIEN: pwd cd ls cat head tail touch mkdir rm cp mv find grep tree du\nMASSEN: rename-all\nTEXT: echo write append wc sort uniq\nARCHIV: zip unzip backup restore\nSYSTEM: top ps kill free df neofetch uptime whoami\nPOWER: shutdown reboot sleep\nPKG: winget install|list|search · open <app>\nNET: ping curl wget ip traceroute netscan\nDEV: git status|log · eval <js>\nKI: ai <frage>\nclear history date apps";
case "clear":case "cls":o.textContent="";return "";
case "pwd":return cwd;
case "cd":{var t=args[0]?norm(args[0]):"/Users/Alessio";var n=getNode(t);if(!n||n.type!=="dir")return "cd: kein Verzeichnis";cwd=t;return "";}
case "ls":case "dir":{var p=args[0]?norm(args[0]):cwd;var long=args.indexOf("-l")>=0;var items=listDir(p);if(!items)return "ls: nicht gefunden";if(!items.length)return "(leer)";return items.map(function(it){if(long)return (it.type==="dir"?"d":"-")+" "+String(it.size||0).padStart(6)+" "+it.name+(it.type==="dir"?"/":"");return it.name+(it.type==="dir"?"/":"");}).join("\n");}
case "tree":{var p=args[0]?norm(args[0]):cwd,lines=[p];function walkT(path,pref){var items=listDir(path)||[];items.forEach(function(it,idx){var last=idx===items.length-1;lines.push(pref+(last?"└── ":"├── ")+it.name+(it.type==="dir"?"/":""));if(it.type==="dir")walkT(norm(path+"/"+it.name),pref+(last?"    ":"│   "));});}walkT(p,"");return lines.join("\n");}
case "cat":{if(!args[0])return "cat: Datei fehlt";var n=getNode(args[0]);if(!n||n.type!=="file")return "cat: keine Datei";return n.content||"";}
case "head":{var n=getNode(args[0]);if(!n||n.type!=="file")return "head: Fehler";return (n.content||"").split("\n").slice(0,10).join("\n");}
case "tail":{var n=getNode(args[0]);if(!n||n.type!=="file")return "tail: Fehler";var L=(n.content||"").split("\n");return L.slice(Math.max(0,L.length-10)).join("\n");}
case "touch":{if(!args[0])return "touch: Name fehlt";var n=getNode(args[0]);if(n&&n.type==="file"){n.mtime=Date.now();return "";}writeFile(args[0],"");return "ok";}
case "mkdir":{if(!args[0])return "mkdir: Name fehlt";ensureDir(args[0]);return "ok";}
case "rm":case "del":{var rec=args.indexOf("-r")>=0||args.indexOf("-rf")>=0;var paths=args.filter(function(a){return a[0]!=="-";});if(!paths.length)return "rm: Pfad fehlt";return paths.map(function(p){return rmPath(p,rec)?"gelöscht: "+norm(p):"rm: Fehler "+p;}).join("\n");}
case "cp":{if(args.length<2)return "cp: Quelle Ziel";var src=getNode(args[0]),dst=norm(args[1]);if(!src)return "cp: Quelle fehlt";var par=parentPath(dst),name=baseName(dst);ensureDir(par);getNode(par).children[name]=copyNode(src);getNode(par).children[name].name=name;return "ok";}
case "mv":{if(args.length<2)return "mv: Quelle Ziel";var srcP=norm(args[0]),dst=norm(args[1]);var src=getNode(srcP);if(!src)return "mv: Quelle fehlt";var par=parentPath(dst),name=baseName(dst);ensureDir(par);getNode(par).children[name]=copyNode(src);getNode(par).children[name].name=name;rmPath(srcP,true);return "ok";}
case "find":{var start=args[0]?norm(args[0]):cwd;var q=(args[1]||"").toLowerCase();var hits=[];walk(start,function(p,n){if(!q||p.toLowerCase().indexOf(q)>=0||(n.name&&n.name.toLowerCase().indexOf(q)>=0))hits.push(p+(n.type==="dir"?"/":""));});return hits.slice(0,200).join("\n")||"(keine)";}
case "grep":{if(args.length<2)return "grep: pattern datei";var n=getNode(args[1]);if(!n||n.type!=="file")return "grep: Datei fehlt";var re;try{re=new RegExp(args[0],"i");}catch(e){return "Muster ungültig";}return (n.content||"").split("\n").filter(function(l){return re.test(l);}).join("\n")||"(keine)";}
case "echo":return args.join(" ");
case "write":{if(args.length<2)return "write: datei text";writeFile(args[0],args.slice(1).join(" "));return "ok";}
case "append":{if(args.length<2)return "append: datei text";var n=getNode(args[0]);writeFile(args[0],(n&&n.type==="file"?n.content:"")+args.slice(1).join(" ")+"\n");return "ok";}
case "wc":{var n=getNode(args[0]);if(!n||n.type!=="file")return "wc: Datei fehlt";var t=n.content||"";return t.split("\n").length+" Zeilen, "+(t.trim()?t.trim().split(/\s+/).length:0)+" Wörter, "+t.length+" Zeichen";}
case "sort":{var n=getNode(args[0]);if(!n||n.type!=="file")return "sort: Fehler";return (n.content||"").split("\n").sort().join("\n");}
case "uniq":{var n=getNode(args[0]);if(!n||n.type!=="file")return "uniq: Fehler";var seen={},out=[];(n.content||"").split("\n").forEach(function(l){if(!seen[l]){seen[l]=1;out.push(l);}});return out.join("\n");}
case "rename-all":{if(args.length<3)return "rename-all: ordner alt neu";var dir=norm(args[0]),from=args[1],to=args[2],map={},c=0;(listDir(dir)||[]).forEach(function(it){if(it.name.indexOf(from)>=0)map[it.name]=it.name.split(from).join(to);});Object.keys(map).forEach(function(old){var node=getNode(dir).children[old];if(!node)return;delete getNode(dir).children[old];node.name=map[old];getNode(dir).children[map[old]]=node;c++;});return c+" umbenannt";}
case "du":{var p=args[0]?norm(args[0]):cwd,total=0;walk(p,function(path,n){if(n.type==="file")total+=(n.size||(n.content||"").length||0);});return total+" Bytes unter "+p;}
case "zip":{if(args.length<2)return "zip: archiv.zip dateien...";var data={};args.slice(1).forEach(function(f){var n=getNode(f);if(n&&n.type==="file")data[baseName(f)]=n.content;});writeFile(args[0],JSON.stringify({zip:true,files:data}),{zip:true});return "Archiv: "+norm(args[0]);}
case "unzip":{if(!args[0])return "unzip: archiv";var n=getNode(args[0]);if(!n||n.type!=="file")return "unzip: fehlt";try{var j=JSON.parse(n.content);if(!j.zip)return "kein Archiv";var dest=args[1]?norm(args[1]):cwd;ensureDir(dest);Object.keys(j.files||{}).forEach(function(k){writeFile(dest+"/"+k,j.files[k]);});return "entpackt: "+dest;}catch(e){return "unzip: ungültig";}}
case "backup":{var blob=JSON.stringify({cwd:cwd,vfs:vfs,notes:localStorage.getItem("vpc_notes")||"",t:Date.now()});writeFile("/Users/Alessio/Documents/backup-"+Date.now()+".json",blob);try{localStorage.setItem("vpc_backup",blob);}catch(e){}return "Backup OK";}
case "restore":{try{var b=localStorage.getItem("vpc_backup");if(!b)return "kein Backup";var j=JSON.parse(b);if(j.vfs)vfs=j.vfs;if(j.cwd)cwd=j.cwd;return "wiederhergestellt";}catch(e){return "restore Fehler";}}
case "top":case "ps":{var lines=["PID   CPU%  MEM%  NAME"];Object.keys(procs||{}).forEach(function(k){var p=procs[k];lines.push(p.pid+"   "+p.cpu+"    "+p.mem+"   "+p.name);});return lines.join("\n");}
case "kill":{var pid=parseInt(args[0],10);if(!pid)return "kill: PID";var found=null;Object.keys(procs||{}).forEach(function(k){if(procs[k].pid===pid)found=k;});if(!found)return "kein Prozess";closeW(found);return "beendet "+pid;}
case "free":case "mem":{var used=0;try{used=JSON.stringify(localStorage).length;}catch(e){}return "RAM sim: "+(40+Math.random()*30|0)+"% · localStorage "+used+" B";}
case "df":return "Filesystem  Used\nlocalStorage  "+((JSON.stringify(vfs).length/1024)|0)+"K";
case "neofetch":case "uname":return "OS: Windos 5 (Browser)\nHost: "+location.hostname+"\nShell: w5-sh\nUser: Alessio";
case "uptime":return "up "+((performance.now()/1000)|0)+"s";
case "whoami":return "Alessio";
case "hostname":return location.hostname||"windos5";
case "shutdown":print("Herunterfahren…");setTimeout(function(){document.body.innerHTML='<div style="background:#000;color:#aaa;height:100vh;display:flex;align-items:center;justify-content:center;font-family:monospace">System angehalten. Reload = Neustart.</div>';},400);return "";
case "reboot":print("Neustart…");setTimeout(function(){location.reload();},400);return "";
case "sleep":print("Ruhezustand 5s…");return new Promise(function(r){setTimeout(function(){print("aufgewacht");r("");},5000);});
case "diskutil":case "format":return "Nur virtuell. Partitionen: / /Users /tmp";
case "winget":{var sub=args[0]||"list";if(sub==="list")return (apps||[]).map(function(a){return a.id+"  "+a.name;}).join("\n");if(sub==="search")return (apps||[]).filter(function(a){return (a.id+a.name).toLowerCase().indexOf((args[1]||"").toLowerCase())>=0;}).map(function(a){return a.id;}).join("\n")||"nichts";if(sub==="install"){openApp(args[1]||"edge");return "gestartet (virtuell)";}return "winget install|list|search";}
case "open":if(!args[0])return "open <app>";openApp(args[0]);return "geöffnet "+args[0];
case "ping":{var host=args[0]||"example.com";print("PING "+host);try{var t0=performance.now();await fetch("https://"+host.replace(/^https?:\/\//,""),{mode:"no-cors"});return "~"+((performance.now()-t0)|0)+" ms";}catch(e){return "fehlgeschlagen: "+e.message;}}
case "curl":case "wget":{var url=args[0];if(!url)return cmd+" <url>";if(!/^https?:\/\//i.test(url))url="https://"+url;print(cmd+" "+url);try{var res=await fetch(url);var text=await res.text();if(cmd==="wget"){var fn=baseName(url.split("?")[0])||"download.txt";if(fn.length>40)fn="download.txt";writeFile(cwd+"/"+fn,text.slice(0,200000));return "gespeichert "+cwd+"/"+fn;}return text.slice(0,3000)+(text.length>3000?"\n…":"");}catch(e){return "Netz/CORS: "+e.message;}}
case "ip":return "Browser gibt lokale IP nicht frei. curl https://api.ipify.org";
case "traceroute":return "1 router · 2 isp · 3 "+(args[0]||"ziel");
case "netscan":return "sim: 192.168.1.1 Router · 192.168.1.2 dieses Gerät";
case "git":{var s=args[0]||"status";if(s==="status")return "On branch main · clean (virtuell)";if(s==="log")return "a1b2c3 Windos 5 init";return "git status|log";}
case "node":case "eval":{var code=args.join(" ");if(!code)return "eval <js>";try{return String((0,eval)(code));}catch(e){return "Error: "+e.message;}}
case "ai":{var q=args.join(" ");if(!q)return "ai <frage>";return "Lokal keine große KI. open chatgpt · Frage: "+q;}
case "history":return termHist.map(function(h,i){return (i+1)+"  "+h;}).join("\n");
case "date":return new Date().toString();
case "apps":return (apps||[]).map(function(a){return a.id;}).join(" ");
default:return cmd+": nicht gefunden · help";
}
}
async function runLine(line){
print(cwd+" $ "+line);if(!line.trim())return;termHist.push(line);termHi=termHist.length;
var parts=tokenize(line),cmd=parts[0],args=parts.slice(1);
try{var out=await execCmd(cmd,args);if(out!=null&&out!=="")print(String(out));}catch(e){print("Fehler: "+e.message);}
setPs();save();
}
i.onkeydown=function(e){e.stopPropagation();if(e.key==="Enter"){e.preventDefault();var line=i.value;i.value="";runLine(line);}else if(e.key==="ArrowUp"){e.preventDefault();if(termHi>0){termHi--;i.value=termHist[termHi]||"";}}else if(e.key==="ArrowDown"){e.preventDefault();if(termHi<termHist.length-1){termHi++;i.value=termHist[termHi]||"";}else{termHi=termHist.length;i.value="";}}};
enableTyping(c);setTimeout(function(){i.focus();},50);
};
};

})(window);
