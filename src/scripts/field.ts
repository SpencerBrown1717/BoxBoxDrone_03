/**
 * The live field below the ground line: the world BBD flies over, seen from above.
 * A lattice of glacier dots stands for the ground. Brighter marks with four rotors are drones.
 *
 * - idle:     a slow swell runs through the ground while a few drones cross it
 * - delivery: drones fly arcs from a hub to homes, set the order down, and fly back
 * - wam:      one drone crosses wind, rain, night and city, with the model's predicted path ahead
 * - drako:    training drones fly a marked course on a range, beside its simulated twin
 * - shows:    the dots lift into formations: a star, a ring and the BBD mark
 * - models:   one base model feeds four specialists, and learns back from them
 *
 * One canvas, drawn only while it is on screen. With reduced motion, each scene
 * is drawn as a single finished frame.
 */

export type FieldScene = 'idle' | 'delivery' | 'wam' | 'drako' | 'shows' | 'models';

export interface FieldLabels {
  hub: string;
  door: string;
  wind: string;
  rain: string;
  night: string;
  city: string;
  range: string;
  control: string;
  sim: string;
  base: string;
  delivery: string;
  drako: string;
  shows: string;
  test: string;
}

export interface FieldOptions {
  reducedMotion: boolean;
  labels: FieldLabels;
}

