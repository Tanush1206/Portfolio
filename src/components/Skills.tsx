import React, { useState } from 'react';
import { coreLanguages, frameworks, devTools, domainFocus } from '../data/skills';
import WindowControls from './WindowControls';

const SkillCard: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  accentColor?: 'primary' | 'tertiary' | 'secondary';
  id: string;
}> = ({ title, children, accentColor = 'primary', id }) => {
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (isClosed) return (
    <div className="glass-card border border-dashed border-white/10 p-4 flex justify-between items-center opacity-40 mb-4">
      <span className="font-code-snippet text-[10px] uppercase">MODULE_{id}_OFFLINE</span>
      <button onClick={() => setIsClosed(false)} className="text-primary font-code-snippet text-[10px] hover:underline uppercase">Reload</button>
    </div>
  );

  const accentClass = accentColor === 'tertiary' ? 'tertiary' : accentColor === 'secondary' ? 'secondary' : 'primary';

  return (
    <div className={`glass-card border border-white/10 p-0 hover:border-${accentClass}/50 transition-all duration-500 group overflow-hidden ${isMinimized ? 'h-fit' : ''}`}>
      <WindowControls 
        onClose={() => setIsClosed(true)}
        onMinimize={() => setIsMinimized(!isMinimized)}
        title={title}
      />
      {!isMinimized && (
        <div className="p-gutter animate-in fade-in slide-in-from-top-4 duration-500">
          {children}
        </div>
      )}
    </div>
  );
};

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
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-6 uppercase">
          STACK_<wbr/>ANALYSIS
          <span className="inline-block w-[0.5em] h-[1em] bg-primary/80 animate-pulse ml-2 align-middle hidden md:inline-block"></span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          A comprehensive breakdown of technical proficiencies, specialized frameworks, and engineering tools utilized in my development pipeline.
        </p>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
        
        {/* Core Languages - Left Column */}
        <div className="md:col-span-4 space-y-gutter">
          <SkillCard title="01 // LANGUAGES.CORE" id="LANG_CORE">
            <div className="space-y-6">
              {coreLanguages.map((lang) => (
                <div key={lang.name} className="space-y-2">
                  <div className="flex justify-between items-end font-code-snippet">
                    <span className="text-on-surface uppercase">{lang.name}</span>
                    <span className="text-primary text-[10px]">{lang.level}%</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-highest">
                    <div className={`h-full bg-primary relative`} style={{ width: `${lang.level}%` }}>
                      <div className="absolute right-0 top-0 h-full w-4 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SkillCard>

          <div className="glass-card border border-white/10 p-gutter bg-primary/5">
            <div className="font-code-snippet text-on-surface-variant text-[10px] space-y-1 uppercase text-left">
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
          <div className="md:col-span-2">
            <SkillCard title="02 // FRAMEWORKS_LIBRARIES" accentColor="tertiary" id="FRAMEWORKS">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {frameworks.map((fw) => (
                  <div key={fw.name} className="space-y-1 text-left">
                    <div className="font-code-snippet text-on-surface text-sm uppercase">{fw.name}</div>
                    <div className="text-[10px] text-on-surface-variant font-code-snippet uppercase">{fw.label}</div>
                  </div>
                ))}
              </div>
            </SkillCard>
          </div>

          {/* Tools Card */}
          <SkillCard title="03 // DEV_TOOLS" accentColor="secondary" id="TOOLS">
            <div className="flex flex-wrap gap-2 text-left">
              {devTools.map((tool) => (
                <span key={tool} className="px-3 py-1 bg-surface-container-highest border border-secondary/20 text-secondary font-code-snippet text-[10px] uppercase">
                  {tool}
                </span>
              ))}
            </div>
          </SkillCard>

          {/* Domain Focus Card */}
          <SkillCard title="04 // DOMAIN_FOCUS" id="DOMAIN">
            <div className="space-y-4 text-left">
              {domainFocus.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.color} ${item.pulse ? 'animate-ping' : ''}`}></span>
                  <span className="font-code-snippet text-on-surface text-xs uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </SkillCard>
        </div>
      </div>
    </div>
  );
};

export default Skills;
