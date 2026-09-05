import { motion } from 'framer-motion';
import { coreLanguages, devTools, domainFocus, frameworks } from '../data/skills';
import { Kicker, PageHead, Reveal, Section, Shell } from './ui';

const readable = (value: string) => value.replace(/_/g, ' ');
const pad = (value: number) => String(value).padStart(2, '0');

const SkillsPage = () => (
  <main className="w-full">
    <Section theme="dark" className="pb-24 md:pb-32">
      <PageHead
        index="02"
        label="Stack"
        title="What I use"
        lede="Levels are self-assessed, and the ordering is deliberate: machine learning first, data second, application engineering third — the same order as the work itself."
      />

      <Shell className="mt-20">
        <Reveal>
          <ul className="border-t border-line">
            {coreLanguages.map((language, index) => (
              <li
                key={language.name}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-line py-7"
              >
                <span className="kicker tabular">{pad(index + 1)}</span>

                <div>
                  <p className="text-lg">
                    {readable(language.name)}
                  </p>
                  {/* Segmented gauge rather than a bar: discrete cells read as
                      a measurement, a sliding width reads as a download.
                      The lit cells charge left to right as the row is
                      reached, which is the one moment a gauge should move. */}
                  <div
                    className="mt-3 flex max-w-md gap-[3px]"
                    role="img"
                    aria-label={`${readable(language.name)}: ${language.level} out of 100`}
                  >
                    {Array.from({ length: 20 }, (_, cell) => {
                      const lit = cell < Math.round(language.level / 5);
                      return (
                        <span key={cell} className="h-1.5 flex-1 bg-fg/15">
                          <motion.span
                            className="block h-full w-full origin-left bg-fg"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: lit ? 1 : 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.25, delay: cell * 0.028 }}
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>

                <span className="kicker tabular">{language.level}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Shell>
    </Section>

    <Section theme="light" className="py-24 md:py-32">
      <Shell>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <Kicker>Frameworks and libraries</Kicker>
            <dl className="mt-8 border-t border-line">
              {frameworks.map((framework) => (
                <div
                  key={framework.name}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-4"
                >
                  <dt className="text-[15px]">
                    {readable(framework.name)}
                  </dt>
                  <dd className="kicker shrink-0">{readable(framework.label)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9">
            <Kicker>Focus</Kicker>
            <ul className="mt-8 space-y-6">
              {domainFocus.map((focus, index) => (
                <li key={focus.label} className="border-l border-line pl-5">
                  <span className="kicker tabular">{pad(index + 1)}</span>
                  <p className="mt-2 text-[15px] leading-snug">{readable(focus.label)}</p>
                </li>
              ))}
            </ul>

            <Kicker className="mt-14">Tools</Kicker>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              {devTools.map((tool) => (
                <span
                  key={tool}
                  className="text-sm text-muted transition-colors duration-300 hover:text-fg"
                >
                  {readable(tool)}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Shell>
    </Section>
  </main>
);

export default SkillsPage;
