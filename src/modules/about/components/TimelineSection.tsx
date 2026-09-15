"use client";

import { useState } from "react";
import type { TimelineEntry } from "../types";

export function TimelineSection({ entries }: { entries: TimelineEntry[] }) {
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? null);

  return (
    <section className="section journey-section" id="history">
      <div className="container">
        <div className="section-header">
          <p className="section-kicker">The record so far</p>
          <h2>Our Journey</h2>
          <p>A data-driven history of the community and its milestones.</p>
        </div>
        <div className="timeline">
          {entries.map((entry, index) => {
            const open = openId === entry.id;
            const detailsId = `milestone-${entry.id}`;
            return (
            <article className={`timeline-item${open ? " is-open" : ""}`} key={entry.id}>
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-card">
                <div className="timeline-meta">
                  <span className="timeline-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="year">{entry.date}</span>
                </div>
                <h3>{entry.title}</h3>
                <p className="timeline-preview">{entry.preview}</p>
                <button
                  className="disclosure-button"
                  type="button"
                  aria-expanded={open}
                  aria-controls={detailsId}
                  onClick={() => setOpenId(open ? null : entry.id)}
                >
                  <span>{open ? "Hide details" : "View details"}</span>
                  <span className="chevron" aria-hidden="true">⌄</span>
                </button>
                <div className="timeline-details" id={detailsId} aria-hidden={!open}>
                  <p>{entry.description}</p>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
