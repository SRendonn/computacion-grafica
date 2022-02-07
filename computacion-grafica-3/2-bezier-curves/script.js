const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function lerp(t, p1, p2) {
  return (1 - t) * p1 + t * p2;
}

function reduce(t, p1, p2, ...ps) {
  if (ps.length) return [lerp(t, p1, p2), ...reduce(t, p2, ...ps)];
  return [lerp(t, p1, p2)];
}

function deCasteljau(t, ps) {
  if (ps.length > 1) return deCasteljau(t, reduce(t, ...ps));
  return ps[0];
}

function paintSegments(x, y) {
  if (x.length > 1 && y.length > 1 && x.length == y.length) {
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    for (let i = 0; i < x.length; i++) {
      ctx.lineTo(x[i], y[i]);
      ctx.stroke();
      ctx.moveTo(x[i], y[i]);
    }
    ctx.closePath();
  }
}

function paintBezierCurve(x, y, spacing) {
  if (x.length && y.length && x.length == y.length) {
    ctx.moveTo(x[0], y[0]);
    ctx.beginPath();
    ctx.strokeStyle = '#aa0000';
    for (let t = 0; t <= 1; t = t + spacing) {
      x_t = deCasteljau(t, x);
      y_t = deCasteljau(t, y);
      ctx.lineTo(x_t, y_t);
      ctx.moveTo(x_t, y_t);
    }
    ctx.lineTo(x[x.length - 1], y[y.length - 1]);
    ctx.stroke();
    ctx.closePath();
  }
}

const x = [50, 150, 400, 500];
const y = [300, 100, 110, 300];

const tRange = document.getElementById('t-range');
let spacing = tRange.value;

tRange.addEventListener('change', function () {
  spacing = this.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paintSegments(x, y);
  paintBezierCurve(x, y, Number.parseFloat(spacing));
});
