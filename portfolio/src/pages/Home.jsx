import { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import AskBar from '../components/AskBar';
import { useStagger } from '../hooks/useStagger';

const REDUCE = matchMedia('(prefers-reduced-motion:reduce)').matches;
const STATS = [
  { n: 3, u: '×', l: 'Flagship AI systems' },
  { n: 10, u: '', l: 'Autonomous agents' },
  { n: 3, u: '', l: 'Languages supported' },
  { n: 100, u: '%', l: 'Grounded answers' },
];

function StatTile({ n, u, l }) {
  const [val, setVal] = useState(REDUCE ? n : 0);
  const ref = useRef(null);

  useEffect(() => {
    if (REDUCE) return;
    let cur = 0;
    const inc = n / 32;
    const iv = setInterval(() => {
      cur += inc;
      if (cur >= n) { cur = n; clearInterval(iv); }
      setVal(Math.round(cur));
    }, 24);
    return () => clearInterval(iv);
  }, [n]);

  return (
    <div className="stat" ref={ref}>
      <div className="n">{val}<span className="u">{u}</span></div>
      <div className="l">{l}</div>
    </div>
  );
}

export default function Home() {
  const cardsRef = useStagger([]);

  useEffect(() => {
    const els = [...document.querySelectorAll('.hero .eyebrow,.hero h1,.hero-sub')];
    els.forEach((el, i) => {
      if (REDUCE) { el.classList.add('in'); return; }
      setTimeout(() => el.classList.add('in'), 90 + i * 130);
    });
    document.querySelector('.stats')?.classList.add('in');
  }, []);

  return (
    <section className="view" id="home">
      <div className="hero">
        <div>
          <div className="eyebrow">Agentic AI &amp; MERN Stack Engineer · India</div>
          <h1>I build systems that <span className="grad">think, plan and ship.</span></h1>
          <p className="hero-sub">Full-stack MERN + agentic AI. From LangGraph multi-agent workflows to a C++ error explainer, this portfolio doesn't just describe my work — you can ask it, and run it.</p>
          <AskBar />
        </div>
        <div className="stats">
          {STATS.map(s => <StatTile key={s.l} {...s} />)}
        </div>
      </div>

      <div className="section-head">
        <div><div className="eyebrow">Selected work</div><h2>Flagship systems</h2></div>
        <div className="muted">Tap a card for the full case study</div>
      </div>
      <div className="grid-cards" ref={cardsRef}>
        {PROJECTS.slice(0, 3).map(p => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
