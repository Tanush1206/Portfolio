import { motion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';

type Token = { kind: 'word'; value: string } | { kind: 'break' };

const tokenize = (text: string): Token[] => {
  const tokens: Token[] = [];
  text.split('\n').forEach((block, blockIndex) => {
    if (blockIndex > 0) tokens.push({ kind: 'break' });
    block
      .split(/\s+/)
      .filter(Boolean)
      .forEach((value) => tokens.push({ kind: 'word', value }));
  });
  return tokens;
};

/**
 * The reference's signature entrance: a headline is split into its rendered
 * lines, each line is masked, and the lines slide up from beneath their own
 * mask in a short stagger.
 *
 * Lines cannot be known ahead of time — they are a result of wrapping, so
 * they depend on the width the type actually gets. An invisible copy is
 * kept in the flow at the same width and its words are grouped by offsetTop;
 * that grouping is the line breaking, read back out of the browser.
 *
 * `\n` in the text forces a break, so a headline can still be composed
 * deliberately rather than left entirely to wrapping.
 */
const LineReveal = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.035,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}) => {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const reduced = usePrefersReducedMotion();

  const tokens = tokenize(text);

  const measure = useCallback(() => {
    const node = measureRef.current;
    if (!node) return;

    const words = Array.from(node.querySelectorAll<HTMLElement>('[data-word]'));
    if (words.length === 0) return;

    const grouped: string[] = [];
    let top: number | null = null;

    words.forEach((word) => {
      // Rounded: sub-pixel baselines differ within a single visual line.
      const wordTop = Math.round(word.offsetTop);
      if (top === null || Math.abs(wordTop - top) > 2) {
        top = wordTop;
        grouped.push(word.textContent ?? '');
        return;
      }
      grouped[grouped.length - 1] += ` ${word.textContent ?? ''}`;
    });

    setLines((previous) =>
      previous && previous.length === grouped.length && previous.every((l, i) => l === grouped[i])
        ? previous
        : grouped,
    );
  }, []);

  useLayoutEffect(measure, [measure, text]);

  useEffect(() => {
    const node = measureRef.current;
    if (!node) return undefined;

    // Re-wrapping only happens when the available width changes; watching
    // the measuring copy itself is cheaper than watching the window.
    const observer = new ResizeObserver(() => measure());
    observer.observe(node);

    // Web fonts land after first paint and change every line break.
    if (document.fonts?.status !== 'loaded') void document.fonts?.ready.then(measure);

    return () => observer.disconnect();
  }, [measure]);

  return (
    <Tag className={`relative block ${className}`}>
      {/* Kept in the flow, not display:none — it has to wrap exactly the
          way the visible copy will. */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-x-0 top-0 block"
      >
        {tokens.map((token, index) =>
          token.kind === 'break' ? (
            <br key={`b-${index}`} />
          ) : (
            <span key={`w-${index}`} data-word className="inline-block">
              {token.value}
            </span>
          ),
        )}
      </span>

      {lines === null ? (
        // One frame before the first measurement. Keeps the text in the
        // accessibility tree without painting an unmasked flash of it.
        <span className="sr-only">{text.replace(/\n/g, ' ')}</span>
      ) : (
        lines.map((line, index) => (
          <span
            key={`${index}-${line}`}
            // Descenders would be sliced off by the mask at this
            // line-height, so the box is grown and the growth pulled back.
            className="block overflow-hidden pb-[0.14em] [margin-bottom:-0.14em]"
          >
            <motion.span
              className="block"
              initial={reduced ? undefined : { y: '110%' }}
              whileInView={reduced ? undefined : { y: '0%' }}
              viewport={{ once: true, margin: '0px 0px -25% 0px' }}
              transition={{
                duration: 0.5,
                delay: delay + index * stagger,
                ease: [0.33, 1, 0.68, 1],
              }}
            >
              {line}
            </motion.span>
          </span>
        ))
      )}
    </Tag>
  );
};

export default LineReveal;
