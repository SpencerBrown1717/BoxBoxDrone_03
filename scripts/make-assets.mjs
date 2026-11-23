// Renders the favicons, app icons, logo files and the share image from the BBD mark.
// Run: node scripts/make-assets.mjs (needs Google Chrome installed). Add --og-only to render just the share image.
import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => path.join(root, 'public', p);
const font = (p) => 'file://' + path.join(root, 'node_modules', p);

// The BBD mark, as in src/lib/mark.ts: a quadcopter seen from above carrying a box (72 x 72)
function markPaths() {
  const f = (n) => String(Math.round(n * 100) / 100);
  const C = 36, ROTOR = 22.5, R = 12.5, r = 7.5, BOX = 11, ARM = 2.5;
  const ring = (cx, cy) => {
    const circle = (rad) => `M${f(cx - rad)} ${f(cy)}a${rad} ${rad} 0 1 0 ${2 * rad} 0a${rad} ${rad} 0 1 0 ${-2 * rad} 0Z`;
    return circle(R) + circle(r);
  };
  const arm = (sx, sy) => {
    const ux = sx / Math.SQRT2, uy = sy / Math.SQRT2;
    const ax = C + sx * ROTOR - ux * 10, ay = C + sy * ROTOR - uy * 10;
    const bx = C + sx * (BOX - 1), by = C + sy * (BOX - 1);
    const px = -uy * ARM, py = ux * ARM;
    return `M${f(ax + px)} ${f(ay + py)}L${f(bx + px)} ${f(by + py)}L${f(bx - px)} ${f(by - py)}L${f(ax - px)} ${f(ay - py)}Z`;
  };
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  return [
    ...corners.map(([sx, sy]) => ring(C + sx * ROTOR, C + sy * ROTOR)),
    ...corners.map(([sx, sy]) => arm(sx, sy)),
    `M${C - BOX} ${C - BOX}h${2 * BOX}v${2 * BOX}h${-2 * BOX}Z`,
  ];
}
const PATHS = markPaths();
const mark = (fill = '#ffffff', style = 'display:block;width:100%;height:auto') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" style="${style}">${PATHS.map((d) => `<path fill="${fill}" fill-rule="evenodd" d="${d}"/>`).join('')}</svg>`;

