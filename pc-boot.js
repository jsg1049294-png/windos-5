(function(){
var SRC="https://raw.githubusercontent.com/jsg1049294-png/windos-5/d4fb8888b469ef5101665fc65a54e0a4be58ad9e/pc.js";
fetch(SRC+"?t="+Date.now()).then(function(r){return r.text();}).then(function(code){
  var s=document.createElement("script");s.textContent=code;document.body.appendChild(s);
  ["fixup1.js","fixup2.js"].forEach(function(f){
    var x=document.createElement("script");x.src=f+"?t="+Date.now();document.body.appendChild(x);
  });
}).catch(function(e){document.body.innerHTML="<pre style=color:#f55>Load fail: "+e+"</pre>";});
})();
