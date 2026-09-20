import { content } from "../lib/content-service.js";
import { AnnouncementItem } from "../components/AnnouncementItem.js";
import { EmptyState } from "../components/EmptyState.js";

export function AnnouncementsPage(){
  const all = content.announcements();
  const pinned = all.filter(a => a.pinned);
  const rest = all.filter(a => !a.pinned);

  if (!all.length){
    return `<div class="pagehead"><h1>Announcements</h1><p>Everything time-sensitive: events, deadlines, and changes to how we run.</p></div>
      ${EmptyState("No announcements right now", "When the core team posts something, it lands here first. Event details are always repeated in the club Discord.")}`;
  }

  return `
    <div class="pagehead">
      <h1>Announcements</h1>
      <p>Everything time-sensitive: events, deadlines, and changes to how we run.</p>
    </div>
    ${pinned.map(a => AnnouncementItem(a, { pinned:true })).join("")}
    ${rest.length ? `<ul class="feed">${rest.map(a => AnnouncementItem(a)).join("")}</ul>` : ""}`;
}
