// ─────────────────────────────────────────────
// FLIGHT GLOBE — the React shell around FlightScene.
//
// This component owns DOM and state only. All three.js lives in scene.ts, so
// nothing here re-renders on a per-frame basis except the telemetry readouts,
// which are throttled by the scene to one callback per frame and written into
// refs rather than state where possible.
//
// The arrival panel renders the EXISTING section components — About, Projects,
// Skills and the rest — so those files stay the single source of truth. The
// globe is a navigation layer over the real routes, never a replacement: every
// gate carries the route it mirrors, and /about, /projects and friends keep
// working untouched for crawlers, screen readers and anyone who'd rather just
// read the site.
// ─────────────────────────────────────────────

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { stations, type Gate, type Station } from '../../data/stations';
import { distanceKm, formatETE, CRUISE_KMH } from './geo';
import { FlightScene, type LabelPos, type Phase, type Telemetry } from './scene';

import About from '../About';
import Skills from '../Skills';
import Education from '../Education';
import Experience from '../Experience';
import Projects from '../Projects';
import Contact from '../Contact';
import Certificates from '../Certificates';

const GATE_COMPONENTS: Record<string, React.ComponentType> = {
  identity: About,
  stack: Skills,
  education: Education,
  experience: Experience,
  projects: Projects,
  certificates: Certificates,
  contact: Contact,
};

const BADGE_CLASS: Record<Station['badge'], string> = {
  home: 'text-amber border-amber/35 bg-amber/[0.07]',
  onsite: 'text-tertiary border-tertiary/35 bg-tertiary/[0.07]',
  intl: 'text-secondary border-secondary/35 bg-secondary/[0.07]',
};

const PHASE_CLASS: Record<string, string> = {
  stand: 'text-outline border-outline/30 bg-outline/[0.07]',
  climb: 'text-amber border-amber/35 bg-amber/[0.08]',
  cruise: 'text-tertiary border-tertiary/35 bg-tertiary/[0.08]',
  descent: 'text-amber border-amber/35 bg-amber/[0.08]',
};

const PHASE_LABEL: Record<string, string> = {
  stand: 'ON STAND',
  climb: 'CLIMB',
  cruise: 'CRUISE',
  descent: 'DESCENT',
};

const EMPTY_TELEMETRY: Telemetry = {
  phase: 'boot',
  flightPhase: 'stand',
  callsign: 'TT—000',
  fromCode: 'DEL',
  fromCity: 'New Delhi',
  toCode: null,
  toCity: null,
  distanceKm: 0,
  eteMinutes: 0,
  progress: 0,
  heading: 0,
  altitudeFt: 0,
  groundSpeedKt: 0,
  legCount: 0,
  currentCode: 'DEL',
};

const WindowDots: React.FC = () => (
  <span className="flex gap-1.5 items-center shrink-0" aria-hidden="true">
    <i className="w-2 h-2 rounded-full bg-[#ff5f56] block" />
    <i className="w-2 h-2 rounded-full bg-[#ffbd2e] block" />
    <i className="w-2 h-2 rounded-full bg-[#27c93f] block" />
  </span>
);

const FlightGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<FlightScene | null>(null);

  const [phase, setPhase] = useState<Phase>('boot');
  const [progress, setProgress] = useState({ pct: 0, note: 'initialising' });
  const [error, setError] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry>(EMPTY_TELEMETRY);
  const [labels, setLabels] = useState<LabelPos[]>([]);
  const [openStation, setOpenStation] = useState<Station | null>(null);
  const [openGate, setOpenGate] = useState<Gate | null>(null);

  // Telemetry fires every frame; keep React updates to ~12/s so the HUD is
  // live without thrashing the reconciler.
  const lastTelemetryPush = useRef(0);

  const handleTelemetry = useCallback((t: Telemetry) => {
    const now = performance.now();
    if (now - lastTelemetryPush.current < 80) return;
    lastTelemetryPush.current = now;
    setTelemetry(t);
  }, []);

  const openStationPanel = useCallback((station: Station) => {
    setOpenStation(station);
    setOpenGate(station.gates[0]);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new FlightScene(mount, {
      onTelemetry: handleTelemetry,
      onLabels: setLabels,
      onArrive: openStationPanel,
      onSelectCurrent: openStationPanel,
      onProgress: (pct, note) => setProgress({ pct, note }),
      onPhase: setPhase,
    });
    sceneRef.current = scene;

    scene.init().catch((err: unknown) => {
      console.error('[FlightGlobe] init failed', err);
      setError(err instanceof Error ? err.message : String(err));
    });

    const onResize = () => scene.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      scene.dispose();
      sceneRef.current = null;
    };
  }, [handleTelemetry, openStationPanel]);

  // Let the scene pause its idle drift while a panel covers the globe.
  useEffect(() => {
    sceneRef.current?.setPanelOpen(!!openStation);
  }, [openStation]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenStation(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const currentStation = useMemo(
    () => stations.find((s) => s.code === telemetry.currentCode) ?? stations[0],
    [telemetry.currentCode],
  );

  const fly = (code: string) => {
    const station = stations.find((s) => s.code === code);
    if (!station) return;
    setOpenStation(null);
    if (station.code === telemetry.currentCode) {
      sceneRef.current?.focusCurrent();
      openStationPanel(station);
    } else {
      sceneRef.current?.depart(code);
    }
  };

  const GateBody = openGate ? GATE_COMPONENTS[openGate.id] : null;
  const inFlight = telemetry.flightPhase !== 'stand';
  const showHud = phase === 'globe';

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-margin-safe">
        <div className="glass-card p-8 max-w-lg">
          <div className="font-code-snippet text-[10px] tracking-widest uppercase text-[#ff5f56] mb-3">
            Preflight failed
          </div>
          <h1 className="font-headline-md text-headline-md text-white uppercase mb-4">
            Globe unavailable
          </h1>
          <p className="font-body-sm text-on-surface-variant leading-relaxed mb-6">
            The coastline data or WebGL context could not be loaded.{' '}
            <span className="text-primary break-all">{error}</span>
          </p>
          <Link
            to="/projects"
            className="inline-block font-code-snippet text-[11px] uppercase tracking-widest text-primary border border-primary/40 px-5 py-3 hover:bg-primary hover:text-background transition-all"
          >
            Continue to the site &gt;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#02040a] overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />

      {/* ── projected airport labels ── */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {labels.map((l) => {
          const st = stations.find((s) => s.code === l.code);
          const color =
            l.state === 'dest' ? 'text-tertiary' : l.state === 'here' ? 'text-amber' : 'text-white';
          return (
            <div
              key={l.code}
              className="absolute -translate-y-1/2 translate-x-3 whitespace-nowrap transition-opacity duration-200"
              style={{ left: l.x, top: l.y, opacity: l.opacity }}
            >
              <span className="absolute -left-3 top-1/2 w-2 h-px bg-white/45" />
              <div
                className={`font-headline-md text-[12px] font-bold tracking-wide ${color}`}
                style={{ textShadow: '0 1px 10px #000, 0 0 22px rgba(0,0,0,.95)' }}
              >
                {l.code}
              </div>
              <div
                className="font-code-snippet text-[7px] tracking-[0.13em] uppercase text-primary mt-0.5 hidden md:block"
                style={{ textShadow: '0 1px 8px #000' }}
              >
                {st?.city}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── boot ── */}
      {phase === 'boot' && (
        <div className="absolute inset-0 z-[60] bg-[#02040a] flex items-center justify-center px-6">
          <div className="w-full max-w-[430px]">
            <div className="font-headline-lg text-[clamp(24px,5vw,36px)] font-bold uppercase text-white tracking-tight mb-1.5">
              FLIGHT_LOG
            </div>
            <div className="font-code-snippet text-[11px] text-tertiary mb-5">
              <span className="text-outline">&gt;</span> initiate --preflight
            </div>
            <div className="font-code-snippet text-[10px] leading-[2.1] text-on-surface-variant">
              <span className="text-tertiary">✓</span> {progress.note}
            </div>
            <div className="h-0.5 bg-white/10 mt-4">
              <i
                className="block h-full bg-tertiary transition-[width] duration-300"
                style={{ width: `${progress.pct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── solar system intro ── */}
      {phase === 'solar' && (
        <div className="absolute inset-0 z-[40] flex flex-col items-start justify-end pb-10 md:pb-14 px-6 md:px-12 pointer-events-none bg-gradient-to-tr from-[#02040a]/92 via-[#02040a]/45 to-transparent">
          <div className="text-left max-w-lg pointer-events-auto">
            <div className="font-code-snippet text-[10px] tracking-[0.2em] uppercase text-tertiary mb-4">
              01 // Sol system · third planet
            </div>
            <h1 className="font-headline-lg text-[clamp(30px,7vw,60px)] font-bold uppercase text-white leading-[0.95] tracking-tight mb-5">
              Tanush Thakran
            </h1>
            <p className="font-body-sm text-on-surface-variant leading-relaxed mb-8">
              An AI/ML engineer's work, plotted as a flight log. Four stations —
              <span className="text-primary"> Delhi</span>,
              <span className="text-primary"> Bengaluru</span>,
              <span className="text-primary"> Pilani</span> and
              <span className="text-secondary"> Cairo</span> — every one a place the
              work actually happened.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={() => sceneRef.current?.beginApproach()}
                className="w-full sm:w-auto px-8 py-4 border border-tertiary text-tertiary font-code-snippet text-[11px] uppercase tracking-[0.18em] hover:bg-tertiary hover:text-background transition-all"
              >
                Descend to Earth
              </button>
              <Link
                to="/projects"
                className="w-full sm:w-auto px-8 py-4 border border-white/20 text-on-surface font-code-snippet text-[11px] uppercase tracking-[0.18em] hover:border-primary hover:text-primary transition-all text-center"
              >
                Skip to the site
              </Link>
            </div>
          </div>
        </div>
      )}

      {phase === 'approach' && (
        <div className="absolute inset-0 z-[40] flex items-center justify-center pointer-events-none">
          <div className="font-code-snippet text-[10px] tracking-[0.22em] uppercase text-tertiary/80 animate-pulse">
            ▚ descending
          </div>
        </div>
      )}

      {/* ── flight strip ── */}
      {showHud && (
        <div className="absolute top-3 left-3 md:top-4 md:left-4 right-3 md:right-auto md:w-[296px] z-20 glass-card">
          <div className="flex items-center gap-2.5 px-3 py-2 border-b border-white/10">
            <WindowDots />
            <span className="font-code-snippet text-[9px] tracking-[0.14em] uppercase text-outline">
              flight_strip.log
            </span>
          </div>
          <div className="px-4 pt-3 pb-3.5">
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-headline-md text-[15px] font-bold text-white">
                {telemetry.callsign}
              </span>
              <span
                className={`font-code-snippet text-[8.5px] tracking-[0.14em] px-1.5 py-0.5 border whitespace-nowrap ${
                  PHASE_CLASS[telemetry.flightPhase]
                }`}
              >
                {PHASE_LABEL[telemetry.flightPhase]}
              </span>
            </div>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="text-center shrink-0 min-w-[44px]">
                <div className="font-headline-md text-[21px] font-bold text-white leading-none">
                  {telemetry.fromCode}
                </div>
                <div className="font-code-snippet text-[7.5px] tracking-wider uppercase text-outline mt-1">
                  {telemetry.fromCity}
                </div>
              </div>
              <div className="flex-1 relative h-4">
                <div className="absolute top-[7px] inset-x-0 h-px bg-white/15" />
                <div
                  className="absolute top-[7px] left-0 h-px bg-tertiary shadow-[0_0_7px_#4edea3]"
                  style={{ width: `${telemetry.progress * 100}%` }}
                />
                <div
                  className="absolute top-0 text-[11px] text-tertiary -translate-x-1/2"
                  style={{ left: `${telemetry.progress * 100}%` }}
                >
                  ✈
                </div>
              </div>
              <div className="text-center shrink-0 min-w-[44px]">
                <div className="font-headline-md text-[21px] font-bold text-white leading-none">
                  {telemetry.toCode ?? '—'}
                </div>
                <div className="font-code-snippet text-[7.5px] tracking-wider uppercase text-outline mt-1">
                  {telemetry.toCity ?? 'select'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-px bg-white/10">
              {[
                ['Dist', inFlight ? `${Math.round(telemetry.distanceKm).toLocaleString()} km` : '—'],
                ['ETE', inFlight ? formatETE(telemetry.eteMinutes) : '—'],
                ['Legs', String(telemetry.legCount)],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#090a0d]/80 px-2 py-2 text-center">
                  <div className="font-code-snippet text-[7px] tracking-[0.12em] uppercase text-outline mb-1">
                    {k}
                  </div>
                  <div className="font-headline-md text-[12px] font-bold text-primary">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── departures board ── */}
      {showHud && (
        <div className="absolute z-20 glass-card flex flex-col bottom-3 left-3 right-3 md:bottom-auto md:left-auto md:top-4 md:right-4 md:w-[302px] md:max-h-[calc(100vh-2rem)]">
          <div className="hidden md:block px-4 pt-3 pb-2.5 border-b border-white/10">
            <span className="font-code-snippet text-[9px] tracking-[0.15em] uppercase text-outline">
              02 // Departures
            </span>
            <div className="font-headline-md text-[14px] font-semibold uppercase text-white mt-1.5">
              Route Network
            </div>
          </div>
          <div className="flex md:block overflow-x-auto md:overflow-y-auto">
            {stations.map((st) => {
              const here = st.code === telemetry.currentCode;
              const km = here ? 0 : distanceKm(currentStation, st);
              return (
                <button
                  type="button"
                  key={st.code}
                  onClick={() => fly(st.code)}
                  disabled={inFlight}
                  className={`text-left w-full min-w-[116px] md:min-w-0 grid md:grid-cols-[38px_1fr_auto] gap-0 md:gap-2.5 items-center px-3 py-2.5 border-r md:border-r-0 md:border-b border-white/[0.06] transition-colors ${
                    here ? 'bg-amber/[0.07]' : 'hover:bg-primary/[0.08]'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <div
                    className={`font-headline-md text-[15px] font-bold leading-none ${
                      here ? 'text-amber' : 'text-primary'
                    }`}
                  >
                    {st.code}
                  </div>
                  <div className="min-w-0">
                    <div className="font-code-snippet text-[10.5px] uppercase tracking-wide text-on-surface truncate">
                      {st.gates.map((g) => g.label).join(' · ')}
                    </div>
                    <div className="font-code-snippet text-[8px] tracking-wider text-outline mt-0.5 truncate">
                      {st.city} · {st.region}
                    </div>
                    <div className="hidden md:block font-code-snippet text-[8px] text-outline mt-0.5">
                      {here
                        ? '— at stand —'
                        : `${Math.round(km).toLocaleString()} km · ${formatETE((km / CRUISE_KMH) * 60)}`}
                    </div>
                  </div>
                  <span
                    className={`hidden md:block font-code-snippet text-[6.5px] tracking-[0.1em] px-1.5 py-0.5 border whitespace-nowrap ${
                      BADGE_CLASS[st.badge]
                    }`}
                  >
                    {st.badgeText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── instruments ── */}
      {showHud && (
        <div className="hidden xl:block absolute bottom-4 left-4 w-[296px] z-20 glass-card px-4 py-3">
          <span className="font-code-snippet text-[9px] tracking-[0.15em] uppercase text-outline">
            03 // Instruments
          </span>
          <div className="grid grid-cols-3 gap-px bg-white/10 mt-2.5">
            {[
              ['HDG', String(Math.round(telemetry.heading)).padStart(3, '0'), 'deg'],
              ['ALT', telemetry.altitudeFt.toLocaleString(), 'ft'],
              ['GS', String(telemetry.groundSpeedKt), 'kt'],
            ].map(([k, v, u]) => (
              <div key={k} className="bg-[#090a0d]/80 px-1.5 py-2.5 text-center">
                <div className="font-code-snippet text-[7px] tracking-[0.12em] uppercase text-outline mb-1.5">
                  {k}
                </div>
                <div className="font-headline-md text-[17px] font-bold text-tertiary leading-none">{v}</div>
                <div className="font-code-snippet text-[6.5px] tracking-widest text-outline mt-1">{u}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── arrival panel: renders the real section components ── */}
      <div
        className={`absolute z-40 left-1/2 bottom-0 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-[980px] flex flex-col glass-card !bg-[#0a0a10]/95 border-b-0 transition-transform duration-[550ms] ease-[cubic-bezier(.22,1,.36,1)] ${
          openStation ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '78vh' }}
        aria-hidden={!openStation}
      >
        {openStation && (
          <>
            <div className="flex items-center gap-3 px-4 md:px-5 py-2.5 border-b border-white/10 bg-[#090a0d]/60 shrink-0">
              <WindowDots />
              <div className="font-headline-md text-[19px] font-bold text-tertiary leading-none shrink-0">
                {openStation.code}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-headline-md text-[14px] font-semibold uppercase text-white leading-tight truncate">
                  {openGate?.title ?? openStation.city}
                </div>
                <div className="font-code-snippet text-[8px] tracking-[0.12em] uppercase text-outline mt-1 truncate">
                  {openStation.name} · {openStation.city}, {openStation.region}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpenStation(null)}
                aria-label="Close panel"
                className="text-[19px] leading-none text-on-surface-variant hover:text-tertiary hover:scale-110 transition-all px-2 py-1 shrink-0"
              >
                ×
              </button>
            </div>

            {/* gates — one station can host several sections */}
            <div className="flex items-center gap-1 px-4 md:px-5 py-2 border-b border-white/10 overflow-x-auto shrink-0">
              <span className="font-code-snippet text-[7.5px] tracking-[0.14em] uppercase text-outline mr-2 shrink-0">
                Gates
              </span>
              {openStation.gates.map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setOpenGate(g)}
                  className={`font-code-snippet text-[9px] tracking-[0.12em] uppercase px-2.5 py-1.5 border whitespace-nowrap transition-all ${
                    openGate?.id === g.id
                      ? 'text-tertiary border-tertiary/45 bg-tertiary/[0.09]'
                      : 'text-on-surface-variant border-white/10 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {g.label}
                </button>
              ))}
              {openGate && (
                <Link
                  to={openGate.route}
                  className="ml-auto font-code-snippet text-[9px] tracking-[0.12em] uppercase text-primary hover:underline whitespace-nowrap shrink-0 pl-3"
                >
                  Open page &gt;
                </Link>
              )}
            </div>

            <div className="px-4 md:px-5 py-2.5 border-b border-white/10 shrink-0">
              <p className="font-code-snippet text-[9.5px] leading-relaxed text-on-surface-variant">
                <span className="text-tertiary">◆</span> {openStation.note}
              </p>
            </div>

            <div className="overflow-y-auto gate-embed px-4 md:px-5">{GateBody && <GateBody />}</div>
          </>
        )}
      </div>

      {/* ── hints ── */}
      {showHud && !openStation && (
        <div className="hidden xl:block absolute bottom-4 right-4 z-20 glass-card px-3 py-2 font-code-snippet text-[8px] tracking-[0.12em] uppercase text-outline leading-loose text-right pointer-events-none">
          drag — orbit · scroll — zoom
          <br />
          click a beacon or a row to fly
        </div>
      )}
    </div>
  );
};

export default FlightGlobe;
