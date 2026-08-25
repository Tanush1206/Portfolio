import { coreLanguages, devTools, domainFocus, frameworks } from '../data/skills';
import { PageHeader, Panel } from './pageChrome';
import { INK, MUTED, readable } from './pageText';

const SkillsPage = () => (
  <main className="w-full pt-16 md:pt-24 pb-24 md:pb-32">
    <PageHeader eyebrow="Stack" title="What I work with." />

    <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
      <Panel className="lg:col-span-2">
        <h2
          className="font-instrument text-2xl sm:text-3xl leading-[0.95]"
          style={{ color: INK, letterSpacing: '-0.0256em' }}
        >
          Core languages
        </h2>

        <ul className="mt-8 space-y-6">
          {coreLanguages.map((language) => (
            <li key={language.name}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span style={{ color: INK }}>{readable(language.name)}</span>
                <span className="text-xs" style={{ color: MUTED }}>
                  {language.level}
                </span>
              </div>
              <div
                className="mt-2 h-px w-full bg-black/10"
                role="img"
                aria-label={`${readable(language.name)}: ${language.level} out of 100`}
              >
                <div
                  className="h-px"
                  style={{ width: `${language.level}%`, backgroundColor: INK }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <h2
          className="font-instrument text-2xl sm:text-3xl leading-[0.95]"
          style={{ color: INK, letterSpacing: '-0.0256em' }}
        >
          Focus
        </h2>
        <ul className="mt-6 space-y-4">
          {domainFocus.map((focus) => (
            <li key={focus.label} className="flex items-start gap-3 text-sm">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: INK }}
              />
              <span style={{ color: MUTED }}>{readable(focus.label)}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>

    <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-5 md:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
      <Panel className="lg:col-span-2">
        <h2
          className="font-instrument text-2xl sm:text-3xl leading-[0.95]"
          style={{ color: INK, letterSpacing: '-0.0256em' }}
        >
          Frameworks and libraries
        </h2>
        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {frameworks.map((framework) => (
            <div key={framework.name} className="border-b border-black/10 pb-3">
              <dt className="text-sm" style={{ color: INK }}>
                {readable(framework.name)}
              </dt>
              <dd className="mt-1 text-xs" style={{ color: MUTED }}>
                {readable(framework.label)}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel>
        <h2
          className="font-instrument text-2xl sm:text-3xl leading-[0.95]"
          style={{ color: INK, letterSpacing: '-0.0256em' }}
        >
          Tools
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {devTools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-black/10 px-3 py-1 text-[11px]"
              style={{ color: MUTED }}
            >
              {readable(tool)}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  </main>
);

export default SkillsPage;
