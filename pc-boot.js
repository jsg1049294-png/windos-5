(function(){
var n=7;
var scripts=[];
for(var i=0;i<n;i++){
  var s=document.createElement("script");
  s.src="p"+i+".js?t="+Date.now();
  scripts.push(new Promise(function(res,rej){s.onload=res;s.onerror=rej;}));
  document.head.appendChild(s);
}
Promise.all(scripts).then(function(){
  var code=(window.__W5C||[]).join("");
  if(!code||code.length<1000){document.body.innerHTML="<pre style=color:#f55>PC parts missing</pre>";return;}
  var s=document.createElement("script");
  s.textContent=code;
  document.body.appendChild(s);
}).catch(function(e){
  document.body.innerHTML="<pre style=color:#f55>PC load: "+e+"</pre>";
});
})();
