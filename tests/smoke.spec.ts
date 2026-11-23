import { test, expect, type Page } from '@playwright/test';
import { hubs, topics } from '../src/content/topics';
import { scenes } from '../src/content/home';
import { contact } from '../src/content/pages';
import { site } from '../src/config/site';

const pages = [
  { path: '/', h1: 'The last mile, flown.' },
  { path: hubs.products.href, h1: hubs.products.title },
  { path: hubs.technology.href, h1: hubs.technology.title },
  ...topics.map((topic) => ({ path: `/${topic.slug}`, h1: topic.hero.title })),
  { path: '/company', h1: 'AI models for drones.' },
  { path: '/contact', h1: 'Talk to us.' },
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

test('the home page tells the whole story without errors', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page).toHaveTitle(site.title);
  for (const scene of scenes) {
    await expect(page.locator(`#${scene.id}`)).toHaveCount(1);
    await expect(page.locator(`.scene-link[href="${scene.link.href}"]`)).toHaveCount(1);
  }
  for (const id of ['why-now', 'roadmap', 'talk']) await expect(page.locator(`#${id}`)).toHaveCount(1);

  // Scroll through every scene, so the line and the field both run
  await page.evaluate(async () => {
    for (let y = 0; y <= document.documentElement.scrollHeight; y += Math.round(innerHeight / 3)) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

for (const { path, h1 } of pages) {
  test(`${path} has one heading, no errors and no sideways scroll`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(h1);
    // Walk the page so anything waiting to scroll into view has run
    await page.evaluate(async () => {
      for (let y = 0; y <= document.documentElement.scrollHeight; y += innerHeight) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 30));
      }
    });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('every topic page shows its picture and cites a source for every number', async ({ page }) => {
  test.slow();
  for (const topic of topics) {
    await page.goto(`/${topic.slug}`);
    const where = `/${topic.slug}`;

    // The hero picture
    expect(await page.locator('.topic-hero svg, .topic-hero canvas').count(), where).toBeGreaterThan(0);

    // Every stat cites a source
    const stats = await page.locator('.stat').count();
    expect(await page.locator('.stat sup.cite').count(), where).toBe(stats);

    // Every superscript points at an entry in the source list, and every entry links out
    const cites = await page.locator('sup.cite a').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    const ids = await page.locator('ol.sources > li').evaluateAll((els) => els.map((el) => `#${el.id}`));
    expect(ids.length, where).toBeGreaterThan(0);
    for (const href of cites) expect(ids, `${where} ${href}`).toContain(href);
    for (const href of await page.locator('ol.sources a').evaluateAll((els) => els.map((el) => el.getAttribute('href')))) {
      expect(href, where).toMatch(/^https:\/\//);
    }

    // Every chart has its numbers in a table too
    const charts = await page.locator('figure.chart').count();
    expect(await page.locator('figure.chart details.chart-data table').count(), where).toBe(charts);
  }
});

test('every internal link leads to a page', async ({ page }) => {
  test.slow();
  const seen = new Set<string>();
  for (const { path } of pages) {
    await page.goto(path);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
    for (const href of hrefs) seen.add(new URL(href, 'http://localhost').pathname);
  }
  for (const path of seen) expect((await page.request.get(path)).status(), path).toBe(200);
});

test('every in-page anchor on the contact page exists', async ({ page }) => {
  await page.goto('/');
  const anchors = new Set<string>();
  for (const { path } of pages) {
    await page.goto(path);
    for (const href of await page.locator('a[href^="/contact#"]').evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''))) {
      anchors.add(href.split('#')[1]);
    }
  }
  expect(anchors.size).toBeGreaterThan(0);
  await page.goto('/contact');
  for (const id of anchors) await expect(page.locator(`#${id}`), id).toHaveCount(1);
});

test('every Talk to us button goes to the contact page', async ({ page }) => {
  for (const path of ['/', '/delivery', '/products']) {
    await page.goto(path);
    const hrefs = await page.locator('a.button', { hasText: /^Talk to us$/ }).evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    expect(hrefs.length, path).toBeGreaterThan(0);
    for (const href of hrefs) expect(href, path).toMatch(/^\/contact(#[a-z-]+)?$/);
  }
});

test('the contact page offers an email for every topic', async ({ page }) => {
  await page.goto('/contact');
  for (const topic of contact.topics) {
    const link = page.locator(`#${topic.id} a[href^="mailto:"]`);
    await expect(link, topic.id).toHaveAttribute('href', `mailto:${site.email}?subject=${encodeURIComponent(topic.subject)}`);
  }
  await expect(page.locator(`a[href="mailto:${site.email}"]`).first()).toBeVisible();
});

test('the menus reach every section', async ({ page, isMobile }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  if (isMobile) await nav.getByRole('button', { name: 'Menu' }).click();

  for (const label of ['Products', 'Technology']) {
    await expect(nav.getByRole('button', { name: label, exact: true })).toBeVisible();
  }
  await expect(nav.getByRole('link', { name: 'Why now', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Company', exact: true })).toBeVisible();

  const products = nav.getByRole('button', { name: 'Products', exact: true });
  await products.click();
  await expect(products).toHaveAttribute('aria-expanded', 'true');
  const all = nav.getByRole('link', { name: 'All products' });
  await expect(all).toBeVisible();
  for (const name of ['Start a delivery pilot', 'Plan a Drako exercise', 'Plan a show']) {
    await expect(nav.getByRole('link', { name, exact: true })).toBeVisible();
  }

  if (!isMobile) {
    // Escape closes the panel
    await page.keyboard.press('Escape');
    await expect(all).toBeHidden();
    await expect(products).toHaveAttribute('aria-expanded', 'false');
    await products.click();
  }

  await nav.getByRole('link', { name: /^Drako/ }).click();
  await expect(page).toHaveURL(/\/drako$/);
  await expect(page.locator('h1')).toHaveText('Drako: drones built for practice.');

  // The menu for the page you're on is marked
  await expect(page.locator('.nav-item.is-current .tab')).toHaveText('Products');
});

test('a menu panel previews on hover', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Hover preview is for pointer devices');
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await nav.getByRole('button', { name: 'Technology', exact: true }).hover();
  await expect(nav.getByRole('link', { name: 'All technology' })).toBeVisible();
  await expect(nav.getByRole('link', { name: /^Specialized models/ })).toBeVisible();
  // Leaving the tab and the panel closes the preview
  await page.mouse.move(720, 890);
  await expect(nav.getByRole('link', { name: 'All technology' })).toBeHidden();
});

test('search and share metadata are in place', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${site.url}/`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${site.url}/og.png`);
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(ld['@graph'].map((node: { '@type': string }) => node['@type'])).toEqual(['Organization', 'WebSite']);
  for (const file of ['/robots.txt', '/sitemap-index.xml', '/llms.txt', '/og.png', '/favicon.svg', '/logo/bbd-mark-512.png']) {
    expect((await page.request.get(file)).status(), file).toBe(200);
  }

  // Inner pages: canonical without a trailing slash, and a breadcrumb trail for search
  await page.goto('/drako');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${site.url}/drako`);
  const crumbs = await page.locator('script[type="application/ld+json"]').evaluateAll((els) =>
    els.map((el) => JSON.parse(el.textContent ?? '{}')).find((node) => node['@type'] === 'BreadcrumbList'),
  );
  expect(crumbs.itemListElement.map((item: { name: string }) => item.name)).toEqual(['Products', 'Drako']);

  const llms = await (await page.request.get('/llms.txt')).text();
  for (const topic of topics) expect(llms, topic.slug).toContain(`${site.url}/${topic.slug})`);
});

test('the old parts hub address lands on the home page', async ({ page }) => {
  const response = await page.request.get('/hub', { maxRedirects: 0 });
  expect([307, 308]).toContain(response.status());
});

test('unknown addresses show the not-found page', async ({ page }) => {
  const response = await page.goto('/nothing-here');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Off the map.');
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('shows the finished frame with nothing hidden', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/motion-ok/);
    await expect(page.locator('[data-layer="then"]')).toBeHidden();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-hero-cta] a')).toBeVisible();
  });

  test('topic scenes hold still, with every moving part shown at rest', async ({ page }) => {
    await page.goto('/delivery');
    const scene = page.locator('[data-scene-figure]').first();
    await expect(scene).not.toHaveClass(/is-animated/);
    const moving = await scene.locator('.moving').evaluateAll((els) => els.map((el) => getComputedStyle(el).visibility));
    expect(moving.length).toBeGreaterThan(0);
    expect(new Set(moving)).toEqual(new Set(['hidden']));
    const still = await scene.locator('.static-only').evaluateAll((els) => els.map((el) => getComputedStyle(el).visibility));
    expect(still.length).toBeGreaterThan(0);
    expect(new Set(still)).toEqual(new Set(['visible']));
  });
});
