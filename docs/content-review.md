# Content and image review

The portfolio uses the supplied `PROJECTS.xlsx`, `info.md`, files in `logos_photos`, and the original website in `C:/Users/Shadi/www.mepengineers.com`. The originals have not been changed. `src/data/projects.ts` and `src/data/legacy-projects.ts` contain editable website records; `scripts/prepare-assets.mjs` regenerates normalized WebP copies after `npm install`.

## Original website content migration

- Reviewed all eight local HTML pages: `index.html`, `portfolio.html`, and the six service pages. The archive supplies both content and service photographs. Its legacy scripts, styles, template, and contact form have not been copied into production.
- `portfolio.html` supports the About page's experience figures: residential plans up to **35,000 sq ft**, residential/rental communities up to **1,000 units**, new high-rise designs up to **21 stories**, and other high-rise work up to **45 stories**. The latter is not described as a new 45-story building. The specialized-project paragraph also comes from this page: a **60,000 sq ft** temporary air-conditioned tent, air-conditioned pool areas, genetic laboratories, and clean rooms. These are company-reported historical examples, not measurements assigned to any of the 14 photographed projects.
- `src/data/legacy-projects.ts` adds **55 historical experience records**: 32 names from the old client list after excluding the existing Popeyes entry; 8 additional restaurant/retail names from the narrative; 9 residential communities with Central Park deduplicated; and 6 civic/institutional examples from the repeated service-page company description. These records represent brands, communities, and programs, not 55 unique sites. The original 33 workbook rows remain unchanged.
- The portfolio directory labels this group **Additional experience** and identifies it as earlier work. Search, sector filters, URL restoration, and result counts include both groups. Unknown locations are omitted. Five ambiguous clients (FedEx, Motorola, Cintas, Triple M Petroleum, Arnet Pharmaceuticals) remain searchable without a guessed sector. Source spellings **Carrlucci** and **Swim & Sports** should be confirmed before any renaming; historical names such as MetroPCS and Solantic are retained.
- `index.html` supports the About wording about city-specific notes/details informed by previous plan-review comments. The updated company description also includes industrial projects, schools, and warehouses. Existing company contact details remain consistent with the archive; its address omits the suite already supported by other source material.
- The six service pages supply restored technical capabilities: mechanical assessments, energy audits, feasibility/life-cycle analysis, central plants, industrial ventilation, ice storage and solar thermal; electrical assessments, medium voltage/cogeneration, fault-current/arc-flash/coordination studies, low-voltage/communications, PV and power quality; specialized plumbing, backflow, acid waste, process piping, and dental systems; field-informed hood design; and Ansul fire protection. Fire-alarm content already covered the original page.
- Do not migrate the archive's claim that the firm itself has “LEED certification,” its time-sensitive school-lighting prototype language, fixed “40 year Inspection” label, universal installation-savings/field-check promises, or first-review approval expectations. The new prose describes supported experience without making these current guarantees. Private celebrity-home names are omitted from the public portfolio because there is no additional case-study material.
- The initial Juicebox archive lacked its gallery image sets. The user subsequently supplied 48 numbered JPEGs in photogallery4; these are now preserved in the new photo gallery, as described below. The remaining 18 image files have no names/captions connecting them to specific projects. All 18 original JPEGs are now copied unchanged into src/assets/legacy/. Six original service-page images and the engineering banner are used as service illustrations, with additional ductwork/sprinkler detail photos where appropriate. Current named-project photography is retained; no archived illustration is represented as a newly identified project.

## Published content decisions

