(function() {
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('toggle');

const source = { x: 70, y: canvas.height / 2, r: 22 };
const electron = { x: 680, y: canvas.height / 2, nucleus: 14, shell: 55 };

let lightOn = false;
let beamLen = 0;
const speed = 8;
const beamStart = source.x + source.r;
const beamEnd = electron.x - electron.shell;
let offset = 0;

btn.addEventListener('click', () => {
  lightOn = !lightOn;
  btn.textContent = lightOn ? 'Stop' : 'Start';
  btn.classList.toggle('on', lightOn);
  if (!lightOn) beamLen = 0;
});

function drawSource() {
  ctx.save();
  if (lightOn) {
    ctx.shadowColor = '#ffeb3b';
    ctx.shadowBlur = 30;
  }
  ctx.fillStyle = lightOn ? '#ffeb3b' : '#666';
  ctx.beginPath();
  ctx.arc(source.x, source.y, source.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#aaa';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Light source', source.x, source.y + source.r + 22);
}

function drawElectron() {
  ctx.strokeStyle = '#4fc3f7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(electron.x, electron.y, electron.shell, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#4fc3f7';
  ctx.beginPath();
  ctx.arc(electron.x, electron.y, electron.nucleus, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#aaa';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Electron', electron.x, electron.y + electron.shell + 22);
}

function drawBeam() {
  if (!lightOn || beamLen <= 0) return;

  const x1 = beamStart;
  const x2 = beamStart + beamLen;
  ctx.save();

  const gradient = ctx.createLinearGradient(0, source.y - 10, 0, source.y + 10);
  gradient.addColorStop(0, 'rgba(255,235,59,0)');
  gradient.addColorStop(0.5, 'rgba(255,235,59,0.35)');
  gradient.addColorStop(1, 'rgba(255,235,59,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(x1, source.y - 10, x2 - x1, 20);

  ctx.strokeStyle = '#fff59d';
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 10]);
  ctx.lineDashOffset = -offset;
  ctx.beginPath();
  ctx.moveTo(x1, source.y);
  ctx.lineTo(x2, source.y);
  ctx.stroke();
  ctx.restore();
}

function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (lightOn) {
    beamLen = Math.min(beamLen + speed, beamEnd - beamStart);
    offset += speed * 0.6;
  }
  drawBeam();
  drawSource();
  drawElectron();
  requestAnimationFrame(frame);
}

frame();
})();

(function() {
    const cnt = document.getElementById('cnt');

const canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;

const button = document.createElement('button');
button.textContent = 'start';

cnt.append(canvas, button);

const ctx = canvas.getContext('2d');
const r = 15;
let x = 100, y = 100, dx = 2.5, dy = 2;
let rafId = null;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = 'tomato';
  ctx.fill();
}

function step() {
  x += dx;
  y += dy;
  if (x - r < 0) { x = r; dx = -dx; }
  else if (x + r > canvas.width) { x = canvas.width - r; dx = -dx; }
  if (y - r < 0) { y = r; dy = -dy; }
  else if (y + r > canvas.height) { y = canvas.height - r; dy = -dy; }
  draw();
  rafId = requestAnimationFrame(step);
}

button.addEventListener('click', () => {
  if (rafId === null) {
    button.textContent = 'stop';
    rafId = requestAnimationFrame(step);
  } else {
    cancelAnimationFrame(rafId);
    rafId = null;
    button.textContent = 'start';
  }
});

draw();
})();


