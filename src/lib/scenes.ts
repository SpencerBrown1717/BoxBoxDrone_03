/**
 * The drawn scenes that lead each topic page: technical illustrations in the
 * same language as the home page field. Ground lines in basalt, the ground as a
 * dot lattice, drones seen from above (four rotors around a body), flight paths
 * in glacier, plans and limits as dashed lines.
 *
 * Every scene draws into a 1200 x 600 box and returns SVG markup plus the
 * labels it shows, so small screens can list them below the picture.
 * Motion is CSS (classes ping and flow) or SMIL; TopicScene pauses both for
 * reduced motion and the pause control.
 */
import type { SceneName } from '../content/topics/types';

export const SCENE_W = 1200;
export const SCENE_H = 600;

type Pt = [number, number];

const f = (n: number) => String(Math.round(n * 10) / 10);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const line = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join('');

/** A smooth curve through points (Catmull-Rom as cubic Béziers). */
function smooth(pts: Pt[], closed = false): string {
  const n = pts.length;
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}

/** Sample a function into points. */
const sample = (x0: number, x1: number, step: number, fn: (x: number) => number): Pt[] => {
  const pts: Pt[] = [];
  for (let x = x0; x <= x1 + 0.001; x += step) pts.push([x, fn(x)]);
  return pts;
};

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const p = (d: string, cls: string, extra = '') => `<path class="${cls}" d="${d}"${extra ? ` ${extra}` : ''}/>`;

/** The ground as a lattice of dots, as the home page draws it. */
function lattice(x0: number, x1: number, y0: number, y1: number, dx = 15, dy = 13): string {
  let d = '';
  for (let r = 0, y = y0; y <= y1; r++, y += dy) {
    for (let x = x0 + (r % 2 ? dx / 2 : 0); x <= x1; x += dx) d += `M${f(x)} ${f(y)}h0`;
  }
  return d;
}

const label = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'start') =>
  `<text class="lbl" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${esc(text)}</text>`;

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

/** A drone seen from above: a body, four arms and four rotors. Drawn around 0,0. */
function droneGlyph(s = 1, cls = ''): string {
  const a = 13 * s;
  const r = 6.5 * s;
  const rotors = [
    [-a, -a],
    [a, -a],
    [-a, a],
    [a, a],
  ]
    .map(([x, y]) => `<circle class="node-chip" cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`)
    .join('');
  return (
    `<g class="drone${cls ? ` ${cls}` : ''}">` +
    p(`M${f(-a)} ${f(-a)}L${f(a)} ${f(a)}M${f(a)} ${f(-a)}L${f(-a)} ${f(a)}`, 'wire') +
    rotors +
    `<rect class="craft solid" x="${f(-5 * s)}" y="${f(-5 * s)}" width="${f(10 * s)}" height="${f(10 * s)}" rx="${f(2 * s)}"/></g>`
  );
}

const droneAt = (x: number, y: number, s = 1, cls = '') => `<g transform="translate(${f(x)} ${f(y)})">${droneGlyph(s, cls)}</g>`;

/**
 * A drone that rides a path once motion is allowed. `phase` starts it that many
 * seconds into its loop (a negative begin offset), so it never waits at the origin.
 */
const droneOn = (pathId: string, dur: number, phase = 0, s = 1) =>
  `<g class="moving">${droneGlyph(s)}<animateMotion begin="indefinite"${phase ? ` data-delay="${-phase}"` : ''} dur="${dur}s" repeatCount="indefinite"><mpath href="#${pathId}"/></animateMotion></g>`;

/** A small house on the ground line. */
function house(x: number, groundY: number, w = 46, h = 34): string {
  const roof = h * 0.68;
  return p(
    `M${f(x - w / 2)} ${f(groundY)}V${f(groundY - h)}L${f(x)} ${f(groundY - h - roof)}L${f(x + w / 2)} ${f(groundY - h)}V${f(groundY)}M${f(x - 6)} ${f(groundY)}v-14h12v14`,
    'craft',
  );
}

function pings(x: number, y: number, r = 16): string {
  return [0, 1, 2].map((i) => `<circle class="ping" cx="${f(x)}" cy="${f(y)}" r="${r}" style="animation-delay:${i * 1.1}s"/>`).join('');
}

/* ------------------------------------------------------------------ */
/* Delivery                                                           */
/* ------------------------------------------------------------------ */