- The workbook contains **33 nonempty project rows**, not 33 unique buildings or locations. Some brands have separate rows for locations, while Sushi Sake, Seabra, Montessori School and Pure Green combine several locations in one row. The website index preserves those 33 records.
- Fourteen projects have supplied venue photography and receive photo-based detail pages. Café Bastille and Pura Vida are supported by `info.md` and photo filenames, although neither appears in the workbook. They are additional to the 33-row index.
- Broad descriptions identify the type of venue and its setting. They do not claim individual engineering deliverables, construction scope, performance results, savings, schedules or completion dates.
- Architects are copied from the corresponding workbook rows only where the project/location match is clear. Check the preferred public credit wording and firm spelling before launch.
- The workbook’s `YEAR` column is omitted from website content because it is unclear whether it denotes design, permitting, construction or opening.
- Roka Hula’s **3,275 sq ft** is venue area reported by [RCC Associates](https://rccassociates.com/rokahula), reviewed September 29, 2026. It is labeled “venue” and must not be represented as the engineer’s verified scope area.

## Items to confirm

1. **Popeyes:** the project name/photo filename say Plantation, but the listed street address ends in Davie. The public location currently says Broward County.
2. **Sirocco:** the workbook includes Pembroke Pines and Dania Beach. The supplied photograph does not identify its location, so the photo project uses South Florida and its description names both roster locations.
3. **Pure Green:** the workbook lists Sawgrass and Coral Springs, without an address or a match for the supplied storefront image. The photo project uses South Florida.
4. **Pura Vida:** `info.md` identifies the brand but does not identify the location of the supplied photo. The page uses South Florida.
5. **Café Bastille:** city labels come from the two photo filenames. Add addresses, architect credits and project scope when available.
6. **Bachour Design District, Golden Krust, Mazda Coconut Creek and Ocala Plastic Surgery:** some workbook address fields are blank. City/region labels are limited to what the project name or Florida business context supports; no street addresses are published.
7. **Montessori School:** the roster names three cities but not a school/operator. Confirm the public name.
8. **Boûlan Wynwood:** the name is normalized from the supplied materials. Confirm official accent/spelling and whether an architect credit is available.
9. **Camachee Cove:** the supplied St. Augustine address has a suspect ZIP code. The website uses city only.
10. **Scope and imagery:** confirm each selected photograph depicts the actual location/work and that it may be published. Add exact discipline scope, project phase, size and concise case-study details when available.

## Photo quality

Most source photographs are around 680 pixels wide. They are suitable for a first visual review, but original high-resolution files will make the portfolio significantly sharper. No image has been artificially enlarged or generated.

| Website asset | Source file | Source pixels |
| --- | --- | --- |
| mayami-wynwood.webp | MAYAMI.PNG | 680 × 453 |
| cafe-bastille-fort-lauderdale.webp | CAFE BASTILLE FT LAUDERDALE .PNG | 680 × 510 |
| foxtail-coffee-sarasota.webp | FOXTAIL COFFEE SARASOTA.jpg | 1000 × 663 |
| boulan-wynwood.webp | BOULAN WYNWOOD.PNG | 680 × 453 |
| grieco-mazda-delray-beach.webp | DELRAY MAZDA  .PNG | 680 × 382 |
| kinetic-racquet-club.webp | KINETIC INDOOR RACQUET CLUB.PNG | 652 × 510 |
| roka-hula.webp | ROKA HULA -DELRAY.jpg | 326 × 312 |
| sirocco.webp | SIROCCO.png | 680 × 382 |
| cafe-bastille-weston.webp | CAFE BASTILLE WESTON.PNG | 680 × 510 |
| francesco.webp | FRANCESCO RESTUARANT -MIAMI | 382 × 510 |
| pura-vida.webp | pura vida .jpg | 1080 × 692 |
| baya-bar.webp | BAYA BAR.PNG | 443 × 510 |
| popeyes.webp | POPEYES PLANTATION.PNG | 680 × 382 |
| pure-green.webp | PURE GREEN.PNG | 382 × 510 |

Roka Hula and the portrait images now use compact, naturally proportioned layouts capped at their source dimensions. Larger originals would allow larger photographs later. Voodoo Bayou, Sushi Sake, Seabra and Presidente source files are logos/brand graphics, not venue photographs, so they are not used as portfolio photography.

## Client logo mapping

Normalized logo assets are exported through `clientLogos` in `src/data/projects.ts`.

| Website asset | Source |
| --- | --- |
| logos/improv.webp | improv-logo.png |
| logos/golden-krust.webp | Golden-Krust-Logo.png |
| logos/mazda.webp | DELRAY MAZDA.PNG (AVIF content) |
| logos/sushi-sake.webp | SUSHI SAKE .PNG (JPEG content) |
| logos/voodoo-bayou.webp | VOODOO BAYOU.jpg (two spaces in source filename) |
| logos/pura-vida.webp | pura vida.png (AVIF content) |
| logos/woof-gang.webp | woof gang.png (SVG content) |

The original `LOGOS.docx` contains alternate or duplicate low-resolution brand images. Those have been inspected, but are not needed by the current asset pipeline.

## Photography and team update

- The user explicitly requested original-site photo reuse, a photograph on every page, and curved top/bottom image cutouts. src/data/legacy-images.ts maps source photos to the same service pages with descriptive alt text. src/components/PhotoFrame.astro and src/styles/photo-frame.css apply responsive CSS crops without altering source JPEGs.
- Contact, Privacy, and 404 pages now include real project imagery; all six service detail pages and the service directory have original-site photos. Existing portfolio and About photographs use the same cutout treatment.
- Raja Buchanan and Rashad Buchanan are the user-provided engineer names. Their About cards currently use explicitly labeled, anonymous generated portrait placeholders, not actual likenesses. No individual qualifications, biographies, or professional-license suffixes have been invented. Replace the two assets in src/assets/team/ with real portraits when available.

## Source-aware photograph sizing

- Service photographs now sit alongside the discipline text, with their original wide proportions. The small sprinkler photo displays at 180 by 180 pixels with no notches or crop.
- Portfolio cards and detail pages retain each photo's natural aspect ratio and cap displayed widths at the source dimensions. Smaller photos no longer use decorative cutouts or hover enlargement.
- About, 404, and homepage photographs have source-aware size limits. The mobile hero requests a larger derivative to account for its tall crop. Original source files remain unchanged.

## Readability and direct engineering content

- Replaced generic headings and marketing slogans with specific service names, project types, firm information, and engineering deliverables. The homepage now names duct layouts, load calculations, equipment specifications, power distribution, lighting, water/sewer/gas plans, kitchen hoods, fire alarms, and sprinkler hydraulic calculations.
- Homepage and About copy use the archived site and info.md for founding year, Florida service area, client/project types, two licensed engineers, signed/sealed plans, architectural/structural coordination, and municipal plan-review notes. No new project-specific engineering scope or performance guarantee was added.
- Page introductions now group explanatory paragraphs below their titles and end with a visible divider. Body copy is generally 18px; navigation, captions, metadata, and labels are 14px or larger. Large titles and footer headings were reduced; decorative eyebrow and metadata dots were removed.
- The homepage's three selectable views reuse the same Mayami source photograph with different framing. They are labeled Dining room, Lighting detail, and Bar and seating; they do not represent three different projects or photographs.

## Office photograph

The About page now uses the user-provided `src/assets/team/our-office.png`, identified by the user as Buchanan P.E. Consulting's office building in Margate, Florida. The original PNG is retained; Astro generates responsive WebP images for display. The caption identifies the firm and city, and the former Foxtail project link has been removed from this figure.

## Original project photo gallery

- Source: the user-supplied `C:/Users/Shadi/www.mepengineers.com/photogallery4` folder. It contains 48 JPEGs numbered 01 through 50, with 27 and 32 absent. No original files were changed or removed.
- File hashes, decoded pixel hashes, perceptual comparisons, and visual contact-sheet review found no duplicate photographs within this collection. Repeated subjects and brands show different views; all 48 photographs are retained.
- Captions and categories describe the supplied filenames and visible subjects. The gallery does not infer locations, dates, project sizes, architects, or specific engineering scopes from the pictures.
- The homepage includes all 48 photographs in a horizontal strip above Recent Projects. It moves from left to right at 40 CSS pixels per second, continues on hover with a subtle photo lift/highlight, pauses for keyboard focus, supports directional arrows and touch scrolling, and opens photos in a viewer on the same page. The Projects gallery link has been removed and the footer points to the homepage strip. The existing `/gallery/` URL retains the filtered grid for direct access.
- These small original images are 350 pixels tall. Thumbnails and the viewer preserve their proportions and limit display size to the source dimensions. The website uses optimized WebP copies and retains filename/source mappings in `docs/gallery-inventory.json`.
