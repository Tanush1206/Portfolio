import { useState } from 'react';
import { personalInfo } from '../data/personal';
import { Kicker, Reveal } from './ui';

// ─────────────────────────────────────────────────────────────────────
// FAQ
//
// An agency site uses this to pre-empt sales questions. A portfolio should
// pre-empt the recruiter's: what are you after, where are you, when can you
// start, and can I see the code. Answering those on the page saves a whole
// email round trip.
// ─────────────────────────────────────────────────────────────────────

const ITEMS = [
  {
    q: 'What kind of roles are you looking for?',
    a: `AI/ML engineering first, and data science or analytics second. The
        common thread is owning a problem end to end — raw data through to a
        recommendation, or a schema through to deployment — rather than being
        handed a narrow slice of it.`,
  },
  {
    q: 'Where are you based, and how do you work?',
    a: `${personalInfo.location}, ${personalInfo.timezone}. I have shipped
        production work for a client in Cairo, so working across timezones is
        already normal rather than an experiment.`,
  },
  {
    q: 'What does the stack actually look like?',
    a: `Python and SQL are the core. Around them: scikit-learn and pandas for
        modelling and wrangling, embeddings and vector retrieval for RAG work,
        FastAPI for serving, PostgreSQL and Power BI for the analytics side,
        and React where an interface is needed.`,
  },
  {
    q: 'Is the work on this site actually yours?',
    a: `Every project links to its own repository, and the certificates link to
        their issuers' verification pages rather than to images I control. The
        numbers quoted in the case studies come from the analyses themselves.`,
  },
  {
    q: 'Are you available now?',
    a: personalInfo.statusText,
  },
];

const Faq = () => {
  // Single-open accordion: two answers on screen at once makes the section
  // hard to scan, which defeats the point of it.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
      <Reveal className="lg:col-span-4">
        <Kicker>Questions</Kicker>
        <h2 className="display mt-6 text-[clamp(2rem,5vw,3.5rem)]">
          Before you
          <br />
          ask
        </h2>
      </Reveal>

      <Reveal delay={0.08} className="lg:col-span-7 lg:col-start-6">
        <div className="border-t border-line">
          {ITEMS.map((item, index) => {
            const isOpen = open === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div key={item.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-[17px] leading-snug sm:text-lg">{item.q}</span>

                    {/* A plus that rotates into a minus — one glyph, two states. */}
                    <span
                      aria-hidden="true"
                      className="relative mt-1.5 block h-3.5 w-3.5 shrink-0"
                    >
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-fg" />
                      <span
                        className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-fg transition-transform duration-300 ease-entrance ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                {/* Grid-rows trick: animates to the content's real height
                    without hardcoding one, and collapses cleanly to zero. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-all duration-500 ease-entrance ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl pb-7 text-[15px] leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
};

export default Faq;
