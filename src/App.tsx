import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MenuOverlay from './components/MenuOverlay';
import HomeScreen from './components/HomeScreen';
import SiteLayout from './components/SiteLayout';
import ProjectsPage from './components/ProjectsPage';
import AboutPage from './components/AboutPage';
import ExperiencePage from './components/ExperiencePage';
import ContactPage from './components/ContactPage';
import NotFoundPage from './components/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';

// The gate is a first-impression, not a toll booth: once a visitor has walked
// through it they skip it on refresh, but only for this long.
const KNOWN_ROUTES = ['/', '/projects', '/about', '/experience', '/contact'];

const GATE_TTL = 10 * 60 * 1000;
const GATE_KEY = 'portfolio:gate-entered-at';

/** Storage throws in private mode and when site data is blocked. */
const gatePassedRecently = () => {
  try {
    const raw = window.localStorage.getItem(GATE_KEY);
    if (!raw) return false;
    const enteredAt = Number(raw);
    return Number.isFinite(enteredAt) && Date.now() - enteredAt < GATE_TTL;
  } catch {
    return false;
  }
};

const rememberGateEntry = () => {
  try {
    window.localStorage.setItem(GATE_KEY, String(Date.now()));
  } catch {
    // Nothing to do — the visitor simply sees the gate again next time.
  }
};

const CURTAIN_IN = 700;
// The curtain lifts as the home screen mounts so its fade-rise animations
// play in view rather than behind black.
const CURTAIN_HOLD = 0;

function App() {
  const [view, setView] = useState<'gate' | 'home'>(() => {
    // A dead link should land on the 404, not behind the gate.
    if (!KNOWN_ROUTES.includes(window.location.pathname)) return 'home';
    return gatePassedRecently() ? 'home' : 'gate';
  });
  const [curtain, setCurtain] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const timers = useRef<number[]>([]);

  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Opening the gate: black curtain wipes in, the view swaps behind it, then
  // it lifts on the chosen page. The router only mounts once the gate is open,
  // so the address bar is set first and BrowserRouter reads it on mount.
  const openGate = useCallback((path = '/') => {
    rememberGateEntry();
    setMenuOpen(false);
    setCurtain(true);
    timers.current.push(
      window.setTimeout(() => {
        if (path !== window.location.pathname) {
          window.history.replaceState(null, '', path);
        }
        setView('home');
      }, CURTAIN_IN),
      window.setTimeout(() => setCurtain(false), CURTAIN_IN + CURTAIN_HOLD),
    );
  }, []);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  // Lock the page while the gate overlay owns the viewport.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <div className="bg-black">
      {view === 'gate' ? (
        <>
          <Navbar menuOpen={menuOpen} onToggle={toggleMenu} onEnter={() => openGate('/')} />
          <HeroSection onOpen={() => openGate('/')} locked={menuOpen} />
          <MenuOverlay open={menuOpen} onClose={closeMenu} onNavigate={openGate} />
        </>
      ) : (
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      )}

      <div
        className={`fixed inset-0 z-[60] bg-black transition-opacity ease-overlay ${
          curtain ? 'duration-700' : 'duration-500'
        } ${
          curtain ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </div>
  );
}

export default App;
