(function(){
"use strict";
var PW="heyduhacker123";
var CDN="https://cdn.jsdelivr.net/gh/jsg1049294-png/spiele-for-loading@main/index.json";
var apps=[
{id:"google",name:"Google",icon:"🔍"},{id:"edge",name:"Microsoft Edge",icon:"🌊"},
{id:"youtube",name:"YouTube",icon:"▶️"},{id:"games",name:"Spiele",icon:"🕹️"},
{id:"roblox",name:"Roblox",icon:"🎮"},{id:"files",name:"Dateien",icon:"📁"},
{id:"terminal",name:"Terminal",icon:"⬛"},{id:"notes",name:"Notizen",icon:"📝"},
{id:"calculator",name:"Rechner",icon:"🔢"},{id:"paint",name:"Paint",icon:"🎨"},
{id:"settings",name:"Einstellungen",icon:"⚙️"}
];
var wins=new Map(),z=100,focused=null,vfs={},catalog=null;
try{vfs=JSON.parse(localStorage.getItem("vpc_vfs")||"{}");}catch(e){}
function $(id){return document.getElementById(id);}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
function toast(t,b,i){var el=document.createElement("div");el.className="toast";el.textContent=(i||"")+" "+t+": "+b;document.body.appendChild(el);setTimeout(function(){el.remove();},2800);}
function saveVfs(){try{localStorage.setItem("vpc_vfs",JSON.stringify(vfs));}catch(e){}}
function proxy(u){return "https://translate.google.com/translate?hl=de&sl=auto&tl=de&u="+encodeURIComponent(u);}

async function boot(){
var bios=$("bios"),lines=["Windos 5","","CPU OK","RAM OK","Edge OK","Spiele-CDN OK",""];
for(var i=0;i<lines.length;i++){bios.textContent+=lines[i]+"\n";await sleep(30);}
bios.classList.add("hidden");
var b=$("boot");b.classList.remove("hidden");
var steps=[["System",40],["Apps",70],["Fertig",100]];
for(var j=0;j<steps.length;j++){$("loadmsg").textContent="Lade "+steps[j][0]+"…";$("bar").style.width=steps[j][1]+"%";await sleep(120);}
b.classList.add("fade");await sleep(200);b.classList.add("hidden");
}
function login(){return new Promise(function(res){var ls=$("login");ls.classList.remove("hidden");$("lf").onsubmit=function(e){e.preventDefault();var v=$("lp").value;if(v===PW||v===""){ls.classList.add("hidden");$("desk").classList.remove("hidden");res();}else $("le").textContent="Falsches Passwort";};setTimeout(function(){$("lp").focus();},60);});}

function desktop(){
var icons=[{id:"google",name:"Google",icon:"🔍"},{id:"edge",name:"Edge",icon:"🌊"},{id:"youtube",name:"YouTube",icon:"▶️"},{id:"games",name:"Spiele",icon:"🕹️"},{id:"roblox",name:"Roblox",icon:"🎮"},{id:"files",name:"Dateien",icon:"📁"},{id:"paint",name:"Paint",icon:"🎨"},{id:"notes",name:"Notizen",icon:"📝"},{id:"calculator",name:"Rechner",icon:"🔢"},{id:"terminal",name:"Terminal",icon:"⬛"}];
var cont=$("icons");
icons.forEach(function(ic){
var el=document.createElement("div");el.className="icon";
el.innerHTML='<div class="ii">'+ic.icon+'</div><div class="il">'+ic.name+"</div>";
var t=0;function open(){openApp(ic.id);}
el.onclick=function(e){e.stopPropagation();var n=Date.now();if(n-t<400){open();t=0;}else if(el.classList.contains("on"))open();else{document.querySelectorAll(".icon").forEach(function(x){x.classList.remove("on");});el.classList.add("on");t=n;}};
el.ondblclick=open;cont.appendChild(el);
});
apps.forEach(function(a){var el=document.createElement("div");el.className="si";el.innerHTML='<span style="font-size:20px">'+a.icon+"</span><span>"+a.name+"</span>";el.onclick=function(){openApp(a.id);$("start").classList.add("hidden");};$("alist").appendChild(el);});
$("sbtn").onclick=function(){$("start").classList.toggle("hidden");};
$("desk").onclick=function(e){if(e.target.id==="desk"||e.target.classList.contains("wp"))$("start").classList.add("hidden");};
}

function openApp(id,extra){
var app=apps.find(function(a){return a.id===id;})||{id:id,name:id,icon:"📦"};
var wid="w"+Date.now();
var sizes={google:[860,580],edge:[860,580],youtube:[820,560],games:[640,520],roblox:[560,420],game:[400,480],files:[440,340],paint:[500,420],terminal:[460,300]};
var sz=sizes[id]||[400,300];
var win=document.createElement("div");win.className="win focus";win.id=wid;
win.style.cssText="left:"+(24+wins.size*12)+"px;top:"+(18+wins.size*12)+"px;width:"+sz[0]+"px;height:"+sz[1]+"px;z-index:"+(++z);
var title=(extra&&extra.title)||app.name;var icon=(extra&&extra.icon)||app.icon;
win.innerHTML='<div class="wt"><span style="margin-right:6px">'+icon+'</span><span class="t">'+title+'</span><div class="wc"><button class="wb" data-a="min">─</button><button class="wb" data-a="max">□</button><button class="wb x" data-a="close">✕</button></div></div><div class="wbody" id="'+wid+'_c"></div>';
$("wins").appendChild(win);wins.set(wid,{el:win,id:wid,appId:id,max:false,min:false});
win.querySelectorAll(".wb").forEach(function(btn){function f(e){e.preventDefault();e.stopPropagation();var a=btn.getAttribute("data-a");if(a==="close")closeW(wid);else if(a==="min")minW(wid);else if(a==="max")maxW(wid);}btn.onclick=f;btn.ontouchend=function(e){e.preventDefault();f(e);};});
win.onmousedown=function(){focusW(wid);};drag(win,wid);render(id,$(wid+"_c"),wid,extra);focusW(wid);taskbar();
}

function render(id,c,wid,extra){
if(id==="calculator"){
c.innerHTML='<div class="calc"><div class="d" id="'+wid+'_d">0</div>'+["C","÷","×","⌫","7","8","9","-","4","5","6","+","1","2","3","=","0","."].map(function(x){return '<button data-k="'+x+'">'+x+"</button>";}).join("")+"</div>";
var cur="0",op=null,prev=null,d=$(wid+"_d");
c.querySelectorAll("button").forEach(function(b){b.onclick=function(){var k=b.getAttribute("data-k");if((k>="0"&&k<="9")||k==="."){cur=cur==="0"&&k!=="."?k:cur+k;d.textContent=cur;}else if(k==="C"){cur="0";op=null;prev=null;d.textContent=cur;}else if(k==="⌫"){cur=cur.slice(0,-1)||"0";d.textContent=cur;}else if(k==="="){if(op&&prev!==null){var a=parseFloat(prev),b2=parseFloat(cur);var m={"+":a+b2,"-":a-b2,"×":a*b2,"÷":b2?a/b2:0};cur=String(Math.round(m[op]*1e8)/1e8);d.textContent=cur;op=null;prev=null;}}else{prev=cur;op=k;cur="0";}};});
}else if(id==="notes"){c.innerHTML='<textarea class="notes" id="'+wid+'_ta"></textarea>';var ta=$(wid+"_ta");ta.value=localStorage.getItem("vpc_notes")||"";ta.oninput=function(){localStorage.setItem("vpc_notes",ta.value);};}
else if(id==="terminal"){c.innerHTML='<div class="term"><div class="term-o" id="'+wid+'_o">Windos 5\nhelp · games · edge\n\n</div><div class="term-r"><span style="color:#0f0;margin-right:6px">></span><input id="'+wid+'_i"></div></div>';var o=$(wid+"_o"),i=$(wid+"_i");i.onkeydown=function(e){if(e.key!=="Enter")return;var cmd=i.value.trim();i.value="";o.textContent+="> "+cmd+"\n";if(cmd==="help")o.textContent+="help, clear, games, google, edge, youtube\n";else if(cmd==="clear")o.textContent="";else if(cmd==="games")openApp("games");else if(cmd==="google")openApp("google");else if(cmd==="edge")openApp("edge");else if(cmd==="youtube")openApp("youtube");else if(cmd)o.textContent+="?\n";o.scrollTop=1e9;};setTimeout(function(){i.focus();},40);}
else if(id==="google")browserApp(c,wid,"google");
else if(id==="edge")browserApp(c,wid,"edge");
else if(id==="youtube")youtubeApp(c,wid);
else if(id==="games")gamesFolder(c,wid);
else if(id==="game")playGame(c,wid,extra);
else if(id==="roblox")robloxApp(c,wid);
else if(id==="files")filesApp(c,wid);
else if(id==="paint")paintApp(c,wid);
else if(id==="settings")c.innerHTML='<div style="padding:16px"><h2>Einstellungen</h2><p style="opacity:.7;margin-top:8px">Windos 5 · Google + Edge · YouTube · 1000 Spiele (CDN)</p></div>';
}

function browserApp(c,wid,brand){
var isEdge=brand==="edge";
var accent=isEdge?"#0078d4":"#4285f4";
var title=isEdge?"Microsoft Edge":"Google";
c.innerHTML='<div class="gwrap"><div class="gbar" style="background:'+(isEdge?"#f3f3f3":"#f8f9fa")+'"><button type="button" id="'+wid+'_h">⌂</button><input id="'+wid+'_q" placeholder="Suchen oder URL (poki.com)…"><button type="button" id="'+wid+'_go" class="btn btn-p" style="padding:6px 12px;background:'+accent+'">Los</button><button type="button" id="'+wid+'_px">🛡</button></div><div class="gpane" id="'+wid+'_p"></div></div>';
var pane=$(wid+"_p"),inp=$(wid+"_q"),useProxy=true;
function home(){
pane.innerHTML='<div class="ghome" style="background:'+(isEdge?"#e8e8e8":"#fff")+'"><div class="glogo"'+(isEdge?' style="background:linear-gradient(90deg,#0078d4,#00bcf2);-webkit-background-clip:text;-webkit-text-fill-color:transparent"':'')+'>'+title+'</div><form id="'+wid+'_f"><input id="'+wid+'_q2" placeholder="Suchen oder URL…"><button type="submit">Suchen</button></form><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px"><button type="button" data-u="https://www.poki.com">Poki</button><button type="button" data-u="https://example.com">Example</button><button type="button" data-u="https://en.wikipedia.org">Wikipedia</button><button type="button" data-u="https://duckduckgo.com">DuckDuckGo</button></div><p style="opacity:.5;font-size:12px;margin-top:8px;color:#333">Proxy an = Poki & co. laden besser</p></div>';
$(wid+"_f").onsubmit=function(e){e.preventDefault();go($(wid+"_q2").value);};
pane.querySelectorAll("[data-u]").forEach(function(b){b.onclick=function(){go(b.getAttribute("data-u"));};});
inp.value="";
}
function go(q){
q=(q||"").trim();if(!q)return home();
var u=q;
if(!/^https?:\/\//i.test(u)){if(u.indexOf(".")!==-1&&u.indexOf(" ")===-1)u="https://"+u;else u="https://www.google.com/search?igu=1&q="+encodeURIComponent(q);}
inp.value=u;show(u);
}
function show(u){
pane.innerHTML="";
var fr=document.createElement("iframe");
var src=useProxy?proxy(u):u;
if(/google\.com\/search/.test(u))src=u;
fr.src=src;fr.setAttribute("allow","fullscreen");fr.setAttribute("referrerpolicy","no-referrer");
fr.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:none;background:#fff";
pane.appendChild(fr);
setTimeout(function(){if(!pane.contains(fr))return;var tip=document.createElement("div");tip.style.cssText="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;z-index:5;display:flex;gap:8px";tip.innerHTML="<span>Leer?</span>";var b=document.createElement("button");b.className="btn btn-p";b.style.cssText="padding:4px 10px;font-size:12px";b.textContent=useProxy?"Direkt":"Proxy";b.onclick=function(){useProxy=!useProxy;$(wid+"_px").textContent=useProxy?"🛡":"🔓";show(u);};tip.appendChild(b);pane.appendChild(tip);setTimeout(function(){tip.remove();},5500);},3500);
}
$(wid+"_go").onclick=function(){go(inp.value);};
inp.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();go(inp.value);}};
$(wid+"_h").onclick=home;
$(wid+"_px").onclick=function(){useProxy=!useProxy;$(wid+"_px").textContent=useProxy?"🛡":"🔓";toast(title,"Proxy "+(useProxy?"an":"aus"),"🛡");};
home();
}

function youtubeApp(c,wid){
c.innerHTML='<div class="gwrap"><div class="gbar" style="background:#0f0f0f"><button type="button" id="'+wid+'_h" style="color:#fff">⌂</button><input id="'+wid+'_q" placeholder="YouTube suchen…" style="background:#121212;color:#fff;border-color:#333"><button type="button" id="'+wid+'_go" class="btn btn-p" style="padding:6px 12px;background:#f00">Suche</button></div><div class="gpane" id="'+wid+'_p" style="background:#0f0f0f"></div></div>';
var pane=$(wid+"_p"),inp=$(wid+"_q");
function home(){pane.innerHTML='<div class="ghome" style="background:#0f0f0f;color:#fff"><div style="font-size:36px;font-weight:700;color:#f00">YouTube</div><form id="'+wid+'_f" style="display:flex;gap:8px;width:min(400px,90%)"><input id="'+wid+'_q2" placeholder="Video suchen…" style="flex:1;padding:12px;border-radius:20px;border:1px solid #333;background:#121212;color:#fff"><button type="submit" style="padding:12px 16px;border:none;border-radius:20px;background:#f00;color:#fff">Suchen</button></form></div>';$(wid+"_f").onsubmit=function(e){e.preventDefault();go($(wid+"_q2").value);};}
function go(q){q=(q||"").trim();if(!q)return home();inp.value=q;pane.innerHTML="";var fr=document.createElement("iframe");fr.src=proxy("https://www.youtube.com/results?search_query="+encodeURIComponent(q));fr.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:none;background:#0f0f0f";fr.setAttribute("allow","fullscreen");pane.appendChild(fr);}
$(wid+"_go").onclick=function(){go(inp.value);};inp.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();go(inp.value);}};$(wid+"_h").onclick=home;home();
}