(function() {
    const leftText = `PROMPT 1 (written by a programmer):
Create a simple app using Vanilla JS only. Its parent is a div element with variable name cnt. It should have a canvas element and a button element. The button is toggle button showing "start" and "stop". It triggers the motion of circle in the canvas. The circle should bounce when meet the canvas border. Size of canvas is 200px x 200px.

RESULT:
The prompt did not say which direction or how fast, so the AI chose a diagonal motion: x speed = 2 and y speed = 1.5 (different on each axis).

The ball needs a different amount of time to cross the width than the height, so the two rhythms do not line up. Every bounce lands on a slightly different spot, and the red dots spread along all four borders.`;

const rightText = `PROMPT 2 (written by a non-programmer):
Create a 200 pxl x 200 pxl canvas with Vanilla JS only. There is a small blue ball which on the center of canvas when it start. Under the canvas, there is a toogle button for start/stop option. When we click start, the ball will move regularly, and move opposite direction when it collides with the border.

RESULT:
"Move regularly" and "opposite direction" can be read as "go back and forth along one line". Here the ball moves only up and down (x speed = 0, y speed = 2).

It always travels the same distance between the same two borders, so it hits only 2 points, over and over. There is only one red dot at the top and one at the bottom.


 "moves diagonally at 45 degrees", or "different speed on each axis".`;

// Build one simulation panel
function createSim(parent, title, text, vx, vy) {
  const h2 = document.createElement("h2");
  h2.textContent = title;

  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;

  const button = document.createElement("button");
  button.textContent = "start";

  const area = document.createElement("textarea");
  area.readOnly = true;
  area.value = text;

  parent.append(h2, canvas, button, area);

  const ctx = canvas.getContext("2d");
  const ball = { x: 100, y: 100, r: 8, vx: vx, vy: vy };
  const hits = []; // contact points on the border
  let running = false;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    for (const p of hits) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function update() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x - ball.r <= 0 || ball.x + ball.r >= canvas.width) {
      ball.vx = -ball.vx;
      hits.push({ x: ball.x < 100 ? 0 : canvas.width, y: ball.y });
    }
    if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) {
      ball.vy = -ball.vy;
      hits.push({ x: ball.x, y: ball.y < 100 ? 0 : canvas.height });
    }
  }

  function loop() {
    if (!running) return;
    update();
    draw();
    requestAnimationFrame(loop);
  }

  button.addEventListener("click", () => {
    running = !running;
    button.textContent = running ? "stop" : "start";
    if (running) loop();
  });

  draw();
}

createSim(document.getElementById("left"), "Prompt 1: different speed on each axis", leftText, 2, 1.5);
createSim(document.getElementById("right"), "Prompt 2: regular back and forth", rightText, 0, 2);
})();

(function(){
// Parent container
const cnt = document.createElement('div');
cnt.style.cssText = 'display:inline-block;padding:12px;border:1px solid #888;border-radius:6px';
document.getElementById('wave-box').appendChild(cnt);

// Canvas
const canvas = document.createElement('canvas');
canvas.width = 700;
canvas.height = 300;
canvas.style.cssText = 'display:block;border:1px solid #ccc;background:#fff';
cnt.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Textarea (parameters)
const ta = document.createElement('textarea');
ta.rows = 5;
ta.cols = 40;
ta.style.cssText = 'display:block;margin-top:10px;font-family:monospace';
ta.value =
`amplitude = 80      (px)
period = 2          (s)
wavelength = 300    (px)
phase = 0           (degrees)`;
cnt.appendChild(ta);

// Toggle button
const btn = document.createElement('button');
btn.textContent = 'start';
btn.style.cssText = 'margin-top:10px;padding:6px 20px;font-size:16px';
cnt.appendChild(btn);

// State
let running = false;
let t = 0;          // wave time (s)
let last = 0;       // last frame timestamp
let rafId = null;

// Parse "name = number" lines; accepts English and Indonesian spellings
function readParams() {
  const p = { amplitude: 80, period: 2, wavelength: 300, phase: 0 };
  const alias = {
    amplitude: 'amplitude', amplitudo: 'amplitude', a: 'amplitude',
    period: 'period', periode: 'period', t: 'period',
    wavelength: 'wavelength', lambda: 'wavelength', panjang: 'wavelength',
    phase: 'phase', 'initial phase': 'phase', 'initial_phase': 'phase', fase: 'phase'
  };
  for (const line of ta.value.split('\n')) {
    const m = line.match(/^\s*([a-zA-Z_ ]+?)\s*[=:]\s*(-?\d*\.?\d+(?:e[-+]?\d+)?)/i);
    if (!m) continue;
    const key = alias[m[1].toLowerCase()];
    if (key) p[key] = parseFloat(m[2]);
  }
  if (!(p.period > 0)) p.period = 2;
  if (!(p.wavelength > 0)) p.wavelength = 300;
  return p;
}

// y(x,t) = A sin(2π(t/T − x/λ) + φ)  → travels toward +x
function draw() {
  const p = readParams();
  const w = canvas.width, h = canvas.height, mid = h / 2;
  const phi = p.phase * Math.PI / 180;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, mid);
  ctx.lineTo(w, mid);
  ctx.stroke();

  ctx.strokeStyle = '#1565c0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= w; x++) {
    const y = mid - p.amplitude *
      Math.sin(2 * Math.PI * (t / p.period - x / p.wavelength) + phi);
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function frame(now) {
  t += (now - last) / 1000;
  last = now;
  draw();
  rafId = requestAnimationFrame(frame);
}

btn.addEventListener('click', () => {
  running = !running;
  btn.textContent = running ? 'stop' : 'start';
  if (running) {
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  } else {
    cancelAnimationFrame(rafId);
  }
});

// Redraw when parameters are edited while stopped
ta.addEventListener('input', () => { if (!running) draw(); });

draw();

})();


