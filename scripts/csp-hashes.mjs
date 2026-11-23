// The Content-Security-Policy in vercel.json allows scripts from 'self' plus the hash of each
// inline script. This finds every inline script in dist/ and its SHA-256, so the policy can be
// checked (tests/security.spec.ts) or updated after an is:inline script changes.
// Usage: npm run build && node scripts/csp-hashes.mjs
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

// Inline scripts that run: no src, and a JavaScript type (or none). JSON-LD and other data blocks never run.
const runnable = (attributes) => {
  if (/\ssrc\s*=/.test(attributes)) return false;
  const type = attributes.match(/\stype\s*=\s*["']?([^"'\s>]+)/i)?.[1]?.toLowerCase();
  return !type || type === 'module' || type === 'text/javascript' || type === 'application/javascript';
};

/**
 * Every inline script in dist/: its hash and the pages it appears on.
 * @returns {{ hash: string, pages: string[], preview: string }[]}
 */
export function inlineScripts() {
  const found = new Map();
  for (const file of htmlFiles(dist)) {
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
      const [, attributes, body] = match;
      if (!runnable(attributes)) continue;
      const hash = `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`;
      const entry = found.get(hash) ?? { hash, pages: [], preview: body.trim().slice(0, 70) };
      entry.pages.push('/' + relative(dist, file).replace(/(^|\/)index\.html$/, '').replace(/\.html$/, ''));
      found.set(hash, entry);
    }
  }
  return [...found.values()];
}

/**
 * The script-src values in vercel.json's Content-Security-Policy.
 * @returns {string[]}
 */
export function policyScriptSources() {
  const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  const csp = vercel.headers
    .flatMap((rule) => rule.headers)
    .find((header) => header.key.toLowerCase() === 'content-security-policy')?.value;
  if (!csp) return [];
  const directive = csp.split(';').map((part) => part.trim()).find((part) => part.startsWith('script-src '));
  return directive ? directive.split(/\s+/).slice(1) : [];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const scripts = inlineScripts();
  const allowed = new Set(policyScriptSources());
  for (const { hash, pages, preview } of scripts) {
    const status = allowed.has(hash) ? 'ok     ' : 'MISSING';
    console.log(`${status} ${hash}  ${pages.length} page(s), e.g. ${pages[0]}\n        ${preview.replace(/\s+/g, ' ')}`);
  }
  const needed = scripts.map((s) => s.hash);
  console.log(`\nscript-src for vercel.json:\n'self' ${needed.join(' ')}`);
  if (scripts.some(({ hash }) => !allowed.has(hash))) process.exitCode = 1;
}
