/**
 * One switch for all continuous motion on a page (the sky, the bands and the drawn scenes).
 * State lives on <html data-motion="paused"> so CSS animations can follow it too.
 */
export const isPaused = () => document.documentElement.dataset.motion === 'paused';

export function setPaused(paused: boolean) {
  if (paused) document.documentElement.dataset.motion = 'paused';
  else delete document.documentElement.dataset.motion;
  document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach((button) => {
    button.textContent = paused ? 'Play motion' : 'Pause motion';
  });
  document.dispatchEvent(new CustomEvent('bbd:motion', { detail: { paused } }));
}

export function onMotionChange(callback: (paused: boolean) => void) {
  document.addEventListener('bbd:motion', (event) => callback((event as CustomEvent<{ paused: boolean }>).detail.paused));
}

export function wireToggle(button: HTMLButtonElement | null) {
  if (!button || button.dataset.wired) return;
  button.dataset.wired = 'true';
  button.hidden = false;
  button.textContent = isPaused() ? 'Play motion' : 'Pause motion';
  button.addEventListener('click', () => setPaused(!isPaused()));
}
