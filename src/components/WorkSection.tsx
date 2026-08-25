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
    {/* The hero video fades to solid white at its bottom edge, and the fixed
        backdrop starts at full strength directly beneath it. This carries the
        white down over the backdrop so the seam dissolves instead of showing
        as a hard line. Behind the section's own content. */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 md:h-96 bg-gradient-to-b from-white via-white/75 to-transparent"
    />

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
