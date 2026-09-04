import { aboutPageContent } from "../data/mockData";

export default function TimelineSection() {
  return (
    <section>
      <h2>Our Journey</h2>

      {aboutPageContent.timeline.map((item) => (
        <div key={item.year}>
          <h3>{item.year}</h3>
          <h4>{item.title}</h4>
          <p>{item.description}</p>
        </div>
      ))}
    </section>
  );
}