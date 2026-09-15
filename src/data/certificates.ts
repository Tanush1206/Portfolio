export interface CertificateEntry {
  title: string;
  issuer: string;
  date: string;
  id: string;
  link: string;
  image?: string;
  logo?: string;
}

// Ordered data/ML first — this portfolio targets analytics and ML roles, and
// the cards render in array order.
export const certificates: CertificateEntry[] = [
  {
    title: "ChatGPT Prompt Engineering for Developers",
    issuer: "DeepLearning.AI · OpenAI",
    date: "SEP 2026",
    id: "DLAI-CHATGPT-PROMPT-ENGINEERING-2026",
    link: "https://www.deeplearning.ai/accomplishments/99604059-97ce-4ff6-87b7-25dae0299fcf?_gl=1*zefe20*_gcl_au*MTQzNzc4NzI3OS4xNzg1NjA4NTU3*_ga*MTk2OTkwNTU2Ny4xNzg1MTQwMjQz*_ga_FR2MZ1VLMS*czE3ODk0Njc1NjAkbzIzJGcxJHQxNzg5NDc1Njg2JGozMyRsMCRoMA..&usp=sharing",
    image: "/certs/chatgpt_prompt_engineering.png",
    logo: "/certs/deeplearning_ai_logo.png"
  },
  {
    title: "Intermediate Machine Learning",
    issuer: "Kaggle",
    date: "SEP 2026",
    id: "KAGGLE-INTERMEDIATE-ML-2026",
    link: "/certs/Intermediate_Machine_Learning.png",
    image: "/certs/Intermediate_Machine_Learning.png",
    logo: "/certs/kaggle_logo.svg"
  },
  {
    title: "Advanced Learning Algorithms",
    issuer: "DeepLearning.AI · Stanford",
    date: "SEP 2026",
    id: "HT81EXPD6MPV",
    // Coursera publishes a verification page for every certificate, so this
    // points at the authoritative record rather than at the local scan —
    // a recruiter can confirm it without taking the image on trust.
    link: "https://coursera.org/verify/HT81EXPD6MPV",
    image: "/certs/Coursera_advanced_ml.png",
    // Self-hosted rather than hotlinked from an external CDN, so it cannot
    // turn into a broken image later. Transparent PNG, so it sits correctly
    // on a light or a dark card.
    logo: "/certs/deeplearning_ai_logo.png"
  },
  {
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "DeepLearning.AI · Stanford",
    date: "AUG 2026",
    id: "ZHUIYS3KNBLB",
    // Coursera publishes a verification page for every certificate, so this
    // points at the authoritative record rather than at the local scan —
    // a recruiter can confirm it without taking the image on trust.
    link: "https://coursera.org/verify/ZHUIYS3KNBLB",
    image: "/certs/coursera_supervised_ml.png",
    // Self-hosted rather than hotlinked from an external CDN, so it cannot
    // turn into a broken image later. Transparent PNG, so it sits correctly
    // on a light or a dark card.
    logo: "/certs/deeplearning_ai_logo.png"
  },
  {
    title: "Google Analytics Certification",
    issuer: "Google",
    date: "AUG 2026",
    id: "191498591",
    link: "/certs/GoogleAnalyticsCertification.png",
    image: "/certs/GoogleAnalyticsCertification.png",
    logo: "/certs/GAbadge.png"
  },
  {
    title: "Intro to Machine Learning",
    issuer: "Kaggle",
    date: "JUL 2026",
    id: "KAGGLE-INTRO-ML-2026",
    link: "/certs/Intro_to_Machine_Learning.png",
    image: "/certs/Intro_to_Machine_Learning.png",
    logo: "/certs/kaggle_logo.svg"
  },
  {
    title: "Data Science",
    issuer: "CWH Official",
    date: "JUL 2026",
    id: "CWH-DS-2026",
    link: "/certs/data_science.jpg",
    image: "/certs/data_science.jpg",
    logo: "/certs/cwhofficial_logo.jpg"
  },
  {
    title: "AI Fluency",
    issuer: "Anthropic",
    date: "JUL 2026",
    id: "ANTHROPIC-AI-FLUENCY-2026",
    link: "/certs/ai_fluency.png",
    image: "/certs/ai_fluency.png",
    logo: "/certs/anthropic_logo.png"
  },
  {
    title: "Python Course",
    issuer: "Tutedude",
    date: "APR 2026",
    id: "TD-TANU-PY-0908",
    link: "/certs/tutedude_py.jpeg",
    image: "/certs/tutedude_py.jpeg",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgtsoUhhVZ5dXNqJmc_MnlJ_dHCZr0ZTwLTQ&s"
  },
  {
    title: "Learn JavaScript",
    issuer: "Scrimba",
    date: "FEB 2026",
    id: "SCRIMBA-JS-2026",
    link: "/certs/scrimba_js.jpeg",
    image: "/certs/scrimba_js.jpeg",
    logo: "/certs/scrimba_logo.webp"
  }
];
