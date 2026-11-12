(function(){
window.W5Games=window.W5Games||{};
window.W5Games[4]=function(cv,ctx,info){
var bricks=[];for(var r=0;r<4;r++)for(var c=0;c<8;c++)bricks.push({x:c*44+8,y:r*22+30,w:40,h:16,on:1});
var px=150,bx=180,by=300,vx=2.5,vy=-2.5,sc=0;
info.textContent="Breakout";
var iv=setInterval(function(){
  bx+=vx;by+=vy;
  if(bx<0||bx>360)vx*=-1;if(by<0)vy*=-1;if(by>390){bx=180;by=300;vy=-2.5;}
  if(by>360&&bx>px&&bx<px+60)vy=-Math.abs(vy);
  bricks.forEach(function(b){if(b.on&&bx>b.x&&bx<b.x+b.w&&by>b.y&&by<b.y+b.h){b.on=0;vy*=-1;sc++;info.textContent="Score "+sc;}});
  ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);
  bricks.forEach(function(b){if(b.on){ctx.fillStyle="#ff1b2d";ctx.fillRect(b.x,b.y,b.w,b.h);}});
  ctx.fillStyle="#fff";ctx.fillRect(px,370,60,10);
  ctx.beginPath();ctx.arc(bx,by,6,0,6.3);ctx.fill();
},16);
cv.onmousemove=function(e){var r=cv.getBoundingClientRect();px=Math.max(0,Math.min(300,(e.clientX-r.left)*(360/r.width)-30));};
return function(){clearInterval(iv);};
};
})();
