import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { personalInfo, heroStats } from '../data/personal';
import { projects } from '../data/projects';
import WindowControls from './WindowControls';

// The first three entries in projects.ts get a preview card on the landing
// page — that list is ordered deliberately, so this is the ML/data lead-in.
const featuredProjects = projects.slice(0, 3);

// "a Data Engineer" vs "an AI/ML Engineer" — the role string is editable, so
// pick the article from its first letter rather than hardcoding one.
const articleFor = (word: string) => (/^[aeiou]/i.test(word.trim()) ? 'an' : 'a');

const Hero: React.FC = () => {
  const [isAboutClosed, setIsAboutClosed] = useState(false);
  const [isAboutMinimized, setIsAboutMinimized] = useState(false);

  return (
    <div className="relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 overflow-hidden px-margin-safe">
        {/* Background Mesh */}
        <div className="absolute inset-0 mesh-gradient -z-10"></div>

        {/* Mascot Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 md:opacity-30 pointer-events-none select-none -z-10">
          <img
            alt="Mascot"
            className="w-[300px] md:w-[600px] h-auto object-contain filter grayscale invert brightness-500"
            src="/images/mascot-hero.png"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-4">
          <div className="inline-flex items-center space-x-3 mb-6 font-code-snippet text-primary bg-primary-container/10 px-4 py-2 border border-primary/20 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span className="text-[10px] md:text-label-caps uppercase tracking-widest">STATUS: OPEN_TO_AI_ML_&_DATA_ROLES</span>
            <span className="flex h-2 w-2 rounded-full bg-[#10b981] animate-pulse"></span>
          </div>

          <h1 className="font-display-lg text-[clamp(40px,12vw,120px)] text-white mb-8 leading-[0.9] uppercase break-words overflow-hidden">
            HELLO_<br className="md:hidden" />WORLD.EXE
          </h1>

          <p className="font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12 px-2">
            {personalInfo.tagline}. I am <span className="text-primary font-bold">{personalInfo.name}</span>, {articleFor(personalInfo.role)} {personalInfo.role}.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link to="/projects" className="w-full md:w-auto px-10 py-4 border border-primary bg-transparent text-primary font-code-snippet text-sm md:text-lg uppercase tracking-widest hover:bg-primary hover:text-background transition-all duration-300 text-center">
              View Work
            </Link>
            <a
              href={personalInfo.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-10 py-4 border border-white/20 bg-transparent text-on-surface font-code-snippet text-sm md:text-lg uppercase tracking-widest hover:border-tertiary hover:text-tertiary transition-all duration-300 text-center"
            >
              Resume
            </a>
            <Link
              to="/contact"
              className="font-code-snippet text-on-surface-variant hover:text-primary flex items-center gap-2 text-xs md:text-base transition-colors group"
            >
              <span className="text-primary">&gt;</span>
              <span className="group-hover:underline">run setup_meeting.sh</span>
              <span className="inline-block w-[0.5em] h-[1em] bg-primary/80 animate-pulse ml-2 align-middle"></span>
            </Link>
          </div>
        </div>

        {/* Floating Code Snippets */}
        <div className="hidden lg:block absolute left-24 top-1/3 glass-card p-4 font-code-snippet text-xs text-primary/60 border-primary/20 rotate-[-4deg]">
          <pre>engineer = {'{'}<br />  "name": "{personalInfo.name}",<br />  "role": "{personalInfo.role}",<br />  "stack": ["Python", "SQL", "scikit-learn", "Power BI"]<br />{'}'}</pre>
        </div>
        <div className="hidden lg:block absolute right-24 bottom-1/4 glass-card p-4 font-code-snippet text-xs text-tertiary/60 border-tertiary/20 rotate-[6deg]">
          <pre>for q in labelled_set:<br />&nbsp;&nbsp;ctx = retrieve(index, q, k=5)<br />&nbsp;&nbsp;ans = llm(ctx, q)<br />&nbsp;&nbsp;assert cites(ans, ctx)</pre>
        </div>
      </section>

      {/* About Me Section (Preview) */}
      <section className="py-section-gap px-margin-safe max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-5 space-y-8">
            <div className="font-code-snippet text-tertiary">
              <span className="text-label-caps tracking-tighter uppercase">01 // IDENTITY_FETCH</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-white uppercase">THE_ARCHITECT</h2>
            <p className="text-on-surface-variant leading-relaxed">
              {personalInfo.bio}
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-1 border border-primary/30 font-code-snippet text-body-sm text-primary bg-primary/5 uppercase">PYTHON_CORE</span>
              <span className="px-4 py-1 border border-tertiary/30 font-code-snippet text-body-sm text-tertiary bg-tertiary/5 uppercase">SQL_ENGINE</span>
              <span className="px-4 py-1 border border-secondary/30 font-code-snippet text-body-sm text-secondary bg-secondary/5 uppercase">ML_PIPELINE</span>
            </div>
            <Link to="/about" className="inline-block font-code-snippet text-primary hover:underline uppercase tracking-widest">Read_Full_Bio &gt;</Link>
          </div>
          <div className="md:col-span-7 relative pl-0 md:pl-12">
            {!isAboutClosed ? (
              <div className={`glass-card p-1 relative z-10 group overflow-hidden transition-all duration-500 ${isAboutMinimized ? 'h-12 opacity-50' : ''}`}>
                <WindowControls
                  onClose={() => setIsAboutClosed(true)}
                  onMinimize={() => setIsAboutMinimized(!isAboutMinimized)}
                  title="ABOUT_ME.JSON"
                />
                {!isAboutMinimized && (
                  <img
                    alt="Technical Workspace"
                    className="w-full h-[400px] object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 animate-in fade-in zoom-in-95"
                    src="/images/user_image.png"
                  />
                )}
              </div>
            ) : (
              <div className="h-[400px] border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 opacity-40">
                <span className="font-code-snippet text-xs uppercase">[WINDOW_CLOSED]</span>
                <button
                  onClick={() => setIsAboutClosed(false)}
                  className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary font-code-snippet text-[10px] hover:bg-primary hover:text-on-primary transition-all uppercase"
                >
                  Restore_Window
                </button>
              </div>
            )}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 border border-white/5 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Featured Projects (Bento Grid Preview) */}
      <section className="py-section-gap px-margin-safe max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <div className="font-code-snippet text-primary mb-4">
              <span className="text-label-caps tracking-tighter uppercase">02 // DEPLOYMENT_HISTORY</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white uppercase">FEATURED_<wbr />BUILDS</h2>
          </div>
          <div className="hidden md:block font-code-snippet text-on-surface-variant opacity-40 uppercase">
            SCROLL_TO_EXPLORE_WORKSPACE.sh
          </div>
        </div>
        {/* Featured project cards — deep-link into the highlighted card on /projects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {featuredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects#${project.id}`}
              className="glass-card p-8 flex flex-col gap-4 border border-white/5 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 text-tertiary font-code-snippet text-[10px] uppercase tracking-tighter">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
                <span className="truncate">{project.status}</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-white uppercase break-words leading-tight group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="font-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto pt-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 border border-primary/20 bg-primary/5 font-code-snippet text-[9px] text-primary uppercase tracking-widest">{tag}</span>
                ))}
              </div>
              <span className="font-code-snippet text-[10px] text-primary/70 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                Inspect_Build &gt;
              </span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {heroStats.map((stat, i) => (
            <div key={i} className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-2 border border-white/5 hover:border-primary/30 transition-all">
              <div className="text-display-md font-display-lg text-primary">{stat.value}</div>
              <div className="font-code-snippet text-label-caps text-on-surface-variant uppercase">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/projects" className="inline-block font-code-snippet text-primary hover:underline uppercase tracking-widest">View_All_Projects &gt;</Link>
        </div>
      </section>

      {/* Command Line CTA */}
      <section className="py-section-gap px-margin-safe bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto glass-card p-6 md:p-12 border border-primary/20">
          <div className="font-code-snippet text-primary mb-8 text-sm md:text-xl break-words">
            <span className="opacity-50">&gt;</span> {personalInfo.name.toLowerCase().replace(' ', '')}@<wbr />terminal_luxe: <span className="text-white uppercase">initiate --contact</span>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-headline-md font-headline-md text-white">
              <span className="text-primary tracking-tighter">_</span>
              <span className="uppercase">Ready to build the future?</span>
            </div>
            <p className="text-on-surface max-w-lg font-body-lg">
              {personalInfo.statusText}
            </p>
            <div className="pt-8 flex flex-col sm:flex-row flex-wrap gap-6 md:gap-8">
              <a className="group flex items-center gap-3 text-primary font-code-snippet hover:translate-x-2 transition-transform uppercase min-w-0" href={`mailto:${personalInfo.email}`}>
                <span className="material-symbols-outlined flex-shrink-0">alternate_email</span>
                <span className="break-words min-w-0">SEND_<wbr />EMAIL.EXE</span>
              </a>
              <Link to="/contact" className="group flex items-center gap-3 text-tertiary font-code-snippet hover:translate-x-2 transition-transform uppercase min-w-0">
                <span className="material-symbols-outlined flex-shrink-0">terminal</span>
                <span className="break-words min-w-0">INIT_<wbr />CONNECTION.SYS</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;