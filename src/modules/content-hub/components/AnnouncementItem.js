import { esc, formatDate } from "../lib/format.js";
import { renderMarkdown } from "../lib/markdown.js";

export function AnnouncementItem(a, { pinned = false } = {}){
  if (pinned){
    return `
    <article class="pinned">
      <p class="flag"><span aria-hidden="true">◆</span> Pinned · ${esc(a.tag)}</p>
      <h2>${esc(a.title)}</h2>
      <div class="body">${renderMarkdown(a.body)}</div>
      <p class="when">${formatDate(a.date)}</p>
    </article>`;
  }
  return `
  <li>
    <article class="ann">
      <p class="date">${formatDate(a.date,"short")}</p>
      <div>
        <p class="tagline">${esc(a.tag)}</p>
        <h3>${esc(a.title)}</h3>
        <div class="body">${renderMarkdown(a.body)}</div>
      </div>
    </article>
  </li>`;
}
