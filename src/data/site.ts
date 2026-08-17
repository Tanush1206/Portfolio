// ─────────────────────────────────────────────
// SITE CONFIG — canonical URL, SEO defaults, per-route metadata
//
// ⚠️  SET `siteUrl` TO YOUR LIVE DOMAIN. It must be the absolute,
//     production URL (no trailing slash). Social previews on
//     LinkedIn / X / WhatsApp resolve the OG image against it, so a
//     wrong value here means no preview image anywhere.
// ─────────────────────────────────────────────

export const siteUrl = 'https://tanush-thakran-portfolio.netlify.app';

export const siteMeta = {
  name: 'Tanush Thakran',
  title: 'Tanush Thakran — AI/ML Engineer',
  description:
    'Machine learning and data work — an evaluated local RAG pipeline, ML running in production, and a SQL and Power BI profitability analysis. Portfolio, projects, and resume.',
  ogImage: '/images/og-cover.png',
  twitterHandle: '@tanush65556130',
};

export interface RouteMeta {
  title: string;
  description: string;
}

// Titles are suffixed with the site name at runtime, except the home route.
export const routeMeta: Record<string, RouteMeta> = {
  '/': {
    title: siteMeta.title,
    description: siteMeta.description,
  },
  '/about': {
    title: 'About',
    description:
      'Computer Science undergraduate at BITS Pilani working across data, applied ML and software engineering. Background, bio, and resume.',
  },
  '/skills': {
    title: 'Skills',
    description:
      'Technical stack — Python, embeddings and vector retrieval, scikit-learn, Whisper and local LLMs, plus SQL, Pandas, Power BI and DAX for the analytics work.',
  },
  '/education': {
    title: 'Education',
    description:
      'Academic background and coursework — Integrated B.Sc. in Computer Science at BITS Pilani, covering algorithms, database systems, statistics and deep learning.',
  },
  '/experience': {
    title: 'Experience',
    description:
      'Real-time data and production engineering at CYPARTA in Cairo, plus KPI reporting and funnel analysis with AIESEC.',
  },
  '/projects': {
    title: 'Projects',
    description:
      'Selected work — an evaluated offline RAG pipeline, a SQL and Power BI profitability analysis, ML in production, and NLP contract analysis.',
  },
  '/certificates': {
    title: 'Certificates',
    description:
      'Verified certifications in Google Analytics (GA4), machine learning, data science, AI fluency, JavaScript, and Python.',
  },
  '/contact': {
    title: 'Contact',
    description:
      'Get in touch about roles, collaborations, and projects. Based in New Delhi, India (GMT+5:30).',
  },
};

export const fallbackMeta: RouteMeta = {
  title: 'Page Not Found',
  description: 'The requested page could not be found.',
};
