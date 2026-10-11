import type { ImageMetadata } from 'astro';
import mayami from '../assets/projects/mayami-wynwood.webp';
import cafeFortLauderdale from '../assets/projects/cafe-bastille-fort-lauderdale.webp';
import foxtail from '../assets/projects/foxtail-coffee-sarasota.webp';
import boulan from '../assets/projects/boulan-wynwood.webp';
import mazda from '../assets/projects/grieco-mazda-delray-beach.webp';
import kinetic from '../assets/projects/kinetic-racquet-club.webp';
import rokaHula from '../assets/projects/roka-hula.webp';
import sirocco from '../assets/projects/sirocco.webp';
import cafeWeston from '../assets/projects/cafe-bastille-weston.webp';
import francesco from '../assets/projects/francesco.webp';
import puraVida from '../assets/projects/pura-vida.webp';
import bayaBar from '../assets/projects/baya-bar.webp';
import popeyes from '../assets/projects/popeyes.webp';
import pureGreen from '../assets/projects/pure-green.webp';
import improvLogo from '../assets/logos/improv.webp';
import goldenKrustLogo from '../assets/logos/golden-krust.webp';
import mazdaLogo from '../assets/logos/mazda.webp';
import sushiSakeLogo from '../assets/logos/sushi-sake.webp';
import voodooLogo from '../assets/logos/voodoo-bayou.webp';
import puraVidaLogo from '../assets/logos/pura-vida.webp';
import woofGangLogo from '../assets/logos/woof-gang.webp';

export const sectors = ['Hospitality', 'Retail', 'Workplace', 'Residential', 'Recreation', 'Healthcare', 'Education', 'Civic'] as const;
export type ProjectSector = (typeof sectors)[number];

export interface Project {
  slug: string;
  name: string;
  location: string;
  sector: ProjectSector;
  image: ImageMetadata;
  alt: string;
  description: string;
  architect?: string;
  area?: string;
  areaSource?: string;
  featured?: boolean;
  gallery?: { image: ImageMetadata; alt: string }[];
}