interface Pt {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const SCENES: FieldScene[] = ['idle', 'delivery', 'wam', 'drako', 'shows', 'models'];
const GLACIER = '110, 231, 249';
const ASH = '232, 230, 225';
const AMBER = '242, 182, 107';
const VIOLET = '196, 181, 255';
const FONT = '500 14px "Geist Variable", system-ui, sans-serif';
const SHOW_HOLD = 4.6;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Small deterministic PRNG so the field looks the same on every visit. */
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

function quad(p0: Pt, c: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t;
  return { x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x, y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y };
}

/** Evenly spaced points along a polyline (closed or open). */
function along(points: Pt[], count: number, closed: boolean): Pt[] {
  const segs: number[] = [];
  const m = closed ? points.length : points.length - 1;
  let total = 0;
  for (let i = 0; i < m; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    segs.push(d);
    total += d;
  }
  const out: Pt[] = [];
  if (!total) return out;
  for (let k = 0; k < count; k++) {
    let d = (k / (closed ? count : Math.max(1, count - 1))) * total;
    let i = 0;
    while (i < segs.length - 1 && d > segs[i]) d -= segs[i++];
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const t = segs[i] ? Math.min(1, d / segs[i]) : 0;
    out.push({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
  }
  return out;
}

function circlePts(cx: number, cy: number, r: number, count: number, start = -Math.PI / 2): Pt[] {
  return Array.from({ length: count }, (_, i) => {
    const a = start + (i / count) * Math.PI * 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

export function createField(canvas: HTMLCanvasElement, options: FieldOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');
  const L = options.labels;
  const reduced = options.reducedMotion;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let ground = 0;
  let fh = 0;
  let wide = false;
  let spacing = 16;

  // The ground lattice
  let n = 0;
  let X0 = new Float32Array(0);
  let Y0 = new Float32Array(0);
  let BASE = new Float32Array(0);

  // Delivery
  let hub: Pt = { x: 0, y: 0 };
  let homes: Pt[] = [];
  let door = 0;
  let fleet: { home: number; offset: number; period: number }[] = [];

  // World action model
  let bands: { x0: number; x1: number; kind: 'wind' | 'rain' | 'night' | 'city' }[] = [];
  let blocks: Rect[] = [];
  let drops: { x: number; y: number; s: number }[] = [];

  // Drako
  let range: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let twin: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let control: Pt = { x: 0, y: 0 };

  // Shows: target points per formation, and which lattice dot flies to each
  let formations: { targets: Pt[]; owner: Int32Array; slot: Int32Array }[] = [];

  // Models
  let baseNode: Pt = { x: 0, y: 0 };
  let specs: { p: Pt; c: Pt; label: string }[] = [];

  const weights = Object.fromEntries(SCENES.map((s) => [s, s === 'idle' ? 1 : 0])) as Record<FieldScene, number>;
  const since = Object.fromEntries(SCENES.map((s) => [s, s === 'idle' ? 0 : -1])) as Record<FieldScene, number>;
  let target: FieldScene = 'idle';

  let time = 0;
  let last = 0;
  let raf = 0;
  let active = false;
  let paused = false;
  let clearSources: HTMLElement[] = [];

  // ---- Geometry -------------------------------------------------------------

  const top = () => ground + Math.max(28, fh * 0.12);
  const bottom = () => H - Math.max(22, fh * 0.08);

  function buildLattice() {
    const targetCount = W >= 1200 ? 1150 : W >= 768 ? 860 : 500;
    const t0 = ground + Math.max(12, fh * 0.035);
    const b0 = H - 10;
    const area = W * Math.max(1, b0 - t0);
    spacing = Math.max(12, Math.sqrt(area / targetCount));
    const rowH = spacing * 0.866;
    const rows = Math.max(1, Math.floor((b0 - t0) / rowH) + 1);
    const cols = Math.max(1, Math.floor(W / spacing));
    const offset = (W - (cols - 1) * spacing - spacing / 2) / 2;
    const xs: number[] = [];
    const ys: number[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offset + c * spacing + (r % 2 ? spacing / 2 : 0);
        if (x < 2 || x > W - 2) continue;
        xs.push(x);
        ys.push(t0 + r * rowH);
      }
    }
    n = xs.length;
    X0 = Float32Array.from(xs);
    Y0 = Float32Array.from(ys);
    BASE = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const depth = clamp01((Y0[i] - ground) / fh);
      BASE[i] = 0.14 + 0.28 * Math.pow(1 - depth, 1.3);
    }
  }

  function buildDelivery() {
    const t0 = top();
    const b0 = bottom();
    hub = { x: W * (wide ? 0.09 : 0.11), y: lerp(t0, b0, 0.62) };
    const rand = mulberry32(11);
    const count = wide ? 8 : 5;
    const x0 = W * (wide ? 0.3 : 0.34);
    const x1 = W * (wide ? 0.95 : 0.93);
    homes = [];
    for (let i = 0; i < count; i++) {
      const u = (i + 0.5) / count;
      homes.push({
        x: lerp(x0, x1, u) + ((rand() - 0.5) * (x1 - x0)) / count / 2,
        y: lerp(t0 + 18, b0 - 10, 0.12 + 0.76 * rand()),
      });
    }
    door = homes.reduce((best, h, i) => (h.x > homes[best].x ? i : best), 0);
    const size = wide ? 6 : 4;
    fleet = Array.from({ length: size }, (_, k) => ({ home: (k * 3 + 1) % count, offset: k / size, period: 6.4 + (k % 3) * 0.9 }));
  }

  function routeControl(home: Pt): Pt {
    const lift = Math.min(fh * 0.3, Math.abs(home.x - hub.x) * 0.32);
    return { x: (hub.x + home.x) / 2, y: Math.max(ground + 16, Math.min(hub.y, home.y) - lift) };
  }

  function buildWam() {
    const kinds = ['wind', 'rain', 'night', 'city'] as const;
    bands = kinds.map((kind, i) => ({ kind, x0: (W * i) / 4, x1: (W * (i + 1)) / 4 }));
    const rand = mulberry32(5);
    const city = bands[3];
    const t0 = top() + 10;
    const b0 = bottom();
    blocks = [];
    let y = t0;
    while (y < b0 - 16) {
      const h = Math.min(b0 - y, 18 + rand() * 26);
      let x = city.x0 + 14;
      while (x < city.x1 - 18) {
        const w = Math.min(city.x1 - 12 - x, 16 + rand() * 30);
        if (w > 10 && rand() > 0.18) blocks.push({ x, y, w, h });
        x += w + 16;
      }
      y += h + 18;
    }
    drops = Array.from({ length: wide ? 70 : 36 }, () => ({ x: rand(), y: rand(), s: 0.6 + rand() * 0.8 }));
  }

  function wamPath(u: number): Pt {
    const t0 = top();
    const b0 = bottom();
    const mid = (t0 + b0) / 2;
    return { x: lerp(W * 0.03, W * 0.97, u), y: mid + Math.sin(u * Math.PI * 2.2 + 0.4) * (b0 - t0) * 0.28 };
  }

  function buildDrako() {
    const t0 = top() + 14;
    const b0 = bottom();
    const h = b0 - t0;
    if (wide) {
      twin = { x: W * 0.05, y: t0, w: W * 0.33, h };
      range = { x: W * 0.44, y: t0, w: W * 0.51, h };
    } else {
      twin = { x: W * 0.05, y: t0, w: W * 0.9, h: h * 0.4 };
      range = { x: W * 0.05, y: t0 + h * 0.52, w: W * 0.9, h: h * 0.48 };
    }
    control = { x: range.x + 16, y: range.y + range.h - 16 };
  }

  const loopPoint = (r: Rect, u: number): Pt => {
    const a = u * Math.PI * 2;
    return { x: r.x + r.w * (0.5 + 0.38 * Math.sin(a)), y: r.y + r.h * (0.5 + 0.3 * Math.sin(2 * a)) };
  };

  function buildShows() {
    const t0 = top();
    const b0 = bottom();
    const cx = W * (wide ? 0.62 : 0.5);
    const cy = (t0 + b0) / 2;
    const R = Math.min((b0 - t0) * 0.46, W * (wide ? 0.17 : 0.36));
    const count = wide ? 150 : 96;

    const starCorners: Pt[] = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 ? R * 0.42 : R;
      starCorners.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
    }
    const star = along(starCorners, count, true);

    const outer = Math.round(count * 0.62);
    const ring = [...circlePts(cx, cy, R * 0.92, outer), ...circlePts(cx, cy, R * 0.5, count - outer, 0)];

    // The BBD mark: a rounded box, the bar through it, and four rotors at the corners
    const bw = R * 1.5;
    const bh = R * 1.0;
    const box: Pt[] = [
      { x: cx - bw / 2, y: cy - bh / 2 },
      { x: cx + bw / 2, y: cy - bh / 2 },
      { x: cx + bw / 2, y: cy + bh / 2 },
      { x: cx - bw / 2, y: cy + bh / 2 },
    ];
    const rotorR = R * 0.2;
    const nBox = Math.round(count * 0.46);
    const nBar = Math.round(count * 0.14);
    const nRotor = Math.floor((count - nBox - nBar) / 4);
    const mark = [
      ...along(box, nBox, true),
      ...along(
        [
          { x: cx, y: cy - bh / 2 - R * 0.14 },
          { x: cx, y: cy + bh / 2 + R * 0.14 },
        ],
        nBar,
        false,
      ),
      ...box.flatMap((c) => circlePts(c.x + Math.sign(c.x - cx) * rotorR * 0.9, c.y + Math.sign(c.y - cy) * rotorR * 0.9, rotorR, nRotor)),
    ];

    formations = [star, ring, mark].map((targets) => assign(targets));
  }

  /** Give each target point the nearest free lattice dot. */
  function assign(targets: Pt[]) {
    const owner = new Int32Array(targets.length).fill(-1);
    const slot = new Int32Array(n).fill(-1);
    for (let k = 0; k < targets.length; k++) {
      const t = targets[k];
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < n; i++) {
        if (slot[i] !== -1) continue;
        const d = (X0[i] - t.x) * (X0[i] - t.x) + (Y0[i] - t.y) * (Y0[i] - t.y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best >= 0) {
        owner[k] = best;
        slot[best] = k;
      }
    }
    return { targets, owner, slot };
  }

  function buildModels() {
    const t0 = top();
    const b0 = bottom();
    baseNode = { x: W * 0.5, y: lerp(t0, b0, 0.1) };
    const xs = wide ? [0.2, 0.4, 0.6, 0.8] : [0.13, 0.38, 0.62, 0.87];
    const names = [L.delivery, L.drako, L.shows, L.test];
    specs = xs.map((u, i) => {
      const p = { x: W * u, y: lerp(t0, b0, 0.78) };
      return { p, c: { x: p.x, y: lerp(baseNode.y, p.y, 0.25) }, label: names[i] };
    });
  }

  function layout(width: number, height: number, groundY: number) {
    W = Math.max(1, width);
    H = Math.max(1, height);
    ground = Math.round(groundY);
    fh = Math.max(1, H - ground);
    wide = W >= 900;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    buildLattice();
    buildDelivery();
    buildWam();
    buildDrako();
    buildShows();
    buildModels();
    if (reduced || paused || !active) draw();
  }

  // ---- Scene state ----------------------------------------------------------

  function setScene(scene: FieldScene) {
    if (scene === target) return;
    target = scene;
    since[scene] = time;
    if (reduced) {
      for (const s of SCENES) weights[s] = s === target ? 1 : 0;
      draw();
    } else if (paused || !active) {
      draw();
    }
  }

  function stepWeights(dt: number) {
    const k = 1 - Math.exp(-dt / 0.42);
    for (const s of SCENES) weights[s] += ((s === target ? 1 : 0) - weights[s]) * k;
  }

  /** Seconds since a scene became the target; a fixed, finished moment with reduced motion. */
  const age = (s: FieldScene, still = 3) => (reduced ? still : since[s] < 0 ? 0 : time - since[s]);

  // ---- Drawing helpers --------------------------------------------------------

  function drone(x: number, y: number, a: number, size = 1) {
    if (!ctx || a < 0.02) return;
    const r = 3.4 * size;
    const arm = 5.2 * size;
    ctx.globalAlpha = a;
    ctx.strokeStyle = `rgb(${GLACIER})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - arm, y - arm);
    ctx.lineTo(x + arm, y + arm);
    ctx.moveTo(x + arm, y - arm);
    ctx.lineTo(x - arm, y + arm);
    ctx.stroke();
    for (const [dx, dy] of [
      [-arm, -arm],
      [arm, -arm],
      [-arm, arm],
      [arm, arm],
    ]) {
      ctx.beginPath();
      ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = `rgb(${ASH})`;
    ctx.fillRect(x - 2.4 * size, y - 2.4 * size, 4.8 * size, 4.8 * size);
    ctx.globalAlpha = 1;
  }

  function text(t: string, x: number, y: number, a: number, align: CanvasTextAlign = 'left', rgb = ASH) {
    if (!ctx || a < 0.02) return;
    ctx.font = FONT;
    ctx.textBaseline = 'middle';
    ctx.textAlign = align;
    ctx.fillStyle = `rgba(${rgb}, ${0.8 * a})`;
    ctx.fillText(t, x, y);
  }

  function ring(x: number, y: number, r: number, a: number, rgb = GLACIER) {
    if (!ctx || a < 0.01) return;
    ctx.strokeStyle = `rgba(${rgb}, ${a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
    ctx.stroke();
  }

  function dashed(draw: () => void, rgb: string, a: number, dash: number[] = [4, 6], width = 1) {
    if (!ctx || a < 0.01) return;
    ctx.save();
    ctx.setLineDash(dash);
    ctx.strokeStyle = `rgba(${rgb}, ${a})`;
    ctx.lineWidth = width;
    ctx.beginPath();
    draw();
    ctx.stroke();
    ctx.restore();
  }

  function collectClearRects(canvasTop: number, canvasLeft: number) {
    const rects: number[] = [];
    for (const el of clearSources) {
      const r = el.getBoundingClientRect();
      const t = r.top - canvasTop - 18;
      const b = r.bottom - canvasTop + 18;
      if (b < ground || t > H) continue;
      rects.push(r.left - canvasLeft - 22, t, r.right - canvasLeft + 22, b);
    }
    return rects;
  }

  // ---- Scenes ---------------------------------------------------------------

  function drawIdle(w: number, t: number) {
    if (w < 0.01) return;
    const t0 = top();
    const b0 = bottom();
    for (let k = 0; k < 3; k++) {
      const speed = 0.035 + k * 0.012;
      const u = reduced ? 0.25 + k * 0.25 : (t * speed + k * 0.37) % 1;
      const y = lerp(t0, b0, 0.25 + k * 0.25);
      const x = lerp(-20, W + 20, u);
      dashed(() => {
        ctx!.moveTo(Math.max(0, x - W * 0.16), y);
        ctx!.lineTo(x - 10, y);
      }, GLACIER, 0.3 * w, [2, 5]);
      drone(x, y, 0.85 * w);
    }
  }

  function drawDelivery(w: number, t: number) {
    if (w < 0.01 || !ctx) return;
    // Planned routes, faint
    for (const home of homes) {
      const c = routeControl(home);
      dashed(() => {
        ctx!.moveTo(hub.x, hub.y);
        ctx!.quadraticCurveTo(c.x, c.y, home.x, home.y);
      }, ASH, 0.12 * w, [3, 7]);
    }

    // Homes
    ctx.lineWidth = 1.2;
    homes.forEach((h, i) => {
      const s = 7;
      ctx.strokeStyle = `rgba(${i === door ? AMBER : ASH}, ${(i === door ? 0.85 : 0.55) * w})`;
      ctx.beginPath();
      ctx.moveTo(h.x - s, h.y + s);
      ctx.lineTo(h.x - s, h.y - s * 0.2);
      ctx.lineTo(h.x, h.y - s * 1.1);
      ctx.lineTo(h.x + s, h.y - s * 0.2);
      ctx.lineTo(h.x + s, h.y + s);
      ctx.closePath();
      ctx.stroke();
    });

    // The hub
    ctx.strokeStyle = `rgba(${ASH}, ${0.75 * w})`;
    ctx.lineWidth = 1.3;
    ctx.strokeRect(hub.x - 13, hub.y - 13, 26, 26);
    ctx.strokeRect(hub.x - 6, hub.y - 6, 12, 12);
    if (!reduced) ring(hub.x, hub.y, 18 + ((t * 14) % 26), 0.35 * w * (1 - ((t * 14) % 26) / 26));

    // Drones out and back
    fleet.forEach((d, k) => {
      const cycles = reduced ? 0 : t / d.period + d.offset;
      const cycle = Math.floor(cycles);
      const phase = reduced ? 0.22 + k * 0.13 : cycles - cycle;
      const home = homes[(d.home + cycle * 2) % homes.length];
      const c = routeControl(home);
      let pos: Pt;
      let trail0 = 0;
      let trail1 = 0;
      let outbound = true;
      if (phase < 0.42) {
        const s = ease(phase / 0.42);
        pos = quad(hub, c, home, s);
        trail0 = Math.max(0, s - 0.22);
        trail1 = s;
      } else if (phase < 0.52) {
        pos = home;
        const r = (phase - 0.42) / 0.1;
        ring(home.x, home.y, 6 + r * 22, 0.6 * w * (1 - r));
      } else if (phase < 0.94) {
        const s = 1 - ease((phase - 0.52) / 0.42);
        pos = quad(hub, c, home, s);
        trail0 = s;
        trail1 = Math.min(1, s + 0.22);
        outbound = false;
      } else {
        pos = hub;
      }
      if (trail1 > trail0) {
        ctx!.strokeStyle = `rgba(${GLACIER}, ${(outbound ? 0.55 : 0.3) * w})`;
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        for (let i = 0; i <= 14; i++) {
          const q = quad(hub, c, home, lerp(trail0, trail1, i / 14));
          if (i === 0) ctx!.moveTo(q.x, q.y);
          else ctx!.lineTo(q.x, q.y);
        }
        ctx!.stroke();
      }
      drone(pos.x, pos.y, w, wide ? 1.15 : 1);
    });

    const d = homes[door];
    text(L.hub, hub.x, hub.y + 30, w, 'center');
    text(L.door, Math.min(d.x, W - 12), d.y - 24, w, d.x > W - 70 ? 'right' : 'center', AMBER);
  }

  function drawWam(w: number, t: number) {
    if (w < 0.01 || !ctx) return;
    const t0 = top();
    const b0 = bottom();

    for (const b of bands) {
      const bw = b.x1 - b.x0;
      if (b.kind === 'wind') {
        for (let k = 0; k < (wide ? 9 : 6); k++) {
          const y = lerp(t0, b0, (k + 0.5) / (wide ? 9 : 6));
          const len = bw * 0.32;
          const x = b.x0 + ((k * 53 + (reduced ? 40 : t * 70)) % (bw + len)) - len;
          ctx.strokeStyle = `rgba(${ASH}, ${0.28 * w})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let s = 0; s <= 10; s++) {
            const xx = x + (len * s) / 10;
            if (xx < b.x0 || xx > b.x1) continue;
            const yy = y + 3 * Math.sin(xx / 14 + t * 2);
            if (s === 0 || xx - len / 10 < b.x0) ctx.moveTo(xx, yy);
            else ctx.lineTo(xx, yy);
          }
          ctx.stroke();
        }
      } else if (b.kind === 'rain') {
        ctx.strokeStyle = `rgba(${ASH}, ${0.26 * w})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const d of drops) {
          const x = b.x0 + d.x * bw;
          const y = t0 + ((d.y * (b0 - t0) + (reduced ? 0 : t * 110 * d.s)) % (b0 - t0));
          ctx.moveTo(x, y);
          ctx.lineTo(x - 3, y + 9);
        }
        ctx.stroke();
      } else if (b.kind === 'night') {
        ctx.fillStyle = `rgba(0, 0, 0, ${0.5 * w})`;
        ctx.fillRect(b.x0, ground + 1, bw, H - ground);
      } else {
        ctx.strokeStyle = `rgba(${GLACIER}, ${0.2 * w})`;
        ctx.lineWidth = 1;
        for (const r of blocks) ctx.strokeRect(r.x, r.y, r.w, r.h);
      }
    }

    // Dividers and names
    bands.forEach((b, i) => {
      if (i > 0)
        dashed(() => {
          ctx!.moveTo(b.x0, ground + 8);
          ctx!.lineTo(b.x0, H - 8);
        }, ASH, 0.16 * w, [3, 6]);
      text(L[b.kind], b.x0 + 12, ground + 20, w);
    });

    // The drone: its flown trail, and the path the model predicts ahead of it
    const u = reduced ? 0.58 : (t * 0.06) % 1;
    const gust = (x: number) => {
      const band = bands.find((b) => x >= b.x0 && x < b.x1);
      return band?.kind === 'wind' ? 7 * Math.sin(x / 30 + t * 2.4) : 0;
    };
    ctx.strokeStyle = `rgba(${GLACIER}, ${0.7 * w})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const tail = Math.max(0, u - 0.3);
    for (let i = 0; i <= 40; i++) {
      const q = wamPath(lerp(tail, u, i / 40));
      const y = q.y + gust(q.x) * 0.6;
      if (i === 0) ctx.moveTo(q.x, y);
      else ctx.lineTo(q.x, y);
    }
    ctx.stroke();
    dashed(() => {
      for (let i = 0; i <= 24; i++) {
        const q = wamPath(Math.min(1, u + (0.16 * i) / 24));
        if (i === 0) ctx!.moveTo(q.x, q.y);
        else ctx!.lineTo(q.x, q.y);
      }
    }, GLACIER, 0.75 * w, [2, 5], 1.4);
    const now = wamPath(u);
    drone(now.x, now.y + gust(now.x) * 0.6, w, wide ? 1.2 : 1);
  }

  function drawDrako(w: number, t: number) {
    if (w < 0.01 || !ctx) return;

    // The simulated twin: a grid with the same course
    ctx.strokeStyle = `rgba(${ASH}, ${0.07 * w})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const step = Math.max(18, twin.w / 10);
    for (let x = twin.x; x <= twin.x + twin.w + 0.5; x += step) {
      ctx.moveTo(x, twin.y);
      ctx.lineTo(x, twin.y + twin.h);
    }
    for (let y = twin.y; y <= twin.y + twin.h + 0.5; y += step) {
      ctx.moveTo(twin.x, y);
      ctx.lineTo(twin.x + twin.w, y);
    }
    ctx.stroke();
    ctx.strokeStyle = `rgba(${ASH}, ${0.2 * w})`;
    ctx.strokeRect(twin.x, twin.y, twin.w, twin.h);

    // Range limits
    dashed(() => ctx!.rect(range.x, range.y, range.w, range.h), AMBER, 0.6 * w, [6, 6], 1.2);

    // The course in both
    for (const [r, a] of [
      [twin, 0.3],
      [range, 0.45],
    ] as [Rect, number][]) {
      dashed(() => {
        for (let i = 0; i <= 96; i++) {
          const q = loopPoint(r, i / 96);
          if (i === 0) ctx!.moveTo(q.x, q.y);
          else ctx!.lineTo(q.x, q.y);
        }
      }, GLACIER, a * w, [3, 6]);
    }

    // Drones flying the course, and their ghosts in the twin
    const count = wide ? 6 : 4;
    for (let k = 0; k < count; k++) {
      const u = ((reduced ? 0.1 : t * 0.045) + k / count) % 1;
      const real = loopPoint(range, u);
      const ghost = loopPoint(twin, u);
      drone(ghost.x, ghost.y, 0.4 * w, 0.85);
      drone(real.x, real.y, w, wide ? 1.1 : 1);
    }

    // Range control, tied to the range
    ctx.strokeStyle = `rgba(${ASH}, ${0.7 * w})`;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(control.x - 7, control.y - 7, 14, 14);
    if (!reduced) {
      const r = (t * 0.8) % 1;
      ring(control.x, control.y, 10 + r * 26, 0.35 * w * (1 - r), ASH);
    }

    text(L.sim, twin.x + 10, twin.y - 14, w);
    text(L.range, range.x + 10, range.y - 14, w);
    text(L.control, control.x + 16, control.y, w);
  }

  function drawModels(w: number, t: number) {
    if (w < 0.01 || !ctx) return;
    for (const s of specs) {
      ctx.strokeStyle = `rgba(${GLACIER}, ${0.4 * w})`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(baseNode.x, baseNode.y);
      ctx.quadraticCurveTo(s.c.x, s.c.y, s.p.x, s.p.y);
      ctx.stroke();
    }
    // Weights flow down, flight data flows back up
    specs.forEach((s, i) => {
      for (let k = 0; k < 4; k++) {
        const down = reduced ? (k + 0.5) / 4 : (t * 0.32 + k / 4 + i * 0.11) % 1;
        const q = quad(baseNode, s.c, s.p, down);
        ctx!.fillStyle = `rgba(${GLACIER}, ${0.9 * w})`;
        ctx!.fillRect(q.x - 1.6, q.y - 1.6, 3.2, 3.2);
      }
      for (let k = 0; k < 2; k++) {
        const up = reduced ? 0.3 + k * 0.4 : 1 - ((t * 0.22 + k / 2 + i * 0.17) % 1);
        const q = quad(baseNode, s.c, s.p, up);
        ctx!.fillStyle = `rgba(${AMBER}, ${0.8 * w})`;
        ctx!.fillRect(q.x - 1.4, q.y - 1.4, 2.8, 2.8);
      }
      // Each specialist: a node with drones circling it
      ring(s.p.x, s.p.y, 12, 0.7 * w, ASH);
      for (let k = 0; k < 3; k++) {
        const a = (reduced ? 0 : t * 0.7) + (k * Math.PI * 2) / 3 + i;
        drone(s.p.x + Math.cos(a) * 28, s.p.y + Math.sin(a) * 12, 0.7 * w, 0.7);
      }
      text(s.label, s.p.x, s.p.y + 34, w, 'center');
    });
    ctx.fillStyle = `rgba(${GLACIER}, ${0.18 * w})`;
    ctx.beginPath();
    ctx.arc(baseNode.x, baseNode.y, 18, 0, Math.PI * 2);
    ctx.fill();
    ring(baseNode.x, baseNode.y, 18, 0.9 * w);
    if (!reduced) {
      const r = (t * 0.5) % 1;
      ring(baseNode.x, baseNode.y, 20 + r * 34, 0.4 * w * (1 - r));
    }
    text(L.base, baseNode.x + 30, baseNode.y, w);
  }

  // ---- Frame ----------------------------------------------------------------

  function draw() {
    if (!ctx || !n) return;
    const t = reduced ? 2.4 : time;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const box = canvas.getBoundingClientRect();
    const clear = collectClearRects(box.top, box.left);

    // A faint violet tint under the ground line, the after-glow of the horizon
    const tint = ctx.createLinearGradient(0, ground, 0, ground + fh * 0.55);
    tint.addColorStop(0, `rgba(${VIOLET}, 0.07)`);
    tint.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = tint;
    ctx.fillRect(0, ground, W, fh * 0.55);

    // Ground line
    ctx.strokeStyle = `rgba(${VIOLET}, 0.32)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, ground + 0.5);
    ctx.lineTo(W, ground + 0.5);
    ctx.stroke();

    // Dots
    const wIdle = weights.idle;
    const wShow = weights.shows;
    const wWam = weights.wam;
    const wModels = weights.models;
    const wDelivery = weights.delivery;
    const wDrako = weights.drako;

    const showAge = age('shows', 2.2);
    const shapeIndex = reduced ? 0 : Math.floor(showAge / SHOW_HOLD) % formations.length;
    const local = reduced ? 2.2 : showAge % SHOW_HOLD;
    const lift = smooth(0.1, 1.5, local) * (reduced ? 1 : 1 - smooth(SHOW_HOLD - 0.7, SHOW_HOLD, local)) * wShow;
    const formation = formations[shapeIndex];

    ctx.fillStyle = `rgb(${GLACIER})`;
    for (let i = 0; i < n; i++) {
      let x = X0[i];
      let y = Y0[i];
      let a = BASE[i];

      // A slow swell runs through the ground
      if (wIdle > 0.01) {
        const s = Math.sin(x * 0.012 - t * 0.9 + y * 0.004);
        y += 2.2 * s * wIdle;
        a += 0.12 * Math.max(0, s) * wIdle;
      }

      // Weather on the world action model's crossing
      if (wWam > 0.01) {
        const band = Math.min(3, Math.floor((x / W) * 4));
        if (band === 0) x += 4 * Math.sin(y * 0.05 + t * 2.2) * wWam;
        if (band === 2) a *= 1 - 0.65 * wWam;
        if (band === 3) a *= 1 - 0.4 * wWam;
      }

      if (wDelivery > 0.01) a *= 1 - 0.25 * wDelivery;
      if (wDrako > 0.01) {
        const inside = x > range.x && x < range.x + range.w && y > range.y && y < range.y + range.h;
        a *= inside ? 1 - 0.2 * wDrako : 1 - 0.45 * wDrako;
      }
      if (wModels > 0.01) a *= 1 - 0.55 * wModels;

      // Formations: owned dots lift to their marks, the rest dim
      if (wShow > 0.01) {
        const k = formation.slot[i];
        if (k >= 0) {
          const tg = formation.targets[k];
          x += (tg.x - x) * lift;
          y += (tg.y - y) * lift;
          a = lerp(a, 0.95 + (reduced ? 0 : 0.05 * Math.sin(t * 5 + i)), lift);
        } else {
          a *= 1 - 0.75 * wShow;
        }
      }

      for (let r = 0; r < clear.length; r += 4) {
        if (x > clear[r] && x < clear[r + 2] && y > clear[r + 1] && y < clear[r + 3]) {
          a *= 0.1;
          break;
        }
      }

      if (a < 0.02) continue;
      if (a > 1) a = 1;
      ctx.globalAlpha = a;
      const size = a > 0.62 ? 2.4 : 1.7;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;

    drawIdle(wIdle, t);
    drawDelivery(wDelivery, age('delivery', 2.2) + 1.3);
    drawWam(wWam, t);
    drawDrako(wDrako, t);
    drawModels(wModels, t);
  }

  // ---- Loop -----------------------------------------------------------------

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    time += dt;
    stepWeights(dt);
    draw();
    if (active && !paused && !reduced) raf = requestAnimationFrame(frame);
  }

  function run() {
    if (raf || reduced || paused || !active) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  return {
    layout,
    setScene,
    get scene() {
      return target;
    },
    setActive(on: boolean) {
      if (on === active) return;
      active = on;
      if (on) {
        if (reduced || paused) draw();
        else run();
      } else stop();
    },
    setPaused(on: boolean) {
      paused = on;
      if (on) {
        stop();
        draw();
      } else run();
    },
    setClearSources(els: HTMLElement[]) {
      clearSources = els;
    },
    redraw() {
      draw();
    },
  };
}

export type Field = ReturnType<typeof createField>;
