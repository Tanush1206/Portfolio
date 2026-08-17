import { useEffect, useMemo, useRef } from 'react';
import { useStore } from '../store/useStore';
import { MODEL_DOWNLOAD_MB, shouldDeferModel } from '../engine/capabilities';

const SUGGESTIONS = [
  'what have you built with retrieval?',
  'show me the data analysis work',
  'where have you shipped to real users?',
];

export function Console() {
  const query = useStore((s) => s.query);
  const queryStatus = useStore((s) => s.queryStatus);
  const modelStatus = useStore((s) => s.modelStatus);
  const modelProgress = useStore((s) => s.modelProgress);
  const actions = useStore((s) => s.actions);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        actions.selectNode(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [actions]);

  return (
    <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 w-[min(620px,92vw)] -translate-x-1/2 p-[22px]">
      <form
        className="pointer-events-auto"
        onSubmit={(e) => {
          e.preventDefault();
          actions.submit();
        }}
      >
        <div className="flex items-center gap-[11px] border border-muted/20 bg-panel px-[11px] py-[11px]">
          <span className="shrink-0 font-mono text-[11px] leading-[11px] text-muted">›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => actions.setQuery(e.target.value)}
            placeholder="ask my portfolio a question…"
            spellCheck={false}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent font-body text-base text-ivory outline-none placeholder:text-muted"
          />
          <span className="shrink-0 font-mono text-[11px] leading-[11px] text-muted">/</span>
        </div>
      </form>

      <div className="mt-[11px] flex flex-wrap gap-[7px]">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              actions.setQuery(s);
              actions.submit();
            }}
            className="pointer-events-auto border border-muted/20 bg-panel px-[7px] py-[4px] font-mono text-[11px] leading-[11px] text-muted transition-colors hover:border-muted/50 hover:text-ivory"
          >
            {s}
          </button>
        ))}
      </div>

      <Status
        queryStatus={queryStatus}
        modelStatus={modelStatus}
        progress={modelProgress}
        deferred={useMemo(shouldDeferModel, [])}
      />
    </div>
  );
}

/**
 * The model downloads once and is then served from IndexedDB, so the honest
 * thing to report is which of those two is happening — a visitor who waited
 * 20 seconds on their first visit should be told the second one is free.
 */
function Status({
  queryStatus,
  modelStatus,
  progress,
  deferred,
}: {
  queryStatus: string;
  modelStatus: string;
  progress: number;
  deferred: boolean;
}) {
  let text: string | null = null;

  // On a deferred device, say the price before it is paid rather than starting
  // a 9 MB download on someone's mobile data without telling them.
  if (deferred && modelStatus === 'idle' && queryStatus === 'idle') {
    text = `Asking downloads a ~${MODEL_DOWNLOAD_MB} MB model to your device, once. It runs here — your question is never sent anywhere. Exploring the map costs nothing.`;
  } else if (queryStatus === 'queued' && modelStatus === 'idle') {
    text = 'Query held — starting the model download.';
  } else if (queryStatus === 'queued' && modelStatus === 'loading') {
    text = `Query held — fetching the embedding model, ${Math.round(progress * 100)}%. It runs in your browser, so nothing is sent anywhere. Cached after this once.`;
  } else if (queryStatus === 'queued') {
    text = 'Query held until the embedding model is ready.';
  } else if (queryStatus === 'embedding') {
    text = 'Embedding your question…';
  } else if (queryStatus === 'retrieving') {
    text = 'Scanning the corpus…';
  } else if (modelStatus === 'error') {
    text = 'The embedding model failed to load, so retrieval is unavailable. Everything else still works.';
  }

  if (!text) return null;
  return <p className="mt-[11px] font-body text-sm text-muted">{text}</p>;
}
