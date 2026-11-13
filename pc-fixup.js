(function(){
"use strict";
function toast(t,b,i){
  var el=document.createElement("div");el.className="toast";
  el.textContent=(i||"")+" "+t+": "+b;
  document.body.appendChild(el);
  setTimeout(function(){el.remove();},2800);
}
function proxy(u){
  return "https://translate.google.com/translate?hl=de&sl=auto&tl=de&u="+encodeURIComponent(u);
}
(function(){
  var dragging=false,win=null,ox=0,oy=0,sl=0,st=0;
  function onDown(e){
    var bar=e.target.closest&&e.target.closest("[data-drag],.wt");
    if(!bar)return;
    if(e.target.closest&&e.target.closest(".wb,button"))return;
    win=bar.closest(".win");
    if(!win||win.classList.contains("max"))return;
    dragging=true;
    var r=win.getBoundingClientRect();
    sl=r.left;st=r.top;
    var x=e.clientX!=null?e.clientX:(e.touches&&e.touches[0].clientX);
    var y=e.clientY!=null?e.clientY:(e.touches&&e.touches[0].clientY);
    ox=x;oy=y;
    win.style.left=sl+"px";win.style.top=st+"px";
    win.style.zIndex=String((parseInt(win.style.zIndex,10)||100)+1);
    try{bar.setPointerCapture&&e.pointerId!=null&&bar.setPointerCapture(e.pointerId);}catch(err){}
    e.preventDefault();
  }
  function onMove(e){
    if(!dragging||!win)return;
    var x=e.clientX!=null?e.clientX:(e.touches&&e.touches[0].clientX);
    var y=e.clientY!=null?e.clientY:(e.touches&&e.touches[0].clientY);
    if(x==null)return;
    var nx=Math.max(0,Math.min(window.innerWidth-80,sl+(x-ox)));
    var ny=Math.max(0,Math.min(window.innerHeight-50,st+(y-oy)));
    win.style.left=nx+"px";win.style.top=ny+"px";
  }
  function onUp(){dragging=false;win=null;}
  document.addEventListener("pointerdown",onDown,true);
  document.addEventListener("pointermove",onMove,true);
  document.addEventListener("pointerup",onUp,true);
  document.addEventListener("mousedown",onDown,true);
  document.addEventListener("mousemove",onMove,true);
  document.addEventListener("mouseup",onUp,true);
  document.addEventListener("touchstart",onDown,{capture:true,passive:false});
  document.addEventListener("touchmove",onMove,{capture:true,passive:false});
  document.addEventListener("touchend",onUp,true);
})();
try{window.open=function(){toast("Browser","Kein neuer Tab – Adresszeile nutzen","🌊");return null;};}catch(e){}
function forceProxyIframe(fr){
  if(!fr||fr.dataset.w5px==="1")return;
  var src=fr.getAttribute("src")||"";
  if(!src||src==="about:blank")return;
  if(/translate\.google\.com\/translate/.test(src)){fr.dataset.w5px="1";return;}
  if(/gamedistribution\.com|playkovo|minefun|crazygames\.com\/embed/i.test(src)){fr.dataset.w5px="1";return;}
  try{fr.dataset.w5px="1";fr.src=proxy(src);}catch(e){}
}
var obs=new MutationObserver(function(muts){
  muts.forEach(function(m){
    m.addedNodes&&m.addedNodes.forEach(function(n){
      if(n.tagName==="IFRAME")forceProxyIframe(n);
      if(n.querySelectorAll)n.querySelectorAll("iframe").forEach(forceProxyIframe);
    });
  });
});
obs.observe(document.documentElement,{childList:true,subtree:true});
document.querySelectorAll("iframe").forEach(forceProxyIframe);
function createClockExe(){
  try{
    var vfs=JSON.parse(localStorage.getItem("w5_vfs")||"{}");
    if(!vfs["/Users/Alessio/Desktop"])vfs["/Users/Alessio/Desktop"]={};
    vfs["/Users/Alessio/Desktop"]["Clock.exe"]={type:"file",app:"clock",name:"Clock.exe",icon:"🕐",content:"W5EXE:clock"};
    localStorage.setItem("w5_vfs",JSON.stringify(vfs));
    addExeIcons();
    toast("Builder","Clock.exe erstellt","🕐");
  }catch(e){toast("Fehler",String(e),"⚠️");}
}
function openClockWindow(){
  if(typeof window.openApp==="function"){try{window.openApp("clock");return;}catch(e){}}
  var wid="wclk"+Date.now();
  var wins=document.getElementById("wins");
  if(!wins)return;
  var win=document.createElement("div");
  win.className="win focus";win.id=wid;
  win.style.cssText="left:80px;top:60px;width:360px;height:280px;z-index:5000";
  win.innerHTML='<div class="wt" data-drag="1"><span style="margin-right:6px">🕐</span><span class="t">Uhr</span><div class="wc"><button class="wb x" data-a="close">✕</button></div></div><div class="wbody" id="'+wid+'_c"></div>';
  wins.appendChild(win);
  win.querySelector(".wb").onclick=function(){win.remove();};
  var c=document.getElementById(wid+"_c");
  c.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:linear-gradient(160deg,#1a1a2e,#0f0f1a);gap:10px">'+'<div id="'+wid+'_big" style="font-size:48px;font-weight:700;font-variant-numeric:tabular-nums">--:--:--</div>'+'<div id="'+wid+'_date" style="opacity:.7"></div></div>';
  function tick(){
    var d=new Date();
    var b=document.getElementById(wid+"_big");
    var dt=document.getElementById(wid+"_date");
    if(b)b.textContent=d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
    if(dt)dt.textContent=d.toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  }
  tick();setInterval(tick,500);
}
function addExeIcons(){
  var cont=document.getElementById("icons");if(!cont)return;
  cont.querySelectorAll("[data-exe]").forEach(function(n){n.remove();});
  function addIcon(name,icon,run){
    var el=document.createElement("div");el.className="icon";el.setAttribute("data-exe",name);
    el.innerHTML='<div class="ii">'+icon+'</div><div class="il">'+name+"</div>";
    var t=0;
    el.onclick=function(e){
      e.stopPropagation();
      var n=Date.now();
      if(n-t<450){run();t=0;}
      else{document.querySelectorAll(".icon").forEach(function(x){x.classList.remove("on");});el.classList.add("on");t=n;}
    };
    el.ondblclick=function(e){e.stopPropagation();run();};
    cont.appendChild(el);
  }
  addIcon("MakeClock.exe","⚙️",function(){createClockExe();});
  try{
    var vfs=JSON.parse(localStorage.getItem("w5_vfs")||"{}");
    var desk=vfs["/Users/Alessio/Desktop"]||{};
    if(desk["Clock.exe"])addIcon("Clock.exe","🕐",openClockWindow);
  }catch(e){}
}
function waitDesk(cb){
  var n=0;
  (function tick(){
    if(document.getElementById("desk")&&!document.getElementById("desk").classList.contains("hidden")){cb();return;}
    if(++n>200)return;setTimeout(tick,100);
  })();
}
waitDesk(function(){
  addExeIcons();
  toast("Fix","Ziehen aktiv · Proxy · MakeClock.exe","✅");
});
document.addEventListener("click",function(e){
  var a=e.target.closest&&e.target.closest("a[target=_blank]");
  if(a&&a.closest("#desk")){e.preventDefault();e.stopPropagation();toast("Browser","Link blockiert (neuer Tab)","🌊");}
},true);
})();
