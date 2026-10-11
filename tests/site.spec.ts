import { test, expect } from '@playwright/test';

test('portfolio filters, location search, reset, and directory-only sectors work', async ({ page }) => {
  await page.goto('/projects/');
  await expect(page.locator('.portfolio-grid .project-card:visible')).toHaveCount(14);
  await page.getByRole('button', { name: 'Retail', exact: true }).click();
  await expect(page.locator('.portfolio-grid .project-card:visible')).toHaveCount(1);
  await expect(page.locator('.portfolio-grid')).toContainText('Grieco Mazda');
  await expect(page).toHaveURL(/sector=Retail/);
  await page.getByRole('button', { name: 'All projects', exact: true }).click();
  await page.getByRole('searchbox').fill('Sarasota');
  await expect(page.locator('.portfolio-grid .project-card:visible')).toHaveCount(1);
  await expect(page.locator('.portfolio-grid .project-card:visible')).toContainText('Foxtail');
  await page.getByRole('searchbox').fill('not-a-real-project');
  await expect(page.getByRole('heading', { name: 'No matching projects.' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.portfolio-grid .project-card:visible')).toHaveCount(14);
  await page.getByRole('button', { name: 'Residential', exact: true }).click();
  await expect(page.locator('.directory-row:visible')).toHaveCount(1);
  await expect(page.locator('.directory-row:visible')).toContainText('The Trail Lofts');
  await expect(page.locator('#no-results')).toBeHidden();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Residential', exact: true })).toHaveAttribute('aria-pressed','true');
});

test('archive experience participates in search, sector filters, and URL restoration', async ({ page }) => {
  await page.goto('/projects/');
  const search = page.getByRole('searchbox');
  await search.fill('Smoothie King');
  await expect(page.locator('.legacy-entry:visible')).toHaveCount(1);
  await expect(page.locator('.legacy-entry:visible')).toContainText('Smoothie King');
  await expect(page.locator('.directory-table')).toBeHidden();
  await expect(page.locator('#project-results')).toContainText('1 directory entry');
  await expect(page.locator('#no-results')).toBeHidden();
  await page.reload();
  await expect(search).toHaveValue('Smoothie King');
  await expect(page.locator('.legacy-entry:visible')).toHaveCount(1);
  await search.fill('');
  await page.getByRole('button', { name: 'Civic', exact: true }).click();
  await expect(page.locator('.legacy-entry:visible')).toHaveCount(2);
  await expect(page.locator('.legacy-grid')).toContainText('Deerfield Beach Facade Improvements');
  await page.getByRole('button', { name: 'All projects', exact: true }).click();
  await search.fill('FedEx');
  await expect(page.locator('.legacy-entry:visible')).toHaveCount(1);
  await search.fill('Sarasota');
  await expect(page.locator('.legacy-experience')).toBeHidden();
  await expect(page.locator('.directory-row:visible')).toContainText('Foxtail');
  await search.fill('');
  await page.getByRole('button', { name: 'Residential', exact: true }).click();
  await expect(page.locator('.directory-row:visible')).toContainText('The Trail Lofts');
  await expect(page.locator('.legacy-entry:visible')).toHaveCount(9);
  await expect(page.locator('#project-results')).toContainText('10 directory entries');
});

test('mobile menu opens, closes with Escape, and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button',{ name:'Open navigation' });
  await toggle.click();
  await expect(page.getByRole('navigation',{ name:'Mobile navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation',{ name:'Mobile navigation' })).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole('navigation',{ name:'Mobile navigation' }).getByRole('link',{ name:'Projects' }).click();
  await expect(page).toHaveURL('/projects/');
});

test('featured project and service navigation reach complete pages', async ({ page }) => {
  await page.goto('/');
  await page.locator('.featured-grid a').first().click();
  await expect(page.getByRole('heading',{level:1})).toContainText('Mayami Wynwood');
  await expect(page.locator('.project-facts')).toContainText('JPC Projects Miami');
  await page.goto('/services/');
  await page.locator('a[href="/services/mechanical/"]').first().click();
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await expect(page).toHaveURL('/services/mechanical/');
});

test('contact remains honest and inert without a Formspree ID', async ({ page }) => {
  let sent = 0;
  await page.route('https://formspree.io/**', async route => { sent++; await route.abort(); });
  await page.goto('/contact/');
  await expect(page.locator('[data-submit-button]')).toBeDisabled();
  await expect(page.locator('.form-unavailable')).toContainText('please email or call');
  await expect(page.locator('.form-unavailable a[href="mailto:info@mepengineers.com"]')).toBeVisible();
  await page.locator('[data-contact-form]').evaluate(form => form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  expect(sent).toBe(0);
  await expect(page.locator('[data-form-status]')).toBeEmpty();
});

for (const width of [360,390,768,1024,1440]) {
  test(`key pages fit at ${width}px with no missing images or runtime errors`, async ({ page }) => {
    await page.setViewportSize({width,height:900});
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of ['/','/projects/','/projects/mayami-wynwood/','/services/','/services/mechanical/','/about/','/contact/']) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => Array.from(document.images).filter(img => img.complete && img.naturalWidth === 0).map(img => img.src)),path).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}