function loadCatalog(){
if(catalog)return Promise.resolve(catalog);
return fetch(CDN+"?t="+Date.now()).then(function(r){return r.json();}).then(function(cfg){
var engines=cfg.engines||["snake","pong","clicker","reaction","flappy"];
var names=cfg.engineNames||{};
var adj=cfg.adjectives||["Neon","Pixel","Turbo","Galaxy"];
var nouns=cfg.nouns||["Arena","Rush","Quest","Dash"];
var count=cfg.count||1000;
var prev=cfg.preview||"https://picsum.photos/seed/w5g{id}/160/120";
var list=[];
for(var i=1;i<=count;i++){
var eng=engines[(i-1)%engines.length];
var name=i<=10?("Spiel "+i):(adj[i%adj.length]+" "+nouns[i%nouns.length]+" "+i);
list.push({id:i,name:name,sub:names[eng]||eng,engine:eng,preview:prev.replace("{id}",String(i)),seed:i*17+3});
}
catalog=list;return list;
}).catch(function(){
catalog=[];for(var i=1;i<=1000;i++){var eng=["snake","pong","clicker","reaction"][(i-1)%4];catalog.push({id:i,name:"Spiel "+i,sub:eng,engine:eng,preview:"https://picsum.photos/seed/w5g"+i+"/160/120",seed:i*17});}return catalog;
});
}

