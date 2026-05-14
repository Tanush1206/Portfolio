import React, { useState } from 'react';
import { projects, Project } from '../data/projects';
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

const ProjectCard: React.FC<{ 
  project: Project, 
  onClose: (id: string) => void,
  isClosed: boolean 
}> = ({ project, onClose, isClosed }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);

  if (isClosed) return null;

  const cardClasses = `glass-card p-0 overflow-hidden border border-white/10 group transition-all duration-500 hover:border-primary/50 ${
    isFullWidth ? 'md:col-span-12' : project.layout === 'featured' || project.layout === 'wide' ? 'md:col-span-8' : project.layout === 'terminal' ? 'md:col-span-12' : 'md:col-span-4'
  } ${isMinimized ? 'h-fit' : ''}`;

  return (
    <div className={cardClasses}>
      <WindowControls 
        onClose={() => onClose(project.id)}
        onMinimize={() => setIsMinimized(!isMinimized)}
        onMaximize={() => setIsFullWidth(!isFullWidth)}
        title={project.pathLabel || `PROJECT: ${project.title.toUpperCase()}`}
      />
      {!isMinimized && (
        <div className={`p-8 md:p-12 flex flex-col ${project.layout === 'wide' || project.layout === 'featured' ? 'md:flex-row' : ''} gap-8 animate-in fade-in slide-in-from-top-4 duration-500`}>
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 text-tertiary font-code-snippet text-label-caps uppercase text-[10px] tracking-tighter text-left">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
              <span>Status: {project.status}</span>
            </div>
            <h3 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface uppercase text-left break-words leading-tight">{formatTerminalString(project.title)}</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-left">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 border border-primary/20 bg-primary/5 font-code-snippet text-[10px] text-primary uppercase tracking-widest">{tag}</span>
              ))}
            </div>
            <div className="flex gap-6 pt-4">
              <a className="font-code-snippet text-label-caps text-on-surface hover:text-primary transition-colors border-b border-white/10 pb-1" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">[VIEW_SOURCE]</a>
              {project.demoUrl !== '#' && (
                <a className="font-code-snippet text-label-caps text-on-surface hover:text-primary transition-colors border-b border-white/10 pb-1" href={project.demoUrl} target="_blank" rel="noopener noreferrer">[LIVE_DEMO]</a>
              )}
            </div>
          </div>
          {project.imgSrc && (
            <div className="flex-1 bg-surface-container-highest rounded border border-white/5 overflow-hidden max-h-[300px]">
              <img 
                alt={project.imgAlt} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                src={project.imgSrc} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Projects: React.FC = () => {
  const [closedIds, setClosedIds] = useState<string[]>([]);

  const handleClose = (id: string) => {
    setClosedIds(prev => [...prev, id]);
  };

  const handleRestore = (id: string) => {
    setClosedIds(prev => prev.filter(cid => cid !== id));
  };

  return (
    <div className="relative pt-[120px] pb-[200px] px-margin-safe max-w-container-max mx-auto overflow-hidden">
      {/* Subtle Ambient Background (Mascot Watermark) */}
      <div className="fixed top-1/4 -right-20 opacity-10 pointer-events-none select-none z-0">
        <img 
          alt="Mascot" 
          className="w-[300px] md:w-[800px] h-auto" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNmu6kl-MnyTI4hlX1_8NbhP9fVnvtly6kZyASFFQfdffMa_4qozMgcQc8YCU5ZnJruWaeNvEK95GwFbt0A1DQPgMJiwHrhh3hG5iXs2CGn1F01yTLR4FdPdF5mv2tKfz1P1Id_Tl5N21eBKbWmkfYswmqIP8zGBf4UjQ3Lg4XCYS8JoG3dBnd0gGOe_3u3Gd7842ywxYl03P2EwtaI7K3RTyHEO_UBWWlcU56aKv6_Xthyvp2P_mHm95rb4YVn2_MH23Es0l4SwNT" 
        />
      </div>

      {/* Section Header */}
      <div className="relative z-10 mb-20">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-primary font-code-snippet text-body-lg">&gt;</span>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-lg text-on-surface uppercase">
            PROJECTS.<wbr/>LOG
            <span className="inline-block w-[0.5em] h-[1em] bg-primary/80 animate-pulse ml-2 align-middle hidden md:inline-block"></span>
          </h1>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          A selection of technical prototypes, decentralized platforms, and AI-driven solutions engineered for impact.
        </p>
      </div>

      {/* Bento Grid Projects Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClose={handleClose}
            isClosed={closedIds.includes(project.id)}
          />
        ))}
      </div>

      {/* OS Dock for Closed Projects */}
      {closedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500 w-fit max-w-[95vw]">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl overflow-x-auto no-scrollbar scroll-smooth">
            {closedIds.map(id => {
              const project = projects.find(p => p.id === id);
              return (
                <button
                  key={id}
                  onClick={() => handleRestore(id)}
                  className="group relative flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 active:scale-90"
                  title={`Restore ${project?.title}`}
                >
                  <div className="w-6 h-6 text-white/60 group-hover:text-primary transition-colors">
                    {id === 'atw' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    ) : id === 'aasrah' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 border border-white/10 text-primary text-[10px] font-code-snippet rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl backdrop-blur-md translate-y-2 group-hover:translate-y-0 z-[110]">
                    RESTORE_{project?.title?.toUpperCase().replace(/\s+/g, '_')}
                  </div>

                  {/* Notification Dot */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#27c93f] opacity-80"></div>
                </button>
              );
            })}
            
            <div className="w-[1px] h-10 bg-white/10 mx-2 flex-shrink-0"></div>
            
            <button 
              onClick={() => setClosedIds([])}
              className="group relative flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-error/10 border border-error/20 text-error hover:bg-error hover:text-on-error transition-all duration-300 active:scale-90"
              title="Reset All Windows"
            >
              <div className="w-6 h-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 border border-white/10 text-error text-[10px] font-code-snippet rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl backdrop-blur-md translate-y-2 group-hover:translate-y-0 z-[110]">
                RESET_ALL_WINDOWS
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Section Footer CTA */}
      <div className="mt-section-gap flex flex-col items-center text-center space-y-8 relative z-10">
        <div className="w-px h-24 bg-gradient-to-b from-primary to-transparent"></div>
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase">Ready To Collaborate?</h2>
        <div className="flex items-center gap-4 bg-surface-container-low border border-white/10 px-6 py-4 w-full max-w-xl">
          <span className="text-primary font-code-snippet">&gt;</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-on-surface font-code-snippet w-full placeholder:opacity-30 outline-none uppercase" 
            placeholder="type command (e.g. contact --now)" 
            type="text"
          />
          <span className="inline-block w-[0.5em] h-[1em] bg-primary/80 animate-pulse ml-2 align-middle"></span>
        </div>
      </div>
    </div>
  );
};

export default Projects;
