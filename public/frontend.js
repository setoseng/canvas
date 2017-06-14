var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var mouse_down = false;
var past;
var current;
var server = io();
var color = 'black';

server.on('connect', function(socket){
  console.log('Connected');
});
server.on('line-broadcast', function(msg){
  draw(msg.past, msg.current, msg.color);
});

function draw(past, current, clr){
  console.log(past, current, color);
  ctx.beginPath();
  ctx.strokeStyle = clr;
  ctx.lineWidth = 5;
  ctx.moveTo(past[0], past[1]);
  ctx.quadraticCurveTo(
    past[0], past[1],
    current[0], current[1]
  );
  ctx.stroke();
  ctx.closePath();
}
ctx.beginPath();
canvas.addEventListener('mousedown', function(event){
  mouse_down = true;
  console.log('down', event.offsetX, event.offsetY);
});
canvas.addEventListener('mouseup', function(event){
  mouse_down = false;
  past = null;
  console.log('up', event.offsetX, event.offsetY);
});
canvas.addEventListener('mousemove', function(event){
  if (mouse_down){
    current = [event.offsetX, event.offsetY];
    console.log('move', event.offsetX, event.offsetY);
    if (past){
      server.emit('draw-line',{past: past, current: current, color: color});
      //draw(past,current);
    }
    past = [event.offsetX,event.offsetY];
  }
});

$("#red").on('click', function(){
  color = 'red';
});
$("#blue").on('click', function(){
  color = 'blue';
});
$("#green").on('click', function(){
  color = 'green';
});
