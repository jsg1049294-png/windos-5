(function(){
window.W5Games=window.W5Games||{};
window.W5Games[3]=function(cv,ctx,info){
var bx=180,by=200,vx=3,vy=2,py=160,sc=0;
info.textContent="Schläger bewegen";
var iv=setInterval(function(){
  bx+=vx;by+=vy;
  if(by<0||by>400)vy*=-1;
  if(bx<20&&by>py&&by<py+60){vx=Math.abs(vx)+0.15;sc++;info.textContent="Score "+sc;}
  if(bx>350)vx*=-1;
  if(bx<0){bx=180;by=200;vx=3;sc=0;}
  ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);
  ctx.fillStyle="#fff";ctx.fillRect(10,py,8,60);
  ctx.beginPath();ctx.arc(bx,by,8,0,6.3);ctx.fill();
},16);
cv.onmousemove=function(e){var r=cv.getBoundingClientRect();py=Math.max(0,Math.min(340,(e.clientY-r.top)*(400/r.height)-30));};
return function(){clearInterval(iv);};
};
})();
