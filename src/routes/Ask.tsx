import { useEffect } from 'react';
import { LatentScene } from '../scene/LatentScene';
import { Console } from '../ui/Console';
import { Legend } from '../ui/Legend';
import { NodeDetail, NodeTooltip } from '../ui/NodeCard';
import { Telemetry } from '../ui/Telemetry';
import { useStore } from '../store/useStore';

export default function Ask() {
  const corpusReady = useStore((s) => s.corpusReady);
  const error = useStore((s) => s.error);
  const actions = useStore((s) => s.actions);

  useEffect(() => {
    void actions.loadCorpus();
  }, [actions]);

  return (
    <div className="bg-backdrop fixed inset-0 overflow-hidden">
      {corpusReady && <LatentScene />}

      {/* Overlays sit above the canvas but must not eat pointer events meant
          for the camera rig, so the layer is inert and each panel opts back in. */}
      <div className="pointer-events-none absolute inset-0">
        <Header />
        <Telemetry />
        <Legend />
        <NodeTooltip />
        <NodeDetail />
        <Console />
      </div>

      {!corpusReady && !error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <span className="text-muted animate-pulse text-[11px] uppercase tracking-[0.22em]">
            reading latent space…
          </span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-[22px]">
          <div className="border-line bg-panel max-w-[440px] border p-[22px]">
            <h2 className="text-accent text-[11px] uppercase leading-[11px] tracking-[0.14em]">
              corpus failed to load
            </h2>
            <p className="text-dim mt-[11px] text-[11px] leading-[17px]">{error}</p>
            <a
              href="plain"
              className="border-line text-muted hover:text-fg mt-[22px] inline-block border px-[7px] py-[4px] text-[11px] leading-[11px]"
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
    <header className="absolute left-0 top-0 z-20 m-[22px]">
      <h1 className="text-fg text-[11px] uppercase leading-[11px] tracking-[0.22em]">
        Tanush Thakran
      </h1>
      <p className="text-muted mt-[11px] max-w-[300px] text-[11px] leading-[17px]">
        This portfolio is a retrieval system. Every node sits where its embedding put it.
        Ask it something.
      </p>
    </header>
  );
}
