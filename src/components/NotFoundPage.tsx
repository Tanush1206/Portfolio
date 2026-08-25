import { Link } from 'react-router-dom';

const NOT_FOUND_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260801_001207_ec20d138-aa45-4b2b-ab8c-bdc71607f240.mp4';

const NotFoundPage = () => (
  <main className="nf-page">
    <video
      className="nf-video"
      src={NOT_FOUND_VIDEO}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
    />

    <Link
      to="/"
      className="absolute top-10 left-1/2 -translate-x-1/2 z-10 font-instrument text-white text-2xl tracking-tight"
    >
      Tanush Thakran
    </Link>

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[min(100%-2.5rem,560px)] flex flex-col items-center text-center gap-7 sm:gap-9">
      <h1 className="nf-404 font-instrument">404</h1>

      <div className="w-full max-w-[425px] h-px bg-white/60" />

      <p className="nf-message">
        The path may be broken, but the journey isn&apos;t. Let&apos;s get you back.
      </p>

      <Link
        to="/"
        className="rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black transition-transform duration-300 hover:scale-[1.03]"
      >
        Back to home
      </Link>
    </div>
  </main>
);

export default NotFoundPage;