function gamesFolder(c,wid){
c.innerHTML='<div class="gfolder"><h2>🕹️ Spiele</h2><p class="desc">Lade Katalog…</p></div>';
loadCatalog().then(function(list){
var page=0,per=20;
function draw(){
var slice=list.slice(page*per,page*per+per);
var html='<div class="gfolder"><h2>🕹️ Spiele</h2><p class="desc">'+list.length+' Spiele · spiele-for-loading · Seite '+(page+1)+'/'+Math.ceil(list.length/per)+'</p>';
html+='<div style="display:flex;gap:8px;margin-bottom:10px"><button class="btn btn-s" id="'+wid+'_prev">←</button><button class="btn btn-s" id="'+wid+'_next">→</button></div><div class="ggrid">';
slice.forEach(function(g){html+='<button type="button" class="gcard" data-id="'+g.id+'"><img src="'+g.preview+'" alt="" loading="lazy"><div class="gn">'+g.name+'</div><div class="gs">'+g.sub+"</div></button>";});
html+="</div></div>";c.innerHTML=html;
$(wid+"_prev").onclick=function(){if(page>0){page--;draw();}};
$(wid+"_next").onclick=function(){if((page+1)*per<list.length){page++;draw();}};
c.querySelectorAll("[data-id]").forEach(function(b){b.onclick=function(){var g=list.find(function(x){return x.id===+b.getAttribute("data-id");});openApp("game",{game:g,title:g.name,icon:"🕹️"});};});
}
draw();
});
}

