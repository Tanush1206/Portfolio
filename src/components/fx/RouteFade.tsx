import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

/**
 * A short cross-fade between routes, keyed on the location so the new page
 * mounts already faded out and comes up on its own.
 *
 * Opacity only, deliberately. Animating a transform here would make the
 * whole route a containing block for the duration, and the project deck
 * below depends on sticky positioning that is easy to break from above.
 */
const RouteFade = ({ children }: { children: ReactNode }) => {
  const { key } = useLocation();

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default RouteFade;
