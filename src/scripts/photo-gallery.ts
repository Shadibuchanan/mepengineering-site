interface GalleryPhoto {
  anchor: HTMLAnchorElement;
  card: HTMLElement;
  title: string;
  category: string;
  alt: string;
  src: string;
  width: number;
  height: number;
}

/** Enhance each independently usable gallery. Ordinary image links remain the fallback. */
export function initializePhotoGallery(root: HTMLElement) {
  if (root.dataset.galleryInitialized === 'true') return;
  const dialog = root.querySelector<HTMLDialogElement>('[data-gallery-dialog]');
  const image = root.querySelector<HTMLImageElement>('[data-gallery-current-image]');
  const title = root.querySelector<HTMLElement>('[data-gallery-current-title]');
  const category = root.querySelector<HTMLElement>('[data-gallery-current-category]');
  const counter = root.querySelector<HTMLElement>('[data-gallery-counter]');
  const close = root.querySelector<HTMLButtonElement>('[data-gallery-close]');
  const previous = root.querySelector<HTMLButtonElement>('[data-gallery-previous]');
  const next = root.querySelector<HTMLButtonElement>('[data-gallery-next]');
  const stage = root.querySelector<HTMLElement>('[data-gallery-stage]');
  const loading = root.querySelector<HTMLElement>('[data-gallery-loading]');
  const error = root.querySelector<HTMLElement>('[data-gallery-error]');
  const original = root.querySelector<HTMLAnchorElement>('[data-gallery-original]');
  const count = root.querySelector<HTMLElement>('[data-gallery-count]');
  if (!dialog || !image || !title || !category || !counter || !close || !previous || !next || !stage) return;

  const photos = [...root.querySelectorAll<HTMLAnchorElement>('[data-gallery-open]')].flatMap(anchor => {
    const card = anchor.closest<HTMLElement>('[data-gallery-card]');
    const width = Number(anchor.dataset.galleryWidth);
    const height = Number(anchor.dataset.galleryHeight);
    if (!card || !(width > 0) || !(height > 0)) return [];
    return [{ anchor, card, width, height, src: anchor.href, title: anchor.dataset.galleryTitle || 'Photo', category: anchor.dataset.galleryCategory || '', alt: anchor.dataset.galleryAlt || '' }];
  });
  if (!photos.length) return;
  root.dataset.galleryInitialized = 'true';

  const filters = [...root.querySelectorAll<HTMLButtonElement>('[data-gallery-filter]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let sequence: GalleryPhoto[] = [];
  let current = 0;
  let opener: HTMLElement | null = null;
  let savedOverflow: { value: string; priority: string } | null = null;
  let imageRequest = 0;
  let imageAnimation: Animation | undefined;
  let touch: { id: number; x: number; y: number; time: number } | null = null;
  let swiped = false;

  const visiblePhotos = () => photos.filter(photo => !photo.card.hidden);

  const showPhoto = (index: number) => {
    if (!sequence.length) return;
    current = (index + sequence.length) % sequence.length;
    const photo = sequence[current];
    const request = ++imageRequest;
    imageAnimation?.cancel();
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    image.src = photo.src;
    title.textContent = photo.title;
    category.textContent = photo.category;
    counter.textContent = `${current + 1} of ${sequence.length}`;
    dialog.dataset.galleryCurrentId = photo.anchor.dataset.galleryId || '';
    if (original) original.href = photo.src;
    if (loading) loading.hidden = false;
    if (error) error.hidden = true;
    previous.disabled = next.disabled = sequence.length < 2;
    image.decode().then(() => {
      if (request !== imageRequest || !dialog.open) return;
      if (loading) loading.hidden = true;
      if (!reducedMotion.matches) imageAnimation = image.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
    }).catch(() => {
      if (request !== imageRequest || !dialog.open) return;
      if (loading) loading.hidden = true;
      if (error) error.hidden = false;
    });
  };

  const restore = () => {
    ++imageRequest;
    imageAnimation?.cancel();
    touch = null;
    if (savedOverflow) {
      if (savedOverflow.value) document.body.style.setProperty('overflow', savedOverflow.value, savedOverflow.priority);
      else document.body.style.removeProperty('overflow');
      savedOverflow = null;
    }
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  };

  const openPhoto = (photo: GalleryPhoto) => {
    if (typeof dialog.showModal !== 'function') return false;
    sequence = visiblePhotos();
    const index = sequence.indexOf(photo);
    if (index < 0) return false;
    opener = photo.anchor;
    savedOverflow = { value: document.body.style.getPropertyValue('overflow'), priority: document.body.style.getPropertyPriority('overflow') };
    document.body.style.setProperty('overflow', 'hidden');
    try { dialog.showModal(); }
    catch { restore(); return false; }
    showPhoto(index);
    close.focus({ preventScroll: true });
    return true;
  };

  photos.forEach(photo => photo.anchor.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (openPhoto(photo)) event.preventDefault();
  }));

  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.galleryFilter || '';
    if (dialog.open) dialog.close();
    photos.forEach(photo => { photo.card.hidden = Boolean(selected && photo.category !== selected); });
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    const total = visiblePhotos().length;
    if (count) count.textContent = `${total} ${total === 1 ? 'photo' : 'photos'}${selected ? ` · ${selected}` : ''}`;
  }));
  const filterGroup = root.querySelector<HTMLElement>('[data-gallery-filters]');
  if (filterGroup) filterGroup.hidden = false;

  close.addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => showPhoto(current - 1));
  next.addEventListener('click', () => showPhoto(current + 1));
  dialog.addEventListener('close', restore);
  dialog.addEventListener('cancel', event => { event.preventDefault(); dialog.close(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  stage.addEventListener('click', event => {
    if (swiped) { swiped = false; return; }
    if (event.target === stage) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]')].filter(control => control.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    swiped = false;
    touch = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
  });
  stage.addEventListener('pointerup', event => {
    if (!touch || event.pointerId !== touch.id) return;
    const dx = event.clientX - touch.x;
    const dy = event.clientY - touch.y;
    const elapsed = performance.now() - touch.time;
    touch = null;
    if (elapsed < 1200 && Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      swiped = true;
      showPhoto(current + (dx < 0 ? 1 : -1));
    }
  });
  stage.addEventListener('pointercancel', () => { touch = null; });
  reducedMotion.addEventListener('change', event => { if (event.matches) imageAnimation?.cancel(); });
}
