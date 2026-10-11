import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Decode the file contents rather than relying on the supplied extensions.
// Several original .PNG files are actually WebP or AVIF. Originals stay intact.
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'logos_photos');
const projects = [
  ['MAYAMI.PNG', 'mayami-wynwood'],
  ['CAFE BASTILLE FT LAUDERDALE .PNG', 'cafe-bastille-fort-lauderdale'],
  ['FOXTAIL COFFEE SARASOTA.jpg', 'foxtail-coffee-sarasota'],
  ['BOULAN WYNWOOD.PNG', 'boulan-wynwood'],
  ['DELRAY MAZDA  .PNG', 'grieco-mazda-delray-beach'],
  ['KINETIC INDOOR RACQUET CLUB.PNG', 'kinetic-racquet-club'],
  ['ROKA HULA -DELRAY.jpg', 'roka-hula'],
  ['SIROCCO.png', 'sirocco'],
  ['CAFE BASTILLE WESTON.PNG', 'cafe-bastille-weston'],
  ['FRANCESCO RESTUARANT -MIAMI', 'francesco'],
  ['pura vida .jpg', 'pura-vida'],
  ['BAYA BAR.PNG', 'baya-bar'],
  ['POPEYES PLANTATION.PNG', 'popeyes'],
  ['PURE GREEN.PNG', 'pure-green'],
];
const logos = [
  ['improv-logo.png', 'improv'],
  ['Golden-Krust-Logo.png', 'golden-krust'],
  ['DELRAY MAZDA.PNG', 'mazda'],
  ['SUSHI SAKE .PNG', 'sushi-sake'],
  ['VOODOO  BAYOU.jpg', 'voodoo-bayou'],
  ['pura vida.png', 'pura-vida'],
  ['woof gang.png', 'woof-gang'],
];

for (const [folder, entries] of [['projects', projects], ['logos', logos]]) {
  const destination = path.join(root, 'src', 'assets', folder);
  await mkdir(destination, { recursive: true });
  for (const [filename, slug] of entries) {
    const output = path.join(destination, `${slug}.webp`);
    const input = sharp(path.join(source, filename));
    const metadata = await input.metadata();
    await input.rotate().webp({ quality: folder === 'logos' ? 95 : 92 }).toFile(output);
    console.log(`${folder}/${slug}.webp (${metadata.width} × ${metadata.height})`);
  }
}
