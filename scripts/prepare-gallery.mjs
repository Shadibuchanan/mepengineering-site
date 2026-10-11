import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Run: node scripts/prepare-gallery.mjs [path/to/photogallery4]
// The archive is read only. Only normalized assets, gallery data, and the
// inventory are written inside this repository. No source image is enlarged.
const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDirectory = path.resolve(process.argv[2] || path.join(root, '..', 'www.mepengineers.com', 'photogallery4'));
const assetDirectory = path.join(root, 'src', 'assets', 'gallery');
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');

// Titles and descriptions identify what the filename or photograph shows.
// No project address, date, engineering scope, or unconfirmed client is added.
const entries = [
  ['01_AIRPLANE HANGARS.jpg', 'aircraft-hangar', 'Aircraft hangar', 'Commercial', 'Aircraft parked inside a hangar with exposed steel roof framing and overhead lights'],
  ['02_CAR DEALERSHIP.jpg', 'mazda-dealership', 'Mazda dealership', 'Commercial', 'Mazda dealership showroom entrance with vehicles parked outside'],
  ['03_FIVE GUYS.jpg', 'five-guys-storefront', 'Five Guys storefront', 'Hospitality', 'Five Guys sign above a shaded restaurant entrance'],
  ['04_MEDICAL BLDG (2).jpg', 'medical-office-entrance', 'Medical office entrance', 'Healthcare', 'Medical office building behind a landscaped lawn and entrance sign'],
  ['05_DUNKIN DONUT.jpg', 'dunkin-donuts-storefront', 'Dunkin’ Donuts storefront', 'Hospitality', 'Dunkin’ Donuts building with orange awnings and an adjoining parking area'],
  ['06_CAFE (2).jpg', 'cafe-storefront', 'Café storefront', 'Hospitality', 'Café storefront with tall windows, palms, and a white terrace railing'],
  ['07_RESTAURANTS.jpg', 'popeyes-storefront', 'Popeyes storefront', 'Hospitality', 'Popeyes restaurant entrance with a red awning and yellow facade'],
  ['08_RESTAURANT2.jpg', 'restaurant-patio', 'Restaurant patio', 'Hospitality', 'Restaurant storefront with a raised outdoor patio and stone retaining wall'],
  ['09_RETAIL (4).jpg', 'swimwear-retail-interior', 'Swimwear retail interior', 'Commercial', 'Swimwear store entrance with merchandise displays and ceiling lighting'],
  ['10_SCHOOLS.jpg', 'middle-school-entrance', 'Middle school entrance', 'Education', 'Ramblewood Middle School entrance beneath a green canopy'],
  ['11_SPORT FACILITIES.jpg', 'martial-arts-studio', 'Martial arts studio', 'Recreation', 'Taekwondo studio storefront with tall windows and landscaped planting beds'],
  ['12_OFFICE BUILDING.jpg', 'office-building-exterior', 'Office building exterior', 'Commercial', 'Multi-story office building with reflective windows and landscaping'],
  ['13_MIXED USE BUILDING.jpg', 'mixed-use-building', 'Mixed-use building', 'Commercial', 'Three-story mixed-use building with long balconies and parking in front'],
  ['14_PRESCHOOL.jpg', 'preschool-storefront', 'Preschool storefront', 'Education', 'Preschool storefront in a commercial plaza with awnings and palm trees'],
  ['15_PETSMART.jpg', 'petsmart-storefront', 'PetSmart storefront', 'Commercial', 'PetSmart storefront with a blue corner tower and covered entrances'],
  ['16_JAPANGO PHOTO.jpg', 'japango-entrance', 'Japango entrance', 'Hospitality', 'Japango restaurant entrance framed by a stone facade and trees'],
  ['17_AQUARIUM PLUMBING.jpg', 'aquarium-plumbing', 'Aquarium plumbing', 'Building systems', 'Aquarium equipment room with pipes, valves, blue tanks, and service equipment'],
  ['18_COOLING TOWERS.jpg', 'cooling-towers', 'Cooling towers', 'Building systems', 'Cooling tower equipment with connected piping and metal service panels'],
  ['19_plaza las americas.jpg', 'plaza-las-americas', 'Plaza Las Americas', 'Commercial', 'Plaza Las Americas building with balconies and a parking area in front'],
  ['20_NIGHT CLUB.jpg', 'nightclub-signage', 'Nightclub signage', 'Hospitality', 'Decorative sign for The Swamp at Seminole Paradise'],
  ['21_DENTAL OFFICE.jpg', 'dental-office-storefront', 'Dental office storefront', 'Healthcare', 'Dental office signage on the upper level of a two-story commercial building'],
  ['22_RETAIL (3).jpg', 'retail-store-aisles', 'Retail store aisles', 'Commercial', 'Retail merchandise aisles beneath rows of overhead lighting'],
  ['23_bbking -CITY PLACE.jpg', 'bb-kings-exterior', 'B.B. King’s exterior', 'Hospitality', 'B.B. King’s Blues Club entrance with palm trees and an outdoor seating area'],
  ['24_FROZEN YOGURT.jpg', 'frozen-yogurt-shop', 'Frozen yogurt shop', 'Hospitality', 'Frozen yogurt shop entrance opening onto a food-service seating area'],
  ['25_RESTAURANT (2).jpg', 'restaurant-entrance', 'Restaurant entrance', 'Hospitality', 'Restaurant entrance with columns, decorative facade details, and outdoor tables'],
  ['26_SPA.jpg', 'salon-and-spa', 'Salon and spa', 'Commercial', 'Salon and spa storefront with a central entrance and planted beds'],
  ['28_ZONA FRESCA (2).jpg', 'zona-fresca-dining-room', 'Zona Fresca dining room', 'Hospitality', 'Zona Fresca dining room with exposed ducts, pendant lighting, and red seating'],
  ['29_RESTAURANTS (3).jpg', 'restaurant-dining-room', 'Restaurant dining room', 'Hospitality', 'Restaurant dining room with tables, chairs, exposed white ducts, and a bar'],
  ['30_TOWN HOUSES.jpg', 'townhouse-community', 'Townhouse community', 'Residential', 'Row of two-story townhouses with tile roofs and landscaped front entrances'],
  ['31_CAFE.jpg', 'cafe-interior', 'Café interior', 'Hospitality', 'Café tables and chairs in front of an open service counter'],
  ['33_RESTAURANTS (4).jpg', 'restaurant-booth-seating', 'Restaurant booth seating', 'Hospitality', 'Restaurant dining area with red booth seating and decorative ceiling lights'],
  ['34_RETAIL (2).jpg', 'dollar-general-storefront', 'Dollar General storefront', 'Commercial', 'Dollar General storefront across a paved parking area'],
  ['35_SPORT AUTHORITY.jpg', 'sports-authority-storefront', 'Sports Authority storefront', 'Commercial', 'Sports Authority entrance with a red sign tower and landscaped walkway'],
  ['36_ASSEMBLY.jpg', 'fountain-courtyard', 'Fountain courtyard', 'Commercial', 'Outdoor fountain and landscaped courtyard in front of commercial storefronts'],
  ['37_OFFICE BLDG.jpg', 'office-building-and-grounds', 'Office building and grounds', 'Commercial', 'Office building with reflective windows, mature trees, and parking spaces'],
  ['38_AQUARIUM.jpg', 'aquarium-display', 'Aquarium display', 'Recreation', 'Large aquarium display with fish and a central coral-like rock formation'],
  ['39_ZONA FRESCA.jpg', 'zona-fresca-storefront', 'Zona Fresca storefront', 'Hospitality', 'Zona Fresca storefront with orange umbrellas over outdoor tables'],
  ['40_FIVE GUYS (2).jpg', 'five-guys-service-counter', 'Five Guys service counter', 'Hospitality', 'Five Guys ordering counter with red-and-white tile and overhead menus'],
  ['41_HOODS.jpg', 'commercial-kitchen-hood', 'Commercial kitchen hood', 'Building systems', 'Commercial kitchen service opening and stainless-steel exhaust hood'],
  ['42_ICE RINK.jpg', 'indoor-ice-rink', 'Indoor ice rink', 'Recreation', 'Indoor ice rink beneath a steel roof with suspended lighting'],
  ['43_INSTITUTION.jpg', 'florida-career-college-entrance', 'Florida Career College entrance', 'Education', 'Florida Career College storefront entrance with an awning and window graphics'],
  ['44_MEDICAL BLDG.jpg', 'medical-building-exterior', 'Medical building exterior', 'Healthcare', 'Medical building exterior with tall entrance columns viewed from the street'],
  ['45_RESTAURANTS (2).jpg', 'restaurant-table-seating', 'Restaurant table seating', 'Hospitality', 'Restaurant dining room with white tablecloths, a long bar, and perimeter windows'],
  ['46_RETAIL (5).jpg', 'retail-plaza-storefronts', 'Retail plaza storefronts', 'Commercial', 'Retail plaza corner tower with restaurant and frozen yogurt storefronts'],
  ['47_TOWNHOUSES.jpg', 'townhouse-streetscape', 'Townhouse streetscape', 'Residential', 'Townhouse streetscape with garage doors, parked vehicles, and palm trees'],
  ['48_RETAIL.jpg', 'citi-trends-storefront', 'Citi Trends storefront', 'Commercial', 'Citi Trends storefront with vehicles parked outside the entrance'],
  ['49_COOLING TOWER REPLACEMENT.jpg', 'cooling-tower-replacement', 'Cooling tower replacement', 'Building systems', 'Crane positioned beside a multi-story building'],
  ['50_HI RISE.jpg', 'high-rise-building', 'High-rise building', 'Architecture', 'High-rise building with balconies, a curved lower facade, and palm trees'],
].map(([sourceFilename, id, title, category, alt]) => ({ sourceFilename, id, title, category, alt }));

