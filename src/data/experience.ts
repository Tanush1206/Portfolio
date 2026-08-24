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
  projectLink?: string;
}

export const experiences: ExperienceEntry[] = [
  {
    period:   '2025.10 // 2026.03',
    role:     'Junior_Manager',
    company:  '@AIESEC_in_Bengaluru',
    location: 'Bengaluru, India',
    highlights: [
      '[OCT-JAN] Managed operations for the **Outgoing Global Volunteer** department, facilitating international leadership opportunities.',
      '[FEB-MAR] Transitioned to the **Incoming Global Volunteer** department, overseeing project management and intern integration.',
      'Led cross-functional coordination to hit targets and expand programme reach across the Bengaluru entity.',
    ],
    tech: ['KPI_REPORTING', 'FUNNEL_ANALYSIS', 'LEADERSHIP', 'OGV_DEPT', 'IGV_DEPT'],
  },
  {
    period:   '2025.12 // 2026.01',
    role:     'App_Developer_Intern',
    company:  '@CYPARTA',
    location: 'Cairo , EGYPT',
    projectLink: '/projects#atw', // Linking to the projects page with a hash to trigger highlighting
    highlights: [
      'Modelled full **trip-lifecycle event data** — request, acceptance, live status, completion — producing a clean, queryable operational record.',
      'Worked with **real-time GPS telemetry** streams, handling ingestion, state updates and consistency across concurrent users.',
      'Engineered post-trip EMS (Emergency Medical Services) reporting modules with **validation rules protecting data integrity** across high-criticality logistics records.',
      'Developed the **Driver & Medic** mobile application end to end, shipped to a logistics client in Cairo.',
    ],
    tech: ['REAL_TIME_DATA', 'EVENT_MODELLING', 'DATA_INTEGRITY', 'FLUTTER', 'FIREBASE'],
  },
];
