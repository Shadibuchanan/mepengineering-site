import type { ImageMetadata } from 'astro';
import mechanical from '../assets/legacy/pic31.jpg';
import electrical from '../assets/legacy/pic32.jpg';
import plumbing from '../assets/legacy/pic33.jpg';
import kitchenHoods from '../assets/legacy/pic34.jpg';
import fireAlarm from '../assets/legacy/pic36.jpg';
import fireSprinkler from '../assets/legacy/pic17.jpg';
import buildingServices from '../assets/legacy/banner.jpg';
import mechanicalDetail from '../assets/legacy/pic23.jpg';
import sprinklerDetail from '../assets/legacy/pic30.jpg';

export interface EngineeringImage {
  image: ImageMetadata;
  alt: string;
  caption: string;
}

// Original photographs copied unchanged from the user-supplied website archive.
// Subject descriptions do not identify an unconfirmed project or location.
export const serviceImages: Record<string, EngineeringImage> = {
  mechanical: {
    image: mechanical,
    alt: 'A production room with stainless-steel equipment and overhead lighting',
    caption: 'Commercial production spaces.',
  },
  electrical: {
    image: electrical,
    alt: 'Open electrical distribution equipment with fuses and disconnect switches',
    caption: 'Electrical distribution equipment.',
  },
  plumbing: {
    image: plumbing,
    alt: 'Building water-service piping with a blue meter assembly and red isolation valves',
    caption: 'Water-service piping and valves.',
  },
  'kitchen-hoods': {
    image: kitchenHoods,
    alt: 'Rooftop kitchen exhaust fan with a metal housing',
    caption: 'Commercial kitchen exhaust equipment.',
  },
  'fire-alarm': {
    image: fireAlarm,
    alt: 'A bank of wall-mounted fire alarm and building control panels',
    caption: 'Fire alarm and building controls.',
  },
  'fire-sprinkler': {
    image: fireSprinkler,
    alt: 'A retail shop interior with merchandise displays and overhead lighting',
    caption: 'Retail sales floor.',
  },
};

export const engineeringImage: EngineeringImage = {
  image: buildingServices,
  alt: 'Outdoor building-services piping with large valves and insulated pipe connections',
  caption: 'Building-services piping and valves.',
};

export const mechanicalDetailImage: EngineeringImage = {
  image: mechanicalDetail,
  alt: 'Insulated metal air ducts suspended below exposed roof framing',
  caption: 'Air distribution and ductwork.',
};

export const sprinklerDetailImage: EngineeringImage = {
  image: sprinklerDetail,
  alt: 'A ceiling-mounted fire sprinkler head discharging water',
  caption: 'Automatic fire sprinkler protection.',
};
