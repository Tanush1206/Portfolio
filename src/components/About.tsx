import React from 'react';
import { personalInfo } from '../data/personal';

const About: React.FC = () => {
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
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6 uppercase">
          Bio_Metric_Log
          <span className="inline-block w-2 h-5 bg-primary/80 animate-pulse ml-2 align-middle"></span>
        </h1>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
        {/* Profile Card */}
        <div className="md:col-span-5 space-y-gutter">
          <div className="glass-card border border-white/10 p-1 group overflow-hidden">
            <div className="bg-surface-container-low p-3 flex justify-between items-center border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="font-code-snippet text-[10px] text-on-surface-variant uppercase">User_Profile.Img</div>
            </div>
            <img 
              alt={personalInfo.name} 
              className="w-full aspect-square object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsQIL0RQg18ddFJ8GpjWbK7qIm9eBU74YHiC3_Hv8A1r4QdG8yzsQgr6GX6AMAn2j5eTDs0pJOIUN71aAyL0KnsgtsiQ1jQVTQUEIjV_1RqyiRoSlYwL3TkMOVtjMLXZUvm8vEFp2m6mWshdcvgDe31vEGUiV8OuJOLm1T5Nc41EFZYD7eFBmLiAoKzfewtwancCr5dUR3IVOWygsAGPl1wGYeJLZ5jiK9C3Q3RykAcLVs7sdMB2hC2RVRHRyAS7H39jAhEy044j9E" 
            />
          </div>

          <div className="glass-card border border-white/10 p-gutter bg-surface-container-highest/50">
            <div className="font-code-snippet text-xs space-y-3 uppercase">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">NAME:</span>
                <span className="text-on-surface">{personalInfo.name.toUpperCase().replace(' ', '_')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">ROLE:</span>
                <span className="text-primary font-bold">{personalInfo.role.toUpperCase().replace(' ', '_')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">LOC:</span>
                <span className="text-on-surface">{personalInfo.location.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">TZ:</span>
                <span className="text-on-surface">{personalInfo.timezone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="md:col-span-7 space-y-gutter">
          <div className="glass-card border border-white/10 p-gutter md:p-12 space-y-8">
            <h3 className="font-headline-md text-headline-md text-on-surface uppercase">Technical_Philosophy</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {personalInfo.bio}
            </p>
            <div className="grid grid-cols-2 gap-gutter pt-8">
              <div className="space-y-2">
                <div className="font-code-snippet text-primary text-sm uppercase">&gt; INNOVATION</div>
                <p className="font-body-sm text-xs text-on-surface-variant uppercase">Turning concepts into digital reality.</p>
              </div>
              <div className="space-y-2">
                <div className="font-code-snippet text-tertiary text-sm uppercase">&gt; PRECISION</div>
                <p className="font-body-sm text-xs text-on-surface-variant uppercase">Clean code and optimized systems.</p>
              </div>
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