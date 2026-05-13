// ─────────────────────────────────────────────
// EXPERIENCE DATA — edit this file to update the experience section
// ─────────────────────────────────────────────

export interface ExperienceEntry {
  period:      string;
  role:        string;
  company:     string;
  location?:   string;
  highlights:  string[];
  tech:        string[];
}

export const experiences: ExperienceEntry[] = [
  {
    period:   '2025.12 // 2026.01',
    role:     'App_Developer_Intern',
    company:  '@CYPARTA',
    location: 'Cairo , EGYPT',
    highlights: [
      'Developed the **Driver & Medic** mobile application, focusing on high-criticality logistics and real-time coordination.',
      'Implemented end-to-end trip workflows including request acceptance, live status tracking, and navigation integration.',
      'Engineered post-trip EMS (Emergency Medical Services) reporting modules to ensure data integrity and rapid documentation.',
      'Collaborated on real-time features like GPS tracking and in-app notifications for seamless driver-medic communication.',
    ],
    tech: ['FLUTTER', 'FIREBASE', 'GPS_CORE', 'API_MESH'],
  },
];
