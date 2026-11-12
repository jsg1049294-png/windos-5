(function(){
"use strict";
var E=window.W5Engines={};
E.snake=function(cv,ctx,info,seed){
var S=20,snake=[{x:5,y:10}],dir={x:1,y:0},food={x:12,y:8},dead=false,sc=0;
var speed=Math.max(80,140-((seed||1)%40));
info.textContent="Pfeile/Tippen · Score 0";
var iv=setInterval(function(){
if(dead)return;
var h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
if(h.x<0||h.y<0||h.x>=18||h.y>=20||snake.some(function(s){return s.x===h.x&&s.y===h.y;})){dead=true;info.textContent="Game Over "+sc;return;}
snake.unshift(h);
if(h.x===food.x&&h.y===food.y){sc++;food={x:0|Math.random()*18,y:0|Math.random()*20};info.textContent="Score "+sc;}else snake.pop();
ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);
ctx.fillStyle="#0f0";snake.forEach(function(s){ctx.fillRect(s.x*S,s.y*S,S-1,S-1);});
ctx.fillStyle="#f44";ctx.fillRect(food.x*S,food.y*S,S-1,S-1);
},speed);
function kd(e){var k=e.key;if(k==="ArrowUp"&&!dir.y)dir={x:0,y:-1};if(k==="ArrowDown"&&!dir.y)dir={x:0,y:1};if(k==="ArrowLeft"&&!dir.x)dir={x:-1,y:0};if(k==="ArrowRight"&&!dir.x)dir={x:1,y:0};}
window.addEventListener("keydown",kd);
cv.onclick=function(e){var r=cv.getBoundingClientRect();var x=e.clientX-r.left,y=e.clientY-r.top;if(y<130&&!dir.y)dir={x:0,y:-1};else if(y>270&&!dir.y)dir={x:0,y:1};else if(x<180&&!dir.x)dir={x:-1,y:0};else if(!dir.x)dir={x:1,y:0};};
return function(){clearInterval(iv);window.removeEventListener("keydown",kd);};
};
E.pong=function(cv,ctx,info){
var bx=180,by=200,vx=3,vy=2,py=160,sc=0;
info.textContent="Schläger bewegen";
var iv=setInterval(function(){
bx+=vx;by+=vy;if(by<8||by>392)vy*=-1;
if(bx<22&&by>py&&by<py+60){vx=Math.abs(vx)+0.12;sc++;info.textContent="Score "+sc;}
if(bx>352)vx=-Math.abs(vx);if(bx<0){bx=180;by=200;vx=3;sc=0;info.textContent="Score 0";}
ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);ctx.fillStyle="#fff";ctx.fillRect(10,py,8,60);
ctx.beginPath();ctx.arc(bx,by,8,0,6.3);ctx.fill();
},16);
cv.onmousemove=function(e){var r=cv.getBoundingClientRect();py=Math.max(0,Math.min(340,(e.clientY-r.top)*(400/r.height)-30));};
cv.ontouchmove=function(e){e.preventDefault();var r=cv.getBoundingClientRect();py=Math.max(0,Math.min(340,(e.touches[0].clientY-r.top)*(400/r.height)-30));};
return function(){clearInterval(iv);};
};
E.clicker=function(cv,ctx,info,seed){
var sc=0,R=36+((seed||1)%20);
info.textContent="Klick den Kreis";
function draw(){ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);ctx.beginPath();ctx.arc(180,200,R,0,6.3);ctx.fillStyle="#ff1b2d";ctx.fill();ctx.fillStyle="#fff";ctx.font="20px sans-serif";ctx.textAlign="center";ctx.fillText(String(sc),180,206);}
draw();
cv.onclick=function(e){var r=cv.getBoundingClientRect();var x=(e.clientX-r.left)*(360/r.width),y=(e.clientY-r.top)*(400/r.height);if(Math.hypot(x-180,y-200)<R){sc++;R=Math.max(16,R-0.3);info.textContent="Punkte "+sc;draw();}};
return function(){};
};
E.reaction=function(cv,ctx,info){
var state="w",t0=0,best=null;
info.textContent="Warten auf Grün…";
ctx.fillStyle="#a00";ctx.fillRect(0,0,360,400);ctx.fillStyle="#fff";ctx.font="18px sans-serif";ctx.textAlign="center";ctx.fillText("Warten…",180,200);
var t=setTimeout(function(){state="go";t0=performance.now();ctx.fillStyle="#0a0";ctx.fillRect(0,0,360,400);ctx.fillStyle="#fff";ctx.fillText("JETZT!",180,200);info.textContent="LOS!";},1000+Math.random()*2000);
cv.onclick=function(){if(state==="w"){info.textContent="Zu früh!";clearTimeout(t);state="d";}else if(state==="go"){var ms=0|(performance.now()-t0);best=best===null?ms:Math.min(best,ms);info.textContent=ms+" ms · Best "+best;state="d";ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);ctx.fillStyle="#fff";ctx.fillText(ms+" ms",180,200);}};
return function(){clearTimeout(t);};
};
E.flappy=E.snake;E.breakout=E.pong;E.memory=E.clicker;E.tictactoe=E.clicker;E.maze=E.snake;E.ragdoll=E.pong;
})();
