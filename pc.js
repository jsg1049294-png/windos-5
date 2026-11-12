(function(){
const PW='heyduhacker123';
const apps=[{id:'browser',name:'Opera GX',icon:'🌐'},{id:'roblox',name:'Roblox',icon:'🎮'},{id:'files',name:'Dateien',icon:'📁'},{id:'terminal',name:'Terminal',icon:'⬛'},{id:'notes',name:'Notizen',icon:'📝'},{id:'calculator',name:'Rechner',icon:'🔢'},{id:'settings',name:'Einstellungen',icon:'⚙️'}];
const wins=new Map();let z=100,focused=null,vfs={};
try{vfs=JSON.parse(localStorage.getItem('vpc_vfs')||'{}')}catch(e){}
const $=id=>document.getElementById(id);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function toast(t,b,i){const el=document.createElement('div');el.className='toast';el.textContent=(i||'')+' '+t+': '+b;document.body.appendChild(el);setTimeout(()=>el.remove(),2800)}
function saveVfs(){try{localStorage.setItem('vpc_vfs',JSON.stringify(vfs))}catch(e){toast('Speicher','Datei zu groß','⚠️')}}

async function boot(){
const bios=$('bios');
for(const l of['Windos 5 BIOS','','CPU OK','RAM OK','GPU OK','Roblox Client OK','']){bios.textContent+=l+'\n';await sleep(70)}
await sleep(150);bios.classList.add('hidden');
const boot=$('boot');boot.classList.remove('hidden');
const bar=$('bar');
for(const p of[25,55,80,100]){bar.style.width=p+'%';await sleep(180)}
boot.classList.add('fade');await sleep(350);boot.classList.add('hidden');
}

function login(){return new Promise(r=>{const ls=$('login');ls.classList.remove('hidden');$('lf').onsubmit=e=>{e.preventDefault();const v=$('lp').value;if(v===PW||v===''){ls.classList.add('hidden');$('desk').classList.remove('hidden');r()}else $('le').textContent='Falsches Passwort'};setTimeout(()=>$('lp').focus(),120)})}

function desktop(){
const icons=[{id:'browser',name:'Opera GX',icon:'🌐'},{id:'roblox',name:'Roblox',icon:'🎮'},{id:'files',name:'Dateien',icon:'📁'},{id:'terminal',name:'Terminal',icon:'⬛'},{id:'notes',name:'Notizen',icon:'📝'},{id:'calculator',name:'Rechner',icon:'🔢'}];
const cont=$('icons');
icons.forEach(ic=>{
const el=document.createElement('div');el.className='icon';
el.innerHTML=`<div class="ii">${ic.icon}</div><div class="il">${ic.name}</div>`;
let t=0;const open=()=>openApp(ic.id);
el.onclick=e=>{e.stopPropagation();const n=Date.now();if(n-t<400){open();t=0}else if(el.classList.contains('on'))open();else{document.querySelectorAll('.icon').forEach(x=>x.classList.remove('on'));el.classList.add('on');t=n}};
el.ondblclick=open;cont.appendChild(el);
});
const list=$('alist');
apps.forEach(a=>{const el=document.createElement('div');el.className='si';el.innerHTML=`<span style="font-size:20px">${a.icon}</span><span>${a.name}</span>`;el.onclick=()=>{openApp(a.id);$('start').classList.add('hidden')};list.appendChild(el)});
$('sbtn').onclick=()=>$('start').classList.toggle('hidden');
$('desk').onclick=e=>{if(e.target.id==='desk'||e.target.classList.contains('wp'))$('start').classList.add('hidden')};
}

function openApp(id){
const app=apps.find(a=>a.id===id)||{id,name:id,icon:'📦'};
const wid='w'+Date.now();
const sz={browser:[780,560],roblox:[720,520],files:[480,380],terminal:[500,340]}[id]||[440,320];
const win=document.createElement('div');win.className='win focus';win.id=wid;
win.style.cssText=`left:${30+wins.size*16}px;top:${24+wins.size*16}px;width:${sz[0]}px;height:${sz[1]}px;z-index:${++z}`;
win.innerHTML=`<div class="wt"><span style="margin-right:6px">${app.icon}</span><span class="t">${app.name}</span><div class="wc"><button class="wb" data-a="min">─</button><button class="wb" data-a="max">□</button><button class="wb x" data-a="close">✕</button></div></div><div class="wbody" id="${wid}_c"></div>`;
$('wins').appendChild(win);
wins.set(wid,{el:win,id:wid,appId:id,max:false,min:false});
win.querySelectorAll('.wb').forEach(btn=>{
const f=e=>{e.preventDefault();e.stopPropagation();const a=btn.dataset.a;if(a==='close')closeW(wid);else if(a==='min')minW(wid);else if(a==='max')maxW(wid)};
btn.onclick=f;btn.ontouchend=e=>{e.preventDefault();f(e)};
});
win.onmousedown=()=>focusW(wid);
drag(win,wid);
render(id,$(wid+'_c'),wid);
focusW(wid);taskbar();
}

function render(id,c,wid){
if(id==='calculator'){
c.innerHTML=`<div class="calc"><div class="d" id="${wid}_d">0</div>${['C','÷','×','⌫','7','8','9','-','4','5','6','+','1','2','3','=','0','.'].map(x=>`<button data-k="${x}">${x}</button>`).join('')}</div>`;
let cur='0',op=null,prev=null;const d=$(wid+'_d');
c.querySelectorAll('button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if((k>='0'&&k<='9')||k==='.'){cur=cur==='0'&&k!=='.'?k:cur+k;d.textContent=cur}else if(k==='C'){cur='0';op=prev=null;d.textContent=cur}else if(k==='⌫'){cur=cur.slice(0,-1)||'0';d.textContent=cur}else if(k==='='){if(op&&prev!==null){const a=parseFloat(prev),b2=parseFloat(cur);cur=String({'+':a+b2,'-':a-b2,'×':a*b2,'÷':a/b2}[op]);d.textContent=cur;op=prev=null}}else{prev=cur;op=k;cur='0'}});
}
else if(id==='notes'){c.innerHTML=`<textarea class="notes" id="${wid}_ta" placeholder="Schreiben…"></textarea>`;const ta=$(wid+'_ta');ta.value=localStorage.getItem('vpc_notes')||'';ta.oninput=()=>localStorage.setItem('vpc_notes',ta.value)}
else if(id==='terminal'){
c.innerHTML=`<div class="term"><div class="term-o" id="${wid}_o">Windos 5 Terminal\nhelp · ls\n\n</div><div class="term-r"><span style="color:#0f0;margin-right:6px">></span><input id="${wid}_i"></div></div>`;
const o=$(wid+'_o'),i=$(wid+'_i');
i.onkeydown=e=>{if(e.key!=='Enter')return;const cmd=i.value.trim();i.value='';o.textContent+=`> ${cmd}\n`;
if(cmd==='help')o.textContent+='help, clear, date, whoami, ls, echo\n';
else if(cmd==='clear')o.textContent='';
else if(cmd==='date')o.textContent+=new Date().toLocaleString('de-DE')+'\n';
else if(cmd==='whoami')o.textContent+='Alessio\n';
else if(cmd==='ls'){const k=Object.keys(vfs);o.textContent+=k.length?k.map(n=>'  '+n).join('\n')+'\n':'  (leer)\n'}
else if(cmd.startsWith('echo '))o.textContent+=cmd.slice(5)+'\n';
else if(cmd)o.textContent+='?\n';o.scrollTop=o.scrollHeight};
setTimeout(()=>i.focus(),80);
}
else if(id==='browser') browser(c,wid);
else if(id==='roblox') roblox(c,wid);
else if(id==='files') files(c,wid);
else if(id==='settings') c.innerHTML=`<div style="padding:16px"><h2 style="margin-bottom:8px">Einstellungen</h2><p style="opacity:.7">Benutzer: Alessio · Windos 5</p><p style="opacity:.7;margin-top:8px">Dateien: ${Object.keys(vfs).length}</p></div>`;
}

function browser(c,wid){
c.innerHTML=`<div class="bwrap"><div class="bbar">
<button type="button" id="${wid}_back">←</button>
<button type="button" id="${wid}_fwd">→</button>
<button type="button" id="${wid}_rel">↻</button>
<button type="button" id="${wid}_home">⌂</button>
<input id="${wid}_url" placeholder="Suchen oder URL eingeben" enterkeyhint="go">
<button type="button" id="${wid}_go">➔</button>
</div><div class="bpane" id="${wid}_pane"></div></div>`;
const st={h:['home'],i:0};
const pane=$(wid+'_pane');
const urlIn=$(wid+'_url');
function home(){
pane.innerHTML=`<div class="bhome">
<h1>Opera <span>GX</span></h1>
<p style="opacity:.6;font-size:13px">Browser · bleibt im Fenster</p>
<form id="${wid}_sf"><input id="${wid}_q" placeholder="Im Web suchen…"><button type="submit">Suchen</button></form>
<div class="blinks">
<button type="button" data-u="https://example.com">Example</button>
<button type="button" data-u="https://en.wikipedia.org/wiki/Main_Page">Wikipedia</button>
<button type="button" data-u="https://duckduckgo.com/?q=windows&ia=web">DuckDuckGo</button>
<button type="button" data-u="https://archive.org">Archive.org</button>
<button type="button" data-u="https://www.wikipedia.org">Wiki.org</button>
<button type="button" data-u="search:roblox">Suche Roblox</button>
</div>
<p style="font-size:11px;opacity:.4;max-width:320px;text-align:center;margin-top:8px">Seiten die iframes blocken werden über Viewer geladen – immer im Fenster.</p>
</div>`;
$(wid+'_sf').onsubmit=e=>{e.preventDefault();const q=$(wid+'_q').value.trim();if(q)go(q)};
pane.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>go(b.dataset.u));
urlIn.value='';
}
function viewerUrl(u){return 'https://translate.google.com/translate?hl=de&sl=auto&tl=de&u='+encodeURIComponent(u)}
function searchUrl(q){return 'https://duckduckgo.com/?q='+encodeURIComponent(q)+'&ia=web'}
function showIframe(u, useViewer){
pane.innerHTML='';
const fr=document.createElement('iframe');
fr.src=useViewer?viewerUrl(u):u;
fr.allow='fullscreen';
fr.referrerPolicy='no-referrer';
fr.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:none;background:#111';
pane.appendChild(fr);
if(!useViewer){
setTimeout(()=>{
if(!pane.querySelector('iframe'))return;
const tip=document.createElement('div');
tip.style.cssText='position:absolute;bottom:8px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.85);border:1px solid #333;padding:8px 12px;border-radius:8px;font-size:12px;z-index:5;display:flex;gap:8px;align-items:center';
tip.innerHTML='<span>Seite leer?</span>';
const btn=document.createElement('button');
btn.className='btn btn-p';btn.style.padding='6px 10px';btn.style.fontSize='12px';
btn.textContent='Viewer laden';
btn.onclick=()=>showIframe(u,true);
tip.appendChild(btn);
pane.appendChild(tip);
setTimeout(()=>tip.remove(),8000);
},4000);
}
}
function go(input){
let u=(input||'').trim();
if(!u||u==='home')return home();
if(u.startsWith('search:')){u=searchUrl(u.slice(7));}
else if(!/^https?:\/\//i.test(u)){
if(u.includes('.')&&!u.includes(' ')) u='https://'+u;
else u=searchUrl(u);
}
urlIn.value=u;
st.h=st.h.slice(0,st.i+1);st.h.push(u);st.i=st.h.length-1;
const blocked=/roblox\.com|youtube\.com|google\.com|facebook\.com|twitter\.com|x\.com|instagram\.com/i.test(u);
showIframe(u, blocked);
}
$(wid+'_go').onclick=()=>go(urlIn.value);
urlIn.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go(urlIn.value)}};
$(wid+'_home').onclick=()=>go('home');
$(wid+'_rel').onclick=()=>{const u=st.h[st.i];u==='home'?home():go(u)};
$(wid+'_back').onclick=()=>{if(st.i>0){st.i--;const u=st.h[st.i];u==='home'?home():go(u)}};
$(wid+'_fwd').onclick=()=>{if(st.i<st.h.length-1){st.i++;go(st.h[st.i])}};
home();
}

