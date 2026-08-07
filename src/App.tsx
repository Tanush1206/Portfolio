import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Certificates from './components/Certificates';
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from 'react-icons/fa6';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './components/NotFound';
import RouteMeta from './components/RouteMeta';
import { personalInfo } from './data/personal';

const socialLinks = [
  { label: 'GitHub', href: personalInfo.github, Icon: FaGithub },
  { label: 'LinkedIn', href: personalInfo.linkedin, Icon: FaLinkedinIn },
  { label: 'X (Twitter)', href: personalInfo.twitter, Icon: FaXTwitter },
  { label: 'Instagram', href: personalInfo.instagram, Icon: FaInstagram },
];

// Security Master Switch: Defaults to true if not set.
const SECURITY_ENABLED = import.meta.env.VITE_SECURITY_ENABLED !== 'false';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    if (!SECURITY_ENABLED) return;

    // Discourage casual image/source grabbing. Deliberately does NOT block
    // copy (Ctrl+C) or text selection — recruiters need to copy the email
    // address, project names and links, and blocking that costs far more
    // than it protects on a site whose source is public anyway.
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right-click inside form fields so paste/spellcheck still work.
      if ((e.target as HTMLElement)?.closest('input, textarea')) return;
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      // View-source and save-page.
      if (mod && !e.shiftKey && (key === 'u' || key === 's')) e.preventDefault();
      // Devtools is Ctrl+Shift+I / Ctrl+Shift+J, never a bare Ctrl+I.
      if (mod && e.shiftKey && (key === 'i' || key === 'j')) e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-on-surface font-body-lg selection:bg-primary/30 overflow-x-hidden w-full relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-background focus:font-code-snippet focus:text-sm focus:uppercase focus:tracking-widest"
      >
        Skip to content
      </a>

      <Navigation />

      <main id="main-content" className="relative z-10">
        {children}
      </main>

      {/* Floating Action Button - Direct Email */}
      <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50">
        <a
          href="mailto:tanushthakran.work@gmail.com"
          className="bg-primary text-background p-3 md:p-4 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all rounded-none"
          title="Direct Email"
        >
          <span className="material-symbols-outlined text-sm md:text-base">mail</span>
        </a>
      </div>

      <footer className="w-full bg-surface border-t border-white/5 py-12 md:py-section-gap mt-12 md:mt-section-gap relative z-20">
        <div className="w-full flex flex-col md:flex-row justify-between items-center px-margin-safe max-w-container-max mx-auto text-center md:text-left gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#131313] border-2 border-primary/40 flex items-center justify-center">
              <span className="font-code-snippet text-lg text-primary font-bold animate-pulse">{">_"}</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline-md text-sm md:text-base text-white tracking-widest uppercase leading-none">PORTFOLIO</span>
              <span className="font-code-snippet text-[10px] text-primary/60 tracking-tighter uppercase mt-1">ft. TANUSH THAKRAN</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-on-surface items-center">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  className="hover:text-primary transition-all cursor-pointer opacity-70 hover:opacity-100 hover:scale-110"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                >
                  <Icon size={20} aria-hidden="true" />
                </a>
              ))}
            </div>
            <a
              href={personalInfo.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="font-code-snippet text-[10px] md:text-label-caps text-primary/80 hover:text-primary uppercase tracking-widest border border-primary/30 hover:border-primary px-4 py-2 transition-all"
            >
              [ DOWNLOAD_RESUME.PDF ]
            </a>
          </div>
          <div className="font-code-snippet text-[8px] md:text-label-caps text-tertiary opacity-80 uppercase tracking-widest font-bold">
            © 2026 TANUSH THAKRAN.
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <RouteMeta />
      <Layout>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/education" element={<Education />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
