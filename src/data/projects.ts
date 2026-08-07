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
    id: 'rag-based-ai',
    title: 'RAG_BASED_AI',
    description: `A fully offline Retrieval-Augmented QA pipeline that turns course videos into a searchable knowledge base and answers natural-language questions grounded strictly in retrieved transcript context — no external APIs, every model runs locally. The end-to-end flow chains ffmpeg audio extraction, timestamped Whisper transcription, embedding generation via a local bge-m3 model, and top-k retrieval over cosine similarity. Only the highest-scoring chunks are fed to a local deepseek-r1 LLM through Ollama, with prompts that constrain every answer to a cited video, title, and timestamp — making responses traceable and hallucination-resistant by construction. Embedding throughput was tuned by batching chunk requests to keep the runner stable across large transcript sets.`,
    tags: ['PYTHON', 'RAG', 'WHISPER', 'OLLAMA', 'EMBEDDINGS', 'VECTOR_RETRIEVAL', 'LOCAL_LLM'],
    sourceUrl: 'https://github.com/Tanush1206/rag_based_ai',
    demoUrl: '#',
    status: 'Offline_Pipeline',
    pathLabel: 'SRC: /ai/rag-based-ai',
    layout: 'terminal', // Lead project: full-width row at the top of the grid
  },
  {
    id: 'atw',
    title: 'ATW_MOBILE',
    description: `Built an AI-driven platform designed to help non-legal users understand complex legal documents by automatically converting legal jargon into clear, concise, and easy-to-read language. The solution empowers individuals, startups, and small businesses to make faster, more informed decisions without requiring deep legal expertise.`,
    tags: ['FLUTTER', 'FIREBASE', 'GPS'],
    sourceUrl: 'https://github.com/NeuralSynth/cyparta-atw-frontend-android',
    demoUrl: '#',
    status: 'Mobile_Solution',
    layout: 'featured', // Lead card of the second row
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
    imgSrc: '/images/project-pactpal.png',
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
    imgSrc: '/images/project-aasrah.png',
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
