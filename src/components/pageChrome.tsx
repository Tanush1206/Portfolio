import type { ReactNode } from 'react';
import { INK, MUTED } from './pageText';

export const PageHeader = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <header className="max-w-7xl mx-auto px-6 sm:px-8">
    <p className="text-sm" style={{ color: MUTED }}>
      {eyebrow}
    </p>
    <h1
      className="font-instrument mt-3 text-5xl sm:text-6xl md:text-7xl leading-[0.95]"
      style={{ color: INK, letterSpacing: '-0.0256em' }}
    >
      {title}
    </h1>
  </header>
);

export const Panel = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-3xl bg-white/90 backdrop-blur-sm border border-black/10 p-7 sm:p-10 ${className}`}>
    {children}
  </div>
);
