export default function SkillCard({ group }) {
  return (
    <div className="scard stagger">
      <div className="k">
        <span className="ic">{group.icon}</span>
        <h3>{group.title}</h3>
      </div>
      {group.items.map(([name, lvl]) => (
        <div className="skill-row" key={name}>
          <span>{name}</span>
          <span className="lvl">
            {[1, 2, 3, 4].map(i => <i key={i} className={i <= lvl ? 'on' : ''} />)}
          </span>
        </div>
      ))}
    </div>
  );
}
