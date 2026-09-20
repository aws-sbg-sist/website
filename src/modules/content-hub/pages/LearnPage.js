import { content } from "../lib/content-service.js";
import { CATEGORIES } from "../data/categories.js";
import { esc } from "../lib/format.js";
import { ResourceCard } from "../components/ResourceCard.js";
import { EmptyState } from "../components/EmptyState.js";

export function LearnPage(){
  const res = content.resources();

  if (!res.length){
    return `<div class="pagehead"><h1>Learn AWS</h1><p>Five categories of cloud learning material, filtered down to what is actually useful to a student with no budget.</p></div>
      ${EmptyState("No resources listed yet", "The content team curates this page. Suggest a link in the club Discord and it will show up here.")}`;
  }

  const sections = CATEGORIES.map((c, i) => {
    const items = res.filter(r => r.category === c.id);
    if (!items.length) return "";
    return `
    <section class="cat">
      <h2><span class="n">${String(i + 1).padStart(2,"0")}</span>${esc(c.name)}</h2>
      <p>${esc(c.blurb)}</p>
      <ul class="res">${items.map(ResourceCard).join("")}</ul>
    </section>`;
  }).join("");

  return `
    <div class="pagehead">
      <h1>Learn AWS</h1>
      <p>Five categories of cloud learning material, filtered down to what is actually useful to a student with no budget. Everything here is free and opens on the provider's own site.</p>
    </div>
    ${sections}`;
}
