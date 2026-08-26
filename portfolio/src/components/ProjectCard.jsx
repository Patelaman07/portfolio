import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const p0 = project.badge === 'P0' ? ' p0' : '';
  return (
    <Link to={`/projects/${project.id}`} className="pcard stagger">
      <div className="top">
        <span className={`badge${p0}`}>{project.badge}</span>
        <span className="arrow">↗</span>
      </div>
      <h3>{project.name}</h3>
      <div className="desc">{project.desc}</div>
      <div className="tags">
        {project.tags.map(t => <span className="tag" key={t}>{t}</span>)}
      </div>
    </Link>
  );
}
