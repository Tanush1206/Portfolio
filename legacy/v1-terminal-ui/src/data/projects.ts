// ─────────────────────────────────────────────
// PROJECTS DATA — edit this file to update the projects section
//
// Ordering is deliberate: this portfolio targets AI/ML engineering first and
// data science / analyst roles second, so the ML work leads, the analytics
// work backs it up, and app engineering sits underneath as supporting
// evidence. The first three entries are also what the homepage featured strip
// renders (Hero.tsx slices projects[0..2]).
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
    description: `A fully offline Retrieval-Augmented QA pipeline that turns course videos into a searchable knowledge base and answers natural-language questions grounded strictly in retrieved transcript context — no external APIs, every model runs locally. The end-to-end flow chains ffmpeg audio extraction, timestamped Whisper transcription, chunking, and embedding generation via a local bge-m3 model, followed by top-k retrieval over cosine similarity. Chunk size and overlap were tuned against a manually labelled question set so retrieval quality was measured rather than assumed. Only the highest-scoring chunks reach a local deepseek-r1 LLM through Ollama, with prompts that constrain every answer to a cited video, title and timestamp — making responses traceable and hallucination-resistant by construction. A crash that surfaced only at scale was root-caused by profiling embedding batch sizes and fixed by restructuring requests into chunked batches.`,
    tags: ['PYTHON', 'RAG', 'EMBEDDINGS', 'VECTOR_SEARCH', 'RETRIEVAL_EVALUATION', 'WHISPER', 'LOCAL_LLM'],
    sourceUrl: 'https://github.com/Tanush1206/rag_based_ai',
    demoUrl: '#',
    status: 'ML_Pipeline',
    pathLabel: 'SRC: /ml/rag-based-ai',
    layout: 'terminal', // Lead ML project: full-width row at the top of the grid
  },
  {
    id: 'superstore-analysis',
    title: 'SUPERSTORE_PROFITABILITY_ANALYSIS',
    description: `A SQL and Power BI investigation into whether a retailer's margin problem came from product mix or from pricing. Across 9,994 transactions ($2.3M revenue, 793 customers), SQL bucketing showed margin holds at 29.5% undiscounted but turns negative past a 25% discount and reaches −77% beyond 40% — converting a vague concern into a specific policy threshold. The pattern was validated independently at sub-category, region, category and customer level, with window-function and CTE queries covering YoY growth, cohort retention and RFM segmentation. Delivered as an interactive Power BI dashboard with DAX measures and cross-filtering, alongside a recommendation worth an estimated $35K in recoverable annual profit.`,
    tags: ['SQL', 'POSTGRESQL', 'POWER_BI', 'DAX', 'COHORT_ANALYSIS', 'RFM_SEGMENTATION', 'BUSINESS_RECOMMENDATION'],
    sourceUrl: 'https://github.com/Tanush1206/superstore-powerbi-analysis',
    demoUrl: '#',
    status: 'Analytics_Case_Study',
    pathLabel: 'SRC: /data/superstore-analysis',
    layout: 'terminal', // Lead analytics project: full-width row
  },
  {
    id: 'videocaptionmaker',
    title: 'VIDEO_CAPTION_MAKER',
    description: `A production SaaS platform that puts a speech-to-text ML workload behind a real service. GPU-accelerated Whisper transcription runs on Celery workers so long-running inference never blocks the API, with ChromaDB holding vector representations of the generated transcripts. The system spans six Docker Compose services — Next.js 14 frontend, FastAPI backend, workers, Redis, PostgreSQL and ChromaDB — over an async SQLAlchemy data layer with Alembic migrations. Security was designed in from the first commit: httpOnly JWT cookies, bcrypt, CORS policy and upload validation, with auth built before the upload path existed.`,
    tags: ['ML_IN_PRODUCTION', 'WHISPER', 'PYTHON', 'FASTAPI', 'CELERY', 'POSTGRESQL', 'DOCKER'],
    sourceUrl: 'https://github.com/Tanush1206/video-caption-maker',
    demoUrl: '#',
    status: 'Production_SaaS',
    pathLabel: 'SRC: /saas/video-caption-maker',
    layout: 'featured',
  },
  {
    id: 'urban-company',
    title: 'Urban Company Case Study',
    description: 'A market-sizing and unit-economics study modelling a 5-year fixed deposit structure for service-market optimisation — assumptions, sensitivities and a written recommendation.',
    tags: ['BUSINESS_ANALYSIS', 'MODELLING', 'STRATEGY'],
    sourceUrl: '#',
    demoUrl: 'https://docs.google.com/document/d/1f3hW2TAc8VsnFCNyycK5vNI6NNOHrO4gd_f7H0T2gF4/edit?usp=sharing',
    status: 'Strategy',
    layout: 'card',
  },
  {
    id: 'pactpal',
    title: 'PactPal',
    description: 'An NLP contract-analysis platform that rewrites dense legal language into plain English for non-expert readers. Text processing and summarisation models drive the pipeline end to end, cutting measured reading time by roughly 30% for the users it was tested with — a usability gain quantified against real documents rather than estimated.',
    tags: ['PYTHON', 'NLP', 'TEXT_PROCESSING', 'REACT'],
    sourceUrl: 'https://github.com/Tanush1206/PactPal',
    demoUrl: 'https://pactpal-frontend.onrender.com/',
    status: 'NLP_Platform',
    pathLabel: 'SRC: /ml/pactpal',
    imgSrc: '/images/project-pactpal.png',
    imgAlt: 'PactPal',
    layout: 'wide',
  },
  {
    id: 'atw',
    title: 'ATW_MOBILE',
    description: `A driver and medic coordination app shipped to a logistics client in Cairo, built around real-time GPS telemetry. Full trip-lifecycle event data — request, acceptance, live status, completion — is modelled into a clean, queryable operational record, with state kept consistent across concurrent users on a live database.`,
    tags: ['REAL_TIME_DATA', 'EVENT_MODELLING', 'FLUTTER', 'FIREBASE'],
    sourceUrl: 'https://github.com/NeuralSynth/cyparta-atw-frontend-android',
    demoUrl: '#',
    status: 'Shipped_Production',
    pathLabel: 'SRC: /deploy/atw-mobile',
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
    layout: 'wide',
  },
  {
    id: 'clique',
    title: 'CLIQUE',
    description: 'Event tracking and centralization platform built for university students to manage academic and extracurricular schedules in one place.',
    tags: ['REACT', 'NODE.JS'],
    sourceUrl: 'https://github.com/Tanush1206/CLIQUE',
    demoUrl: 'https://frontend-clique-1.onrender.com/',
    status: 'Live',
    layout: 'compact',
  },
];
