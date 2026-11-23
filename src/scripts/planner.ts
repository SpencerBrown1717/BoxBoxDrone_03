/**
 * The model demo on the home page: an illustration of how a world action model plans.
 *
 * A drone flies from the hub to a door, seen from above. Several times a second it
 * imagines where a handful of possible moves would take it (faint lines), scores each
 * one against what it can see, and flies the best (the bright line). Wind pushes it,
 * rain and night shrink what it can see, and each world has its own obstacles.
 *
 * This is an illustration, not the BBD model. Hidden from assistive technology:
 * the figure caption says what it shows.
 */
import { isPaused, onMotionChange } from './motion';

type WorldId = 'city' | 'suburb' | 'coast' | 'mountain' | 'snow';
type Condition = 'wind' | 'rain' | 'night';

interface Rect {
  kind: 'rect';
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Circle {
  kind: 'circle';
  x: number;
  y: number;
  r: number;
  rings?: number;
}
type Obstacle = Rect | Circle;

interface World {
  start: [number, number];
  goal: [number, number];
  obstacles: Obstacle[];
  water?: number[];
  snow?: boolean;
}

const UW = 1.6; // world width; height is 1
const SPEED = 0.2;
const HORIZON = 1.25;
const DT = 0.06;
const REPLAN = 0.35;
const TURNS = [-2.4, -1.6, -0.9, -0.4, 0, 0.4, 0.9, 1.6, 2.4];
const MARGIN = 0.022;

const GLACIER = '110, 231, 249';
const AMBER = '242, 182, 107';
const ASH = '232, 230, 225';
const PUMICE = '139, 143, 152';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildWorld(id: WorldId): World {
  const obstacles: Obstacle[] = [];
  const rand = mulberry32(id.length * 97 + 13);
  if (id === 'city') {
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 3; r++) {
        if ((c === 0 && r === 2) || (c === 4 && r === 0)) continue;
        obstacles.push({ kind: 'rect', x: 0.16 + c * 0.27, y: 0.1 + r * 0.3, w: 0.17 + rand() * 0.03, h: 0.19 + rand() * 0.02 });
      }
    }
    return { start: [0.08, 0.9], goal: [1.5, 0.1], obstacles };
  }
  if (id === 'suburb') {
    for (let row = 0; row < 3; row++) {
      for (let c = 0; c < 7; c++) {
        const x = 0.2 + c * 0.19 + (row % 2) * 0.06;
        const y = 0.16 + row * 0.3;
        if (x > 1.48) continue;
        obstacles.push({ kind: 'rect', x, y, w: 0.09, h: 0.07 });
        if (rand() < 0.75) obstacles.push({ kind: 'circle', x: x + 0.13, y: y + 0.1 + rand() * 0.04, r: 0.03 + rand() * 0.012 });
      }
    }
    return { start: [0.07, 0.88], goal: [1.43, 0.24], obstacles };
  }
  if (id === 'coast') {
    const water: number[] = [];
    for (let i = 0; i <= 24; i++) {
      const x = 0.55 + (i / 24) * 1.1;
      water.push(x, 0.45 + 0.12 * Math.sin(i * 0.6) + (i / 24) * 0.1);
    }
    water.push(1.65, 1.05, 0.55, 1.05);
    const shore = [0.62, 0.48, 0.8, 0.5, 0.98, 0.42, 1.12, 0.47, 1.3, 0.55];
    for (let i = 0; i < shore.length; i += 2) obstacles.push({ kind: 'circle', x: shore[i], y: shore[i + 1] - 0.08, r: 0.055 + rand() * 0.03, rings: 2 });
    obstacles.push({ kind: 'circle', x: 0.35, y: 0.62, r: 0.09, rings: 3 });
    obstacles.push({ kind: 'circle', x: 1.0, y: 0.78, r: 0.035 });
    obstacles.push({ kind: 'circle', x: 1.22, y: 0.88, r: 0.03 });
    return { start: [0.08, 0.12], goal: [1.48, 0.82], obstacles, water };
  }
  if (id === 'mountain') {
    const peaks = [
      [0.42, 0.25, 0.16],
      [0.5, 0.82, 0.18],
      [0.86, 0.5, 0.15],
      [1.2, 0.2, 0.14],
      [1.25, 0.82, 0.13],
    ];
    for (const [x, y, r] of peaks) obstacles.push({ kind: 'circle', x, y, r, rings: 4 });
    return { start: [0.06, 0.55], goal: [1.52, 0.5], obstacles };
  }
  // snow
  for (let i = 0; i < 46; i++) {
    const x = 0.2 + rand() * 1.22;
    const y = 0.05 + rand() * 0.9;
    if (Math.hypot(x - 1.48, y - 0.16) < 0.12 || Math.hypot(x - 0.08, y - 0.86) < 0.12) continue;
    obstacles.push({ kind: 'circle', x, y, r: 0.022 + rand() * 0.016 });
  }
  return { start: [0.08, 0.86], goal: [1.48, 0.16], obstacles, snow: true };
}

