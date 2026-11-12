(function(){
window.W5Games=window.W5Games||{};
window.W5Games[9]=function(cv,ctx,info){
var N=15,C=24,g=[],px=1,py=1;
for(var y=0;y<N;y++){g[y]=[];for(var x=0;x<N;x++)g[y][x]=1;}
function carve(x,y){
  g[y][x]=0;
  [[0,-2],[0,2],[-2,0],[2,0]].sort(function(){return Math.random()-0.5;}).forEach(function(d){
    var nx=x+d[0],ny=y+d[1];
    if(ny>0&&ny<N-1&&nx>0&&nx<N-1&&g[ny][nx]===1){g[y+d[1]/2][x+d[0]/2]=0;carve(nx,ny);}
  });
}
carve(1,1);g[N-2][N-2]=0;
info.textContent="Ausgang unten rechts";
function draw(){
  ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);
  for(var y=0;y<N;y++)for(var x=0;x<N;x++){ctx.fillStyle=g[y][x]?"#333":"#1a1a1a";ctx.fillRect(x*C,y*C+10,C-1,C-1);}
  ctx.fillStyle="#0f0";ctx.fillRect((N-2)*C,(N-2)*C+10,C-1,C-1);
  ctx.fillStyle="#ff1b2d";ctx.fillRect(px*C+4,py*C+14,C-8,C-8);
}
draw();
function move(dx,dy){
  var nx=px+dx,ny=py+dy;
  if(nx>=0&&ny>=0&&nx<N&&ny<N&&!g[ny][nx]){px=nx;py=ny;draw();if(px===N-2&&py===N-2)info.textContent="Geschafft!";}
}
function kd(e){if(e.key==="ArrowUp")move(0,-1);if(e.key==="ArrowDown")move(0,1);if(e.key==="ArrowLeft")move(-1,0);if(e.key==="ArrowRight")move(1,0);}
window.addEventListener("keydown",kd);
cv.onclick=function(e){var r=cv.getBoundingClientRect();var x=e.clientX-r.left-px*C-C/2,y=e.clientY-r.top-py*C-10-C/2;if(Math.abs(x)>Math.abs(y))move(x>0?1:-1,0);else move(0,y>0?1:-1);};
return function(){window.removeEventListener("keydown",kd);};
};
})();
