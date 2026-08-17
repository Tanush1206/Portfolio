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
  status:      string;
  statusIcon:  string;
  color:       'secondary' | 'default';
}

export const educationEntries: EducationEntry[] = [
  {
    index:       '01',
    label:       'HIGHER_LEARNING',
    institution: 'BITS_Pilani',
    period:      '2024 >> 2028',
    degree:      'Integrated_B.Sc._in_Computer_Science',
    description: 'Currently pursuing an Integrated B.Sc. in Computer Science at BITS Pilani. Coursework spans algorithms, data structures, database systems, operating systems, computer networks, system design, statistics and deep learning.',
    tags:        ['STATISTICS', 'DEEP_LEARNING', 'DATABASE_SYSTEMS', 'ALGORITHMS', 'SYSTEM_DESIGN'],
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
