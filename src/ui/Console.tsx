import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

const SUGGESTIONS = [
  'what have you built with retrieval?',
  'show me the data analysis work',
  'where have you shipped to real users?',
];

export function Console() {
  const query = useStore((s) => s.query);
  const queryStatus = useStore((s) => s.queryStatus);
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
        <div className="border-line bg-panel flex items-center gap-[11px] border px-[11px] py-[11px]">
          <span className="text-accent shrink-0 text-[11px] leading-[11px]">›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => actions.setQuery(e.target.value)}
            placeholder="ask my portfolio a question…"
            spellCheck={false}
            autoComplete="off"
            className="text-fg placeholder:text-muted min-w-0 flex-1 bg-transparent text-[11px] leading-[11px] outline-none"
          />
          <span className="text-muted shrink-0 text-[11px] leading-[11px]">/</span>
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
            className="border-line text-muted hover:text-dim hover:border-dim pointer-events-auto border px-[7px] py-[4px] text-[11px] leading-[11px] transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {queryStatus === 'queued' && (
        <p className="text-muted mt-[11px] text-[11px] leading-[17px]">
          Query held. The in-browser embedding model arrives in phase 2 — nothing is being
          sent anywhere, and nothing is being faked here in the meantime.
        </p>
      )}
    </div>
  );
}
