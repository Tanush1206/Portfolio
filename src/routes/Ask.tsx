import { useEffect } from 'react';
import { LatentScene } from '../scene/LatentScene';
import { Console } from '../ui/Console';
import { AnswerPanel } from '../ui/AnswerPanel';
import { CitationLines } from '../ui/CitationLines';
import { HowItWorks } from '../ui/HowItWorks';
import { Legend } from '../ui/Legend';
import { NodeDetail, NodeTooltip } from '../ui/NodeCard';
import { Telemetry } from '../ui/Telemetry';
import { useStore } from '../store/useStore';
import { useEmbedder } from '../engine/useEmbedder';

export default function Ask() {
  const corpusReady = useStore((s) => s.corpusReady);
  const error = useStore((s) => s.error);
  const actions = useStore((s) => s.actions);

  useEffect(() => {
    void actions.loadCorpus();
  }, [actions]);

  // Owns the worker, reports load progress, and drains a queued query the
  // moment the model is ready.
  useEmbedder();

  return (
    <div className="fixed inset-0 overflow-hidden bg-void">
      {corpusReady && <LatentScene />}

      {/* Overlays sit above the canvas but must not eat pointer events meant
          for the camera rig, so the layer is inert and each panel opts back in. */}
      <div className="pointer-events-none absolute inset-0">
        <Header />
        <Telemetry />
        <AnswerPanel />
        <CitationLines />
        <Legend />
        <NodeTooltip />
        <NodeDetail />
        <Console />
      </div>

      {!corpusReady && !error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <span className="animate-pulse font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            reading latent space…
          </span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-[22px]">
          <div className="max-w-[440px] border border-muted/20 bg-panel p-[22px]">
            <h2 className="font-mono text-[11px] uppercase leading-[11px] tracking-[0.14em] text-muted">
              corpus failed to load
            </h2>
            <p className="mt-[11px] font-body text-base text-ivory/80">{error}</p>
            <a
              href="plain"
              className="mt-[22px] inline-block border border-muted/20 px-[7px] py-[4px] font-mono text-[11px] leading-[11px] text-muted transition-colors hover:text-ivory"
            >
              read it as text instead →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="absolute left-0 top-0 z-20 m-[11px] max-w-[420px] md:m-[22px]">
      {/* The one hero size in the design. Bricolage's width axis is pushed wide
          here and nowhere else. */}
      <h1
        className="font-display text-xl text-ivory md:text-hero"
        style={{ fontVariationSettings: "'wdth' 100, 'wght' 600" }}
      >
        Tanush
      </h1>
      <p className="mt-[11px] hidden font-body text-base text-muted sm:block">
        This portfolio is a retrieval system. Every node sits where its embedding put it. Ask it
        something and watch where the answer comes from.
      </p>
      <HowItWorks />
    </header>
  );
}
