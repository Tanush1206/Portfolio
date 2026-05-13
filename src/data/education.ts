// ─────────────────────────────────────────────
// EDUCATION DATA — edit this file to update the education section
// ─────────────────────────────────────────────

export interface EducationEntry {
  index:       string;
  label:       string;
  institution: string;
  period:      string;
  degree:      string;
  description: string;
  tags:        string[];
  location?:   string;
  status:      string;
  statusIcon:  string;
  color:       'secondary' | 'default';
}

export const educationEntries: EducationEntry[] = [
  {
    index:       '01',
    label:       'HIGHER_LEARNING',
    institution: 'Scaler_School_of_Technology',
    period:      '2024 >> 2028',
    degree:      'Integrated_B.Sc._in_Computer_Science',
    description: 'Currently pursuing a dual-degree program in collaboration with BITS Pilani. Focus on advanced computer science fundamentals, data structures, and industry-aligned software engineering practices.',
    tags:        ['COMPUTER_SCIENCE', 'ALGORITHMS', 'SYSTEM_DESIGN'],
    location:    'BENGALURU_CAMPUS',
    status:      'CREDENTIAL_ACTIVE',
    statusIcon:  'verified',
    color:       'secondary',
  },
  {
    index:       '02',
    label:       'SECONDARY_EDUCATION',
    institution: 'Columbia_Foundation_School',
    period:      '2022 >> 2024',
    degree:      'Class_11th_&_12th_Academic_Cycle',
    description: 'Completed higher secondary education with a focus on core sciences and mathematics, laying the groundwork for engineering logic and computational thinking.',
    tags:        [],
    status:      'ARCHIVE_COMPLETE',
    statusIcon:  'inventory_2',
    color:       'default',
  },
];
