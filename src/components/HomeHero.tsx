import { useEffect, useRef } from 'react';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const INK = '#000000';
const MUTED = '#6F6F6F';

// Fade window at each end of the clip, in seconds.
const FADE = 0.5;

const DESCRIPTION =
  'Machine learning and data work that leaves the notebook — an evaluated local RAG pipeline, models running in production, and analysis that changes decisions.';

const HomeHero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frame = 0;
    let restart = 0;

    // Manual loop: the clip is watched frame by frame so it can fade up at the
    // head and back down at the tail, then restart from black.
    const tick = () => {
      const { currentTime, duration } = video;
      if (Number.isFinite(duration) && duration > 0) {
        let opacity = 1;
        if (currentTime < FADE) {
          opacity = currentTime / FADE;
        } else if (currentTime > duration - FADE) {
          opacity = (duration - currentTime) / FADE;
        }
        video.style.opacity = String(Math.min(1, Math.max(0, opacity)));
      }
      frame = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      restart = window.setTimeout(() => {
        video.currentTime = 0;
        void video.play();
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(restart);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <>
      {/* Video sits below the fold of the headline; the offset scales with the
          viewport so it is not pushed off short screens. */}
      <div
        className="absolute left-0 right-0 bottom-0 z-0"
        style={{ top: 'clamp(190px, 34vh, 300px)' }}
      >
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover opacity-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-24 sm:pb-32 md:pb-40"
        style={{ paddingTop: 'clamp(1.5rem, 4vh, calc(8rem - 75px))' }}
      >
        <h1
          className="animate-fade-rise font-instrument font-normal max-w-7xl text-5xl sm:text-7xl md:text-8xl"
          style={{ color: INK, lineHeight: 0.95, letterSpacing: '-0.0256em' }}
        >
          Beyond the prototype,{' '}
          <span className="italic" style={{ color: MUTED }}>
            I build
          </span>{' '}
          what actually{' '}
          <span className="italic" style={{ color: MUTED }}>
            ships.
          </span>
        </h1>

        <p
          className="animate-fade-rise-delay max-w-2xl mt-6 sm:mt-8 text-base sm:text-lg leading-relaxed"
          style={{ color: MUTED }}
        >
          {DESCRIPTION}
        </p>

        <a
          href="#work"
          className="animate-fade-rise-delay-2 mt-10 sm:mt-12 rounded-full px-10 sm:px-14 py-4 sm:py-5 text-sm sm:text-base text-white transition-transform duration-300 hover:scale-[1.03]"
          style={{ backgroundColor: INK }}
        >
          View Work
        </a>
      </section>
    </>
  );
};

export default HomeHero;
