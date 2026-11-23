/**
 * The BBD mark, in a 72 x 72 box: a quadcopter seen from above carrying a box.
 * Rotor rings at the four corners, short diagonal arms, and the box in the middle.
 * Shared by Logo.astro, the favicon and scripts/make-assets.mjs, so they can't drift.
 */
const f = (n: number) => String(Math.round(n * 100) / 100);

const C = 36; // center
const ROTOR = 22.5; // rotor center offset from the middle, along x and y
const R = 12.5; // rotor ring, outer radius
const r = 7.5; // rotor ring, inner radius
const BOX = 11; // half the box's side
const ARM = 2.5; // half the arm's width

function ring(cx: number, cy: number) {
  const circle = (rad: number) => `M${f(cx - rad)} ${f(cy)}a${rad} ${rad} 0 1 0 ${2 * rad} 0a${rad} ${rad} 0 1 0 ${-2 * rad} 0Z`;
  return circle(R) + circle(r);
}

function arm(sx: number, sy: number) {
  // From inside the ring band to just inside the box corner, along the diagonal
  const ux = sx / Math.SQRT2;
  const uy = sy / Math.SQRT2;
  const rx = C + sx * ROTOR;
  const ry = C + sy * ROTOR;
  const ax = rx - ux * 10;
  const ay = ry - uy * 10;
  const bx = C + sx * (BOX - 1);
  const by = C + sy * (BOX - 1);
  const px = -uy * ARM;
  const py = ux * ARM;
  return `M${f(ax + px)} ${f(ay + py)}L${f(bx + px)} ${f(by + py)}L${f(bx - px)} ${f(by - py)}L${f(ax - px)} ${f(ay - py)}Z`;
}

const corners: [number, number][] = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];

export const markPaths: string[] = [
  ...corners.map(([sx, sy]) => ring(C + sx * ROTOR, C + sy * ROTOR)),
  ...corners.map(([sx, sy]) => arm(sx, sy)),
  `M${C - BOX} ${C - BOX}h${2 * BOX}v${2 * BOX}h${-2 * BOX}Z`,
];

/** The whole mark as one SVG string, for raster assets and the favicon. */
export function markSvg(fill = '#ffffff') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">${markPaths
    .map((d) => `<path fill="${fill}" fill-rule="evenodd" d="${d}"/>`)
    .join('')}</svg>`;
}
