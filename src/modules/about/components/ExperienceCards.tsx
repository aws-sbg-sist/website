import type { ChapterMetric, Principle } from "../types";

export function ExperienceCards({ metrics, principles }: { metrics: ChapterMetric[]; principles: Principle[] }) {
  return (
    <>
      <section className="section telemetry-section" id="telemetry">
      <div className="container">
        <div className="section-header">
          <p className="section-kicker">Chapter dashboard</p>
          <h2>Verified Chapter Achievements &amp; Telemetry</h2>
          <p>Real impact. Measurable outcomes.</p>
        </div>
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <span className="metric-icon" aria-hidden="true">{metric.icon}</span>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </div>
        <div className="free-commitment">
          <strong>100% Free / Zero-Fee Commitment</strong>
          <span>All workshops, bootcamps, and hackathons delivered with ₹0 admission fee.</span>
        </div>
      </div>
      </section>
      <section className="section principles-section" id="principles">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">Five commitments</p>
            <h2>Our Community Values &amp; Operating Principles</h2>
          </div>
          <div className="principles-grid">
            {principles.map((principle, index) => (
              <article className="principle-card" key={principle.title}>
                <span className="principle-index">0{index + 1}</span>
                <span className="principle-icon" aria-hidden="true">{principle.icon}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
