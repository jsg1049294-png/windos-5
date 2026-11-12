(function(){
window.W5Games=window.W5Games||{};
window.W5Games[7]=function(cv,ctx,info){
var sc=0,R=40;
info.textContent="Klick den Kreis";
function draw(){
  ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);
  ctx.beginPath();ctx.arc(180,200,R,0,6.3);ctx.fillStyle="#ff1b2d";ctx.fill();
  ctx.fillStyle="#fff";ctx.font="20px sans-serif";ctx.textAlign="center";ctx.fillText(String(sc),180,206);
}
draw();
cv.onclick=function(e){
  var r=cv.getBoundingClientRect();
  var x=(e.clientX-r.left)*(360/r.width),y=(e.clientY-r.top)*(400/r.height);
  if(Math.hypot(x-180,y-200)<R){sc++;R=Math.max(18,40-sc/4);info.textContent="Punkte "+sc;draw();}
};
return function(){};
};
})();
