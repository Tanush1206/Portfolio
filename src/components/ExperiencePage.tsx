import { experiences } from '../data/experience';
import { PageHeader, Panel } from './pageChrome';
import { INK, MUTED, readable, withEmphasis } from './pageText';

const ExperiencePage = () => (
  <main className="w-full pt-16 md:pt-24 pb-24 md:pb-32">
    <PageHeader eyebrow={`${experiences.length} roles`} title="Where I have worked." />

    <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 md:mt-16 flex flex-col gap-5 md:gap-6">
      {experiences.map((entry) => (
        <Panel key={`${entry.company}-${entry.period}`}>
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
            <h2
              className="font-instrument text-2xl sm:text-3xl md:text-4xl leading-[0.95]"
              style={{ color: INK, letterSpacing: '-0.0256em' }}
            >
              {readable(entry.role)}
            </h2>
            <span className="text-sm" style={{ color: MUTED }}>
              {entry.period}
            </span>
          </div>

          <p className="mt-2 text-sm" style={{ color: INK }}>
            {readable(entry.company.replace(/^@/, ''))}
            {entry.location ? ` — ${entry.location}` : ''}
          </p>

          <ul className="mt-6 space-y-3">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-black/30" />
                <span>{withEmphasis(highlight)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {entry.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/10 px-3 py-1 text-[11px]"
                style={{ color: MUTED }}
              >
                {readable(tech)}
              </span>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  </main>
);

export default ExperiencePage;
