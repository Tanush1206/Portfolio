import React from 'react';
import { coreLanguages, frameworks, devTools, domainFocus } from '../data/skills';

const Skills: React.FC = () => {
  return (
    <div className="pt-32 pb-section-gap px-margin-safe max-w-container-max mx-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] -z-10 rounded-full"></div>
      
      {/* Page Header */}
      <section className="mb-24 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-12 h-[1px] bg-primary"></span>
          <span className="font-code-snippet text-label-caps text-primary uppercase tracking-widest">Technical_Capabilities</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6 uppercase">
          Stack_Analysis
          <span className="inline-block w-2 h-5 bg-primary/80 animate-pulse ml-2 align-middle"></span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          A comprehensive breakdown of technical proficiencies, specialized frameworks, and engineering tools utilized in my development pipeline.
        </p>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
        
        {/* Core Languages - Left Column */}
        <div className="md:col-span-4 space-y-gutter">
          <div className="glass-card border border-white/10 p-gutter hover:border-primary/50 transition-all duration-500 group">
            <h3 className="font-code-snippet text-label-caps text-primary mb-8 uppercase tracking-widest">01 // LANGUAGES.CORE</h3>
            <div className="space-y-6">
              {coreLanguages.map((lang) => (
                <div key={lang.name} className="space-y-2">
                  <div className="flex justify-between items-end font-code-snippet">
                    <span className="text-on-surface uppercase">{lang.name}</span>
                    <span className="text-primary text-[10px]">{lang.level}%</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-highest">
                    <div className={`h-full bg-primary w-[${lang.level}%] relative`} style={{ width: `${lang.level}%` }}>
                      <div className="absolute right-0 top-0 h-full w-4 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card border border-white/10 p-gutter bg-primary/5">
            <div className="font-code-snippet text-on-surface-variant text-[10px] space-y-1 uppercase">
              <p className="text-primary">$ analyze --profile</p>
              <p>Scanning_modules...</p>
              <p>Type: Full-Stack_Developer</p>
              <p>Specialization: MERN_Stack</p>
              <p>Status: Optimization_Complete</p>
            </div>
          </div>
        </div>

        {/* Frameworks & Tech - Center Column */}
        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Frameworks Card */}
          <div className="md:col-span-2 glass-card border border-white/10 p-gutter hover:border-tertiary/50 transition-all duration-500">
            <div className="flex justify-between items-start mb-8">
              <h3 className="font-code-snippet text-label-caps text-tertiary uppercase tracking-widest">02 // FRAMEWORKS_LIBRARIES</h3>
              <span className="material-symbols-outlined text-tertiary/40">architecture</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              {frameworks.map((fw) => (
                <div key={fw.name} className="space-y-1">
                  <div className="font-code-snippet text-on-surface text-sm uppercase">{fw.name}</div>
                  <div className="text-[10px] text-on-surface-variant font-code-snippet uppercase">{fw.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools Card */}
          <div className="glass-card border border-white/10 p-gutter hover:border-secondary/50 transition-all duration-500 group">
            <h3 className="font-code-snippet text-label-caps text-secondary mb-8 uppercase tracking-widest">03 // DEV_TOOLS</h3>
            <div className="flex flex-wrap gap-2">
              {devTools.map((tool) => (
                <span key={tool} className="px-3 py-1 bg-surface-container-highest border border-secondary/20 text-secondary font-code-snippet text-[10px] uppercase">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Domain Focus Card */}
          <div className="glass-card border border-white/10 p-gutter hover:border-primary/50 transition-all duration-500 bg-surface-container-low">
            <h3 className="font-code-snippet text-label-caps text-primary mb-6 uppercase tracking-widest">04 // DOMAIN_FOCUS</h3>
            <div className="space-y-4">
              {domainFocus.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.color} ${item.pulse ? 'animate-ping' : ''}`}></span>
                  <span className="font-code-snippet text-on-surface text-xs uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
