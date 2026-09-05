import { Link } from 'react-router-dom';
import { personalInfo } from '../data/personal';

/**
 * Rendered outside SiteLayout on purpose: a dead link should not come with
 * a working nav bar wrapped around it. It gets its own minimal chrome.
 */
const NotFoundPage = () => (
  <main data-theme="dark" className="section grid min-h-[100svh] place-items-center px-5">
    <div className="w-full max-w-xl">
      <Link to="/" className="text-[15px] font-medium tracking-tight">
        {personalInfo.name}
      </Link>

      <p className="display mt-14 text-[clamp(4rem,20vw,10rem)]">404</p>

      <div className="mt-10 border-t border-line pt-8">
        <p className="text-lg">This page does not exist.</p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          The link may be broken, or the page may have moved. Everything else is still where you
          left it.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/" className="group btn">
          Back to home
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
        <Link to="/projects" className="group btn-ghost">
          See the work
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  </main>
);

export default NotFoundPage;
