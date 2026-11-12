(function(){
window.W5Games=window.W5Games||{};
window.W5Games[8]=function(cv,ctx,info){
var y=200,vy=0,pipes=[{x:360,gap:140}],sc=0,dead=0;
info.textContent="Tippen = fliegen";
var iv=setInterval(function(){
  if(dead)return;
  vy+=0.4;y+=vy;
  pipes.forEach(function(p){
    p.x-=2;
    if(p.x<-40){p.x=360;p.gap=70+Math.random()*180;sc++;info.textContent="Score "+sc;}
    if(p.x<50&&p.x>0&&(y<p.gap||y>p.gap+80)){dead=1;info.textContent="Game Over "+sc;}
  });
  if(y>400||y<0){dead=1;info.textContent="Game Over "+sc;}
  ctx.fillStyle="#87ceeb";ctx.fillRect(0,0,360,400);
  pipes.forEach(function(p){ctx.fillStyle="#0a0";ctx.fillRect(p.x,0,40,p.gap);ctx.fillRect(p.x,p.gap+80,40,400);});
  ctx.fillStyle="#ff1b2d";ctx.beginPath();ctx.arc(40,y,12,0,6.3);ctx.fill();
},16);
function flap(e){e.preventDefault();if(!dead)vy=-6;}
cv.onmousedown=flap;cv.ontouchstart=flap;
return function(){clearInterval(iv);};
};
})();
