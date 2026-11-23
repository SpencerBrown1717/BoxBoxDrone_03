import { test, expect, type Page } from '@playwright/test';
import { hubs, topics } from '../src/content/topics';
import { contact } from '../src/content/pages';
import { site } from '../src/config/site';

const pages = [
  { path: '/', h1: 'AI models for drones.' },
  { path: hubs.missions.href, h1: hubs.missions.title },
  { path: hubs.technology.href, h1: hubs.technology.title },
  ...topics.map((topic) => ({ path: `/${topic.slug}`, h1: topic.hero.title })),
  { path: '/company', h1: 'AI models for drones, built in Palo Alto.' },
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

async function walk(page: Page, step = 1) {
  await page.evaluate(async (fraction) => {
    for (let y = 0; y <= document.documentElement.scrollHeight; y += Math.round(innerHeight * fraction)) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 40));
    }
  }, step);
}

test('the home page tells the whole story without errors', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page).toHaveTitle(site.title);
  for (const id of ['sky', 'model', 'delivery', 'drako', 'shows', 'fleet', 'gap', 'roadmap', 'talk']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  for (const href of ['/delivery', '/drako', '/shows', '/models#how-it-works']) {
    await expect(page.locator(`.scene-link[href="${href}"]`)).toHaveCount(1);
  }
  // Scroll through every scene, so the cost line, the sky and the planner all run
  await walk(page, 1 / 3);
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

for (const { path, h1 } of pages) {
  test(`${path} has one heading, no errors and no sideways scroll`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(h1);
    await walk(page);
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

    // The hero picture: a drawn scene or a live sky band
    expect(await page.locator('.topic-hero svg, .topic-hero canvas, [data-sky-band] canvas').count(), where).toBeGreaterThan(0);

    // Every superscript points at an entry in the source list, and every entry links out over https
    const cites = await page.locator('sup.cite a').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    const ids = await page.locator('ol.sources > li').evaluateAll((els) => els.map((el) => `#${el.id}`));
    expect(ids.length, where).toBeGreaterThan(0);
    expect(cites.length, where).toBeGreaterThan(0);
    for (const href of cites) expect(ids, `${where} ${href}`).toContain(href);
    for (const href of await page.locator('ol.sources a').evaluateAll((els) => els.map((el) => el.getAttribute('href')))) {
      expect(href, where).toMatch(/^https:\/\//);
    }

    // Every chart has its numbers in a table too
    const charts = await page.locator('figure.chart').count();
    expect(await page.locator('figure.chart details.chart-data table').count(), where).toBe(charts);
  }
});

test('every internal link leads to a page, and every contact topic exists', async ({ page }) => {
  test.slow();
  const seen = new Set<string>();
  const topicsAsked = new Set<string>();
  for (const { path } of pages) {
    await page.goto(path);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
    for (const href of hrefs) {
      const url = new URL(href, 'http://localhost');
      seen.add(url.pathname);
      if (url.pathname === '/contact' && url.searchParams.has('topic')) topicsAsked.add(url.searchParams.get('topic')!);
      // In-page anchors must land on something
      if (url.hash && url.pathname === new URL(page.url()).pathname) {
        await expect(page.locator(url.hash), `${path} ${href}`).toHaveCount(1);
      }
    }
  }
  for (const path of seen) expect((await page.request.get(path)).status(), path).toBe(200);

  const ids = new Set(contact.topics.map((t) => t.id));
  for (const id of topicsAsked) expect(ids, `contact topic ${id}`).toContain(id);
});

test('anchors from other pages land on their sections', async ({ page }) => {
  for (const href of ['/models#specialists', '/models#plan', '/models#how-it-works']) {
    await page.goto(href);
    await expect(page.locator(new URL(href, 'http://localhost').hash)).toHaveCount(1);
  }
});

test('the planner switches worlds and conditions from the mouse and the keyboard', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  const worlds = page.getByRole('radiogroup', { name: 'Pick a world' });
  await worlds.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-planner]')).toBeVisible();

  await worlds.getByRole('radio', { name: 'Snow' }).click();
  await expect(worlds.getByRole('radio', { name: 'Snow' })).toHaveAttribute('aria-checked', 'true');
  await expect(worlds.getByRole('radio', { name: 'City' })).toHaveAttribute('aria-checked', 'false');

  // Arrow keys move the choice, wrapping at the ends
  await page.keyboard.press('ArrowRight');
  await expect(worlds.getByRole('radio', { name: 'City' })).toHaveAttribute('aria-checked', 'true');
  await expect(worlds.getByRole('radio', { name: 'City' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(worlds.getByRole('radio', { name: 'Snow' })).toHaveAttribute('aria-checked', 'true');

  const rain = page.getByRole('button', { name: 'Rain', exact: true });
  await rain.click();
  await expect(rain).toHaveAttribute('aria-pressed', 'true');
  await rain.click();
  await expect(rain).toHaveAttribute('aria-pressed', 'false');
  expect(errors).toEqual([]);
});

test('a chart reads out values on hover', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Hover is for pointer devices');
  await page.goto('/shows');
  const bar = page.locator('.bar-fill[data-tip]').first();
  await bar.scrollIntoViewIfNeeded();
  await bar.hover();
  const tip = page.locator('.chart-tip').first();
  await expect(tip).toBeVisible();
  expect((await tip.textContent())?.trim().length).toBeGreaterThan(0);
});

test('every Talk to us in the nav goes to the contact page', async ({ page }) => {
  for (const path of ['/', '/drako', '/company']) {
    await page.goto(path);
    for (const href of await page.locator('[data-cta="nav"]').evaluateAll((els) => els.map((el) => el.getAttribute('href')))) {
      expect(href, path).toBe('/contact');
    }
  }
});

test('the menus reach every section', async ({ page, isMobile }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  if (isMobile) await nav.getByRole('button', { name: 'Menu' }).click();

  for (const label of ['Missions', 'Technology']) {
    await expect(nav.getByRole('button', { name: label, exact: true })).toBeVisible();
  }
  await expect(nav.getByRole('link', { name: 'Why America', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Company', exact: true })).toBeVisible();

  const missions = nav.getByRole('button', { name: 'Missions', exact: true });
  await missions.click();
  await expect(missions).toHaveAttribute('aria-expanded', 'true');
  const all = nav.getByRole('link', { name: 'All missions' });
  await expect(all).toBeVisible();
  // Item links carry their description in their name, so match the start
  for (const name of ['Delivery', 'Drako Drones', 'Drone shows', 'Request Drako targets']) {
    await expect(nav.getByRole('link', { name: new RegExp(`^${name}`) })).toBeVisible();
  }

  if (!isMobile) {
    // Escape closes the panel
    await page.keyboard.press('Escape');
    await expect(all).toBeHidden();
    await expect(missions).toHaveAttribute('aria-expanded', 'false');
    await missions.click();
  }

  await nav.getByRole('link', { name: /^Drako Drones/ }).click();
  await expect(page).toHaveURL(/\/drako$/);
  await expect(page.locator('h1')).toHaveText('Built to be shot down.');

  // The menu for the page you're on is marked
  await expect(page.locator('.nav-item.is-current .tab')).toHaveText('Missions');
});

test('a menu panel previews on hover', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Hover preview is for pointer devices');
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await nav.getByRole('button', { name: 'Technology', exact: true }).hover();
  await expect(nav.getByRole('link', { name: 'All technology' })).toBeVisible();
  await expect(nav.getByRole('link', { name: /^World action model/ })).toBeVisible();
  // Leaving the tab and the panel closes the preview
  await page.mouse.move(720, 890);
  await expect(nav.getByRole('link', { name: 'All technology' })).toBeHidden();
});

test('the contact page opens an email for each topic and marks the one asked for', async ({ page }) => {
  await page.goto('/contact?topic=drako');
  await expect(page.locator('#main').getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`);
  const links = page.locator('[data-topic] a');
  expect(await links.count()).toBe(contact.topics.length);
  for (const href of await links.evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''))) {
    expect(href).toMatch(new RegExp(`^mailto:${site.email.replace('.', '\\.')}\\?subject=.+`));
  }
  await expect(page.locator('[data-topic="drako"]')).toHaveClass(/is-picked/);
  await expect(page.locator('[data-topic="drako"] a')).toHaveClass(/button--primary/);
  await expect(page.locator('.button--primary[href^="mailto:"]')).toHaveCount(1);
});

test('search and share metadata are in place', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${site.url}/`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${site.url}/og.png`);
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(ld['@graph'].map((node: { '@type': string }) => node['@type'])).toEqual(['Organization', 'WebSite']);
  for (const file of ['/robots.txt', '/sitemap-index.xml', '/llms.txt', '/og.png', '/favicon.svg', '/site.webmanifest']) {
    expect((await page.request.get(file)).status(), file).toBe(200);
  }

  // Inner pages: canonical without a trailing slash, and a breadcrumb trail for search
  await page.goto('/drako');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${site.url}/drako`);
  const crumbs = await page.locator('script[type="application/ld+json"]').evaluateAll((els) =>
    els.map((el) => JSON.parse(el.textContent ?? '{}')).find((node) => node['@type'] === 'BreadcrumbList'),
  );
  expect(crumbs.itemListElement.map((item: { name: string }) => item.name)).toEqual(['Missions', 'Drako Drones']);

  const llms = await (await page.request.get('/llms.txt')).text();
  for (const topic of topics) expect(llms, topic.slug).toContain(`${site.url}/${topic.slug})`);
});

test('retired addresses redirect to their pages', async ({ request }) => {
  const moved: [string, number, string][] = [
    ['/drako-drones', 308, '/drako'],
    ['/wam', 308, '/models'],
    ['/why-now', 308, '/why-america'],
    ['/products', 308, '/missions'],
    ['/hub', 307, '/'],
    ['/parts', 307, '/'],
  ];
  for (const [path, status, location] of moved) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(status);
    expect(response.headers().location, path).toBe(location);
  }
});

test('unknown addresses show the not-found page', async ({ page }) => {
  const response = await page.goto('/nothing-here');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Lost link.');
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('shows the finished frame with nothing hidden', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/motion-ok/);
    await expect(page.locator('[data-layer="then"]')).toBeHidden();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-hero-cta] a')).toBeVisible();
    // Nothing moves, so there is nothing to pause
    await expect(page.locator('[data-motion-toggle]:visible')).toHaveCount(0);
  });

  test('topic pictures hold still', async ({ page }) => {
    await page.goto('/models');
    const scene = page.locator('[data-scene-figure]').first();
    await expect(scene).toBeVisible();
    await expect(scene).not.toHaveClass(/is-animated/);
    await page.goto('/drako');
    await expect(page.locator('[data-sky-band] canvas')).toBeVisible();
    await expect(page.locator('[data-motion-toggle]:visible')).toHaveCount(0);
  });
});
