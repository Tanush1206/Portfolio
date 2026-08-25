import { useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import type { Project } from '../data/projects';
import ProjectCard, { CARD_OFFSET_STEP } from './ProjectCard';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface ProjectStackProps {
  items: Project[];
}

/**
 * Deck-of-cards scroll: every card pins in turn and scales down as the next
 * one stacks over it. Shared by the home page's featured three and the work
 * page's full list.
 */
// The deck needs a card to fit inside 85vh while pinned. On a phone a long
// description runs taller than the whole viewport, so below this width the
// cards render as an ordinary list instead.
const DECK_QUERY = '(min-width: 768px)';

const ProjectStack = ({ items }: ProjectStackProps) => {
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [stacked, setStacked] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DECK_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(DECK_QUERY);
    const sync = () => setStacked(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Cards are nudged down by a relative `top`, which moves them visually but
  // reserves no layout space — so the deepest card hangs past the stack and the
  // next section slides over it. Reserve that drift here.
  const drift = stacked ? (items.length - 1) * CARD_OFFSET_STEP : 0;

  return (
    <div ref={container} className="relative" style={{ paddingBottom: drift }}>
      {items.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          progress={scrollYProgress}
          stacked={stacked && !reducedMotion}
          // Each card starts shrinking once the next one begins its approach.
          range={[index * (1 / items.length), 1]}
          targetScale={1 - (items.length - 1 - index) * 0.03}
        />
      ))}
    </div>
  );
};

export default ProjectStack;
