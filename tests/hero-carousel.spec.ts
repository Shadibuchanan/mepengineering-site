import { test, expect } from '@playwright/test';

test('hero pagination dots select views and keyboard navigation wraps', async ({ page }) => {
  await page.goto('/');
  const steps = page.locator('[data-hero-step]');
  const status = page.locator('[data-hero-status]');
  await expect(page.locator('[data-hero-previous], [data-hero-next], [data-hero-count]')).toHaveCount(0);
  await expect(steps).toHaveCount(3);
  await expect(steps.first()).toHaveAttribute('aria-pressed', 'true');
  await steps.nth(1).click();
  await expect(page.locator('[data-hero-view-label]')).toHaveText('Lighting detail');
  await expect(steps.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.hero')).toHaveCSS('--hero-zoom', '1.2');
  await expect(status).toContainText('View 2 of 3');
  await page.keyboard.press('Home');
  await expect(steps.first()).toHaveAttribute('aria-pressed', 'true');
  await expect(steps.first()).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(steps.last()).toHaveAttribute('aria-pressed', 'true');
  await expect(status).toContainText('View 3 of 3');
  await page.keyboard.press('ArrowRight');
  await expect(steps.first()).toHaveAttribute('aria-pressed', 'true');
  await expect(status).toContainText('View 1 of 3');
  await page.keyboard.press('End');
  await expect(steps.last()).toHaveAttribute('aria-pressed', 'true');
  await expect(steps.last()).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(steps.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(steps.nth(1)).toBeFocused();
  await expect(page.locator('[data-hero-step][aria-pressed="true"]')).toHaveCount(1);
});

test('touch gestures change the view, and reduced motion disables the transition', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const hero = page.locator('.hero');
  const steps = page.locator('[data-hero-step]');
  await hero.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 1, clientX: 300, clientY: 400 });
  await hero.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 1, clientX: 120, clientY: 405 });
  await expect(steps.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-hero-status]')).toContainText('View 2 of 3');
  expect(await page.locator('[data-hero-view]').evaluate(view => parseFloat(getComputedStyle(view).transitionDuration))).toBeLessThan(.001);
  await hero.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 2, clientX: 200, clientY: 400 });
  await hero.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 2, clientX: 180, clientY: 150 });
  await expect(steps.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-hero-status]')).toContainText('View 2 of 3');
  await hero.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 3, clientX: 100, clientY: 400 });
  await hero.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 3, clientX: 300, clientY: 405 });
  await expect(steps.first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-hero-status]')).toContainText('View 1 of 3');
});

test('without JavaScript the photograph and links work and inactive controls are hidden', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/`);
  await expect(page.locator('[data-hero-controls]')).toBeHidden();
  await expect(page.locator('.hero__image')).toBeVisible();
  await page.locator('.hero__project').click();
  await expect(page).toHaveURL(/\/projects\/mayami-wynwood\/$/);
  await context.close();
});
