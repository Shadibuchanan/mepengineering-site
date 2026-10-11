// Progressive enhancement: content is visible in the HTML and CSS. Only an
// active Web Animation changes it, so a missing script never hides the page.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopMotion = window.matchMedia('(min-width: 801px) and (pointer: fine)');
const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
const active = new Map<HTMLElement, Animation>();
const pending = new Set(document.querySelectorAll<HTMLElement>('[data-reveal]'));
let reveals: IntersectionObserver | undefined;

function animate(element: HTMLElement, frames: Keyframe[], duration: number, delay = 0) {
  active.get(element)?.cancel();
  if (reducedMotion.matches || !element.animate || element.matches(':focus-within')) return;
  const animation = element.animate(frames, { duration, delay, easing: ease, fill: 'backwards' });
  active.set(element, animation);
  const release = () => { if (active.get(element) === animation) active.delete(element); };
  animation.addEventListener('finish', release, { once: true });
  animation.addEventListener('cancel', release, { once: true });
}

function reveal(element: HTMLElement, delay = 0) {
  pending.delete(element);
  reveals?.unobserve(element);
  const image = element.dataset.reveal === 'image';
  const opacity = getComputedStyle(element).opacity;
  animate(element, [
    { opacity: 0, transform: `translate3d(0, ${image ? 24 : 30}px, 0)` },
    { opacity, transform: 'translate3d(0, 0, 0)' },
  ], image ? 950 : 800, delay);
}

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  reveals = new IntersectionObserver(entries => {
    // Stagger only siblings arriving together, never an entire offscreen list.
    const groups = new Map<Element, number>();
    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      if (!entry.isIntersecting || !pending.has(element)) continue;
      const group = element.parentElement;
      const index = group?.hasAttribute('data-stagger') ? groups.get(group) || 0 : 0;
      if (group) groups.set(group, index + 1);
      reveal(element, Math.min(index * 90, 270));
    }
  }, { threshold: 0.04 });
  pending.forEach(element => reveals?.observe(element));
}

if (!reducedMotion.matches) {
  document.querySelectorAll<HTMLElement>('[data-hero-line]').forEach((line, index) => {
    animate(line, [
      { opacity: 0, transform: 'translate3d(0, 105%, 0) rotate(2deg)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0) rotate(0deg)' },
    ], 1100, 100 + index * 130);
  });
  document.querySelectorAll<HTMLElement>('[data-hero-reveal]').forEach(element => {
    animate(element, [
      { opacity: 0, transform: 'translate3d(0, 18px, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    ], 900, Number(element.dataset.heroReveal) || 0);
  });
  const heroImage = document.querySelector<HTMLElement>('.hero__image');
  if (heroImage) animate(heroImage, [{ scale: '1.055' }, { scale: '1' }], 1700);
}

// Keyboard and anchor navigation should never wait for a reveal to finish.
document.addEventListener('focusin', event => {
  if (!(event.target instanceof HTMLElement)) return;
  for (let element: HTMLElement | null = event.target; element; element = element.parentElement) {
    active.get(element)?.cancel();
    pending.delete(element);
    reveals?.unobserve(element);
  }
});

// Reintroduce visible results after a user filters the portfolio. The filtering
// itself stays synchronous, including its accessible count and empty states.
document.addEventListener('portfolio:updated', () => {
  document.querySelectorAll<HTMLElement>('.portfolio-grid .project-card').forEach((card, index) => {
    active.get(card)?.cancel();
    const rect = card.getBoundingClientRect();
    if (card.hidden || rect.bottom <= 0 || rect.top >= innerHeight) return;
    pending.delete(card);
    reveals?.unobserve(card);
    animate(card, [
      { opacity: 0.25, transform: 'translate3d(0, 12px, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    ], 420, Math.min(index * 35, 105));
  });
});

// Small image drift on desktop; touch devices keep their normal scroll behavior.
const panels = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
const visiblePanels = new Set<HTMLElement>();
let parallaxObserver: IntersectionObserver | undefined;
let frame = 0;

function updateParallax() {
  frame = 0;
  for (const panel of visiblePanels) {
    const image = panel.querySelector<HTMLElement>('[data-parallax-image]');
    const rect = panel.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / ((innerHeight + rect.height) / 2)));
    image?.style.setProperty('--parallax-y', `${(progress * 20).toFixed(2)}px`);
  }
}

function requestParallax() {
  if (!frame && visiblePanels.size) frame = requestAnimationFrame(updateParallax);
}

function configureParallax() {
  parallaxObserver?.disconnect();
  visiblePanels.clear();
  cancelAnimationFrame(frame);
  frame = 0;
  window.removeEventListener('scroll', requestParallax);
  window.removeEventListener('resize', requestParallax);
  panels.forEach(panel => panel.querySelector<HTMLElement>('[data-parallax-image]')?.style.removeProperty('--parallax-y'));
  if (reducedMotion.matches || !desktopMotion.matches || !('IntersectionObserver' in window) || !panels.length) return;
  parallaxObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const panel = entry.target as HTMLElement;
      if (entry.isIntersecting) visiblePanels.add(panel);
      else visiblePanels.delete(panel);
    });
    requestParallax();
  });
  panels.forEach(panel => parallaxObserver?.observe(panel));
  window.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax, { passive: true });
}

reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    active.forEach(animation => animation.cancel());
    active.clear();
    reveals?.disconnect();
    pending.clear();
  }
  configureParallax();
});
desktopMotion.addEventListener('change', configureParallax);
configureParallax();
