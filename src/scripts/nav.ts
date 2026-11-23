/**
 * Primary navigation behaviour.
 *
 * Layout: the header measures whether its row fits. If it does, it gets `is-wide`
 * and each tab's mega menu becomes a native popover (`popover="auto"`, so opening one
 * closes the others, and Escape and clicking away close it). If it doesn't, the links
 * live in the menu drawer and each tab is a simple disclosure.
 * Without this script the header keeps the drawer layout with everything expanded.
 */
const header = document.querySelector<HTMLElement>('[data-site-header]');

if (header) {
  const inner = header.querySelector<HTMLElement>('.header-inner')!;
  const list = header.querySelector<HTMLElement>('#site-menu')!;
  const items = [...header.querySelectorAll<HTMLElement>('[data-mega-item]')].map((li) => ({
    li,
    trigger: li.querySelector<HTMLButtonElement>('[data-mega-trigger]')!,
    panel: li.querySelector<HTMLElement>('[data-mega]')!,
  }));
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');

  const isOpen = (el: HTMLElement) => {
    try {
      return el.matches(':popover-open');
    } catch {
      return false;
    }
  };

  let wideLayout: boolean | null = null;
  let previewing: HTMLElement | null = null;
  let openTimer = 0;
  let openingFor: HTMLElement | null = null;
  let closeTimer = 0;

  /** Drop a hover preview that hasn't opened yet, so it can't reopen a panel just closed. */
  const cancelPendingOpen = (panel: HTMLElement) => {
    if (openingFor !== panel) return;
    window.clearTimeout(openTimer);
    openingFor = null;
  };

  /** Point each panel at the right behaviour for the layout. */
  const applyLayout = (wide: boolean) => {
    if (wide === wideLayout) return;
    wideLayout = wide;
    previewing = null;
    for (const { trigger, panel } of items) {
      if (wide) {
        panel.setAttribute('popover', 'auto');
        panel.hidden = false;
      } else {
        if (isOpen(panel)) panel.hidePopover();
        panel.removeAttribute('popover');
        panel.hidden = true;
      }
      trigger.setAttribute('aria-expanded', 'false');
    }
  };

  let lastWidth = 0;
  const sync = () => {
    const width = header.clientWidth;
    const wide = header.classList.contains('is-wide');
    // While collapsed, only remeasure when the header has grown
    if (!wide && wideLayout !== null && width <= lastWidth) {
      lastWidth = width;
      return;
    }
    lastWidth = width;

    const menuWasOpen = isOpen(list);
    header.classList.add('is-measuring', 'is-wide');
    list.removeAttribute('popover');
    const fits = inner.scrollWidth <= inner.clientWidth;
    if (!fits) {
      header.classList.remove('is-wide');
      list.setAttribute('popover', 'auto');
      if (menuWasOpen) list.showPopover?.();
    }
    applyLayout(fits);
    requestAnimationFrame(() => header.classList.remove('is-measuring'));
  };

  for (const { li, trigger, panel } of items) {
    trigger.addEventListener('click', (event) => {
      cancelPendingOpen(panel);
      if (header.classList.contains('is-wide')) {
        // A click while hover-previewing pins the panel open instead of toggling it closed
        if (previewing === panel) {
          event.preventDefault();
          previewing = null;
        }
        return;
      }
      const opening = panel.hidden;
      panel.hidden = !opening;
      trigger.setAttribute('aria-expanded', String(opening));
    });

    panel.addEventListener('toggle', (event) => {
      const open = (event as ToggleEvent).newState === 'open';
      trigger.setAttribute('aria-expanded', String(open));
      if (!open) {
        cancelPendingOpen(panel);
        if (previewing === panel) previewing = null;
      }
    });

    // Hover preview on wide layouts with a mouse
    li.addEventListener('pointerenter', (event) => {
      if (!header.classList.contains('is-wide') || event.pointerType === 'touch' || !canHover.matches) return;
      window.clearTimeout(closeTimer);
      window.clearTimeout(openTimer);
      openingFor = panel;
      openTimer = window.setTimeout(() => {
        openingFor = null;
        if (!isOpen(panel)) {
          panel.showPopover();
          previewing = panel;
        }
      }, 90);
    });

    li.addEventListener('pointerleave', () => {
      cancelPendingOpen(panel);
      if (previewing !== panel) return;
      closeTimer = window.setTimeout(() => {
        if (previewing === panel && isOpen(panel)) panel.hidePopover();
        previewing = null;
      }, 180);
    });

    // Tabbing out of a tab and its panel closes the panel
    li.addEventListener('focusout', (event) => {
      const next = (event as FocusEvent).relatedTarget as Node | null;
      if (header.classList.contains('is-wide') && next && !li.contains(next) && isOpen(panel)) panel.hidePopover();
    });

    // Choosing a link closes whatever is open
    panel.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('a')) return;
      if (isOpen(panel)) panel.hidePopover();
      if (isOpen(list)) list.hidePopover();
    });
  }

  // Escape also cancels a hover preview that is about to open
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    window.clearTimeout(openTimer);
    openingFor = null;
  });

  list.addEventListener('click', (event) => {
    if ((event.target as Element).closest('.tab-link, .menu-preorder a') && isOpen(list)) list.hidePopover();
  });

  const observer = new ResizeObserver(sync);
  observer.observe(header);
  observer.observe(list);
}
