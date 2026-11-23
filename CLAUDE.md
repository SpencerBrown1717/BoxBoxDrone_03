# BBD website

Marketing site for BBD (BoxBox Drone): AI models for drones. Static Astro build deployed on Vercel. Pushes to `main` deploy to production at www.boxboxdrone.com. It shares its design system and much of its code with katmaicomputing.com.

## Commands

- `npm run dev` starts the dev server on port 4321.
- `npm run build` builds to `dist/`.
- `npm test` builds, serves and runs the Playwright smoke and security tests (desktop and phone).
- `node scripts/make-assets.mjs` regenerates favicons, app icons and the OG image from the logo paths.

## Where things live

- Page copy: `src/content/home.ts` (home), `src/content/topics/*.ts` (product, technology and company pages, with their chart data and sources), `src/content/pages.ts` (company, contact), `src/content/nav.ts` (menus). Change words there, not in components.
- Stats, charts, points and milestones on topic pages cite sources from `src/content/topics/sources.ts`, by ID. Add the source before the number, and open it to check the number first.
- Site settings (URL, contact email): `src/config/site.ts`.
- Design tokens: `src/styles/tokens.css`. Use the tokens; do not add new colors inline.
- The live field on the home page: `src/scripts/field.ts`, choreographed by `src/scripts/story.ts`. The drawn scenes on topic pages and cards: `src/lib/scenes.ts`.

## Design rules

- True black `#000000` everywhere, with glass surfaces adding only a faint sheen (`--glass`). Ash `#E8E6E1` text, Pumice `#8B8F98` secondary text, light Amethyst `#C4B5FF` for text links, Amber `#F2B66B` for labels, wayfinding and range limits, Glacier `#6EE7F9` for drones, flight paths and the model's signal.
- Iridescence is a rare accent and comes from tokens, never inline colors: primary buttons (the `--iris` fill with `--iris-ink` text), the home hero line (`--opal-line`) and the hero's route artwork. Cards, panels and dividers use plain `--hairline` borders.
- Buttons are one family (`Button.astro`): 10px corners, Geist 600, 52px regular and 40px compact (44px on phones). One primary per screen, plus the nav "Talk to us". Containers use 18px corners.
- Every text and control pair passes WCAG AA. Type: Instrument Serif for display, Geist for text, Geist Mono for measurements. Nothing visible under 14px.
- Motion respects `prefers-reduced-motion` and the on-page pause control. Animated layouts are gated by the `motion-ok` class set before first paint. Looping hero motion stops on its own.

## Security rules

- No third-party scripts, styles, fonts or frames. The Content-Security-Policy in `vercel.json` blocks anything else.
- No new inline scripts, `on*=` handlers or `javascript:` links. If an `is:inline` script must change, run `npm run build && node scripts/csp-hashes.mjs` and paste its `script-src` into `vercel.json`.

## Copy rules

- No em dashes or en dashes, no arrows on links, no all-caps labels.
- Capability-level claims only. BBD's model trains in simulation today; nothing on the site may say or imply that BBD drones already fly real deliveries, exercises or shows. Anything that needs the team's sign-off is marked `// sign-off` in the content files.
- Drako is unarmed training drones and range simulation for counter-drone training and testing. Describe it at that level only: no weapons, payloads or tactics.
- Plain verbs, sentence case, name things by what people understand.
