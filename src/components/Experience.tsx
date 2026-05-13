import React from 'react';
import { experiences } from '../data/experience';

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
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6 uppercase">
          Deployment_History
          <span className="inline-block w-2 h-5 bg-primary/80 animate-pulse ml-2 align-middle"></span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          A sequential log of technical execution, systems architecture, and software deployments.
        </p>
      </section>

      {/* Timeline */}
      <section className="relative z-10 max-w-3xl">
        <div className="absolute left-0 md:left-4 top-0 bottom-0 w-[1px] bg-white/10"></div>
        
        {experiences.map((exp, idx) => (
          <div key={idx} className="relative mb-gutter md:mb-section-gap pl-12">
            {/* Timeline Node */}
            <div className="absolute left-[-4px] md:left-3.5 w-3 h-3 bg-primary border-4 border-background rounded-full z-20"></div>
            
            {/* Content Card */}
            <div className="w-full">
              <div className="glass-card border border-white/10 p-gutter hover:border-primary/50 transition-all duration-500 group">
                <div className="flex gap-1 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-error/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-tertiary/40"></div>
                </div>
                <span className="font-code-snippet text-label-caps text-primary mb-2 block uppercase">{exp.period}</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-1 uppercase">{exp.role}</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="font-code-snippet text-tertiary uppercase">{exp.company}</div>
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
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{point.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((t) => (
                    <span key={t} className="px-3 py-1 bg-surface-container border border-primary/30 text-primary font-code-snippet text-[10px] uppercase tracking-tighter">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
