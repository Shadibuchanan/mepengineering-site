import { test, expect, type Page } from '@playwright/test';

interface RecordedMotion {
  target: Element;
  animation: Animation;
}

declare global {
  interface Window {
    __recordedMotion: RecordedMotion[];
  }
}

// Observe the browser's real WAAPI effects. Selected effects can be paused so
// assertions sample actual rendered interpolation without racing a short intro.
// The wrapper returns the original Animation; it never substitutes a mock.
async function recordMotion(page: Page, pauseSelector = ''): Promise<void> {
  await page.addInitScript((selector) => {
    window.__recordedMotion = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (keyframes, options) {
      const animation = animate.call(this, keyframes, options);
      window.__recordedMotion.push({ target: this, animation });
      if (selector && this.matches(selector)) animation.pause();
      return animation;
    };
  }, pauseSelector);
}

async function renderingFrames(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
}

async function revealFeaturedCards(page: Page): Promise<void> {
  await page.locator('.featured-grid').evaluate((grid) => {
    grid.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await expect.poll(() => page.evaluate(() => {
    return window.__recordedMotion.filter(({ target }) => target.matches('.featured-grid .project-card')).length;
  })).toBe(3);
}

test.describe('progressive motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });

  test('hero lines visibly interpolate, stagger, and finish without retained transforms', async ({ page }) => {
    await recordMotion(page, '[data-hero-line]');
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-hero-line]')).toHaveCount(2);
    await expect.poll(() => page.evaluate(() => {
      return window.__recordedMotion.filter(({ target }) => target.matches('[data-hero-line]')).length;
    })).toBe(2);

    const samples = await page.evaluate(async () => {
      const records = window.__recordedMotion.filter(({ target }) => target.matches('[data-hero-line]'));
      const delays = records.map(({ animation }) => Number(animation.effect!.getTiming().delay));
      const { target, animation } = records[0];
      const timing = animation.effect!.getTiming();
      const duration = Number(timing.duration);
      animation.currentTime = Number(timing.delay) + duration * 0.05;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const early = { opacity: Number(getComputedStyle(target).opacity), transform: getComputedStyle(target).transform };
      animation.currentTime = Number(timing.delay) + duration * 0.55;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const later = { opacity: Number(getComputedStyle(target).opacity), transform: getComputedStyle(target).transform };
      return { early, later, delays, duration };
    });

    expect(samples.duration).toBeGreaterThan(0);
    expect(samples.delays[1]).toBeGreaterThan(samples.delays[0]);
    expect(samples.early.opacity).toBeLessThan(samples.later.opacity);
    expect(samples.early.transform).not.toBe(samples.later.transform);

    await page.evaluate(async () => {
      const animations = window.__recordedMotion.filter(({ target }) => target.matches('[data-hero-line]')).map(record => record.animation);
      const finished = animations.map(animation => animation.finished);
      animations.forEach(animation => animation.play());
      await Promise.all(finished);
    });
    for (const line of await page.locator('[data-hero-line]').all()) {
      await expect(line).toHaveCSS('opacity', '1');
      await expect(line).toHaveCSS('transform', 'none');
    }
  });

  test('scrolling reveals the featured row once with stagger and leaves visible cards', async ({ page }) => {
    await recordMotion(page, '.featured-grid .project-card');
    await page.goto('/');
    await expect(page.locator('.featured-grid .project-card')).toHaveCount(3);
    expect(await page.evaluate(() => window.__recordedMotion.filter(({ target }) => target.matches('.featured-grid .project-card')).length)).toBe(0);

    await revealFeaturedCards(page);
    const delays = await page.evaluate(() => window.__recordedMotion
      .filter(({ target }) => target.matches('.featured-grid .project-card'))
      .map(({ animation }) => Number(animation.effect!.getTiming().delay)));
    expect(delays[1] - delays[0]).toBe(90);
    expect(delays[2] - delays[1]).toBe(90);

    await page.evaluate(async () => {
      const animations = window.__recordedMotion.filter(({ target }) => target.matches('.featured-grid .project-card')).map(record => record.animation);
      const finished = animations.map(animation => animation.finished);
      animations.forEach(animation => animation.play());
      await Promise.all(finished);
    });
    for (const card of await page.locator('.featured-grid .project-card').all()) {
      await expect(card).toHaveCSS('opacity', '1');
      await expect(card).toHaveCSS('transform', 'none');
    }

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await renderingFrames(page);
    await page.locator('.featured-grid').evaluate(grid => grid.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await renderingFrames(page);
    expect(await page.evaluate(() => window.__recordedMotion.filter(({ target }) => target.matches('.featured-grid .project-card')).length)).toBe(3);
  });

  test('reduced motion renders static content and never starts reveal or parallax effects', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await recordMotion(page);
    await page.goto('/');
    await expect(page.locator('#hero-title')).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top: 180, behavior: 'instant' }));
    await renderingFrames(page);
    const displacement = await page.locator('.hero__image[data-parallax-image]').evaluate(image => parseFloat(getComputedStyle(image).getPropertyValue('--parallax-y')) || 0);
    expect(displacement).toBe(0);

    await page.locator('.featured-grid').evaluate(grid => grid.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await renderingFrames(page);
    expect(await page.evaluate(() => window.__recordedMotion.length)).toBe(0);
    for (const target of await page.locator('[data-hero-line], .featured-grid .project-card').all()) {
      await expect(target).toHaveCSS('opacity', '1');
      await expect(target).toHaveCSS('transform', 'none');
    }
  });

  test('changing motion preference cancels active effects and resets desktop parallax', async ({ page }) => {
    await recordMotion(page, '[data-hero-line]');
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => window.__recordedMotion.some(({ target, animation }) => target.matches('[data-hero-line]') && animation.playState === 'paused'))).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: 180, behavior: 'instant' }));
    await expect.poll(() => page.locator('.hero__image[data-parallax-image]').evaluate(image => Math.abs(parseFloat(getComputedStyle(image).getPropertyValue('--parallax-y')) || 0))).toBeGreaterThan(0);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect.poll(() => page.evaluate(() => window.__recordedMotion.filter(({ animation }) => animation.playState === 'running' || animation.playState === 'paused').length)).toBe(0);
    await expect.poll(() => page.locator('.hero__image[data-parallax-image]').evaluate(image => parseFloat(getComputedStyle(image).getPropertyValue('--parallax-y')) || 0)).toBe(0);
    for (const line of await page.locator('[data-hero-line]').all()) {
      await expect(line).toHaveCSS('opacity', '1');
      await expect(line).toHaveCSS('transform', 'none');
    }
    const callCount = await page.evaluate(() => window.__recordedMotion.length);
    await page.locator('.featured-grid').evaluate(grid => grid.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await renderingFrames(page);
    expect(await page.evaluate(() => window.__recordedMotion.length)).toBe(callCount);
    await expect(page.locator('.featured-grid .project-card').first()).toHaveCSS('opacity', '1');
  });

  test('keyboard focus interrupts a card reveal immediately and exposes its link', async ({ page }) => {
    await recordMotion(page, '.featured-grid .project-card');
    await page.goto('/');
    await revealFeaturedCards(page);
    await page.evaluate(async () => {
      const { animation } = window.__recordedMotion.find(({ target }) => target.matches('.featured-grid .project-card'))!;
      const timing = animation.effect!.getTiming();
      animation.currentTime = Number(timing.delay) + Number(timing.duration) * 0.15;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    const card = page.locator('.featured-grid .project-card').first();
    expect(await card.evaluate(target => Number(getComputedStyle(target).opacity))).toBeLessThan(1);

    await page.locator('.selected-projects .section-heading a').focus();
    await page.keyboard.press('Tab');
    await expect(card.locator('a')).toBeFocused();
    await expect(card).toHaveCSS('opacity', '1');
    await expect(card).toHaveCSS('transform', 'none');
    expect(await card.evaluate(target => target.getAnimations().filter(animation => animation.playState === 'running' || animation.playState === 'paused').length)).toBe(0);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/projects/mayami-wynwood/');
  });
});

test.describe('motion with JavaScript unavailable', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });

  test('home content stays visible and both section and project anchors work', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero-title')).toBeVisible();
    for (const line of await page.locator('[data-hero-line]').all()) {
      await expect(line).toHaveCSS('opacity', '1');
      await expect(line).toHaveCSS('transform', 'none');
    }
    await page.locator('a[href="#introduction"]').click();
    await expect(page).toHaveURL(/\/#introduction$/);
    await expect(page.locator('#introduction')).toBeInViewport();

    const card = page.locator('.featured-grid .project-card').first();
    // Use the keyboard for this second native anchor, avoiding an actionability
    // stability check while the preceding CSS smooth hash scroll is finishing.
    await card.locator('a').focus();
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS('opacity', '1');
    await expect(card).toHaveCSS('transform', 'none');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/projects/mayami-wynwood/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Mayami Wynwood');
  });
});
