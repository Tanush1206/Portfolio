import { personalInfo } from '../data/personal';
import { educationEntries } from '../data/education';
import { PageHeader, Panel } from './pageChrome';
import { INK, MUTED, readable } from './pageText';

const AboutPage = () => (
  <main className="w-full pt-16 md:pt-24 pb-24 md:pb-32">
    <PageHeader eyebrow={personalInfo.role} title="A little about me." />

    <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
      <Panel className="lg:col-span-2">
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: MUTED }}>
          {personalInfo.bio}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={personalInfo.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-6 py-2.5 text-sm text-white transition-transform duration-300 hover:scale-[1.03]"
            style={{ backgroundColor: INK }}
          >
            Download résumé
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-black/15 px-6 py-2.5 text-sm transition-colors duration-300 hover:border-black/40"
            style={{ color: INK }}
          >
            GitHub
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-black/15 px-6 py-2.5 text-sm transition-colors duration-300 hover:border-black/40"
            style={{ color: INK }}
          >
            LinkedIn
          </a>
        </div>
      </Panel>

      <Panel>
        <dl className="space-y-5 text-sm">
          {[
            ['Based in', personalInfo.location],
            ['Timezone', personalInfo.timezone],
            ['Focus', personalInfo.tagline],
          ].map(([label, value]) => (
            <div key={label}>
              <dt style={{ color: MUTED }}>{label}</dt>
              <dd className="mt-1" style={{ color: INK }}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>
    </div>

    <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-16 md:mt-24">
      <h2
        className="font-instrument text-3xl sm:text-4xl md:text-5xl leading-[0.95]"
        style={{ color: INK, letterSpacing: '-0.0256em' }}
      >
        Education
      </h2>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {educationEntries.map((entry) => (
          <Panel key={entry.index}>
            <div className="flex items-center justify-between gap-4 text-xs" style={{ color: MUTED }}>
              <span>{entry.index}</span>
              <span>{entry.period}</span>
            </div>
            <h3
              className="font-instrument mt-4 text-2xl sm:text-3xl leading-[0.95]"
              style={{ color: INK, letterSpacing: '-0.0256em' }}
            >
              {readable(entry.institution)}
            </h3>
            <p className="mt-2 text-sm" style={{ color: INK }}>
              {readable(entry.degree)}
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: MUTED }}>
              {entry.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {entry.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 px-3 py-1 text-[11px]"
                  style={{ color: MUTED }}
                >
                  {readable(tag)}
                </span>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  </main>
);

export default AboutPage;
