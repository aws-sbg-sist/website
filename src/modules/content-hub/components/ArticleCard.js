import { esc, formatDate } from "../lib/format.js";
import { coverSVG } from "../lib/cover.js";
import { content } from "../lib/content-service.js";

export function ArticleCard(article){
  const cat = content.category(article.category);
  return `
  <li>
    <a class="entry" href="#/reading/${esc(article.slug)}">
      <div class="cover" aria-hidden="true">${coverSVG(article.slug)}</div>
      <p class="kicker">${esc(cat ? cat.name : "Uncategorised")}</p>
      <h2>${esc(article.title)}</h2>
      <p class="deck">${esc(article.deck)}</p>
      <p class="byline"><span>${esc(article.author)}</span><span>${formatDate(article.date,"short")}</span><span>${article.readMinutes} min read</span></p>
    </a>
  </li>`;
}