(function() {
    const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const slider = document.getElementById('strength');
  const valLabel = document.getElementById('val');
  const flipBtn = document.getElementById('flip');

  const W = canvas.width, H = canvas.height;
  const magnet = { x: W/2, y: H/2, w: 260, h: 60, leftIsNorth: true };
  const compass = { x: W/2, y: H/2 + 150, r: 38, angle: 0, vel: 0 }; // angle = direction the red (N) end points
  let strength = 0.7;
  let dragging = false, offX = 0, offY = 0;

  slider.addEventListener('input', () => {
    strength = slider.value / 100;
    valLabel.textContent = slider.value + '%';
  });
  flipBtn.addEventListener('click', () => { magnet.leftIsNorth = !magnet.leftIsNorth; });

  // pole positions (magnetic "charges": North +1, South -1)
  function poles() {
    const l = { x: magnet.x - magnet.w/2 + 10, y: magnet.y, q: magnet.leftIsNorth ? 1 : -1 };
    const r = { x: magnet.x + magnet.w/2 - 10, y: magnet.y, q: magnet.leftIsNorth ? -1 : 1 };
    return [l, r];
  }

  // magnetic field vector at a point (points away from N, toward S)
  function field(px, py) {
    let bx = 0, by = 0;
    for (const p of poles()) {
      const dx = px - p.x, dy = py - p.y;
      const d2 = dx*dx + dy*dy + 400;       // softening avoids infinity
      const inv = p.q / (d2 * Math.sqrt(d2));
      bx += dx * inv; by += dy * inv;
    }
    return { bx, by };
  }

  // pointer handling
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
  }
  canvas.addEventListener('pointerdown', e => {
    const p = pos(e);
    if (Math.hypot(p.x - compass.x, p.y - compass.y) <= compass.r) {
      dragging = true; offX = compass.x - p.x; offY = compass.y - p.y;
      canvas.setPointerCapture(e.pointerId); canvas.classList.add('drag');
    }
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const p = pos(e);
    compass.x = Math.min(W - compass.r, Math.max(compass.r, p.x + offX));
    compass.y = Math.min(H - compass.r, Math.max(compass.r, p.y + offY));
  });
  const stop = () => { dragging = false; canvas.classList.remove('drag'); };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);

  // physics: needle aligns with field, damped spring
  function update() {
    const { bx, by } = field(compass.x, compass.y);
    const mag = Math.hypot(bx, by);
    if (mag > 1e-12) {
      const target = Math.atan2(by, bx);
      const diff = Math.atan2(Math.sin(target - compass.angle), Math.cos(target - compass.angle));
      compass.vel += 0.12 * strength * Math.min(1, mag * 9000 + 0.15) * Math.sin(diff);
    }
    compass.vel *= 0.90;                 // damping
    compass.angle += compass.vel;
  }

  // drawing
  function drawMagnet() {
    const x0 = magnet.x - magnet.w/2, y0 = magnet.y - magnet.h/2, half = magnet.w/2;
    const leftColor  = magnet.leftIsNorth ? '#e53935' : '#1e63e0';
    const rightColor = magnet.leftIsNorth ? '#1e63e0' : '#e53935';
    ctx.fillStyle = leftColor;  ctx.fillRect(x0, y0, half, magnet.h);
    ctx.fillStyle = rightColor; ctx.fillRect(x0 + half, y0, half, magnet.h);
    ctx.strokeStyle = '#222'; ctx.lineWidth = 3; ctx.strokeRect(x0, y0, magnet.w, magnet.h);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 34px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(magnet.leftIsNorth ? 'N' : 'S', x0 + half/2, magnet.y + 2);
    ctx.fillText(magnet.leftIsNorth ? 'S' : 'N', x0 + half*1.5, magnet.y + 2);
  }

  function drawCompass() {
    const { x, y, r, angle } = compass;
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.fillStyle = '#fdfdfd'; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = '#444'; ctx.stroke();
    ctx.rotate(angle);
    const L = r - 6, w = 7;
    ctx.beginPath(); ctx.moveTo(L, 0); ctx.lineTo(0, -w); ctx.lineTo(0, w); ctx.closePath();
    ctx.fillStyle = '#e53935'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#555'; ctx.stroke(); // North: red
    ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(0, -w); ctx.lineTo(0, w); ctx.closePath();
    ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.stroke();                                              // South: white
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.fillStyle = '#222'; ctx.fill();
    ctx.restore();
  }

  function loop() {
    update();
    ctx.clearRect(0, 0, W, H);
    drawMagnet();
    drawCompass();
    requestAnimationFrame(loop);
  }
  loop();
})();

  


