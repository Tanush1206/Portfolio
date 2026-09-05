import { useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import type { Project } from '../data/projects';
import ProjectCard, { CARD_OFFSET_STEP } from './ProjectCard';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// The deck needs a card to fit inside the pinned viewport. On a phone a long
// description runs taller than the whole screen, so below this width the
// cards render as an ordinary list instead of jumping over one another.
const DECK_QUERY = '(min-width: 768px)';

/**
 * Deck-of-cards scroll: each card pins in turn and scales down as the next
 * one stacks over it.
 */
const ProjectStack = ({ items }: { items: Project[] }) => {
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DECK_QUERY);
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const stacked = wide && !reducedMotion;

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Cards are nudged down by a relative `top`, which moves them visually but
  // reserves no layout space — so the deepest card would hang past the stack
  // and the next section would slide over it. Reserve that drift here.
  const drift = stacked ? (items.length - 1) * CARD_OFFSET_STEP : 0;

  return (
    <div ref={container} className="relative" style={{ paddingBottom: drift }}>
      {items.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          total={items.length}
          progress={scrollYProgress}
          stacked={stacked}
          // Each card starts shrinking once the next one begins its approach.
          range={[index * (1 / items.length), 1]}
          targetScale={1 - (items.length - 1 - index) * 0.03}
        />
      ))}
    </div>
  );
};

export default ProjectStack;
