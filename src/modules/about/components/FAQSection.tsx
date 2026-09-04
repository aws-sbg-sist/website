import { aboutPageContent } from "../data/mockData";

export default function FAQSection() {
  return (
    <section>
      <h2>Frequently Asked Questions</h2>

      {aboutPageContent.faq.map((item) => (
        <div key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </section>
  );
}