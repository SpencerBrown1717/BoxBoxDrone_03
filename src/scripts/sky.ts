/**
 * The sky: a fleet of drones above the horizon line, drawn on one canvas.
 *
 * - swarm:    a plane of drones seen in perspective, drifting slowly toward you
 * - model:    everything dims behind the model panel
 * - delivery: couriers fly from the hub to doorsteps along the horizon and drop their boxes
 * - weather:  the same deliveries, in wind and rain
 * - drako:    waves of target drones cross a training lane; hits flash amber and fall
 * - shows:    drones rise from the launch pad and grow a redwood in the sky
 * - fleet:    every drone lifts into rows of flight data that stream into the model
 *
 * One canvas, drawn only while it is on screen. With reduced motion, each scene
 * is drawn as a single finished frame.
 */

export type SkyScene = 'swarm' | 'model' | 'delivery' | 'weather' | 'drako' | 'shows' | 'fleet';

export interface SkyLabels {
  hub: string;
  door: string;
  weather: string;
  lane: string;
  hit: string;
  formation: string;
  spares: string;
  model: string;
}

export interface SkyOptions {
  reducedMotion: boolean;
  labels: SkyLabels;
}

const SCENES: SkyScene[] = ['swarm', 'model', 'delivery', 'weather', 'drako', 'shows', 'fleet'];
const GLACIER = '110, 231, 249';
const AMBER = '242, 182, 107';
const ASH = '232, 230, 225';
const PUMICE = '139, 143, 152';
const VIOLET = '185, 166, 255';
const FONT = '500 14px "Geist Variable", system-ui, sans-serif';

