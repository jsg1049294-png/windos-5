(function(){
window.W5Games=window.W5Games||{};
window.W5Games[5]=function(cv,ctx,info){
var s=["🍎","🍋","🍇","🍒","🥝","🍑"];
var syms=s.concat(s).sort(function(){return Math.random()-0.5;});
var cards=syms.map(function(x){return{s:x,open:0,done:0};});
var first=null,lock=0,pairs=0;
info.textContent="Memory";
function draw(){
  ctx.fillStyle="#111";ctx.fillRect(0,0,360,400);
  cards.forEach(function(c,i){
    var x=(i%4)*88+12,y=(0|(i/4))*90+40;
    ctx.fillStyle=c.done||c.open?"#2a2a2a":"#ff1b2d";
    ctx.fillRect(x,y,80,80);
    if(c.open||c.done){ctx.font="32px serif";ctx.fillText(c.s,x+24,y+52);}
  });
}
draw();
cv.onclick=function(e){
  if(lock)return;
  var r=cv.getBoundingClientRect();
  var x=(e.clientX-r.left)*(360/r.width),y=(e.clientY-r.top)*(400/r.height);
  var i=(0|((y-40)/90))*4+(0|((x-12)/88));
  if(i<0||i>11)return;
  var c=cards[i];if(c.done||c.open)return;
  c.open=1;draw();
  if(!first){first=c;return;}
  lock=1;
  setTimeout(function(){
    if(first.s===c.s){first.done=1;c.done=1;pairs++;info.textContent="Paare "+pairs+"/6";}
    else{first.open=0;c.open=0;}
    first=null;lock=0;draw();
  },450);
};
return function(){};
};
})();
