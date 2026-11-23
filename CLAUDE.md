# BoxBox Drone website

Marketing site for BoxBox Drone (BBD): AI models for drones, on hardware that costs next to nothing. Static Astro build deployed on Vercel from `main`, live at www.boxboxdrone.com. The design system is borrowed from the Katmai Computing site on purpose.

## Commands

- `npm run dev` starts the dev server on port 4321.
- `npm run build` builds to `dist/`. It fails on content type errors, so run it after touching `src/content`.
- `npm test` builds, serves `dist/` with the same headers as Vercel and runs the Playwright tests (desktop and phone).
- `node scripts/make-assets.mjs` regenerates favicons, app icons, logo files and the OG image from the BBD mark. Keep its copy of the mark in step with `src/lib/mark.ts`.
- With the build served (`node scripts/serve-dist.mjs 4321`), `node scripts/shoot.mjs 390 844 2 /tmp/shots/phone no mobile` captures every home scene, and `node scripts/shoot-pages.mjs /tmp/pages` captures every page and menu on desktop and phone. Look at them before shipping visual changes.

## Where things live

- Page copy: `src/content/home.ts` (home), `src/content/topics/missions.ts` (delivery, Drako, shows), `src/content/topics/technology.ts` (world action model, hardware), `src/content/topics/america.ts` (why America), `src/content/pages.ts` (company, contact), `src/content/nav.ts` (menus). Change words there, not in components.
- Stats, charts, points and milestones on topic pages cite sources from `src/content/topics/sources.ts`, by ID. Add the source before the number.
- Site settings (URL, title, email, contact link): `src/config/site.ts`.
- Design tokens: `src/styles/tokens.css`. Use the tokens; do not add new colors inline.
- The home sky (`src/scripts/sky.ts`): one canvas of drones that plays each scene (swarm, delivery, weather, Drako, shows, fleet). Topic pages reuse it as a band (`SkyBand.astro`). The planner demo is `src/scripts/planner.ts`. Drawn scenes for topic pages are SVG built in `src/lib/scenes.ts`.

## Design rules

- Palette: true black `#000000` everywhere. Ash `#E8E6E1` text, Pumice `#8B8F98` secondary text, light Amethyst `#C4B5FF` for text links, Amber `#F2B66B` for labels, wayfinding and parcels, Glacier `#6EE7F9` for drones in flight and the model's signal only.
- Iridescence is a rare accent and comes from tokens in `tokens.css`, never inline colors. It appears in two places only: primary buttons (the light `--iris` fill with `--iris-ink` text) and the home cost line (`--opal-line`). Cards, panels and section dividers use plain `--hairline` borders. Keep gradients static. Don't add `backdrop-filter` to large areas.
- Buttons are one family (`Button.astro`, global `.button` rules): 10px corners (`--radius-button`), Geist 600, 52px regular and 40px compact (44px on phones). Primary is the iris fill; secondary is transparent with a `--button-outline` border. Use one primary per screen, plus the nav Talk to us. Containers use 18px corners, circles 50%, nothing else.
- `.hero-art` in the home hero's lit layer holds the still drone sky (`SkyArt.astro`): decorative and aria-hidden.
- On narrow screens the scene copy sits at the top, so sky scenes play in the lower part of the sky and floor labels stay clear of the Pause motion button. Check phone shots after changing `sky.ts`.
- Every text and control pair passes WCAG AA: 4.5:1 for text, 3:1 for large text, controls and graphics. Check new pairs before adding them.
- Type: Instrument Serif for display, Geist for text, Geist Mono for measurements. Body text is `--t-body` (17px phones, 18px from 768px). `--t-small` is for metadata only. Nothing visible goes under 14px (`--t-micro`), canvas and SVG labels included. Space in 8px steps.
- Motion respects `prefers-reduced-motion` and the on-page pause control. Animated layouts are gated by the `motion-ok` class set before first paint; every scene has a still frame.

## Security rules

- No third-party scripts, styles, fonts or frames. Everything loads from this site; the Content-Security-Policy in `vercel.json` blocks anything else.
- No new inline scripts, `on*=` handlers or `javascript:` links. Put scripts in a `<script>` that Astro bundles. If an `is:inline` script must change, run `npm run build && node scripts/csp-hashes.mjs` and paste its `script-src` into `vercel.json`; `npm test` fails until they match.
- Redirects in `vercel.json` stay on this site.
- Check a live deployment with `scripts/check-security-headers.sh https://www.boxboxdrone.com`.

## Copy rules

- No em dashes or en dashes, no arrows on links, no all-caps labels.
- Capability-level claims only. Every claim about BBD's own products, plans or status is marked `// sign-off` in the content files and needs Spencer's sign-off. Do not remove a marker without that sign-off.
- Drako drones are unarmed training targets. Never describe BBD as building armed drones or weapons.
- Plain verbs, sentence case, name things by what users understand.
