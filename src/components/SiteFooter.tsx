import { Link, useLocation } from 'react-router-dom';
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from 'react-icons/fa6';
import { personalInfo } from '../data/personal';
import { INK, MUTED } from './pageText';

const SOCIALS = [
  { label: 'GitHub', href: personalInfo.github, Icon: FaGithub },
  { label: 'LinkedIn', href: personalInfo.linkedin, Icon: FaLinkedinIn },
  { label: 'X (Twitter)', href: personalInfo.twitter, Icon: FaXTwitter },
  { label: 'Instagram', href: personalInfo.instagram, Icon: FaInstagram },
];

const SiteFooter = () => {
  const { pathname } = useLocation();
  // The call to action belongs where someone is browsing work, not on the
  // pages that already end in a way to reach me.
  const showCta = pathname === '/' || pathname === '/projects';

  return (
    <>
      {showCta && (
        <section className="relative w-full px-6 sm:px-8 pb-20 md:pb-28">
          <div className="max-w-7xl mx-auto rounded-3xl bg-white/90 backdrop-blur-sm border border-black/10 px-7 py-12 sm:px-12 sm:py-16 text-center">
            <p className="text-sm" style={{ color: MUTED }}>
              Get in touch
            </p>
            <h2
              className="font-instrument mt-3 text-4xl sm:text-5xl md:text-6xl leading-[0.95]"
              style={{ color: INK, letterSpacing: '-0.0256em' }}
            >
              Ready to build the future?
            </h2>
            <p
              className="mt-6 mx-auto max-w-xl text-sm sm:text-base leading-relaxed"
              style={{ color: MUTED }}
            >
              {personalInfo.statusText}
            </p>
            {/* One destination, and not a mailto: those silently do nothing
                when no mail client is registered. The contact page sends
                through the form instead, and lists the address anyway. */}
            <div className="mt-9 flex justify-center">
              <Link
                to="/contact"
                className="rounded-full px-8 py-3.5 text-sm text-white transition-transform duration-300 hover:scale-[1.03]"
                style={{ backgroundColor: INK }}
              >
                Send a message
              </Link>
            </div>
          </div>
        </section>
      )}

      <footer className="relative w-full border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <p className="font-instrument text-xl tracking-tight" style={{ color: INK }}>
              Portfolio
            </p>
            <p className="mt-1 text-xs" style={{ color: MUTED }}>
              ft. {personalInfo.name}
            </p>
          </div>

          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-6">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="transition-opacity duration-300 opacity-60 hover:opacity-100"
                  style={{ color: INK }}
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
            <a
              href={personalInfo.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-black/15 px-5 py-2 text-xs transition-colors duration-300 hover:border-black/40"
              style={{ color: INK }}
            >
              Download résumé
            </a>
          </div>

          <p className="text-xs" style={{ color: MUTED }}>
            © {new Date().getFullYear()} {personalInfo.name}.
          </p>
        </div>
      </footer>
    </>
  );
};

export default SiteFooter;
