import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { Project } from '../data/projects';

const INK = '#000000';
const MUTED = '#6F6F6F';

/** How far each successive card sits below the one before it, in px. */
export const CARD_OFFSET_STEP = 28;

// The data still carries SCREAMING_SNAKE titles from the terminal-era UI.
const readable = (title: string) => title.replace(/_/g, ' ');

interface ProjectCardProps {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  /** False on narrow screens, where the cards are a plain list. */
  stacked: boolean;
}

const ProjectCard = ({
  project,
  index,
  progress,
  range,
  targetScale,
  stacked,
}: ProjectCardProps) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    // pointer-events-none while stacked: the full-width sticky boxes overlap
    // once several cards are pinned, and a transparent one on top would
    // otherwise eat the clicks meant for the card beneath it.
    <div
      className={
        stacked
          ? 'min-h-[85vh] flex items-center justify-center sticky top-32 px-6 py-6 pointer-events-none'
          : 'flex justify-center px-6 pb-5'
      }
    >
      <motion.article
        style={
          stacked
            ? { scale, top: `${index * CARD_OFFSET_STEP}px`, transformOrigin: 'top' }
            : undefined
        }
        className={`relative flex flex-col w-full max-w-5xl rounded-3xl bg-white border border-black/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)] px-7 py-9 sm:px-12 sm:py-12 md:px-16 md:py-14 ${
          stacked ? 'pointer-events-auto' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-4 text-xs sm:text-sm" style={{ color: MUTED }}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{project.status.replace(/_/g, ' ')}</span>
        </div>

        <h3
          className="font-instrument mt-5 sm:mt-7 text-3xl sm:text-5xl md:text-6xl leading-[0.95] min-h-[1.9em]"
          style={{ color: INK, letterSpacing: '-0.0256em' }}
        >
          {readable(project.title)}
        </h3>

        {/* Full copy, no clamp. The reserved height keeps every card the same
            size regardless of how long its description runs. */}
        <p
          className="mt-5 sm:mt-6 max-w-3xl text-sm sm:text-base leading-relaxed sm:min-h-[11.375em] md:min-h-[16.25em]"
          style={{ color: MUTED }}
        >
          {project.description}
        </p>

        <div className="mt-6 sm:mt-8 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 px-3 py-1 text-[11px] sm:text-xs"
              style={{ color: MUTED }}
            >
              {tag.replace(/_/g, ' ')}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-8 sm:pt-10 flex flex-wrap items-center gap-3">
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-6 py-2.5 text-sm text-white transition-transform duration-300 hover:scale-[1.03]"
            style={{ backgroundColor: INK }}
          >
            View source
          </a>
          {project.demoUrl && project.demoUrl !== '#' && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-black/15 px-6 py-2.5 text-sm transition-colors duration-300 hover:border-black/40"
              style={{ color: INK }}
            >
              Live demo
            </a>
          )}
        </div>
      </motion.article>
    </div>
  );
};

export default ProjectCard;
