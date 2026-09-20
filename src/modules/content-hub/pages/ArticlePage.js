import { content } from "../lib/content-service.js";
import { esc, formatDate } from "../lib/format.js";
import { renderMarkdown } from "../lib/markdown.js";
import { coverSVG } from "../lib/cover.js";
import { EmptyState } from "../components/EmptyState.js";

export function ArticlePage(slug){
  const a = content.article(slug);
  if (!a){
    return `<div class="pagehead"><h1>That article has moved</h1></div>
      ${EmptyState("Nothing at this address", "The link may be out of date. The full reading list is one tap away.")}
      <p style="margin-top:1.4rem"><a class="backlink" href="#/reading">Back to reading</a></p>`;
  }
  const cat = content.category(a.category);
  const rel = content.related(a);

  return `
  <article class="article">
    <a class="backlink" href="#/reading">Back to reading</a>
    <p class="kicker">${esc(cat ? cat.name : "Uncategorised")}</p>
    <h1>${esc(a.title)}</h1>
    <p class="deck">${esc(a.deck)}</p>
    <div class="meta">
      <span><strong>${esc(a.author)}</strong> — ${esc(a.role)}</span>
      <span>Published ${formatDate(a.date)}</span>
      <span>${a.readMinutes} minute read</span>
    </div>
    <div class="hero-cover" aria-hidden="true">${coverSVG(a.slug)}</div>
    <p class="caption">Figure generated from the article identifier — no two are alike.</p>
    <div class="prose">${renderMarkdown(a.body)}</div>
  </article>
  ${rel.length ? `
  <section class="related">
    <h2>Read next</h2>
    <ul>
      ${rel.map(r => `<li><a href="#/reading/${esc(r.slug)}"><span class="rt">${esc(r.title)}</span><span class="rm">${esc((content.category(r.category)||{}).name || "")} · ${r.readMinutes} min</span></a></li>`).join("")}
    </ul>
  </section>` : ""}`;
}
