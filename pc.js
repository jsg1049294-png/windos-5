(function(){
"use strict";
var PW="heyduhacker123";
var apps=[
{id:"google",name:"Google",icon:"🔍"},
{id:"edge",name:"Microsoft Edge",icon:"🌊"},
{id:"youtube",name:"YouTube",icon:"▶️"},
{id:"chatgpt",name:"ChatGPT",icon:"🤖"},
{id:"games",name:"Spiele",icon:"🕹️"},
{id:"roblox",name:"Roblox",icon:"🎮"},
{id:"files",name:"Dateien",icon:"📁"},
{id:"code",name:"Code",icon:"💻"},
{id:"devtools",name:"DevTools",icon:"🛠️"},
{id:"terminal",name:"Terminal",icon:"⬛"},
{id:"notes",name:"Notizen",icon:"📝"},
{id:"calculator",name:"Rechner",icon:"🔢"},
{id:"paint",name:"Paint",icon:"🎨"},
{id:"settings",name:"Einstellungen",icon:"⚙️"}
];
var wins=new Map(),z=100,focused=null,vfs={},gameList=null;
try{vfs=JSON.parse(localStorage.getItem("vpc_vfs")||"{}");}catch(e){}
function $(id){return document.getElementById(id);}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
function toast(t,b,i){var el=document.createElement("div");el.className="toast";el.textContent=(i||"")+" "+t+": "+b;document.body.appendChild(el);setTimeout(function(){el.remove();},2800);}
function saveVfs(){try{localStorage.setItem("vpc_vfs",JSON.stringify(vfs));}catch(e){toast("Speicher","Voll oder blockiert","⚠️");}}
function proxy(u){return "https://translate.google.com/translate?hl=de&sl=auto&tl=de&u="+encodeURIComponent(u);}
function enableTyping(root){
if(!root)return;
root.querySelectorAll("input,textarea,select,[contenteditable]").forEach(function(el){
el.style.pointerEvents="auto";
el.style.userSelect="text";
el.addEventListener("keydown",function(e){e.stopPropagation();},true);
el.addEventListener("keyup",function(e){e.stopPropagation();},true);
el.addEventListener("keypress",function(e){e.stopPropagation();},true);
el.addEventListener("mousedown",function(e){e.stopPropagation();},true);
el.addEventListener("touchstart",function(e){e.stopPropagation();},{passive:true,capture:true});
el.addEventListener("click",function(e){e.stopPropagation();el.focus();},true);
});
}

async function boot(){
var bios=$("bios"),lines=["Windos 5","","CPU OK","RAM OK","Edge OK","ChatGPT OK","Spiele OK",""];
for(var i=0;i<lines.length;i++){bios.textContent+=lines[i]+"\n";await sleep(20);}
bios.classList.add("hidden");
var b=$("boot");b.classList.remove("hidden");
var steps=[["System",40],["Apps",75],["Fertig",100]];
for(var j=0;j<steps.length;j++){$("loadmsg").textContent="Lade "+steps[j][0]+"…";$("bar").style.width=steps[j][1]+"%";await sleep(90);}
b.classList.add("fade");await sleep(160);b.classList.add("hidden");
}
function login(){return new Promise(function(res){var ls=$("login");ls.classList.remove("hidden");enableTyping(ls);$("lf").onsubmit=function(e){e.preventDefault();var v=$("lp").value;if(v===PW||v===""){ls.classList.add("hidden");$("desk").classList.remove("hidden");res();}else $("le").textContent="Falsches Passwort";};setTimeout(function(){$("lp").focus();},80);});}

function desktop(){
var icons=[{id:"google",name:"Google",icon:"🔍"},{id:"edge",name:"Edge",icon:"🌊"},{id:"chatgpt",name:"ChatGPT",icon:"🤖"},{id:"youtube",name:"YouTube",icon:"▶️"},{id:"games",name:"Spiele",icon:"🕹️"},{id:"roblox",name:"Roblox",icon:"🎮"},{id:"files",name:"Dateien",icon:"📁"},{id:"code",name:"Code",icon:"💻"},{id:"devtools",name:"DevTools",icon:"🛠️"},{id:"paint",name:"Paint",icon:"🎨"},{id:"notes",name:"Notizen",icon:"📝"},{id:"calculator",name:"Rechner",icon:"🔢"},{id:"terminal",name:"Terminal",icon:"⬛"}];
var cont=$("icons");cont.innerHTML="";
icons.forEach(function(ic){
var el=document.createElement("div");el.className="icon";
el.innerHTML='<div class="ii">'+ic.icon+'</div><div class="il">'+ic.name+"</div>";
var t=0;function open(){openApp(ic.id);}
el.onclick=function(e){e.stopPropagation();var n=Date.now();if(n-t<400){open();t=0;}else if(el.classList.contains("on"))open();else{document.querySelectorAll(".icon").forEach(function(x){x.classList.remove("on");});el.classList.add("on");t=n;}};
el.ondblclick=open;cont.appendChild(el);
});
var list=$("alist");list.innerHTML="";
apps.forEach(function(a){var el=document.createElement("div");el.className="si";el.innerHTML='<span style="font-size:20px">'+a.icon+"</span><span>"+a.name+"</span>";el.onclick=function(){openApp(a.id);$("start").classList.add("hidden");};list.appendChild(el);});
$("sbtn").onclick=function(){$("start").classList.toggle("hidden");};
$("desk").onclick=function(e){if(e.target.id==="desk"||e.target.classList.contains("wp"))$("start").classList.add("hidden");};
}

function openApp(id,extra){
var app=apps.find(function(a){return a.id===id;})||{id:id,name:id,icon:"📦"};
var wid="w"+Date.now();
var sizes={google:[860,580],edge:[900,600],youtube:[820,560],chatgpt:[860,600],games:[680,540],roblox:[560,440],game:[720,520],files:[460,360],code:[640,480],devtools:[560,400],paint:[500,420],terminal:[480,320]};
var sz=sizes[id]||[420,320];
var win=document.createElement("div");win.className="win focus";win.id=wid;
win.style.cssText="left:"+(30+wins.size*14)+"px;top:"+(24+wins.size*14)+"px;width:"+sz[0]+"px;height:"+sz[1]+"px;z-index:"+(++z);
var title=(extra&&extra.title)||app.name;var icon=(extra&&extra.icon)||app.icon;
win.innerHTML='<div class="wt" data-drag="1"><span style="margin-right:6px">'+icon+'</span><span class="t">'+title+'</span><div class="wc"><button class="wb" data-a="min">─</button><button class="wb" data-a="max">□</button><button class="wb x" data-a="close">✕</button></div></div><div class="wbody" id="'+wid+'_c"></div>';
$("wins").appendChild(win);wins.set(wid,{el:win,id:wid,appId:id,max:false,min:false});
win.querySelectorAll(".wb").forEach(function(btn){function f(e){e.preventDefault();e.stopPropagation();var a=btn.getAttribute("data-a");if(a==="close")closeW(wid);else if(a==="min")minW(wid);else if(a==="max")maxW(wid);}btn.onclick=f;btn.ontouchend=function(e){e.preventDefault();f(e);};});
win.addEventListener("mousedown",function(e){if(!e.target.closest("input,textarea,button,select,a,iframe"))focusW(wid);});
setupDrag(win,wid);
render(id,$(wid+"_c"),wid,extra);
enableTyping($(wid+"_c"));
focusW(wid);taskbar();
}

function render(id,c,wid,extra){
if(id==="calculator"){
c.innerHTML='<div class="calc"><div class="d" id="'+wid+'_d">0</div>'+["C","÷","×","⌫","7","8","9","-","4","5","6","+","1","2","3","=","0","."].map(function(x){return '<button data-k="'+x+'">'+x+"</button>";}).join("")+"</div>";
var cur="0",op=null,prev=null,d=$(wid+"_d");
c.querySelectorAll("button").forEach(function(b){b.onclick=function(){var k=b.getAttribute("data-k");if((k>="0"&&k<="9")||k==="."){cur=cur==="0"&&k!=="."?k:cur+k;d.textContent=cur;}else if(k==="C"){cur="0";op=null;prev=null;d.textContent=cur;}else if(k==="⌫"){cur=cur.slice(0,-1)||"0";d.textContent=cur;}else if(k==="="){if(op&&prev!==null){var a=parseFloat(prev),b2=parseFloat(cur);var m={"+":a+b2,"-":a-b2,"×":a*b2,"÷":b2?a/b2:0};cur=String(Math.round(m[op]*1e8)/1e8);d.textContent=cur;op=null;prev=null;}}else{prev=cur;op=k;cur="0";}};});
}else if(id==="notes"){c.innerHTML='<textarea class="notes" id="'+wid+'_ta" placeholder="Tippen funktioniert hier…"></textarea>';var ta=$(wid+"_ta");ta.value=localStorage.getItem("vpc_notes")||"";ta.oninput=function(){localStorage.setItem("vpc_notes",ta.value);};setTimeout(function(){ta.focus();},50);}
else if(id==="terminal"){c.innerHTML='<div class="term"><div class="term-o" id="'+wid+'_o">Windos 5 Terminal\nhelp · cloud · code · edge\n\n</div><div class="term-r"><span style="color:#0f0;margin-right:6px">></span><input id="'+wid+'_i" autocomplete="off"></div></div>';var o=$(wid+"_o"),i=$(wid+"_i");i.onkeydown=function(e){e.stopPropagation();if(e.key!=="Enter")return;var cmd=i.value.trim();i.value="";o.textContent+="> "+cmd+"\n";if(cmd==="help")o.textContent+="help, clear, games, edge, chatgpt, code, cloud, ls\n";else if(cmd==="clear")o.textContent="";else if(cmd==="games")openApp("games");else if(cmd==="edge")openApp("edge");else if(cmd==="chatgpt")openApp("chatgpt");else if(cmd==="code")openApp("code");else if(cmd==="cloud")openApp("files");else if(cmd==="ls")o.textContent+=(Object.keys(vfs).join("\n")||"(leer)")+"\n";else if(cmd)o.textContent+="?\n";o.scrollTop=1e9;};setTimeout(function(){i.focus();},50);}
else if(id==="google")browserApp(c,wid,"google");
else if(id==="edge")edgeApp(c,wid);
else if(id==="youtube")youtubeApp(c,wid);
else if(id==="chatgpt")chatGptApp(c,wid);
else if(id==="games")gamesFolder(c,wid);
else if(id==="game")playGame(c,wid,extra);
else if(id==="roblox")robloxApp(c,wid);
else if(id==="files")filesApp(c,wid);
else if(id==="code")codeApp(c,wid);
else if(id==="devtools")devToolsApp(c,wid);
else if(id==="paint")paintApp(c,wid);
else if(id==="settings")c.innerHTML='<div style="padding:16px"><h2>Einstellungen</h2><p style="opacity:.7;margin-top:8px;line-height:1.5">Windos 5 ist ein Browser-PC.<br>Speicher: localStorage (dieser Browser).<br>Roblox braucht den echten Client.<br>ChatGPT/Seiten: Proxy falls blockiert.</p></div>';
enableTyping(c);
}

function edgeApp(c,wid){
c.innerHTML='<div class="gwrap"><div class="edge-bar"><div class="edge-tabs"><div class="edge-tab" id="'+wid+'_tab">Neue Registerkarte</div></div><div class="edge-nav"><button type="button" id="'+wid+'_back">←</button><button type="button" id="'+wid+'_fwd">→</button><button type="button" id="'+wid+'_rel">↻</button><input id="'+wid+'_q" placeholder="Suche oder URL" spellcheck="false" autocomplete="off"><button type="button" id="'+wid+'_go" style="background:#0078d4;color:#fff;padding:6px 12px;border-radius:4px">Los</button><button type="button" id="'+wid+'_px">🛡</button></div></div><div class="gpane" id="'+wid+'_p"></div></div>';
var pane=$(wid+"_p"),inp=$(wid+"_q"),useProxy=true,cur="",hist=["about:home"],hi=0;
function home(){cur="about:home";$(wid+"_tab").textContent="Neue Registerkarte";inp.value="";pane.innerHTML='<div class="ghome" style="background:linear-gradient(180deg,#f3f3f3,#e8e8e8);color:#222"><div style="font-size:42px;font-weight:700;background:linear-gradient(90deg,#0078d4,#00bcf2);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Microsoft Edge</div><form id="'+wid+'_f" style="display:flex;gap:8px;width:min(480px,92%)"><input id="'+wid+'_q2" placeholder="Im Web suchen oder URL" style="flex:1;padding:12px 16px;border:1px solid #ccc;border-radius:24px;outline:none;font-size:15px;background:#fff"><button type="submit" style="padding:12px 18px;border:none;border-radius:4px;background:#0078d4;color:#fff">Suchen</button></form><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:16px"><button type="button" data-u="https://www.bing.com" style="padding:10px 14px;border:1px solid #ddd;border-radius:8px;background:#fff">Bing</button><button type="button" data-u="https://chatgpt.com" style="padding:10px 14px;border:1px solid #ddd;border-radius:8px;background:#fff">ChatGPT</button><button type="button" data-u="https://www.poki.com" style="padding:10px 14px;border:1px solid #ddd;border-radius:8px;background:#fff">Poki</button><button type="button" data-u="https://en.wikipedia.org" style="padding:10px 14px;border:1px solid #ddd;border-radius:8px;background:#fff">Wikipedia</button></div></div>';$(wid+"_f").onsubmit=function(e){e.preventDefault();go($(wid+"_q2").value);};pane.querySelectorAll("[data-u]").forEach(function(b){b.onclick=function(){go(b.getAttribute("data-u"));};});enableTyping(pane);}
function go(q){q=(q||"").trim();if(!q||q==="about:home")return home();var u=q;if(!/^https?:\/\//i.test(u)){if(u.indexOf(".")!==-1&&u.indexOf(" ")===-1)u="https://"+u;else u="https://www.bing.com/search?q="+encodeURIComponent(q);}inp.value=u;cur=u;hist=hist.slice(0,hi+1);hist.push(u);hi=hist.length-1;$(wid+"_tab").textContent=u.replace(/^https?:\/\//,"").slice(0,40);show(u);}
function show(u){pane.innerHTML="";var fr=document.createElement("iframe");var src=useProxy?proxy(u):u;if(/bing\.com\/search|google\.com\/search/.test(u))src=u;fr.src=src;fr.setAttribute("allow","fullscreen");fr.setAttribute("referrerpolicy","no-referrer");fr.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:none;background:#fff";pane.appendChild(fr);}
$(wid+"_go").onclick=function(){go(inp.value);};inp.onkeydown=function(e){e.stopPropagation();if(e.key==="Enter"){e.preventDefault();go(inp.value);}};$(wid+"_back").onclick=function(){if(hi>0){hi--;var u=hist[hi];if(u==="about:home")home();else{inp.value=u;cur=u;show(u);}}};$(wid+"_fwd").onclick=function(){if(hi<hist.length-1){hi++;var u=hist[hi];if(u==="about:home")home();else{inp.value=u;cur=u;show(u);}}};$(wid+"_rel").onclick=function(){if(cur&&cur!=="about:home")show(cur);else home();};$(wid+"_px").onclick=function(){useProxy=!useProxy;$(wid+"_px").textContent=useProxy?"🛡":"🔓";toast("Edge","Proxy "+(useProxy?"an":"aus"),"🌊");};enableTyping(c);home();
}

function browserApp(c,wid){
c.innerHTML='<div class="gwrap"><div class="gbar"><button type="button" id="'+wid+'_h">⌂</button><input id="'+wid+'_q" placeholder="Suchen oder URL…" autocomplete="off"><button type="button" id="'+wid+'_go" class="btn btn-p" style="padding:6px 12px;background:#4285f4">Los</button><button type="button" id="'+wid+'_px">🛡</button></div><div class="gpane" id="'+wid+'_p"></div></div>';
var pane=$(wid+"_p"),inp=$(wid+"_q"),useProxy=true;
function home(){pane.innerHTML='<div class="ghome"><div class="glogo">Google</div><form id="'+wid+'_f"><input id="'+wid+'_q2" placeholder="Suchen oder URL…"><button type="submit">Suchen</button></form><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px"><button type="button" data-u="https://www.poki.com">Poki</button><button type="button" data-u="https://chatgpt.com">ChatGPT</button><button type="button" data-u="https://en.wikipedia.org">Wikipedia</button></div></div>';$(wid+"_f").onsubmit=function(e){e.preventDefault();go($(wid+"_q2").value);};pane.querySelectorAll("[data-u]").forEach(function(b){b.onclick=function(){go(b.getAttribute("data-u"));};});enableTyping(pane);inp.value="";}
function go(q){q=(q||"").trim();if(!q)return home();var u=q;if(!/^https?:\/\//i.test(u)){if(u.indexOf(".")!==-1&&u.indexOf(" ")===-1)u="https://"+u;else u="https://www.google.com/search?igu=1&q="+encodeURIComponent(q);}inp.value=u;show(u);}
function show(u){pane.innerHTML="";var fr=document.createElement("iframe");var src=useProxy?proxy(u):u;if(/google\.com\/search/.test(u))src=u;fr.src=src;fr.setAttribute("allow","fullscreen");fr.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:none;background:#fff";pane.appendChild(fr);}
$(wid+"_go").onclick=function(){go(inp.value);};inp.onkeydown=function(e){e.stopPropagation();if(e.key==="Enter"){e.preventDefault();go(inp.value);}};$(wid+"_h").onclick=home;$(wid+"_px").onclick=function(){useProxy=!useProxy;toast("Google","Proxy "+(useProxy?"an":"aus"),"🔍");};enableTyping(c);home();
}

function youtubeApp(c,wid){
c.innerHTML='<div class="gwrap"><div class="gbar" style="background:#0f0f0f"><button type="button" id="'+wid+'_h" style="color:#fff">⌂</button><input id="'+wid+'_q" placeholder="YouTube suchen…" style="background:#121212;color:#fff;border-color:#333" autocomplete="off"><button type="button" id="'+wid+'_go" class="btn btn-p" style="padding:6px 12px;background:#f00">Suche</button></div><div class="gpane" id="'+wid+'_p" style="background:#0f0f0f"></div></div>';
var pane=$(wid+"_p"),inp=$(wid+"_q");
function home(){pane.innerHTML='<div class="ghome" style="background:#0f0f0f;color:#fff"><div style="font-size:36px;font-weight:700;color:#f00">YouTube</div><form id="'+wid+'_f" style="display:flex;gap:8px;width:min(400px,90%)"><input id="'+wid+'_q2" placeholder="Video suchen…" style="flex:1;padding:12px;border-radius:20px;border:1px solid #333;background:#121212;color:#fff"><button type="submit" style="padding:12px 16px;border:none;border-radius:20px;background:#f00;color:#fff">Suchen</button></form></div>';$(wid+"_f").onsubmit=function(e){e.preventDefault();go($(wid+"_q2").value);};enableTyping(pane);}
function go(q){q=(q||"").trim();if(!q)return home();inp.value=q;pane.innerHTML="";var fr=document.createElement("iframe");fr.src=proxy("https://www.youtube.com/results?search_query="+encodeURIComponent(q));fr.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:none;background:#0f0f0f";fr.setAttribute("allow","fullscreen");pane.appendChild(fr);}
$(wid+"_go").onclick=function(){go(inp.value);};inp.onkeydown=function(e){e.stopPropagation();if(e.key==="Enter"){e.preventDefault();go(inp.value);}};$(wid+"_h").onclick=home;enableTyping(c);home();
}

function chatGptApp(c,wid){
c.innerHTML='<div class="gwrap"><div class="gbar" style="background:#212121"><button type="button" id="'+wid+'_h" style="color:#fff">⌂</button><input id="'+wid+'_q" placeholder="chatgpt.com" style="background:#2f2f2f;color:#fff;border-color:#444" autocomplete="off"><button type="button" id="'+wid+'_go" class="btn btn-p" style="padding:6px 12px;background:#10a37f">Öffnen</button><button type="button" id="'+wid+'_px" style="color:#fff">🛡</button></div><div class="gpane" id="'+wid+'_p" style="background:#212121"></div></div>';
var pane=$(wid+"_p"),inp=$(wid+"_q"),useProxy=true;
function home(){pane.innerHTML='<div class="ghome" style="background:#212121;color:#fff"><div style="font-size:32px;font-weight:700">ChatGPT</div><p style="opacity:.7;font-size:13px;max-width:360px;text-align:center">Öffnet chatgpt.com im Fenster. Login ggf. nötig. Wenn leer: Proxy umschalten.</p><button type="button" id="'+wid+'_open" class="btn btn-p" style="background:#10a37f;padding:12px 20px">ChatGPT öffnen</button></div>';$(wid+"_open").onclick=function(){go("https://chatgpt.com");};}
function go(u){u=(u||"").trim()||"https://chatgpt.com";if(!/^https?:\/\//i.test(u))u="https://chatgpt.com";inp.value=u;pane.innerHTML="";var fr=document.createElement("iframe");fr.src=useProxy?proxy(u):u;fr.setAttribute("allow","fullscreen");fr.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:none;background:#212121";pane.appendChild(fr);}
$(wid+"_go").onclick=function(){go(inp.value||"https://chatgpt.com");};inp.onkeydown=function(e){e.stopPropagation();if(e.key==="Enter"){e.preventDefault();go(inp.value||"https://chatgpt.com");}};$(wid+"_h").onclick=home;$(wid+"_px").onclick=function(){useProxy=!useProxy;toast("ChatGPT","Proxy "+(useProxy?"an":"aus"),"🤖");};enableTyping(c);home();
}

function loadGames(){
if(gameList)return Promise.resolve(gameList);
var engines=["snake","pong","clicker","reaction","flappy","breakout","memory","maze"];
return fetch("https://playkovo.com/api/embed-games?format=json").then(function(r){return r.json();}).then(function(data){
var embeds=(data.games||[]).map(function(g,i){return{id:i+1,name:g.title||g.gameName||("Spiel "+(i+1)),sub:"Online · HTML5",type:"embed",url:g.embedUrl||("https://playkovo.com/embed/"+(g.slug||"")),preview:g.thumbnailUrl||g.thumbnail||("https://picsum.photos/seed/pk"+i+"/160/120")};});
var list=embeds.slice();
for(var i=embeds.length;i<Math.max(300,embeds.length);i++){var base=embeds[i%embeds.length];list.push({id:i+1,name:base.name+" #"+(Math.floor(i/embeds.length)+1),sub:base.sub,type:"embed",url:base.url,preview:base.preview});}
for(var j=0;j<40;j++){var eng=engines[j%engines.length];list.push({id:list.length+1,name:"Mini "+eng+" "+(j+1),sub:"Lokal · "+eng,type:"engine",engine:eng,seed:j*13+2,preview:"https://picsum.photos/seed/eng"+j+"/160/120"});}
gameList=list;return list;
}).catch(function(){var list=[];for(var i=0;i<100;i++){var eng=engines[i%engines.length];list.push({id:i+1,name:"Spiel "+(i+1),sub:eng,type:"engine",engine:eng,seed:i*17,preview:"https://picsum.photos/seed/w5g"+i+"/160/120"});}gameList=list;return list;});
}

function gamesFolder(c,wid){
c.innerHTML='<div class="gfolder"><h2>🕹️ Spiele</h2><p class="desc">Lade Online-Spiele…</p></div>';
loadGames().then(function(list){
var page=0,per=24,q="";
function draw(){
var filtered=q?list.filter(function(g){return (g.name+g.sub).toLowerCase().indexOf(q.toLowerCase())!==-1;}):list;
var slice=filtered.slice(page*per,page*per+per);
var html='<div class="gfolder"><h2>🕹️ Spiele</h2><p class="desc">'+filtered.length+' Spiele</p>';
html+='<input id="'+wid+'_s" placeholder="Suchen…" autocomplete="off" style="width:100%;padding:8px 12px;margin-bottom:10px;border-radius:8px;border:1px solid #333;background:#111;color:#eee">';
html+='<div style="display:flex;gap:8px;margin-bottom:10px"><button class="btn btn-s" id="'+wid+'_prev">←</button><span style="opacity:.6;font-size:12px;align-self:center">Seite '+(page+1)+'/'+Math.max(1,Math.ceil(filtered.length/per))+'</span><button class="btn btn-s" id="'+wid+'_next">→</button></div><div class="ggrid">';
slice.forEach(function(g){html+='<button type="button" class="gcard" data-id="'+g.id+'"><img src="'+g.preview+'" alt="" loading="lazy" onerror="this.style.display=\'none\'"><div class="gn">'+g.name+'</div><div class="gs">'+g.sub+"</div></button>";});
html+="</div></div>";c.innerHTML=html;enableTyping(c);
var si=$(wid+"_s");if(si){si.value=q;si.oninput=function(){q=si.value;page=0;draw();};}
$(wid+"_prev").onclick=function(){if(page>0){page--;draw();}};$(wid+"_next").onclick=function(){if((page+1)*per<filtered.length){page++;draw();}};
c.querySelectorAll("[data-id]").forEach(function(b){b.onclick=function(){var g=list.find(function(x){return x.id===+b.getAttribute("data-id");});if(g)openApp("game",{game:g,title:g.name,icon:"🕹️"});};});
}
draw();
});
}

function playGame(c,wid,extra){
var g=(extra&&extra.game)||{type:"engine",engine:"snake",name:"Spiel"};
if(g.type==="embed"&&g.url){c.innerHTML='<div style="position:absolute;inset:0;display:flex;flex-direction:column"><div style="padding:6px 10px;background:#161616;display:flex;gap:8px;align-items:center"><span style="font-size:12px;opacity:.7;flex:1;overflow:hidden;text-overflow:ellipsis">'+g.name+'</span><button class="btn btn-s" id="'+wid+'_fs" style="padding:4px 10px;font-size:12px">Vollbild</button></div><iframe class="gembed" src="'+g.url+'" allow="fullscreen; autoplay; gamepad" style="position:relative;flex:1"></iframe></div>';$(wid+"_fs").onclick=function(){var fr=c.querySelector("iframe");if(fr&&fr.requestFullscreen)fr.requestFullscreen();};return;}
c.innerHTML='<div class="gplay"><canvas id="'+wid+'_cv" width="360" height="400"></canvas><div class="ginfo" id="'+wid+'_info"></div><button class="btn btn-s" id="'+wid+'_rst">Neu</button></div>';
var cv=$(wid+"_cv"),ctx=cv.getContext("2d"),info=$(wid+"_info");var E=window.W5Engines||{};var fn=E[g.engine]||E.snake||E.clicker;var stop=fn?fn(cv,ctx,info,g.seed||1):function(){};if(!fn)info.textContent="Engine fehlt";$(wid+"_rst").onclick=function(){if(typeof stop==="function")stop();playGame(c,wid,extra);};
}

function robloxApp(c,wid){
c.innerHTML='<div class="rx"><div class="big">🎮</div><h1>Roblox</h1><p>Client-Launcher + Website</p><div class="acts"><button class="btn btn-p" id="'+wid+'_c">▶ Roblox Client starten</button><button class="btn btn-s" id="'+wid+'_w">Website (Proxy)</button><button class="btn btn-s" id="'+wid+'_g">Spiele-Ordner öffnen</button></div><div class="rx-note"><b>Wichtig:</b> Roblox-Spiele laufen <b>nicht</b> in einer Website. Der Button startet den installierten Roblox-Client (roblox://). Ohne installierten Client: nur die Website oder den <b>Spiele</b>-Ordner nutzen.</div></div>';
$(wid+"_c").onclick=function(){try{window.location.href="roblox://";}catch(e){}var a=document.createElement("a");a.href="roblox://";document.body.appendChild(a);a.click();a.remove();toast("Roblox","Client-Protokoll aufgerufen","🎮");};
$(wid+"_w").onclick=function(){c.style.position="relative";c.innerHTML='<div class="rxframe"><div class="top"><button class="btn btn-s" id="'+wid+'_b">←</button><span style="font-size:12px;opacity:.7">roblox.com</span></div><iframe src="'+proxy("https://www.roblox.com/home")+'" style="flex:1;border:none;width:100%" allow="fullscreen"></iframe></div>';$(wid+"_b").onclick=function(){robloxApp(c,wid);};};
$(wid+"_g").onclick=function(){openApp("games");};
}

function filesApp(c,wid){
function draw(){var n=Object.keys(vfs);c.innerHTML='<div class="files"><h2>📁 Dateien / Cloud (localStorage)</h2><p style="opacity:.6;font-size:12px;margin-bottom:10px">Speicher in diesem Browser. Backup als JSON exportieren.</p><input type="file" id="'+wid+'_f" multiple style="display:none"><input type="file" id="'+wid+'_imp" accept="application/json,.json" style="display:none"><div style="display:flex;flex-wrap:wrap;gap:8px"><button class="btn btn-p" id="'+wid+'_u">📤 Hochladen</button><button class="btn btn-s" id="'+wid+'_exp">💾 Backup export</button><button class="btn btn-s" id="'+wid+'_im">📥 Backup import</button></div><div style="margin-top:12px">'+(n.length?n.map(function(x){return '<div class="frow"><span>📄</span><div class="fmeta"><div class="fname">'+x+'</div></div><button class="btn btn-p" data-d="'+x+'" style="padding:6px 10px;font-size:12px">⬇</button><button class="btn btn-s" data-r="'+x+'" style="padding:6px 8px">🗑</button></div>';}).join(""):'<p style="opacity:.5;padding:12px;text-align:center">Leer</p>')+"</div></div>";
$(wid+"_u").onclick=function(){$(wid+"_f").click();};
$(wid+"_f").onchange=async function(e){var files=e.target.files||[];for(var i=0;i<files.length;i++){var f=files[i];if(f.size>2.5e6){toast("Zu groß",f.name,"⚠️");continue;}var data=await new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result);};r.onerror=rej;r.readAsDataURL(f);});vfs[f.name]={data:data,size:f.size,t:Date.now()};toast("OK",f.name,"📥");}saveVfs();draw();};
$(wid+"_exp").onclick=function(){var blob=new Blob([JSON.stringify({vfs:vfs,notes:localStorage.getItem("vpc_notes")||""})],{type:"application/json"});var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="windos5-backup.json";a.click();};
$(wid+"_im").onclick=function(){$(wid+"_imp").click();};
$(wid+"_imp").onchange=async function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var txt=await f.text();try{var j=JSON.parse(txt);if(j.vfs)vfs=j.vfs;if(j.notes!=null)localStorage.setItem("vpc_notes",j.notes);saveVfs();toast("Import","OK","📥");draw();}catch(err){toast("Import","Ungültig","⚠️");}};
c.querySelectorAll("[data-d]").forEach(function(b){b.onclick=function(){var a=document.createElement("a");a.href=vfs[b.getAttribute("data-d")].data;a.download=b.getAttribute("data-d");a.click();};});
c.querySelectorAll("[data-r]").forEach(function(b){b.onclick=function(){delete vfs[b.getAttribute("data-r")];saveVfs();draw();};});}
draw();
}

function codeApp(c,wid){
c.innerHTML='<div class="codebox"><div class="bar" style="height:auto;margin:0;background:#161b22;padding:8px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-p" id="'+wid+'_dl" style="padding:6px 12px">⬇ Download .js</button><button class="btn btn-s" id="'+wid+'_dl2" style="padding:6px 12px">⬇ .txt</button><button class="btn btn-s" id="'+wid+'_run" style="padding:6px 12px">▶ Run JS</button></div><textarea id="'+wid+'_code" spellcheck="false" placeholder="// Code hier tippen…"></textarea><pre id="'+wid+'_out" style="max-height:80px;overflow:auto;background:#010409;color:#7ee787;padding:8px;font-size:12px;margin:0"></pre></div>';
var ta=$(wid+"_code");ta.value=localStorage.getItem("vpc_code")||"// Windos 5 Code Editor\nconsole.log('Hallo von Windos 5');\n";
ta.oninput=function(){localStorage.setItem("vpc_code",ta.value);};
function dl(name,type){var blob=new Blob([ta.value],{type:type});var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();}
$(wid+"_dl").onclick=function(){dl("script.js","text/javascript");};
$(wid+"_dl2").onclick=function(){dl("code.txt","text/plain");};
$(wid+"_run").onclick=function(){var out=$(wid+"_out");out.textContent="";try{var logs=[];var old=console.log;console.log=function(){logs.push(Array.prototype.slice.call(arguments).join(" "));};var r=(0,eval)(ta.value);console.log=old;out.textContent=(logs.join("\n")+(r!==undefined?"\n=> "+String(r):""))||"(ok)";}catch(e){out.textContent="Error: "+e.message;}};
enableTyping(c);setTimeout(function(){ta.focus();},50);
}

function devToolsApp(c,wid){
c.innerHTML='<div class="devtools"><div class="out" id="'+wid+'_o">Windos 5 DevTools\n> JS Console (Eval)\nHinweis: Echtes Browser-DevTools: F12 im echten Browser.\n\n</div><div class="row"><input id="'+wid+'_i" placeholder="z.B. 1+1 oder document.title" autocomplete="off"><button class="btn btn-p" id="'+wid+'_go" style="padding:8px 12px">Run</button></div></div>';
var o=$(wid+"_o"),i=$(wid+"_i");
function run(){var code=i.value;if(!code)return;o.textContent+="> "+code+"\n";try{var r=(0,eval)(code);o.textContent+=String(r)+"\n";}catch(e){o.textContent+="Error: "+e.message+"\n";}o.scrollTop=1e9;i.value="";}
i.onkeydown=function(e){e.stopPropagation();if(e.key==="Enter"){e.preventDefault();run();}};$(wid+"_go").onclick=run;enableTyping(c);setTimeout(function(){i.focus();},50);
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

function setupDrag(el,id){
var bar=el.querySelector("[data-drag]");if(!bar)return;
var dragging=false,ox=0,oy=0,sl=0,st=0;
function down(x,y,e){var w=wins.get(id);if(!w||w.max)return;if(e&&e.target&&e.target.closest&&e.target.closest(".wb"))return;dragging=true;ox=x;oy=y;sl=parseInt(el.style.left,10)||0;st=parseInt(el.style.top,10)||0;focusW(id);}
function move(x,y){if(!dragging)return;el.style.left=Math.max(0,sl+x-ox)+"px";el.style.top=Math.max(0,st+y-oy)+"px";}
function up(){dragging=false;}
bar.onmousedown=function(e){down(e.clientX,e.clientY,e);e.preventDefault();};
window.addEventListener("mousemove",function(e){move(e.clientX,e.clientY);});
window.addEventListener("mouseup",up);
bar.addEventListener("touchstart",function(e){var t=e.touches[0];down(t.clientX,t.clientY,e);},{passive:true});
bar.addEventListener("touchmove",function(e){if(!dragging)return;e.preventDefault();var t=e.touches[0];move(t.clientX,t.clientY);},{passive:false});
bar.addEventListener("touchend",up);
}

function clock(){function t(){$("clock").textContent=new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});}t();setInterval(t,1000);}
boot().then(login).then(function(){desktop();clock();toast("Windos 5","Tippen · Edge · ChatGPT · Code","🔴");});
})();
