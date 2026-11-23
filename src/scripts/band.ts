/**
 * Field bands: the live subsurface field as a hero visual on inner pages.
 * Each band plays one or more scenes (for example the submarine, then the tunnel).
 */
import { createField, type FieldScene } from './field';
import { fieldLabels } from '../content/home';
import { isPaused, onMotionChange, wireToggle } from './motion';

export function mountBands() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll<HTMLElement>('[data-field-band]').forEach((band) => {
    if (band.dataset.mounted) return;
    band.dataset.mounted = 'true';
    const canvas = band.querySelector<HTMLCanvasElement>('canvas');
    if (!canvas) return;

    let field: ReturnType<typeof createField>;
    try {
      field = createField(canvas, { reducedMotion: reduced, labels: fieldLabels });
    } catch {
      return;
    }

    const scenes = (band.dataset.scenes ?? 'surface').split(',') as FieldScene[];
    const interval = Number(band.dataset.interval ?? 7000);
    const groundShare = Number(band.dataset.ground ?? 0.18);
    let index = 0;
    let size = '';

    const layout = () => {
      const w = band.clientWidth;
      const h = band.clientHeight;
      const key = `${w}x${h}`;
      if (key === size) return;
      size = key;
      field.layout(w, h, Math.round(h * groundShare));
    };

    new ResizeObserver(layout).observe(band);
    layout();
    field.setScene(scenes[0]);
    if (isPaused()) field.setPaused(true);

    new IntersectionObserver(([entry]) => field.setActive(entry.isIntersecting), { rootMargin: '80px' }).observe(band);

    if (scenes.length > 1 && !reduced) {
      window.setInterval(() => {
        if (isPaused() || document.hidden) return;
        index = (index + 1) % scenes.length;
        field.setScene(scenes[index]);
      }, interval);
    }

    onMotionChange((paused) => field.setPaused(paused));
    if (!reduced) wireToggle(band.querySelector<HTMLButtonElement>('[data-motion-toggle]'));
  });
}
