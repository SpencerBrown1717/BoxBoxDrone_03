// Renders the favicons, app icons, logo PNG and the share image from the BBD drone mark.
// Run: node scripts/make-assets.mjs (needs Google Chrome installed). Add --og-only to render just the share image.
import { chromium } from '@playwright/test';
import { existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => path.join(root, 'public', p);
const font = (p) => 'file://' + path.join(root, 'node_modules', p);

// The BBD mark, a drone seen from above (viewBox 72 x 72). The same paths as src/components/Logo.astro.
const RINGS = 'M3 14a11 11 0 1 0 22 0a11 11 0 1 0 -22 0ZM7.5 14a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0ZM47 14a11 11 0 1 0 22 0a11 11 0 1 0 -22 0ZM51.5 14a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0ZM3 58a11 11 0 1 0 22 0a11 11 0 1 0 -22 0ZM7.5 58a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0ZM47 58a11 11 0 1 0 22 0a11 11 0 1 0 -22 0ZM51.5 58a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0Z';
const SOLID = 'M29 25H43A4 4 0 0 1 47 29V43A4 4 0 0 1 43 47H29A4 4 0 0 1 25 43V29A4 4 0 0 1 29 25ZM18.3 21.7 21.7 18.3 28.7 25.3 25.3 28.7ZM53.7 21.7 50.3 18.3 43.3 25.3 46.7 28.7ZM18.3 50.3 21.7 53.7 28.7 46.7 25.3 43.3ZM53.7 50.3 50.3 53.7 43.3 46.7 46.7 43.3Z';
const mark = (fill = '#ffffff') =>
  `<svg viewBox="0 0 72 72" style="display:block;width:100%;height:auto"><path fill="${fill}" fill-rule="evenodd" d="${RINGS}"/><path fill="${fill}" d="${SOLID}"/></svg>`;

const icon = (size, { radius = 0, markWidth = 0.6 } = {}) => `<!doctype html><html><body style="margin:0;background:transparent">
  <div style="width:${size}px;height:${size}px;background:#000;border-radius:${radius}px;display:grid;place-items:center">
    <div style="width:${Math.round(size * markWidth)}px;line-height:0">${mark('#ffffff')}</div>
  </div></body></html>`;

const og = `<!doctype html><html><head><style>
  @font-face { font-family: 'Instrument Serif'; src: url('${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2')}') format('woff2'); }
  @font-face { font-family: 'Geist'; src: url('${font('@fontsource-variable/geist/files/geist-latin-wght-normal.woff2')}') format('woff2'); font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; color: #e8e6e1;
    background:
      radial-gradient(42% 52% at 22% 42%, rgb(111 82 255 / 0.18), transparent 70%),
      radial-gradient(30% 40% at 40% 60%, rgb(143 227 255 / 0.07), transparent 70%),
      radial-gradient(26% 34% at 8% 66%, rgb(255 201 143 / 0.06), transparent 72%),
      #000000; font-family: Geist; position: relative; overflow: hidden; }
  .brand { position: absolute; left: 72px; top: 64px; display: flex; align-items: center; gap: 18px; font-size: 26px; font-weight: 600; letter-spacing: 0.04em; color: #fff; }
  .brand div { width: 48px; line-height: 0; }
  .brand span { font-weight: 400; letter-spacing: 0; color: rgb(232 230 225 / 0.72); padding-left: 16px; border-left: 1px solid rgb(232 230 225 / 0.25); }
  h1 { position: absolute; left: 68px; top: 168px; font-family: 'Instrument Serif'; font-weight: 400; font-size: 136px; line-height: 0.95; letter-spacing: -0.01em; }
  p { position: absolute; left: 72px; top: 334px; width: 780px; font-size: 29px; line-height: 1.45; color: rgb(232 230 225 / 0.74); }
  .glow { position: absolute; left: 0; right: 0; top: 410px; height: 240px; background: radial-gradient(26% 40% at 24% 50%, rgb(143 227 255 / 0.1), transparent 70%), radial-gradient(26% 40% at 76% 50%, rgb(255 201 143 / 0.09), transparent 70%), radial-gradient(56% 46% at 50% 50%, rgb(111 82 255 / 0.3), rgb(111 82 255 / 0.08) 52%, transparent 74%); }
  .bar { position: absolute; left: 0; right: 0; top: 529px; height: 3px; background: linear-gradient(90deg, rgb(123 97 255 / 0) 0%, #7b61ff 6%, #5b8cff 17%, #5fe3ff 30%, #a3f7d6 40%, #fffaf0 50%, #ffe08a 60%, #ffb36b 71%, #ff7aa8 83%, #b46cff 94%, rgb(180 108 255 / 0) 100%); box-shadow: 0 0 4px rgb(255 255 255 / 0.55), 0 0 14px rgb(185 166 255 / 0.65), 0 0 40px rgb(143 227 255 / 0.25); }
  .dots { position: absolute; left: 0; right: 0; top: 552px; bottom: 0; background-image: radial-gradient(circle, rgb(110 231 249 / 0.35) 1.2px, transparent 1.6px); background-size: 18px 16px; mask-image: linear-gradient(to bottom, black, transparent); }
</style></head><body>
  <div class="brand"><div>${mark()}</div>BBD<span>BoxBox Drone</span></div>
  <h1>AI models for drones.</h1>
  <p>Last-mile delivery, Drako training drones and drone shows, all flown by one world action model. Palo Alto, California.</p>
  <div class="glow"></div><div class="bar"></div><div class="dots"></div>
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
await render(icon(512, { markWidth: 0.5 }), 512, 512, pub('icon-maskable-512.png'));
await render(icon(512), 512, 512, pub('logo/bbd-mark-512.png'));
}
await render(og, 1200, 630, pub('og.png'));

await browser.close();
console.log('assets written');