// Names and locations come from PROJECTS.xlsx, info.md and supplied photo labels.
// Descriptions identify project context. Exact engineering scopes and completion
// dates are intentionally omitted until confirmed by the project team.
export const projects: Project[] = [
  {
    slug: 'mayami-wynwood',
    name: 'Mayami Wynwood',
    location: 'Miami, FL',
    sector: 'Hospitality',
    image: mayami,
    alt: 'Mayami Wynwood dining room with woven pendant lights and warm wood finishes',
    description: 'An expressive dining destination in Miami’s Wynwood neighborhood. Mayami brings together richly textured interiors, an open dining room and a distinctive hospitality experience.',
    architect: 'JPC Projects Miami',
    featured: true,
  },
  {
    slug: 'cafe-bastille-fort-lauderdale',
    name: 'Café Bastille',
    location: 'Fort Lauderdale, FL',
    sector: 'Hospitality',
    image: cafeFortLauderdale,
    alt: 'Café Bastille exterior in Fort Lauderdale with an outdoor terrace and palms',
    description: 'A French-inspired café with a landscaped outdoor terrace in Fort Lauderdale. This location is part of our experience with cafés and restaurant spaces across South Florida.',
    featured: true,
  },
  {
    slug: 'foxtail-coffee-sarasota',
    name: 'Foxtail Coffee Co.',
    location: 'Sarasota, FL',
    sector: 'Hospitality',
    image: foxtail,
    alt: 'Foxtail Coffee Sarasota interior with a long service counter, stools and exposed ceiling',
    description: 'A neighborhood coffee shop on North Cattlemen Road in Sarasota. Its open interior brings the service counter, seating and daily café activity into one welcoming space.',
    architect: 'AW Architect',
    featured: true,
  },
  {
    slug: 'grieco-mazda-delray-beach',
    name: 'Grieco Mazda',
    location: 'Delray Beach, FL',
    sector: 'Retail',
    image: mazda,
    alt: 'Grieco Mazda dealership exterior in Delray Beach with a glass showroom frontage',
    description: 'An automotive dealership on South Federal Highway in Delray Beach. The project forms part of our commercial portfolio serving Florida’s retail and automotive businesses.',
    architect: 'Greg Molina',
  },
  {
    slug: 'kinetic-racquet-club',
    name: 'Kinetic Indoor Racquet Club',
    location: 'Boynton Beach, FL',
    sector: 'Recreation',
    image: kinetic,
    alt: 'Kinetic Indoor Racquet Club entrance in Boynton Beach with yellow accents and palm trees',
    description: 'An indoor racquet sports facility in Boynton Beach. Kinetic adds a dedicated recreation setting to our experience across commercial spaces and community destinations.',
    architect: 'AW Architect',
  },
  {
    slug: 'boulan-wynwood',
    name: 'Boûlan Wynwood',
    location: 'Miami, FL',
    sector: 'Hospitality',
    image: boulan,
    alt: 'Boûlan Wynwood bakery exterior with a yellow canopy and glass storefront',
    description: 'A bakery in Miami’s Wynwood neighborhood, with a bright street-facing storefront. Boûlan is part of our portfolio of bakery, café and restaurant projects.',
  },
  {
    slug: 'roka-hula',
    name: 'Roka Hula',
    location: 'Delray Beach, FL',
    sector: 'Hospitality',
    image: rokaHula,
    alt: 'Roka Hula restaurant and bar frontage on Atlantic Avenue at night',
    description: 'A restaurant and bar on East Atlantic Avenue in Delray Beach. The intimate venue joins our collection of hospitality projects throughout Florida.',
    architect: 'Craig Mossey',
    area: '3,275 sq ft (venue)',
    areaSource: 'https://rccassociates.com/rokahula',
  },
  {
    slug: 'sirocco',
    name: 'Sirocco',
    location: 'South Florida',
    sector: 'Hospitality',
    image: sirocco,
    alt: 'Sirocco Mediterranean Restaurant and Lounge exterior with arched facade details',
    description: 'Mediterranean dining and lounge spaces in South Florida. Our project portfolio includes Sirocco locations in Pembroke Pines and Dania Beach.',
  },
  {
    slug: 'cafe-bastille-weston',
    name: 'Café Bastille Weston',
    location: 'Weston, FL',
    sector: 'Hospitality',
    image: cafeWeston,
    alt: 'Café Bastille Weston storefront with a pale green facade and clay tile roof',
    description: 'A café in Weston with a distinctive corner entrance. This project extends our experience with the Café Bastille brand across South Florida.',
  },
  {
    slug: 'francesco',
    name: 'Francesco',
    location: 'Coral Gables, FL',
    sector: 'Hospitality',
    image: francesco,
    alt: 'Francesco restaurant entrance on Miracle Mile in Coral Gables',
    description: 'A restaurant on Miracle Mile in Coral Gables. Francesco is part of our work with the architects and owners behind South Florida’s dining destinations.',
    architect: 'Vertical Design',
  },
  {
    slug: 'pura-vida',
    name: 'Pura Vida Miami',
    location: 'South Florida',
    sector: 'Hospitality',
    image: puraVida,
    alt: 'Pura Vida Miami café frontage with outdoor tables and umbrellas',
    description: 'A fresh casual dining concept with bright, welcoming spaces. Pura Vida Miami is part of our restaurant and café portfolio.',
  },
  {
    slug: 'baya-bar',
    name: 'Baya Bar',
    location: 'Boca Raton, FL',
    sector: 'Hospitality',
    image: bayaBar,
    alt: 'Baya Bar storefront in Boca Raton',
    description: 'A neighborhood food and beverage destination in Boca Raton. Baya Bar is part of our experience with compact commercial hospitality spaces.',
    architect: 'AW Architect',
  },
  {
    slug: 'popeyes',
    name: 'Popeyes Louisiana Kitchen',
    location: 'Broward County, FL',
    sector: 'Hospitality',
    image: popeyes,
    alt: 'Popeyes Louisiana Kitchen exterior with a drive-through lane',
    description: 'A quick-service restaurant project in Broward County. Popeyes is part of our work across restaurant formats, from neighborhood cafés to national brands.',
    architect: 'AW Architect',
  },
  {
    slug: 'pure-green',
    name: 'Pure Green',
    location: 'South Florida',
    sector: 'Hospitality',
    image: pureGreen,
    alt: 'Pure Green juice and smoothie shop entrance',
    description: 'Juice and smoothie shops serving South Florida. Our project roster includes Pure Green locations in Sawgrass and Coral Springs.',
    architect: 'JAO Architect',
  },
];

