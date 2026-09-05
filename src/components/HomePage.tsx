import { Link } from 'react-router-dom';
import { certificates } from '../data/certificates';
import { personalInfo } from '../data/personal';
import { projects } from '../data/projects';
import { devTools, domainFocus } from '../data/skills';
import Faq from './Faq';
import DragMarquee from './fx/DragMarquee';
import LineReveal from './fx/LineReveal';
import ScrollExpand from './fx/ScrollExpand';
import SlotCycle from './fx/SlotCycle';
import { ButtonLink, Kicker, Reveal, Section, SectionHead, Shell } from './ui';

// The data still carries SCREAMING_SNAKE labels from the terminal-era UI.
const readable = (value: string) => value.replace(/_/g, ' ');
const pad = (value: number) => String(value).padStart(2, '0');

// Six, matching the density the reference uses for a selected-works grid:
// enough to show range, few enough that each one still gets looked at.
const SELECTED = projects.slice(0, 6);

// The strongest credential leads the list, so it is the one worth featuring.
const HEADLINE_CERT = certificates[0];

const HERO = 'I build machine\nlearning that\nreaches production';

const HomePage = () => (
  <main className="w-full">
    {/* ── HERO ─────────────────────────────────────────────────────────
        Typographic, not pictorial. The headline arrives line by line from
        beneath its own mask, and the focus line
        keeps rewriting, so the section is never entirely still. */}
    <Section theme="dark" className="flex min-h-[100svh] flex-col justify-end pb-14 pt-32">
      <Shell>
        <Kicker>
          {`${personalInfo.role} — ${personalInfo.location}`}
        </Kicker>

        <LineReveal
          as="h1"
          text={HERO}
          delay={0.1}
          stagger={0.06}
          className="display mt-10 text-[clamp(2.75rem,9vw,8.5rem)]"
        />

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-line pt-10 lg:grid-cols-12">
          <Reveal delay={0.12} className="lg:col-span-5">
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              Computer Science undergraduate at BITS Pilani. I take a problem end to end — raw
              data through to a recommendation, or a schema through to deployment.
            </p>

            <p className="kicker mt-6 flex items-center gap-2">
              <span>Currently</span>
              <SlotCycle
                items={domainFocus.map((focus) => readable(focus.label))}
                className="text-fg"
              />
            </p>
          </Reveal>

          <Reveal delay={0.18} className="lg:col-span-4">
            <dl className="space-y-3">
              {[
                ['Projects', pad(projects.length)],
                ['Credentials', pad(certificates.length)],
                ['Availability', 'Open to roles'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-6">
                  <dt className="kicker">{label}</dt>
                  <dd className="tabular font-mono-accent text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.24} className="lg:col-span-3 lg:justify-self-end">
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/projects">Selected work</ButtonLink>
            </div>
          </Reveal>
        </div>
      </Shell>
    </Section>

    {/* ── STACK STRIP + SELECTED WORKS ─────────────────────────────────
        The reference runs a draggable client-logo carousel here; the
        portfolio equivalent is the toolchain, and it is draggable for the
        same reason: a strip that answers the pointer earns a second look
        at something most visitors would otherwise scroll straight past. */}
    <Section theme="light">
      <div className="border-b border-line py-7">
        <DragMarquee>
          {devTools.map((tool) => (
            <span
              key={tool}
              className="flex items-center gap-10 whitespace-nowrap px-10 font-mono-accent text-sm uppercase tracking-[0.1em] text-muted"
            >
              {readable(tool)}
              <span className="opacity-30">/</span>
            </span>
          ))}
        </DragMarquee>
      </div>

      <Shell className="py-24 md:py-32">
        <SectionHead
          index="01"
          label="Selected works"
          title="Things I have shipped"
          aside={`${pad(SELECTED.length)} of ${pad(projects.length)}`}
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {SELECTED.map((project, index) => {
            const live = Boolean(project.demoUrl && project.demoUrl !== '#');
            const target = live
              ? project.demoUrl
              : project.sourceUrl && project.sourceUrl !== '#'
                ? project.sourceUrl
                : null;

            const body = (
              <>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="kicker tabular">{pad(index + 1)}</span>
                  <span className="kicker">{readable(project.status)}</span>
                </div>

                <h3 className="display mt-8 text-[clamp(1.5rem,3vw,2.25rem)]">
                  {readable(project.title)}
                </h3>

                <p className="mt-5 line-clamp-3 max-w-md text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-10">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="kicker">
                      {readable(tag)}
                    </span>
                  ))}
                  {target && (
                    <span
                      aria-hidden="true"
                      className="ml-auto transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  )}
                </div>
              </>
            );

            // flip-hover swaps the band's own tokens under the pointer, so
            // the whole cell turns inside out — the same inversion the
            // footer performs with a brush, done here with a hover.
            const shell = 'group flip-hover flex min-h-[19rem] flex-col bg-bg p-8 sm:p-10';

            return target ? (
              <a
                key={project.id}
                href={target}
                target="_blank"
                rel="noopener noreferrer"
                data-mouse-content={live ? 'Open live' : 'Read the source'}
                className={shell}
              >
                {body}
              </a>
            ) : (
              <div key={project.id} className={shell}>
                {body}
              </div>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
            <p className="text-sm text-muted">
              {pad(projects.length - SELECTED.length)} more in the full index.
            </p>
            <ButtonLink to="/projects" tone="ghost">
              View all work
            </ButtonLink>
          </div>
        </Reveal>
      </Shell>
    </Section>

    {/* ── FOCUS + FEATURED CREDENTIAL ──────────────────────────────────
        The reference gives its three service pillars a dark band, then
        follows with a single award brag. Same shape, different content. */}
    <Section theme="dark">
      <Shell className="py-24 md:py-32">
        <SectionHead index="02" label="Focus" title="Where I work" />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {domainFocus.map((focus, index) => (
            <Reveal key={focus.label} delay={index * 0.08} className="bg-bg">
              <div className="group h-full p-8 sm:p-10">
                <span className="kicker tabular">{pad(index + 1)}</span>
                <h3 className="mt-8 text-xl leading-snug">
                  {readable(focus.label)}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-10 block h-px w-12 bg-fg transition-all duration-500 ease-entrance group-hover:w-full"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Shell>

      {/* Single featured credential, given the weight the reference gives
          its award — including the scrubbed grow-into-the-page treatment
          it uses on hero media. */}
      <Shell className="pb-24 md:pb-32">
        <div className="grid grid-cols-1 items-center gap-10 border-t border-line pt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Kicker>
              Featured credential
            </Kicker>

            <LineReveal
              as="h2"
              text={HEADLINE_CERT.title}
              className="display mt-8 text-[clamp(1.75rem,4.5vw,3.25rem)]"
            />

            <Reveal delay={0.15}>
              <p className="mt-6 text-sm text-muted">
                {HEADLINE_CERT.issuer} — {HEADLINE_CERT.date}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={HEADLINE_CERT.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-mouse-content="Check it on Coursera"
                  className="group btn"
                >
                  Verify credential
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
                <ButtonLink to="/certificates" tone="ghost">
                  All credentials
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          {HEADLINE_CERT.image && (
            <div className="lg:col-span-4 lg:col-start-9">
              <ScrollExpand>
                <a
                  href={HEADLINE_CERT.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-mouse-content="View certificate"
                  className="block overflow-hidden bg-fg/[0.04]"
                >
                  <img
                    src={HEADLINE_CERT.image}
                    alt={`${HEADLINE_CERT.title} certificate`}
                    loading="lazy"
                    className="w-full transition-transform duration-700 hover:scale-[1.02]"
                  />
                </a>
              </ScrollExpand>
            </div>
          )}
        </div>
      </Shell>
    </Section>

    {/* ── PROFILE + FAQ ────────────────────────────────────────────────── */}
    <Section theme="light">
      <Shell className="py-24 md:py-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <Kicker>
              Profile
            </Kicker>
            <p className="mt-8 text-[17px] leading-[1.75] sm:text-xl">{personalInfo.bio}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/about" tone="ghost">
                About me
              </ButtonLink>
              <ButtonLink to="/experience" tone="ghost">
                Experience
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-line border-y border-line">
              {[
                ['Role', personalInfo.role],
                ['Location', personalInfo.location],
                ['Timezone', personalInfo.timezone],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="kicker">{label}</dt>
                  <dd className="text-sm">{value}</dd>
                </div>
              ))}
            </dl>

            <Link
              to="/contact"
              data-mouse-content="Send a message"
              className="link-grow mt-8 inline-block text-sm"
            >
              {personalInfo.email}
            </Link>
          </Reveal>
        </div>

        <div className="mt-24 md:mt-32">
          <Faq />
        </div>
      </Shell>
    </Section>
  </main>
);

export default HomePage;
