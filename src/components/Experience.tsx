import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { experiences, ExperienceEntry } from '../data/experience';
import WindowControls from './WindowControls';

const formatTerminalString = (str: string) => {
  if (typeof str !== 'string') return str;
  return str.split('_').map((part, i, arr) => (
    <React.Fragment key={i}>
      {part}
      {i < arr.length - 1 && <>_<wbr/></>}
    </React.Fragment>
  ));
};

const ExperienceCard: React.FC<{ exp: ExperienceEntry }> = ({ exp }) => {
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (isClosed) {
    return (
      <div className="relative mb-gutter md:mb-section-gap pl-12 opacity-30 group">
        <div className="absolute left-[-4px] md:left-3.5 w-3 h-3 bg-white/20 border-4 border-background rounded-full z-20"></div>
        <div className="glass-card border border-dashed border-white/10 p-4 flex justify-between items-center">
          <span className="font-code-snippet text-[10px] uppercase">EXP_LOG_{exp.period.replace(/\s+/g, '_')}_CLOSED</span>
          <button 
            onClick={() => setIsClosed(false)}
            className="text-primary font-code-snippet text-[10px] hover:underline uppercase"
          >
            Restore_Log
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-gutter md:mb-section-gap pl-8 md:pl-12 transition-all duration-500">
      {/* Timeline Node */}
      <div className="absolute left-[-4px] md:left-3.5 w-3 h-3 bg-primary border-4 border-background rounded-full z-20"></div>
      
      {/* Content Card */}
      <div className="w-full">
        <div className={`glass-card border border-white/10 p-0 hover:border-primary/50 transition-all duration-500 group overflow-hidden ${isMinimized ? 'h-fit' : ''}`}>
          <WindowControls 
            onClose={() => setIsClosed(true)}
            onMinimize={() => setIsMinimized(!isMinimized)}
            title={`LOG: ${exp.company}`}
          />
          
          {!isMinimized && (
            <div className="p-gutter animate-in fade-in slide-in-from-top-4 duration-500">
              <span className="font-code-snippet text-label-caps text-primary mb-2 block uppercase">{exp.period}</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1 uppercase break-words">{formatTerminalString(exp.role)}</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="font-code-snippet text-tertiary uppercase break-words flex-1 min-w-0">{formatTerminalString(exp.company)}</div>
                {exp.location && (
                  <div className="flex items-center gap-1 font-code-snippet text-[10px] text-on-surface-variant/60 uppercase">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    {exp.location}
                  </div>
                )}
              </div>
              <div className="space-y-4 mb-8">
                {exp.highlights.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-code-snippet text-primary mt-1">&gt;</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{point}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {exp.tech.map((t) => (
                  <span key={t} className="px-3 py-1 bg-surface-container border border-primary/30 text-primary font-code-snippet text-[10px] uppercase tracking-tighter">
                    {t}
                  </span>
                ))}
              </div>

              {exp.projectLink && (
                <Link 
                  to={exp.projectLink}
                  className="inline-flex items-center gap-2 font-code-snippet text-xs text-primary border border-primary/20 px-4 py-2 hover:bg-primary/5 transition-all uppercase"
                >
                  <span className="material-symbols-outlined text-sm">terminal</span>
                  View_Linked_Project
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  return (
    <div className="pt-32 pb-section-gap px-margin-safe max-w-container-max mx-auto relative overflow-hidden">
      {/* Mascot Background Element */}
      <div className="absolute -top-20 -right-40 opacity-10 pointer-events-none select-none">
        <span className="material-symbols-outlined text-[600px] text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>
          token
        </span>
      </div>

      {/* Page Header */}
      <section className="mb-24 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-12 h-[1px] bg-primary"></span>
          <span className="font-code-snippet text-label-caps text-primary uppercase tracking-widest">System_Access_Granted</span>
        </div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-lg text-on-surface uppercase">
            DEPLOYMENT_<wbr/>HISTORY
            <span className="inline-block w-[0.5em] h-[1em] bg-primary/80 animate-pulse ml-2 align-middle hidden md:inline-block"></span>
          </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          A sequential log of technical execution, systems architecture, and software deployments.
        </p>
      </section>

      {/* Timeline */}
      <section className="relative z-10 max-w-3xl">
        <div className="absolute left-0 md:left-4 top-0 bottom-0 w-[1px] bg-white/10"></div>
        
        {experiences.map((exp, idx) => (
          <ExperienceCard key={idx} exp={exp} />
        ))}

        {/* Status: Ready for Next Mission */}
        <div className="relative pl-12">
          <div className="absolute left-[-4px] md:left-3.5 w-3 h-3 bg-tertiary border-4 border-background rounded-full z-20 animate-pulse"></div>
          <div className="font-code-snippet text-tertiary text-sm uppercase tracking-widest">
            Awaiting_Next_Deployment...
          </div>
        </div>
      </section>

      {/* Command Line Call to Action */}
      <section className="mt-section-gap flex flex-col items-center">
        <div className="glass-card border border-white/10 p-gutter w-full max-w-3xl">
          <div className="font-code-snippet text-tertiary mb-4 uppercase">root@terminal_luxe:~$ hire --talent "Tanush Thakran"</div>
          <div className="flex items-center gap-4 border-b border-primary/20 pb-4">
            <span className="font-code-snippet text-primary text-xl">&gt;</span>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full font-code-snippet text-on-surface placeholder:text-on-surface-variant/30 outline-none uppercase" 
              placeholder="ENTER_EMAIL_FOR_CONNECTION..." 
              type="text"
            />
            <button className="bg-primary text-on-primary px-6 py-2 font-label-caps uppercase text-[10px] hover:opacity-90 transition-opacity">Send_Exec</button>
          </div>
          <div className="mt-4 font-code-snippet text-label-caps text-on-surface-variant/50 uppercase">Status: System_Ready</div>
        </div>
      </section>
    </div>
  );
};

export default Experience;
