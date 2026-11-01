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
      'Built the complete **Flutter frontend** of the **Driver & Medic** mobile application, every screen from start to finish.',
      'Implemented the **trip-lifecycle** screens — request, acceptance, live status, completion — and the **real-time GPS tracking** views.',
      'Built the post-trip EMS (Emergency Medical Services) reporting modules, with **validation rules protecting data integrity** across high-criticality logistics records.',
    ],
    tech: ['FLUTTER', 'FIREBASE', 'REAL_TIME_DATA', 'MOBILE_UI', 'DATA_INTEGRITY'],
  },
];
