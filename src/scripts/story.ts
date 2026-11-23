/**
 * Orchestrates the home page story.
 *
 * The cost line choreography runs on native scroll-driven animations (a ViewTimeline
 * on the hero spacer), so it stays on the compositor. Browsers without them get the
 * same Web Animations, scrubbed from a scroll listener. With reduced motion, nothing
 * here animates: the page shows finished frames.
 *
 * The line falls to the floor and stays there as the horizon. The sky fills with
 * drones above it, and each scene below plays as its copy scrolls by.
 */
import { createSky, type SkyScene } from './sky';
import { skyLabels } from '../content/home';
import { onMotionChange, wireToggle } from './motion';

type Range = [number, number];

const DURATION = 1000;
const LANDED = 0.6; // the line reaches the floor
const BELOW = 0.7; // the hero gives way to the sky
const A: Range = [0, LANDED];
const B: Range = [LANDED, BELOW];
const C: Range = [BELOW, 1];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const story = document.querySelector<HTMLElement>('[data-story]');
if (story) start(story);

function start(story: HTMLElement) {
  const stage = story.querySelector<HTMLElement>('[data-stage]');
  const skyWrap = story.querySelector<HTMLElement>('[data-sky]');
  const canvas = story.querySelector<HTMLCanvasElement>('[data-sky-canvas]');
  const spacer = story.querySelector<HTMLElement>('[data-hero-spacer]');
  const toggle = story.querySelector<HTMLButtonElement>('[data-motion-toggle]');
  if (!stage || !skyWrap || !canvas || !spacer) return;

  // The head script picked the mode before first paint; follow it so the layout never switches
  const reduced = !document.documentElement.classList.contains('motion-ok');
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => location.reload());

  let sky: ReturnType<typeof createSky>;
  try {
    sky = createSky(canvas, { reducedMotion: reduced, labels: skyLabels });
  } catch {
    return;
  }
  sky.setClearSources([...story.querySelectorAll<HTMLElement>('[data-clear]')]);

  const animated = !reduced;

  // ---- Measurements --------------------------------------------------------

  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const navHeight = () => header?.offsetHeight ?? 64;
  const floorGap = () => parseFloat(getComputedStyle(story).getPropertyValue('--floor-gap')) || 64;

  let size = { w: 0, h: 0, ground: 0 };

  function measure() {
    const w = skyWrap!.clientWidth;
    const h = skyWrap!.clientHeight;
    // The horizon is where the line lands
    const ground = Math.round(h - floorGap());
    if (w === size.w && h === size.h && ground === size.ground) return false;
    size = { w, h, ground };
    sky.layout(w, h, ground);
    return true;
  }

  // ---- Cost line choreography -------------------------------------------------

  const ViewTimelineCtor = (window as unknown as { ViewTimeline?: new (o: object) => AnimationTimeline }).ViewTimeline;
  let animations: Animation[] = [];
  let scrubbed: { anim: Animation; range: Range }[] = [];

  function progress() {
    const rect = spacer!.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    return span > 0 ? clamp01(-rect.top / span) : 1;
  }

  function scrub(p: number) {
    for (const { anim, range } of scrubbed) {
      anim.currentTime = clamp01((p - range[0]) / (range[1] - range[0])) * DURATION;
    }
  }

  function build() {
    for (const anim of animations) anim.cancel();
    animations = [];
    scrubbed = [];
    if (!animated) return;

    const H = stage!.clientHeight;
    const W = stage!.clientWidth;
    const yTop = navHeight() + 10;
    const yFloor = H - floorGap();
    const timeline = ViewTimelineCtor ? new ViewTimelineCtor({ subject: spacer, axis: 'block' }) : null;

    const ty = (y: number) => `translate3d(0, ${y.toFixed(1)}px, 0)`;
    const tx = (x: number) => `translate3d(${x.toFixed(1)}px, 0, 0)`;
    const settle = 'cubic-bezier(0.37, 0, 0.3, 1)';

    const add = (el: Element | null, keyframes: Keyframe[], range: Range, easing = 'linear') => {
      if (!el) return;
      if (timeline) {
        const anim = el.animate(keyframes, {
          timeline,
          rangeStart: `contain ${range[0] * 100}%`,
          rangeEnd: `contain ${range[1] * 100}%`,
          fill: 'both',
          easing,
        } as KeyframeAnimationOptions);
        animations.push(anim);
      } else {
        const anim = el.animate(keyframes, { duration: DURATION, fill: 'both', easing });
        anim.pause();
        animations.push(anim);
        scrubbed.push({ anim, range });
      }
    };

    const $ = (selector: string) => story.querySelector(selector);
    const now = $('[data-layer="now"]');
    const then = $('[data-layer="then"]');

    // A: the cost line sweeps down. Above it is now, below it is still then.
    add($('[data-bar]'), [{ transform: ty(yTop) }, { transform: ty(yFloor) }], A, settle);
    add(now, [{ transform: ty(yTop - H) }, { transform: ty(yFloor - H) }], A, settle);
    add(now?.querySelector('[data-layer-inner]') ?? null, [{ transform: ty(H - yTop) }, { transform: ty(H - yFloor) }], A, settle);
    add(then, [{ transform: ty(yTop) }, { transform: ty(yFloor) }], A, settle);
    add(then?.querySelector('[data-layer-inner]') ?? null, [{ transform: ty(-yTop) }, { transform: ty(-yFloor) }], A, settle);

    // Its glow softens as it falls, then goes out as it becomes the horizon
    add(
      $('[data-bar-glow]'),
      [
        { opacity: 1, offset: 0 },
        { opacity: 0.55, offset: LANDED / 0.92 },
        { opacity: 0.55, offset: (BELOW + 0.04) / 0.92 },
        { opacity: 0, offset: 1 },
      ],
      [0, 0.92],
    );

    // B: it lands, and the first flight runs out along it
    const half = W / 2;
    const spark = (to: number): Keyframe[] => [
      { transform: tx(0), opacity: 0 },
      { opacity: 1, offset: 0.06 },
      { opacity: 0.95, offset: 0.6 },
      { transform: tx(to), opacity: 0 },
    ];
    add($('[data-spark="left"]'), spark(-half), B, 'cubic-bezier(0.25, 0.6, 0.35, 1)');
    add($('[data-spark="right"]'), spark(half), B, 'cubic-bezier(0.25, 0.6, 0.35, 1)');

    // C: the hero gives way to the sky. The line cools into the horizon while the drones fade in above it.
    add(skyWrap, [{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 1 }], C);
    add(now, [{ opacity: 1 }, { opacity: 0 }], [BELOW, 0.88]);
    add(then, [{ opacity: 1 }, { opacity: 0 }], [BELOW, 0.88]);
    add(now, [{ visibility: 'visible' }, { visibility: 'hidden' }], [0.88, 0.9]);
    add($('[data-bar-hot]'), [{ opacity: 1 }, { opacity: 0 }], [BELOW + 0.04, 0.9]);
    add($('[data-bar-cool]'), [{ opacity: 0 }, { opacity: 1, offset: 0.35 }, { opacity: 0 }], [BELOW + 0.04, 1]);

    if (!timeline) scrub(progress());
  }

  // ---- Sky activity and scenes -------------------------------------------------

  let storyInView = false;
  let pastHero = !animated;

  const updateActive = () => sky.setActive(storyInView && pastHero);

  new IntersectionObserver(([entry]) => {
    storyInView = entry.isIntersecting;
    updateActive();
  }).observe(story);

  const sceneObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          sky.setScene((entry.target as HTMLElement).dataset.observe as SkyScene);
        }
      }
    },
    { rootMargin: '-48% 0px -48% 0px' },
  );
  story.querySelectorAll('[data-observe]').forEach((el) => sceneObserver.observe(el));

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (!animated) return;
      const p = progress();
      if (scrubbed.length) scrub(p);
      const nowPast = p > BELOW - 0.02;
      if (nowPast !== pastHero) {
        pastHero = nowPast;
        story.classList.toggle('is-past-hero', pastHero);
        updateActive();
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // The hero's button sits under the line until it lands; bring it into view on focus
  story.querySelector('[data-hero-cta] a')?.addEventListener('focus', () => {
    if (!animated || progress() >= LANDED) return;
    const rect = spacer.getBoundingClientRect();
    const top = window.scrollY + rect.top + (LANDED + 0.03) * (rect.height - window.innerHeight);
    window.scrollTo({ top, behavior: 'smooth' });
  });

  // ---- Pause control for continuous motion -----------------------------------

  if (animated) wireToggle(toggle);
  onMotionChange((paused) => sky.setPaused(paused));

  // ---- Layout -----------------------------------------------------------------

  let queued = false;
  const relayout = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const changed = measure();
      if (changed || !animations.length) build();
      onScroll();
    });
  };

  new ResizeObserver(relayout).observe(animated ? stage : skyWrap);
  document.fonts?.ready.then(relayout);
  relayout();
}