const previewIds = ['aircraft-hangar', 'zona-fresca-dining-room', 'townhouse-community', 'cooling-towers', 'medical-office-entrance', 'indoor-ice-rink'];

// Reviewed together at their natural ratios on qa/gallery/contact-sheet-*.jpg.
// Repeated subjects are retained when photographs show different views/details.
const visualReviews = [
  { files: ['04_MEDICAL BLDG (2).jpg', '44_MEDICAL BLDG.jpg'], reason: 'Different viewpoints of a medical building: entrance sign/landscape versus street-facing facade.' },
  { files: ['13_MIXED USE BUILDING.jpg', '19_plaza las americas.jpg'], reason: 'Different viewpoints and framing of the same building frontage, not duplicate photographs.' },
  { files: ['11_SPORT FACILITIES.jpg', '14_PRESCHOOL.jpg'], reason: 'Different storefront subjects and viewpoints in a similar plaza setting.' },
  { files: ['03_FIVE GUYS.jpg', '40_FIVE GUYS (2).jpg'], reason: 'Exterior storefront and interior ordering counter are distinct photographs.' },
  { files: ['28_ZONA FRESCA (2).jpg', '39_ZONA FRESCA.jpg'], reason: 'Interior dining room and exterior storefront are distinct photographs.' },
  { files: ['29_RESTAURANTS (3).jpg', '45_RESTAURANTS (2).jpg'], reason: 'Different restaurant views, furnishings, ceiling details, and framing.' },
  { files: ['30_TOWN HOUSES.jpg', '47_TOWNHOUSES.jpg'], reason: 'Different townhouse viewpoints: front entrances versus garages/streetscape.' },
  { files: ['06_CAFE (2).jpg', '31_CAFE.jpg'], reason: 'Café exterior and interior are distinct photographs; no shared location is inferred.' },
  { files: ['10_SCHOOLS.jpg', '24_FROZEN YOGURT.jpg'], reason: 'Perceptually similar dark storefront bands, but different school and food-service subjects.' },
  { files: ['03_FIVE GUYS.jpg', '48_RETAIL.jpg'], reason: 'Similar storefront composition, but different businesses and source photographs.' },
  { files: ['13_MIXED USE BUILDING.jpg', '34_RETAIL (2).jpg'], reason: 'Different building heights, facades, and surroundings despite similar horizontal composition.' },
  { files: ['24_FROZEN YOGURT.jpg', '34_RETAIL (2).jpg'], reason: 'Interior-facing food-service storefront versus exterior retail strip; different scenes.' },
];

