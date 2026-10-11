/** Loop photos rightward, with keyboard focus pause and directional browsing. */
export function initializeGalleryStrip(root: HTMLElement) {
  const scroller = root.querySelector<HTMLElement>('[data-gallery-scroll]');
  const track = root.querySelector<HTMLElement>('[data-gallery-track]');
  const directions = [...root.querySelectorAll<HTMLButtonElement>('[data-strip-direction]')];
  if (!scroller || !track || directions.length !== 2 || root.dataset.stripReady) return;

  const originals = [...track.querySelectorAll<HTMLElement>('[data-gallery-card]')];
  if (originals.length < 2) return;
  const anchors = new Map(originals.map(card => {
    const anchor = card.querySelector<HTMLAnchorElement>('[data-gallery-open]')!;
    return [anchor.dataset.galleryId, anchor] as const;
  }));
  // Only the first set participates in keyboard navigation and screen-reader order.
  const copies = originals.map(card => {
    const copy = card.cloneNode(true) as HTMLElement;
    copy.removeAttribute('data-gallery-card');
    copy.dataset.galleryClone = '';
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll<HTMLAnchorElement>('a').forEach(anchor => {
      anchor.tabIndex = -1;
      anchor.removeAttribute('data-gallery-open');
    });
    copy.querySelectorAll('img').forEach(image => { image.alt = ''; });
    track.append(copy);
    return copy;
  });

  let returnToStrip = false;
  track.addEventListener('click', event => {
    const target = (event.target as Element).closest<HTMLAnchorElement>('[data-gallery-clone] a');
    if (!target || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const original = anchors.get(target.dataset.galleryId);
    if (!original) return;
    event.preventDefault();
    returnToStrip = true;
    original.click();
  });
  root.querySelector<HTMLDialogElement>('[data-gallery-dialog]')?.addEventListener('close', () => {
    if (returnToStrip) scroller.focus({ preventScroll: true });
    returnToStrip = false;
  });

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let touching = false;
  let visible = false;
  let period = 0;
  let position = 0;
  let lastWritten = 0;
  let frame = 0;
  let previousTime = 0;
  let interactionTimer = 0;
  let navigationFrame = 0;
  let navigating = false;
  const speed = 40; // CSS pixels per second, independent of screen refresh rate.

  const writePosition = (value: number) => {
    while (value < 1) value += period;
    while (value > period + 1) value -= period;
    position = value;
    scroller.scrollLeft = value;
    lastWritten = scroller.scrollLeft;
  };
  const cancelNavigation = () => {
    cancelAnimationFrame(navigationFrame);
    navigationFrame = 0;
    navigating = false;
  };

  const tick = (time: number) => {
    if (previousTime) position -= speed * Math.min((time - previousTime) / 1000, .05);
    previousTime = time;
    writePosition(position);
    frame = requestAnimationFrame(tick);
  };
  const update = () => {
    const active = document.activeElement;
    // Pointer-clicked arrows must not prevent playback after the pointer leaves.
    const keyboardFocused = active instanceof HTMLElement && root.contains(active) && active.matches(':focus-visible');
    const viewerOpen = Boolean(root.querySelector<HTMLDialogElement>('[data-gallery-dialog]')?.open);
    const playing = period > 0 && visible && !document.hidden && !reducedMotion.matches && !keyboardFocused && !viewerOpen && !touching && !navigating;
    root.dataset.stripPlaying = String(playing);
    root.dataset.stripPaused = String(reducedMotion.matches);
    if (playing && !frame) {
      position = scroller.scrollLeft;
      previousTime = 0;
      frame = requestAnimationFrame(tick);
    } else if (!playing && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }
  };
  const measure = () => {
    const nextPeriod = copies[0].getBoundingClientRect().left - originals[0].getBoundingClientRect().left;
    if (nextPeriod <= 0) return;
    cancelNavigation();
    const fraction = period ? scroller.scrollLeft / period : reducedMotion.matches ? 0 : 1;
    period = nextPeriod;
    position = period * fraction;
    scroller.scrollLeft = position;
    lastWritten = scroller.scrollLeft;
    update();
  };

  directions.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (!period) return;
      cancelNavigation();
      const step = originals[1].getBoundingClientRect().left - originals[0].getBoundingClientRect().left;
      const from = scroller.scrollLeft;
      const to = from + (button.dataset.stripDirection === 'left' ? -step : step);
      if (reducedMotion.matches) {
        writePosition(to);
        return;
      }
      navigating = true;
      update();
      const started = performance.now();
      const advance = (time: number) => {
        const progress = Math.min((time - started) / 280, 1);
        writePosition(from + (to - from) * (1 - (1 - progress) ** 3));
        if (progress < 1) navigationFrame = requestAnimationFrame(advance);
        else { navigationFrame = 0; navigating = false; update(); }
      };
      navigationFrame = requestAnimationFrame(advance);
    });
  });
  root.addEventListener('focusin', update);
  root.addEventListener('focusout', () => { queueMicrotask(update); });
  root.addEventListener('keydown', update);
  const settleInteraction = () => {
    clearTimeout(interactionTimer);
    interactionTimer = window.setTimeout(() => { touching = false; update(); }, 2000);
  };
  scroller.addEventListener('pointerdown', () => {
    cancelNavigation();
    clearTimeout(interactionTimer);
    touching = true;
    update();
  }, { passive: true });
  window.addEventListener('pointerup', () => { if (touching) settleInteraction(); }, { passive: true });
  window.addEventListener('pointercancel', () => { if (touching) settleInteraction(); }, { passive: true });
  scroller.addEventListener('wheel', () => { cancelNavigation(); touching = true; update(); settleInteraction(); }, { passive: true });
  scroller.addEventListener('scroll', () => {
    if (scroller.scrollLeft !== lastWritten) position = scroller.scrollLeft;
  }, { passive: true });
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) cancelNavigation();
    update();
  });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    update();
  }, { threshold: .1 }).observe(scroller);
  new ResizeObserver(measure).observe(scroller);
  root.dataset.stripReady = 'true';
  measure();
}
