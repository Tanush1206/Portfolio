export interface CertificateEntry {
  title: string;
  issuer: string;
  date: string;
  id: string;
  link: string;
  image?: string;
  logo?: string;
}

export const certificates: CertificateEntry[] = [
  {
    title: "Learn JavaScript",
    issuer: "Scrimba",
    date: "FEB 2026",
    id: "SCRIMBA-JS-2026",
    link: "/certs/scrimba_js.jpeg",
    image: "/certs/scrimba_js.jpeg",
    logo: "/certs/scrimba_logo.webp"
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
    title: "Intro to Machine Learning",
    issuer: "Kaggle",
    date: "JUL 2026",
    id: "KAGGLE-INTRO-ML-2026",
    link: "/certs/Intro_to_Machine_Learning.png",
    image: "/certs/Intro_to_Machine_Learning.png",
    logo: "/certs/kaggle_logo.svg"
  },
  {
    title: "Google Analytics Certification",
    issuer: "Google",
    date: "JUL 2026",
    id: "191498591",
    link: "/certs/GoogleAnalyticsCertification.png",
    image: "/certs/GoogleAnalyticsCertification.png",
    logo: "/certs/GAbadge.png"
  }
];