// The plane of drones: depth runs from near (top of the sky) to far (the horizon)
const Z_NEAR = 1;
const Z_FAR = 10;
const Z_SPAN = Z_FAR - Z_NEAR;
const DRIFT = 0.07; // depth units per second

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const ease = (t: number) => {
  const u = clamp01(t);
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mod = (a: number, m: number) => ((a % m) + m) % m;

/** Small deterministic PRNG so the sky looks the same on every visit. */
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

/** A redwood, the tree Palo Alto is named for, in a unit box (v runs down). */
function insideRedwood(u: number, v: number) {
  const dx = Math.abs(u - 0.5);
  if (v > 0.8 && v <= 1 && dx < 0.045) return true; // trunk
  if (v > 0.86) return false;
  for (let k = 0; k < 5; k++) {
    const top = k * 0.155;
    const bottom = top + 0.3;
    if (v < top || v > bottom) continue;
    const half = ((v - top) / (bottom - top)) * (0.16 + k * 0.08);
    if (dx < half) return true;
  }
  return false;
}

export function createSky(canvas: HTMLCanvasElement, options: SkyOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');

  const reduced = options.reducedMotion;
  const L = options.labels;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let ground = 0;
  let skyH = 0;
  let wide = false;

  // Drones
  let n = 0;
  let PX = new Float32Array(0); // position across the plane, in units of depth
  let PZ = new Float32Array(0); // starting depth
  let PA = new Float32Array(0); // altitude above the horizon, 0..1
  let SEED = new Float32Array(0);
  let COLT = new Float32Array(0); // 0..1 across the screen at rest, staggers the data lift

  // Delivery
  let houses: { x: number; w: number; h: number }[] = [];
  let hubX = 0;
  let courierOf = new Int16Array(0); // drone -> courier index, or -1
  let courierCount = 0;

  // Drako
  let targetOf = new Int16Array(0);
  let targetCount = 0;
  let laneX0 = 0;
  let laneX1 = 0;

  // Shows
  let formOf = new Int16Array(0); // drone -> formation point, or -1
  let spareOf = new Int16Array(0); // drone -> spare slot, or -1
  let formU = new Float32Array(0);
  let formV = new Float32Array(0);
  let treeX = 0;
  let treeTop = 0;
  let treeW = 0;
  let treeH = 0;
  let padX = 0;

  // Fleet
  let rows = 8;
  let rowGap = 12;
  let slotX = new Float32Array(0);
  let slotRow = new Int16Array(0);
  let slotBright = new Uint8Array(0);
  let rowSpeed: number[] = [];
  let streamSpan = 1;
  let dataTop = 0;

  const weights: Record<SkyScene, number> = { swarm: 1, model: 0, delivery: 0, weather: 0, drako: 0, shows: 0, fleet: 0 };
  const since: Record<SkyScene, number> = { swarm: 0, model: -1, delivery: -1, weather: -1, drako: -1, shows: -1, fleet: -1 };
  let target: SkyScene = 'swarm';

  let time = 0;
  let last = 0;
  let raf = 0;
  let active = false;
  let paused = false;
  let clearSources: HTMLElement[] = [];

  // ---- Layout ----------------------------------------------------------------

  function buildDrones() {
    const count = W >= 1200 ? 680 : W >= 768 ? 480 : 300;
    const rand = mulberry32(11);
    n = count;
    PX = new Float32Array(n);
    PZ = new Float32Array(n);
    PA = new Float32Array(n);
    SEED = new Float32Array(n);
    COLT = new Float32Array(n);
    const depths = Array.from({ length: n }, (_, i) => Z_NEAR + Z_SPAN * ((i + rand() * 0.9) / n));
    // Shuffle the depth order so roles spread evenly
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [depths[i], depths[j]] = [depths[j], depths[i]];
    }
    for (let i = 0; i < n; i++) {
      // A volume of drones: even in depth, spread across what can be seen at that depth, at every altitude
      const z = depths[i];
      PZ[i] = z;
      PX[i] = (rand() * 2 - 1) * z * 1.02;
      PA[i] = 0.06 + 0.94 * Math.pow(rand(), 0.85);
      SEED[i] = rand();
    }
  }

  function buildDelivery() {
    const count = wide ? 5 : 3;
    houses = [];
    const x0 = W * (wide ? 0.4 : 0.36);
    const x1 = W * (wide ? 0.9 : 0.9);
    const rand = mulberry32(23);
    for (let k = 0; k < count; k++) {
      const x = x0 + ((x1 - x0) * k) / (count - 1);
      const w = (wide ? 40 : 28) + rand() * 10;
      houses.push({ x, w, h: w * (0.55 + rand() * 0.2) });
    }
    hubX = W * (wide ? 0.12 : 0.1);
    courierCount = wide ? 8 : 5;
    courierOf = new Int16Array(n).fill(-1);
    for (let k = 0; k < courierCount; k++) courierOf[Math.floor(((k + 0.5) * n) / courierCount)] = k;
  }

  function buildDrako() {
    laneX0 = W * (wide ? 0.06 : 0.07);
    laneX1 = W * 0.96;
    targetCount = wide ? 49 : 28;
    targetOf = new Int16Array(n).fill(-1);
    const step = n / targetCount;
    for (let j = 0; j < targetCount; j++) {
      const i = Math.floor(j * step + step * 0.33) % n;
      if (courierOf[i] < 0) targetOf[i] = j;
      else targetOf[(i + 1) % n] = j;
    }
  }

  function buildShows() {
    // On narrow screens the copy covers the top of the sky, so the tree stands below it
    treeH = skyH * (wide ? 0.78 : 0.5);
    treeW = treeH * 0.56;
    treeX = W * (wide ? 0.7 : 0.5);
    treeTop = ground - skyH * (wide ? 0.9 : 0.56);
    padX = W * (wide ? 0.08 : 0.06);

    const want = wide ? 320 : W >= 768 ? 240 : 150;
    // Sample the tree on a jittered grid, tightening the grid until there are enough points
    let pts: [number, number][] = [];
    let spacing = 0.05;
    const rand = mulberry32(31);
    for (let attempt = 0; attempt < 6; attempt++) {
      pts = [];
      const sx = spacing;
      const sy = spacing * (treeW / treeH);
      for (let v = sy / 2; v < 1; v += sy) {
        for (let u = sx / 2; u < 1; u += sx) {
          const ju = u + (rand() - 0.5) * sx * 0.25;
          const jv = v + (rand() - 0.5) * sy * 0.25;
          if (insideRedwood(ju, jv)) pts.push([ju, jv]);
        }
      }
      if (pts.length >= want) break;
      spacing *= 0.82;
    }
    // Keep an even subset
    if (pts.length > want) {
      const keep: [number, number][] = [];
      for (let k = 0; k < want; k++) keep.push(pts[Math.floor((k * pts.length) / want)]);
      pts = keep;
    }
    formU = Float32Array.from(pts.map((p) => p[0]));
    formV = Float32Array.from(pts.map((p) => p[1]));

    // Assign drones to points: sort both by horizontal position so the moves stay short
    formOf = new Int16Array(n).fill(-1);
    spareOf = new Int16Array(n).fill(-1);
    const m = pts.length;
    const spares = wide ? 36 : 20;
    const total = Math.min(n, m + spares);
    const chosen = Array.from({ length: total }, (_, k) => Math.floor((k * n) / total));
    const spareSet = new Set<number>();
    for (let k = 0; k < spares; k++) spareSet.add(chosen[Math.floor((k * total) / spares)]);
    const formDrones = chosen.filter((i) => !spareSet.has(i)).slice(0, m);
    const spareDrones = [...spareSet];
    const restX = (i: number) => PX[i] / PZ[i];
    formDrones.sort((a, b) => restX(a) - restX(b));
    const order = [...Array(m).keys()].sort((a, b) => formU[a] - formU[b]);
    formDrones.forEach((i, k) => {
      if (k < order.length) formOf[i] = order[k];
    });
    spareDrones.forEach((i, k) => {
      spareOf[i] = k;
    });
  }

  function buildFleet() {
    rows = wide ? 9 : 7;
    rowGap = Math.max(11, Math.min(18, skyH * 0.05));
    dataTop = ground - skyH * 0.42 - ((rows - 1) * rowGap) / 2;
    const cols = Math.ceil(n / rows);
    const sx = Math.max(12, (W + 120) / cols);
    streamSpan = cols * sx;
    slotX = new Float32Array(n);
    slotRow = new Int16Array(n);
    slotBright = new Uint8Array(n);
    const rand = mulberry32(7);
    // Each drone takes the slot under it, column by column, so the lift is short
    const byX = [...Array(n).keys()].sort((a, b) => COLT[a] - COLT[b]);
    byX.forEach((i, k) => {
      slotRow[i] = k % rows;
      slotX[i] = Math.floor(k / rows) * sx - sx * 3;
      slotBright[i] = rand() < 0.5 ? 1 : 0;
    });
    rowSpeed = Array.from({ length: rows }, (_, r) => 30 + ((r * 7) % 5) * 7);
  }

  function layout(width: number, height: number, groundY: number) {
    W = Math.max(1, width);
    H = Math.max(1, height);
    ground = Math.round(groundY);
    skyH = Math.max(1, ground);
    wide = W >= 900;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    buildDrones();
    for (let i = 0; i < n; i++) COLT[i] = clamp01(0.5 + (PX[i] / PZ[i]) * 0.55);
    buildDelivery();
    buildDrako();
    buildShows();
    buildFleet();
    if (reduced || paused || !active) draw();
  }

  // ---- Scenes ----------------------------------------------------------------

  function setScene(scene: SkyScene) {
    if (scene === target) return;
    target = scene;
    since[scene] = time;
    if (reduced) {
      for (const s of SCENES) weights[s] = s === target ? 1 : 0;
      if (target === 'weather') weights.delivery = 0;
      draw();
    } else if (paused || !active) {
      draw();
    }
  }

  function stepWeights(dt: number) {
    const k = 1 - Math.exp(-dt / 0.42);
    for (const s of SCENES) {
      let goal = s === target ? 1 : 0;
      // The swarm stays faintly behind the model panel
      if (s === 'swarm' && target === 'model') goal = 0.6;
      weights[s] += (goal - weights[s]) * k;
    }
  }

  /** Where a courier is: hub, out to its house, down to the door, back. */
  function courier(k: number, t: number) {
    const T = 8.5;
    const u = mod(t / T + k / courierCount + k * 0.071, 1);
    const house = houses[k % houses.length];
    const hy = ground - 10;
    const doorX = house.x + house.w * 0.32;
    const doorY = ground - 12;
    const cruise = ground - skyH * (0.3 + 0.18 * ((k * 0.37) % 1));
    let x = hubX;
    let y = hy;
    let carrying = true;
    let drop = -1; // package fall, 0..1
    let parcel = 0; // package resting at the door, alpha
    if (u < 0.1) {
      y = lerp(hy, cruise, ease(u / 0.1));
    } else if (u < 0.42) {
      const s = ease((u - 0.1) / 0.32);
      x = lerp(hubX, doorX, s);
      y = cruise - Math.sin(Math.PI * s) * skyH * 0.06;
    } else if (u < 0.52) {
      x = doorX;
      y = lerp(cruise, doorY, ease((u - 0.42) / 0.1));
    } else if (u < 0.6) {
      x = doorX;
      y = doorY;
      drop = clamp01((u - 0.52) / 0.03);
      carrying = false;
      parcel = 1;
    } else if (u < 0.7) {
      x = doorX;
      y = lerp(doorY, cruise, ease((u - 0.6) / 0.1));
      carrying = false;
      parcel = 1 - smooth(0.62, 0.7, u);
    } else if (u < 0.94) {
      const s = ease((u - 0.7) / 0.24);
      x = lerp(doorX, hubX, s);
      y = cruise - Math.sin(Math.PI * s) * skyH * 0.04;
      carrying = false;
    } else {
      x = hubX;
      y = lerp(cruise, hy, ease((u - 0.94) / 0.06));
      carrying = false;
    }
    return { x, y, carrying, drop, parcel, doorX, doorY };
  }

  /** A Drako target: crosses the lane from the right, weaving or diving; some are hit. */
  function drakoTarget(j: number, t: number) {
    const P = 7.2;
    const wave = Math.floor(j / 7);
    const slot = j % 7;
    const rand = mulberry32(100 + j);
    const r1 = rand();
    const r2 = rand();
    const r3 = rand();
    const r4 = rand();
    const c = mod(t + wave * 1.45 + slot * 0.11, P);
    const v = W / 4.4;
    const xs = W + 24 + slot * 16;
    const ys = ground - skyH * (wide ? 0.28 + 0.44 * r1 : 0.22 + 0.3 * r1);
    const weave = (8 + 22 * r2) * Math.sin(c * (2.2 + 2 * r3) + r4 * 6.3);
    const dives = r2 < 0.3;
    let x = xs - v * c;
    const diveAt = W * (0.5 + 0.2 * r3);
    let y = ys + weave;
    if (dives && x < diveAt) y += skyH * (wide ? 0.22 : 0.14) * Math.sin(Math.PI * clamp01((diveAt - x) / (W * 0.3)));
    const hitX = r4 < 0.66 ? laneX0 + (laneX1 - laneX0) * (0.2 + 0.4 * r1) : -1;
    let alpha = 0.95;
    let hitAge = -1;
    let hx = 0;
    let hy = 0;
    if (hitX > 0) {
      const cHit = (xs - hitX) / v;
      if (c > cHit) {
        const age = c - cHit;
        hitAge = age;
        hx = hitX;
        const yAtHit = ys + (8 + 22 * r2) * Math.sin(cHit * (2.2 + 2 * r3) + r4 * 6.3);
        hy = yAtHit;
        x = hitX - v * 0.12 * age;
        y = yAtHit + 0.5 * skyH * 2.2 * age * age;
        alpha = y > ground - 2 ? 0 : 0.95 * (1 - smooth(0.2, 1.1, age));
      }
    }
    if (x < -30) alpha = 0;
    // Fade in at the right edge
    alpha *= smooth(W + 30, W - 40, x);
    return { x, y, alpha, hitAge, hx, hy };
  }

  // ---- Drawing ---------------------------------------------------------------

  function collectClearRects(canvasTop: number, canvasLeft: number) {
    const rects: number[] = [];
    for (const el of clearSources) {
      const r = el.getBoundingClientRect();
      const top = r.top - canvasTop - 18;
      const bottom = r.bottom - canvasTop + 18;
      if (bottom < 0 || top > ground) continue;
      rects.push(r.left - canvasLeft - 22, top, r.right - canvasLeft + 22, bottom);
    }
    return rects;
  }

  function label(text: string, x: number, y: number, alpha: number, align: CanvasTextAlign = 'left', rgb = ASH) {
    if (alpha < 0.02) return;
    ctx!.font = FONT;
    ctx!.textBaseline = 'middle';
    ctx!.textAlign = align;
    ctx!.fillStyle = `rgba(${rgb}, ${0.8 * alpha})`;
    ctx!.fillText(text, x, y);
  }

  function draw() {
    if (!ctx || !n) return;
    const t = reduced ? 3.1 : time;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const box = canvas.getBoundingClientRect();
    const clear = collectClearRects(box.top, box.left);

    const wSwarm = weights.swarm;
    const wModel = weights.model;
    const wDel = clamp01(weights.delivery + weights.weather);
    const wWx = weights.weather;
    const wDrako = weights.drako;
    const wShow = weights.shows;
    const wFleet = weights.fleet;

    // Ground below the horizon, and a faint glow along it
    const tint = ctx.createLinearGradient(0, ground, 0, H);
    tint.addColorStop(0, 'rgba(43, 34, 29, 0.55)');
    tint.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = tint;
    ctx.fillRect(0, ground, W, H - ground);
    const haze = ctx.createLinearGradient(0, ground - skyH * 0.25, 0, ground);
    haze.addColorStop(0, 'rgba(111, 82, 255, 0)');
    haze.addColorStop(1, `rgba(111, 82, 255, ${0.05 + 0.04 * wSwarm})`);
    ctx.fillStyle = haze;
    ctx.fillRect(0, ground - skyH * 0.25, W, skyH * 0.25);

    ctx.beginPath();
    ctx.moveTo(0, ground + 0.5);
    ctx.lineTo(W, ground + 0.5);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#5a473b';
    ctx.stroke();

    // ---- Delivery: routes, hub and houses
    if (wDel > 0.01) {
      ctx.setLineDash([2, 7]);
      ctx.strokeStyle = `rgba(${GLACIER}, ${0.2 * wDel})`;
      for (let k = 0; k < houses.length; k++) {
        const h = houses[k];
        const cruise = ground - skyH * (0.3 + 0.18 * ((k * 0.37) % 1));
        ctx.beginPath();
        ctx.moveTo(hubX, ground - 26);
        ctx.quadraticCurveTo((hubX + h.x) / 2, cruise - skyH * 0.06, h.x + h.w * 0.32, ground - h.h - 6);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Hub: a pad on a short mast
      ctx.strokeStyle = `rgba(${ASH}, ${0.6 * wDel})`;
      ctx.beginPath();
      ctx.moveTo(hubX, ground);
      ctx.lineTo(hubX, ground - 22);
      ctx.moveTo(hubX - 11, ground - 22);
      ctx.lineTo(hubX + 11, ground - 22);
      ctx.stroke();
      ctx.fillStyle = `rgba(${GLACIER}, ${0.9 * wDel})`;
      ctx.fillRect(hubX - 2, ground - 26, 4, 4);

      for (const h of houses) {
        const x0 = h.x - h.w / 2;
        const top = ground - h.h;
        ctx.strokeStyle = `rgba(${ASH}, ${0.42 * wDel})`;
        ctx.beginPath();
        ctx.moveTo(x0, ground);
        ctx.lineTo(x0, top);
        ctx.lineTo(h.x, top - h.w * 0.42);
        ctx.lineTo(x0 + h.w, top);
        ctx.lineTo(x0 + h.w, ground);
        ctx.stroke();
        // A lit window
        ctx.fillStyle = `rgba(${AMBER}, ${0.75 * wDel})`;
        ctx.fillRect(h.x - h.w * 0.22, top + h.h * 0.3, 4, 4);
      }
      label(L.hub, hubX, ground + 24, wDel, 'center', PUMICE);
      const h0 = houses[wide ? Math.min(houses.length - 1, 1) : 0];
      label(L.door, h0.x + h0.w * 0.32, ground + 24, wDel, 'center', PUMICE);
    }

    // ---- Weather: rain and gusts (a still frame keeps them, at rest)
    if (wWx > 0.01) {
      const drops = wide ? 150 : 80;
      const rand = mulberry32(5);
      ctx.strokeStyle = `rgba(${ASH}, ${0.16 * wWx})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let r = 0; r < drops; r++) {
        const sx = rand() * (W + 200) - 100;
        const sp = 260 + rand() * 180;
        const len = 8 + rand() * 10;
        const yy = mod(t * sp + rand() * skyH, skyH + 40) - 20;
        const xx = sx + yy * 0.28;
        if (yy > ground - 2) continue;
        let covered = false;
        for (let r = 0; r < clear.length; r += 4) {
          if (xx > clear[r] && xx < clear[r + 2] && yy > clear[r + 1] && yy < clear[r + 3]) {
            covered = true;
            break;
          }
        }
        if (covered) continue;
        ctx.moveTo(xx, yy);
        ctx.lineTo(xx + len * 0.28, yy + len);
      }
      ctx.stroke();
      // Gusts
      for (let g = 0; g < 5; g++) {
        const gy = ground - skyH * (wide ? 0.2 + 0.13 * g : 0.16 + 0.085 * g);
        const span = W + 360;
        const gx = mod(t * (140 + g * 30) + g * 260, span) - 180;
        const len = 70 + g * 12;
        let fade = smooth(-180, 0, gx) * smooth(W + 180, W - 40, gx);
        for (let r = 0; r < clear.length; r += 4) {
          if (gx > clear[r] && gx - len < clear[r + 2] && gy > clear[r + 1] && gy < clear[r + 3]) fade *= 0.15;
        }
        ctx.strokeStyle = `rgba(${GLACIER}, ${0.32 * wWx * fade})`;
        ctx.beginPath();
        ctx.moveTo(gx - len, gy);
        ctx.lineTo(gx, gy);
        ctx.moveTo(gx - 6, gy - 4);
        ctx.lineTo(gx, gy);
        ctx.lineTo(gx - 6, gy + 4);
        ctx.stroke();
      }
    }
    if (wWx > 0.01) label(L.weather, W - (wide ? 48 : 20), ground - skyH * (wide ? 0.86 : 0.6), wWx, 'right', PUMICE);

    // ---- Drako: crew position and range marks
    if (wDrako > 0.01) {
      ctx.strokeStyle = `rgba(${ASH}, ${0.55 * wDrako})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(laneX0 - 10, ground - 10, 20, 10);
      ctx.beginPath();
      ctx.moveTo(laneX0, ground - 10);
      ctx.lineTo(laneX0, ground - 24);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${PUMICE}, ${0.5 * wDrako})`;
      ctx.beginPath();
      for (let x = laneX0 + 50; x < laneX1; x += wide ? 72 : 56) {
        ctx.moveTo(x, ground);
        ctx.lineTo(x, ground - 6);
      }
      ctx.stroke();
      label(L.lane, laneX0 - 10, ground + 24, wDrako, 'left', PUMICE);
    }

    // ---- Shows: the launch pad
    if (wShow > 0.01) label(L.spares, padX, ground + 24, wShow, 'left', PUMICE);

    // ---- Drones
    const dimModel = 1 - 0.72 * wModel;
    const dataDash = 7;
    let lastHit = { age: 9, x: 0, y: 0 };
    const rings: { x: number; y: number; age: number; w: number }[] = [];
    const parcels: { x: number; y: number; a: number }[] = [];

    for (let i = 0; i < n; i++) {
      // Rest: a plane of drones in perspective, drifting toward you
      const z = Z_NEAR + mod(PZ[i] - Z_NEAR - DRIFT * t, Z_SPAN);
      const inv = 1 / z;
      let x = W / 2 + PX[i] * (W * 0.56) * inv;
      let y = ground - skyH * 0.97 * PA[i] * inv;
      const edge = smooth(Z_FAR, Z_FAR - 1.2, z) * smooth(Z_NEAR, Z_NEAR + 0.5, z);
      let a = (0.2 + 0.66 * Math.pow(inv, 0.55)) * edge * (0.7 + 0.3 * wSwarm);
      let s = 1.2 + 2.3 * inv;
      const near = inv > 0.55 ? (inv - 0.55) / 0.45 : 0; // the closest drones get a soft halo
      let rgb = GLACIER;
      let dash = 0;
      let glyph = 0; // 1 draws a small quadcopter instead of a dot
      let tail = 0; // length of a speed streak behind the drone

      // Delivery
      const ck = courierOf[i];
      if (wDel > 0.002) {
        if (ck >= 0) {
          const c = courier(ck, t);
          let cx = c.x;
          let cy = c.y;
          if (wWx > 0.01) {
            cx += 9 * Math.sin(t * 1.4 + ck * 1.7) * wWx;
            cy += 4 * Math.sin(t * 2.3 + ck) * wWx;
          }
          x += (cx - x) * wDel;
          y += (cy - y) * wDel;
          a = lerp(a, 0.95, wDel);
          s = lerp(s, 2.8, wDel);
          if (wDel > 0.5) glyph = 1;
          if (c.carrying) parcels.push({ x: cx, y: cy + 6, a: wDel });
          else if (c.drop >= 0) parcels.push({ x: c.doorX, y: lerp(c.doorY + 6, ground - 3, c.drop), a: wDel });
          if (c.parcel > 0 && c.drop >= 1) parcels.push({ x: c.doorX, y: ground - 3, a: wDel * c.parcel });
        } else {
          a *= 1 - 0.78 * wDel;
        }
      }

      // Drako
      const tj = targetOf[i];
      if (wDrako > 0.002) {
        if (tj >= 0) {
          const d = drakoTarget(tj, t);
          x += (d.x - x) * wDrako;
          y += (d.y - y) * wDrako;
          a = lerp(a, d.alpha, wDrako);
          s = lerp(s, 2.6, wDrako);
          if (wDrako > 0.5) {
            glyph = 1;
            if (d.hitAge < 0 && !reduced) tail = 16 * wDrako;
          }
          if (d.hitAge >= 0 && d.hitAge < 0.7) {
            rings.push({ x: d.hx, y: d.hy, age: d.hitAge, w: wDrako });
            if (d.hitAge < lastHit.age) lastHit = { age: d.hitAge, x: d.hx, y: d.hy };
          }
          if (d.hitAge >= 0 && wDrako > 0.5) rgb = AMBER;
        } else {
          a *= 1 - 0.82 * wDrako;
        }
      }

      // Shows
      const fi = formOf[i];
      const si = spareOf[i];
      if (wShow > 0.002) {
        if (fi >= 0) {
          const u = formU[fi];
          const v = formV[fi];
          const start = since.shows < 0 ? 0 : since.shows;
          const grow = reduced ? 1 : smooth(0, 1.4, t - start - (1 - v) * 1.1);
          const k = wShow * grow;
          const fx = treeX + (u - 0.5) * treeW;
          const fy = treeTop + v * treeH;
          // Rise from the pad first, then into place
          x += (fx - x) * k;
          y += (fy - y) * k;
          const twinkle = reduced ? 1 : 0.78 + 0.22 * Math.sin(t * 2.2 + SEED[i] * 6.28);
          a = lerp(a, 0.92 * twinkle, k);
          s = lerp(s, 2.4, k);
          if (k > 0.5) rgb = v > 0.8 ? AMBER : v < 0.35 ? VIOLET : GLACIER;
        } else if (si >= 0) {
          const per = wide ? 18 : 10;
          const px = padX + (si % per) * 9;
          const py = ground - 4 - Math.floor(si / per) * 7;
          x += (px - x) * wShow;
          y += (py - y) * wShow;
          a = lerp(a, 0.55, wShow);
          s = lerp(s, 2, wShow);
        } else {
          a *= 1 - 0.88 * wShow;
        }
      }

      // Fleet: lift into rows of flight data that stream into the model
      if (wFleet > 0.002) {
        const start = since.fleet < 0 ? 0 : since.fleet;
        const age = reduced ? 3 : Math.max(0, t - start);
        const lift = smooth(0, 1, (age - COLT[i] * 0.7) / 1.1) * wFleet;
        const row = slotRow[i];
        const travel = reduced ? 0 : (age * rowSpeed[row]) % streamSpan;
        let sx = slotX[i] + travel;
        if (sx > W + 30) sx -= streamSpan;
        const sink = W - (wide ? 72 : 28);
        const edgeFade = smooth(-10, 60, sx) * smooth(sink + 6, sink - Math.min(150, W * 0.22), sx);
        x += (sx - x) * lift;
        y += (dataTop + row * rowGap - y) * lift;
        const bright = slotBright[i] ? 0.95 : 0.3;
        a = a * (1 - lift) + bright * edgeFade * lift;
        s = lerp(s, 2, lift);
        if (lift > 0.5 && slotBright[i]) dash = dataDash * smooth(0.5, 1, lift);
      }

      // Keep text readable where copy passes over the sky
      for (let r = 0; r < clear.length; r += 4) {
        if (x > clear[r] && x < clear[r + 2] && y > clear[r + 1] && y < clear[r + 3]) {
          a *= 0.1;
          break;
        }
      }

      a *= dimModel;
      if (a < 0.02 || y > ground + 1) continue;
      if (a > 1) a = 1;
      ctx.fillStyle = `rgb(${rgb})`;
      if (tail > 0) {
        ctx.globalAlpha = a * 0.3;
        ctx.fillRect(x + 4, y - 0.5, tail, 1);
      }
      if (near > 0 && !glyph && !dash && rgb === GLACIER) {
        ctx.globalAlpha = a * 0.16 * near;
        ctx.fillRect(x - s * 1.6, y - s * 1.6, s * 3.2, s * 3.2);
      }
      ctx.globalAlpha = a;
      if (dash > s) ctx.fillRect(x - dash / 2, y - 1, dash, 2);
      else if (glyph) {
        // A quadcopter from above: the body and four rotors
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        ctx.fillRect(x - 4.2, y - 4.2, 2, 2);
        ctx.fillRect(x + 2.2, y - 4.2, 2, 2);
        ctx.fillRect(x - 4.2, y + 2.2, 2, 2);
        ctx.fillRect(x + 2.2, y + 2.2, 2, 2);
      } else ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;

    // Packages under couriers, falling at the door, resting on the step
    for (const p of parcels) {
      ctx.fillStyle = `rgba(${AMBER}, ${0.9 * p.a})`;
      ctx.fillRect(p.x - 2.5, p.y - 2.5, 5, 5);
    }

    // Hits on the lane
    for (const r of rings) {
      const k = r.age / 0.7;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 3 + 26 * k, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${AMBER}, ${0.85 * (1 - k) * r.w})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    if (wDrako > 0.01) {
      if (reduced) {
        // A still frame still shows where a hit lands
        const d = drakoTarget(3, 2.2);
        ctx.beginPath();
        ctx.arc(d.hx || W * 0.4, d.hy || ground - skyH * 0.5, 14, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${AMBER}, ${0.7 * wDrako})`;
        ctx.stroke();
        label(L.hit, (d.hx || W * 0.4) + 22, (d.hy || ground - skyH * 0.5) - 10, wDrako, 'left', AMBER);
      } else if (lastHit.age < 0.7) {
        label(L.hit, lastHit.x + 18, lastHit.y - 14, wDrako * (1 - lastHit.age / 0.7), 'left', AMBER);
      }
    }

    // Show formation label
    if (wShow > 0.01) {
      const start = since.shows < 0 ? 0 : since.shows;
      const reveal = reduced ? 1 : smooth(1.6, 2.4, t - start);
      const lx = treeX + treeW * 0.1 + 14;
      if (lx + 130 < W) label(L.formation, lx, treeTop + treeH * 0.07, wShow * reveal);
      else label(L.formation, treeX, treeTop - 18, wShow * reveal, 'center');
    }

    // Where the flight data goes
    if (wFleet > 0.01) {
      const start = since.fleet < 0 ? 0 : since.fleet;
      const reach = reduced ? 1 : smooth(0.6, 1.6, t - start);
      const x = W - (wide ? 72 : 28);
      ctx.strokeStyle = `rgba(${GLACIER}, ${0.55 * wFleet * reach})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, dataTop - 18);
      ctx.lineTo(x, dataTop + (rows - 1) * rowGap + 18);
      ctx.stroke();
      label(L.model, x, dataTop + (rows - 1) * rowGap + 38, wFleet * reach, 'right');
    }
  }

  // ---- Loop ------------------------------------------------------------------

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

  /** Show a scene at once, with no transition: for bands that open on a scene. */
  function jumpTo(scene: SkyScene) {
    target = scene;
    since[scene] = time;
    for (const s of SCENES) weights[s] = s === scene ? 1 : 0;
    if (reduced || paused || !active) draw();
  }

  return {
    layout,
    setScene,
    jumpTo,
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

export type Sky = ReturnType<typeof createSky>;
