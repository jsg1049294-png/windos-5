(function(){
var SRC="https://raw.githubusercontent.com/jsg1049294-png/windos-5/d4fb8888b469ef5101665fc65a54e0a4be58ad9e/pc.js";
var F1="https://cdn.jsdelivr.net/gh/jsg1049294-png/windos5-io-classic@main/w5-fixup1.js";
var F2="https://cdn.jsdelivr.net/gh/jsg1049294-png/windos5-io-classic@main/w5-fixup2.js";
fetch(SRC+"?t="+Date.now()).then(function(r){return r.text();}).then(function(code){
  var s=document.createElement("script");s.textContent=code;document.body.appendChild(s);
  function load(u){var x=document.createElement("script");x.src=u+(u.indexOf("?")>=0?"&":"?")+"t="+Date.now();document.body.appendChild(x);}
  load(F1);load(F2);
}).catch(function(e){document.body.innerHTML="<pre style=color:#f55>Load fail: "+e+"</pre>";});
})();
