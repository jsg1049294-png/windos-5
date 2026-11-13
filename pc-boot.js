(function(){
var SRC="https://raw.githubusercontent.com/jsg1049294-png/windos-5/d4fb8888b469ef5101665fc65a54e0a4be58ad9e/pc.js";
fetch(SRC+"?t="+Date.now()).then(function(r){return r.text();}).then(function(code){
  code=code.replace(
    'boot().then(login).then(function(){desktop();clock();toast("Windos 5","Terminal: help","⬛");});',
    'boot().then(login).then(function(){desktop();clock();toast("Windos 5","OK","⬛");});'
  );
  var s=document.createElement("script");s.textContent=code;document.body.appendChild(s);
  var f=document.createElement("script");f.src="pc-fixup.js?t="+Date.now();document.body.appendChild(f);
}).catch(function(e){document.body.innerHTML="<pre style=color:#f55>Load fail: "+e+"</pre>";});
})();
