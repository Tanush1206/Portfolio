import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import BubbleBackground from './components/BubbleBackground';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <BubbleBackground />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <Contact />
      </main>
      
      <footer className="bg-black/40 backdrop-blur-lg border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/60">
            © 2025 Tanush Thakran. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;