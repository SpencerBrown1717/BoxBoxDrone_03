# boxboxdrone.com

The website for BoxBox Drone (BBD): AI models for drones, on hardware that costs next to nothing. Built in Palo Alto.

**Status:** live on Vercel at www.boxboxdrone.com (boxboxdrone.com forwards there). The home page story, two menus with six topic pages, the hub pages, company, contact and not-found pages are built. The look and feel are borrowed from the Katmai Computing site on purpose.

| Page | Path |
| --- | --- |
| Home, the scroll story | `/` |
| Missions: last-mile delivery, Drako Drones (unarmed training targets), drone shows | `/missions`, `/delivery`, `/drako`, `/shows` |
| Technology: the world action model, hardware near zero | `/technology`, `/models`, `/hardware` |
| Why America, company, contact | `/why-america`, `/company`, `/contact` |
| For AI assistants | `/llms.txt` |

## Run it

```sh
npm install
npm run dev                 # http://localhost:4321
npm run build && npm run preview
npm test                    # Playwright tests on desktop and phone, using your installed Google Chrome
```

## Edit the words

- Home page copy lives in `src/content/home.ts`, and the menus in `src/content/nav.ts`.
- Topic pages live in `src/content/topics/`, one object per page: the copy, the chart data, the stage the field has reached, and the IDs of its sources. Sources are in `src/content/topics/sources.ts`; stats, charts, points and milestones cite them by ID, and each page numbers them in the order they appear. Add a page by adding an object and listing it in `src/content/topics/index.ts`; the route, menus, hub cards, sitemap and `llms.txt` pick it up.
- Company and contact copy lives in `src/content/pages.ts`. Contact topics open an email to `hello@boxboxdrone.com` with the subject filled in, and other pages link to a topic with `/contact?topic=drako` and so on.
- Site-wide settings (title, description, email, URL) live in `src/config/site.ts`.
- Every claim about BBD's own products, plans and status is marked `// sign-off` in the content files. Confirm them before changing the marker.

## How it's built

- **Astro**, static output, on **Vercel**. Tailwind v4 (theme and preflight only), with the design tokens in `src/styles/tokens.css`.
- **The cost line** (`src/components/Barrier.astro`, `src/scripts/story.ts`): the hero's line drops as you scroll, turning "Drones have been a hardware race." into "AI models for drones.", and lands as the horizon. Native CSS scroll-driven animations through a `ViewTimeline`; browsers without them get the same animations scrubbed from a scroll listener.
- **The sky** (`src/scripts/sky.ts`): one canvas, drawn only while it's on screen. A volume of drones that becomes delivery couriers, rain and gusts, a Drako training lane, a redwood show formation and rows of flight data streaming into the model. Topic pages reuse it as a live band (`src/components/SkyBand.astro`).
- **The planner** (`src/scripts/planner.ts`): an illustration of how a world action model plans. Pick a world, add wind, rain or night, and watch the drone imagine its moves and fly the best one.
- **Reduced motion**: every scene has a finished still frame, and a Pause motion control stops the sky, the bands and the drawn scenes.
- **Topic pages** (`src/layouts/TopicPage.astro`): the need in numbers, why it matters (a chart from `src/components/topic/Chart.astro`), how it works, where the field stands, what BBD is building, and the sources. Scenes are SVG drawings built at build time in `src/lib/scenes.ts`; charts are HTML and SVG with a hover readout and a table of the numbers.
- **Brand assets**: `node scripts/make-assets.mjs` renders the favicons, app icons, logo PNG and share image from the BBD mark, a quadcopter seen from above carrying a box. The SVG marks are in `public/logo/`.
- **Menus**: one navigation tree. Wide screens get full-width mega menus built on the Popover API, with hover preview; narrow screens get a drawer where each tab opens in place.
- **Screenshots**: with the build served, `node scripts/shoot.mjs 390 844 2 /tmp/shots no mobile` captures every home page scene at a phone size, and `node scripts/shoot-pages.mjs /tmp/pages` captures every page in the sitemap and the menus on desktop and phone.

## How changes ship

Vercel builds every push to `main` and serves it at www.boxboxdrone.com. Pull requests get a preview link to review first.

### Security headers

`vercel.json` sends a strict Content-Security-Policy, HSTS (two years, with subdomains and preload), `X-Frame-Options: DENY`, `nosniff`, a strict Referrer-Policy, `Cross-Origin-Opener-Policy` and a Permissions-Policy that turns off camera, microphone, location, USB, serial and other device access. The site loads nothing from other origins.

Scripts may come only from this site (`'self'`) or match a hash in `script-src`. Astro is set never to inline its bundled scripts (`vite.build.assetsInlineLimit: 0`), so the only inline script is the motion check in `Base.astro`. If you change it, or add one, run `npm run build && node scripts/csp-hashes.mjs` and paste the `script-src` it prints into `vercel.json`. `npm test` fails until you do, because `scripts/serve-dist.mjs` serves the same headers as Vercel and `tests/security.spec.ts` checks them.

To check a deployment, run `scripts/check-security-headers.sh https://www.boxboxdrone.com`, or pass a preview URL with `VERCEL_AUTOMATION_BYPASS_SECRET` set.
