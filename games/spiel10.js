(function(){
window.W5Games=window.W5Games||{};
window.W5Games[10]=function(cv,ctx,info){
var state="w",t0=0,best=null;
info.textContent="Warten auf Grün…";
ctx.fillStyle="#a00";ctx.fillRect(0,0,360,400);
ctx.fillStyle="#fff";ctx.font="18px sans-serif";ctx.textAlign="center";ctx.fillText("Warten…",180,200);
var t=setTimeout(function(){
  state="go";t0=performance.now();
  ctx.fillStyle="#0a0";ctx.fillRect(0,0,360,400);
  ctx.fillStyle="#fff";ctx.fillText("JETZT!",180,200);
  info.textContent="LOS!";
},1000+Math.random()*2000);
cv.onclick=function(){
  if(state==="w"){info.textContent="Zu früh!";clearTimeout(t);state="d";}
  else if(state==="go"){
    var ms=0|performance.now()-t0;
    best=best===null?ms:Math.min(best,ms);
    info.textContent=ms+" ms · Best "+best;state="d";
    ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);
    ctx.fillStyle="#fff";ctx.fillText(ms+" ms",180,200);
  }
};
return function(){clearTimeout(t);};
};
})();
