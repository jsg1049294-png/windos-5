(function(){
var n=13;
function load(i,parts){
  if(i>=n){
    try{
      var code=atob(parts.join(""));
      var s=document.createElement("script");
      s.textContent=code;
      document.body.appendChild(s);
    }catch(e){document.body.innerHTML="<pre style=color:#f55;padding:16px>PC error: "+e+"</pre>";}
    return;
  }
  fetch("c"+i+".b64?t="+Date.now()).then(function(r){return r.text();}).then(function(t){
    parts[i]=(t||"").replace(/\s+/g,"");
    load(i+1,parts);
  }).catch(function(e){
    document.body.innerHTML="<pre style=color:#f55;padding:16px>Chunk "+i+": "+e+"</pre>";
  });
}
load(0,[]);
})();
