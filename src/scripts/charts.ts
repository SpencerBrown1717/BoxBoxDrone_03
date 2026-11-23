/**
 * The hover and focus layer for the topic charts. Tooltips enhance, never gate:
 * every value is also in the chart's table view.
 *
 * Marks with data-tip="value|label" show a tooltip on hover and keyboard focus.
 * Line charts get a crosshair that snaps to the nearest sample, with a readout
 * of every series there; arrow keys step through the samples.
 */

interface LineData {
  x: number[];
  xs: string[];
  series: { name: string; tone: string; y: number[]; v: string[] }[];
}

const toneVar: Record<string, string> = {
  signal: 'var(--signal)',
  highlight: 'var(--highlight)',
  other: 'var(--other)',
  context: 'var(--context)',
};

function setTip(tip: HTMLElement, value: string, label: string, rows?: { tone: string; text: string }[]) {
  tip.replaceChildren();
  if (rows) {
    const head = document.createElement('span');
    head.textContent = label;
    tip.append(head);
    for (const row of rows) {
      const line = document.createElement('span');
      line.className = 'tip-row';
      const key = document.createElement('span');
      key.className = 'tip-key';
      key.style.setProperty('--tone', toneVar[row.tone] ?? 'var(--highlight)');
      const strong = document.createElement('strong');
      strong.textContent = row.text;
      line.append(key, strong);
      tip.append(line);
    }
    return;
  }
  const strong = document.createElement('strong');
  strong.textContent = value;
  const span = document.createElement('span');
  span.textContent = label;
  tip.append(strong, span);
}

function place(tip: HTMLElement, figure: HTMLElement, x: number, y: number) {
  const box = figure.getBoundingClientRect();
  tip.hidden = false;
  const half = tip.offsetWidth / 2;
  const left = Math.min(Math.max(x - box.left, half), box.width - half);
  tip.style.left = `${left}px`;
  tip.style.top = `${y - box.top}px`;
}

function wireMarks(figure: HTMLElement, tip: HTMLElement) {
  for (const mark of figure.querySelectorAll<HTMLElement>('[data-tip]')) {
    const [value, label] = (mark.dataset.tip ?? '').split('|');
    const show = () => {
      setTip(tip, value, label);
      const r = mark.getBoundingClientRect();
      place(tip, figure, r.left + r.width / 2, r.top);
    };
    const hide = () => (tip.hidden = true);
    mark.addEventListener('pointerenter', show);
    mark.addEventListener('pointerleave', hide);
    mark.addEventListener('focus', show);
    mark.addEventListener('blur', hide);
  }
}

function wireLine(figure: HTMLElement, tip: HTMLElement) {
  const plot = figure.querySelector<HTMLElement>('[data-line]');
  if (!plot) return;
  const data = JSON.parse(plot.dataset.line ?? '{}') as LineData;
  const cross = plot.querySelector<HTMLElement>('.crosshair')!;
  const dots = data.series.map((s) => {
    const dot = document.createElement('span');
    dot.className = 'cross-dot';
    dot.style.setProperty('--tone', toneVar[s.tone] ?? 'var(--highlight)');
    dot.hidden = true;
    plot.append(dot);
    return dot;
  });
  let index = -1;

  const show = (i: number) => {
    index = Math.max(0, Math.min(data.x.length - 1, i));
    const left = `${data.x[index] * 100}%`;
    cross.hidden = false;
    cross.style.left = left;
    data.series.forEach((s, si) => {
      const y = s.y[index];
      dots[si].hidden = y < -0.02 || y > 1.02;
      dots[si].style.left = left;
      dots[si].style.top = `${y * 100}%`;
    });
    setTip(
      tip,
      '',
      data.xs[index],
      data.series.map((s) => ({ tone: s.tone, text: data.series.length > 1 ? `${s.v[index]}, ${s.name}` : s.v[index] })),
    );
    const box = plot.getBoundingClientRect();
    const topY = Math.min(...data.series.map((s) => s.y[index]).filter((y) => y >= 0 && y <= 1), 1);
    place(tip, figure, box.left + data.x[index] * box.width, box.top + Math.max(0, topY) * box.height);
  };

  const hide = () => {
    cross.hidden = true;
    dots.forEach((dot) => (dot.hidden = true));
    tip.hidden = true;
  };

  const nearest = (clientX: number) => {
    const box = plot.getBoundingClientRect();
    const fx = (clientX - box.left) / box.width;
    let best = 0;
    data.x.forEach((x, i) => {
      if (Math.abs(x - fx) < Math.abs(data.x[best] - fx)) best = i;
    });
    return best;
  };

  plot.addEventListener('pointermove', (event) => show(nearest(event.clientX)));
  plot.addEventListener('pointerleave', hide);
  plot.addEventListener('focus', () => show(index < 0 ? Math.floor(data.x.length / 2) : index));
  plot.addEventListener('blur', hide);
  plot.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 5 : 1;
    if (event.key === 'ArrowRight') show(index + step);
    else if (event.key === 'ArrowLeft') show(index - step);
    else if (event.key === 'Home') show(0);
    else if (event.key === 'End') show(data.x.length - 1);
    else if (event.key === 'Escape') hide();
    else return;
    event.preventDefault();
  });
}

/** Keep each note inside its chart: flip it to the other side of its dot, then nudge it in. */
function fitNotes(figure: HTMLElement) {
  const notes = [...figure.querySelectorAll<HTMLElement>('.note-text')];
  if (notes.length === 0) return;
  const fit = () => {
    const box = figure.getBoundingClientRect();
    for (const note of notes) {
      note.classList.remove('is-flipped');
      note.style.removeProperty('--nudge');
      let r = note.getBoundingClientRect();
      const end = note.classList.contains('align-end');
      if ((!end && r.right > box.right) || (end && r.left < box.left)) {
        note.classList.add('is-flipped');
        r = note.getBoundingClientRect();
      }
      const nudge = r.left < box.left ? box.left - r.left : r.right > box.right ? box.right - r.right : 0;
      if (nudge !== 0) note.style.setProperty('--nudge', `${nudge}px`);
    }
  };
  fit();
  new ResizeObserver(fit).observe(figure);
}

for (const figure of document.querySelectorAll<HTMLElement>('[data-chart]')) {
  fitNotes(figure);
  const tip = figure.querySelector<HTMLElement>('.chart-tip');
  if (!tip) continue;
  wireMarks(figure, tip);
  wireLine(figure, tip);
}
