import { useState } from 'react';
import Button from '../components/Button';

const TIMELINE = [
  { when: 'Jun 2025 — Jul 2025', title: 'Web Development Trainee', where: 'Parkquality',
    text: 'Fixed responsive design issues across 15+ web pages and improved responsiveness for 20+ UI components, ensuring seamless compatibility across desktop, tablet and mobile. Tested applications and verified bug fixes before deployment, and contributed to code reviews and debugging sessions.' },
  { when: 'Ongoing', title: 'Open Source Contributor', where: 'Frontend Development',
    text: 'Contributed to open-source web applications by fixing frontend bugs and improving UIs — resolved responsive layout issues to achieve 100% compatibility across major screen sizes and browsers, and improved visual consistency across pages by roughly 20%.' },
  { when: '2022 — 2026', title: 'B.Tech, Electronics Engineering', where: 'Rajkiya Engineering College, Sonbhadra · CGPA 7.2/10',
    text: 'Coursework spanning Data Structures & Algorithms, Operating Systems, Machine Learning, Digital Electronics and IoT. 300+ DSA problems solved on LeetCode — the CS foundation behind the agentic AI and graph-algorithm work in this portfolio.' },
];

export default function Resume() {
  const [dl, setDl] = useState(false);

  function onDownload() {
    setDl(true);
    setTimeout(() => setDl(false), 1600);
  }

  return (
    <section className="view" id="resume">
      <div className="res-head">
        <div><div className="eyebrow">Resume</div><h2>Experience &amp; education</h2></div>
        <Button onClick={onDownload} disabled={dl}>
          {dl ? 'Prototype — no file yet' : '↓ Download PDF'}
        </Button>
      </div>
      <div className="timeline">
        {TIMELINE.map(t => (
          <div className="tl" key={t.title}>
            <div className="when">{t.when}</div>
            <h3>{t.title}</h3>
            <div className="where">{t.where}</div>
            <p>{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
