(function(){
window.W5Games=window.W5Games||{};
window.W5Games[2]=function(cv,ctx,info){
var S=20,snake=[{x:5,y:10}],dir={x:1,y:0},food={x:12,y:8},dead=false,sc=0;
info.textContent="Pfeile / Tippen · Score 0";
var iv=setInterval(function(){
  if(dead)return;
  var h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(h.x<0||h.y<0||h.x>=18||h.y>=20||snake.some(function(s){return s.x===h.x&&s.y===h.y;})){dead=true;info.textContent="Game Over "+sc;return;}
  snake.unshift(h);
  if(h.x===food.x&&h.y===food.y){sc++;food={x:0|Math.random()*18,y:0|Math.random()*20};info.textContent="Score "+sc;}
  else snake.pop();
  ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);
  ctx.fillStyle="#0f0";snake.forEach(function(s){ctx.fillRect(s.x*S,s.y*S,S-1,S-1);});
  ctx.fillStyle="#f44";ctx.fillRect(food.x*S,food.y*S,S-1,S-1);
},120);
function kd(e){var k=e.key;if(k==="ArrowUp"&&!dir.y)dir={x:0,y:-1};if(k==="ArrowDown"&&!dir.y)dir={x:0,y:1};if(k==="ArrowLeft"&&!dir.x)dir={x:-1,y:0};if(k==="ArrowRight"&&!dir.x)dir={x:1,y:0};}
window.addEventListener("keydown",kd);
cv.onclick=function(e){var r=cv.getBoundingClientRect();var x=e.clientX-r.left,y=e.clientY-r.top;if(y<130&&!dir.y)dir={x:0,y:-1};else if(y>270&&!dir.y)dir={x:0,y:1};else if(x<180&&!dir.x)dir={x:-1,y:0};else if(!dir.x)dir={x:1,y:0};};
return function(){clearInterval(iv);window.removeEventListener("keydown",kd);};
};
})();
