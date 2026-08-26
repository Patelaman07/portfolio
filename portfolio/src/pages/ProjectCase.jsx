import { Link, Navigate, useParams } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import CodeBlock from '../components/CodeBlock';
import FrontendEngineerDemo from '../components/FrontendEngineerDemo';
import ErrorExplainerDemo from '../components/ErrorExplainerDemo';

const LIVE_DEMOS = {
  'frontend-engineer': FrontendEngineerDemo,
  'explainer': ErrorExplainerDemo,
};

export default function ProjectCase() {
  const { id } = useParams();
  const i = PROJECTS.findIndex(p => p.id === id);
  if (i === -1) return <Navigate to="/projects" replace />;

  const p = PROJECTS[i];
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  return (
    <section className="view" id="project-case">
      <Link to="/projects" className="case-back">← Back to all projects</Link>

      <div className="case-header">
        <div className="eyebrow">
          <span className={`badge${p.badge === 'P0' ? ' p0' : ''}`}>{p.badge}</span>
          &nbsp;Case study
        </div>
        <h1>{p.name}</h1>
        <p className="lead">{p.desc}</p>
        <div className="tags">
          {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
        </div>
      </div>

      <div className="case-body-page">
        <section><h4>Problem</h4><p>{p.problem}</p></section>
        <section><h4>Solution</h4><p>{p.solution}</p></section>
        <section>
          <h4>Architecture</h4>
          <ArchitectureDiagram steps={p.pipeline} />
          <p style={{ marginTop: 14 }}>{p.arch}</p>
        </section>
        <section>
          <h4>Tech stack</h4>
          <div className="stack">{p.stack.map(s => <span className="tag" key={s}>{s}</span>)}</div>
        </section>
        <section>
          <h4>Features</h4>
          <div className="stack">{p.features.map(s => <span className="tag" key={s}>{s}</span>)}</div>
        </section>
        <section>
          <h4>Sample code</h4>
          <CodeBlock code={p.code} />
        </section>
        <section>
          <h4>Live demo</h4>
          {(() => {
            const Demo = LIVE_DEMOS[p.id];
            return Demo ? <Demo /> : <p>{p.demo}</p>;
          })()}
        </section>
        <section><h4>Engineering decisions</h4><p>{p.decisions}</p></section>
      </div>

      <div className="case-pager">
        <Link to={`/projects/${prev.id}`}>
          <span className="dir">← Previous</span>
          {prev.name}
        </Link>
        <Link to={`/projects/${next.id}`} className="next">
          <span className="dir">Next →</span>
          {next.name}
        </Link>
      </div>
    </section>
  );
}
