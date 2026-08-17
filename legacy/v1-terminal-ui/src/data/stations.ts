// ─────────────────────────────────────────────
// STATIONS DATA — the flight globe's destinations
//
// Only four places, because only four places are real. Every location here
// is somewhere Tanush has actually been: Delhi (home), Pilani in Rajasthan
// (BITS), Bengaluru (AIESEC), and Cairo (CYPARTA). Nothing is invented to
// fill the map — a globe pin that isn't true is a résumé claim that isn't
// true.
//
// The weight sits on Delhi and Bengaluru, which is where the work happened.
// Cairo is the single international leg, matching experience.ts exactly.
//
// Coordinates are the real airport lat/lon, so the great-circle distances
// the globe renders are genuine.
// ─────────────────────────────────────────────

export interface Gate {
  /** Stable id, also used as the panel tab key. */
  id: string;
  /** Short tab label, aviation-flavoured. */
  label: string;
  /** Section name shown in the panel header. */
  title: string;
  /** The real route this gate mirrors — the globe never replaces it. */
  route: string;
}

export interface Station {
  code: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
  /** Drives the badge colour: home base, on-site, or international. */
  badge: 'home' | 'onsite' | 'intl';
  badgeText: string;
  /** One line on why this place is on the map at all. */
  note: string;
  gates: Gate[];
}

export const stations: Station[] = [
  {
    code: 'DEL',
    name: 'Indira Gandhi Intl',
    city: 'New Delhi',
    region: 'Delhi, India',
    lat: 28.5562,
    lon: 77.1000,
    badge: 'home',
    badgeText: 'HOME BASE',
    note: 'Home base — where the building happens. GMT+5:30.',
    gates: [
      { id: 'identity',     label: 'Identity',  title: 'Pilot in Command',   route: '/about' },
      { id: 'projects',     label: 'Hangar',    title: 'Deployment History', route: '/projects' },
      { id: 'certificates', label: 'Registry',  title: 'Credential Registry', route: '/certificates' },
      { id: 'contact',      label: 'Tower',     title: 'Ground Control',     route: '/contact' },
    ],
  },
  {
    code: 'BLR',
    name: 'Kempegowda Intl',
    city: 'Bengaluru',
    region: 'Karnataka, India',
    lat: 13.1986,
    lon: 77.7066,
    badge: 'onsite',
    badgeText: 'ON-SITE',
    note: 'AIESEC in Bengaluru — KPI reporting and funnel analysis, Oct 2025 to Mar 2026.',
    gates: [
      { id: 'experience', label: 'Logbook', title: 'Logged Hours',      route: '/experience' },
      { id: 'stack',      label: 'Loadout', title: 'Technical Loadout', route: '/skills' },
    ],
  },
  {
    code: 'JAI',
    name: 'Jaipur Intl',
    city: 'Pilani',
    region: 'Rajasthan, India',
    lat: 26.8242,
    lon: 75.8122,
    badge: 'onsite',
    badgeText: 'ON-SITE',
    note: 'BITS Pilani — Integrated B.Sc. in Computer Science, 2024 to 2028.',
    gates: [
      { id: 'education', label: 'Training', title: 'Training Record', route: '/education' },
    ],
  },
  {
    code: 'CAI',
    name: 'Cairo Intl',
    city: 'Cairo',
    region: 'Egypt',
    lat: 30.1219,
    lon: 31.4056,
    badge: 'intl',
    badgeText: 'INTERNATIONAL',
    note: 'CYPARTA — the Driver & Medic app shipped to a logistics client. The only leg that leaves India.',
    gates: [
      { id: 'experience', label: 'Logbook', title: 'Logged Hours', route: '/experience' },
    ],
  },
];

/** Route network drawn on the globe. Delhi and Bengaluru are the hubs. */
export const routeLinks: [string, string][] = [
  ['DEL', 'BLR'],
  ['DEL', 'JAI'],
  ['DEL', 'CAI'],
  ['BLR', 'JAI'],
  ['BLR', 'CAI'],
];

export const stationByCode = Object.fromEntries(
  stations.map((s) => [s.code, s]),
) as Record<string, Station>;

export const HOME_CODE = 'DEL';