const files = (await readdir(sourceDirectory)).filter(name => /\.jpe?g$/i.test(name)).sort();
const curatedNames = new Set(entries.map(entry => entry.sourceFilename));
const unknown = files.filter(name => !curatedNames.has(name));
const missing = entries.filter(entry => !files.includes(entry.sourceFilename));
if (unknown.length || missing.length) throw new Error(`Gallery needs editorial review before regeneration. Unknown: ${unknown.join(', ')}. Missing: ${missing.map(entry => entry.sourceFilename).join(', ')}`);

await mkdir(assetDirectory, { recursive: true });
await mkdir(path.join(root, 'docs'), { recursive: true });
const exactHashes = new Map();
const decodedHashes = new Map();
const inventory = [];
const published = [];

for (const entry of entries) {
  const sourcePath = path.join(sourceDirectory, entry.sourceFilename);
  const bytes = await readFile(sourcePath);
  const metadata = await sharp(bytes).metadata();
  const decoded = await sharp(bytes).rotate().toColourspace('srgb').removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const sha256 = hash(bytes);
  const decodedSha256 = hash(Buffer.concat([Buffer.from(`${decoded.info.width}x${decoded.info.height}x${decoded.info.channels}:`), decoded.data]));
  const grayscale = await sharp(bytes).rotate().resize(9, 8, { fit: 'fill', kernel: 'lanczos3' }).greyscale().raw().toBuffer();
  let differenceHash = 0n;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    differenceHash = (differenceHash << 1n) | BigInt(grayscale[y * 9 + x] > grayscale[y * 9 + x + 1] ? 1 : 0);
  }
  const duplicate = exactHashes.get(sha256) || decodedHashes.get(decodedSha256);
  const duplicateKind = duplicate ? (exactHashes.has(sha256) ? 'exact-file' : 'decoded-pixels') : null;
  const outputFile = `src/assets/gallery/${duplicate?.id || entry.id}.webp`;
  let outputMetadata;
  if (!duplicate) {
    await sharp(bytes).rotate().webp({ quality: 88, effort: 6 }).toFile(path.join(root, outputFile));
    outputMetadata = await sharp(path.join(root, outputFile)).metadata();
    published.push(entry);
    exactHashes.set(sha256, entry);
    decodedHashes.set(decodedSha256, entry);
  } else {
    outputMetadata = await sharp(path.join(root, outputFile)).metadata();
  }
  inventory.push({
    ...entry,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    originalBytes: bytes.length,
    sha256,
    decodedSha256,
    differenceHash: differenceHash.toString(16).padStart(16, '0'),
    published: !duplicate,
    duplicateOf: duplicate?.sourceFilename || null,
    duplicateKind,
    outputFile,
    outputWidth: outputMetadata.width,
    outputHeight: outputMetadata.height,
    outputBytes: (await stat(path.join(root, outputFile))).size,
  });
}

