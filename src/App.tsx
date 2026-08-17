import { Suspense, lazy, useMemo } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Plain from './routes/Plain';

/**
 * three.js, r3f and the post-processing stack are ~1 MB of the bundle. Splitting
 * them behind the route means a visitor without WebGL — and any crawler — gets
 * the text version without paying for a renderer they will never run.
 */
const Ask = lazy(() => import('./routes/Ask'));

/**
 * One probe at startup rather than a try/catch around the renderer — a failed
 * <Canvas> throws inside a Suspense boundary and leaves a blank page, which is
 * a worse answer than the text version.
 */
function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function App() {
  const webgl = useMemo(hasWebGL, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            webgl ? (
              // Same wording as the corpus-loading state, so the split is
              // invisible rather than two different spinners in sequence.
              <Suspense fallback={<Booting />}>
                <Ask />
              </Suspense>
            ) : (
              <Navigate to="/plain" replace />
            )
          }
        />
        <Route path="/plain" element={<Plain />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function Booting() {
  return (
    <div className="bg-backdrop fixed inset-0 flex items-center justify-center">
      <span className="text-muted animate-pulse text-[11px] uppercase tracking-[0.22em]">
        reading latent space…
      </span>
    </div>
  );
}
