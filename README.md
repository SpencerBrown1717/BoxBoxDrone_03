# boxboxdrone.com

The website for BBD (BoxBox Drone): AI models for drones.

**Status:** live on Vercel at www.boxboxdrone.com (the apex redirects there). Built on the same design system and codebase as katmaicomputing.com: true black, Instrument Serif and Geist, an iridescent line, and a live field of drones under it.

## What's on the site

| Section | Pages |
| --- | --- |
| Home: the scroll story | `/` |
| Products: delivery, Drako training drones, drone shows | `/products`, `/delivery`, `/drako`, `/shows` |
| Technology: the world action model and its specialists | `/technology`, `/wam`, `/models` |
| Company | `/why-now`, `/company`, `/contact` |
| For machines | `/llms.txt`, `/sitemap-index.xml`, `/robots.txt` |

## The home page story

1. **The line.** A glowing line sweeps down the screen and rewrites the hero as it passes: "The last mile still runs on vans" becomes "The last mile, flown", and each row of the scale is relabeled.
2. **The field.** The line lands and becomes the ground. Below it, a live canvas (`src/scripts/field.ts`) plays one scene per section as its copy scrolls by: delivery routes from a hub to new homes, one drone crossing wind, rain, night and city with its predicted path ahead, Drako drones flying a range beside its simulated twin, drones lifting into show formations, and one base model feeding four specialists.
3. **Why now.** America is behind in drones, with three sourced numbers, and how BBD plans to win on software.
4. **Roadmap** and **Fly with us.**

With reduced motion, or without JavaScript, every scene is a finished still frame.

## Commands

- `npm run dev`: dev server on port 4321
- `npm run build`: static build to `dist/`
- `npm test`: builds, serves and runs the Playwright smoke and security tests on desktop and phone (uses the installed Google Chrome)
- `node scripts/make-assets.mjs`: favicons, app icons, logo PNG and the share image, from the mark in `src/components/Logo.astro`
- `node scripts/shoot.mjs` and `node scripts/shoot-pages.mjs`: screenshots for review

## Where things live

- Home copy: `src/content/home.ts`
- Product, technology and company pages: `src/content/topics/*.ts`, one record per page, rendered by `src/layouts/TopicPage.astro`
- Sources behind every number: `src/content/topics/sources.ts`
- Company and contact copy: `src/content/pages.ts`
- Menus: `src/content/nav.ts`
- Site settings, including the contact email: `src/config/site.ts`
- Design tokens: `src/styles/tokens.css`

## Deploying

Vercel builds every push. `vercel.json` sets the Astro build and the security headers (a strict Content-Security-Policy with one hashed inline script). Pushes to `main` go to production; other branches get preview URLs. To check a deployment, run `scripts/check-security-headers.sh https://www.boxboxdrone.com`.

The old single-file parts hub is in this repository's history before the redesign.
