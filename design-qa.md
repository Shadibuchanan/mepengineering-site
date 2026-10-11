# Buchanan website design QA

final result: passed

## Visual target and evidence

- Source visual truth: `Website_Design.png`, 1540 × 1194 pixels. The reference presents a long website in two columns, rather than a single browser viewport.
- Implementation: local Astro site at `http://127.0.0.1:4321/`; compiled output independently tested at `http://127.0.0.1:4323/`.
- Desktop viewport: 1440 × 1000 CSS pixels, device scale factor 1. Home full-page capture: 1440 × 5210 pixels (`qa/home-desktop.png`).
- Mobile viewport: 390 × 844 CSS pixels, device scale factor 1. Home full-page capture: 390 × 6385 pixels (`qa/home-mobile.png`).
- State: default homepage, fonts loaded, images decoded, navigation closed. Additional evidence covers portfolio, project detail, services, about, and contact pages.
- Full composition comparison: `qa/sections-comparison.png`. The reference's left column (882 pixels wide) and corresponding implementation hero/introduction/project sections are displayed together at 700 pixels wide each. Content-driven vertical differences are intentional.
- Focused hero comparison: `qa/hero-comparison.png`. Reference crop 882 × 484; implementation crop 1440 × 830, both normalized to 1000 pixels wide and placed side by side. This lets navigation, typography, image treatment, and CTAs be inspected together without confusing the source board with a browser viewport.
- Focused implementation evidence: `qa/home-desktop-top.png`, `qa/home-mobile-top.png`, `qa/project-desktop-top.png`, `qa/about-principles-fixed.png`.

## Findings and comparison history

1. First visual comparison: hierarchy and image-led composition match the approved direction. White navigation capsule, large sans-serif/italic-serif pairing, rounded hero, restrained pill buttons, generous whitespace, three project columns, service rows, photographic sector banner, and horizontal case-study rows are present. Actual Buchanan content and projects replace the reference's generic architectural material.
2. Automated review found a P2 contrast issue on the About page: the small principle numbers used `#69745f` on `#e9ede4`, giving a 4.15:1 ratio. Changed the number color to `#56614d`.
3. Captured revised evidence in `qa/about-mobile-fixed.png` and `qa/about-principles-fixed.png`; inspected the corrected component and reran accessibility analysis. The revised About page has zero automated A/AA violations (`qa/about-a11y-fixed.json`). No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- **Typography:** locally hosted DM Sans provides readable headings and body text. At the user's request, emphasized heading words now use medium weight and a subtle underline instead of thin serif italics. Desktop and mobile headings fit without clipping at all tested widths.
- **Spacing/layout:** retained wide margins, open section spacing, asymmetric introduction, three-column project grid, and thin dividers. Mobile rearranges these into readable single-column sections. No horizontal overflow across 360, 390, 768, 1024, and 1440 pixels.
- **Colors/tokens:** near-white paper, near-black text, restrained muted text, and subtle green-tinted supporting sections. Text overlays remain legible over the actual photography. The About contrast correction is verified.
- **Images/assets:** the main hero uses a 4898 × 3265 source of the exact supplied Mayami photo, optimized into responsive WebP variants. Real supplied project photographs and client logos replace reference architecture. Standard icons use the Phosphor library. No fake projects or generated building photos. Lower-resolution source photography remains a documented content-quality follow-up.
- **Copy/content:** company information comes from `info.md` and the old website, portfolio entries from the workbook and supplied labels. No invented team profiles, testimonials, completion dates, performance claims, or discipline-specific project scope. Roka Hula's sourced area is explicitly venue area.

## Interaction and accessibility verification

