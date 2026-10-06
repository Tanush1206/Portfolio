export interface CertificateEntry {
  title: string;
  issuer1: string;
  issuer2?: string;
  date: string;
  id: string;
  link: string;
  image?: string;
  logo1?: string;
  logo2?: string;
}

// Ordered data/ML first — this portfolio targets analytics and ML roles, and
// the cards render in array order.
export const certificates: CertificateEntry[] = [
  {
    title: "LangChain Chat with Your Data",
    issuer1: "LangChain",
    issuer2: "DeepLearning.AI",
    date: "SEP 2026",
    id: "LANGCHAIN-CHAT-WITH-YOUR-DATA-2026",
    link: "https://www.deeplearning.ai/accomplishments/4a45dfb4-10c0-49e4-9f70-c9251cceaeed?accomplishmentId=4a45dfb4-10c0-49e4-9f70-c9251cceaeed&usp=sharing",
    image: "/certs/Langchain_Chat_with_your_data.png",
    logo1: "/logos/langsmith-color.png",
    logo2: "/logos/deeplearning_ai_logo.png"
  },
  {
    title: "Building Systems with the ChatGPT API",
    issuer1: "OpenAI",
    issuer2: "DeepLearning.AI",
    date: "SEP 2026",
    id: "DLAI-BUILDING-SYSTEMS-CHATGPT-API-2026",
    link: "https://www.deeplearning.ai/accomplishments/cc8941c2-057d-4c71-8aa1-8cba24c4c0ee?accomplishmentId=cc8941c2-057d-4c71-8aa1-8cba24c4c0ee&usp=sharing",
    image: "/certs/building_systems_chatgpt_api.png",
    logo1: "/logos/openai.svg",
    logo2: "/logos/deeplearning_ai_logo.png"
  },
  {
    title: "ChatGPT Prompt Engineering for Developers",
    issuer1: "OpenAI",
    issuer2: "DeepLearning.AI",
    date: "SEP 2026",
    id: "DLAI-CHATGPT-PROMPT-ENGINEERING-2026",
    link: "https://www.deeplearning.ai/accomplishments/99604059-97ce-4ff6-87b7-25dae0299fcf?_gl=1*zefe20*_gcl_au*MTQzNzc4NzI3OS4xNzg1NjA4NTU3*_ga*MTk2OTkwNTU2Ny4xNzg1MTQwMjQz*_ga_FR2MZ1VLMS*czE3ODk0Njc1NjAkbzIzJGcxJHQxNzg5NDc1Njg2JGozMyRsMCRoMA..&usp=sharing",
    image: "/certs/chatgpt_prompt_engineering.png",
    logo1: "/logos/openai.svg",
    logo2: "/logos/deeplearning_ai_logo.png"
  },
  {
    title: "Intermediate Machine Learning",
    issuer1: "Kaggle",
    date: "SEP 2026",
    id: "KAGGLE-INTERMEDIATE-ML-2026",
    link: "/certs/Intermediate_Machine_Learning.png",
    image: "/certs/Intermediate_Machine_Learning.png",
    logo1: "/logos/kaggle_logo.svg",
  },
  {
    title: "Advanced Learning Algorithms",
    issuer1: "Stanford",
    issuer2: "DeepLearning.AI",
    date: "SEP 2026",
    id: "HT81EXPD6MPV",
    link: "https://coursera.org/verify/HT81EXPD6MPV",
    image: "/certs/Coursera_advanced_ml.png",
    logo1: "/logos/stanford.jpg",
    logo2: "/logos/deeplearning_ai_logo.png"
  },
  {
    title: "Supervised Machine Learning: Regression and Classification",
    issuer1: "Stanford",
    issuer2: "DeepLearning.AI",
    date: "AUG 2026",
    id: "ZHUIYS3KNBLB",
    link: "https://coursera.org/verify/ZHUIYS3KNBLB",
    image: "/certs/coursera_supervised_ml.png",
    logo1: "/logos/stanford.jpg",
    logo2: "/logos/deeplearning_ai_logo.png"
  },
  {
    title: "Google Analytics Certification",
    issuer1: "Google",
    date: "AUG 2026",
    id: "191498591",
    link: "/certs/GoogleAnalyticsCertification.png",
    image: "/certs/GoogleAnalyticsCertification.png",
    logo1: "/logos/GAbadge.png",
  },
  {
    title: "Intro to Machine Learning",
    issuer1: "Kaggle",
    date: "JUL 2026",
    id: "KAGGLE-INTRO-ML-2026",
    link: "/certs/Intro_to_Machine_Learning.png",
    image: "/certs/Intro_to_Machine_Learning.png",
    logo1: "/logos/kaggle_logo.svg",
  },
  {
    title: "Data Science",
    issuer1: "CWH Official",
    date: "JUL 2026",
    id: "CWH-DS-2026",
    link: "/certs/data_science.jpg",
    image: "/certs/data_science.jpg",
    logo1: "/logos/cwhofficial_logo.jpg",
  },
  {
    title: "AI Fluency",
    issuer1: "Anthropic",
    date: "JUL 2026",
    id: "ANTHROPIC-AI-FLUENCY-2026",
    link: "/certs/ai_fluency.png",
    image: "/certs/ai_fluency.png",
    logo1: "/logos/anthropic_logo.png",
  },
  {
    title: "Python Course",
    issuer1: "Tutedude",
    date: "APR 2026",
    id: "TD-TANU-PY-0908",
    link: "/certs/tutedude_py.jpeg",
    image: "/certs/tutedude_py.jpeg",
    logo1: "/logos/tutedude.jpg",
  },
  {
    title: "Learn JavaScript",
    issuer1: "Scrimba",
    date: "FEB 2026",
    id: "SCRIMBA-JS-2026",
    link: "/certs/scrimba_js.jpeg",
    image: "/certs/scrimba_js.jpeg",
    logo1: "/logos/scrimba_logo.webp",
  },
];
