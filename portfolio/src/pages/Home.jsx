import { Link } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import { SKILLS } from '../data/skills';
import WorkRow from '../components/WorkRow';
import AskBar from '../components/AskBar';
import { useStagger } from '../hooks/useStagger';

const FACTS = [
  { n: '3', l: 'live AI systems you can run' },
  { n: '300+', l: 'LeetCode problems solved' },
  { n: 'EN·HI', l: '+ Hinglish explanations' },
  { n: '’26', l: 'B.Tech, REC Sonbhadra' },
];

const STACK_GROUPS = ['AI / Agentic', 'Full-Stack (MERN)', 'CS Fundamentals'];

const EXPERIENCE = [
  { when: 'Jun 2025 – now', what: 'Web Development Trainee · Parkquality', detail: 'Fixing responsive-design issues on production pages — 15+ so far.' },
  { when: 'Ongoing', what: 'Open-source frontend contributor', detail: 'Merged upstream PRs — GitHub Pull Shark and Pro badges.' },
  { when: '2022–2026', what: 'B.Tech, Electronics Engineering', detail: 'Rajkiya Engineering College, Sonbhadra.' },
];

export default function Home() {
  const workRef = useStagger([]);

  return (
    <section className="view" id="home">
      <div className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Portfolio that answers back</div>
          <h1 className="hero-title">
            <span className="line"><span>I build AI systems</span></span>{' '}
            <span className="line"><span>you can <em>ask</em>, <em>run</em></span></span>{' '}
            <span className="line"><span>and <em>inspect</em>.</span></span>
          </h1>
          <p className="hero-sub">Final-year engineer shipping agentic workflows with LangGraph and full-stack apps on MERN. Nothing here is a screenshot — query the agent, compile C++ with a real g++, or watch an agent write a frontend.</p>
          <div className="hero-cta">
            <a href="#work" className="btn btn-primary btn-lg">
              See the systems
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            <Link to="/resume" className="btn btn-ghost btn-lg">View résumé</Link>
          </div>
          <div className="hero-links">
            <a href="https://github.com/Patelaman07" target="_blank" rel="noopener noreferrer">github/Patelaman07</a>
            <a href="https://www.linkedin.com/in/aman-patel-77b5ba288/" target="_blank" rel="noopener noreferrer">linkedin</a>
            <a href="mailto:skillsexplorer203@gmail.com">email</a>
          </div>
        </div>
        <AskBar />
      </div>

      <section className="facts" aria-label="At a glance">
        {FACTS.map(f => (
          <div className="fact" key={f.l}><div className="n">{f.n}</div><div className="l">{f.l}</div></div>
        ))}
      </section>

      <div className="section-head" id="work">
        <div><div className="eyebrow">Selected systems</div><h2>Three systems. All running.</h2></div>
        <div className="muted">Each opens a case study with a live demo.</div>
      </div>
      <div className="work" ref={workRef}>
        {PROJECTS.map((p, i) => <WorkRow key={p.id} project={p} index={i} />)}
      </div>

      <div className="split">
        <div>
          <div className="eyebrow">Stack</div>
          <h2>What I reach for</h2>
          {SKILLS.filter(g => STACK_GROUPS.includes(g.title)).map(g => (
            <div className="stack-group" key={g.title}>
              <h4>{g.title}</h4>
              <div className="pills">{g.items.map(([name]) => <span className="pill" key={name}>{name}</span>)}</div>
            </div>
          ))}
          <Link to="/skills" className="more-link">Full skills matrix →</Link>
        </div>
        <div>
          <div className="eyebrow">Experience</div>
          <h2>Where I’ve shipped</h2>
          {EXPERIENCE.map(x => (
            <div className="xp" key={x.what}>
              <div className="when">{x.when}</div>
              <div><div className="what">{x.what}</div><div className="detail">{x.detail}</div></div>
            </div>
          ))}
          <Link to="/resume" className="more-link">Full résumé →</Link>
        </div>
      </div>

      <section className="cta" aria-label="Contact">
        <h2>I’m looking for my first full-time agentic AI or full-stack role. <em>Let’s talk.</em></h2>
        <div className="cta-actions">
          <a href="mailto:skillsexplorer203@gmail.com" className="btn btn-primary btn-lg">skillsexplorer203@gmail.com</a>
          <a href="https://github.com/Patelaman07" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">GitHub</a>
          <a href="https://www.linkedin.com/in/aman-patel-77b5ba288/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">LinkedIn</a>
        </div>
      </section>
    </section>
  );
}
