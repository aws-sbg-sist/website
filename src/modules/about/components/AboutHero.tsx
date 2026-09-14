import type { AboutPageContent } from "../types";

export function AboutHero({ mission, vision, description, values }: Pick<AboutPageContent, "mission" | "vision" | "description" | "values">) {
  const valueIcons = ["⌂", "</>", "♟", "⬡", "▣"];

  return (
    <section className="hero">
      <svg className="hero-cloud" viewBox="0 0 240 120" aria-hidden="true">
        <path d="M22 82c0-22 18-39 40-39 5-20 23-34 44-34 18 0 33 10 40 25 4-2 9-3 14-3 19 0 35 15 35 34 20 1 36 14 36 32 0 19-16 33-38 33H58c-21 0-36-18-36-48Z" />
      </svg>
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">Member 03 · About</div>
          <h1><span>AWS Student Builder</span><em>Group</em></h1>
          <p>{description}</p>
          <div className="values" aria-label="Community values">
            {values.map((value, index) => (
              <span className="badge" key={value}>
                <span className="badge-icon" aria-hidden="true">{valueIcons[index]}</span>
                {value}
              </span>
            ))}
          </div>
        </div>
        <div className="mission-card">
          <h2><span className="mission-icon" aria-hidden="true">◉</span>Our Mission</h2>
          <p>{mission}</p>
          <div className="mission-divider" />
          <h2><span className="mission-icon" aria-hidden="true">♧</span>Our Vision</h2>
          <p>{vision}</p>
        </div>
      </div>
    </section>
  );
}
