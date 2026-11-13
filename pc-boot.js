(function(){
"use strict";
var SRC="https://raw.githubusercontent.com/jsg1049294-png/windos-5/d4fb8888b469ef5101665fc65a54e0a4be58ad9e/pc.js";
var NEW_LOAD="function loadGames(){if(gameList)return Promise.resolve(gameList);var loader=window.W5loadGamesCatalog;if(typeof loader===\"function\"){return loader().then(function(list){gameList=list||[];return gameList;});}gameList=[];return Promise.resolve(gameList);}";
var NEW_PLAY="function playGame(c,wid,extra){\nvar g=(extra&&extra.game)||{type:\"engine\",engine:\"snake\"};\nif(g.type===\"embed\"&&g.url){\nvar raw=g.url,src=raw;\nif(!/gamedistribution\\.com|playkovo\\.com|crazygames\\.com\\/embed/i.test(raw)){\nsrc=\"https://translate.google.com/translate?hl=de&sl=auto&tl=de&u=\"+encodeURIComponent(raw);\n}\nc.innerHTML='<div style=\"position:absolute;inset:0;display:flex;flex-direction:column;background:#0a0a0a\">'+\n'<div style=\"padding:6px 10px;background:#161616;display:flex;gap:8px;align-items:center;flex-shrink:0\">'+\n'<span style=\"font-size:12px;opacity:.75;flex:1;overflow:hidden;text-overflow:ellipsis\">'+(g.name||\"Spiel\")+'</span>'+\n'<button type=\"button\" class=\"btn btn-s\" id=\"'+wid+'_px\" style=\"padding:4px 10px;font-size:12px\">Proxy</button>'+\n'<button type=\"button\" class=\"btn btn-s\" id=\"'+wid+'_fs\" style=\"padding:4px 10px;font-size:12px\">Vollbild</button></div>'+\n'<iframe id=\"'+wid+'_fr\" src=\"'+src+'\" allow=\"fullscreen; gamepad; autoplay\" referrerpolicy=\"no-referrer\" style=\"flex:1;width:100%;border:none;background:#000\"></iframe></div>';\nvar useP=/translate\\.google/.test(src);\n$(wid+\"_px\").onclick=function(){useP=!useP;$(wid+\"_fr\").src=useP?(\"https://translate.google.com/translate?hl=de&sl=auto&tl=de&u=\"+encodeURIComponent(raw)):raw;};\n$(wid+\"_fs\").onclick=function(){var fr=$(wid+\"_fr\");if(fr.requestFullscreen)fr.requestFullscreen();};\nreturn;\n}\nc.innerHTML='<div class=\"gplay\"><canvas id=\"'+wid+'_cv\" width=\"360\" height=\"400\"></canvas><div class=\"ginfo\" id=\"'+wid+'_info\"></div></div>';\nvar E=window.W5Engines||{},fn=E[g.engine]||E.snake;if(fn)fn($(wid+\"_cv\"),$(wid+\"_cv\").getContext(\"2d\"),$(wid+\"_info\"),g.seed||1);\n}\n";
var NEW_DRAG="function setupDrag(el,id){\nvar bar=el.querySelector(\"[data-drag]\");if(!bar)return;\nbar.style.touchAction=\"none\";bar.style.cursor=\"grab\";bar.style.userSelect=\"none\";\nvar dragging=false,ox=0,oy=0,sl=0,st=0;\nfunction down(x,y,e){\nvar w=wins.get(id);if(!w||w.max)return;\nif(e&&e.target&&e.target.closest&&e.target.closest(\".wb,button,input,a\"))return;\ndragging=true;ox=x;oy=y;sl=parseFloat(el.style.left)||0;st=parseFloat(el.style.top)||0;\nfocusW(id);bar.style.cursor=\"grabbing\";\ntry{if(e&&e.pointerId!=null)bar.setPointerCapture(e.pointerId);}catch(err){}\n}\nfunction move(x,y){if(!dragging)return;el.style.left=Math.max(0,Math.min((window.innerWidth||800)-60,sl+x-ox))+\"px\";el.style.top=Math.max(0,Math.min((window.innerHeight||600)-40,st+y-oy))+\"px\";}\nfunction up(){dragging=false;bar.style.cursor=\"grab\";}\nbar.onpointerdown=function(e){if(e.button&&e.button!==0)return;down(e.clientX,e.clientY,e);e.preventDefault();};\nbar.onpointermove=function(e){move(e.clientX,e.clientY);};\nbar.onpointerup=up;bar.onpointercancel=up;\nbar.onmousedown=function(e){down(e.clientX,e.clientY,e);e.preventDefault();};\nwindow.addEventListener(\"mousemove\",function(e){move(e.clientX,e.clientY);});\nwindow.addEventListener(\"mouseup\",up);\nbar.addEventListener(\"touchstart\",function(e){var t=e.touches[0];down(t.clientX,t.clientY,e);},{passive:true});\nbar.addEventListener(\"touchmove\",function(e){if(!dragging)return;e.preventDefault();var t=e.touches[0];move(t.clientX,t.clientY);},{passive:false});\nbar.addEventListener(\"touchend\",up);\n}\n";

fetch(SRC+"?t="+Date.now()).then(function(r){return r.text();}).then(function(code){
  var i,j;
  i=code.indexOf("function loadGames()");
  j=code.indexOf("function gamesFolder",i);
  if(i>=0&&j>i)code=code.slice(0,i)+NEW_LOAD+"\n"+code.slice(j);

  i=code.indexOf("function playGame");
  j=code.indexOf("function robloxApp",i);
  if(i>=0&&j>i)code=code.slice(0,i)+NEW_PLAY+"\n"+code.slice(j);

  i=code.indexOf("function setupDrag");
  j=code.indexOf("function clock",i);
  if(i>=0&&j>i)code=code.slice(0,i)+NEW_DRAG+"\n"+code.slice(j);

  code=code.split('var g=list.find(function(x){return x.id===+b.getAttribute("data-id");});')
    .join('var id=b.getAttribute("data-id");var g=list.find(function(x){return String(x.id)===String(id);});');

  code=code.replace(/fr\.setAttribute\("allow","fullscreen"\);/g,
    'fr.setAttribute("allow","fullscreen");fr.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms allow-presentation allow-downloads");');

  code=code.replace(
    /pane\.appendChild\(fr\);/g,
    'if(!fr.getAttribute("sandbox"))fr.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms allow-presentation allow-downloads");pane.appendChild(fr);'
  );

  code=code.replace(
    'boot().then(login).then(function(){desktop();clock();toast("Windos 5","Terminal: help","⬛");});',
    'boot().then(login).then(function(){desktop();clock();toast("Windos 5","Ziehen · Spiele-Proxy · intern","⬛");try{window.open=function(){toast("Browser","Kein neuer Tab","🌊");return null;};}catch(e){}});'
  );

  var s=document.createElement("script");
  s.textContent=code;
  document.body.appendChild(s);
}).catch(function(e){
  document.body.innerHTML="<pre style=\"color:#f55;padding:20px\">PC load failed: "+e+"</pre>";
});
})();
