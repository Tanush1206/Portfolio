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
  layout: "featured" | "card" | "compact" | "wide" | "terminal";
}

export const projects: Project[] = [
  {
    id: "pokemon-tcg-move-prediction",
    title: "POKEMON_TCG_MOVE_PREDICTION",
    description: `A behaviour-cloning model that predicts which legal move a winning agent chooses in recorded Pokémon TCG AI battles, trained on 3.35M candidate rows with 83 features. Each decision is a variable-length menu of options, so it is framed as learning-to-rank — LightGBM's LGBMRanker with a LambdaRank objective — rather than classification. Splits are made by episode, never by row, so turns from the same game never sit on both sides of the split. The final model reaches 57.4% top-1 accuracy on 50,649 held-out decisions against a 21.7% random baseline (2.65x), and the true move is in its top 3 88% of the time. A 7-run experiment log on a fixed test set isolated what mattered: the largest single gain (+0.054) came from reverse-engineering undocumented option indices to recover which card each move refers to, while a matched-volume control showed that filtering for "stronger" episodes did not help at all.`,
    tags: [
      "PYTHON",
      "LIGHTGBM",
      "LAMBDARANK",
      "FEATURE_ENGINEERING",
      "ABLATION_STUDY",
      "MODEL_EVALUATION",
      "LEARNING_TO_RANK",
    ],
    sourceUrl: "https://github.com/Tanush1206/pokemon-tcg-move-prediction",
    demoUrl: "#",
    status: "ML_Model",
    pathLabel: "SRC: /ml/pokemon-tcg-move-prediction",
    layout: "terminal", // New lead ML project: strongest quantified result, full-width row at top
  },
  {
    id: "rag-based-ai",
    title: "RAG_BASED_AI",
    description: `A fully offline Retrieval-Augmented QA pipeline that turns Hindi-language course videos into a searchable English knowledge base — no external APIs, every model runs locally. The flow chains ffmpeg audio extraction, Whisper large-v2 transcription with translation into timestamped segments, and embedding of each segment with a local bge-m3 model. A question is embedded the same way, the top 5 segments are retrieved by cosine similarity, and only those reach a local deepseek-r1 LLM through Ollama. The prompt instructs the model to answer only from the retrieved segments, cite the video number, title and timestamp, and say so when the answer isn't there — which reduces hallucination and keeps answers traceable to the source. Embedding a long course initially crashed the Ollama runner mid-request; the cause was oversized single requests, fixed by sending segments in fixed-size batches.`,
    tags: [
      "PYTHON",
      "RAG",
      "EMBEDDINGS",
      "VECTOR_SEARCH",
      "WHISPER",
      "LOCAL_LLM",
    ],
    sourceUrl: "https://github.com/Tanush1206/rag_based_ai",
    demoUrl: "#",
    status: "ML_Pipeline",
    pathLabel: "SRC: /ml/rag-based-ai",
    layout: "terminal", // Lead ML project: full-width row at the top of the grid
  },
  {
    id: "llm-utility-lab",
    title: "LLM_UTILITY_LAB",
    description: `A modular LLM utility application for text summarization and context-aware question answering, built in Python with the Groq API through its OpenAI-compatible interface. The system separates LLM client communication, prompt construction, summarization, Q&A, response modelling and evaluation into independent modules, while tracking input, output and total token usage for every request. Context-aware Q&A is explicitly grounded in user-provided context to reduce unsupported answers. A dedicated evaluation runner scores live responses against a small set of predefined cases, saves each run with its model, temperature and prompt version, and flags any case that regresses from pass to fail between runs. It is served as a FastAPI service in Docker, deployed on Render, with 58 pytest tests running in GitHub Actions CI.`,
    tags: [
      "PYTHON",
      "LLM_APPLICATION",
      "GROQ_API",
      "PROMPT_ENGINEERING",
      "CONTEXT_AWARE_QA",
      "TEXT_SUMMARIZATION",
      "LLM_EVALUATION",
      "TOKEN_TRACKING",
      "PYTEST",
      "FASTAPI",
    ],
    sourceUrl: "https://github.com/Tanush1206/llm-utility-lab",
    demoUrl: "https://llm-utility-lab.onrender.com/docs",
    status: "LLM_Application",
    pathLabel: "SRC: /llm/llm-utility-lab",
    layout: "terminal",
  },
  {
    id: "customer-churn-prediction",
    title: "CUSTOMER_CHURN_PREDICTION",
    description: `An end-to-end telecom customer churn prediction system built with scikit-learn and deployed as an interactive Streamlit application. The pipeline handles numerical scaling and categorical encoding through a leakage-safe ColumnTransformer and compares Logistic Regression, Random Forest and Gradient Boosting. Logistic Regression was kept — within 0.003 ROC-AUC of Gradient Boosting and directly interpretable — and its regularisation was tuned with 5-fold cross-validation on the training set. Instead of the default 0.50 decision threshold, a 0.30 threshold was chosen by maximising F1 on out-of-fold training predictions, never on the test set. On the held-out test set that lifts churn recall from 55.9% to 75.1% at 51.8% precision, with 84.1% ROC-AUC. The deployed interface also exposes feature-level model contributions to explain why a customer was flagged as high or low risk.`,
    tags: [
      "PYTHON",
      "SCIKIT_LEARN",
      "LOGISTIC_REGRESSION",
      "FEATURE_ENGINEERING",
      "CROSS_VALIDATION",
      "THRESHOLD_OPTIMIZATION",
      "MODEL_EXPLAINABILITY",
      "STREAMLIT",
    ],
    sourceUrl: "https://github.com/Tanush1206/Customer-Churn-Prediction",
    demoUrl:
      "https://customer-churn-prediction-q8sfu8ah5e2ylzz6smxjzh.streamlit.app/",
    status: "Deployed_ML_App",
    pathLabel: "SRC: /ml/customer-churn-prediction",
    layout: "terminal",
  },
  {
    id: "superstore-analysis",
    title: "SUPERSTORE_PROFITABILITY_ANALYSIS",
    description: `A SQL and Power BI investigation, on the public Sample Superstore dataset, into whether a retailer's margin problem came from product mix or from pricing. Across 9,994 line items (5,009 orders, $2.3M revenue, 793 customers), SQL bucketing showed margin holds at 29.5% undiscounted but turns negative past a 25% discount and reaches −77% beyond 40% — converting a vague concern into a specific policy threshold. The pattern was validated independently at sub-category, region, category and customer level, with window-function and CTE queries covering YoY growth, cohort retention and RFM segmentation. Delivered as an interactive Power BI dashboard with DAX measures and cross-filtering, alongside a recommendation estimated at ~$35K in recoverable annual profit, assuming order volume holds, with a single-region test proposed to measure that before rollout.`,
    tags: [
      "SQL",
      "POSTGRESQL",
      "POWER_BI",
      "DAX",
      "COHORT_ANALYSIS",
      "RFM_SEGMENTATION",
      "BUSINESS_RECOMMENDATION",
    ],
    sourceUrl: "https://github.com/Tanush1206/superstore-powerbi-analysis",
    demoUrl: "#",
    status: "Analytics_Case_Study",
    pathLabel: "SRC: /data/superstore-analysis",
    layout: "terminal", // Lead analytics project: full-width row
  },
  {
    id: "videocaptionmaker",
    title: "VIDEO_CAPTION_MAKER",
    description: `A full-stack captioning app, feature-complete and awaiting deployment, that puts a speech-to-text ML workload behind a real service. GPU-accelerated faster-whisper transcription runs on a Celery worker so long-running inference never blocks the API, and transcripts are embedded into ChromaDB for semantic search and Gemini-backed Q&A grounded in the retrieved captions. The system spans six Docker Compose services — Next.js 14 frontend, FastAPI backend, worker, Redis, PostgreSQL and ChromaDB — over an async SQLAlchemy data layer with Alembic migrations, with a caption editor, styling and burned-in video export built on top. Security was designed in from the first milestone: httpOnly JWT cookies, bcrypt, rate limiting, CORS policy and upload validation, backed by 188 backend tests.`,
    tags: [
      "ML_SERVING",
      "WHISPER",
      "PYTHON",
      "FASTAPI",
      "CELERY",
      "POSTGRESQL",
      "DOCKER",
    ],
    sourceUrl: "https://github.com/Tanush1206/video-caption-maker",
    demoUrl: "#",
    status: "Pre_Deployment",
    pathLabel: "SRC: /saas/video-caption-maker",
    layout: "featured",
  },
  {
    id: "pactpal",
    title: "PactPal",
    description:
      "A contract-simplification web app that rewrites dense legal language into plain English for non-expert readers. A React frontend sends uploaded documents to a Node.js/Express backend, which splits them into sections and has Gemini 2.5 Flash (via Vertex AI) summarise each one, then combines the results into a single plain-language guide, with clause-level explanations on demand.",
    tags: ["LLM_APPLICATION", "GEMINI", "VERTEX_AI", "NODE.JS", "REACT"],
    sourceUrl: "https://github.com/Tanush1206/PactPal",
    demoUrl: "https://pactpal-frontend.onrender.com/",
    status: "LLM_Web_App",
    pathLabel: "SRC: /ml/pactpal",
    imgAlt: "PactPal",
    layout: "wide",
  },
];