function playGame(c,wid,extra){
var g=(extra&&extra.game)||{engine:"snake",seed:1,name:"Spiel"};
c.innerHTML='<div class="gplay"><canvas id="'+wid+'_cv" width="360" height="400"></canvas><div class="ginfo" id="'+wid+'_info"></div><button class="btn btn-s" id="'+wid+'_rst">Neu</button></div>';
var cv=$(wid+"_cv"),ctx=cv.getContext("2d"),info=$(wid+"_info");
var E=window.W5Engines||{};
var fn=E[g.engine]||E.snake||E.clicker;
var stop=fn?fn(cv,ctx,info,g.seed||1):function(){};
if(!fn)info.textContent="Engine fehlt";
$(wid+"_rst").onclick=function(){if(typeof stop==="function")stop();playGame(c,wid,extra);};
}

function robloxApp(c,wid){
c.innerHTML='<div class="rx"><div class="big">🎮</div><h1>Roblox</h1><p>Launcher</p><div class="acts"><button class="btn btn-p" id="'+wid+'_c">▶ Client starten</button><button class="btn btn-s" id="'+wid+'_w">Website (Proxy)</button></div><div class="rx-note">Echte Roblox-Spiele brauchen den installierten Client. Im Fenster nur Website. Zum Zocken hier: <b>Spiele</b> (1000 Mini-Spiele).</div></div>';
$(wid+"_c").onclick=function(){var a=document.createElement("a");a.href="roblox://";document.body.appendChild(a);a.click();a.remove();toast("Roblox","Client…","🎮");};
$(wid+"_w").onclick=function(){c.style.position="relative";c.innerHTML='<div class="rxframe"><div class="top"><button class="btn btn-s" id="'+wid+'_b">←</button></div><iframe src="'+proxy("https://www.roblox.com/home")+'" style="flex:1;border:none;width:100%" allow="fullscreen"></iframe></div>';$(wid+"_b").onclick=function(){robloxApp(c,wid);};};
}

