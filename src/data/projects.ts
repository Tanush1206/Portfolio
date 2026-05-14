// ─────────────────────────────────────────────
// PROJECTS DATA — edit this file to update the projects section
// ─────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  sourceUrl: string;
  demoUrl: string;
  status: string;
  imgSrc?: string;
  imgAlt?: string;
  pathLabel?: string;
  layout: 'featured' | 'card' | 'compact' | 'wide' | 'terminal';
}

export const projects: Project[] = [
  {
    id: 'atw',
    title: 'ATW_MOBILE',
    description: `Built an AI-driven platform designed to help non-legal users understand complex legal documents by automatically converting legal jargon into clear, concise, and easy-to-read language. The solution empowers individuals, startups, and small businesses to make faster, more informed decisions without requiring deep legal expertise.`,
    tags: ['FLUTTER', 'FIREBASE', 'GPS'],
    sourceUrl: 'https://github.com/NeuralSynth/cyparta-atw-frontend-android',
    demoUrl: '#',
    status: 'Mobile_Solution',
    layout: 'featured', // Making it the featured project since it's now first
    pathLabel: 'SRC: /deploy/atw-mobile',
  },
  {
    id: 'pactpal',
    title: 'PactPal',
    description: 'An AI-powered legal agent that simplifies complex contracts for non-legal users, reducing reading time by 30%.',
    tags: ['PYTHON', 'NLP_MODELS', 'REACT'],
    sourceUrl: 'https://github.com/Tanush1206/PactPal',
    demoUrl: 'https://pactpal-frontend.onrender.com/',
    status: 'Production_Ready',
    pathLabel: 'SRC: /ai/pactpal',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhaVr6zepBbECJoBkQCDSoIBuTj9DoRvFfruivGECB1cwzAhuKYWMeaSPdhx27sE2wmyrLz07D5zlYaQMQ92VJCDGYzZm1xwdv5dmlNLOsjSj1kydF3u0hy-GTy6mcCSp5nkPbPa7p9aBFQSdFQcpdAEP4qBG_1FmzvBQnv5DMNh-L5099NMUkKKoTX1Asv51_PSRjdRX64sb3CHL3IK4U_Qq9JcUFVJwnlX6T7DzGewHahZPLttg-gPO_uOmijHWLLt8Mi1TXkYl9',
    imgAlt: 'PactPal',
    layout: 'card',
  },
  {
    id: 'clique',
    title: 'CLIQUE',
    description: 'Event tracking and centralization platform specifically designed for Scaler students to manage academic and extracurricular schedules.',
    tags: ['REACT', 'NODE.JS'],
    sourceUrl: 'https://github.com/Tanush1206/CLIQUE',
    demoUrl: 'https://frontend-clique-1.onrender.com/',
    status: 'Live',
    layout: 'compact',
  },
  {
    id: 'aasrah',
    title: 'AASRAH',
    description: 'A humanitarian platform connecting users with NGOs for real-time assistance during human or animal distress. Integrated with Google Maps API for precise location tracking and rapid response.',
    tags: ['REACT', 'GOOGLE_MAPS_API', 'NODE_EXPRESS'],
    sourceUrl: 'https://github.com/NoiceHax/Aasrah',
    demoUrl: '#',
    status: 'Production_Ready',
    pathLabel: 'SRC: /deploy/aasrah-platform',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChN7oU87d5xxkSWine-9Lms2zmz2XBhUzJcY86c-7ttKH5aKqAWadOSzLN-XBlmnUkSPt6qrgnJbyAKaDmUzNO1-Q7CsMglKqpeTM0QDbSNP4hk2GSbRqaQmtlwd2kBruzW99O6wVwo296DlZMOTG2ehb7fKrGG4ZbdFJa2HiS75Junk8c49fUTMefP5K9D3hEhDl4RCyKYY3bBJTeRICSv2VIvoc0XfsMdzIR5j5YBbuUmBKP-EJ60HOU5uSuNnZVb-9SivAbiTMD',
    imgAlt: 'AASRAH',
    layout: 'wide', // Swapping AASRAH to the wide layout position
  },
  {
    id: 'urban-company',
    title: 'Urban Company Case Study',
    description: '5-Year Fixed Deposit Model for Service Market Optimization',
    tags: ['STRATEGY', 'ANALYSIS'],
    sourceUrl: '#',
    demoUrl: 'https://docs.google.com/document/d/1f3hW2TAc8VsnFCNyycK5vNI6NNOHrO4gd_f7H0T2gF4/edit?usp=sharing',
    status: 'Strategy',
    layout: 'terminal',
  },
];
