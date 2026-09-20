import { esc } from "../lib/format.js";

export function EmptyState(title, note){
  return `<div class="empty"><h3>${esc(title)}</h3><p>${esc(note)}</p></div>`;
}
