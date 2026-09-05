import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import LineReveal from './fx/LineReveal';

// ─────────────────────────────────────────────────────────────────────
// UI PRIMITIVES
//
// The page is built from full-bleed bands that each declare their own
// theme. A component written once therefore renders correctly on a light
// band and on a dark one, because it only ever refers to the tokens the
// band redefines — never to a literal colour.
// ─────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';

/**
 * A full-bleed band.
 *
 * `data-theme` paints it. `data-band` marks it as a real band in normal
 * flow, and that is what the header probes — the header and the mobile
 * drawer both carry a data-theme of their own, and neither describes the
 * page underneath.
 */
export const Section = ({
  theme = 'light',
  id,
  children,
  className = '',
}: {
  theme?: Theme;
  id?: string;
  children: ReactNode;
  className?: string;
}) => (
  <section id={id} data-theme={theme} data-band="" className={`section ${className}`}>
    {children}
  </section>
);

/** Site-wide gutter. Everything aligns to this. */
export const Shell = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`mx-auto w-full max-w-shell px-5 sm:px-8 lg:px-12 ${className}`}>
    {children}
  </div>
);

/** Rises into place once, when scrolled to. */
export const Reveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/** Mono label above a heading — the tech signal in a monochrome design. */
export const Kicker = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <p className={`kicker ${className}`}>{children}</p>;

/** Section masthead: a numbered mono label over a large tight headline. */
export const SectionHead = ({
  index,
  label,
  title,
  aside,
}: {
  index?: string;
  label: string;
  title: string;
  aside?: ReactNode;
}) => (
  <div className="border-t border-line pt-6">
    <div className="flex flex-wrap items-baseline justify-between gap-4">
      <Kicker>
        {index && <span className="tabular mr-3 opacity-60">{index}</span>}
        {label}
      </Kicker>
      {aside && <div className="kicker">{aside}</div>}
    </div>

    {/* Masked line by line, which is the reference's signature entrance:
        the heading arrives from beneath its own baseline rather than
        fading in as one block. */}
    <LineReveal as="h2" text={title} className="display mt-8 text-[clamp(2rem,5.5vw,4rem)]" />
  </div>
);

/**
 * Route masthead. Clears the fixed header itself, so a page can be written
 * as nothing but a PageHead followed by its content.
 */
export const PageHead = ({
  index,
  label,
  title,
  lede,
}: {
  index: string;
  label: string;
  title: string;
  lede?: string;
}) => (
  <Shell className="pt-36 md:pt-44">
    <Kicker>
      <span className="tabular mr-3 opacity-60">{index}</span>
      {label}
    </Kicker>

    <LineReveal
      as="h1"
      text={title}
      delay={0.08}
      className="display mt-8 text-[clamp(2.5rem,8vw,6.5rem)]"
    />

    {lede && (
      <Reveal delay={0.22}>
        <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
          {lede}
        </p>
      </Reveal>
    )}

    {/* The reference draws the rules of its internal banners rather than
        printing them. It costs one element and it tells you the page has
        finished arriving. */}
    <motion.span
      aria-hidden="true"
      className="mt-12 block h-px origin-left bg-line"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    />
  </Shell>
);

const Arrow = () => (
  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
);

export const ButtonLink = ({
  to,
  children,
  tone = 'solid',
}: {
  to: string;
  children: ReactNode;
  tone?: 'solid' | 'ghost';
}) => (
  <Link to={to} className={`group ${tone === 'solid' ? 'btn' : 'btn-ghost'}`}>
    {children}
    <Arrow />
  </Link>
);

export const ButtonAnchor = ({
  href,
  children,
  tone = 'ghost',
}: {
  href: string;
  children: ReactNode;
  tone?: 'solid' | 'ghost';
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group ${tone === 'solid' ? 'btn' : 'btn-ghost'}`}
  >
    {children}
    <Arrow />
  </a>
);

/**
 * Seamless marquee. Children are rendered twice and the track translates by
 * exactly -50%, so the loop has no visible seam.
 */
export const Marquee = ({ items, slow = false }: { items: string[]; slow?: boolean }) => (
  <div className="mask-fade-x overflow-hidden py-6">
    <div className={`flex w-max ${slow ? 'animate-marquee-slow' : 'animate-marquee'}`}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
          {items.map((item) => (
            <span
              key={`${copy}-${item}`}
              className="flex items-center gap-10 whitespace-nowrap px-10 font-mono-accent text-sm uppercase tracking-[0.1em] text-muted"
            >
              {item}
              <span className="opacity-30">/</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * The experience highlights carry **bold** markers from the terminal-era
 * data. Split on the pairs and lift every odd fragment to full contrast.
 */
export const Emphasis = ({ text }: { text: string }) => (
  <>
    {text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
      index % 2 === 1 ? (
        <strong key={index} className="font-medium text-fg">
          {part}
        </strong>
      ) : (
        part
      ),
    )}
  </>
);
