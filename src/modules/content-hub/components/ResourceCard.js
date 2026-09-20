import { esc } from "../lib/format.js";

export function ResourceCard(res){
  return `
  <li>
    <a href="${esc(res.url)}" target="_blank" rel="noopener noreferrer">
      <span class="provider">${esc(res.provider)}</span>
      <span class="rtitle">${esc(res.title)}</span>
      <span class="rdesc">${esc(res.description)}</span>
    </a>
  </li>`;
}