function roblox(c,wid){
function menu(){
c.style.position='';
c.innerHTML=`<div class="rx">
<div class="big">🎮</div>
<h1>Roblox</h1>
<p>Vorinstalliert · Windos 5</p>
<div class="acts"><button class="btn btn-p" id="${wid}_play" style="padding:12px 24px;font-size:15px">▶ Roblox starten</button></div>
<div class="grid">
<button type="button" data-u="https://www.roblox.com/home">Home</button>
<button type="button" data-u="https://www.roblox.com/games">Discover</button>
<button type="button" data-u="https://www.roblox.com/charts">Charts</button>
<button type="button" data-u="https://www.roblox.com/login">Login</button>
</div>
<p style="margin-top:14px;font-size:11px;opacity:.45">Lädt die Roblox-Website im App-Fenster (kein neuer Tab).</p>
</div>`;
const load=u=>{
c.style.position='relative';
c.innerHTML=`<div class="rxframe">
<div class="top"><button class="btn btn-s" id="${wid}_bm">← Menü</button>
<span style="font-size:12px;opacity:.7;flex:1;overflow:hidden;text-overflow:ellipsis">${u}</span>
<button class="btn btn-s" id="${wid}_vv" style="font-size:12px">Viewer</button>
</div>
<iframe id="${wid}_fr" src="" style="flex:1;border:none;width:100%;background:#111" allow="fullscreen"></iframe>
</div>`;
const fr=$(wid+'_fr');
fr.src='https://translate.google.com/translate?hl=de&sl=auto&tl=de&u='+encodeURIComponent(u);
$(wid+'_bm').onclick=menu;
$(wid+'_vv').onclick=()=>{fr.src='https://translate.google.com/translate?hl=de&sl=auto&tl=de&u='+encodeURIComponent(u)};
toast('Roblox','Lädt im Fenster…','🎮');
};
$(wid+'_play').onclick=()=>load('https://www.roblox.com/home');
c.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>load(b.dataset.u));
}
menu();
}

