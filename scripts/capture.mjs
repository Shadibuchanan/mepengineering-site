import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('qa', { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const reports = [];
for (const [name, path, width, height] of [
  ['home-desktop', '/', 1440, 1000],
  ['home-mobile', '/', 390, 844],
  ['projects-desktop', '/projects/', 1440, 1000],
  ['project-desktop', '/projects/mayami-wynwood/', 1440, 1000],
  ['contact-mobile', '/contact/', 390, 844],
  ['services-desktop', '/services/', 1440, 1000],
  ['about-mobile', '/about/', 390, 844],
]) {
  // Capture settled layouts; tests/motion.spec.ts exercises active animations.
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push({ page: name, message: error.message }));
  await page.goto(`http://127.0.0.1:4321${path}`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images).map(async img => { img.loading = 'eager'; try { await img.decode(); } catch {} })); });
  await page.screenshot({ path: `qa/${name}.png`, fullPage: true });
  const dimensions = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, brokenImages: Array.from(document.images).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src) }));
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  reports.push({ name, dimensions, violations: audit.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
  await context.close();
}
await browser.close();
await writeFile('qa/browser-report.json', JSON.stringify({ errors, reports }, null, 2));
console.log(JSON.stringify({ errors, reports }, null, 2));
