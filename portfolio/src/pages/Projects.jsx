import { PROJECTS } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import { useStagger } from '../hooks/useStagger';

export default function Projects() {
  const ref = useStagger([]);

  return (
    <section className="view" id="projects">
      <div className="eyebrow">Projects</div>
      <h2>Case studies</h2>
      <p className="lead" style={{ margin: '10px 0 30px' }}>Each follows one format: Problem → Solution → Architecture → Stack → Features → Demo → Engineering decisions.</p>
      <div className="grid-cards" ref={ref}>
        {PROJECTS.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  );
}
