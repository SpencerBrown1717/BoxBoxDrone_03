// A small static server for dist/, used by the Playwright tests.
// `astro preview` moves itself to the background when it detects an AI agent,
// which looks like a crash to Playwright, so the tests use this instead.
// Usage: node scripts/serve-dist.mjs [port]
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const port = Number(process.argv[2] ?? 4321);

const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

// Answer the same redirects Vercel does (vercel.json), without following them.
const redirects = new Map(
  vercel.redirects.map((rule) => [rule.source, { location: rule.destination, status: rule.permanent ? 308 : 307 }]),
);

// Send the same response headers Vercel does (vercel.json "headers"), so the tests run under the
// real Content-Security-Policy. Sources use "(.*)" wildcards only; later rules win on the same key.
const headerRules = vercel.headers.map((rule) => ({
  pattern: new RegExp(`^${rule.source.split('(.*)').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.*)')}$`),
  headers: rule.headers,
}));

function headersFor(pathname) {
  const headers = {};
  for (const rule of headerRules) {
    if (rule.pattern.test(pathname)) for (const { key, value } of rule.headers) headers[key] = value;
  }
  return headers;
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

async function file(path) {
  try {
    const info = await stat(path);
    return info.isFile() ? path : null;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  const headers = headersFor(pathname);
  const redirect = redirects.get(pathname);
  if (redirect) {
    res.writeHead(redirect.status, { ...headers, Location: redirect.location });
    res.end();
    return;
  }
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const base = join(root, safe);
  const found = (await file(base)) ?? (await file(join(base, 'index.html'))) ?? (await file(`${base}.html`));
  if (found) {
    res.writeHead(200, { ...headers, 'Content-Type': types[extname(found)] ?? 'application/octet-stream' });
    res.end(await readFile(found));
    return;
  }
  res.writeHead(404, { ...headers, 'Content-Type': types['.html'] });
  res.end(await readFile(join(root, '404.html')));
}).listen(port, () => console.log(`Serving dist on http://localhost:${port}`));
