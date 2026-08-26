import { SKILLS } from '../data/skills';
import SkillCard from '../components/SkillCard';
import { useStagger } from '../hooks/useStagger';

export default function Skills() {
  const ref = useStagger([]);
  return (
    <section className="view" id="skills">
      <div className="eyebrow">Capabilities</div>
      <h2>Skills matrix</h2>
      <p className="lead" style={{ margin: '10px 0 30px' }}>A honest map of depth — filled dots mean production-comfortable, hollow means working knowledge.</p>
      <div className="skill-groups" ref={ref}>
        {SKILLS.map(g => <SkillCard key={g.title} group={g} />)}
      </div>
    </section>
  );
}
