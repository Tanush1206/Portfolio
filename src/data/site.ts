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
  title: 'Tanush Thakran — Full-Stack & AI Developer',
  description:
    'Full-stack developer building AI-driven products — offline RAG pipelines, legal-tech NLP, and MERN platforms. Portfolio, projects, and resume.',
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
      'Full-stack developer pursuing an Integrated B.Sc. in Computer Science at Scaler School of Technology with BITS Pilani. Background, bio, and resume.',
  },
  '/skills': {
    title: 'Skills',
    description:
      'Technical stack — React, Node.js, MongoDB, Python, Java, and the AI/ML tooling behind local RAG and NLP work.',
  },
  '/education': {
    title: 'Education',
    description:
      'Academic background, coursework, and the Integrated B.Sc. in Computer Science at Scaler School of Technology in collaboration with BITS Pilani.',
  },
  '/experience': {
    title: 'Experience',
    description:
      'Professional and leadership experience across engineering roles, internships, and AIESEC.',
  },
  '/projects': {
    title: 'Projects',
    description:
      'Selected builds — an offline Retrieval-Augmented QA pipeline, AI legal-document simplification, and full-stack platforms.',
  },
  '/certificates': {
    title: 'Certificates',
    description:
      'Verified certifications in AI fluency, data science, JavaScript, and Python.',
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