// ===== 4. Magnetic field around a bar magnet =====
(() => {
  if (!document.getElementById('mg-canvas')) return; // duplicate magnet sim; its HTML doesn't exist, skip so lens below still runs
  const canvas = document.getElementById('mg-canvas');
  const ctx = canvas.getContext('2d');
  const slider = document.getElementById('mg-strength');
  const valLabel = document.getElementById('mg-val');
  const flipBtn = document.getElementById('mg-flip');

  const W = canvas.width, H = canvas.height;
  const magnet = { x: W/2, y: H/2, w: 260, h: 60, leftIsNorth: true };
  const compass = { x: W/2, y: H/2 + 150, r: 38, angle: 0, vel: 0 }; // angle = direction the red (N) end points
  let strength = 0.7;
  let dragging = false, offX = 0, offY = 0;

  slider.addEventListener('input', () => {
    strength = slider.value / 100;
    valLabel.textContent = slider.value + '%';
  });
  flipBtn.addEventListener('click', () => { magnet.leftIsNorth = !magnet.leftIsNorth; });

  // pole positions (magnetic "charges": North +1, South -1)
  function poles() {
    const l = { x: magnet.x - magnet.w/2 + 10, y: magnet.y, q: magnet.leftIsNorth ? 1 : -1 };
    const r = { x: magnet.x + magnet.w/2 - 10, y: magnet.y, q: magnet.leftIsNorth ? -1 : 1 };
    return [l, r];
  }

  // magnetic field vector at a point (points away from N, toward S)
  function field(px, py) {
    let bx = 0, by = 0;
    for (const p of poles()) {
      const dx = px - p.x, dy = py - p.y;
      const d2 = dx*dx + dy*dy + 400;       // softening avoids infinity
      const inv = p.q / (d2 * Math.sqrt(d2));
      bx += dx * inv; by += dy * inv;
    }
    return { bx, by };
  }

  // pointer handling
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
  }
  canvas.addEventListener('pointerdown', e => {
    const p = pos(e);
    if (Math.hypot(p.x - compass.x, p.y - compass.y) <= compass.r) {
      dragging = true; offX = compass.x - p.x; offY = compass.y - p.y;
      canvas.setPointerCapture(e.pointerId); canvas.classList.add('drag');
    }
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const p = pos(e);
    compass.x = Math.min(W - compass.r, Math.max(compass.r, p.x + offX));
    compass.y = Math.min(H - compass.r, Math.max(compass.r, p.y + offY));
  });
  const stop = () => { dragging = false; canvas.classList.remove('drag'); };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);

  // physics: needle aligns with field, damped spring
  function update() {
    const { bx, by } = field(compass.x, compass.y);
    const mag = Math.hypot(bx, by);
    if (mag > 1e-12) {
      const target = Math.atan2(by, bx);
      const diff = Math.atan2(Math.sin(target - compass.angle), Math.cos(target - compass.angle));
      compass.vel += 0.12 * strength * Math.min(1, mag * 9000 + 0.15) * Math.sin(diff);
    }
    compass.vel *= 0.90;                 // damping
    compass.angle += compass.vel;
  }

  // drawing
  function drawMagnet() {
    const x0 = magnet.x - magnet.w/2, y0 = magnet.y - magnet.h/2, half = magnet.w/2;
    const leftColor  = magnet.leftIsNorth ? '#e53935' : '#1e63e0';
    const rightColor = magnet.leftIsNorth ? '#1e63e0' : '#e53935';
    ctx.fillStyle = leftColor;  ctx.fillRect(x0, y0, half, magnet.h);
    ctx.fillStyle = rightColor; ctx.fillRect(x0 + half, y0, half, magnet.h);
    ctx.strokeStyle = '#222'; ctx.lineWidth = 3; ctx.strokeRect(x0, y0, magnet.w, magnet.h);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 34px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(magnet.leftIsNorth ? 'N' : 'S', x0 + half/2, magnet.y + 2);
    ctx.fillText(magnet.leftIsNorth ? 'S' : 'N', x0 + half*1.5, magnet.y + 2);
  }

  function drawCompass() {
    const { x, y, r, angle } = compass;
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.fillStyle = '#fdfdfd'; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = '#444'; ctx.stroke();
    ctx.rotate(angle);
    const L = r - 6, w = 7;
    ctx.beginPath(); ctx.moveTo(L, 0); ctx.lineTo(0, -w); ctx.lineTo(0, w); ctx.closePath();
    ctx.fillStyle = '#e53935'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#555'; ctx.stroke(); // North: red
    ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(0, -w); ctx.lineTo(0, w); ctx.closePath();
    ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.stroke();                                              // South: white
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.fillStyle = '#222'; ctx.fill();
    ctx.restore();
  }

  function loop() {
    update();
    ctx.clearRect(0, 0, W, H);
    drawMagnet();
    drawCompass();
    requestAnimationFrame(loop);
  }
  loop();
})();


