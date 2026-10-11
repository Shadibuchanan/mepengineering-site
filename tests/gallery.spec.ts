import { test, expect, type Locator, type Page } from '@playwright/test';

async function visibleHomeStrip(page: Page) {
  await page.goto('/');
  const strip = page.locator('[data-gallery-strip]');
  await expect(strip).toHaveAttribute('data-strip-ready', 'true');
  await page.evaluate(() => document.fonts.ready);
  const scroller = strip.locator('[data-gallery-scroll]');
  await strip.scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  return {
    strip,
    scroller,
    left: strip.locator('[data-strip-direction="left"]'),
    right: strip.locator('[data-strip-direction="right"]'),
  };
}

async function expectRightwardMotion(scroller: Locator) {
  const start = await scroller.evaluate(element => element.scrollLeft);
  await expect.poll(() => scroller.evaluate(element => element.scrollLeft)).toBeLessThan(start - 3);
}

async function expectStationary(scroller: Locator) {
  const start = await scroller.evaluate(element => element.scrollLeft);
  // Observe a real interval; a paused dataset alone does not prove motion stopped.
  await scroller.page().waitForTimeout(300);
  expect(Math.abs(await scroller.evaluate(element => element.scrollLeft) - start)).toBeLessThanOrEqual(1);
}

async function stripGeometry(strip: Locator) {
  return strip.evaluate(element => {
    const cards = element.querySelectorAll('[data-gallery-card]');
    const first = cards[0].getBoundingClientRect();
    return {
      step: cards[1].getBoundingClientRect().left - first.left,
      period: element.querySelector('[data-gallery-clone]')!.getBoundingClientRect().left - first.left,
    };
  });
}

async function expectLoopPosition(scroller: Locator, target: number, period: number) {
  await expect.poll(() => scroller.evaluate((element, expected) => {
    const difference = Math.abs(element.scrollLeft - expected.target) % expected.period;
    return Math.min(difference, expected.period - difference);
  }, { target, period })).toBeLessThanOrEqual(2);
}

async function clickVisibleArrow(button: Locator) {
  const bounds = await button.boundingBox();
  expect(bounds).not.toBeNull();
  // A real pointer click avoids locator.click scrolling the hovered controls again.
  await button.page().mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
}

test('gallery filter determines the lightbox sequence and restores focus and scrolling', async ({ page }) => {
  await page.goto('/gallery/');
  const gallery = page.locator('[data-photo-gallery]');
  await expect(gallery).toHaveAttribute('data-gallery-initialized', 'true');
  const total = await gallery.locator('[data-gallery-card]').count();
  expect(total).toBeGreaterThan(6);
  const category = gallery.locator('[data-gallery-filter]').nth(1);
  const categoryName = await category.getAttribute('data-gallery-filter');
  await category.click();
  await expect(category).toHaveAttribute('aria-pressed', 'true');
  const visible = gallery.locator('[data-gallery-card]:visible [data-gallery-open]');
  const selectedCount = await visible.count();
  expect(selectedCount).toBeGreaterThan(0);
  expect(selectedCount).toBeLessThan(total);
  await expect(gallery.locator('[data-gallery-count]')).toContainText(`${selectedCount} photo`);
  const expected = await visible.evaluateAll(anchors => anchors.map(anchor => ({ id: (anchor as HTMLElement).dataset.galleryId, title: (anchor as HTMLElement).dataset.galleryTitle })));
  await page.evaluate(() => { document.body.style.overflow = 'auto'; });
  await visible.first().click();
  const dialog = gallery.locator('[data-gallery-dialog]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-gallery-current-title]')).toHaveText(expected[0].title!);
  await expect(dialog.locator('[data-gallery-current-category]')).toHaveText(categoryName!);
  await expect(dialog.locator('[data-gallery-counter]')).toHaveText(`1 of ${selectedCount}`);
  await expect(dialog.locator('[data-gallery-close]')).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  if (selectedCount > 1) {
    await page.keyboard.press('ArrowRight');
    await expect(dialog).toHaveAttribute('data-gallery-current-id', expected[1].id!);
    await page.keyboard.press('ArrowLeft');
    await expect(dialog).toHaveAttribute('data-gallery-current-id', expected[0].id!);
    await dialog.locator('[data-gallery-previous]').click();
    await expect(dialog).toHaveAttribute('data-gallery-current-id', expected.at(-1)!.id!);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(visible.first()).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('auto');
  await gallery.getByRole('button', { name: 'All photos', exact: true }).click();
  await expect(gallery.locator('[data-gallery-card]:visible')).toHaveCount(total);
});