function files(c,wid){
function draw(){
const names=Object.keys(vfs);
c.innerHTML=`<div class="files"><h2>📁 Dateien</h2><p class="desc">Hochladen speichert auf dem virtuellen PC. Dann hier wieder herunterladen.</p>
<input type="file" id="${wid}_f" multiple style="display:none">
<button class="btn btn-p" id="${wid}_up">📤 Datei hochladen</button>
<div style="margin-top:14px">${names.length?names.map(n=>{const f=vfs[n];return `<div class="frow"><span>📄</span><div class="fmeta"><div class="fname">${n}</div><div class="fsize">${Math.round((f.size||0)/1024)} KB</div></div><button class="btn btn-p" data-dl="${n}" style="padding:6px 10px;font-size:12px">⬇</button><button class="btn btn-s" data-rm="${n}" style="padding:6px 8px;font-size:12px">🗑</button></div>`}).join(''):'<p style="opacity:.5;text-align:center;padding:16px">Noch keine Dateien.</p>'}</div></div>`;
$(wid+'_up').onclick=()=>$(wid+'_f').click();
$(wid+'_f').onchange=async e=>{
const list=e.target.files;if(!list?.length)return;
for(const file of list){
if(file.size>3*1024*1024){toast('Dateien',file.name+' zu groß (max 3 MB)','⚠️');continue}
try{const data=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});
vfs[file.name]={name:file.name,type:file.type,size:file.size,data,time:Date.now()};
toast('Download',file.name+' auf dem PC','📥')}catch(err){toast('Fehler',String(err),'⚠️')}
}
saveVfs();draw();e.target.value='';
};
c.querySelectorAll('[data-dl]').forEach(b=>b.onclick=()=>{const f=vfs[b.dataset.dl];if(!f?.data)return;const a=document.createElement('a');a.href=f.data;a.download=b.dataset.dl;document.body.appendChild(a);a.click();a.remove();toast('Download',b.dataset.dl,'⬇')});
c.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{delete vfs[b.dataset.rm];saveVfs();draw()});
}
draw();
}

