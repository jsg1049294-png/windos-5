(function(){
var SRC="https://raw.githubusercontent.com/jsg1049294-png/windos-5/d4fb8888b469ef5101665fc65a54e0a4be58ad9e/pc.js";
var F1="https://raw.githubusercontent.com/jsg1049294-png/windos5-io-classic/main/w5-fixup1.js";
var F2="https://raw.githubusercontent.com/jsg1049294-png/windos5-io-classic/main/w5-fixup2.js";
var FG="https://raw.githubusercontent.com/jsg1049294-png/windos5-io-classic/main/w5-games.js";
var FF="https://raw.githubusercontent.com/jsg1049294-png/windos5-io-classic/main/w5-frate.js";
fetch(SRC+"?t="+Date.now()).then(function(r){return r.text();}).then(function(code){
  var s=document.createElement("script");s.textContent=code;document.body.appendChild(s);
  function load(u,delay){
    setTimeout(function(){
      var x=document.createElement("script");
      x.src=u+(u.indexOf("?")>=0?"&":"?")+"t="+Date.now();
      document.body.appendChild(x);
    },delay);
  }
  load(F1,40);
  load(F2,120);
  load(FG,200);
  load(FF,280);
}).catch(function(e){document.body.innerHTML="<pre style=color:#f55>Load fail: "+e+"</pre>";});
})();
