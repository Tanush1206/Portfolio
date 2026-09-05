import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';

/**
 * Media that grows into the page as it is scrolled through: inset and
 * framed when it arrives, flush to the gutter by the time it is centred.
 *
 * The reference pins the block and scrubs the same transform. Pinning is
 * skipped here deliberately — a pinned, transformed ancestor breaks
 * `position: sticky` further down the page, and the project deck depends
 * on sticky. Scrubbing without the pin reads almost identically and costs
 * nothing structurally.
 */
const ScrollExpand = ({
  children,
  from = '76%',
  className = '',
}: {
  children: ReactNode;
  from?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const width = useTransform(scrollYProgress, [0, 1], [from, '100%']);
  const padding = useTransform(scrollYProgress, [0, 1], [14, 0]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`flex justify-center ${className}`}>
      <motion.div style={{ width, padding }} className="border border-line">
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollExpand;
