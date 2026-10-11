interface HeroView {
  label: string;
  position: string;
  zoom: number;
}

const carousel = document.querySelector<HTMLElement>('[data-hero-carousel]');
if (carousel) {
  const views: HeroView[] = JSON.parse(carousel.dataset.views || '[]');
  const controls = carousel.querySelector<HTMLElement>('[data-hero-controls]');
  const image = carousel.querySelector<HTMLImageElement>('.hero__image');
  const label = carousel.querySelector<HTMLElement>('[data-hero-view-label]');
  const status = carousel.querySelector<HTMLElement>('[data-hero-status]');
  const steps = [...carousel.querySelectorAll<HTMLButtonElement>('[data-hero-step]')];
  let current = 0;

  const show = (index: number) => {
    current = (index + views.length) % views.length;
    const view = views[current];
    carousel.style.setProperty('--hero-position', view.position);
    carousel.style.setProperty('--hero-zoom', String(view.zoom));
    if (label) label.textContent = view.label;
    if (image) image.alt = `Mayami Wynwood, Miami: ${view.label.toLowerCase()}`;
    steps.forEach((step, index) => step.setAttribute('aria-pressed', String(index === current)));
    if (status) status.textContent = `View ${current + 1} of ${views.length}: Mayami Wynwood, ${view.label.toLowerCase()}.`;
  };

  if (views.length > 1 && controls) {
    controls.hidden = false;
    steps.forEach((step, index) => step.addEventListener('click', () => show(index)));
    controls.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') show(current - 1);
      else if (event.key === 'ArrowRight') show(current + 1);
      else if (event.key === 'Home') show(0);
      else if (event.key === 'End') show(views.length - 1);
      else return;
      event.preventDefault();
      steps[current]?.focus({ preventScroll: true });
    });

    // A horizontal touch gesture changes the photo; vertical gestures scroll normally.
    let start: { x: number; y: number; id: number } | undefined;
    carousel.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch' || (event.target as Element).closest('a,button')) return;
      start = { x: event.clientX, y: event.clientY, id: event.pointerId };
    }, { passive: true });
    carousel.addEventListener('pointerup', event => {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
      start = undefined;
    }, { passive: true });
    carousel.addEventListener('pointercancel', () => { start = undefined; });
  }
}