// Plain SVG files
mkdirSync(pub('logo'), { recursive: true });
writeFileSync(pub('logo/bbd-mark-white.svg'), mark('#ffffff', '') + '\n');
writeFileSync(
  pub('logo/bbd-mark-on-black.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#000"/><g transform="translate(12 12)">${PATHS.map((d) => `<path fill="#fff" fill-rule="evenodd" d="${d}"/>`).join('')}</g></svg>\n`,
);
writeFileSync(
  pub('favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="20" fill="#000"/><g transform="translate(10 10) scale(1.06)">${PATHS.map((d) => `<path fill="#fff" fill-rule="evenodd" d="${d}"/>`).join('')}</g></svg>\n`,
);

const icon = (size, { radius = 0, markWidth = 0.64 } = {}) => `<!doctype html><html><body style="margin:0;background:transparent">
  <div style="width:${size}px;height:${size}px;background:#000;border-radius:${radius}px;display:grid;place-items:center">
    <div style="width:${Math.round(size * markWidth)}px;line-height:0">${mark('#ffffff')}</div>
  </div></body></html>`;

// A plane of drones in perspective, like the home page sky (1200 x 260 strip, horizon at the bottom)
function plane() {
  let s = 11 >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let d = '';
  for (let i = 0; i < 520; i++) {
    const z = 1 + 9 * ((i + rand() * 0.9) / 520);
    const x = 600 + ((rand() * 2 - 1) * 9.8 * 1200 * 0.56) / z;
    const y = 260 - (260 * 0.97) / z;
    if (x < 2 || x > 1198 || z < 1.3) continue;
    d += `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
  }
  return `<svg viewBox="0 0 1200 260" style="display:block;width:1200px;height:260px"><path d="${d}" stroke="#6ee7f9" stroke-opacity="0.45" stroke-width="2.2" stroke-linecap="square" fill="none"/></svg>`;
}

const og = `<!doctype html><html><head><style>
  @font-face { font-family: 'Instrument Serif'; src: url('${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2')}') format('woff2'); }
  @font-face { font-family: 'Geist'; src: url('${font('@fontsource-variable/geist/files/geist-latin-wght-normal.woff2')}') format('woff2'); font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; color: #e8e6e1;
    background:
      radial-gradient(42% 52% at 22% 38%, rgb(111 82 255 / 0.18), transparent 70%),
      radial-gradient(30% 40% at 40% 56%, rgb(143 227 255 / 0.07), transparent 70%),
      radial-gradient(26% 34% at 8% 62%, rgb(255 201 143 / 0.06), transparent 72%),
      #000000; font-family: Geist; position: relative; overflow: hidden; }
  .brand { position: absolute; left: 72px; top: 60px; display: flex; align-items: center; gap: 16px; font-size: 26px; font-weight: 500; color: #fff; }
  .brand div { width: 40px; line-height: 0; }
  h1 { position: absolute; left: 68px; top: 150px; font-family: 'Instrument Serif'; font-weight: 400; font-size: 132px; line-height: 0.95; letter-spacing: -0.01em; }
  p { position: absolute; left: 72px; top: 300px; width: 860px; font-size: 28px; line-height: 1.45; color: rgb(232 230 225 / 0.74); }
  .plane { position: absolute; left: 0; top: 290px; mask-image: linear-gradient(to top, black 30%, transparent 95%); }
  .glow { position: absolute; left: 0; right: 0; top: 440px; height: 220px; background: radial-gradient(26% 40% at 24% 50%, rgb(143 227 255 / 0.1), transparent 70%), radial-gradient(26% 40% at 76% 50%, rgb(255 201 143 / 0.09), transparent 70%), radial-gradient(56% 46% at 50% 50%, rgb(111 82 255 / 0.3), rgb(111 82 255 / 0.08) 52%, transparent 74%); }
  .bar { position: absolute; left: 0; right: 0; top: 550px; height: 3px; background: linear-gradient(90deg, rgb(123 97 255 / 0) 0%, #7b61ff 6%, #5b8cff 17%, #5fe3ff 30%, #a3f7d6 40%, #fffaf0 50%, #ffe08a 60%, #ffb36b 71%, #ff7aa8 83%, #b46cff 94%, rgb(180 108 255 / 0) 100%); box-shadow: 0 0 4px rgb(255 255 255 / 0.55), 0 0 14px rgb(185 166 255 / 0.65), 0 0 40px rgb(143 227 255 / 0.25); }
</style></head><body>
  <div class="glow"></div>
  <div class="plane">${plane()}</div>
  <div class="brand"><div>${mark()}</div>BoxBox Drone</div>
  <h1>AI models for drones.</h1>
  <p>Delivery, Drako training targets and drone shows, flown by one world action model. Built in Palo Alto.</p>
  <div class="bar"></div>
</body></html>`;

// Linux CI has Chrome at /usr/bin/google-chrome; elsewhere use the installed Chrome channel
const chrome = existsSync('/usr/bin/google-chrome') ? { executablePath: '/usr/bin/google-chrome' } : { channel: 'chrome' };
const browser = await chromium.launch({ ...chrome, args: ['--no-sandbox'] });
const ogOnly = process.argv.includes('--og-only');

async function render(html, width, height, out, transparent = false) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const file = path.join('/tmp', `asset-${path.basename(out)}.html`);
  writeFileSync(file, html);
  await page.goto('file://' + file);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: out, omitBackground: transparent, clip: { x: 0, y: 0, width, height } });
  await page.close();
}

if (!ogOnly) {
  await render(icon(32, { radius: 7, markWidth: 0.8 }), 32, 32, pub('favicon-32.png'), true);
  await render(icon(180), 180, 180, pub('apple-touch-icon.png'));
  await render(icon(192), 192, 192, pub('icon-192.png'));
  await render(icon(512), 512, 512, pub('icon-512.png'));
  await render(icon(512, { markWidth: 0.48 }), 512, 512, pub('icon-maskable-512.png'));
  await render(icon(512), 512, 512, pub('logo/bbd-mark-512.png'));
}
await render(og, 1200, 630, pub('og.png'));

await browser.close();
console.log('assets written');
