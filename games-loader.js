(function(){
window.W5loadGamesCatalog=function(){
var sources=[
"https://cdn.jsdelivr.net/gh/jsg1049294-png/windos5-io-classic@main/games.json",
"https://cdn.jsdelivr.net/gh/jsg1049294-png/windos5-io-shooters@main/games.json",
"https://cdn.jsdelivr.net/gh/jsg1049294-png/windos5-io-survival@main/games.json",
"https://cdn.jsdelivr.net/gh/jsg1049294-png/windos5-io-party@main/games.json",
"https://cdn.jsdelivr.net/gh/jsg1049294-png/windos5-io-sandbox@main/games.json"
];
return Promise.all(sources.map(function(u){
return fetch(u).then(function(r){return r.json();}).catch(function(){return{games:[]};});
})).then(function(parts){
var list=[],seen={};
parts.forEach(function(p){(p.games||[]).forEach(function(g){
if(seen[g.id]||seen[g.url])return;seen[g.id]=1;seen[g.url]=1;list.push(g);
});});
list.sort(function(a,b){return (b.featured?1:0)-(a.featured?1:0);});
return fetch("https://playkovo.com/api/embed-games?format=json").then(function(r){return r.json();}).then(function(data){
(data.games||[]).forEach(function(g,i){
var url=g.embedUrl||"";if(!url||seen[url])return;seen[url]=1;
list.push({id:"pk"+(i+1),name:g.title||g.gameName||("Online "+(i+1)),sub:"Online · HTML5",type:"embed",url:url,preview:g.thumbnailUrl||g.thumbnail||""});
});
return list;
}).catch(function(){return list;});
});
};
})();
