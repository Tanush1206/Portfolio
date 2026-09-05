import { projects } from '../data/projects';
import ProjectStack from './ProjectStack';
import { ButtonAnchor, PageHead, Reveal, Section, SectionHead, Shell } from './ui';

const readable = (value: string) => value.replace(/_/g, ' ');
const pad = (value: number) => String(value).padStart(2, '0');

const ProjectsPage = () => (
  <main className="w-full">
    <Section theme="dark" className="pb-24 md:pb-32">
      <PageHead
        index="01"
        label="Work"
        title="Index"
        lede="Everything I have built and shipped. Machine learning and retrieval lead, analytics backs them up, and application engineering sits underneath as supporting evidence."
      />

      {/* Scannable table first: a recruiter should be able to take the whole
          list in without scrolling through every case study. */}
      <Shell className="mt-20">
        <Reveal>
          <div className="border-t border-line">
            {projects.map((project, index) => {
              const target =
                project.demoUrl && project.demoUrl !== '#'
                  ? project.demoUrl
                  : project.sourceUrl && project.sourceUrl !== '#'
                    ? project.sourceUrl
                    : null;

              const row = (
                <>
                  <span className="kicker tabular w-10 shrink-0">{pad(index + 1)}</span>
                  <span className="min-w-0 flex-1 truncate text-[15px] sm:text-lg">
                    {readable(project.title)}
                  </span>
                  <span className="kicker hidden shrink-0 md:block">
                    {readable(project.status)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-6 shrink-0 text-right opacity-40 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  >
                    {target ? '↗' : '·'}
                  </span>
                </>
              );

              const shell =
                'group flex items-center gap-6 border-b border-line px-2 py-6 transition-colors duration-300 hover:bg-fg/[0.05]';

              return target ? (
                <a
                  key={project.id}
                  href={target}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-mouse-content={
                    project.demoUrl && project.demoUrl !== '#' ? 'Open live' : 'Read the source'
                  }
                  className={shell}
                >
                  {row}
                </a>
              ) : (
                <div key={project.id} className={shell}>
                  {row}
                </div>
              );
            })}
          </div>
        </Reveal>
      </Shell>
    </Section>

    {/* Then the depth, one pinned card at a time. */}
    <Section theme="light" className="py-24 md:py-32">
      <Shell>
        <SectionHead
          index="02"
          label="Detail"
          title="Case by case"
          aside={`${pad(projects.length)} entries`}
        />
      </Shell>

      <div className="mt-16">
        <ProjectStack items={projects} />
      </div>

      <Shell className="mt-16">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
            <p className="text-sm text-muted">Everything above is public on GitHub.</p>
            <ButtonAnchor href="https://github.com/Tanush1206">GitHub profile</ButtonAnchor>
          </div>
        </Reveal>
      </Shell>
    </Section>
  </main>
);

export default ProjectsPage;
