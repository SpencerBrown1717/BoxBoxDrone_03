// Screenshot every page plus the menus, on desktop and phone.
// Usage: node scripts/shoot-pages.mjs [outdir] [baseUrl] [path filter regex]
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const [out = '/tmp/pages', base = 'http://localhost:4321'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });

// Every page in the sitemap, plus the not-found page. Pass a filter to shoot only some paths.
const filter = process.argv[4] ? new RegExp(process.argv[4]) : null;
const sitemap = readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .map((path) => [path === '/' ? 'home' : path.slice(1).replaceAll('/', '--'), path])
  .concat([['missing', '/not-a-page']])
  .filter(([, path]) => !filter || filter.test(path));

const devices = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const report = {};

for (const [deviceName, options] of Object.entries(devices)) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${page.url()} ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${page.url()} pageerror: ${e.message}`));

  for (const [name, path] of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    // Walk the page so anything waiting on intersection has run.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    report[`${deviceName}/${name}`] = { height, overflow };
    if (name === 'home') {
      await page.screenshot({ path: `${out}/${deviceName}-${name}.png` });
    } else {
      await page.screenshot({ path: `${out}/${deviceName}-${name}.png`, fullPage: true });
    }
  }

  // Menus.
  await page.goto(base + '/drako', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  if (deviceName === 'desktop') {
    for (const label of ['Missions', 'Technology']) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await page.waitForTimeout(450);
      await page.screenshot({ path: `${out}/${deviceName}-mega-${label.toLowerCase()}.png` });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(250);
    }
  } else {
    await page.getByRole('button', { name: /menu/i }).click();
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${out}/${deviceName}-menu.png` });
    await page.getByRole('button', { name: 'Missions', exact: true }).click();
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${out}/${deviceName}-menu-missions.png`, fullPage: true });
  }

  report[`${deviceName}/errors`] = errors;
  await context.close();
}

console.log(JSON.stringify(report, null, 1));
await browser.close();