function hamming(a, b) {
  let bits = BigInt(`0x${a}`) ^ BigInt(`0x${b}`);
  let count = 0;
  while (bits) { count += Number(bits & 1n); bits >>= 1n; }
  return count;
}

const pairs = [];
for (let i = 0; i < inventory.length; i++) for (let j = i + 1; j < inventory.length; j++) {
  const a = inventory[i]; const b = inventory[j];
  pairs.push({ files: [a.sourceFilename, b.sourceFilename], differenceHashDistance: hamming(a.differenceHash, b.differenceHash) });
}
pairs.sort((a, b) => a.differenceHashDistance - b.differenceHashDistance);
const categories = [...new Set(published.map(entry => entry.category))];
const imports = published.map((entry, index) => `import image${index + 1} from '../assets/gallery/${entry.id}.webp';`).join('\n');
const itemCode = published.map((entry, index) => `  { id: ${JSON.stringify(entry.id)}, title: ${JSON.stringify(entry.title)}, category: ${JSON.stringify(entry.category)}, image: image${index + 1}, alt: ${JSON.stringify(entry.alt)}, sourceFilename: ${JSON.stringify(entry.sourceFilename)} },`).join('\n');
const code = `// Generated by scripts/prepare-gallery.mjs from reviewed, user-supplied photographs.\n// Edit the curated entries in that script, then regenerate this file.\nimport type { ImageMetadata } from 'astro';\n${imports}\n\nexport type GalleryCategory = ${categories.map(category => JSON.stringify(category)).join(' | ')};\nexport interface GalleryItem {\n  id: string;\n  title: string;\n  category: GalleryCategory;\n  image: ImageMetadata;\n  alt: string;\n  sourceFilename: string;\n}\n\nexport const galleryItems: GalleryItem[] = [\n${itemCode}\n];\n\nexport const galleryCategories: GalleryCategory[] = [...new Set(galleryItems.map(item => item.category))];\n\nexport const galleryPreviewIds: string[] = ${JSON.stringify(previewIds, null, 2)};\n`;
await writeFile(path.join(root, 'src', 'data', 'gallery.ts'), code, 'utf8');

