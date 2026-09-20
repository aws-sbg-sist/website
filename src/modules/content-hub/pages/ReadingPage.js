import { content, activeCategory } from "../lib/content-service.js";
import { esc } from "../lib/format.js";
import { ArticleCard } from "../components/ArticleCard.js";
import { EmptyState } from "../components/EmptyState.js";

export function ReadingPage(){
  const all = content.articles();
  const cats = content.categories().filter(c => all.some(a => a.category === c.id));
  const shown = activeCategory === "all" ? all : all.filter(a => a.category === activeCategory);

  const rail = `
    <div class="rail" role="group" aria-label="Filter by category">
      <button type="button" data-cat="all" aria-pressed="${activeCategory === "all"}">Everything <span class="count">${all.length}</span></button>
      ${cats.map(c => `<button type="button" data-cat="${esc(c.id)}" aria-pressed="${activeCategory === c.id}">${esc(c.name)} <span class="count">${all.filter(a=>a.category===c.id).length}</span></button>`).join("")}
    </div>`;

  const body = shown.length
    ? `<ul class="list">${shown.map(ArticleCard).join("")}</ul>`
    : (all.length
        ? EmptyState("Nothing filed here yet", "No one has written under this category so far. Pick another, or bring a draft to the Thursday study session and we will publish it.")
        : EmptyState("The reading list is empty", "Articles written by members will appear here. The core team publishes notes after every workshop."));

  return `
    <div class="pagehead">
      <h1>Reading</h1>
      <p>Write-ups from members, workshop notes, and the explanations we got tired of repeating in Discord.</p>
    </div>
    ${all.length ? rail : ""}
    ${body}`;
}
