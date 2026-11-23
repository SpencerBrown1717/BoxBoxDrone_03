// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.boxboxdrone.com',
  // One URL per page: links, canonical tags and the sitemap all omit the trailing slash
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Never inline scripts (or other assets) into the HTML. Every bundled script ships as a
      // /_astro/ file, so the Content-Security-Policy in vercel.json can allow scripts from
      // 'self' plus the few hashed is:inline scripts, with no 'unsafe-inline'.
      assetsInlineLimit: 0,
    },
  },
});