- Nine browser tests passed against both development and compiled static output: sector filters, query persistence, city search, empty results/reset, directory-only sectors, mobile menu/Escape/focus, project/service navigation, inactive contact fallback, and five responsive widths.
- Seven configured-contact tests passed against a separate static build: required/email validation; complete submitted payload and service context; success reset and status focus; HTTP rejection/retry; network error with preserved values; duplicate submission lock and timeout; mobile overflow/accessibility; and native POST without JavaScript.
- Contact screenshots: `qa/contact-configured-mobile.png`, `qa/contact-success.png`, `qa/contact-error.png`.
- Every Formspree test request was intercepted locally. No email was sent. The production build still has no Formspree form ID.
- Automated accessibility scans covered seven representative page/viewport combinations plus the configured mobile form. All tested views have zero remaining automated A/AA violations after the About correction. This is not a comprehensive accessibility certification.
- Browser console and page errors checked on seven compiled page routes: none (`qa/production-console.json`). No missing images in checked views.
- Static checks passed for 27 generated HTML pages and 815 local references, including assets, metadata, text encoding, internal anchors, redirects, and sitemap.

## Intentional adaptations and follow-up

- The reference uses generic house imagery; this site features the user's real engineering projects and services, as agreed in the plan.
- The hero now has small pagination dots centered in the curved white cutout along the photograph's bottom edge. The three temporary Mayami views reuse the same high-resolution source, as requested; there is no autoplay. The discovery link sits with the main CTA.
- P3: obtain larger originals for smaller portfolio photos, particularly Roka Hula; normalize remaining client-logo artwork when better originals are available.
- Before public launch, confirm the content items in `docs/content-review.md`, add the real Formspree ID and test inbox delivery, and verify IONOS redirects/404 behavior on the actual hosting server. Apache rules are not executed by local static preview.

## Animation iteration — live reference

