export interface Service {
  slug: string;
  number: string;
  name: string;
  shortName: string;
  summary: string;
  headline: string;
  accent: string;
  introduction: string;
  paragraphs: string[];
  capabilities: string[];
  source: string;
}

// Service details checked against the user-supplied www.mepengineers.com HTML
// archive. Repeated template sidebars and unverified certification claims are omitted.
export const services: Service[] = [
  {
    slug: 'mechanical',
    number: '01',
    name: 'Mechanical Engineering',
    shortName: 'Mechanical',
    summary: 'HVAC design, duct layouts, equipment specifications, and ventilation calculations.',
    headline: 'Mechanical',
    accent: 'Engineering',
    introduction: 'Heating, cooling, and ventilation design for residential, commercial, and industrial buildings.',
    paragraphs: [
      'We design HVAC systems for custom residences, restaurants, and commercial and industrial buildings. Typical plans include duct sizing and layout, outside air and load calculations, equipment specifications, and mounting details.',
      'Our services also include facility assessments, energy audits, feasibility studies, and life-cycle cost analysis. We coordinate the mechanical plans with architectural and electrical drawings.',
    ],
    capabilities: [
      'Heating and cooling load calculations',
      'HVAC equipment selection and specifications',
      'Duct sizing and layout',
      'Outside air and ventilation calculations',
      'Equipment mounting details',
      'Energy recovery and temperature controls',
      'Facility assessments and energy audits',
      'Feasibility studies and life-cycle cost analysis',
      'Central chiller and heating plants',
      'Industrial ventilation',
      'Ice storage systems',
      'Solar thermal systems',
    ],
    source: 'https://www.mepengineers.com/mechanical.html',
  },
  {
    slug: 'electrical',
    number: '02',
    name: 'Electrical Engineering',
    shortName: 'Electrical',
    summary: 'Power distribution, lighting, electrical calculations, panel schedules, and riser diagrams.',
    headline: 'Electrical',
    accent: 'Engineering',
    introduction: 'Power, lighting, and electrical system design for residential and commercial buildings.',
    paragraphs: [
      'We design electrical systems for residential and commercial buildings, coordinating power distribution and lighting with the project’s equipment and intended use.',
      'Our work includes electrical layouts, circuiting, load calculations, panel schedules, and riser diagrams. For projects with specialized needs, our experience extends to standby power, uninterruptible power supplies, grounding, and site lighting. We also provide electrical system assessments and studies for fault current, arc flash, and coordination.',
    ],
    capabilities: [
      'Power distribution and electrical load calculations',
      'Lighting layouts and controls',
      'Equipment power and outlet layouts',
      'Panel schedules and riser diagrams',
      'Grounding, standby power, and UPS systems',
      'Site, roadway, and exterior lighting',
      'Electrical system assessments and planning',
      'Medium-voltage distribution and cogeneration systems',
      'Fault-current, arc-flash, and coordination studies',
      'Low-voltage, communications, and public-address systems',
      'Solar photovoltaic systems',
      'Power quality management',
    ],
    source: 'https://www.mepengineers.com/electrical.html',
  },
  {
    slug: 'plumbing',
    number: '03',
    name: 'Plumbing Engineering',
    shortName: 'Plumbing',
    summary: 'Water, sewer, gas, roof drainage, and specialty commercial plumbing plans.',
    headline: 'Plumbing',
    accent: 'Engineering',
    introduction: 'Water, sewer, and gas plans with isometric diagrams and construction details.',
    paragraphs: [
      'We prepare coordinated water, sewer, and gas plans with isometric diagrams and construction details. Each design responds to the building’s use, equipment, and utility requirements.',
      'Our project experience includes restaurant grease-waste systems, dental vacuum and compressed air, car-wash facilities, and building roof drainage. Specialized services include backflow prevention, acid-waste systems, and process piping.',
    ],
    capabilities: [
      'Domestic water and sanitary sewer systems',
      'Gas piping plans and isometric diagrams',
      'Hot-water and recirculation systems',
      'Grease-waste plumbing and grease-trap sizing',
      'Roof drainage',
      'Specialty plumbing for commercial facilities',
      'Backflow prevention',
      'Acid-waste systems and process piping',
      'Dental vacuum and compressed-air systems',
    ],
    source: 'https://www.mepengineers.com/plumbing.html',
  },
  {
    slug: 'kitchen-hoods',
    number: '04',
    name: 'Kitchen Hood Design',
    shortName: 'Kitchen Hoods',
    summary: 'Coordinated hood, exhaust, and fire-protection design for commercial kitchens.',
    headline: 'Kitchen Hood',
    accent: 'Design',
    introduction: 'Hood sizing, exhaust duct design, fan specifications, and fire suppression for commercial kitchens.',
    paragraphs: [
      'We design commercial kitchen hoods and exhaust systems, including hood layouts, grease-duct fire ratings, air velocity calculations, and fan attachment details.',
      'We consider field conditions and installation costs as we develop the hood and fan specifications. Hood fire-suppression design is coordinated with the exhaust system.',
    ],
    capabilities: ['Hood sizing and layout', 'Exhaust duct design', 'Grease-duct fire rating details', 'Air velocity calculations', 'Fan sizing and attachment details', 'Hood fire-suppression design'],
    source: 'https://www.mepengineers.com/hoods.html',
  },
  {
    slug: 'fire-alarm',
    number: '05',
    name: 'Fire Alarm Design',
    shortName: 'Fire Alarm',
    summary: 'Fire alarm layouts, battery-backup calculations, voltage-drop calculations, and riser diagrams.',
    headline: 'Fire Alarm',
    accent: 'Design',
    introduction: 'Fire alarm system plans, electrical calculations, and sequence-of-operation documentation.',
    paragraphs: [
      'We prepare fire alarm designs with system layouts, power requirements, and operational notes.',
      'Our documentation includes battery-backup and voltage-drop calculations, riser diagrams, and sequence-of-operation notes and details.',
    ],
    capabilities: ['Fire alarm system design', 'Battery-backup calculations', 'Voltage-drop calculations', 'System riser diagrams', 'Sequence-of-operation notes', 'Coordinated system details'],
    source: 'https://www.mepengineers.com/fire-alarm.html',
  },
  {
    slug: 'fire-sprinkler',
    number: '06',
    name: 'Fire Sprinkler Design',
    shortName: 'Fire Sprinkler',
    summary: 'Sprinkler layouts and hydraulic calculations, integrated with the building systems.',
    headline: 'Fire Sprinkler',
    accent: 'Design',
    introduction: 'Fire sprinkler piping layouts, hydraulic calculations, and municipal water connection details.',
    paragraphs: [
      'We provide fire sprinkler system design and hydraulic calculations for building projects. We coordinate piping layouts and connections with the surrounding architectural and engineering plans.',
      'Our services cover sprinkler piping, municipal water connections, support details, and fire-penetration details. For commercial kitchens, we also provide hood fire-protection design, including Ansul systems.',
    ],
    capabilities: ['Fire sprinkler system layouts', 'Hydraulic calculations', 'Municipal water-source connection design', 'Piping design and coordination', 'Pipe support and fire-penetration details', 'Commercial hood fire protection, including Ansul systems'],
    source: 'https://www.mepengineers.com/fire-sprinkler.html',
  },
];
