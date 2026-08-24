import { projects } from '../data/projects';
import ProjectStack from './ProjectStack';

const INK = '#000000';
const MUTED = '#6F6F6F';

const ProjectsPage = () => (
  <main className="w-full pt-16 md:pt-24 pb-24 md:pb-32">
    <header className="max-w-7xl mx-auto px-6 sm:px-8">
      <p className="text-sm" style={{ color: MUTED }}>
        {projects.length} projects
      </p>
      <h1
        className="font-instrument mt-3 text-5xl sm:text-6xl md:text-7xl leading-[0.95]"
        style={{ color: INK, letterSpacing: '-0.0256em' }}
      >
        Everything I have shipped.
      </h1>
    </header>

    <div className="mt-12 md:mt-16">
      <ProjectStack items={projects} />
    </div>
  </main>
);

export default ProjectsPage;
