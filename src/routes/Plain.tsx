import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { Cluster } from '../types';

const LABEL: Record<Cluster, string> = {
  ml: 'AI / ML + NLP',
  eng: 'Full-stack / infra',
  data: 'Data / analytics',
};

/**
 * The no-WebGL path, and the one every crawler and screen reader gets.
 *
 * Text rather than an SVG scatter plot: a 2D projection of a 3D projection
 * communicates almost nothing, while the same corpus as prose is genuinely
 * readable and degrades to zero dependencies.
 */
export default function Plain() {
  const nodes = useStore((s) => s.nodes);
  const error = useStore((s) => s.error);
  const actions = useStore((s) => s.actions);

  useEffect(() => {
    void actions.loadCorpus();
  }, [actions]);

  const byCluster = (Object.keys(LABEL) as Cluster[]).map((c) => ({
    cluster: c,
    projects: nodes.filter((n) => n.cluster === c && n.type !== 'skill'),
    skills: nodes.filter((n) => n.cluster === c && n.type === 'skill'),
  }));

  return (
    <main className="min-h-screen bg-void px-[22px] py-[44px]">
      <div className="mx-auto max-w-[680px]">
        <h1 className="font-display text-xl text-ivory">Tanush Thakran</h1>
        <p className="mt-[11px] font-body text-base text-muted">
          Text version of the portfolio. The interactive one needs WebGL —{' '}
          <a href="./" className="text-ivory underline decoration-muted underline-offset-4">
            try it
          </a>
          .
        </p>

        {error && <p className="mt-[22px] font-body text-base text-ivory/80">{error}</p>}

        {byCluster.map(({ cluster, projects, skills }) => (
          <section key={cluster} className="mt-[44px]">
            <h2 className="font-mono text-[11px] uppercase leading-[11px] tracking-[0.14em] text-muted">
              {LABEL[cluster]}
            </h2>

            {projects.map((n) => (
              <article key={n.id} className="mt-[22px] border-t border-muted/20 pt-[22px]">
                <h3 className="font-display text-md text-ivory">{n.title}</h3>
                <p className="mt-[11px] font-body text-base text-ivory/80">{n.blurb}</p>
                {n.chunks.map((c, i) => (
                  <p key={i} className="mt-[11px] font-body text-base text-muted">
                    {c}
                  </p>
                ))}
                {n.links.repo && (
                  <a
                    href={n.links.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-[11px] inline-block font-mono text-[11px] leading-[11px] text-ivory underline decoration-muted underline-offset-4"
                  >
                    repository ↗
                  </a>
                )}
              </article>
            ))}

            {skills.length > 0 && (
              <p className="mt-[22px] font-body text-sm text-muted">
                {skills.map((s) => s.title).join(' · ')}
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