function delivery(ctx: Ctx): string {
  const G = 470;
  const out: string[] = [];
  out.push(p(lattice(12, 1192, G + 18, 594, 18, 15), 'dots soft'));
  out.push(p(`M0 ${G}H1200`, 'ground'));

  // The hub: a pad and a small building
  const hub: Pt = [160, G];
  out.push(`<rect class="station-box" x="112" y="${G - 42}" width="96" height="42" rx="3"/>`);
  out.push(p(`M124 ${G - 42}V${G - 58}H196V${G - 42}`, 'craft'));
  out.push(pings(hub[0], G - 72, 14));

  // Homes along the street
  const homes = [430, 590, 750, 910, 1070];
  homes.forEach((x) => out.push(house(x, G)));

  // Planned routes to every home, and the live one to the new address
  const from: Pt = [hub[0], G - 76];
  homes.forEach((x, i) => {
    const to: Pt = [x, G - 70];
    const cy = 150 + i * 16;
    out.push(p(`M${from[0]} ${from[1]}Q${f((from[0] + to[0]) / 2)} ${cy} ${to[0]} ${to[1]}`, 'route'));
  });
  const live = `${ctx.uid}-live`;
  const back = `${ctx.uid}-back`;
  const target: Pt = [homes[4], G - 70];
  out.push(p(`M${from[0]} ${from[1]}Q${f((from[0] + target[0]) / 2)} 110 ${target[0]} ${target[1]}`, 'signal flow', `id="${live}"`));
  out.push(`<path id="${back}" d="M${homes[2]} ${G - 70}Q${f((from[0] + homes[2]) / 2)} 140 ${from[0]} ${from[1]}" fill="none" stroke="none"/>`);

  // The new address, marked
  out.push(p(`M${target[0] - 40} ${G - 110}h80v110h-80Z`, 'zone-edge'));
  out.push(pings(target[0], G - 54, 12));

  // Drones: one on its way out, one coming home
  out.push(`<g class="static-only">${droneAt(760, 150)}${droneAt(330, 262, 0.85)}</g>`);
  out.push(droneOn(live, 7.5));
  out.push(droneOn(back, 6.2, 1.4, 0.85));

  out.push(leader([[160, G + 14], [160, G + 30]]));
  out.push(L(ctx, 160, G + 52, 'Hub', 'middle'));
  out.push(L(ctx, target[0], G - 128, 'New address', 'middle'));
  out.push(L(ctx, 600, 96, 'Live route', 'middle'));
  out.push(L(ctx, 430, G + 52, 'Homes on the street', 'start'));
  return out.join('');
}

/* ------------------------------------------------------------------ */
/* World action model                                                 */
/* ------------------------------------------------------------------ */

function wam(ctx: Ctx): string {
  const G = 500;
  const out: string[] = [];
  const cols = [0, 300, 600, 900, 1200];
  out.push(p(lattice(12, 1192, G + 18, 594, 18, 15), 'dots soft'));

  // Night: the third column goes dark
  out.push(`<rect class="hull-fill" x="${cols[2]}" y="40" width="300" height="${G - 40}"/>`);
  out.push(p('M790 92a26 26 0 1 0 26 34 22 22 0 0 1-26-34Z', 'craft'));

  // Dividers between environments
  for (let i = 1; i < 4; i++) out.push(p(`M${cols[i]} 40V${G}`, 'axis-soft'));

  // Wind: streaks blowing through the first column
  const rand = seeded(19);
  for (let k = 0; k < 9; k++) {
    const y = 120 + k * 40;
    const x0 = 20 + rand() * 60;
    out.push(p(line(sample(x0, x0 + 160 + rand() * 60, 8, (x) => y + 5 * Math.sin((x - x0) / 22))), 'beam flow'));
  }

  // Rain: slanted streaks in the second column
  let rain = '';
  for (let k = 0; k < 54; k++) {
    const x = 316 + rand() * 268;
    const y = 70 + rand() * (G - 110);
    rain += `M${f(x)} ${f(y)}l-6 18`;
  }
  out.push(p(rain, 'beam'));

  // City: blocks on the ground in the fourth column
  const heights = [120, 200, 150, 250, 170];
  heights.forEach((h, i) => out.push(`<rect class="block" x="${918 + i * 56}" y="${G - h}" width="44" height="${h}" rx="2"/>`));
  out.push(p(`M0 ${G}H1200`, 'ground'));

  // The flight: what was flown, the drone now, and the path the model predicts
  const flown: Pt[] = sample(30, 690, 30, (x) => 300 - 70 * Math.sin(x / 150) + 14 * Math.sin(x / 31));
  const ahead: Pt[] = sample(690, 1170, 30, (x) => 300 - 70 * Math.sin(x / 150) - 40 * Math.sin((x - 690) / 260));
  const whole = `${ctx.uid}-flight`;
  out.push(p(smooth([...flown, ...ahead.slice(1)]), 'fiber-glow', `id="${whole}"`));
  out.push(p(smooth(flown), 'signal'));
  out.push(p(smooth(ahead), 'hidden'));
  const now = flown[flown.length - 1];
  out.push(`<g class="static-only">${droneAt(now[0], now[1])}</g>`);
  out.push(droneOn(whole, 11));

  out.push(L(ctx, 150, 76, 'Wind', 'middle'));
  out.push(L(ctx, 450, 76, 'Rain', 'middle'));
  out.push(L(ctx, 690, 76, 'Night', 'middle'));
  out.push(L(ctx, 1050, 76, 'City', 'middle'));
  out.push(L(ctx, 210, 420, 'Flown path', 'middle'));
  out.push(L(ctx, 1000, 200, 'Predicted path', 'middle'));
  return out.join('');
}

