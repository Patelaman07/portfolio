export default function ArchitectureDiagram({ steps }) {
  return (
    <div className="arch-diagram">
      {steps.map((step, i) => (
        <div className="arch-step-wrap" key={step}>
          <div className="arch-step">
            <span className="arch-step-n">{String(i + 1).padStart(2, '0')}</span>
            {step}
          </div>
          {i < steps.length - 1 && <span className="arch-arrow">→</span>}
        </div>
      ))}
    </div>
  );
}