// One entry per nonempty project row in the supplied workbook (33 rows).
// Some rows contain several locations; this is not a count of unique buildings.
export const projectIndex: { name: string; location: string; sector: string }[] = [
  { name: 'Calavera’s Cantina', location: 'Boca Raton, FL', sector: 'Hospitality' },
  { name: 'Improv Comedy Club', location: 'Dania Beach, FL', sector: 'Recreation' },
  { name: 'Improv Comedy Club', location: 'Doral, FL', sector: 'Recreation' },
  { name: 'Voodoo Bayou', location: 'Orlando, FL', sector: 'Hospitality' },
  { name: 'Roka Hula Restaurant and Bar', location: 'Delray Beach, FL', sector: 'Hospitality' },
  { name: 'Camachee Cove', location: 'St. Augustine, FL', sector: 'Hospitality' },
  { name: 'Sirocco Mediterranean Restaurant & Lounge', location: 'Pembroke Pines, FL', sector: 'Hospitality' },
  { name: 'Sirocco Mediterranean Restaurant & Lounge', location: 'Dania Beach, FL', sector: 'Hospitality' },
  { name: 'Bosphorous Turkish Cuisine', location: 'Wesley Chapel, FL', sector: 'Hospitality' },
  { name: 'Mayami Wynwood', location: 'Miami, FL', sector: 'Hospitality' },
  { name: 'Sushi Sake', location: 'Pembroke Pines, Hollywood, Weston & Tallahassee, FL', sector: 'Hospitality' },
  { name: 'Oro Miami', location: 'Miami Beach, FL', sector: 'Hospitality' },
  { name: 'The Trail Lofts', location: 'Miami, FL · five buildings', sector: 'Residential' },
  { name: 'Bachour Design District', location: 'Miami Design District, FL', sector: 'Hospitality' },
  { name: 'Boûlan Wynwood', location: 'Miami, FL', sector: 'Hospitality' },
  { name: 'Francesco', location: 'Coral Gables, FL', sector: 'Hospitality' },
  { name: 'Baya Bar', location: 'Boca Raton, FL', sector: 'Hospitality' },
  { name: 'Popeyes Louisiana Kitchen', location: 'Broward County, FL', sector: 'Hospitality' },
  { name: 'Seabra Bakery & Café', location: 'Tampa, Doral, Deerfield Beach & Pompano Beach, FL', sector: 'Hospitality' },
  { name: 'Foxtail Coffee Co.', location: 'Sarasota, FL', sector: 'Hospitality' },
  { name: 'Golden Krust', location: 'Florida', sector: 'Hospitality' },
  { name: 'Burlington', location: 'Kissimmee, FL', sector: 'Retail' },
  { name: 'Burlington', location: 'Fort Myers, FL', sector: 'Retail' },
  { name: 'Burlington', location: 'Cutler Bay, FL', sector: 'Retail' },
  { name: 'Biscayne 18 Office Complex', location: 'North Miami Beach, FL', sector: 'Workplace' },
  { name: 'Montessori School', location: 'Hollywood, Hallandale & West Palm Beach, FL', sector: 'Education' },
  { name: 'Kinetic Indoor Racquet Club', location: 'Boynton Beach, FL', sector: 'Recreation' },
  { name: 'Woof Gang', location: 'Deerfield Beach, FL', sector: 'Retail' },
  { name: 'Woof Gang', location: 'Middleton, FL', sector: 'Retail' },
  { name: 'Grieco Mazda', location: 'Delray Beach, FL', sector: 'Retail' },
  { name: 'Mazda Coconut Creek', location: 'Coconut Creek, FL', sector: 'Retail' },
  { name: 'Pure Green', location: 'Sawgrass & Coral Springs, FL', sector: 'Hospitality' },
  { name: 'Ocala Plastic Surgery', location: 'Ocala, FL', sector: 'Healthcare' },
];

export const clientLogos: { name: string; image: ImageMetadata }[] = [
  { name: 'Improv Comedy Theatre', image: improvLogo },
  { name: 'Golden Krust', image: goldenKrustLogo },
  { name: 'Grieco Mazda', image: mazdaLogo },
  { name: 'Sushi Sake', image: sushiSakeLogo },
  { name: 'Voodoo Bayou', image: voodooLogo },
  { name: 'Pura Vida Miami', image: puraVidaLogo },
  { name: 'Woof Gang', image: woofGangLogo },
];
