(function(){
window.W5Games=window.W5Games||{};
window.W5Games[1]=function(cv,ctx,info){
var W=360,H=400,parts=[],drag=null;
function add(x,y){parts.push({x:x,y:y,vx:0,vy:0,r:14});}
add(180,80);add(150,140);add(210,140);
info.textContent="Klick = Körper · Ziehen = bewegen";
var raf;
function loop(){
  ctx.fillStyle="#0d0d12";ctx.fillRect(0,0,W,H);
  for(var i=0;i<parts.length;i++){
    var p=parts[i];
    if(drag!==p){p.vy+=0.25;p.vx*=0.99;p.vy*=0.99;p.x+=p.vx;p.y+=p.vy;}
    if(p.y+p.r>H){p.y=H-p.r;p.vy*=-0.5;}
    if(p.x<p.r){p.x=p.r;p.vx*=-0.5;}
    if(p.x+p.r>W){p.x=W-p.r;p.vx*=-0.5;}
    for(var j=0;j<parts.length;j++){
      var o=parts[j];if(o===p)continue;
      var dx=o.x-p.x,dy=o.y-p.y,d=Math.hypot(dx,dy)||1,m=p.r+o.r;
      if(d<m){var nx=dx/d,ny=dy/d,ov=m-d;p.x-=nx*ov/2;p.y-=ny*ov/2;o.x+=nx*ov/2;o.y+=ny*ov/2;}
    }
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.3);ctx.fillStyle="#ff1b2d";ctx.fill();
  }
  raf=requestAnimationFrame(loop);
}
loop();
function pos(e){var r=cv.getBoundingClientRect();var t=e.touches?e.touches[0]:e;return{x:(t.clientX-r.left)*(W/r.width),y:(t.clientY-r.top)*(H/r.height)};}
function down(e){e.preventDefault();var p=pos(e);for(var i=parts.length-1;i>=0;i--){if(Math.hypot(parts[i].x-p.x,parts[i].y-p.y)<18){drag=parts[i];return;}}add(p.x,p.y);}
function move(e){if(!drag)return;e.preventDefault();var p=pos(e);drag.vx=(p.x-drag.x)*0.5;drag.vy=(p.y-drag.y)*0.5;drag.x=p.x;drag.y=p.y;}
cv.onmousedown=down;cv.onmousemove=move;window.addEventListener("mouseup",function(){drag=null;});
cv.ontouchstart=down;cv.ontouchmove=move;cv.ontouchend=function(){drag=null;};
return function(){cancelAnimationFrame(raf);};
};
})();
