export default function About() {
  return (
    <section className="view" id="about">
      <div className="eyebrow">About</div>
      <h2>Engineer first, AI-native by design.</h2>
      <div className="about-grid" style={{ marginTop: 28 }}>
        <div>
          <p>I'm <strong>Aman</strong>, a final-year Electronics Engineering student and full-stack MERN developer building agentic AI systems and full-stack web applications. I treat AI as <strong>infrastructure, not decoration</strong> — my work sits at the seam between classic software engineering (data models, REST APIs, JWT auth, graph algorithms) and modern agentic systems built on LangGraph and LangChain.</p>
          <p>The thing I care about most is <strong>grounding</strong>. An agent that answers from real data with visible sources is worth more than one that improvises confidently. Every AI surface here is built to say "I don't know" when it should.</p>
          <p>I build <strong>vertically</strong>: one feature all the way from UI → backend → AI/tool → tests → deploy before the next. That discipline comes from the same place as my CS foundation — 300+ solved DSA problems and a habit of decomposing ambiguous problems into concrete, testable pieces.</p>
        </div>
        <div className="panel">
          <div className="row"><span className="k">Focus</span><span className="v">Agentic AI · MERN Stack</span></div>
          <div className="row"><span className="k">Location</span><span className="v">India</span></div>
          <div className="row"><span className="k">Education</span><span className="v">B.Tech, Electronics Eng.</span></div>
          <div className="row"><span className="k">Languages</span><span className="v">EN · हिन्दी · Hinglish</span></div>
          <div className="row"><span className="k">Core</span><span className="v">JS · React · Node · Python</span></div>
          <div className="row"><span className="k">Agents</span><span className="v">LangGraph · LangChain</span></div>
          <div className="row"><span className="k">Achievements</span><span className="v">300+ DSA · Pull Shark</span></div>
          <div className="row"><span className="k">Open to</span><span className="v">Agentic AI / Full-stack roles</span></div>
          <div className="row">
            <span className="k">Links</span>
            <span className="v">
              <a href="https://github.com/Patelaman07" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>GitHub</a>
              {' · '}
              <a href="https://www.linkedin.com/in/aman-patel-77b5ba288/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>LinkedIn</a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
