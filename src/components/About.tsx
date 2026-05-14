import React, { useState } from 'react';
import { personalInfo } from '../data/personal';
import WindowControls from './WindowControls';

const About: React.FC = () => {
  const [isProfileClosed, setIsProfileClosed] = useState(false);
  const [isProfileMinimized, setIsProfileMinimized] = useState(false);

  return (
    <div className="pt-32 pb-section-gap px-margin-safe max-w-container-max mx-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/5 blur-[120px] -z-10 rounded-full"></div>
      
      {/* Section Header */}
      <section className="mb-24 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-12 h-[1px] bg-primary"></span>
          <span className="font-code-snippet text-label-caps text-primary uppercase tracking-widest">Identity_Authentication</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-6 uppercase">
          BIO_<wbr/>METRIC_<wbr/>LOG
          <span className="inline-block w-[0.5em] h-[1em] bg-primary/80 animate-pulse ml-2 align-middle hidden md:inline-block"></span>
        </h1>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
        {/* Profile Card */}
        <div className="md:col-span-5 space-y-gutter">
          {!isProfileClosed ? (
            <div className={`glass-card border border-white/10 p-0 group overflow-hidden transition-all duration-500 ${isProfileMinimized ? 'h-fit' : ''}`}>
              <WindowControls 
                onClose={() => setIsProfileClosed(true)}
                onMinimize={() => setIsProfileMinimized(!isProfileMinimized)}
                title="User_Profile.Img"
              />
              {!isProfileMinimized && (
                <img 
                  alt={personalInfo.name} 
                  className="w-full aspect-square object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 animate-in fade-in zoom-in-95 duration-500" 
                  src="/images/user_image2.JPG" 
                />
              )}
            </div>
          ) : (
            <div className="glass-card border border-dashed border-white/10 p-12 flex flex-col items-center justify-center gap-4 opacity-40">
              <span className="material-symbols-outlined text-4xl text-primary">person_off</span>
              <span className="font-code-snippet text-xs uppercase">Profile_Link_Terminated</span>
              <button 
                onClick={() => setIsProfileClosed(false)}
                className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary font-code-snippet text-[10px] hover:bg-primary hover:text-on-primary transition-all uppercase"
              >
                Reconnect_User
              </button>
            </div>
          )}

          <div className="glass-card border border-white/10 p-gutter bg-surface-container-highest/50">
            <div className="font-code-snippet text-xs space-y-3 uppercase">
              <div className="flex justify-between text-left">
                <span className="text-on-surface-variant">NAME:</span>
                <span className="text-on-surface">{personalInfo.name.toUpperCase().replace(' ', '_')}</span>
              </div>
              <div className="flex justify-between text-left">
                <span className="text-on-surface-variant">ROLE:</span>
                <span className="text-primary font-bold">{personalInfo.role.toUpperCase().replace(' ', '_')}</span>
              </div>
              <div className="flex justify-between text-left">
                <span className="text-on-surface-variant">LOC:</span>
                <span className="text-on-surface">{personalInfo.location.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-left">
                <span className="text-on-surface-variant">TZ:</span>
                <span className="text-on-surface">{personalInfo.timezone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="md:col-span-7 space-y-gutter">
          <div className="glass-card border border-white/10 p-gutter md:p-12 space-y-8">
            <h3 className="font-headline-md text-headline-md text-on-surface uppercase text-left">Technical_Philosophy</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-left">
              {personalInfo.bio}
            </p>
            <div className="grid grid-cols-2 gap-gutter pt-8">
              <div className="space-y-2 text-left">
                <div className="font-code-snippet text-primary text-sm uppercase">&gt; INNOVATION</div>
                <p className="font-body-sm text-xs text-on-surface-variant uppercase">Turning concepts into digital reality.</p>
              </div>
              <div className="space-y-2 text-left">
                <div className="font-code-snippet text-tertiary text-sm uppercase">&gt; PRECISION</div>
                <p className="font-body-sm text-xs text-on-surface-variant uppercase">Clean code and optimized systems.</p>
              </div>
            </div>
            <div className="pt-12 flex flex-col sm:flex-row gap-6">
              <a 
                href="/docs/tanush_thakran_resume.pdf" 
                download 
                className="flex-1 flex items-center justify-center gap-4 py-4 px-6 bg-primary/10 border border-primary/20 text-primary font-code-snippet uppercase hover:bg-primary hover:text-black transition-all group"
              >
                <span className="material-symbols-outlined group-hover:animate-bounce">download</span>
                DOWNLOAD_RESUME.EXE
              </a>
              <a 
                href="/docs/Portfolio ft. Tanush Thakran.pdf" 
                download 
                className="flex-1 flex items-center justify-center gap-4 py-4 px-6 bg-tertiary/10 border border-tertiary/20 text-tertiary font-code-snippet uppercase hover:bg-tertiary hover:text-black transition-all group"
              >
                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">download</span>
                DOWNLOAD_PORTFOLIO.EXE
              </a>
            </div>
          </div>

          <div className="flex gap-gutter">
            <div className="flex-1 glass-card border border-white/10 p-gutter flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-primary text-4xl mb-2 group-hover:scale-110 transition-transform">code</span>
              <span className="font-code-snippet text-[10px] text-on-surface-variant uppercase">Repositories</span>
              <span className="font-headline-md text-on-surface">15+</span>
            </div>
            <div className="flex-1 glass-card border border-white/10 p-gutter flex flex-col items-center justify-center text-center group hover:border-tertiary/50 transition-colors">
              <span className="material-symbols-outlined text-tertiary text-4xl mb-2 group-hover:scale-110 transition-transform">terminal</span>
              <span className="font-code-snippet text-[10px] text-on-surface-variant uppercase">Projects</span>
              <span className="font-headline-md text-on-surface">8+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;