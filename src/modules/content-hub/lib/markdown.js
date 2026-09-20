// Minimal markdown renderer for article and announcement bodies.
// Input is escaped BEFORE parsing, so a record can never inject markup.
import { esc } from "./format.js";

/* --- Minimal markdown renderer -------------------------------------------
   Handles what club writers actually use: headings, paragraphs, lists,
   fenced and inline code, links, blockquotes, rules, bold and italic.
   Escapes first, so article bodies can never inject markup.            */
export function renderMarkdown(src){
  const blocks = [];
  // pull fenced code out before anything else touches it
  const stashed = src.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    blocks.push(`<pre><code data-lang="${esc(lang)}">${esc(code.replace(/\n$/,""))}</code></pre>`);
    return `\u0000BLOCK${blocks.length - 1}\u0000`;
  });

  const inline = t => esc(t)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, href) =>
      `<a class="ext" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${txt}<span class="sr">, opens in a new tab</span></a>`)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>");

  const out = [];
  let list = null;

  const closeList = () => { if (list){ out.push(`</${list}>`); list = null; } };

  stashed.split("\n").forEach(raw => {
    const line = raw.trimEnd();

    const placeholder = line.match(/^\u0000BLOCK(\d+)\u0000$/);
    if (placeholder){ closeList(); out.push(blocks[+placeholder[1]]); return; }

    if (!line.trim()){ closeList(); return; }
    if (/^---+$/.test(line)){ closeList(); out.push("<hr>"); return; }

    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h){ closeList(); const lvl = h[1].length; out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`); return; }

    const q = line.match(/^>\s?(.*)$/);
    if (q){ closeList(); out.push(`<blockquote><p>${inline(q[1])}</p></blockquote>`); return; }

    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ol){ if (list !== "ol"){ closeList(); out.push("<ol>"); list = "ol"; } out.push(`<li>${inline(ol[1])}</li>`); return; }

    const ul = line.match(/^[-*]\s+(.*)$/);
    if (ul){ if (list !== "ul"){ closeList(); out.push("<ul>"); list = "ul"; } out.push(`<li>${inline(ul[1])}</li>`); return; }

    closeList();
    out.push(`<p>${inline(line)}</p>`);
  });

  closeList();
  return out.join("\n");
}
