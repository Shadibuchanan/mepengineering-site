import type { ProjectSector } from './projects';

// Historical experience from the user-supplied website archive:
// C:/Users/Shadi/www.mepengineers.com/portfolio.html
// C:/Users/Shadi/www.mepengineers.com/mechanical.html
// These records mix brands, communities and programs. They are not a count of
// unique sites, and the archive does not establish dates or individual scopes.
// Locations are omitted unless the archive explicitly identifies the place.
// Sector tags describe clear venue/client categories, not engineering scope.
export const legacyProjects: {
  name: string;
  sector?: ProjectSector;
  location?: string;
}[] = [
  // portfolio.html: legacy client list. Popeyes already appears in projectIndex.
  { name: 'Smoothie King', sector: 'Hospitality' },
  { name: 'Taverna Opa', sector: 'Hospitality' },
  { name: 'Dunkin Donuts', sector: 'Hospitality' },
  { name: 'Shoney’s', sector: 'Hospitality' },
  { name: 'Beef O’Brady’s', sector: 'Hospitality' },
  { name: 'Subway', sector: 'Hospitality' },
  { name: 'Little Caesars', sector: 'Hospitality' },
  { name: 'Family Dollar', sector: 'Retail' },
  { name: 'MetroPCS', sector: 'Retail' },
  { name: 'FedEx' },
  { name: 'Marshalls', sector: 'Retail' },
  { name: 'Office Depot', sector: 'Retail' },
  { name: 'T.J. Maxx', sector: 'Retail' },
  { name: 'Barnes & Noble', sector: 'Retail' },
  { name: 'Citi Trends', sector: 'Retail' },
  { name: 'Motorola' },
  { name: 'Sears', sector: 'Retail' },
  { name: 'Quest Diagnostics', sector: 'Healthcare' },
  { name: 'Barry University', sector: 'Education' },
  { name: 'Chevron Gas', sector: 'Retail' },
  { name: 'Anna’s Linens', sector: 'Retail' },
  { name: 'Solantic', sector: 'Healthcare' },
  { name: 'Cintas' },
  { name: 'Triple M Petroleum' },
  { name: 'Gentle Dental', sector: 'Healthcare' },
  { name: 'Yellow Green Market', sector: 'Retail' },
  { name: 'Hiros Japanese Restaurant', sector: 'Hospitality' },
  { name: 'Riva Motorsports', sector: 'Retail' },
  { name: 'Festival Flea Market', sector: 'Retail' },
  { name: 'Sonny’s BBQ', sector: 'Hospitality' },
  { name: 'Arnet Pharmaceuticals' },
  { name: 'Boardwalk Fresh Burgers', sector: 'Hospitality' },

  // portfolio.html: additional restaurant and retail names in the narrative.
  { name: 'Anthony’s Coal Oven Pizza', sector: 'Hospitality' },
  { name: 'Friendly’s', sector: 'Hospitality' },
  { name: 'Sal’s', sector: 'Hospitality' },
  // The archive spells this name "Carrlucci"; confirm before renaming it.
  { name: 'Carrlucci', sector: 'Hospitality' },
  { name: 'Versace', sector: 'Retail' },
  { name: 'Mayors', sector: 'Retail' },
  // The archive spells this name "Swim & Sports"; official spelling unconfirmed.
  { name: 'Swim & Sports', sector: 'Retail' },
  { name: 'Sherwin Williams', sector: 'Retail' },

  // portfolio.html: residential communities. Central Park is mentioned twice
  // in one paragraph and retained once; no community locations are supplied.
  { name: 'Lennar Homes — Central Park', sector: 'Residential' },
  { name: 'Bent Creek', sector: 'Residential' },
  { name: 'White Marsh', sector: 'Residential' },
  { name: 'Diamond Lakes', sector: 'Residential' },
  { name: 'Silver Oaks', sector: 'Residential' },
  { name: 'Bella Terra', sector: 'Residential' },
  { name: 'SweetLakes Villas', sector: 'Residential' },
  { name: 'Millstone', sector: 'Residential' },
  { name: 'Polo Club', sector: 'Residential' },

  // mechanical.html: About Us paragraph, also repeated on other service pages.
  // Keep school programs grouped; the archive's abbreviated school names are
  // insufficient to identify individual institutions or campuses reliably.
  { name: 'Sunrise Facade Improvements', sector: 'Civic', location: 'Sunrise, FL' },
  { name: 'Deerfield Beach Facade Improvements', sector: 'Civic', location: 'Deerfield Beach, FL' },
  { name: 'Sunrise Tennis Club', sector: 'Recreation', location: 'Sunrise, FL' },
  { name: 'Broward County Schools', sector: 'Education', location: 'Broward County, FL' },
  { name: 'Florida Career College', sector: 'Education' },
  // Despite the institution's name, the archived paragraph explicitly says Broward.
  { name: 'Technical College of Miami', sector: 'Education', location: 'Broward County, FL' },
];
