import { readdir, readFile, access } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
const errors = [];
let linksChecked = 0;
async function walk(dir) { const entries = await readdir(dir, { withFileTypes: true }); return (await Promise.all(entries.map(e => e.isDirectory() ? walk(join(dir, e.name)) : join(dir, e.name)))).flat(); }
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const pages = new Map(await Promise.all(htmlFiles.map(async file => [file, await readFile(file, 'utf8')])));
const exists = async path => { try { await access(path); return true; } catch { return false; } };
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

for (const [file, html] of pages) {
  const label = relative(root, file);
  const pageUrl = new URL(label.replaceAll('\\', '/').replace(/index\.html$/, ''), 'https://www.mepengineers.com/');
  if (!/<html[^>]*lang="en"/.test(html)) errors.push(`${label}: missing English language`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${label}: expected one H1`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${label}: missing title`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/.test(html)) errors.push(`${label}: missing description`);
  if (/\uFFFD|Ã©|â€™/.test(html)) errors.push(`${label}: damaged text encoding`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(tag)) errors.push(`${label}: image lacks alt text`);
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) errors.push(`${label}: image lacks dimensions`);
  }
  for (const [, raw] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = decode(raw);
    if (/^(mailto:|tel:|data:|javascript:)/.test(value)) continue;
    const url = new URL(value, pageUrl);
    if (url.origin !== pageUrl.origin) continue;
    const path = decodeURIComponent(url.pathname);
    let target = resolve(root, '.' + path);
    if (path.endsWith('/')) target = join(target, 'index.html');
    else if (!await exists(target) && !path.split('/').pop().includes('.')) target = join(target, 'index.html');
    if (!await exists(target)) errors.push(`${label}: missing resource ${path}`);
    else if (url.hash && pages.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!pages.get(target).includes(`id="${id}"`)) errors.push(`${label}: missing anchor ${value}`);
    }
    linksChecked++;
  }
  for (const [, srcset] of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const entry of srcset.split(',')) {
      const path = entry.trim().split(/\s+/)[0];
      if (path.startsWith('/') && !await exists(resolve(root, '.' + path))) errors.push(`${label}: missing responsive image ${path}`);
    }
  }
}
for (const required of ['.htaccess', 'web.config', 'robots.txt', 'sitemap-index.xml', '404.html']) if (!await exists(join(root, required))) errors.push(`Missing ${required}`);
const htaccess = await readFile(join(root, '.htaccess'), 'utf8');
for (const [, route] of htaccess.matchAll(/RewriteRule\s+\S+\s+(\/\S*)\s+\[R=301,L\]/g)) {
  if (!await exists(join(root, route, 'index.html'))) errors.push(`Redirect destination missing: ${route}`);
}
const sitemap = (await Promise.all(files.filter(f => /sitemap.*\.xml$/.test(f)).map(f => readFile(f,'utf8')))).join('\n');
if (sitemap.includes('/404.html')) errors.push('Sitemap includes 404 page');
if (/https?:\/\/(localhost|127\.0\.0\.1)/.test(sitemap)) errors.push('Sitemap contains local URLs');
assert.equal(errors.length, 0, errors.join('\n'));
console.log(`Verified ${htmlFiles.length} static pages and ${linksChecked} local references. Images, metadata, encoding, anchors, redirects, and sitemap checks passed.`);
