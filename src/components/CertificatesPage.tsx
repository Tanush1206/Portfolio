import { certificates } from '../data/certificates';
import { PageHeader } from './pageChrome';
import { INK, MUTED } from './pageText';

const CertificatesPage = () => (
  <main className="w-full pt-16 md:pt-24 pb-24 md:pb-32">
    <PageHeader
      eyebrow={`${certificates.length} credentials`}
      title="Certifications."
    />

    <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {certificates.map((certificate) => (
        <article
          key={certificate.id}
          className="flex flex-col overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm border border-black/10"
        >
          {certificate.image && (
            <a
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-b border-black/10 bg-white"
            >
              <img
                src={certificate.image}
                alt={`${certificate.title} certificate`}
                loading="lazy"
                className="w-full h-44 object-contain p-5"
              />
            </a>
          )}

          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <div className="flex items-center gap-3">
              {certificate.logo && (
                <img
                  src={certificate.logo}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-6 w-6 object-contain"
                />
              )}
              <span className="text-xs" style={{ color: MUTED }}>
                {certificate.issuer}
              </span>
              <span className="ml-auto text-xs" style={{ color: MUTED }}>
                {certificate.date}
              </span>
            </div>

            <h2
              className="font-instrument mt-4 text-xl sm:text-2xl leading-[1.05]"
              style={{ color: INK, letterSpacing: '-0.0256em' }}
            >
              {certificate.title}
            </h2>

            <p className="mt-2 text-[11px] break-all" style={{ color: MUTED }}>
              ID {certificate.id}
            </p>

            <a
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto pt-6 self-start text-sm underline decoration-black/20 underline-offset-4 transition-colors duration-300 hover:decoration-black"
              style={{ color: INK }}
            >
              View credential
            </a>
          </div>
        </article>
      ))}
    </div>
  </main>
);

export default CertificatesPage;
