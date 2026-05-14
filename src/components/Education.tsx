import React, { useState } from 'react';
import { educationEntries, EducationEntry } from '../data/education';
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

const EducationCard: React.FC<{ entry: EducationEntry }> = ({ entry }) => {
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (isClosed) {
    return (
      <div className="glass-card border border-dashed border-white/10 p-6 flex justify-between items-center opacity-40">
        <span className="font-code-snippet text-xs uppercase">ACADEMIC_RECORD_{entry.index}_HIDDEN</span>
        <button 
          onClick={() => setIsClosed(false)}
          className="text-secondary font-code-snippet text-xs hover:underline uppercase"
        >
          Decrypt_Record
        </button>
      </div>
    );
  }

  const accent = entry.color === 'secondary' ? 'secondary' : 'on-surface-variant';

  return (
    <div
      className={`glass-card border border-white/10 p-0 hover:border-${entry.color === 'secondary' ? 'secondary' : 'white'}/50 transition-all duration-500 group relative overflow-hidden ${isMinimized ? 'h-fit' : ''}`}
    >
      <WindowControls 
        onClose={() => setIsClosed(true)}
        onMinimize={() => setIsMinimized(!isMinimized)}
        title={`RECORD: ${entry.institution}`}
      />
      
      {!isMinimized && (
        <div className="p-gutter md:p-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-secondary/10 transition-colors pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="space-y-1">
              <div className={`font-code-snippet text-${accent} text-label-caps uppercase tracking-tighter`}>
                {entry.index} // {entry.label}
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase break-words">{formatTerminalString(entry.institution)}</h2>
            </div>
            <div className="font-code-snippet text-on-surface-variant text-sm uppercase px-4 py-1 border border-white/5 bg-white/5">
              {entry.period}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-8 space-y-6">
              <div className="flex items-start gap-4">
                <span className={`material-symbols-outlined text-${accent} mt-1`}>
                  {entry.color === 'secondary' ? 'school' : 'terminal'}
                </span>
                <span className="font-body-lg text-body-lg text-on-surface uppercase flex-1 break-words min-w-0">
                  {formatTerminalString(entry.degree)}
                </span>
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
      )}
    </div>
  );
};

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
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-6 uppercase">
          NEURAL_<wbr/>MAPPING
          <span className="inline-block w-[0.5em] h-[1em] bg-secondary/80 animate-pulse ml-2 align-middle hidden md:inline-block"></span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Tracing the foundational knowledge layers and specialized training modules that constitute my technical expertise.
        </p>
      </section>

      {/* Education Timeline */}
      <div className="relative z-10 space-y-gutter">
        {educationEntries.map((entry) => (
          <EducationCard key={entry.index} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default Education;
