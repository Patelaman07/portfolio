import { PROJECTS } from '../data/projects';
import WorkRow from '../components/WorkRow';
import { useStagger } from '../hooks/useStagger';

export default function Projects() {
  const ref = useStagger([]);

  return (
    <section className="view" id="projects">
      <div className="eyebrow">Projects</div>
      <h2>Case studies</h2>
      <p className="lead" style={{ margin: '16px 0 48px' }}>Each follows one format: Problem → Solution → Architecture → Stack → Features → Demo → Engineering decisions.</p>
      <div className="work" ref={ref}>
        {PROJECTS.map((p, i) => <WorkRow key={p.id} project={p} index={i} />)}
      </div>
    </section>
  );
}