function filesApp(c,wid){
function draw(){var n=Object.keys(vfs);c.innerHTML='<div class="files"><h2>📁 Dateien</h2><input type="file" id="'+wid+'_f" multiple style="display:none"><button class="btn btn-p" id="'+wid+'_u">📤 Hochladen</button><div style="margin-top:12px">'+(n.length?n.map(function(x){return '<div class="frow"><span>📄</span><div class="fmeta"><div class="fname">'+x+'</div></div><button class="btn btn-p" data-d="'+x+'" style="padding:6px 10px;font-size:12px">⬇</button><button class="btn btn-s" data-r="'+x+'" style="padding:6px 8px">🗑</button></div>';}).join(""):'<p style="opacity:.5;padding:12px;text-align:center">Leer</p>')+"</div></div>";
$(wid+"_u").onclick=function(){$(wid+"_f").click();};
$(wid+"_f").onchange=async function(e){var files=e.target.files||[];for(var i=0;i<files.length;i++){var f=files[i];if(f.size>3e6)continue;var data=await new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result);};r.onerror=rej;r.readAsDataURL(f);});vfs[f.name]={data:data,size:f.size};toast("OK",f.name,"📥");}saveVfs();draw();};
c.querySelectorAll("[data-d]").forEach(function(b){b.onclick=function(){var a=document.createElement("a");a.href=vfs[b.getAttribute("data-d")].data;a.download=b.getAttribute("data-d");a.click();};});
c.querySelectorAll("[data-r]").forEach(function(b){b.onclick=function(){delete vfs[b.getAttribute("data-r")];saveVfs();draw();};});}
draw();
}

