# Buchanan P.E. Consulting website

A static website built with Astro, strict TypeScript, and custom CSS. Production output is compiled HTML, CSS, JavaScript, images, and locally hosted fonts. IONOS does not need to run Node.js.

## Develop and review locally

Use Node.js **22.12 or newer** and npm **9.6.5 or newer**. Development has been run with Node.js 24.

```sh
npm install
npm run dev
```

Open the local URL printed by Astro, normally `http://127.0.0.1:4321`. Stop the server with Ctrl+C. The server is bound to the local computer by default.

| Command | Purpose |
| --- | --- |
| `npm install` | Install the dependencies recorded in `package.json` and `package-lock.json`. |
| `npm ci` | Install the exact lockfile dependencies on a clean checkout. |
| `npm run dev` | Start the development server with live updates. |
| `npm run check` | Check Astro and TypeScript source. |
| `npm run build` | Check the source and create the static website in `dist/`. |
| `npm run preview` | Serve the latest `dist/` build locally for review. |
| `npm run verify` | Run the repository's checks against generated build output. Run after building. |
| `npm test` | Run Playwright site, hero-control, and photo-gallery checks with the local development server running. |
| `npm run test:motion` | Run six browser checks for animation, reduced motion, keyboard access, and content without JavaScript. |
| `npm run test:contact` | Run seven intercepted form tests against the isolated configured QA server described below. |
| `npm run qa:capture` | Capture desktop/mobile screenshots and automated accessibility results from port 4321. |

Preview does not rebuild changed source or execute `.htaccess` / IIS `web.config`. Verify redirects, MIME types, and the custom 404 status on IONOS staging too.

### Browser verification

Install the test browser with `npx playwright install chromium`. For the main site tests, run the development server in one terminal and `npm test` in another. Set `PLAYWRIGHT_BASE_URL` to test another local preview, such as compiled output. Screenshots and test results are ignored by Git.

Configured form tests use a separate build so that a fake form ID never enters `dist/`. In a disposable PowerShell terminal, run:

```powershell
$env:PUBLIC_FORMSPREE_ID = 'reviewtest'
npx astro build --outDir ./qa/form-dist
python -m http.server 4322 --bind 127.0.0.1 --directory qa/form-dist
```

Then run `npm run test:contact` in another terminal. Every Formspree request is intercepted and other external traffic is blocked. Stop this QA server and close its disposable terminal when done. Never upload `qa/form-dist/`; upload only the real `dist/` build. The Python command is only a convenient local static test server; Python is not a production requirement.

The completed visual and interaction review is recorded in `design-qa.md`.

### Animation

Motion uses the browser's Web Animations API and IntersectionObserver, without an animation dependency. `src/scripts/motion.ts` controls hero entrances, section reveals, portfolio result transitions, and subtle desktop image parallax. The mobile menu animation lives in `Header.astro`; hover transitions are CSS.

Add `data-reveal` to a content block to animate its first viewport entry, or `data-reveal="image"` for a slower image reveal. Add `data-stagger` to a parent whose direct children have reveal hooks to stagger them. Avoid nesting reveal targets or animating whole tall sections. Content remains visible when scripts are unavailable. Reduced-motion preferences disable entrances and parallax, including when changed while the page is open. Keyboard focus immediately finishes revealing its target.

The homepage carousel has three small pagination dots centered in a curved white cutout at the bottom of the hero. Click a dot, use the arrow keys or Home/End while a dot is focused, or swipe horizontally to change views. For now it uses three crops of the same high-resolution Mayami photograph. The view definitions are in `src/pages/index.astro`; interaction is in `src/scripts/hero-carousel.ts`. There is no autoplay. Without JavaScript, the initial photo and project link remain available and inactive controls are hidden.

The screenshot command uses reduced motion to capture settled layouts. The motion tests exercise real browser animations, including timing, interpolation, cancellation, and native links without JavaScript.

## Content and assets

