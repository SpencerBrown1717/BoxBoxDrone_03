/**
 * Sky bands: the live sky as a hero visual on inner pages.
 * Each band plays one or more scenes (for example delivery, then the same deliveries in weather).
 */
import { createSky, type SkyScene } from './sky';
import { skyLabels } from '../content/home';
import { isPaused, onMotionChange, wireToggle } from './motion';

export function mountBands() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll<HTMLElement>('[data-sky-band]').forEach((band) => {
    if (band.dataset.mounted) return;
    band.dataset.mounted = 'true';
    const canvas = band.querySelector<HTMLCanvasElement>('canvas');
    if (!canvas) return;

    let sky: ReturnType<typeof createSky>;
    try {
      sky = createSky(canvas, { reducedMotion: reduced, labels: skyLabels });
    } catch {
      return;
    }

    const scenes = (band.dataset.scenes ?? 'swarm').split(',') as SkyScene[];
    const interval = Number(band.dataset.interval ?? 8000);
    const groundShare = Number(band.dataset.ground ?? 0.86);
    let index = 0;
    let size = '';

    const layout = () => {
      const w = band.clientWidth;
      const h = band.clientHeight;
      const key = `${w}x${h}`;
      if (key === size) return;
      size = key;
      sky.layout(w, h, Math.round(h * groundShare));
    };

    new ResizeObserver(layout).observe(band);
    layout();
    sky.jumpTo(scenes[0]);
    if (isPaused()) sky.setPaused(true);

    new IntersectionObserver(([entry]) => sky.setActive(entry.isIntersecting), { rootMargin: '80px' }).observe(band);

    if (scenes.length > 1 && !reduced) {
      window.setInterval(() => {
        if (isPaused() || document.hidden) return;
        index = (index + 1) % scenes.length;
        sky.setScene(scenes[index]);
      }, interval);
    }

    onMotionChange((paused) => sky.setPaused(paused));
    if (!reduced) wireToggle(band.querySelector<HTMLButtonElement>('[data-motion-toggle]'));
  });
}