const missingNumbers = Array.from({ length: 50 }, (_, index) => index + 1).filter(number => !entries.some(entry => Number(entry.sourceFilename.slice(0, 2)) === number));
const dimensionCounts = {};
for (const item of inventory) {
  const key = `${item.originalWidth}x${item.originalHeight}`;
  dimensionCounts[key] = (dimensionCounts[key] || 0) + 1;
  item.matchedOriginals = inventory.filter(other => other.outputFile === item.outputFile).map(other => other.sourceFilename);
}
const manifest = {
  sourceDirectory,
  sourcePreservation: 'All user files are read only and remain unchanged in the archive. Only genuine duplicate copies would be excluded from the published set; different views are retained.',
  sourceCount: inventory.length,
  publishedCount: published.length,
  excludedDuplicateCount: inventory.length - published.length,
  missingNumberedFiles: missingNumbers,
  dimensionCounts,
  output: { format: 'webp', quality: 88, enlargement: false, resizing: false, orientation: 'EXIF orientation applied, if present', naturalAspectRatio: true },
  duplicateAudit: {
    exact: 'SHA-256 of original file bytes',
    decoded: 'SHA-256 of EXIF-oriented, sRGB, three-channel decoded pixels with dimensions prefixed',
    perceptual: '64-bit horizontal difference hash from a 9x8 grayscale Lanczos3 resize; distance <= 8 flags a candidate for visual review, never automatic exclusion',
    perceptualCandidateThreshold: 8,
    perceptualCandidates: pairs.filter(pair => pair.differenceHashDistance <= 8),
    closestPairs: pairs.slice(0, 10),
    visualReview: visualReviews.map(review => ({ ...review, decision: 'retain-both', differenceHashDistance: hamming(inventory.find(item => item.sourceFilename === review.files[0]).differenceHash, inventory.find(item => item.sourceFilename === review.files[1]).differenceHash) })),
    reviewScope: 'All 48 images inspected on three labeled contact sheets; repeated subjects and closest-composition pairs compared. No exact, decoded, or visually duplicated photograph was found.',
  },
  editorialNotes: [
    'The numbered collection has 48 JPEGs, not 50. Numbers 27 and 32 are absent; the jbcore subdirectory contains gallery software rather than photographs.',
    'Repeated business names do not establish duplicate photographs or a shared location. Distinct interiors, exteriors, and viewpoints remain published.',
    'Architecture is used for the high-rise image because the source does not establish whether it is residential, commercial, or hospitality.',
    'Historical brand names shown in the supplied files are retained. No current operating status, address, date, or engineering scope is inferred.',
    'Every source is 350 pixels high. Thumbnail and lightbox layouts should respect the source dimensions rather than stretch these images into full-width banners.',
  ],
  galleryPreviewIds: previewIds,
  items: inventory,
};
await writeFile(path.join(root, 'docs', 'gallery-inventory.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Gallery: ${inventory.length} original JPEGs, ${published.length} published WebP images, ${inventory.length - published.length} duplicate copies excluded.`);
console.log(`Source dimensions: ${JSON.stringify(dimensionCounts)}. Missing numbers: ${missingNumbers.join(', ')}.`);
console.log(`Closest perceptual pair distance: ${pairs[0]?.differenceHashDistance}. Candidates at distance <= 8: ${manifest.duplicateAudit.perceptualCandidates.length}.`);
