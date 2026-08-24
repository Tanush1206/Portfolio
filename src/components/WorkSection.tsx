import { projects } from '../data/projects';
import ProjectStack from './ProjectStack';

const INK = '#000000';
const MUTED = '#6F6F6F';

const FEATURED = projects.slice(0, 3);

const WorkSection = () => (
  <section
    id="work"
    className="relative w-full pt-24 md:pt-32 pb-24 md:pb-32 scroll-mt-20 md:scroll-mt-24"
  >
    <header className="max-w-7xl mx-auto px-6 sm:px-8">
      <p className="text-sm" style={{ color: MUTED }}>
        Selected work
      </p>
      <h2
        className="font-instrument mt-3 text-4xl sm:text-6xl md:text-7xl leading-[0.95]"
        style={{ color: INK, letterSpacing: '-0.0256em' }}
      >
        Three things worth reading about.
      </h2>
    </header>

    <div className="mt-12 md:mt-16">
      <ProjectStack items={FEATURED} />
    </div>
  </section>
);

export default WorkSection;