function clearance(o: Obstacle, x: number, y: number) {
  if (o.kind === 'circle') return Math.hypot(x - o.x, y - o.y) - o.r;
  const dx = Math.max(o.x - x, 0, x - (o.x + o.w));
  const dy = Math.max(o.y - y, 0, y - (o.y + o.h));
  if (dx === 0 && dy === 0) return -Math.min(x - o.x, o.x + o.w - x, y - o.y, o.y + o.h - y);
  return Math.hypot(dx, dy);
}

function nearestEdge(o: Obstacle, x: number, y: number) {
  if (o.kind === 'circle') return Math.hypot(x - o.x, y - o.y) - o.r;
  return clearance(o, x, y);
}

export function mountPlanner(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-planner-canvas]');
  const figure = root.querySelector<HTMLElement>('[data-planner]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !figure || !ctx) return;

  const reduced = !document.documentElement.classList.contains('motion-ok');
  figure.hidden = false;
  root.querySelector<HTMLElement>('[data-planner-controls]')?.removeAttribute('hidden');

  let worldId: WorldId = 'city';
  let world = buildWorld(worldId);
  const conditions = new Set<Condition>();

  // Drone state
  let px = 0;
  let py = 0;
  let heading = 0;
  let omega = 0;
  let planAge = 99;
  let flight = 0;
  let doneAt = -1;
  let trail: number[] = [];
  let candidates: { pts: number[]; bad: boolean; best: boolean }[] = [];

  let time = 0;
  let last = 0;
  let raf = 0;
  let visible = false;
  let W = 0;
  let H = 0;
  let scale = 1;
  let dpr = 1;

  const sensing = () => (conditions.has('rain') && conditions.has('night') ? 0.2 : conditions.has('night') ? 0.24 : conditions.has('rain') ? 0.28 : 0.42);

  function wind(t: number): [number, number] {
    if (!conditions.has('wind')) return [0, 0];
    const g = 0.6 + 0.4 * Math.sin(t * 0.8) * Math.sin(t * 0.37 + 1);
    return [0.075 * g, -0.03 * g];
  }

  function reset() {
    [px, py] = world.start;
    heading = Math.atan2(world.goal[1] - py, world.goal[0] - px);
    omega = 0;
    planAge = 99;
    flight = 0;
    doneAt = -1;
    trail = [];
    candidates = [];
  }

  /** Imagine each move over the horizon, score it against what the drone can see, keep the best. */
  function plan(t: number) {
    const range = sensing();
    const seen = world.obstacles.filter((o) => nearestEdge(o, px, py) < range);
    const [wx, wy] = wind(t);
    let bestScore = Infinity;
    let best = 0;
    candidates = TURNS.map((turn, k) => {
      let x = px;
      let y = py;
      let h = heading;
      let bad = false;
      let minClear = 1;
      const pts = [x, y];
      for (let s = 0; s < HORIZON; s += DT) {
        h += turn * DT;
        x += (Math.cos(h) * SPEED + wx) * DT;
        y += (Math.sin(h) * SPEED + wy) * DT;
        pts.push(x, y);
        if (x < 0.01 || x > UW - 0.01 || y < 0.01 || y > 0.99) bad = true;
        for (const o of seen) {
          const c = clearance(o, x, y);
          if (c < MARGIN) bad = true;
          minClear = Math.min(minClear, c);
        }
        if (Math.hypot(x - world.goal[0], y - world.goal[1]) < 0.03) break;
      }
      const end = Math.hypot(x - world.goal[0], y - world.goal[1]);
      const score = end + (bad ? 4 : 0) + Math.max(0, 0.06 - minClear) * 3 + Math.abs(turn) * 0.012;
      if (score < bestScore) {
        bestScore = score;
        best = k;
      }
      return { pts, bad, best: false };
    });
    candidates[best].best = true;
    omega = TURNS[best];
  }

  function step(dt: number) {
    time += dt;
    if (doneAt >= 0) {
      if (time - doneAt > 1.1) reset();
      return;
    }
    planAge += dt;
    if (planAge >= REPLAN) {
      plan(time);
      planAge = 0;
    }
    const [wx, wy] = wind(time);
    heading += omega * dt;
    px += (Math.cos(heading) * SPEED + wx) * dt;
    py += (Math.sin(heading) * SPEED + wy) * dt;
    flight += dt;
    trail.push(px, py);
    if (trail.length > 400) trail.splice(0, 2);
    const hitSomething = world.obstacles.some((o) => clearance(o, px, py) < 0.004) || px < 0 || px > UW || py < 0 || py > 1;
    if (Math.hypot(px - world.goal[0], py - world.goal[1]) < 0.04) doneAt = time;
    else if (hitSomething || flight > 26) reset();
  }

  // ---- Drawing ----------------------------------------------------------------

  const X = (x: number) => x * scale;
  const Y = (y: number) => y * scale;

  function polyline(pts: number[]) {
    ctx!.beginPath();
    for (let i = 0; i < pts.length; i += 2) {
      if (i === 0) ctx!.moveTo(X(pts[i]), Y(pts[i + 1]));
      else ctx!.lineTo(X(pts[i]), Y(pts[i + 1]));
    }
  }

  function draw() {
    const c = ctx!;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    const night = conditions.has('night');
    const range = sensing();
    const t = time;

    // Ground
    c.fillStyle = night ? '#000000' : world.snow ? 'rgba(232, 230, 225, 0.05)' : 'rgba(232, 230, 225, 0.025)';
    c.fillRect(0, 0, W, H);

    // Faint survey grid
    c.strokeStyle = 'rgba(232, 230, 225, 0.05)';
    c.lineWidth = 1;
    c.beginPath();
    for (let gx = 0; gx <= UW; gx += 0.1) {
      c.moveTo(X(gx), 0);
      c.lineTo(X(gx), H);
    }
    for (let gy = 0; gy <= 1; gy += 0.1) {
      c.moveTo(0, Y(gy));
      c.lineTo(W, Y(gy));
    }
    c.stroke();

    if (world.water) {
      polyline(world.water);
      c.closePath();
      c.fillStyle = `rgba(${GLACIER}, ${night ? 0.03 : 0.07})`;
      c.fill();
      c.strokeStyle = `rgba(${GLACIER}, 0.25)`;
      polyline(world.water.slice(0, 50));
      c.stroke();
    }

    // Obstacles: bright where the drone can see them, faint elsewhere
    for (const o of world.obstacles) {
      const seen = nearestEdge(o, px, py) < range;
      const alpha = seen ? 0.6 : night ? 0.08 : 0.3;
      c.strokeStyle = `rgba(${ASH}, ${alpha})`;
      c.fillStyle = `rgba(${ASH}, ${seen ? 0.06 : 0.025})`;
      c.lineWidth = 1;
      if (o.kind === 'rect') {
        c.fillRect(X(o.x), Y(o.y), X(o.w), Y(o.h));
        c.strokeRect(X(o.x), Y(o.y), X(o.w), Y(o.h));
      } else {
        const rings = o.rings ?? 1;
        for (let r = 0; r < rings; r++) {
          c.beginPath();
          c.arc(X(o.x), Y(o.y), X(o.r * (1 - r / (rings + 0.6))), 0, Math.PI * 2);
          if (r === 0) c.fill();
          c.stroke();
        }
      }
    }

    // Weather
    const [wx, wy] = wind(t);
    if (conditions.has('wind')) {
      const rand = mulberry32(3);
      c.strokeStyle = `rgba(${GLACIER}, 0.22)`;
      c.beginPath();
      for (let k = 0; k < 22; k++) {
        const yy = rand();
        const x = ((rand() * UW + t * 0.32 * (0.7 + rand())) % (UW + 0.3)) - 0.15;
        c.moveTo(X(x), Y(yy));
        c.lineTo(X(x - 0.07), Y(yy - wy * 0.9));
      }
      c.stroke();
    }
    if (conditions.has('rain') || world.snow) {
      const rand = mulberry32(9);
      const count = world.snow ? 90 : 120;
      c.fillStyle = `rgba(${ASH}, ${world.snow ? 0.5 : 0.28})`;
      for (let k = 0; k < count; k++) {
        const fall = world.snow ? 0.06 : 0.9;
        const x = (rand() * UW + t * (wx * 0.8 + (world.snow ? 0.01 : 0.04))) % UW;
        const y = (rand() + t * fall * (0.6 + rand() * 0.6)) % 1;
        if (world.snow && !conditions.has('rain')) c.fillRect(X(x) - 1, Y(y) - 1, 2, 2);
        else c.fillRect(X(x), Y(y), 1, 6);
      }
    }

    // Hub and door
    c.strokeStyle = `rgba(${ASH}, 0.7)`;
    c.strokeRect(X(world.start[0]) - 8, Y(world.start[1]) - 8, 16, 16);
    c.fillStyle = `rgba(${AMBER}, 0.95)`;
    const [gx, gy] = world.goal;
    c.beginPath();
    c.moveTo(X(gx), Y(gy) - 7);
    c.lineTo(X(gx) + 7, Y(gy));
    c.lineTo(X(gx), Y(gy) + 7);
    c.lineTo(X(gx) - 7, Y(gy));
    c.closePath();
    c.fill();
    c.font = '500 14px "Geist Variable", system-ui, sans-serif';
    c.textBaseline = 'middle';
    c.fillStyle = `rgba(${ASH}, 0.78)`;
    c.textAlign = 'left';
    // Labels sit beside their marks and stay inside the frame on small screens
    const inside = (y: number) => Math.min(Math.max(y, 12), H - 12);
    c.fillText('Hub', X(world.start[0]) + 14, inside(Y(world.start[1]) + (world.start[1] > 0.5 ? 18 : -18)));
    c.textAlign = 'right';
    c.fillText('Door', X(gx) - 12, inside(Y(gy) + (gy < 0.5 ? 20 : -18)));

    // Trail
    if (trail.length > 3) {
      polyline(trail);
      c.strokeStyle = `rgba(${GLACIER}, 0.22)`;
      c.lineWidth = 1.5;
      c.stroke();
    }

    // What the model can see
    c.setLineDash([3, 5]);
    c.beginPath();
    c.arc(X(px), Y(py), X(range), 0, Math.PI * 2);
    c.strokeStyle = `rgba(${GLACIER}, ${night || conditions.has('rain') ? 0.35 : 0.18})`;
    c.lineWidth = 1;
    c.stroke();
    c.setLineDash([]);

    // Imagined moves, then the chosen one
    for (const cand of candidates) {
      if (cand.best) continue;
      polyline(cand.pts);
      c.setLineDash(cand.bad ? [2, 4] : []);
      c.strokeStyle = cand.bad ? `rgba(${PUMICE}, 0.45)` : `rgba(${GLACIER}, 0.3)`;
      c.lineWidth = 1;
      c.stroke();
      c.setLineDash([]);
      const ex = cand.pts[cand.pts.length - 2];
      const ey = cand.pts[cand.pts.length - 1];
      c.fillStyle = cand.bad ? `rgba(${PUMICE}, 0.6)` : `rgba(${GLACIER}, 0.5)`;
      c.fillRect(X(ex) - 1.5, Y(ey) - 1.5, 3, 3);
    }
    const best = candidates.find((cand) => cand.best);
    if (best) {
      polyline(best.pts);
      c.strokeStyle = `rgba(${GLACIER}, 0.95)`;
      c.lineWidth = 2;
      c.stroke();
    }

    // The drone, seen from above
    c.save();
    c.translate(X(px), Y(py));
    c.rotate(heading + Math.PI / 4);
    c.strokeStyle = `rgba(${ASH}, 0.95)`;
    c.lineWidth = 1.4;
    for (const [dx, dy] of [
      [-6, -6],
      [6, -6],
      [6, 6],
      [-6, 6],
    ]) {
      c.beginPath();
      c.arc(dx, dy, 3.2, 0, Math.PI * 2);
      c.stroke();
    }
    c.fillStyle = `rgb(${GLACIER})`;
    c.fillRect(-3, -3, 6, 6);
    c.restore();

    // Delivered
    if (doneAt >= 0) {
      const k = Math.min(1, (t - doneAt) / 0.8);
      c.beginPath();
      c.arc(X(gx), Y(gy), 8 + 30 * k, 0, Math.PI * 2);
      c.strokeStyle = `rgba(${AMBER}, ${0.8 * (1 - k)})`;
      c.lineWidth = 1.5;
      c.stroke();
    }

    if (night) {
      // Darkness outside the sensing range
      const g = c.createRadialGradient(X(px), Y(py), X(range) * 0.6, X(px), Y(py), X(range) * 1.6);
      g.addColorStop(0, 'rgba(0, 0, 0, 0)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
    }
  }

  // ---- Loop and controls ----------------------------------------------------

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    step(dt);
    draw();
    if (visible && !isPaused()) raf = requestAnimationFrame(frame);
  }

  function run() {
    if (raf || reduced || !visible || isPaused()) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  /** A still frame: the first plan from the hub, with every imagined move drawn. */
  function still() {
    reset();
    plan(0);
    draw();
  }

  function resize() {
    const w = canvas!.clientWidth;
    if (!w) return;
    W = w;
    H = w / UW;
    scale = W / UW;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    if (reduced || isPaused() || !visible) {
      if (!candidates.length) plan(time);
      draw();
    }
  }

  // World picker: a radio group with arrow keys
  const radios = [...root.querySelectorAll<HTMLButtonElement>('[data-world]')];
  const pick = (button: HTMLButtonElement, focus = false) => {
    for (const r of radios) {
      const on = r === button;
      r.setAttribute('aria-checked', String(on));
      r.tabIndex = on ? 0 : -1;
    }
    if (focus) button.focus();
    worldId = button.dataset.world as WorldId;
    world = buildWorld(worldId);
    if (reduced || isPaused()) still();
    else reset();
  };
  radios.forEach((radio, i) => {
    radio.tabIndex = radio.getAttribute('aria-checked') === 'true' ? 0 : -1;
    radio.addEventListener('click', () => pick(radio));
    radio.addEventListener('keydown', (event) => {
      const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(event.key in keys)) return;
      event.preventDefault();
      pick(radios[(i + keys[event.key] + radios.length) % radios.length], true);
    });
  });

  for (const toggle of root.querySelectorAll<HTMLButtonElement>('[data-condition]')) {
    toggle.addEventListener('click', () => {
      const id = toggle.dataset.condition as Condition;
      const on = !conditions.has(id);
      if (on) conditions.add(id);
      else conditions.delete(id);
      toggle.setAttribute('aria-pressed', String(on));
      planAge = 99;
      if (reduced || isPaused()) still();
    });
  }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) run();
    else stop();
  }).observe(canvas);

  onMotionChange((paused) => {
    if (paused) {
      stop();
      draw();
    } else run();
  });

  reset();
  resize();
  still();
}
