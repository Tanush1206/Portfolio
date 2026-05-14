import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { personalInfo, heroStats } from '../data/personal';
import WindowControls from './WindowControls';

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
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOS3LfqMSZ5rp1d1Hvt26XXcJOHwF2tnr9jQasdGBSokSSftSK6Q-fYn9sqbLq8xBqpUgyRn-0ZvRDvStGAaFK-mQNAWYsdj7NBrTlpCxL1t_UnmbgvK6O93XEEf2dB4_6ztjE9uaeNnmsFw3owAb22ik9g8N770yhPaDNTQ97S-pWv9JKE02YAL35n3UKtVYc7f7q2kFwwmMYNI4BtD-CwyqRTtLLlQP49AH89GiQ2o6uDOyTTyHYWuwXCCDwStiMDIswtcnDmr6s"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-4">
          <div className="inline-flex items-center space-x-3 mb-6 font-code-snippet text-primary bg-primary-container/10 px-4 py-2 border border-primary/20 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span className="text-[10px] md:text-label-caps uppercase tracking-widest">STATUS: ACTIVE_DEVELOPER</span>
            <span className="flex h-2 w-2 rounded-full bg-[#10b981] animate-pulse"></span>
          </div>

          <h1 className="font-display-lg text-[clamp(40px,12vw,120px)] text-white mb-8 leading-[0.9] uppercase break-words overflow-hidden">
            HELLO_<br className="md:hidden" />WORLD.EXE
          </h1>

          <p className="font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12 px-2">
            {personalInfo.tagline}. I am <span className="text-primary font-bold">{personalInfo.name}</span>, a {personalInfo.role}.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link to="/projects" className="w-full md:w-auto px-10 py-4 border border-primary bg-transparent text-primary font-code-snippet text-sm md:text-lg uppercase tracking-widest hover:bg-primary hover:text-background transition-all duration-300 text-center">
              View Work
            </Link>
            <div className="font-code-snippet text-on-surface-variant flex items-center gap-2 text-xs md:text-base">
              <span className="text-primary">&gt;</span> run setup_meeting.sh <span className="inline-block w-[0.5em] h-[1em] bg-primary/80 animate-pulse ml-2 align-middle"></span>
            </div>
          </div>
        </div>

        {/* Floating Code Snippets */}
        <div className="hidden lg:block absolute left-24 top-1/3 glass-card p-4 font-code-snippet text-xs text-primary/60 border-primary/20 rotate-[-4deg]">
          <pre>const developer = {'{'}<br />  name: "{personalInfo.name}",<br />  role: "{personalInfo.role}",<br />  stack: ["MongoDB", "Express", "React", "Node"]<br />{'}'};</pre>
        </div>
        <div className="hidden lg:block absolute right-24 bottom-1/4 glass-card p-4 font-code-snippet text-xs text-tertiary/60 border-tertiary/20 rotate-[6deg]">
          <pre>while (alive) {'{'}<br />  solveProblems();<br />  buildScalableApps();<br />  optimizeUX();<br />{'}'}</pre>
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
              <span className="px-4 py-1 border border-primary/30 font-code-snippet text-body-sm text-primary bg-primary/5 uppercase">REACT_ENGINE</span>
              <span className="px-4 py-1 border border-tertiary/30 font-code-snippet text-body-sm text-tertiary bg-tertiary/5 uppercase">NODE_CORE</span>
              <span className="px-4 py-1 border border-secondary/30 font-code-snippet text-body-sm text-secondary bg-secondary/5 uppercase">MONGODB_MESH</span>
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
        <div className="grid grid-cols-1 gap-8 h-auto">
          <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {heroStats.map((stat, i) => (
              <div key={i} className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-2 border border-white/5 hover:border-primary/30 transition-all">
                <div className="text-display-md font-display-lg text-primary">{stat.value}</div>
                <div className="font-code-snippet text-label-caps text-on-surface-variant uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
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
            <p className="text-on-surface-variant max-w-lg font-body-lg">
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