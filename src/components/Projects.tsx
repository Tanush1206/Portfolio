import React from 'react';
import { projects } from '../data/projects';

const Projects: React.FC = () => {
  return (
    <div className="relative pt-[120px] pb-section-gap px-margin-safe max-w-container-max mx-auto overflow-hidden">
      {/* Subtle Ambient Background (Mascot Watermark) */}
      <div className="fixed top-1/4 -right-20 opacity-10 pointer-events-none select-none z-0">
        <img 
          alt="Mascot" 
          className="w-[800px] h-auto" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNmu6kl-MnyTI4hlX1_8NbhP9fVnvtly6kZyASFFQfdffMa_4qozMgcQc8YCU5ZnJruWaeNvEK95GwFbt0A1DQPgMJiwHrhh3hG5iXs2CGn1F01yTLR4FdPdF5mv2tKfz1P1Id_Tl5N21eBKbWmkfYswmqIP8zGBf4UjQ3Lg4XCYS8JoG3dBnd0gGOe_3u3Gd7842ywxYl03P2EwtaI7K3RTyHEO_UBWWlcU56aKv6_Xthyvp2P_mHm95rb4YVn2_MH23Es0l4SwNT" 
        />
      </div>

      {/* Section Header */}
      <div className="relative z-10 mb-20">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-primary font-code-snippet text-body-lg">&gt;</span>
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg text-on-surface uppercase">
            Projects.Log
            <span className="inline-block w-2 h-5 bg-primary/80 animate-pulse ml-2 align-middle"></span>
          </h1>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          A selection of technical prototypes, decentralized platforms, and AI-driven solutions engineered for impact.
        </p>
      </div>

      {/* Bento Grid Projects Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
        {projects.map((project) => {
          if (project.layout === 'featured') {
            return (
              <div key={project.id} className="md:col-span-8 glass-card p-0 overflow-hidden border border-white/10 group transition-all duration-500 hover:border-primary/50">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                  <span className="ml-4 font-code-snippet text-label-caps opacity-40 uppercase">{project.pathLabel}</span>
                </div>
                <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-2 text-tertiary font-code-snippet text-label-caps uppercase">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
                      <span>Status: {project.status}</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface uppercase">{project.title}</h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 border border-primary/20 bg-primary/5 font-code-snippet text-label-caps text-primary">{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-6 pt-4">
                      <a className="font-code-snippet text-label-caps text-on-surface hover:text-primary transition-colors" href={project.sourceUrl}>[VIEW_SOURCE]</a>
                      <a className="font-code-snippet text-label-caps text-on-surface hover:text-primary transition-colors" href={project.demoUrl}>[LIVE_DEMO]</a>
                    </div>
                  </div>
                  {project.imgSrc && (
                    <div className="flex-1 bg-surface-container-highest rounded border border-white/5 overflow-hidden">
                      <img 
                        alt={project.imgAlt} 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                        src={project.imgSrc} 
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          }
          
          if (project.layout === 'card') {
            return (
              <div key={project.id} className="md:col-span-4 glass-card p-0 flex flex-col border border-white/10 group transition-all duration-500 hover:border-primary/50">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                  <span className="ml-4 font-code-snippet text-label-caps opacity-40 uppercase">{project.pathLabel}</span>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  {project.imgSrc && (
                    <div className="aspect-square bg-surface-container-highest rounded border border-white/5 mb-6 overflow-hidden">
                      <img 
                        alt={project.imgAlt} 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                        src={project.imgSrc} 
                      />
                    </div>
                  )}
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 uppercase">{project.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">{project.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 border border-tertiary/20 bg-tertiary/5 font-code-snippet text-[10px] text-tertiary uppercase">{tag}</span>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <a className="font-code-snippet text-label-caps text-on-surface hover:text-primary transition-colors" href={project.sourceUrl}>[CODE]</a>
                    <a className="font-code-snippet text-label-caps text-on-surface hover:text-primary transition-colors" href={project.demoUrl}>[DEMO]</a>
                  </div>
                </div>
              </div>
            );
          }

          if (project.layout === 'compact') {
            return (
              <div key={project.id} className="md:col-span-4 glass-card p-0 flex flex-col border border-white/10 group transition-all duration-500 hover:border-primary/50">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
                <div className="p-8">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-4 uppercase">{project.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">{project.description}</p>
                  <div className="flex gap-4">
                    <a className="font-code-snippet text-label-caps text-on-surface-variant hover:text-primary transition-colors" href={project.sourceUrl}>[REPOS]</a>
                    <span className="font-code-snippet text-label-caps text-primary animate-pulse">● {project.status}</span>
                  </div>
                </div>
              </div>
            );
          }

          if (project.layout === 'wide') {
            return (
              <div key={project.id} className="md:col-span-8 glass-card p-0 flex flex-col md:flex-row border border-white/10 group transition-all duration-500 hover:border-primary/50">
                <div className="p-8 flex-1 border-r border-white/5">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-2 py-1 bg-primary text-on-primary font-code-snippet text-[10px] font-bold uppercase">{project.status}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 uppercase">{project.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">{project.description}</p>
                  <div className="flex gap-4">
                    <a href={project.demoUrl} className="bg-primary/10 border border-primary/30 text-primary px-4 py-2 font-code-snippet text-label-caps hover:bg-primary hover:text-on-primary transition-all uppercase">
                      Explore_Case
                    </a>
                  </div>
                </div>
                <div className="w-full md:w-1/3 bg-surface-container-high p-4 flex items-center justify-center">
                  <div className="w-full h-full border border-dashed border-white/20 flex flex-col items-center justify-center gap-4 opacity-40">
                    <span className="material-symbols-outlined text-display-lg" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
                    <span className="font-code-snippet text-label-caps uppercase">FLEET_ACTIVE</span>
                  </div>
                </div>
              </div>
            );
          }

          if (project.layout === 'terminal') {
            return (
              <div key={project.id} className="md:col-span-12 glass-card p-0 border border-white/10 bg-black/60 group transition-all duration-500 hover:border-primary/50">
                <div className="bg-surface-container-highest px-4 py-1 flex justify-between items-center">
                  <span className="font-code-snippet text-label-caps text-primary uppercase">terminal --strategy-analyzer</span>
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">remove</span>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">check_box_outline_blank</span>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">close</span>
                  </div>
                </div>
                <div className="p-6 font-code-snippet text-body-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-on-surface-variant opacity-50 uppercase">$ cat /case_studies/urban_company.md</p>
                    <p className="text-tertiary">ANALYSIS: 5-YEAR FIXED DEPOSIT MODEL</p>
                    <p className="text-primary">TARGET: SERVICE MARKET OPTIMIZATION</p>
                    <p className="text-on-surface">PROPOSAL: STRATEGIC GROWTH FRAMEWORK</p>
                  </div>
                  <div className="space-y-1 border-l border-white/5 pl-6">
                    <p className="text-on-surface-variant opacity-50 uppercase">$ evaluate --impact</p>
                    <p className="text-on-surface"><span className="text-green-500">[DONE]</span> REVENUE PROJECTION</p>
                    <p className="text-on-surface"><span className="text-green-500">[DONE]</span> USER RETENTION DATA</p>
                    <p className="text-on-surface"><span className="text-yellow-500">[WAIT]</span> MARKET EXPANSION</p>
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <a href={project.demoUrl} className="border border-primary text-primary px-8 py-3 font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95 uppercase">
                      Read_Full_Case
                    </a>
                  </div>
                </div>
              </div>
            );
          }
          
          return null;
        })}
      </div>

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
          <span className="inline-block w-2 h-5 bg-primary/80 animate-pulse ml-2 align-middle"></span>
        </div>
      </div>
    </div>
  );
};

export default Projects;
