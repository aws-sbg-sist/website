import { aboutPageContent } from "../data/mockData";

export default function ExperienceCards() {
  return (
    <section>
      <h2>What We Do</h2>

      <div>
        {aboutPageContent.experiences.map((experience) => (
          <article key={experience.title}>
            <h3>{experience.title}</h3>
            <p>{experience.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}