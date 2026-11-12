(function(){
window.W5Games=window.W5Games||{};
window.W5Games[6]=function(cv,ctx,info){
var b=["","","","","","","","",""],turn="X",over=0;
info.textContent="Du bist X";
function draw(){
  ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);ctx.strokeStyle="#444";
  for(var i=1;i<3;i++){ctx.beginPath();ctx.moveTo(i*120,20);ctx.lineTo(i*120,380);ctx.stroke();ctx.beginPath();ctx.moveTo(0,20+i*120);ctx.lineTo(360,20+i*120);ctx.stroke();}
  ctx.font="48px sans-serif";ctx.textAlign="center";ctx.fillStyle="#fff";
  b.forEach(function(v,i){if(v)ctx.fillText(v,(i%3)*120+60,20+(0|(i/3))*120+75);});
}
function win(p){return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(function(L){return L.every(function(i){return b[i]===p;});});}
draw();
cv.onclick=function(e){
  if(over)return;
  var r=cv.getBoundingClientRect();
  var x=(e.clientX-r.left)*(360/r.width),y=(e.clientY-r.top)*(400/r.height)-20;
  var i=(0|(y/120))*3+(0|(x/120));
  if(i<0||i>8||b[i])return;
  b[i]=turn;
  if(win(turn)){over=1;info.textContent=turn+" gewinnt";draw();return;}
  if(b.every(Boolean)){over=1;info.textContent="Unentschieden";draw();return;}
  turn=turn==="X"?"O":"X";info.textContent="Zug "+turn;draw();
};
return function(){};
};
})();
