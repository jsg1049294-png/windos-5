(function(){
var SRC="https://raw.githubusercontent.com/jsg1049294-png/windos-5/d4fb8888b469ef5101665fc65a54e0a4be58ad9e/pc.js";
var NEW_LOAD="function loadGames(){if(gameList)return Promise.resolve(gameList);var loader=window.W5loadGamesCatalog;if(typeof loader===\"function\"){return loader().then(function(list){gameList=list||[];return gameList;});}gameList=[];return Promise.resolve(gameList);}";
fetch(SRC+"?t="+Date.now()).then(function(r){return r.text();}).then(function(code){
var i=code.indexOf("function loadGames()");
var j=code.indexOf("function gamesFolder",i);
if(i>=0&&j>i)code=code.slice(0,i)+NEW_LOAD+"\n"+code.slice(j);
code=code.split('var g=list.find(function(x){return x.id===+b.getAttribute("data-id");});').join('var id=b.getAttribute("data-id");var g=list.find(function(x){return String(x.id)===String(id);});');
var s=document.createElement("script");s.textContent=code;document.body.appendChild(s);
}).catch(function(e){document.body.innerHTML="<pre style=color:#f55;padding:20px>PC load failed: "+e+"</pre>";});
})();
