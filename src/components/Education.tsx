import React from 'react';
import { educationEntries } from '../data/education';

const Education: React.FC = () => {
  return (
    <div className="pt-32 pb-section-gap px-margin-safe max-w-container-max mx-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-secondary/5 blur-[120px] -z-10 rounded-full"></div>

      {/* Page Header */}
      <section className="mb-24 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-12 h-[1px] bg-secondary"></span>
          <span className="font-code-snippet text-label-caps text-secondary uppercase tracking-widest">Academic_Credentials</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6 uppercase">
          Neural_Mapping
          <span className="inline-block w-2 h-5 bg-secondary/80 animate-pulse ml-2 align-middle"></span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Tracing the foundational knowledge layers and specialized training modules that constitute my technical expertise.
        </p>
      </section>

      {/* Education Timeline */}
      <div className="relative z-10 space-y-gutter">
        {educationEntries.map((entry) => {
          const accent = entry.color === 'secondary' ? 'secondary' : 'on-surface-variant';
          return (
            <div
              key={entry.index}
              className={`glass-card border border-white/10 p-gutter md:p-12 hover:border-${entry.color === 'secondary' ? 'secondary' : 'white'}/50 transition-all duration-500 group relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-secondary/10 transition-colors"></div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="space-y-1">
                  <div className={`font-code-snippet text-${accent} text-label-caps uppercase tracking-tighter`}>
                    {entry.index} // {entry.label}
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface uppercase">{entry.institution}</h2>
                </div>
                <div className="font-code-snippet text-on-surface-variant text-sm uppercase px-4 py-1 border border-white/5 bg-white/5">
                  {entry.period}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                <div className="md:col-span-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined text-${accent}`}>
                      {entry.color === 'secondary' ? 'school' : 'terminal'}
                    </span>
                    <span className="font-body-lg text-body-lg text-on-surface uppercase">{entry.degree}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {entry.description.replace('BITS Pilani', '')}
                    {entry.description.includes('BITS Pilani') && (
                      <><span className="text-secondary font-bold">BITS Pilani</span>. Focus on advanced computer science fundamentals, data structures, and industry-aligned software engineering practices.</>
                    )}
                  </p>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-surface-container border border-secondary/20 text-secondary font-code-snippet text-[10px] uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="md:col-span-4 bg-surface-container-low p-6 border border-white/5 space-y-4">
                  <div className="font-code-snippet text-[10px] text-on-surface-variant uppercase border-b border-white/10 pb-2">
                    {entry.color === 'secondary' ? 'Verification_Status' : 'Record_Status'}
                  </div>
                  <div className={`flex items-center gap-3 text-${accent}`}>
                    <span className="material-symbols-outlined text-sm">{entry.statusIcon}</span>
                    <span className="font-code-snippet text-xs uppercase">{entry.status}</span>
                  </div>
                  {entry.location && (
                    <div className="space-y-1 pt-2">
                      <div className="text-[15px] font-code-snippet text-on-surface-variant uppercase">Location:</div>
                      <div className="text-lg font-code-snippet text-on-surface uppercase tracking-tighter">{entry.location}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Education;
