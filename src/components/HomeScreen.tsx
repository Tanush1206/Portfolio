import HomeHero from './HomeHero';
import WorkSection from './WorkSection';

const HomeScreen = () => (
  <>
    {/* The hero owns its own stacking context so the video layer stays pinned
        to the first viewport rather than stretching down the whole page. */}
    <div
      id="top"
      className="relative min-h-[calc(100vh-4.5rem)] w-full overflow-x-clip scroll-mt-20"
    >
      <HomeHero />
    </div>

    <WorkSection />
  </>
);

export default HomeScreen;