- Inspected the supplied live reference, [DNOIN architecture demo](https://architecture-company-opygen.vercel.app/), in Chromium at 1440 × 1000. Evidence: `qa/reference/settled.png`, `qa/reference/scroll-active.png`, `qa/reference/scroll-settled.png`, and `qa/reference/inspection.json`. Observed staggered entrances, vertical project-card reveals, image parallax, and smooth hover transitions.
- Adapted that motion to Buchanan: masked two-line hero entrance, brief image zoom, one-time staggered scroll reveals, desktop-only image drift, portfolio filter-result transitions, refined hover/focus arrows and photo zoom, and mobile navigation opening. Existing content and layout remain intact. No animation library was added.
- Inspected native animation samples at 240, 650, and 1800 milliseconds: `qa/motion/hero-timeline.png`. Hero text stays within its intended masks and settles without clipped letterforms on desktop and mobile. Inspected `qa/motion/projects-active.png`, `qa/motion/projects-settled.png`, `qa/motion/sectors-settled.png`, and `qa/motion/mobile-menu.png`. Image motion does not expose uncovered edges or create horizontal overflow.
- Six motion browser tests cover real hero interpolation and stagger, one-time scroll reveals, initial and dynamically changed reduced-motion preferences, immediate keyboard-focus visibility, and working content/links without JavaScript. The nine existing site tests also pass with animations enabled.
- Final compiled build: all 15 site/motion tests passed at `http://127.0.0.1:4323/`, source checks reported zero errors/warnings, and static verification passed for all 27 pages and 815 local references.
- Repeated all seven representative screenshot/accessibility scans with reduced motion for stable layout inspection: zero automated A/AA violations, runtime errors, overflow, or broken images. Overall homepage heights remain 5210 pixels on desktop and 6385 pixels on mobile. `qa/browser-report.json` records the results.
- Review refinements: animated logo opacity now finishes at its original muted value; focusing a mobile navigation link cancels the opening animation immediately. All reveal transforms are removed on completion. Desktop parallax updates only visible panels and skips touch devices and reduced-motion users.
- No actionable P0/P1/P2 motion findings remain. Existing content and hosting follow-up items above still apply.

## Original-site content iteration

- Source: eight HTML files in the user-supplied `C:/Users/Shadi/www.mepengineers.com` archive. Content decisions and exact mappings are recorded in `docs/content-review.md`.
- Added the About page's four project-scale facts and specialized-project paragraph, 55 historical client/community/public-project records in the searchable directory, a Civic filter, and restored service capabilities. The existing layout, typography, imagery, and motion treatment remain in place.
- Visually inspected the new About section at 1440 and 360 pixels (`qa/archive/experience-1440.png`, `qa/archive/experience-360.png`), the expanded client list (`qa/archive/legacy-1440.png`), and a mobile Civic-filter result (`qa/archive/civic-360.png`). Headings, numbers, paragraphs, and directory rows fit at both sizes without clipping.
- Ten targeted compiled-page/viewport scans cover About, Civic results, historical-client search, Electrical, and Plumbing at 360 and 1440 pixels. Zero automated A/AA violations, horizontal overflow, runtime errors, or broken loaded images; evidence in `qa/archive/report.json`.
- Final verification: **16 browser tests passed** against compiled static output, including historical-record search/filter/URL restoration and all six motion tests. Astro reported zero errors/warnings; static checks verified **27 pages and 816 local references**. No actionable P0/P1/P2 findings remain.

## Photography, image cutouts, and team iteration

- Copied all 18 original-site JPEGs unchanged into `src/assets/legacy/`; source and destination hashes match. Six service photos, the engineering banner, and two small discipline-detail photos are now used on the site. Captions identify their subjects without attaching unconfirmed project names.
- Added reusable responsive `PhotoFrame` and transparent top/bottom image masks. Applied cutouts to service images, project cards/detail images, About photography, team portraits, and homepage imagery. The header's curved white insert matches the navigation width; the mobile hero keeps the logo/menu clear and uses one continuous bottom cutout behind its discovery link.
- Added photos to Contact, Privacy, and 404. A browser pass over **all 27 compiled pages** verified at least one decoded photograph in each page's main content, with no broken images, runtime errors, or mobile overflow (`qa/photos/all-pages.json`).
- Added Raja Buchanan and Rashad Buchanan to About using the user-provided names and the role Engineer. Generated anonymous, non-identifying grayscale placeholders are labeled **Portrait coming soon**. No individual license designations or biographies have been added. Source prompts and replacement guidance are in `docs/asset-sources.md` and `README.md`.
- Compared the rendered home page with the live visual reference side by side in `qa/photos/divot-comparison.png`. Inspected `hero-fixed-1440.png`, `hero-fixed-390.png`, `team-1440.png`, and the service/detail crops. Fixed an initial mobile overlap between the image mask and discovery-link background; the revised cutout is a single smooth shape.
- Visual checks covered Mechanical/Electrical at 1440 and 390 pixels and Mayami detail at 1440 pixels. Frame widths align with the text container; captions remain outside the crop. Ten further representative page/viewport accessibility scans had zero automated A/AA violations or runtime/overflow/image failures (`qa/photos/report.json`). Small legacy photos remain naturally softer at large desktop widths.
- Final build and source checks pass. All **16 site/motion browser tests passed** against compiled output; static checks passed for **27 pages and 830 local references**. No actionable P0/P1/P2 findings remain. The real team photographs remain an intentional placeholder replacement.

## Photograph resolution and natural proportions

- Replaced forced portfolio crops with each source photo's natural aspect ratio. Cards and detail layouts cap their width at the available image dimensions; small photos omit notches and hover zoom. Roka Hula remains 326 by 312 pixels on desktop and mobile.
- Service photos now share a two-column desktop layout with the discipline text and retain their original proportions on mobile. The sprinkler detail stays at its original 180 by 180 pixels with no cutout, crop, or enlargement. Mechanical detail photography is also compact and uncropped.
- Capped About and 404 photography at the 1000-pixel source width; limited the Foxtail homepage panel to that width and removed its enlargement/parallax. Case-study photographs now preserve their full proportions. The hero's responsive image request accounts for the tall mobile/tablet crop, preventing a small derivative from stretching to fill it.
- Inspected compiled Fire Sprinkler, Electrical, Home, About, and 404 pages at 390, 768, and 1440 pixels. All 15 page/viewport checks showed no overflow, broken images, or runtime errors. Four representative automated accessibility scans had zero A/AA violations. Evidence: `qa/image-sizing/report.json` and corresponding screenshots.
- Inspected all 14 portfolio cards and the Roka detail at 390 and 1440 pixels in compiled output. Natural proportions and source-size limits hold; no clipping or loading errors. Evidence: `qa/image-sizing/compiled-project-image-report.json`, `projects-index-1440.png`, and `roka-hula-1440.png`.
- Final build: zero source errors or warnings; all 16 site/motion browser tests passed. Static verification passed for 27 pages and 830 local references. The sources remain unchanged; larger originals can support larger layouts in a later update. No actionable P0/P1/P2 findings remain for this iteration.

## Expertise banner quality correction

- Replaced the intrinsically soft archived piping banner with the existing 4898 by 3265 Mayami project photo. Retained curved cutouts, responsive crops, and an accurate project caption. The archived file remains unchanged.
- Inspected the compiled Expertise page at 390, 768, and 1440 pixels with 2x device density. Images load cleanly, service navigation works, and no horizontal overflow, runtime errors, or automated A/AA violations were found. The desktop browser now receives a 2880 by 1920 derivative for its 1290-pixel frame.
- Evidence: `qa/expertise-photo/photo-390.png`, `photo-1440.png`, and `report.json`. Source checks and production build pass; static verification passes for 27 pages and 830 local references. No actionable P0/P1/P2 findings remain for this correction.

## Readability, direct copy, and homepage photo controls

- Reduced oversized titles (shared desktop cap 80px, mobile minimum 42px; secondary headings 34-48px) and footer headings. Raised paragraphs to 18px and meaningful labels/captions/navigation to 14-18px. Removed decorative eyebrow and project metadata dots. Page intro copy is left-aligned below the heading, followed by a divider and defined spacing before subsequent content.
- Replaced generic slogans across Home, About, services, projects, Contact, and the footer with direct, source-backed descriptions of the firm, engineering work, project types, design calculations, and construction documents. Archive sourcing and content decisions are recorded in `docs/content-review.md`.
- Added a functional homepage photo bar with three view buttons, previous/next arrows, counter, keyboard controls, and horizontal touch gestures. It uses Dining room, Lighting detail, and Bar and seating crops of the same Mayami photograph for now. No autoplay; reduced motion makes transitions immediate. Without JavaScript, the photo and native links remain usable and inactive controls are hidden.
- All 19 site, motion, and carousel tests passed against compiled output. New checks cover view selection, wraparound, keyboard controls, touch-versus-vertical gestures, reduced motion, and the no-JavaScript fallback.
- Inspected all 27 compiled pages at 360, 768, and 1440 pixels: 81 views, with no horizontal overflow, broken images, runtime errors, or reviewed text below 14px. Fourteen representative automated accessibility scans pass after repairing the Roka venue-area definition-list markup. Evidence: `qa/readability/report.json` and `final-corrections.json`.
- Visual inspection also covered 320px layouts, hero views 2/3, intro dividers, project metadata, the contact form, service lists, and About statistics. Corrected inherited tight letter spacing on statistic units. Hero controls and CTA do not overlap. Screenshots are saved in `qa/readability/`.
- Final source/build checks pass with zero errors or warnings. Static verification passes for 27 pages and 830 local references. No actionable P0/P1/P2 findings remain for this iteration.

## Original photo gallery

- Imported all 48 JPEGs supplied in `photogallery4`; the numbered source sequence omits 27 and 32. Source and decoded-pixel hashes are unique, and visual reviews confirm repeated subjects are different views. No photos were excluded. Original hashes were independently rechecked and remain unchanged. The source-to-output mapping is in `docs/gallery-inventory.json`.
- Added `/gallery/` with category filters, a responsive masonry layout, readable captions, and a native dialog image viewer. Six selected photographs appear on the homepage. Projects and footer links provide additional entry points. Small filter results use a responsive grid so four images occupy four desktop columns without unbalanced empty space.
- The 350-pixel-tall originals retain natural proportions. Every thumbnail and viewer photo was measured at five viewport sizes, including 320px mobile and 667 by 375 landscape: no enlargement beyond the source dimensions, stretching, overflow, or broken images. The complete normalized collection is 1,588,520 bytes. Larger originals can replace these assets later without changing the gallery UI.
- Verified filter-specific previous/next sequences, wraparound, keyboard focus containment/restoration, Escape, backdrop close, touch swipes, landscape rotation, reduced motion, and native image links without JavaScript. A local preview MIME mismatch was corrected by using Astro preview; the hosting configuration also explicitly serves WebP as image/webp.
- Visual evidence: `qa/gallery/ui-gallery-top-1440.png`, `ui-gallery-top-390.png`, `ui-home-preview-1440.png`, and filtered/viewer screenshots. Automated evidence: `browser-report.json` and `final-checks.json`. Ten initial gallery/viewer accessibility scans plus six targeted correction scans report zero automated A/AA violations.
- Final build/source check passes with zero diagnostics. Static verification passes for 28 pages and 997 local references. All 24 site, motion, hero, and gallery tests pass against compiled output. No actionable P0/P1/P2 findings remain for this iteration.

## Homepage pagination reference correction

- Source: the user's attached 409 by 128 pixel detail, also present in `Website_Design.png` at x239/y438. Saved the matching local crop as `qa/hero-dots/reference-crop.png`. The prior bars, arrows, and counter were a P1 mismatch with the requested compact dot treatment; they have been removed.
- Replaced those controls with three gray dots and a short dark active pill in the bottom white cutout. The desktop curve is centered around the controls; mobile uses a wider curve. Moved the introduction link beside the main CTA, retaining the Mayami project link above the photo edge. The dots have 24 by 44 pixel hit areas and visible keyboard focus.
- Compared the reference and final rendered desktop detail together in `qa/hero-dots/comparison.png`. Source is 409 by 128 pixels; the compiled desktop crop is 659 by 206 pixels, normalized to 409 by 128 for comparison. The source's middle view is active; the implementation starts with the first view. Three controls correspond to the three available Mayami crops, versus five in the reference. The site's existing near-white background and darker inactive dots are retained. No actionable P0/P1/P2 differences remain.
- Full hero screenshots at 320, 390, 768, and 1440 CSS pixels, 1x density, are `qa/hero-dots/hero-{width}.png`; the second active view is `selected-390.png`. Inspected typography, CTA wrapping, photo quality, the curve, project caption spacing, and dot alignment. Text and source photography remain unchanged. All four widths have no horizontal overflow, broken loaded images, or runtime errors; mobile and desktop automated A/AA scans report zero violations (`report.json`).
- All nine targeted carousel and motion tests pass: click, keyboard wrap/Home/End, touch gestures, reduced motion, no-JavaScript behavior, and existing reveal animations. After the final spacing adjustment, rebuilt and verified all 28 static pages and 997 references, recaptured all four viewports, and rechecked dot selection and accessibility. The compiled `dist` output includes this correction.

## Recent Projects and gallery row alignment

- Renamed the homepage heading to **Recent Projects**. Its three cards now share image, metadata, and title rows. Photos are centered horizontally and vertically, retaining their natural proportions and source-size limits; location/sector wrapping no longer shifts neighboring project headings.
- Replaced the photo gallery's masonry columns with aligned responsive grid rows, including its six-photo homepage preview. Photo anchors remain centered and capped at original dimensions; titles and categories share text rows. Removed the obsolete special layout for small filter results because all results now use the same grid.
- Measured Recent Projects at seven widths from 320 to 1920 pixels: text aligns within one pixel for every multi-column row, images are centered, and no horizontal overflow or runtime errors occur (`qa/recent-projects/alignment.json`). Inspected the final heading and layout in `recent-final-390.png`, `recent-final-768.png`, and `recent-final-1440.png`.
- Measured all 48 gallery images and six preview images at 320, 390, 768, 1024, and 1440 pixels, plus filtered desktop results. Every row has aligned image centers, titles, and categories; images retain natural proportions without source enlargement. Four automated mobile/desktop accessibility scans report zero A/AA violations. Evidence: `qa/recent-projects/gallery-alignment.json`, `gallery-1440.png`, and `home-gallery-1440.png`.
- All 16 existing site/motion tests and all five gallery tests passed during this iteration, including filtering, navigation, keyboard/swipe viewer controls, and no-JavaScript links. The final build reports zero source diagnostics and verifies 28 pages and 997 local references. No actionable P0/P1/P2 findings remain.

## Readable heading emphasis

- Replaced thin Instrument Serif italics in headings with upright DM Sans at weight 550 and a subtle underline. Emphasized phrases retain semantic `<em>` markup, inherit the heading's tracking, and wrap normally. Body emphasis remains unaffected.
- Removed the form heading's local serif override and the hero's serif-specific size boost. Removed decorative emphasis around Privacy's lone period, unused serif font imports, and the unused font dependency. The existing locally hosted variable font supports the new weight without additional downloads.
- Inspected the compiled Home, Contact, About, Expertise, service detail, Projects, and Gallery headings at 320, 390, and 1440 pixels. Evidence: `qa/heading-emphasis/home-320.png`, `home-1440.png`, and the corresponding route captures. Long mobile headings wrap cleanly; the hero underline remains inside its animation mask. The existing photo and caption alignment is preserved.
- Checked all 28 compiled pages at 320, 390, 768, and 1440 pixels (112 views): no horizontal overflow, runtime errors, broken loaded images, or emphasized heading bounds outside the viewport (`layout.json`). Eight representative mobile/desktop accessibility scans report zero automated A/AA violations (`accessibility.json`). All six motion tests pass.
- The production build passes with zero source diagnostics; static verification passes for all 28 pages and 997 local references. No actionable P0/P1/P2 findings remain.

## Homepage horizontal photo strip

- Moved the homepage photo collection above Recent Projects and replaced its six-photo grid and outbound View all link with a horizontal strip containing all 48 originals. Photos open in the existing viewer on the same page. Image proportions, source-size caps, centered placement, and aligned title/category rows are retained.
- Added slow rightward motion at 28 CSS pixels per second with a seamless loop. Movement pauses on mouse hover, keyboard entry, touch/wheel interaction, offscreen visibility, and background tabs. A Pause/Play control provides a persistent stop, and reduced-motion preference starts with native scrolling only. Explicit Play works with retained button focus; other keyboard focus continues to pause motion.
- Loop copies are excluded from tab order and assistive-technology order. Clicking a visible copy opens the corresponding original photo in the same 48-photo viewer sequence; closing restores focus to the scrolling region. Without JavaScript, the originals remain a native horizontal scroll area with working image links and no inactive motion control.
- Inspected the compiled section at 320, 390, 768, and 1440 pixels (`qa/gallery-strip/home-{width}.png` and `moving-1440.png`). Measured every original at each width: no enlargement, distortion, caption misalignment, page overflow, or runtime errors. Four automated accessibility scans report zero A/AA violations (`visual-report.json`). The full filtered grid remains unchanged.
- Verified actual rightward movement, hover/focus stop and resume, persistent Pause, mouse and keyboard Play, reduced motion including a live preference change, same-page opening from originals and copies, and the no-JavaScript fallback. All nine gallery tests pass. The 19 existing site/hero/motion tests also pass during this iteration. Additional real touch-event scrolling and seam-wrap checks pass (`touch.json`, `wrap.json`).
- Final source/build checks pass with zero diagnostics, and compiled static verification passes for 28 pages and 1080 local references. No actionable P0/P1/P2 findings remain.

## Faster gallery motion, arrows, and caption centering

- Removed the separate gallery link from the Projects introduction. The footer's Photo gallery link now goes to `/#photo-gallery`; the existing filtered `/gallery/` route remains available by direct URL.
- Removed the strip's Pause/Play control and visible scrollbar. Added two 44-pixel directional buttons that advance one photo per click in 280 milliseconds. The automatic rightward speed is now 112 CSS pixels per second, four times the previous rate; an actual browser interval measured 108.5 pixels per second (`qa/gallery-arrows/speed.json`). Hover pauses motion and pointer exit resumes it, including after clicking an arrow.
- Keyboard focus and an open viewer pause automatic movement. Arrow navigation remains available while focused; reduced motion disables automatic movement and makes arrow steps immediate. Native touch scrolling remains available with the scrollbar hidden. Source-size caps and the same-page viewer remain intact.
- Centered caption text within the same column as each image. Measured all 48 originals at 320, 390, 768, and 1440 pixels: photo/caption centerlines agree within one pixel, with no enlargement or page overflow. Four accessibility scans show zero A/AA violations or runtime errors. Evidence: `qa/gallery-arrows/report.json`, `home-{width}.png`, and `portrait-{width}.png`.
- Inspected both landscape and portrait views on desktop and mobile. The arrows are legible, captions stay centered and aligned, and partial adjacent photos make horizontal browsing apparent. No actionable P0/P1/P2 visual findings remain. Final build/source checks report zero diagnostics; static verification passes for 28 pages and 1079 references.
- All ten updated gallery tests and ten existing site tests pass against the compiled build. Checks include exact directional steps and both wrap boundaries, hover/keyboard pausing, resumed motion with pointer-clicked arrow focus retained, live reduced-motion changes, same-page viewers, centered captions, revised links, and no-JavaScript scrolling. Preview server refreshed and verified with both arrows visible, no toggle, no scrollbar, and centered captions.

## Homepage portfolio section removal

- Removed the homepage's **From the portfolio** section, its two case-study entries, and their unused data/style rules. Added spacing before the client logos so the preceding project-type banner transitions cleanly into that section.
- Checked the compiled homepage at 390 and 1440 pixels: the section is absent, Recent Projects and the photo strip remain present, and neither viewport overflows. Visual evidence: `qa/home-cleanup/lower-home-{width}.png`.
- Build/source checks pass, and static verification passes for 28 pages and 1073 local references. No additional interaction tests were needed for this section removal.

## Edge-to-edge homepage gallery

- Removed the gallery heading, descriptive copy, and top divider. The strip now sits directly below the engineering introduction and spans the viewport; the introduction and Recent Projects retain their existing constrained content widths.
- Positioned the two 48-pixel navigation buttons over the left and right edges of the photo row, centered vertically on the images. Opaque backgrounds keep the arrows legible over photography, and the control group's empty space allows photo interaction through it.
- Measured the compiled layout at 320, 390, 768, 1440, 1920, and 2560 pixels: gallery and scroller bounds exactly match the viewport, arrows align with image centers, and surrounding text retains its margins. No horizontal overflow or runtime errors. Two mobile/desktop accessibility scans report zero automated A/AA violations (`qa/gallery-fullwidth/report.json`). Inspected `home-390.png` and `home-1920.png` for the section transition and overlaid controls.
- All ten gallery tests pass, including arrows, hover/focus behavior, wrapping, viewer interactions, reduced motion, and no-JavaScript scrolling. Build/source checks and static verification pass for 28 pages and 1073 references. The development preview also reports full-width gallery bounds and absolute arrow placement. No actionable P0/P1/P2 findings remain.

## Projects page row alignment

- Enabled the shared aligned-card layout on the Projects page. Each row now centers its photos horizontally and vertically and shares metadata/title tracks, so differing photo dimensions and wrapped text do not shift neighboring project names.
- Verified all 14 project photos and All/Hospitality/Retail filter results at 320, 390, 768, 1024, 1440, and 1920 pixels (18 combinations). Image centers and text rows align within one pixel; no source-size enlargement, page overflow, or runtime errors. Evidence: `qa/projects-alignment/report.json`, `grid-1440.png`, and `small-photo-row-1440.png`.
- Both existing portfolio filtering/search tests pass. Build/source checks and static verification pass for 28 pages and 1073 references. Development preview confirms the shared row layout is active. No actionable P0/P1/P2 findings remain.

## Hero margins and gentler gallery motion

- Constrained the homepage hero text and Mayami caption to centered content margins on wide monitors. At 1920 and 2560 pixels their left edges match the engineering introduction at 280 and 600 pixels. Mobile spacing is preserved; the gallery remains edge to edge.
- Slowed automatic gallery movement to 40 CSS pixels per second. Hover keeps the strip moving and adds a three-pixel lift, gentle brightness increase, and highlighted open-photo button. Keyboard focus, open viewers, and reduced-motion preferences retain their existing motion behavior.
- Checked 320, 390, 1440, 1920, and 2560 pixel layouts without horizontal overflow or runtime errors. Browser measurements confirm 40 pixels of movement over one second while hovering. Evidence: `qa/hero-inset-gallery-hover/report.json`, `hero-{width}.png`, and `gallery-hover-1920.png`.
- All 16 gallery and motion checks pass. Production build and static verification pass for 28 pages and 1073 local references. The development preview also uses the corrected hero margins.

## Shared navigation and content alignment

- Expanded the main content maximum width from 1360 to 1490 pixels and introduced shared responsive insets for navigation, page content, and hero text. The framed hero accounts for its outer margin, so its text aligns precisely with the logo and the content below. The gallery retains its full viewport width.
- Checked Home, About, and Projects at nine widths from 320 to 2560 pixels (27 views). Logo, title, and main container left edges agree within one pixel with no horizontal overflow. Evidence: `qa/header-office/alignment.json` and mobile/desktop screenshots.
- All 13 existing site and hero-carousel tests pass against compiled output. Build and static verification pass for 28 pages and 1073 local references.
- The office photo was subsequently supplied at `src/assets/team/our-office.png` and installed on About; see the office-photo check below.

## Projects metadata and photo bottom alignment

- Projects listing metadata now groups location and sector on the left with a middle-dot separator. Photos remain horizontally centered at their natural proportions and capped source sizes, with bottom edges aligned within each shared row. Metadata and titles retain their aligned rows.
- Measured All, Hospitality, and Retail results at six widths from 320 to 1920 pixels (18 layouts). Image bottom edges, horizontal centers, metadata starts, and title rows align within one pixel without page overflow. Evidence: `qa/projects-bottom-alignment/report.json` and screenshots.
- Both portfolio filtering tests pass; build and static verification pass for 28 pages and 1073 local references.

## Margate office photograph

- Replaced the About café photograph with the user-supplied Margate office photo and a firm/location caption. Removed the unrelated café project link. Kept the natural 1115 × 770 proportions, source-width cap, and existing decorative cutouts.
- Astro generates four responsive WebP variants from the preserved PNG. The largest is 87,342 bytes compared with the 1,067,561-byte source.
- Verified the rendered WebP, caption, proportions, source-size cap, and lack of overflow at five widths from 320 to 1920 pixels. Evidence: `qa/office-photo/report.json` and mobile/desktop screenshots. Development preview shows the office photo. Build and static verification pass for 28 pages and 1072 local references.

## Confirmed IONOS Windows hosting

- User confirmed IONOS Web Hosting Expert Windows with FTPS access. Added `public/web.config` for IIS default documents, WebP/WOFF2 MIME types, a static 404 response, headers, and caching scoped to fingerprinted assets. Simplified `.htaccess` to redirect directives supported by IONOS's documented Windows compatibility extension; no Microsoft URL Rewrite dependency is introduced.
- Updated deployment instructions and made `web.config` a required build artifact. Build and static verification pass for 28 pages and 1072 references. Parsed the compiled XML and checked default-document/error settings and identical source/build configuration hashes.
- IIS is not installed locally. Live redirect status codes, custom 404 behavior, MIME delivery, and hosting section permissions remain deployment checks. No upload, DNS change, or publication was performed.

## Final checklist

- [x] Compare reference and rendered implementation side by side.
- [x] Inspect desktop/mobile and the core page families.
- [x] Correct and recheck the About-page contrast issue.
- [x] Test navigation, portfolio interactions, and contact states.
- [x] Build and verify compiled static output.
- [x] Preserve original input files and document remaining content questions.

final result: passed
