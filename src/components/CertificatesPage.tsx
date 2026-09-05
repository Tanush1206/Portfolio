import { certificates } from '../data/certificates';
import { PageHead, Reveal, Section, Shell } from './ui';

const pad = (value: number) => String(value).padStart(2, '0');

const CertificatesPage = () => (
  <main className="w-full">
    <Section theme="dark" className="pb-24 md:pb-32">
      <PageHead
        index="03"
        label="Credentials"
        title="Verified"
        lede="Machine learning and analytics first, engineering after. Where the issuer publishes a verification page, the link goes there rather than to an image I control."
      />

      <Shell className="mt-20">
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate, index) => (
            <Reveal key={certificate.id} delay={(index % 3) * 0.07} className="bg-bg">
              <a
                href={certificate.link}
                target="_blank"
                rel="noopener noreferrer"
                data-mouse-content={`Verify with ${certificate.issuer.split(' · ')[0]}`}
                // The card inverts wholesale under the pointer by swapping
                // the band's tokens, so it reads as a panel being selected
                // rather than as a link being tinted.
                className="group flip-hover flex h-full flex-col bg-bg"
              >
                {certificate.image && (
                  <div className="overflow-hidden border-b border-line bg-fg/[0.04]">
                    <img
                      src={certificate.image}
                      alt={`${certificate.title} certificate`}
                      loading="lazy"
                      // Certificates are scans in wildly different aspect
                      // ratios; contain keeps every one whole.
                      className="h-44 w-full object-contain p-6 transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-3">
                    {certificate.logo && (
                      <img
                        src={certificate.logo}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        className="h-5 w-5 shrink-0 object-contain"
                      />
                    )}
                    <span className="kicker truncate">{certificate.issuer}</span>
                    <span className="kicker tabular ml-auto shrink-0">{certificate.date}</span>
                  </div>

                  <h2 className="mt-6 text-lg leading-snug">
                    {certificate.title}
                  </h2>

                  <p className="kicker mt-3 break-all">ID {certificate.id}</p>

                  <div className="mt-auto flex items-center justify-between pt-8">
                    <span className="kicker tabular">{pad(index + 1)}</span>
                    <span className="kicker transition-transform duration-300 group-hover:translate-x-1">
                      View credential ↗
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Shell>
    </Section>
  </main>
);

export default CertificatesPage;
