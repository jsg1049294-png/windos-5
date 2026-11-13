(function(){
var n=5;
var fetches=[];
for(var i=0;i<n;i++)fetches.push(fetch("pc.b64."+i+".txt?t="+Date.now()).then(function(r){return r.text();}));
Promise.all(fetches).then(function(parts){
try{
var code=atob(parts.join("").replace(/\s/g,""));
var s=document.createElement("script");
s.textContent=code;
document.body.appendChild(s);
}catch(e){document.body.innerHTML="<pre style=color:red>PC load error: "+e.message+"</pre>";}
});
})();
