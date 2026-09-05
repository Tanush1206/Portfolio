import { Link } from 'react-router-dom';
import { experiences } from '../data/experience';
import LineReveal from './fx/LineReveal';
import { Emphasis, PageHead, Reveal, Section, Shell } from './ui';

const readable = (value: string) => value.replace(/_/g, ' ');
const pad = (value: number) => String(value).padStart(2, '0');

const ExperiencePage = () => (
  <main className="w-full">
    <Section theme="dark" className="pb-24 md:pb-32">
      <PageHead
        index="05"
        label="Experience"
        title="Roles"
        lede="In reverse order. Each entry lists what was actually built or owned rather than what the title implied."
      />

      <Shell className="mt-20">
        <div className="border-t border-line">
          {experiences.map((entry, index) => (
            <Reveal key={`${entry.company}-${entry.period}`} delay={index * 0.06}>
              <article
                className="grid grid-cols-1 gap-8 border-b border-line py-14 lg:grid-cols-12 lg:gap-8"
              >
                {/* Rail: index and dates held to the left, the way a ledger
                    holds its margin. */}
                <div className="lg:col-span-3">
                  <div className="flex items-baseline gap-5 lg:flex-col lg:items-start lg:gap-3">
                    <span className="kicker tabular">{pad(index + 1)}</span>
                    <span className="kicker tabular">{entry.period}</span>
                  </div>
                </div>

                <div className="lg:col-span-9">
                  <LineReveal
                    as="h2"
                    text={readable(entry.role)}
                    className="display text-[clamp(1.5rem,4vw,2.75rem)]"
                  />

                  <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    <span className="text-fg">{entry.company.replace('@', '')}</span>
                    {entry.location && (
                      <>
                        <span className="opacity-40">/</span>
                        <span>{entry.location}</span>
                      </>
                    )}
                  </p>

                  <ul className="mt-9 space-y-5">
                    {entry.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-5">
                        <span aria-hidden="true" className="mt-3 h-px w-5 shrink-0 bg-fg/40" />
                        <span className="text-[15px] leading-[1.8] text-muted">
                          <Emphasis text={highlight} />
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2">
                    {entry.tech.map((tech) => (
                      <span key={tech} className="kicker">
                        {readable(tech)}
                      </span>
                    ))}
                  </div>

                  {entry.projectLink && (
                    <Link to={entry.projectLink} className="link-grow mt-9 inline-block text-sm">
                      See the shipped project →
                    </Link>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Shell>
    </Section>
  </main>
);

export default ExperiencePage;