function closeW(id){const w=wins.get(id);if(!w)return;w.el.remove();wins.delete(id);taskbar()}
function minW(id){const w=wins.get(id);if(!w)return;w.el.classList.add('min');w.min=true;taskbar()}
function maxW(id){const w=wins.get(id);if(!w)return;w.el.classList.toggle('max');w.max=w.el.classList.contains('max')}
function focusW(id){wins.forEach((w,i)=>w.el.classList.toggle('focus',i===id));const w=wins.get(id);if(w){w.el.style.zIndex=++z;w.el.classList.remove('min');w.min=false;focused=id}taskbar()}
function taskbar(){const tb=$('tb-apps');tb.innerHTML='';wins.forEach((w,id)=>{const app=apps.find(a=>a.id===w.appId)||{icon:'📦'};const b=document.createElement('button');b.className='tb-a'+(focused===id?' on':'');b.textContent=app.icon;b.onclick=()=>{if(w.min||focused!==id)focusW(id);else minW(id)};tb.appendChild(b)})}
function drag(el,id){const tb=el.querySelector('.wt');let ox,oy,sl,st,d=false;
const start=(x,y)=>{const w=wins.get(id);if(!w||w.max)return;d=true;ox=x;oy=y;sl=parseInt(el.style.left)||0;st=parseInt(el.style.top)||0;focusW(id)};
const move=(x,y)=>{if(!d)return;el.style.left=Math.max(0,sl+x-ox)+'px';el.style.top=Math.max(0,st+y-oy)+'px'};
tb.onmousedown=e=>{if(e.target.closest('.wb'))return;start(e.clientX,e.clientY);e.preventDefault()};
window.addEventListener('mousemove',e=>move(e.clientX,e.clientY));
window.addEventListener('mouseup',()=>d=false);
tb.ontouchstart=e=>{if(e.target.closest('.wb'))return;const t=e.touches[0];start(t.clientX,t.clientY)};
tb.ontouchmove=e=>{if(!d)return;e.preventDefault();const t=e.touches[0];move(t.clientX,t.clientY)};
tb.ontouchend=()=>d=false;
}
function clock(){const t=()=>{$('clock').textContent=new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})};t();setInterval(t,1000)}

boot().then(login).then(()=>{desktop();clock();toast('Windos 5','Willkommen!','🔴')});
})();