/* ------------------------------------------------------------------ */
/* Drako: training drones on a range, beside its simulated twin         */
/* ------------------------------------------------------------------ */

function coursePts(x: number, y: number, w: number, h: number, steps = 48): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    pts.push([x + w * (0.5 + 0.38 * Math.sin(a)), y + h * (0.5 + 0.3 * Math.sin(2 * a))]);
  }
  return pts;
}

function drako(ctx: Ctx): string {
  const G = 500;
  const out: string[] = [];
  out.push(p(lattice(12, 1192, G + 18, 594, 18, 15), 'dots soft'));

  // The simulated twin: a grid with the same course
  const twin = { x: 40, y: 70, w: 470, h: 360 };
  let grid = '';
  for (let x = twin.x; x <= twin.x + twin.w; x += 47) grid += `M${x} ${twin.y}V${twin.y + twin.h}`;
  for (let y = twin.y; y <= twin.y + twin.h; y += 45) grid += `M${twin.x} ${y}H${twin.x + twin.w}`;
  out.push(p(grid, 'grid'));
  out.push(`<rect class="plate-edge" x="${twin.x}" y="${twin.y}" width="${twin.w}" height="${twin.h}" rx="18"/>`);
  const twinCourse = coursePts(twin.x, twin.y, twin.w, twin.h);
  out.push(p(smooth(twinCourse, true), 'route'));
  [0.05, 0.3, 0.55, 0.8].forEach((u) => {
    const [x, y] = twinCourse[Math.floor(u * twinCourse.length)];
    out.push(droneAt(x, y, 0.8, 'ghost'));
  });

  // The live range: limits, the course, and the drones flying it
  const range = { x: 600, y: 70, w: 560, h: 360 };
  out.push(p(`M${range.x} ${range.y}h${range.w}v${range.h}h${-range.w}Z`, 'zone-edge'));
  const course = coursePts(range.x, range.y, range.w, range.h);
  const courseId = `${ctx.uid}-course`;
  out.push(p(smooth(course, true), 'signal dim flow', `id="${courseId}"`));
  out.push(
    `<g class="static-only">${[0.05, 0.3, 0.55, 0.8]
      .map((u) => {
        const [x, y] = course[Math.floor(u * course.length)];
        return droneAt(x, y, 0.9);
      })
      .join('')}</g>`,
  );
  [0, 2.25, 4.5, 6.75].forEach((delay) => out.push(droneOn(courseId, 9, delay, 0.9)));

  // Twin and range stay in step
  out.push(p(`M${twin.x + twin.w + 8} 250H${range.x - 8}`, 'connector'));

  // Range control on the ground, tied to the range
  out.push(p(`M0 ${G}H1200`, 'ground'));
  out.push(`<rect class="station-box" x="852" y="${G - 30}" width="56" height="30" rx="3"/>`);
  out.push(p(`M880 ${G - 30}V${range.y + range.h + 4}`, 'connector'));

  out.push(L(ctx, twin.x + 18, twin.y - 18, 'Simulated twin'));
  out.push(L(ctx, range.x + 18, range.y - 18, 'Training range'));
  out.push(L(ctx, range.x + range.w - 18, range.y + range.h - 18, 'Range limits', 'end'));
  out.push(L(ctx, 930, G - 10, 'Range control'));
  return out.join('');
}