| File or folder | Edit here for |
| --- | --- |
| `src/data/site.ts` | Company name, contact details, and shared description. |
| `src/data/projects.ts` | Project names, descriptions, locations, architect credits, photos, directory entries, and featured projects. |
| `src/data/legacy-projects.ts` | Additional clients, residential communities, and public projects from the original website. |
| `scripts/prepare-gallery.mjs` | Curated gallery captions, categories, and homepage selections; generates gallery data/assets. |
| `src/data/gallery.ts` | Generated photo gallery records. |
| `src/assets/gallery/` | Optimized copies of the original project gallery photographs. |
| `docs/gallery-inventory.json` | Original filenames, dimensions, hashes, duplicate review, and published image mapping. |
| `src/data/legacy-images.ts` | Original-site service photographs, captions, and alt text. |
| `src/components/Team.astro` | Engineer names and the About-page team cards. |
| `src/assets/team/` | Clearly labeled temporary portrait images; replace with real team photos when available. |
| `src/components/PhotoFrame.astro` and `src/styles/photo-frame.css` | Responsive photograph frames and curved top/bottom cutouts. |
| `src/data/services.ts` | Service descriptions and capabilities. |
| `src/pages/` | Page layouts and page-specific copy. |
| `src/styles/global.css` | Shared design styles. |
| `src/assets/` | Images that Astro optimizes during the build. |
| `public/` | Files copied directly to the build, including `.htaccess`, `web.config`, and `robots.txt`. |
| `docs/content-review.md` | Source decisions and project information that needs confirmation. |
| `docs/asset-sources.md` | Image provenance. |

Small photographs keep their original proportions and are capped at their source dimensions. Portfolio cards may have different heights; avoid forcing portrait and landscape photos into one crop. Curved cutouts are reserved for wider images. Small technical details, including the 180-pixel sprinkler photograph, stay uncropped.

All 48 photos appear in an edge-to-edge horizontal strip directly beneath the homepage engineering introduction and above Recent Projects. The strip has no visible section heading or divider; surrounding text stays within the usual content margins. The strip moves from left to right at 40 CSS pixels per second and continues moving on hover; hovered photos lift slightly and brighten. Keyboard focus pauses movement until focus leaves. Left/right arrows overlay the photo row at the screen edges and quickly advance one photo at a time; touch/keyboard scrolling remains available with the scrollbar hidden. There is no Pause/Play button. Reduced-motion preferences disable automatic movement and make arrow navigation immediate. Clicking a photo opens the viewer on the same page. Each photo and its caption are centered in the same column, and small originals are never enlarged.

The Projects page no longer links to a separate gallery; the footer's Photo gallery link points to `/#photo-gallery`. The filtered grid remains available at its existing `/gallery/` URL. Filters limit that viewer's previous/next sequence to the selected category. Original photographs remain untouched; no duplicate source files were found. The looping strip's visual copies are excluded from keyboard and screen-reader navigation. Both viewers support keyboard, swipe, and Escape controls.

To regenerate gallery assets and metadata after updating the curated entries in `scripts/prepare-gallery.mjs`:

```sh
node scripts/prepare-gallery.mjs "C:/Users/Shadi/www.mepengineers.com/photogallery4"
```

The folder argument is optional when the original archive remains beside this repository. Edit the script's entries rather than the generated `src/data/gallery.ts` file. The complete optimized collection is approximately 1.52 MiB, with lazy-loaded thumbnails.

Original project documents and photographs remain in the repository. Do not upload them to the web server. If normalized project images need to be regenerated from `logos_photos/`, run:

```sh
node scripts/prepare-assets.mjs
```

The project data generates detail-page URLs from each `slug`. If an already published slug changes, add a redirect from its previous URL. Review project credits, locations, image permission, and business contact details before launch.

## Enable the contact form later

The form is deliberately inactive until a Formspree form ID is configured. The contact page provides email and telephone links in the meantime.

1. Create a Formspree account and a form for Buchanan website inquiries. Configure and verify the business inbox that should receive notifications.
2. Copy `.env.example` to `.env` in the project root.
3. Copy the **form ID** from Formspree's endpoint. For an endpoint shaped like `https://formspree.io/f/abcdefgh`, the ID is `abcdefgh`.
4. Set `PUBLIC_FORMSPREE_ID` in `.env` to that ID:

   ```dotenv
   PUBLIC_FORMSPREE_ID=abcdefgh
   ```

   `abcdefgh` above is an illustration. Replace it with your own real ID. Do not enter an account password, secret API key, or the whole endpoint URL.

5. Restart the development server, or run a fresh production build. This is a build-time setting; uploading an `.env` file to IONOS will not enable a previously compiled form.
6. Review Formspree's spam protection and allowed-domain settings for your account. Include the production domain and any staging domain used for delivery testing.
7. Send a clearly labeled test inquiry from staging. Confirm it appears in Formspree and reaches the intended inbox, then check the page's success state. Also check validation and a failed/network-offline submission; entered text should remain available after a failure.

