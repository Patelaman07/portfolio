import { Link } from 'react-router-dom';

function PipelinePreview({ steps }) {
  return (
    <div className="preview pv-pipe" aria-hidden="true">
      <div className="preview-cap">langgraph · {steps.length} nodes</div>
      <div className="pv-nodes">
        {steps.map((s, i) => (
          <span key={s} style={{ display: 'contents' }}>
            {i > 0 && <span className="arr">→</span>}
            <span className="node" style={{ '--i': i }}>{s.split(' ')[0].toLowerCase()}</span>
          </span>
        ))}
      </div>
      <div className="pv-note">Unknown facts are refused, not guessed.</div>
    </div>
  );
}

function TreePreview() {
  return (
    <div className="preview pv-tree" aria-hidden="true">
      <div className="preview-cap">output/ — the shape of a generated app</div>
      <div>▾ src/</div>
      <div className="i1">▾ components/</div>
      <div className="i2">Card.jsx · Header.jsx</div>
      <div className="i1">▾ pages/</div>
      <div className="i2">Home.jsx · Detail.jsx</div>
      <div className="i1 hot">App.jsx  ● writing…</div>
    </div>
  );
}

function CodePreview() {
  return (
    <div className="preview pv-code" aria-hidden="true">
      <div className="lines">
        <div><span className="ln">4</span>int main() {'{'}</div>
        <div><span className="ln">5</span>    int total = 0;</div>
        <div className="bad"><span className="ln">6</span>    <span className="squig">cout<svg viewBox="0 0 34 6" preserveAspectRatio="none"><path d="M0 3 Q2.1 0 4.25 3 T8.5 3 T12.75 3 T17 3 T21.25 3 T25.5 3 T29.75 3 T34 3" /></svg></span> &lt;&lt; total;</div>
        <div><span className="ln">7</span>{'}'}</div>
      </div>
      <div className="fix"><b>Line 6 ·</b> <code style={{ color: 'var(--text)' }}>cout</code> lives in <code style={{ color: 'var(--text)' }}>std</code>. Write <code>std::cout</code>.</div>
    </div>
  );
}

const PREVIEWS = {
  agent: p => <PipelinePreview steps={p.pipeline} />,
  'frontend-engineer': () => <TreePreview />,
  explainer: () => <CodePreview />,
};

const TRY_LABEL = {
  agent: 'Ask it on the home page',
  'frontend-engineer': 'Generate an app',
  explainer: 'Break some code',
};

export default function WorkRow({ project: p, index }) {
  const preview = PREVIEWS[p.id];
  const to = `/projects/${p.id}`;
  return (
    <article className="work-row stagger">
      <div className="work-num">{String(index + 1).padStart(2, '0')}</div>
      <div className="work-main">
        <h3><Link to={to}>{p.name}</Link></h3>
        <p>{p.desc}</p>
        <div className="tags">{p.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div>
        <div className="work-links">
          <Link to={to}>Read case study <span className="arr-shift">→</span></Link>
          {TRY_LABEL[p.id] && (
            <Link to={p.id === 'agent' ? '/' : to}>{TRY_LABEL[p.id]}</Link>
          )}
        </div>
      </div>
      {preview && preview(p)}
    </article>
  );
}