/* ------------------------------------------------------------------ */
/* Shows                                                              */
/* ------------------------------------------------------------------ */

function starOutline(cx: number, cy: number, R: number, count: number): Pt[] {
  const corners: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? R * 0.42 : R;
    corners.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const lens = corners.map((c, i) => Math.hypot(corners[(i + 1) % 10][0] - c[0], corners[(i + 1) % 10][1] - c[1]));
  const total = lens.reduce((a, b) => a + b, 0);
  const pts: Pt[] = [];
  for (let k = 0; k < count; k++) {
    let d = (k / count) * total;
    let i = 0;
    while (d > lens[i]) d -= lens[i++];
    const a = corners[i];
    const b = corners[(i + 1) % 10];
    const t = d / lens[i];
    pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return pts;
}

function shows(ctx: Ctx): string {
  const G = 512;
  const out: string[] = [];
  out.push(p(lattice(12, 1192, G + 18, 594, 18, 15), 'dots soft'));

  // A few stars in the night sky, for depth
  const rand = seeded(7);
  let sky = '';
  for (let k = 0; k < 40; k++) sky += `M${f(rand() * 1200)} ${f(30 + rand() * 300)}h0`;
  out.push(p(sky, 'dots soft'));

  // Launch grid on the ground
  let pad = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 16; c++) pad += `M${f(420 + c * 24)} ${f(G - 6 - r * 10)}h0`;
  out.push(p(pad, 'dots'));
  out.push(p(`M0 ${G}H1200`, 'ground'));

  // Flight paths rising to the formation
  const star = starOutline(600, 236, 176, 70);
  const lifts = [6, 19, 33, 47, 60];
  lifts.forEach((k, i) => {
    const [x, y] = star[k];
    const sx = 432 + i * 80;
    out.push(p(`M${sx} ${G - 26}Q${f((sx + x) / 2)} ${f(y + 160)} ${f(x)} ${f(y)}`, 'beam'));
  });
  const riseId = `${ctx.uid}-rise`;
  out.push(`<path id="${riseId}" d="M512 ${G - 26}Q${f((512 + star[19][0]) / 2)} ${f(star[19][1] + 160)} ${f(star[19][0])} ${f(star[19][1])}" fill="none" stroke="none"/>`);

  // The formation: each drone a light on its mark
  out.push(
    `<g>${star.map(([x, y]) => `<circle class="reading" cx="${f(x)}" cy="${f(y)}" r="4"/>`).join('')}</g>`,
  );
  out.push(`<circle class="ping" cx="${f(star[0][0])}" cy="${f(star[0][1])}" r="14"/>`);
  out.push(droneOn(riseId, 5.5, 0, 0.7));

  out.push(leader([[star[0][0] + 14, star[0][1]], [740, star[0][1]]]));
  out.push(L(ctx, 750, star[0][1] + 6, 'Each drone on its mark'));
  out.push(L(ctx, 600, G + 44, 'Launch grid', 'middle'));
  out.push(L(ctx, 250, 420, 'Flight paths', 'middle'));
  return out.join('');
}

/* ------------------------------------------------------------------ */
/* Specialized models                                                 */
/* ------------------------------------------------------------------ */

