// Screenshot the home page through the scroll story.
// Usage: node scripts/shoot.mjs <width> <height> <dpr> <outdir> [reduce] [mobile]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [w = '1440', h = '900', dpr = '1', out = '/tmp/shots/desktop', reduce = '', mobile = ''] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const context = await browser.newContext({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: +dpr,
  reducedMotion: reduce === 'reduce' ? 'reduce' : 'no-preference',
  isMobile: mobile === 'mobile',
  hasTouch: mobile === 'mobile',
});
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const spacer = await page.evaluate(() => {
  const el = document.querySelector('[data-hero-spacer]');
  const r = el.getBoundingClientRect();
  return { top: r.top + scrollY, height: r.height, vh: innerHeight };
});
const atProgress = (p) => spacer.top + p * Math.max(0, spacer.height - spacer.vh);
const atEl = (sel, frac = 0.2) => page.evaluate(([s, f]) => {
  const el = document.querySelector(s);
  const r = el.getBoundingClientRect();
  return r.top + scrollY - innerHeight * 0.5 + f * r.height;
}, [sel, frac]);

const scenes = [
  ['05-sky', await atEl('#sky', 0.3)],
  ['06-model', await atEl('#model', 0.45)],
  ['07-delivery', await atEl('#delivery', 0.2)],
  ['08-weather', await atEl('#delivery', 0.7)],
  ['09-drako', await atEl('#drako', 0.3)],
  ['10-shows', await atEl('#shows', 0.3)],
  ['11-fleet', await atEl('#fleet', 0.3)],
  ['12-gap', await atEl('#gap', 0.4)],
  ['13-roadmap', await atEl('#roadmap', 0.3)],
  ['14-talk', await atEl('#talk', 0.4)],
];
const shots = reduce === 'reduce'
  ? [['00-top', 0], ...scenes]
  : [
      ['00-top', 0],
      ['01-p20', atProgress(0.2)],
      ['02-p38', atProgress(0.38)],
      ['03-p62', atProgress(0.64)],
      ['04-p82', atProgress(0.82)],
      ['04b-p100', atProgress(1)],
      ...scenes,
    ];

for (const [name, y] of shots) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), Math.max(0, Math.round(y)));
  await page.waitForTimeout(name.match(/delivery|weather|drako|shows|fleet|model/) ? 3200 : 900);
  await page.screenshot({ path: `${out}/${name}.png` });
}
console.log(JSON.stringify({ spacer, errors }, null, 1));
await browser.close();