The public form ID appears in the compiled website by design. `.env` is excluded from Git and must not be uploaded. No Formspree account or real delivery destination is created by this repository.

## Build for IONOS

```sh
npm run build
npm run verify
npm run preview
```

Review the compiled version before uploading. Check the home page, project search and sector filters, project detail pages, service pages, navigation on mobile, and contact links/form.

The site is configured for `https://www.mepengineers.com/` at the domain root. Routes use directories such as `/projects/mayami-wynwood/`. Uploading it under a subfolder like `/new-site/` requires code and configuration changes because links and assets currently begin at `/`. Use a separate staging subdomain with its own document root for review.

If the production domain changes, update both `site` in `astro.config.mjs` and the sitemap URL in `public/robots.txt`, then rebuild. The `site` value supplies canonical URLs, social-sharing URLs, and the sitemap host.

## Upload and launch

1. Back up the existing live files and current server configuration to a safe location outside the public web directory.
2. Set up a staging subdomain/document root on the hosting account and protect the staging site from public indexing. A private or password-protected staging site is preferable for review.
3. Upload the **contents of `dist/`** into that document root. Upload `index.html`, all generated page directories, `_astro/`, `404.html`, sitemap files, `robots.txt`, `web.config`, and the hidden `.htaccess` file. Do not upload the enclosing `dist` folder, repository, `src`, `node_modules`, `.env`, spreadsheets, or original reference files.
4. Verify directly opening nested URLs, loading all images/fonts, refreshing project pages, following old URLs, and receiving a real 404 status for a nonexistent page. Check contact delivery after Formspree is configured.
5. After reviewing staging, upload the same checked build to the production document root. Ensure the production domain uses HTTPS and the preferred host is `www.mepengineers.com`. Keep the old-site backup available for rollback.
6. Recheck production URLs and contact delivery after launch. For later updates, rebuild locally and upload the new `dist/` contents, including the matching `_astro/` assets.

### Confirmed hosting: IONOS Web Hosting Expert Windows

Use FileZilla Client > File > Site Manager > New Site. Choose FTP - File Transfer Protocol, Require explicit FTP over TLS, port 21, and Normal logon. Copy the server hostname and FTPS username from Hosting > FTPS > Manage, and enter that FTPS user's password. These settings follow [IONOS's connection documentation](https://www.ionos.com/help/hosting/setting-up-and-managing-ftp-access/connection-details-for-ftp/sftp-in-ionos-web-hosting/).

Upload both included configuration files:

- `web.config`: IIS default document (`index.html`), WebP and WOFF2 MIME types, static custom 404 response, response headers, and long-lived caching limited to fingerprinted `_astro` assets.
- `.htaccess`: permanent redirects for legacy URLs. [IONOS documents its Windows Apache-compatible rewrite extension](https://www.ionos.com/help/ssl-certificates/tips-for-setup-and-use/automatically-redirect-visitors-to-ssl-secured-site/); Microsoft's URL Rewrite module is not installed, so no IIS `<rewrite>` section is used.

The configuration is prepared for a folder mapped to the domain root. Create a new remote folder such as `mep-website`, upload the contents of `dist` there, and connect the domain to that folder when ready. Keep the original site and its configuration available for rollback. A folder named `mep-website` is fine as a domain document root; browsing it as `/mep-website/` within the old website is not a valid preview of this root-based build.

Review any inherited account-specific server configuration before replacing files. If IIS does not apply the configuration, IONOS describes [marking the directory as an application](https://www.ionos.com/help/hosting/net/webconfig-and-globalasax-are-not-considered/). A server-side 500 error requires checking IONOS's configuration/log details; local Astro preview cannot validate hosting-specific section permissions. Verify real 301 redirects, 404 status, WebP/WOFF2 delivery, HTTPS, and both domain variants after upload. HTTPS/canonical-host forwarding should be configured after checking the domain's certificate and existing forwarding settings.

### Other hosting platforms

The generated pages are static and portable, but `web.config` is Windows/IIS-specific. The current `.htaccess` contains only redirect rules for the confirmed IONOS Windows account. If moving to Linux/Apache, configure its default document, 404 page, MIME types, headers, and caching for that platform.

This repository does not upload or publish the website automatically. No database is required. Contact form delivery still requires a real Formspree form ID followed by a fresh build.
