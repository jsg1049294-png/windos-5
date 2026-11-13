(function(){
var SRC="https://raw.githubusercontent.com/jsg1049294-png/windos-5/d4fb8888b469ef5101665fc65a54e0a4be58ad9e/pc.js";
function loadTxt(url){return fetch(url+"?t="+Date.now()).then(function(r){return r.text();});}
fetch(SRC+"?t="+Date.now()).then(function(r){return r.text();}).then(function(code){
  var s=document.createElement("script");s.textContent=code;document.body.appendChild(s);
  return Promise.all([
    loadTxt("fixup1a.txt"),loadTxt("fixup1b.txt"),
    loadTxt("fixup2a.txt"),loadTxt("fixup2b.txt")
  ]);
}).then(function(parts){
  [parts[0]+parts[1], parts[2]+parts[3]].forEach(function(code){
    var s=document.createElement("script");s.textContent=code;document.body.appendChild(s);
  });
}).catch(function(e){document.body.innerHTML="<pre style=color:#f55>Load fail: "+e+"</pre>";});
})();