test('viewer keeps keyboard focus inside, caps intrinsic photo size and dismisses on the backdrop', async ({ page }) => {
  await page.goto('/gallery/');
  const opener = page.locator('[data-gallery-open]').first();
  await opener.click();
  const dialog = page.locator('[data-gallery-dialog]');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator('[data-gallery-next]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.locator('[data-gallery-close]')).toBeFocused();
  await expect.poll(() => dialog.locator('[data-gallery-current-image]').evaluate(img => (img as HTMLImageElement).complete)).toBe(true);
  const dimensions = await dialog.locator('[data-gallery-current-image]').evaluate(img => {
    const image = img as HTMLImageElement;
    const bounds = image.getBoundingClientRect();
    return { width: bounds.width, height: bounds.height, sourceWidth: image.naturalWidth, sourceHeight: image.naturalHeight };
  });
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.sourceWidth + 1);
  expect(dimensions.height).toBeLessThanOrEqual(dimensions.sourceHeight + 1);
  await page.mouse.click(1, 1);
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('gallery remains a collection of working full-image links without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/gallery/`);
  await expect(page.locator('[data-gallery-filters]')).toBeHidden();
  const cards = page.locator('[data-gallery-card]');
  expect(await cards.count()).toBeGreaterThan(6);
  await expect(page.locator('[data-gallery-card]:visible')).toHaveCount(await cards.count());
  const link = page.locator('[data-gallery-open]').first();
  const href = await link.getAttribute('href');
  expect(href).toMatch(/\.(webp|avif|jpg|png)(?:\?|$)/);
  await link.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
  await context.close();
});

test('mobile gallery supports swipe navigation and closes without horizontal overflow', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${baseURL}/gallery/`);
  const links = page.locator('[data-gallery-open]');
  const secondId = await links.nth(1).getAttribute('data-gallery-id');
  await links.first().tap();
  const dialog = page.locator('[data-gallery-dialog]');
  await expect(dialog).toBeVisible();
  const stage = dialog.locator('[data-gallery-stage]');
  await stage.dispatchEvent('pointerdown', { pointerType: 'touch', isPrimary: true, pointerId: 7, clientX: 290, clientY: 400 });
  await stage.dispatchEvent('pointerup', { pointerType: 'touch', isPrimary: true, pointerId: 7, clientX: 100, clientY: 405 });
  await expect(dialog).toHaveAttribute('data-gallery-current-id', secondId!);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.setViewportSize({ width: 667, height: 375 });
  await dialog.locator('[data-gallery-current-image]').evaluate(img => (img as HTMLImageElement).decode());
  const rotated = await dialog.locator('[data-gallery-current-image]').evaluate(element => {
    const img = element as HTMLImageElement;
    const bounds = img.getBoundingClientRect();
    const stage = img.parentElement!.getBoundingClientRect();
    return { fits: bounds.left >= stage.left && bounds.right <= stage.right && bounds.top >= stage.top && bounds.bottom <= stage.bottom, ratio: bounds.width / bounds.height, sourceRatio: img.naturalWidth / img.naturalHeight };
  });
  expect(rotated.fits).toBe(true);
  expect(rotated.ratio).toBeCloseTo(rotated.sourceRatio, 2);
  await dialog.locator('[data-gallery-close]').tap();
  await expect(dialog).not.toBeVisible();
  await expect(links.first()).toBeFocused();
  await context.close();
});

test('homepage strip precedes Recent Projects and both original and cloned photos use the same viewer', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const { strip, scroller } = await visibleHomeStrip(page);
  const homeUrl = page.url();
  await expect(strip).toHaveCount(1);
  await expect(strip.locator('[data-gallery-open]')).toHaveCount(48);
  await expect(strip.locator('[data-gallery-filter]')).toHaveCount(0);
  await expect(strip.locator('[data-strip-toggle]')).toHaveCount(0);
  await expect(page.locator('.home-gallery a[href="/gallery/"]')).toHaveCount(0);
  await expect(page.locator('.home-gallery')).toHaveAttribute('id', 'photo-gallery');
  await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Photo gallery' })).toHaveAttribute('href', '/#photo-gallery');
  expect(await scroller.evaluate(element => getComputedStyle(element).scrollbarWidth)).toBe('none');
  expect(await strip.locator('[data-gallery-card] figcaption').first().evaluate(element => getComputedStyle(element).textAlign)).toBe('center');
  expect(await page.locator('.home-gallery').evaluate(section => {
    const projects = document.querySelector('.selected-projects');
    return Boolean(projects && (section.compareDocumentPosition(projects) & Node.DOCUMENT_POSITION_FOLLOWING));
  })).toBe(true);

  const original = strip.locator('[data-gallery-open]').first();
  const id = await original.getAttribute('data-gallery-id');
  await scroller.hover();
  await original.click();
  const dialog = strip.locator('[data-gallery-dialog]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('data-gallery-current-id', id!);
  await expect(dialog.locator('[data-gallery-counter]')).toHaveText('1 of 48');
  await expect(page).toHaveURL(homeUrl);
  await dialog.locator('[data-gallery-close]').click();
  await expect(dialog).not.toBeVisible();
  await expect(original).toBeFocused();

  const clone = strip.locator('[data-gallery-clone] a').first();
  await scroller.hover();
  await clone.scrollIntoViewIfNeeded();
  await expect(clone).toBeInViewport();
  await clone.click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('data-gallery-current-id', id!);
  await expect(dialog.locator('[data-gallery-counter]')).toHaveText('1 of 48');
  await expect(page).toHaveURL(homeUrl);
  await dialog.locator('[data-gallery-close]').click();
  await expect(dialog).not.toBeVisible();
  await expect(scroller).toBeFocused();

  await page.goto('/projects/');
  await expect(page.locator('a[href="/gallery/"]')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Photo gallery' })).toHaveAttribute('href', '/#photo-gallery');
});

test('strip moves gently through hover, highlights photos, and pauses for keyboard focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const { strip, scroller } = await visibleHomeStrip(page);
  await expect(strip).toHaveAttribute('data-strip-playing', 'true');
  // Measure actual movement over browser frames, including a possible loop seam.
  const { period } = await stripGeometry(strip);
  const pixelsPerSecond = await scroller.evaluate((element, loopWidth) => new Promise<number>(resolve => {
    let previous = element.scrollLeft;
    let distance = 0;
    let started = 0;
    const sample = (time: number) => {
      if (!started) started = time;
      const current = element.scrollLeft;
      let delta = previous - current;
      if (delta < -loopWidth / 2) delta += loopWidth;
      if (delta > loopWidth / 2) delta -= loopWidth;
      distance += delta;
      previous = current;
      if (time - started >= 600) resolve(distance / ((time - started) / 1000));
      else requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }), period);
  expect(pixelsPerSecond).toBeGreaterThan(25);
  expect(pixelsPerSecond).toBeLessThan(60);

  await scroller.hover();
  await expect(strip).toHaveAttribute('data-strip-playing', 'true');
  await expectRightwardMotion(scroller);
  const photo = await strip.locator('.gallery-photo').evaluateAll(anchors => {
    const index = anchors.findIndex(anchor => {
      const bounds = anchor.getBoundingClientRect();
      return bounds.left > 80 && bounds.right < innerWidth - 80 && bounds.top >= 0 && bounds.bottom <= innerHeight;
    });
    const bounds = anchors[index].getBoundingClientRect();
    return { index, x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  });
  await page.mouse.move(photo.x, photo.y);
  await expect(strip.locator('.gallery-photo').nth(photo.index)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -3)');
  await expect(strip.locator('.gallery-photo').nth(photo.index).locator('img')).toHaveCSS('filter', 'brightness(1.08)');
  await expect(strip).toHaveAttribute('data-strip-playing', 'true');
  await expectRightwardMotion(scroller);
  await page.mouse.move(1, 1);
  await expect(strip).toHaveAttribute('data-strip-playing', 'true');
  await expectRightwardMotion(scroller);

  await scroller.focus();
  await expect(strip).toHaveAttribute('data-strip-playing', 'false');
  await expectStationary(scroller);
  await scroller.evaluate(element => (element as HTMLElement).blur());
  await expect(strip).toHaveAttribute('data-strip-playing', 'true');
  await expectRightwardMotion(scroller);
});

test('arrows advance one photo, wrap at both ends and allow playback with pointer focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const { strip, scroller, left, right } = await visibleHomeStrip(page);
  await expect(left).toBeVisible();
  await expect(right).toBeVisible();
  await expect(strip.locator('[data-strip-toggle]')).toHaveCount(0);
  await expect(strip).toHaveAttribute('data-strip-playing', 'false');
  await left.hover();
  await expect(strip).toHaveAttribute('data-strip-playing', 'false');
  const { step, period } = await stripGeometry(strip);
  const start = await scroller.evaluate(element => element.scrollLeft);
  await clickVisibleArrow(left);
  await expectLoopPosition(scroller, start - step, period);
  await expectStationary(scroller);
  await clickVisibleArrow(right);
  await expectLoopPosition(scroller, start, period);

  // Native scrolling can reach either seam before the next arrow interaction.
  await scroller.evaluate(async element => {
    element.scrollLeft = 0;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  await clickVisibleArrow(left);
  await expectLoopPosition(scroller, period - step, period);
  await scroller.evaluate(async (element, loopWidth) => {
    element.scrollLeft = loopWidth - 1;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  }, period);
  await clickVisibleArrow(right);
  await expectLoopPosition(scroller, step - 1, period);
  await expect(strip).toHaveAttribute('data-strip-paused', 'true');
  await expect(strip).toHaveAttribute('data-strip-playing', 'false');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(strip).toHaveAttribute('data-strip-playing', 'true');
  await expectRightwardMotion(scroller);
  await page.mouse.move(1, 1);
  await expect(right).toBeFocused();
  await expect(strip).toHaveAttribute('data-strip-playing', 'true');
  await expectRightwardMotion(scroller);
});

test('keyboard-focused arrows advance photos while automatic motion remains paused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const { strip, scroller, left, right } = await visibleHomeStrip(page);
  await left.focus();
  await page.keyboard.press('Tab');
  await expect(right).toBeFocused();
  await expect(strip).toHaveAttribute('data-strip-playing', 'false');
  await expectStationary(scroller);
  const { step, period } = await stripGeometry(strip);
  const start = await scroller.evaluate(element => element.scrollLeft);
  await page.keyboard.press('Space');
  await expectLoopPosition(scroller, start + step, period);
  await expect(right).toBeFocused();
  await expect(strip).toHaveAttribute('data-strip-playing', 'false');
  await expectStationary(scroller);
  await page.keyboard.press('Shift+Tab');
  await expect(left).toBeFocused();
  await page.keyboard.press('Enter');
  await expectLoopPosition(scroller, start, period);
  await expect(strip).toHaveAttribute('data-strip-playing', 'false');
  await expectStationary(scroller);
});

test('reduced motion uses immediate arrows and native scrolling, with automatic preference recovery', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const { strip, scroller, left, right } = await visibleHomeStrip(page);
  await expect(strip).toHaveAttribute('data-strip-paused', 'true');
  await expect(strip).toHaveAttribute('data-strip-playing', 'false');
  await expect(strip.locator('[data-strip-toggle]')).toHaveCount(0);
  await expectStationary(scroller);
  const initial = await scroller.evaluate(element => element.scrollLeft);
  const { step, period } = await stripGeometry(strip);
  await right.click();
  expect(await scroller.evaluate(element => element.scrollLeft)).toBeCloseTo(initial + step, 0);
  await left.click();
  const returned = await scroller.evaluate(element => element.scrollLeft);
  expect(Math.min(Math.abs(returned - initial), Math.abs(returned - initial - period))).toBeLessThanOrEqual(1);
  await left.click();
  expect(await scroller.evaluate(element => element.scrollLeft)).toBeCloseTo(period - step, 0);
  await right.click();
  await expectLoopPosition(scroller, initial, period);
  await scroller.hover();
  const beforeWheel = await scroller.evaluate(element => element.scrollLeft);
  await page.mouse.wheel(500, 0);
  await expect.poll(() => scroller.evaluate(element => element.scrollLeft)).toBeGreaterThan(beforeWheel + 100);
  await page.mouse.move(1, 1);
  await expect(strip).toHaveAttribute('data-strip-paused', 'true');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(strip).toHaveAttribute('data-strip-paused', 'false');
  await expect(strip).toHaveAttribute('data-strip-playing', 'true');
  await expectRightwardMotion(scroller);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(strip).toHaveAttribute('data-strip-paused', 'true');
  await expect(strip).toHaveAttribute('data-strip-playing', 'false');
  await expectStationary(scroller);
});

test('without JavaScript the homepage has all 48 photos in a native horizontal strip', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  const strip = page.locator('[data-gallery-strip]');
  await expect(strip.locator('[data-gallery-card] img')).toHaveCount(48);
  await expect(strip.locator('[data-gallery-open]')).toHaveCount(48);
  await expect(strip.locator('[data-gallery-clone]')).toHaveCount(0);
  await expect(strip.locator('[data-strip-toggle]')).toHaveCount(0);
  await expect(strip.locator('[data-strip-direction]')).toHaveCount(2);
  await expect(strip.locator('[data-strip-direction="left"]')).toBeHidden();
  await expect(strip.locator('[data-strip-direction="right"]')).toBeHidden();
  const scroller = strip.locator('[data-gallery-scroll]');
  await scroller.scrollIntoViewIfNeeded();
  const dimensions = await scroller.evaluate(element => ({ width: element.clientWidth, scrollWidth: element.scrollWidth, overflow: getComputedStyle(element).overflowX }));
  expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.width * 2);
  expect(dimensions.overflow).toBe('auto');
  expect(await scroller.evaluate(element => getComputedStyle(element).scrollbarWidth)).toBe('none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await scroller.hover();
  await page.mouse.wheel(500, 0);
  await expect.poll(() => scroller.evaluate(element => element.scrollLeft)).toBeGreaterThan(100);
  await context.close();
});
