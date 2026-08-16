// ─────────────────────────────────────────────
// SKILLS DATA — edit this file to update the skills section
//
// Ordered for AI/ML engineering first, data science and analytics second:
// the ML and data stack leads, web engineering follows as supporting
// evidence. Levels are self-assessed — tune them to taste, but keep the
// ordering ML- and data-first.
// ─────────────────────────────────────────────

export const coreLanguages = [
  { name: 'PYTHON',     level: 90 },
  { name: 'SQL',        level: 85 },
  { name: 'JAVASCRIPT', level: 85 },
  { name: 'JAVA',       level: 80 },
];

export const frameworks = [
  { name: 'EMBEDDINGS_RAG', label: 'Vector_Retrieval'       },
  { name: 'SCIKIT_LEARN',   label: 'Modelling'              },
  { name: 'WHISPER_OLLAMA', label: 'Local_LLM_Stack'        },
  { name: 'PANDAS_NUMPY',   label: 'Data_Wrangling'         },
  { name: 'POSTGRESQL',     label: 'Window_Functions_CTEs'  },
  { name: 'POWER_BI_DAX',   label: 'BI_Dashboards'          },
  { name: 'FASTAPI',        label: 'ML_Serving'             },
  { name: 'REACT_NEXT.JS',  label: 'App_Layer'              },
  { name: 'NODE_MONGODB',   label: 'Web_Backend'            },
];

export const devTools = [
  'JUPYTER', 'POWER_BI', 'GOOGLE_ANALYTICS_4', 'EXCEL', 'CHROMADB',
  'DOCKER', 'GIT', 'GITHUB', 'VERCEL', 'RENDER', 'CURSOR', 'COPILOT',
];

export const domainFocus = [
  { label: 'Applied_ML_&_Retrieval',   color: 'bg-primary',   pulse: true  },
  { label: 'ML_In_Production',         color: 'bg-tertiary',  pulse: false },
  { label: 'Data_Analysis_&_Insight',  color: 'bg-secondary', pulse: false },
];
