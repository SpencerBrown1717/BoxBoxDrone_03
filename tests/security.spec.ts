import { test, expect } from '@playwright/test';
import { inlineScripts, policyScriptSources } from '../scripts/csp-hashes.mjs';

/**
 * Site safety: the security headers from vercel.json (served locally by scripts/serve-dist.mjs),
 * a script policy with no 'unsafe-inline', and nothing loaded from other origins.
 * scripts/check-security-headers.sh checks the same headers on a live deployment.
 */

test('every response carries the security headers', async ({ request }) => {
  for (const path of ['/', '/delivery', '/drako', '/contact', '/not-a-page', '/favicon.svg']) {
    const headers = (await request.get(path)).headers();
    expect(headers['strict-transport-security'], path).toBe('max-age=63072000; includeSubDomains; preload');
    expect(headers['x-content-type-options'], path).toBe('nosniff');
    expect(headers['x-frame-options'], path).toBe('DENY');
    expect(headers['referrer-policy'], path).toBe('strict-origin-when-cross-origin');
    expect(headers['cross-origin-opener-policy'], path).toBe('same-origin');
    for (const feature of ['camera', 'microphone', 'geolocation', 'payment', 'usb', 'serial', 'hid']) {
      expect(headers['permissions-policy'], path).toContain(`${feature}=()`);
    }
    const csp = headers['content-security-policy'] ?? '';
    for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'none'", "form-action 'self'", "frame-ancestors 'none'"]) {
      expect(csp, path).toContain(directive);
    }
  }
});

test('scripts run only from this site or by exact hash', () => {
  const sources = policyScriptSources();
  expect(sources).toContain("'self'");
  for (const source of sources) {
    expect(source === "'self'" || /^'sha256-[A-Za-z0-9+/]+={0,2}'$/.test(source), `unexpected script-src ${source}`).toBe(true);
  }
  // Every inline script in the build is listed, and nothing else is. After changing an is:inline
  // script, run `node scripts/csp-hashes.mjs` and paste its script-src into vercel.json.
  const listed = sources.filter((source) => source.startsWith("'sha256-")).sort();
  expect(listed).toEqual(inlineScripts().map((script) => script.hash).sort());
});

test('pages load nothing from other origins and break no policy', async ({ page, baseURL }) => {
  const origin = new URL(baseURL ?? 'http://localhost').origin;
  const outside: string[] = [];
  page.on('request', (r) => {
    const url = new URL(r.url());
    if (url.protocol !== 'data:' && url.origin !== origin) outside.push(r.url());
  });
  await page.addInitScript(() => {
    const seen: string[] = [];
    Object.defineProperty(window, '__violations', { value: seen });
    document.addEventListener('securitypolicyviolation', (e) => seen.push(`${e.effectiveDirective} ${e.blockedURI}`));
  });
  for (const path of ['/', '/delivery', '/wam', '/drako', '/shows', '/models', '/why-now', '/company', '/contact']) {
    await page.goto(path);
    await page.evaluate(async () => {
      for (let y = 0; y <= document.documentElement.scrollHeight; y += innerHeight) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 30));
      }
    });
    expect(await page.evaluate(() => (window as unknown as { __violations: string[] }).__violations), path).toEqual([]);
  }
  expect(outside).toEqual([]);
});
