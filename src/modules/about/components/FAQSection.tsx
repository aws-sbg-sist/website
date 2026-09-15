"use client";

import { useState } from "react";
import type { FAQItem } from "../types";

export function FAQSection({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="section alt" id="faq">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers for students interested in joining the community.</p>
        </div>
        <div className="faq-list">
          {items.map((item) => {
            const open = openId === item.id;
            return (
              <div className="faq-item" key={item.id}>
                <button
                  className="faq-button"
                  type="button"
                  aria-expanded={open}
                  aria-controls={`answer-${item.id}`}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  <span>{item.question}</span>
                  <span aria-hidden="true">{open ? "−" : "+"}</span>
                </button>
                <div className={`faq-answer${open ? " is-open" : ""}`} id={`answer-${item.id}`} aria-hidden={!open}>
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
