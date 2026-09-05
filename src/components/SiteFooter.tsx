import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { personalInfo } from '../data/personal';
import DusterCanvas from './fx/DusterCanvas';
import { Kicker, Shell } from './ui';

const CHANNELS = [
  { label: 'GitHub', href: personalInfo.github },
  { label: 'LinkedIn', href: personalInfo.linkedin },
  { label: 'X', href: personalInfo.twitter },
  { label: 'Instagram', href: personalInfo.instagram },
];

/**
 * The channel list, with a dot that slides to whichever row the pointer is
 * on and fades out when it leaves. It is the smallest possible piece of
 * feedback and it makes a plain stack of links feel like an instrument.
 *
 * The dot is positioned from measurement rather than from an index, so it
 * stays correct when the rows wrap or the type resizes.
 */
const ChannelList = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState({ y: 0, on: false });

  const track = (event: MouseEvent<HTMLLIElement>) => {
    const host = hostRef.current;
    if (!host) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const base = host.getBoundingClientRect();
    setDot({ y: rect.top - base.top + rect.height / 2, on: true });
  };

  return (
    <div
      ref={hostRef}
      className="relative"
      onMouseLeave={() => setDot((value) => ({ ...value, on: false }))}
    >
      <span
        aria-hidden="true"
        style={{ transform: `translateY(${dot.y}px)`, opacity: dot.on ? 1 : 0 }}
        className="pointer-events-none absolute -left-5 top-0 -mt-[3px] h-1.5 w-1.5 rounded-full bg-fg transition-all duration-300 ease-entrance"
      />

      <ul className="flex flex-col gap-2">
        {CHANNELS.map((channel) => (
          <li key={channel.label} onMouseEnter={track}>
            <a
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-muted transition-colors duration-300 hover:text-fg"
            >
              {channel.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SiteFooter = () => {
  const { pathname } = useLocation();

  // The pitch belongs where someone has just finished reading the work. On
  // the contact page it would be asking for something they are already doing.
  const showCta = pathname !== '/contact';

  return (
    <footer
      data-theme="dark"
      data-band=""
      // isolate: the duster composites in `exclusion`, and without a group
      // root of its own the blend would reach past the footer into the
      // page behind it.
      //
      // No parallax. It used to ride 45% of its own height up the page,
      // which read as a reveal at the document bottom but meant it sat on
      // top of 426px of the page's own content at every scroll position
      // above that — a quarter of a short page permanently hidden behind
      // it. A footer that covers the article is not an effect, it is a bug.
      className="section relative z-10 isolate"
    >
      <DusterCanvas />

      {/* Everything readable sits under the canvas in paint order, which is
          the point — the brush inverts it. */}
      <div className="relative z-20">
        {showCta && (
          <Shell className="border-b border-line py-16 md:py-20">
            <Kicker>Next</Kicker>

            <Link
              to="/contact"
              data-mouse-content="Start a conversation"
              className="mt-6 block"
            >
              <h2 className="display text-[clamp(2rem,5vw,3.75rem)]">
                Let&rsquo;s build
                <br />
                something
              </h2>
            </Link>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
              {personalInfo.statusText}
            </p>
          </Shell>
        )}

        <Shell className="py-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[15px] font-medium tracking-tight">{personalInfo.name}</p>
              <a
                href={`mailto:${personalInfo.email}`}
                data-mouse-content="Copy that down"
                className="link-grow mt-3 inline-block text-sm text-muted"
              >
                {personalInfo.email}
              </a>
              <p className="kicker mt-4">
                {personalInfo.location} — {personalInfo.timezone}
              </p>
            </div>

            <nav aria-label="Elsewhere" className="md:pl-6">
              <ChannelList />
            </nav>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="kicker tabular">
              © {new Date().getFullYear()} {personalInfo.name}
            </p>

            <div className="flex items-center gap-7">
              <a
                href={personalInfo.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="kicker transition-opacity duration-300 hover:opacity-100"
              >
                Résumé
              </a>
              <Link
                to="/contact"
                className="kicker transition-opacity duration-300 hover:opacity-100"
              >
                Contact
              </Link>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="kicker transition-opacity duration-300 hover:opacity-100"
              >
                Back to top ↑
              </button>
            </div>
          </div>

          <p className="kicker mt-6 opacity-50">Move the cursor across this panel.</p>
        </Shell>
      </div>
    </footer>
  );
};

export default SiteFooter;
