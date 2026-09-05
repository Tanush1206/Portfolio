import { educationEntries } from '../data/education';
import { personalInfo } from '../data/personal';
import LineReveal from './fx/LineReveal';
import { ButtonAnchor, Kicker, PageHead, Reveal, Section, SectionHead, Shell } from './ui';

const readable = (value: string) => value.replace(/_/g, ' ');
const pad = (value: number) => String(value).padStart(2, '0');

const AboutPage = () => (
  <main className="w-full">
    <Section theme="dark" className="pb-24 md:pb-32">
      <PageHead index="04" label="Profile" title="About" />

      <Shell className="mt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <p className="text-[17px] leading-[1.8] sm:text-xl">{personalInfo.bio}</p>

            <div className="mt-12 flex flex-wrap gap-3">
              <ButtonAnchor href={personalInfo.resume} tone="solid">
                Résumé
              </ButtonAnchor>
              <ButtonAnchor href={personalInfo.github}>GitHub</ButtonAnchor>
              <ButtonAnchor href={personalInfo.linkedin}>LinkedIn</ButtonAnchor>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-line border-y border-line">
              {[
                ['Role', personalInfo.role],
                ['Based', personalInfo.location],
                ['Timezone', personalInfo.timezone],
                ['Availability', 'Open to roles'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="kicker">{label}</dt>
                  <dd className="text-right text-sm">{value}</dd>
                </div>
              ))}
            </dl>

            <Kicker className="mt-10">Focus</Kicker>
            <p className="mt-3 text-sm leading-relaxed text-muted">{personalInfo.tagline}</p>
          </Reveal>
        </div>
      </Shell>
    </Section>

    <Section theme="light" className="py-24 md:py-32">
      <Shell>
        <SectionHead
          label="Education"
          title="Training"
          aside={`${pad(educationEntries.length)} entries`}
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {educationEntries.map((entry, index) => (
            <Reveal key={entry.index} delay={index * 0.08} className="bg-bg">
              <div className="flip-hover h-full bg-bg p-8 sm:p-10">
                <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
                  <span className="kicker tabular">{entry.index}</span>
                  <span className="kicker tabular">{entry.period}</span>
                </div>

                <LineReveal
                  as="h3"
                  text={readable(entry.institution)}
                  className="display mt-8 text-[clamp(1.35rem,3vw,2rem)]"
                />

                <p className="mt-4 text-sm">
                  {readable(entry.degree)}
                </p>

                <p className="mt-6 text-sm leading-relaxed text-muted">{entry.description}</p>

                {entry.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="kicker">
                        {readable(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Shell>
    </Section>
  </main>
);

export default AboutPage;
