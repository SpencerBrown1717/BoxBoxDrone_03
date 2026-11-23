/**
 * The drawn scenes that lead each mission and technology page: technical
 * illustrations in the same language as the home page sky. The horizon in basalt,
 * a faint plane of drones above it, flight in glacier, hits and parcels in amber.
 *
 * Every scene draws into a 1200 x 600 box and returns SVG markup plus the labels
 * it shows, so small screens can list them below the picture.
 * Motion is CSS (classes ping, flow, twinkle, sway) or SMIL;
 * TopicScene pauses both for reduced motion and the pause control.
 */
import type { SceneName } from '../content/topics/types';

export const SCENE_W = 1200;
export const SCENE_H = 600;

type Pt = [number, number];

const f = (n: number) => String(Math.round(n * 10) / 10);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const line = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join('');

/** A smooth curve through points (Catmull-Rom as cubic Béziers). */
function smooth(pts: Pt[]): string {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const p = (d: string, cls: string, extra = '') => `<path class="${cls}" d="${d}"${extra ? ` ${extra}` : ''}/>`;

const label = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'start', cls = 'lbl') =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${esc(text)}</text>`;

const leader = (pts: Pt[]) => p(line(pts), 'leader');

interface Scene {
  body: string;
  labels: string[];
}

interface Ctx {
  uid: string;
  labels: string[];
}

/** Records a label for the legend and returns the SVG text. */
function L(ctx: Ctx, x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'start'): string {
  ctx.labels.push(text);
  return label(x, y, text, anchor);
}

/** The faint plane of drones above the horizon, in perspective, as on the home page. */
function plane(ground: number, count = 260, seed = 11, keep?: (x: number, y: number) => boolean): string {
  const rand = seeded(seed);
  const near: string[] = [];
  const far: string[] = [];
  for (let i = 0; i < count; i++) {
    const z = 1.25 + 8.75 * ((i + rand() * 0.9) / count);
    const x = 600 + ((rand() * 2 - 1) * 9.8 * 1200 * 0.56) / z;
    const y = ground - (ground * 0.97) / z;
    if (x < 4 || x > 1196) continue;
    if (keep && !keep(x, y)) continue;
    (z < 3 ? near : far).push(`M${f(x)} ${f(y)}h0`);
  }
  return p(near.join(''), 'dots') + p(far.join(''), 'dots soft');
}

/** A drone seen from the side: a body, two rotor bars and their hubs. */
function drone(x: number, y: number, s = 1, cls = 'craft'): string {
  const w = 34 * s;
  return `<g class="${cls}" transform="translate(${f(x)} ${f(y)})"><path class="craft-body" d="M${f(-8 * s)} ${f(-3 * s)}h${f(16 * s)}v${f(7 * s)}h${f(-16 * s)}Z"/><path class="craft-arm" d="M${f(-w / 2 + 3)} 0H${f(w / 2 - 3)}"/><path class="craft-rotor" d="M${f(-w / 2 - 6 * s)} ${f(-5 * s)}h${f(16 * s)}M${f(w / 2 - 10 * s)} ${f(-5 * s)}h${f(16 * s)}"/><path class="craft-arm" d="M${f(-w / 2 + 2)} 0v${f(-5 * s)}M${f(w / 2 - 2)} 0v${f(-5 * s)}"/></g>`;
}

/** A house on the horizon, with a lit window. */
function house(x: number, ground: number, w: number): string {
  const h = w * 0.62;
  const top = ground - h;
  const body = `M${f(x - w / 2)} ${f(ground)}V${f(top)}L${f(x)} ${f(top - w * 0.42)}L${f(x + w / 2)} ${f(top)}V${f(ground)}`;
  const door = `M${f(x + w * 0.12)} ${f(ground)}v${f(-h * 0.48)}h${f(w * 0.18)}v${f(h * 0.48)}`;
  return p(body, 'house') + p(door, 'house') + `<rect class="window" x="${f(x - w * 0.3)}" y="${f(top + h * 0.22)}" width="${f(w * 0.14)}" height="${f(w * 0.12)}"/>`;
}

function arrow(x: number, y: number, len: number, cls = 'wind'): string {
  return p(`M${f(x - len)} ${f(y)}H${f(x)}M${f(x - 9)} ${f(y - 6)}L${f(x)} ${f(y)}L${f(x - 9)} ${f(y + 6)}`, cls);
}

/** The redwood Palo Alto is named for, as a show formation of dots. */
function redwood(cx: number, top: number, h: number): { canopyHi: string; canopy: string; trunk: string } {
  const w = h * 0.56;
  const hi: string[] = [];
  const mid: string[] = [];
  const trunk: string[] = [];
  for (let v = 0.015; v < 1; v += 0.034) {
    for (let u = 0.015; u < 1; u += 0.045) {
      const dx = Math.abs(u - 0.5);
      let inside = v > 0.8 && dx < 0.045;
      for (let k = 0; k < 5 && !inside && v <= 0.86; k++) {
        const t0 = k * 0.155;
        const t1 = t0 + 0.3;
        if (v >= t0 && v <= t1 && dx < ((v - t0) / (t1 - t0)) * (0.16 + k * 0.08)) inside = true;
      }
      if (!inside) continue;
      const d = `M${f(cx + (u - 0.5) * w)} ${f(top + v * h)}h0`;
      if (v > 0.8) trunk.push(d);
      else if (v < 0.34) hi.push(d);
      else mid.push(d);
    }
  }
  return { canopyHi: hi.join(''), canopy: mid.join(''), trunk: trunk.join('') };
}

/* ------------------------------------------------------------------ */
/* Delivery                                                           */
/* ------------------------------------------------------------------ */

function delivery(ctx: Ctx): string {
  const G = 500;
  const out: string[] = [];
  out.push(plane(G, 220, 3, (x, y) => !(x > 560 && y > 330)));

  // Hub
  const hub = 120;
  out.push(p(`M${hub} ${G}v-46M${hub - 22} ${G - 46}h44`, 'mark'));
  out.push(`<rect class="pad" x="${hub - 5}" y="${G - 56}" width="10" height="10"/>`);

  // Houses
  const homes: [number, number][] = [
    [660, 70],
    [850, 84],
    [1050, 70],
  ];
  for (const [x, w] of homes) out.push(house(x, G, w));

  // Routes: out at cruise height, down to the door
  const door: Pt = [850 + 84 * 0.21, G - 52];
  const route: Pt[] = [
    [hub, G - 60],
    [hub + 30, 290],
    [360, 196],
    [620, 188],
    [door[0] - 10, 300],
    [door[0], door[1] - 46],
  ];
  out.push(p(smooth(route), 'route flow'));
  out.push(p(smooth([[hub, G - 60], [hub + 60, 330], [480, 260], [1050 + 15, G - 120]]), 'route soft'));
  out.push(p(smooth([[hub, G - 60], [hub + 40, 360], [430, 320], [660 + 15, G - 108]]), 'route soft'));

  // A courier at cruise, and one lowering a box at the door
  out.push(drone(470, 190, 1.2));
  out.push(drone(door[0], door[1] - 50, 1.2));
  out.push(p(`M${f(door[0])} ${f(door[1] - 44)}V${f(door[1] - 6)}`, 'tether'));
  out.push(`<rect class="parcel" x="${f(door[0] - 7)}" y="${f(door[1] - 6)}" width="14" height="12"/>`);
  out.push(`<circle class="ping" cx="${f(door[0])}" cy="${f(G - 2)}" r="20"/>`);

  // Wind and rain over the houses
  out.push(arrow(330, 110, 90), arrow(520, 140, 70), arrow(250, 160, 60));
  const rand = seeded(29);
  let rain = '';
  for (let k = 0; k < 70; k++) {
    const x = 560 + rand() * 600;
    const y = 60 + rand() * 300;
    rain += `M${f(x)} ${f(y)}l5 16`;
  }
  out.push(p(rain, 'rain'));

  out.push(L(ctx, hub, G + 40, 'Hub', 'middle'));
  out.push(L(ctx, 470, 158, 'Cruise'));
  out.push(L(ctx, door[0], G + 40, 'Doorstep', 'middle'));
  out.push(L(ctx, 250, 84, 'Wind and rain'));
  return out.join('');
}

/* ------------------------------------------------------------------ */
/* Drako Drones                                                       */
/* ------------------------------------------------------------------ */

function drako(ctx: Ctx): string {
  const G = 500;
  const out: string[] = [];
  out.push(plane(G, 160, 7));

  // Crew position and range marks
  out.push(p(`M80 ${G}v-26h52v26M106 ${G - 26}v-30`, 'mark'));
  let ticks = '';
  for (let x = 190; x < 1120; x += 70) ticks += `M${x} ${G}v-10`;
  out.push(p(ticks, 'tick'));

  // Launch cases at the far end
  out.push(p(`M1092 ${G}v-18h36v18M1134 ${G}v-18h36v18`, 'mark'));

  // Three waves crossing right to left
  const waves: { y: number; amp: number; dive?: boolean }[] = [
    { y: 170, amp: 18 },
    { y: 260, amp: 26, dive: true },
    { y: 330, amp: 14 },
  ];
  const rand = seeded(41);
  waves.forEach((wave, w) => {
    const pts: Pt[] = [];
    for (let x = 1180; x >= 300; x -= 40) {
      let y = wave.y + wave.amp * Math.sin(x / 70 + w);
      if (wave.dive && x < 700) y += 120 * Math.sin(Math.PI * Math.min(1, (700 - x) / 380));
      pts.push([x, y]);
    }
    out.push(p(smooth(pts), 'track'));
    let dots = '';
    for (let k = 0; k < 6; k++) {
      const x = 760 + k * 64 + rand() * 20;
      const y = wave.y + wave.amp * Math.sin(x / 70 + w) + (rand() - 0.5) * 16;
      dots += `M${f(x)} ${f(y)}h0`;
    }
    out.push(p(dots, 'target'));
  });

  // Hits: amber rings, and the fall to the ground
  const hits: Pt[] = [
    [470, 176],
    [560, 352],
    [380, 330],
  ];
  for (const [x, y] of hits) {
    out.push(`<circle class="hit" cx="${x}" cy="${y}" r="16"/>`);
    out.push(`<circle class="ping amber" cx="${x}" cy="${y}" r="16"/>`);
    out.push(p(`M${x} ${y}Q${x - 22} ${f((y + G) / 2)} ${x - 34} ${G - 2}`, 'fall'));
  }

  out.push(L(ctx, 80, G + 40, 'Training lane'));
  out.push(L(ctx, 1110, 140, 'Swarm wave', 'middle'));
  out.push(L(ctx, 494, 150, 'Hit'));
  out.push(L(ctx, 640, 440, 'Dive'));
  out.push(L(ctx, 1110, G + 40, 'Launch cases', 'middle'));
  return out.join('');
}

/* ------------------------------------------------------------------ */
/* Drone shows                                                        */
/* ------------------------------------------------------------------ */

function shows(ctx: Ctx): string {
  const G = 520;
  const out: string[] = [];
  out.push(plane(G, 120, 19, (x) => x < 560 || x > 1000));

  const tree = redwood(780, 40, 440);
  out.push(p(tree.canopyHi, 'form-hi twinkle'));
  out.push(p(tree.canopy, 'form'));
  out.push(p(tree.trunk, 'form-trunk'));

  // Spares on the launch grid, and the operator
  let spares = '';
  for (let k = 0; k < 40; k++) spares += `M${110 + (k % 20) * 13} ${G - 6 - Math.floor(k / 20) * 12}h0`;
  out.push(p(spares, 'spare'));
  out.push(p(`M380 ${G}v-22h46v22M392 ${G - 22}v-12h22v12`, 'mark'));

  // A rising spare, filling a gap
  out.push(p(`M290 ${G - 30}C360 380 540 300 ${f(780 - 60)} ${f(40 + 0.5 * 440)}`, 'route flow'));

  out.push(arrow(300, 140, 110), arrow(240, 186, 80));

  out.push(L(ctx, 1020, 110, 'Formation'));
  out.push(leader([[1012, 116], [900, 160]]));
  out.push(L(ctx, 110, G + 36, 'Spares'));
  out.push(L(ctx, 403, G + 36, 'One operator', 'middle'));
  out.push(L(ctx, 190, 110, 'Wind'));
  return out.join('');
}

/* ------------------------------------------------------------------ */
/* The world action model                                             */
/* ------------------------------------------------------------------ */

function wam(ctx: Ctx): string {
  const out: string[] = [];

  // What it sees: three camera frames
  for (let k = 0; k < 3; k++) {
    const x = 60 + k * 18;
    const y = 150 + k * 18;
    out.push(`<rect class="frame-box${k < 2 ? ' dim' : ''}" x="${x}" y="${y}" width="220" height="150" rx="8"/>`);
  }
  const fx = 96;
  const fy = 186;
  out.push(p(`M${fx} ${fy + 96}H${fx + 220}`, 'ground'));
  out.push(house(fx + 150, fy + 96, 40));
  out.push(drone(fx + 70, fy + 40, 0.8));

  // The model
  out.push(p('M330 262H420M410 254l10 8-10 8', 'arrow'));
  out.push(`<rect class="model-box" x="430" y="170" width="220" height="190" rx="18"/>`);
  let grid = '';
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) grid += `M${466 + c * 30} ${206 + r * 30}h0`;
  out.push(p(grid, 'model-grid'));
  out.push(p('M660 262H730M720 254l10 8-10 8', 'arrow'));

  // Imagines and flies: a top view with obstacles, imagined moves and the chosen one
  out.push(`<rect class="block" x="880" y="120" width="120" height="80" rx="4"/>`);
  out.push(`<rect class="block" x="900" y="320" width="150" height="90" rx="4"/>`);
  out.push(`<rect class="block" x="1070" y="230" width="80" height="60" rx="4"/>`);
  const sx = 760;
  const sy = 360;
  const fans: [Pt, boolean][] = [
    [[930, 170], true],
    [[960, 250], false],
    [[980, 340], true],
    [[930, 440], false],
    [[1000, 300], false],
  ];
  for (const [[ex, ey], blocked] of fans) {
    out.push(p(`M${sx} ${sy}Q${f((sx + ex) / 2)} ${f(sy - 20)} ${ex} ${ey}`, blocked ? 'blocked' : 'imagined'));
    out.push(`<rect class="${blocked ? 'blocked-end' : 'imagined-end'}" x="${ex - 3}" y="${ey - 3}" width="6" height="6"/>`);
  }
  out.push(p(`M${sx} ${sy}C880 320 1010 260 1060 180`, 'chosen'));
  out.push(`<path class="door" d="M1060 168l12 12-12 12-12-12Z"/>`);
  out.push(drone(sx, sy, 0.9));

  out.push(L(ctx, 60, 124, 'What it sees'));
  out.push(L(ctx, 540, 150, 'World action model', 'middle'));
  out.push(L(ctx, 760, 470, 'Imagined moves'));
  out.push(L(ctx, 1080, 160, 'The move it flies'));
  out.push(L(ctx, 1000, 452, 'Blocked'));
  return out.join('');
}

/* ------------------------------------------------------------------ */
/* Hardware near zero                                                 */
/* ------------------------------------------------------------------ */

function hardware(ctx: Ctx): string {
  const out: string[] = [];
  const cx = 600;
  const cy = 300;
  const arm = 150;

  // Battery, exploded below
  out.push(`<rect class="battery" x="${cx - 70}" y="${cy + 120}" width="140" height="44" rx="6"/>`);
  out.push(p(`M${cx - 40} ${cy + 142}h80`, 'battery-cells'));
  out.push(p(`M${cx} ${cy + 26}V${cy + 118}`, 'explode'));

  // Frame and motors
  const ends: Pt[] = [
    [cx - arm, cy - arm * 0.62],
    [cx + arm, cy - arm * 0.62],
    [cx + arm, cy + arm * 0.62],
    [cx - arm, cy + arm * 0.62],
  ];
  for (const [x, y] of ends) {
    out.push(p(`M${cx} ${cy}L${x} ${y}`, 'frame'));
    out.push(`<circle class="prop sway" cx="${x}" cy="${y}" r="62"/>`);
    out.push(`<circle class="motor" cx="${x}" cy="${y}" r="16"/>`);
  }
  out.push(`<rect class="frame-plate" x="${cx - 46}" y="${cy - 30}" width="92" height="60" rx="8"/>`);

  // Compute, exploded above, with the model on it
  out.push(p(`M${cx} ${cy - 30}V${cy - 120}`, 'explode'));
  out.push(`<rect class="glow-box" x="${cx - 52}" y="${cy - 196}" width="104" height="72" rx="8"/>`);
  out.push(`<rect class="board" x="${cx - 52}" y="${cy - 196}" width="104" height="72" rx="8"/>`);
  out.push(`<rect class="chip" x="${cx - 18}" y="${cy - 178}" width="36" height="36" rx="4"/>`);

  // Camera at the front
  out.push(`<rect class="camera" x="${cx + 46}" y="${cy - 12}" width="30" height="24" rx="4"/>`);
  out.push(`<circle class="lens" cx="${cx + 84}" cy="${cy}" r="8"/>`);

  out.push(L(ctx, cx + 70, cy - 180, 'Low-cost compute, running the BBD model'));
  out.push(leader([[cx + 64, cy - 186], [cx + 54, cy - 170]]));
  out.push(L(ctx, cx - arm - 80, cy - arm * 0.62 - 80, 'Commodity motors'));
  out.push(L(ctx, cx + 120, cy + 8, 'Camera'));
  out.push(L(ctx, cx + 86, cy + 150, 'Swappable battery'));
  out.push(L(ctx, cx - 280, cy + 30, 'Simple frame'));
  out.push(leader([[cx - 168, cy + 24], [cx - 100, cy + 40]]));
  return out.join('');
}

/* ------------------------------------------------------------------ */
/* Why America: the gap                                               */
/* ------------------------------------------------------------------ */

function gap(ctx: Ctx): string {
  const out: string[] = [];
  // Each dot is 10,000 drones a year
  let ua = '';
  const cols = 32;
  const step = 15;
  const x0 = 80;
  const y0 = 150;
  for (let k = 0; k < 400; k++) ua += `M${x0 + (k % cols) * step} ${y0 + Math.floor(k / cols) * step}h0`;
  out.push(p(ua, 'mass'));
  let us = '';
  for (let k = 0; k < 10; k++) us += `M${900 + (k % 5) * step} ${y0 + Math.floor(k / 5) * step}h0`;
  out.push(p(us, 'mass us'));
  out.push(p(`M${x0 - 10} 360H${x0 + cols * step}`, 'baseline'));
  out.push(p(`M890 360H${900 + 5 * step + 10}`, 'baseline'));

  out.push(L(ctx, x0 - 6, 110, 'Ukraine: about 4 million drones a year'));
  out.push(L(ctx, 890, 96, 'United States: about 100,000'));
  out.push(label(890, 122, 'military drones a year'));
  out.push(L(ctx, x0 - 6, 410, 'Each dot is 10,000 drones'));
  return out.join('');
}

const scenes: Record<SceneName, (ctx: Ctx) => string> = {
  delivery,
  drako,
  shows,
  wam,
  hardware,
  gap,
};

let counter = 0;

/** Draw a scene. Each call gets its own ids, so a page can show a scene twice. */
export function drawScene(name: SceneName): Scene {
  const ctx: Ctx = { uid: `${name}-${++counter}`, labels: [] };
  const body = scenes[name](ctx);
  return { body, labels: ctx.labels };
}