(function() {
  (function () {
  const canvas = document.getElementById('lensCanvas');
  const ctx = canvas.getContext('2d');
  const dSlider = document.getElementById('lensD');
  const fSlider = document.getElementById('lensF');
  const dVal = document.getElementById('lensDVal');
  const fVal = document.getElementById('lensFVal');
  const info = document.getElementById('lensInfo');

  const W = canvas.width, H = canvas.height;
  const SCALE = 2.4;            // pixels per cm
  const CX = W / 2;             // lens position (x = 0 cm)
  const AY = H / 2;             // principal axis (y = 0 cm)
  const S = 240;                // distance pencil -> lens (cm), fixed
  const PENCIL_H = 60;          // pencil height (cm)

  // cm -> pixel helpers (physics: x right, y up; lens at origin)
  const px = x => CX + x * SCALE;
  const py = y => AY - y * SCALE;

  function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(px(x1), py(y1));
    ctx.lineTo(px(x2), py(y2));
    ctx.stroke();
  }

  // Pencil: base on the axis at x0 (cm), height h (cm); negative h = upside down
  function drawPencil(x0, h, color, tipColor, alpha) {
    const L = Math.abs(h) * SCALE;
    const w = Math.max(3, 7 * Math.abs(h) / PENCIL_H);
    const tip = Math.min(30, L * 0.25);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(px(x0), AY);
    if (h < 0) ctx.scale(1, -1);                  // flip for the inverted image
    ctx.fillStyle = color;
    ctx.fillRect(-w, -(L - tip), w * 2, L - tip); // body
    ctx.fillStyle = tipColor;
    ctx.beginPath();                              // sharpened tip
    ctx.moveTo(-w, -(L - tip));
    ctx.lineTo(w, -(L - tip));
    ctx.lineTo(0, -L);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawLens(D, f) {
    const r = D / 2 * SCALE;
    const t = 8 + 600 / f;                        // bulge: shorter f = thicker lens
    ctx.beginPath();
    ctx.moveTo(CX, AY - r);
    ctx.quadraticCurveTo(CX + t * 2, AY, CX, AY + r);
    ctx.quadraticCurveTo(CX - t * 2, AY, CX, AY - r);
    ctx.closePath();
    ctx.fillStyle = 'rgba(30,120,230,0.55)';
    ctx.fill();
    ctx.strokeStyle = '#1565c0';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function mark(x, label) {
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.arc(px(x), AY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '13px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(label, px(x), AY + 20);
  }

  function draw() {
    const D = +dSlider.value, f = +fSlider.value;
    dVal.textContent = D + ' cm';
    fVal.textContent = f + ' cm';

    // thin-lens equation: 1/f = 1/s + 1/s'
    const s = S;
    const si = (s * f) / (s - f);                 // s'  (always real: s > f)
    const m = si / s;                             // magnification size
    const h = PENCIL_H, hi = -h * m;              // image is inverted
    const R = 2 * f;                              // centre of curvature of a lens = 2f
    const half = D / 2;

    ctx.clearRect(0, 0, W, H);

    // dotted principal axis
    ctx.save();
    ctx.strokeStyle = '#9e9e9e';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 6]);
    ctx.beginPath(); ctx.moveTo(0, AY); ctx.lineTo(W, AY); ctx.stroke();
    ctx.restore();

    // focal points (F) and centres of curvature (R = 2F)
    ctx.fillStyle = '#555';
    mark(-f, 'F'); mark(f, 'F');
    mark(-R, 'R'); mark(R, 'R');

    drawLens(D, f);
    drawPencil(-s, h, '#fdd835', '#c79100', 1);              // object (left)
    drawPencil(si, hi, '#fdd835', '#fdd835', 0.3);           // shadow / image (right)

    // ---------- 3 special rays (black) ----------
    ctx.lineWidth = 1.6;

    // draws: object tip -> point on lens plane (y), then onward with given slope
    function ray(yLens, slopeAfter) {
      const hit = Math.abs(yLens) <= half;        // does the ray pass through the lens?
      ctx.strokeStyle = '#000';
      ctx.setLineDash(hit ? [] : [6, 5]);
      ctx.globalAlpha = hit ? 1 : 0.35;
      line(-s, h, 0, yLens);
      if (hit) line(0, yLens, W / SCALE, yLens + slopeAfter * (W / SCALE));
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    // Ray 1: parallel to axis -> refracted through the right focal point
    ray(h, -h / f);

    // Ray 2: through the left focal point -> leaves parallel to the axis
    const y2 = h - (h / (s - f)) * s;             // height where it meets the lens plane
    ray(y2, 0);

    // Ray 3: aimed at the centre of curvature R = 2f (left side) -> refracts to the image tip
    const y3 = (h * R) / (R - s);                 // height where it meets the lens plane
    if (isFinite(y3) && Math.abs(y3) < 1e4) ray(y3, (hi - y3) / si);

    // labels
    ctx.fillStyle = '#333';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('Object', px(-s) + 14, py(h) + 6);
    ctx.fillText('Shadow (image)', px(si) + 14, py(hi) + 4);

    info.innerHTML =
      's = ' + s + ' cm &nbsp;|&nbsp; s\' = ' + si.toFixed(1) + ' cm &nbsp;|&nbsp; ' +
      'magnification = ' + m.toFixed(2) + '× (real, inverted) &nbsp;|&nbsp; R = 2f = ' + R + ' cm';
  }

  dSlider.addEventListener('input', draw);
  fSlider.addEventListener('input', draw);
  draw();
})();
})();
