import { test, expect, type Page, type Route } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';

// Run against an isolated static build with PUBLIC_FORMSPREE_ID=reviewtest.
// Every external request is blocked; Formspree is always locally intercepted.
const qaOrigin = 'http://127.0.0.1:4322';
const formEndpoint = 'https://formspree.io/f/reviewtest';
const fixture = {
  name: 'Jordan Example',
  email: 'jordan@example.com',
  company: 'Example Studio',
  phone: '555-0100',
  city: 'Margate',
  message: 'We are planning a restaurant renovation and need coordinated MEP plans.',
};

test.use({ baseURL: qaOrigin });

test.beforeEach(async ({ page }) => {
  await mkdir('qa', { recursive: true });
  await page.route('**/*', async (route) => {
    if (new URL(route.request().url()).origin === qaOrigin) await route.continue();
    else await route.abort('blockedbyclient');
  });
});

async function fulfill(route: Route, status = 200): Promise<void> {
  await route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(status === 200 ? { ok: true } : { errors: [{ message: 'Test rejection' }] }),
  });
}

async function fillInquiry(page: Page): Promise<void> {
  await page.getByLabel('Full name').fill(fixture.name);
  await page.getByLabel('Email address').fill(fixture.email);
  await page.getByLabel('Company').fill(fixture.company);
  await page.getByLabel('Phone', { exact: false }).fill(fixture.phone);
  await page.getByLabel('Project type').selectOption('Restaurant / hospitality');
  await page.getByLabel('Project city').fill(fixture.city);
  await page.getByLabel('About the project').fill(fixture.message);
}

async function expectPreservedValues(page: Page): Promise<void> {
  await expect(page.getByLabel('Full name')).toHaveValue(fixture.name);
  await expect(page.getByLabel('Email address')).toHaveValue(fixture.email);
  await expect(page.getByLabel('Company')).toHaveValue(fixture.company);
  await expect(page.getByLabel('Phone', { exact: false })).toHaveValue(fixture.phone);
  await expect(page.getByLabel('Project type')).toHaveValue('Restaurant / hospitality');
  await expect(page.getByLabel('Project city')).toHaveValue(fixture.city);
  await expect(page.getByLabel('About the project')).toHaveValue(fixture.message);
}

