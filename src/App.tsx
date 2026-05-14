import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Certificates from './components/Certificates';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './components/NotFound';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-on-surface font-body-lg selection:bg-primary/30 overflow-x-hidden w-full relative">
      <Navigation />

      <main className="relative z-10">
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
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 font-code-snippet text-[10px] md:text-label-caps text-on-surface uppercase tracking-widest font-bold">
            <a className="hover:text-tertiary transition-colors cursor-pointer opacity-90 hover:opacity-100" href="https://github.com/Tanush1206" target="_blank" rel="noopener noreferrer">GITHUB</a>
            <a className="hover:text-tertiary transition-colors cursor-pointer opacity-90 hover:opacity-100" href="https://linkedin.com/in/tanush-thakran-1b54a8327" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
            <a className="hover:text-tertiary transition-colors cursor-pointer opacity-90 hover:opacity-100" href="#">SOURCE</a>
          </div>
          <div className="font-code-snippet text-[8px] md:text-label-caps text-tertiary opacity-80 uppercase tracking-widest font-bold">
            © 2024 DEV_ARCHITECT. ALL RIGHTS RESERVED.
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