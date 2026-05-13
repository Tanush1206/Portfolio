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
import ScrollToTop from './components/ScrollToTop';
import NotFound from './components/NotFound';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-on-surface font-body-lg selection:bg-primary/30">
      <Navigation />
      
      <main className="relative z-10">
        {children}
      </main>
      
      {/* Floating Action Button - Direct Email */}
      <div className="fixed bottom-8 right-8 z-50">
        <a 
          href="mailto:tanushthakran.work@gmail.com"
          className="bg-primary text-background p-4 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all rounded-none"
          title="Direct Email"
        >
          <span className="material-symbols-outlined">mail</span>
        </a>
      </div>

      <footer className="w-full bg-surface border-t border-white/5 py-section-gap mt-section-gap">
        <div className="w-full flex flex-col md:flex-row justify-between items-center px-margin-safe max-w-container-max mx-auto">
          <div className="text-on-surface font-bold font-headline-md text-headline-md tracking-tighter mb-8 md:mb-0 uppercase">
            TERMINAL_LUXE
          </div>
          <div className="flex gap-12 font-code-snippet text-label-caps text-on-surface-variant uppercase tracking-widest font-bold">
            <a className="hover:text-tertiary transition-colors cursor-pointer opacity-80 hover:opacity-100" href="https://github.com/Tanush1206" target="_blank" rel="noopener noreferrer">GITHUB</a>
            <a className="hover:text-tertiary transition-colors cursor-pointer opacity-80 hover:opacity-100" href="https://linkedin.com/in/tanush-thakran-1b54a8327" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
            <a className="hover:text-tertiary transition-colors cursor-pointer opacity-80 hover:opacity-100" href="#">SOURCE</a>
          </div>
          <div className="mt-8 md:mt-0 font-code-snippet text-label-caps text-tertiary opacity-50 uppercase tracking-widest font-bold">
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
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;