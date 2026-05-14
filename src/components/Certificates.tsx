import React, { useState } from 'react';
import { certificates, CertificateEntry } from '../data/certificates';
import WindowControls from './WindowControls';

const formatTerminalString = (str: string) => {
  if (typeof str !== 'string') return str;
  return str.split('_').map((part, i, arr) => (
    <React.Fragment key={i}>
      {part}
      {i < arr.length - 1 && <>_<wbr /></>}
    </React.Fragment>
  ));
};

const CertificateCard: React.FC<{
  cert: CertificateEntry,
  onClose: (id: string) => void,
  isClosed: boolean
}> = ({ cert, onClose, isClosed }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isClosed) return null;

  return (
    <div className={`glass-card border border-white/10 p-0 hover:border-primary/50 transition-all duration-500 group overflow-hidden flex flex-col ${isMinimized ? 'h-fit self-start' : 'h-full'}`}>
      <WindowControls
        onClose={() => onClose(cert.id)}
        onMinimize={() => setIsMinimized(!isMinimized)}
        title={`CREDENTIAL: ${cert.id}`}
      />

      {!isMinimized && (
        <div className="flex-1 flex flex-col p-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-start mb-6">
            <div className="font-code-snippet text-[10px] text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 border border-primary/20">
              VERIFIED_DOC
            </div>
            <div className="font-code-snippet text-[10px] text-on-surface-variant/60 uppercase">
              {cert.date}
            </div>
          </div>

          {cert.image && (
            <div className="relative aspect-[1.4/1] mb-6 overflow-hidden bg-black group-hover:border-primary/30 border border-white/5 transition-colors">
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            </div>
          )}

          <h3 className="font-headline-md text-xl text-white mb-2 uppercase leading-tight group-hover:text-primary transition-colors">
            {cert.title}
          </h3>

          <div className="font-code-snippet text-tertiary text-xs mb-8 uppercase opacity-80">
            ISSUER: {cert.issuer}
          </div>

          <div className="mt-auto space-y-4">
            <div className="p-4 bg-black/40 border border-white/5 font-code-snippet text-[10px] text-on-surface-variant flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="opacity-40">DOC_ID:</span>
                <span>{cert.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-40">STATUS:</span>
                <span className="text-tertiary">AUTHENTICATED</span>
              </div>
            </div>

            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 font-code-snippet text-[10px] text-primary border border-primary/20 py-3 hover:bg-primary hover:text-black transition-all uppercase group/btn"
            >
              <span className="material-symbols-outlined text-sm group-hover/btn:rotate-45 transition-transform">verified</span>
              Verify_Credential.exe
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const Certificates: React.FC = () => {
  const [closedIds, setClosedIds] = useState<string[]>([]);

  const handleClose = (id: string) => {
    setClosedIds(prev => [...prev, id]);
  };

  const handleRestore = (id: string) => {
    setClosedIds(prev => prev.filter(cid => cid !== id));
  };

  return (
    <div className="pt-32 pb-[200px] px-margin-safe max-w-container-max mx-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-tertiary/5 blur-[120px] -z-10 rounded-full"></div>

      {/* Page Header */}
      <section className="mb-24 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-12 h-[1px] bg-tertiary"></span>
          <span className="font-code-snippet text-label-caps text-tertiary uppercase tracking-widest">Protocol_Security_Audit</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-lg text-on-surface uppercase">
          VERIFIED_<wbr />CREDENTIALS
          <span className="inline-block w-[0.5em] h-[1em] bg-primary/80 animate-pulse ml-2 align-middle hidden md:inline-block"></span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          A cryptographic record of specialized training, technical certifications, and validated skill-modules.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter relative z-10">
        {certificates.map((cert) => (
          <CertificateCard
            key={cert.id}
            cert={cert}
            onClose={handleClose}
            isClosed={closedIds.includes(cert.id)}
          />
        ))}
      </section>

      {/* Dock for Closed Certificates */}
      {closedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500 w-fit max-w-[95vw]">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl overflow-x-auto no-scrollbar scroll-smooth">
            {closedIds.map(id => {
              const cert = certificates.find(c => c.id === id);
              return (
                <button
                  key={id}
                  onClick={() => handleRestore(id)}
                  className="group relative flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 active:scale-90 p-3"
                  title={`Restore ${cert?.title}`}
                >
                  {cert?.logo ? (
                    <img
                      src={cert.logo}
                      alt={cert.title}
                      className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          const fallback = document.createElement('span');
                          fallback.className = "material-symbols-outlined text-white/60 group-hover:text-primary";
                          fallback.innerText = "verified";
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : cert?.image ? (
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="material-symbols-outlined text-white/60 group-hover:text-primary">verified</span>
                  )}

                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 border border-white/10 text-primary text-[10px] font-code-snippet rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl backdrop-blur-md translate-y-2 group-hover:translate-y-0 z-[110]">
                    RESTORE_{cert?.title?.toUpperCase().replace(/\s+/g, '_')}
                  </div>

                  {/* Notification Dot */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#27c93f]"></div>
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
            </button>
          </div>
        </div>
      )}

      {/* Bottom Status */}
      <div className="mt-24 font-code-snippet text-xs text-on-surface-variant/40 text-center uppercase tracking-widest">
        End_of_Transmission // All_Nodes_Synchronized
      </div>
    </div>
  );
};

export default Certificates;
