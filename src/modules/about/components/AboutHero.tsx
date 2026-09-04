import { aboutPageContent } from "../data/mockData";

export default function AboutHero() {
  return (
    <section>
      <h1>About AWS Student Builders Group</h1>

      <p>{aboutPageContent.description}</p>

      <div>
        <h2>Our Mission</h2>
        <p>{aboutPageContent.mission}</p>
      </div>

      <div>
        <h2>Our Vision</h2>
        <p>{aboutPageContent.vision}</p>
      </div>
    </section>
  );
}