test('native validation blocks empty required fields and malformed email', async ({ page }) => {
  let requests = 0;
  await page.route(formEndpoint, async (route) => { requests += 1; await fulfill(route); });
  await page.goto('/contact/');
  const send = page.getByRole('button', { name: 'Send inquiry' });
  await expect(send).toBeEnabled();
  await send.click();
  await expect(page.getByLabel('Full name')).toBeFocused();
  expect(await page.getByLabel('Full name').evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await page.getByLabel('Full name').fill(fixture.name);
  await page.getByLabel('Email address').fill('invalid-email');
  await send.click();
  await expect(page.getByLabel('Email address')).toBeFocused();
  expect(await page.getByLabel('Email address').evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await page.getByLabel('Email address').fill(fixture.email);
  await send.click();
  await expect(page.getByLabel('About the project')).toBeFocused();
  expect(requests).toBe(0);
  await expect(page.locator('[data-form-status]')).toBeEmpty();
});

test('successful submission sends the complete payload and announces confirmation', async ({ page }) => {
  let submittedBody = '';
  let requests = 0;
  await page.route(formEndpoint, async (route) => {
    requests += 1;
    expect(route.request().method()).toBe('POST');
    submittedBody = route.request().postData() ?? '';
    await fulfill(route);
  });
  await page.goto('/contact/?service=Kitchen%20Hoods');
  await fillInquiry(page);
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  const status = page.getByRole('status');
  await expect(status).toHaveAttribute('data-state', 'success');
  await expect(status).toContainText('Your inquiry has been sent');
  await expect(status).toBeFocused();
  await expect(status).toHaveAttribute('aria-live', 'polite');
  await expect(status).toHaveAttribute('aria-atomic', 'true');
  expect(requests).toBe(1);
  for (const value of Object.values(fixture)) expect(submittedBody).toContain(value);
  expect(submittedBody).toContain('Kitchen Hoods');
  expect(submittedBody).toContain('name="_gotcha"');
  await expect(page.getByLabel('Full name')).toHaveValue('');
  await expect(page.getByLabel('Email address')).toHaveValue('');
  await expect(page.getByLabel('About the project')).toHaveValue('');
  await expect(page.locator('[data-requested-service]')).toHaveValue('Kitchen Hoods');
  await expect(page.getByRole('button', { name: 'Send inquiry' })).toBeEnabled();
  await page.locator('#inquiry').screenshot({ path: 'qa/contact-success.png' });
});

test('HTTP rejection preserves the inquiry and permits a successful retry', async ({ page }) => {
  let requests = 0;
  await page.route(formEndpoint, async (route) => { requests += 1; await fulfill(route, requests === 1 ? 422 : 200); });
  await page.goto('/contact/');
  await fillInquiry(page);
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  const status = page.getByRole('status');
  await expect(status).toHaveAttribute('data-state', 'error');
  await expect(status).toContainText('Your details are still here');
  await expect(status).toBeFocused();
  await expectPreservedValues(page);
  await expect(page.getByRole('button', { name: 'Send inquiry' })).toBeEnabled();
  await page.locator('#inquiry').screenshot({ path: 'qa/contact-error.png' });
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(status).toHaveAttribute('data-state', 'success');
  expect(requests).toBe(2);
});

test('network failure preserves all entered details and restores the submit button', async ({ page }) => {
  await page.route(formEndpoint, (route) => route.abort('internetdisconnected'));
  await page.goto('/contact/');
  await fillInquiry(page);
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('status')).toHaveAttribute('data-state', 'error');
  await expectPreservedValues(page);
  await expect(page.getByRole('button', { name: 'Send inquiry' })).toBeEnabled();
  await expect(page.locator('[data-contact-form]')).not.toHaveAttribute('aria-busy');
});

test('pending request blocks duplicate submission and timeout restores the form', async ({ page }) => {
  await page.clock.install();
  let requests = 0;
  let releaseRequest: (() => void) | undefined;
  await page.route(formEndpoint, async (route) => {
    requests += 1;
    await new Promise<void>((resolve) => { releaseRequest = resolve; });
    await route.abort('timedout').catch(() => {});
  });
  await page.goto('/contact/');
  await fillInquiry(page);
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('button', { name: 'Sending' })).toBeDisabled();
  await expect(page.locator('[data-contact-form]')).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('status')).toHaveAttribute('data-state', 'sending');
  await expect.poll(() => requests).toBe(1);
  await page.locator('[data-contact-form]').evaluate((form: HTMLFormElement) => form.requestSubmit());
  expect(requests).toBe(1);
  await page.clock.fastForward(15100);
  await expect(page.getByRole('status')).toHaveAttribute('data-state', 'error');
  await expect(page.getByRole('status')).toContainText('confirm delivery');
  await expectPreservedValues(page);
  await expect(page.getByRole('button', { name: 'Send inquiry' })).toBeEnabled();
  await expect(page.locator('[data-contact-form]')).not.toHaveAttribute('aria-busy');
  releaseRequest?.();
});

test('configured mobile form has no overflow or automated accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contact/');
  await expect(page.getByRole('button', { name: 'Send inquiry' })).toBeEnabled();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.screenshot({ path: 'qa/contact-configured-mobile.png', fullPage: true });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('configured form retains native POST submission and fallback guidance', async ({ page }) => {
    let requests = 0;
    await page.route(formEndpoint, async (route) => {
      requests += 1;
      expect(route.request().method()).toBe('POST');
      expect(route.request().postData()).toContain('jordan%40example.com');
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Mock confirmation</title><h1>Local test confirmation</h1>' });
    });
    await page.goto('/contact/');
    // Playwright's text matcher excludes noscript content. Inspect its HTML,
    // then verify that disabling scripts leaves the native POST functional.
    expect(await page.locator('noscript').innerHTML()).toContain('Submitting this form will open a confirmation page.');
    await fillInquiry(page);
    await page.getByRole('button', { name: 'Send inquiry' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Local test confirmation' })).toBeVisible();
    expect(requests).toBe(1);
  });
});