function models(ctx: Ctx): string {
  const out: string[] = [];
  out.push(p(lattice(12, 1192, 540, 594, 18, 15), 'dots soft'));
  out.push(p('M0 520H1200', 'axis'));

  const base: Pt = [600, 130];
  const specs: { x: number; name: string }[] = [
    { x: 210, name: 'Delivery' },
    { x: 470, name: 'Drako' },
    { x: 730, name: 'Shows' },
    { x: 990, name: 'Test' },
  ];
  const y = 400;

  specs.forEach((s, i) => {
    const down = `${ctx.uid}-down-${i}`;
    const up = `${ctx.uid}-up-${i}`;
    const c: Pt = [s.x, base[1] + 120];
    out.push(p(`M${base[0]} ${base[1] + 34}Q${c[0]} ${c[1]} ${s.x} ${y - 24}`, 'signal flow', `id="${down}"`));
    out.push(p(`M${s.x + 18} ${y - 20}Q${c[0] + 60} ${c[1] + 30} ${base[0] + 20} ${base[1] + 32}`, 'route', `id="${up}"`));
    out.push(`<circle class="photon moving" r="4.5"><animateMotion begin="indefinite" data-delay="${-(i * 0.6)}" dur="3.6s" repeatCount="indefinite"><mpath href="#${down}"/></animateMotion></circle>`);
    out.push(`<circle class="station moving" r="3.5"><animateMotion begin="indefinite" data-delay="${-(1.8 + i * 0.6)}" dur="4.4s" repeatCount="indefinite"><mpath href="#${up}"/></animateMotion></circle>`);
    out.push(`<circle class="node" cx="${s.x}" cy="${y}" r="24"/>`);
    out.push(`<g transform="translate(${s.x} ${y})">${droneGlyph(0.62)}</g>`);
    out.push(L(ctx, s.x, y + 58, s.name, 'middle'));
  });

  out.push(`<circle class="node" cx="${base[0]}" cy="${base[1]}" r="36"/>`);
  out.push(`<circle class="node-chip" cx="${base[0]}" cy="${base[1]}" r="14"/>`);
  out.push(pings(base[0], base[1], 22));
  out.push(L(ctx, base[0] + 56, base[1] + 6, 'Base model'));
  out.push(L(ctx, 1080, 250, 'Flight data back', 'middle'));
  return out.join('');
}

/* ------------------------------------------------------------------ */
/* Why now: hardware cost falls, software value rises                  */
/* ------------------------------------------------------------------ */

function america(ctx: Ctx): string {
  const out: string[] = [];
  const x0 = 110;
  const x1 = 1120;
  const yTop = 70;
  const yBase = 470;
  out.push(p(lattice(12, 1192, yBase + 30, 594, 18, 15), 'dots soft'));
  out.push(p(`M${x0} ${yTop}V${yBase}H${x1}`, 'axis'));
  for (let k = 1; k < 4; k++) out.push(p(`M${x0} ${yBase - k * 100}H${x1}`, 'axis-soft'));

  const span = x1 - x0;
  const hardware: Pt[] = sample(x0, x1, 20, (x) => {
    const u = (x - x0) / span;
    return yBase - 18 - (yBase - yTop - 40) * Math.exp(-3.1 * u);
  });
  const software: Pt[] = sample(x0, x1, 20, (x) => {
    const u = (x - x0) / span;
    return yBase - 24 - (yBase - yTop - 60) / (1 + Math.exp(-9 * (u - 0.5)));
  });
  out.push(p(smooth(hardware), 'drift'));
  out.push(p(smooth(software), 'fiber-glow'));
  out.push(p(smooth(software), 'signal flow'));

  // Where the lines cross
  let cross = software[0];
  for (let i = 1; i < software.length; i++) {
    if (software[i][1] < hardware[i][1]) {
      cross = software[i];
      break;
    }
  }
  out.push(`<path class="node-chip" d="M${f(cross[0])} ${f(cross[1] - 9)}l9 9-9 9-9-9Z"/>`);
  out.push(pings(cross[0], cross[1], 14));

  out.push(L(ctx, x0 + 24, hardware[1][1] - 18, 'Hardware cost'));
  out.push(L(ctx, x1 - 8, hardware[hardware.length - 1][1] - 16, 'Toward zero', 'end'));
  out.push(L(ctx, x1 - 8, software[software.length - 1][1] - 18, 'Software value', 'end'));
  out.push(L(ctx, cross[0] + 26, cross[1] + 78, 'Where we compete'));
  out.push(L(ctx, x1, yBase + 34, 'Time', 'end'));
  return out.join('');
}

const scenes: Record<SceneName, (ctx: Ctx) => string> = {
  delivery,
  wam,
  drako,
  shows,
  models,
  america,
};

let counter = 0;

/** Draw a scene. Each call gets its own ids, so a page can show a scene twice. */
export function drawScene(name: SceneName): Scene {
  const ctx: Ctx = { uid: `${name}-${++counter}`, labels: [] };
  const body = scenes[name](ctx);
  return { body, labels: ctx.labels };
}
