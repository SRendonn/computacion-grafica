const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

function drawFace() {
  ctx.beginPath();
  ctx.arc(200, 200, 100, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.closePath();
}

function drawEyes() {
  ctx.beginPath();
  ctx.ellipse(180, 175, 4, 25, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.ellipse(220, 175, 4, 25, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

function drawMouth() {
  ctx.beginPath();
  ctx.moveTo(160, 220);
  ctx.arc(200, 220, 40, 0, Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(200, 255, 20, 0, Math.PI, true);
  ctx.fillStyle = '#ff6666';
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.ellipse(200, 250, 23, 10, 0, 0, Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

drawFace();
drawEyes();
drawMouth();