function paintApp(c,wid){
c.innerHTML='<div style="display:flex;flex-direction:column;height:100%"><div style="padding:6px;display:flex;gap:6px"><input type="color" id="'+wid+'_col" value="#ff1b2d"><button class="btn btn-s" id="'+wid+'_clr">Löschen</button></div><canvas id="'+wid+'_cv" width="480" height="360" style="flex:1;background:#fff;cursor:crosshair;touch-action:none"></canvas></div>';
var cv=$(wid+"_cv"),ctx=cv.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,480,360);var drawing=false;
function pos(e){var r=cv.getBoundingClientRect();var t=e.touches?e.touches[0]:e;return{x:(t.clientX-r.left)*(480/r.width),y:(t.clientY-r.top)*(360/r.height)};}
function start(e){e.preventDefault();drawing=true;var p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);}
function move(e){if(!drawing)return;e.preventDefault();var p=pos(e);ctx.strokeStyle=$(wid+"_col").value;ctx.lineWidth=3;ctx.lineCap="round";ctx.lineTo(p.x,p.y);ctx.stroke();}
function end(){drawing=false;}
cv.onmousedown=start;cv.onmousemove=move;window.addEventListener("mouseup",end);
cv.ontouchstart=start;cv.ontouchmove=move;cv.ontouchend=end;
$(wid+"_clr").onclick=function(){ctx.fillStyle="#fff";ctx.fillRect(0,0,480,360);};
}

function closeW(id){var w=wins.get(id);if(!w)return;w.el.remove();wins.delete(id);taskbar();}
function minW(id){var w=wins.get(id);if(!w)return;w.el.classList.add("min");w.min=true;taskbar();}
function maxW(id){var w=wins.get(id);if(!w)return;w.el.classList.toggle("max");w.max=w.el.classList.contains("max");}
function focusW(id){wins.forEach(function(w,i){w.el.classList.toggle("focus",i===id);});var w=wins.get(id);if(w){w.el.style.zIndex=++z;w.el.classList.remove("min");w.min=false;focused=id;}taskbar();}
function taskbar(){var tb=$("tb-apps");tb.innerHTML="";wins.forEach(function(w,id){var app=apps.find(function(a){return a.id===w.appId;})||{icon:"📦"};var b=document.createElement("button");b.className="tb-a"+(focused===id?" on":"");b.textContent=app.icon||"📦";b.onclick=function(){if(w.min||focused!==id)focusW(id);else minW(id);};tb.appendChild(b);});}
function drag(el,id){var tb=el.querySelector(".wt");var ox,oy,sl,st,d=false;function start(x,y){var w=wins.get(id);if(!w||w.max)return;d=true;ox=x;oy=y;sl=parseInt(el.style.left)||0;st=parseInt(el.style.top)||0;focusW(id);}function move(x,y){if(!d)return;el.style.left=Math.max(0,sl+x-ox)+"px";el.style.top=Math.max(0,st+y-oy)+"px";}tb.onmousedown=function(e){if(e.target.closest(".wb"))return;start(e.clientX,e.clientY);e.preventDefault();};window.addEventListener("mousemove",function(e){move(e.clientX,e.clientY);});window.addEventListener("mouseup",function(){d=false;});tb.ontouchstart=function(e){if(e.target.closest(".wb"))return;var t=e.touches[0];start(t.clientX,t.clientY);};tb.ontouchmove=function(e){if(!d)return;e.preventDefault();var t=e.touches[0];move(t.clientX,t.clientY);};tb.ontouchend=function(){d=false;};}
function clock(){function t(){$("clock").textContent=new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});}t();setInterval(t,1000);}
boot().then(login).then(function(){desktop();clock();toast("Windos 5","Google · Edge · 1000 Spiele","🔴");});
})();
