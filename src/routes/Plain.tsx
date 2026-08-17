import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { Cluster } from '../types';

const LABEL: Record<Cluster, string> = {
  ml: 'Machine learning',
  eng: 'Engineering',
  data: 'Data',
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
    <main className="bg-backdrop min-h-screen px-[22px] py-[44px]">
      <div className="mx-auto max-w-[720px]">
        <h1 className="text-fg text-[22px] leading-[22px]">Tanush Thakran</h1>
        <p className="text-muted mt-[11px] text-[11px] leading-[17px]">
          Text version of the portfolio. The interactive one needs WebGL —{' '}
          <a href="./" className="text-accent underline">
            try it
          </a>
          .
        </p>

        {error && <p className="text-accent mt-[22px] text-[11px] leading-[17px]">{error}</p>}

        {byCluster.map(({ cluster, projects, skills }) => (
          <section key={cluster} className="mt-[44px]">
            <h2 className="text-muted text-[11px] uppercase leading-[11px] tracking-[0.14em]">
              {LABEL[cluster]}
            </h2>

            {projects.map((n) => (
              <article key={n.id} className="border-line mt-[22px] border-t pt-[22px]">
                <h3 className="text-fg text-[11px] leading-[11px]">{n.title}</h3>
                <p className="text-dim mt-[11px] text-[11px] leading-[17px]">{n.blurb}</p>
                {n.chunks.map((c, i) => (
                  <p key={i} className="text-muted mt-[11px] text-[11px] leading-[17px]">
                    {c}
                  </p>
                ))}
                {n.links.repo && (
                  <a
                    href={n.links.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-accent mt-[11px] inline-block text-[11px] leading-[11px] underline"
                  >
                    repository ↗
                  </a>
                )}
              </article>
            ))}

            {skills.length > 0 && (
              <p className="text-muted mt-[22px] text-[11px] leading-[17px]">
                {skills.map((s) => s.title).join(' · ')}
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
