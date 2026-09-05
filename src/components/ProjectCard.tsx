import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { Project } from '../data/projects';

/** How far each successive card sits below the one before it, in px. */
export const CARD_OFFSET_STEP = 28;

// The data still carries SCREAMING_SNAKE labels from the terminal-era UI.
const readable = (value: string) => value.replace(/_/g, ' ');

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  /** False on narrow screens, where the cards are a plain list. */
  stacked: boolean;
}

const ProjectCard = ({
  project,
  index,
  total,
  progress,
  range,
  targetScale,
  stacked,
}: ProjectCardProps) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  const hasSource = project.sourceUrl && project.sourceUrl !== '#';
  const hasDemo = project.demoUrl && project.demoUrl !== '#';

  return (
    // pointer-events-none while stacked: the full-width sticky boxes overlap
    // once several cards are pinned, and a transparent one on top would
    // otherwise eat the clicks meant for the card beneath it.
    <div
      className={
        stacked
          ? 'pointer-events-none sticky top-28 flex min-h-[86vh] items-center justify-center px-5 py-6 sm:px-8'
          : 'flex justify-center px-5 pb-5 sm:px-8'
      }
    >
      <motion.article
        style={
          stacked
            ? { scale, top: `${index * CARD_OFFSET_STEP}px`, transformOrigin: 'top' }
            : undefined
        }
        className={`relative flex w-full max-w-5xl flex-col border border-line bg-bg p-7 sm:p-12 md:p-16 ${
          stacked ? 'pointer-events-auto' : ''
        }`}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-6">
          <span className="kicker tabular">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="kicker">{readable(project.status)}</span>
        </div>

        {/* Reserved so a two-word title and a five-word one produce cards of
            the same height in the stack. */}
        <h3
          className="display mt-8 text-[clamp(1.75rem,4.5vw,3.25rem)]"
          style={{ minHeight: '1.9em' }}
        >
          {readable(project.title)}
        </h3>

        {/* Reserved on the wider breakpoints for the same reason: the
            shortest description here is 174 characters, the longest 946. */}
        <p className="mt-6 max-w-3xl text-[15px] leading-[1.75] text-muted sm:min-h-[12em] md:min-h-[14.5em]">
          {project.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
          {project.tags.map((tag) => (
            <span key={tag} className="kicker">
              {readable(tag)}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-10">
          {hasDemo && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="group btn">
              Live demo
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          )}

          {hasSource && (
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group btn-ghost"
            >
              View source
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          )}

          {!hasSource && !hasDemo && <span className="kicker">Private repository</span>}
        </div>
      </motion.article>
    </div>
  );
};

export default ProjectCard;
