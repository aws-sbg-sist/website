// Escaping and date formatting.

export const esc = s => String(s).replace(/[&<>"']/g, c => (
  { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]
));

export function formatDate(iso, style){
  const d = new Date(iso + "T00:00:00");
  const opts = style === "short"
    ? { day:"numeric", month:"short", year:"numeric" }
    : { day:"numeric", month:"long", year:"numeric" };
  return d.toLocaleDateString("en-GB", opts);
}
