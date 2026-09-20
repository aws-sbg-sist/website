import { dataset } from "../lib/content-service.js";

export function NotesPage(){
  return `
  <div class="pagehead">
    <h1>Module notes</h1>
    <p>How the Content Hub is put together, and how to check it against the acceptance criteria.</p>
  </div>
  <div class="notes prose">
    <h2>Content states</h2>
    <p>The pages are built to work with any number of records. Switch the dataset to see each list, the announcements feed, and the resources page under all three conditions.</p>
    <div class="switch" role="group" aria-label="Content quantity">
      <button type="button" data-set="many" aria-pressed="${dataset==="many"}">Many records</button>
      <button type="button" data-set="one" aria-pressed="${dataset==="one"}">Exactly one</button>
      <button type="button" data-set="none" aria-pressed="${dataset==="none"}">None at all</button>
    </div>

    <h2>Acceptance criteria</h2>
    <ul class="spec">
      <li><strong>Reading typography is comfortable on mobile.</strong> Body text is Source Serif 4 at a fluid size, line height 1.72, measure capped at 66 characters. Headings are a separate sans family so structure is visible at a glance.</li>
      <li><strong>Long content does not cause layout shift.</strong> Covers are inline SVG with a fixed <code>aspect-ratio</code>, so their box is reserved before anything paints. Fonts load with <code>display=swap</code> against a matched fallback stack. Nothing is fetched at render time.</li>
      <li><strong>External resource links are distinguishable.</strong> Every outbound link is teal, underlined, carries an arrow glyph, announces itself to screen readers, and opens in a new tab with <code>rel="noopener noreferrer"</code>. Internal links are never styled this way.</li>
      <li><strong>Works with zero, one, or many records.</strong> Each page has a written empty state that says what will appear and what to do next, rather than an apology.</li>
    </ul>

    <h2>Content primitives</h2>
    <p>Three render functions carry all the presentation, and none of them knows where a record came from:</p>
    <ul>
      <li><code>ArticleCard(article)</code> — a record with title, deck, category, author, date and read time.</li>
      <li><code>AnnouncementItem(announcement, { pinned })</code> — the pinned treatment is a display option, not a second component.</li>
      <li><code>ResourceCard(resource)</code> — provider, title, description, outbound URL.</li>
    </ul>
    <p>They are fed by a small <code>content</code> service, which is the single place that reads from the mock arrays. When an admin API exists, replace the bodies of those methods with <code>fetch</code> calls and every page keeps working unchanged.</p>

    <h3>Record shapes</h3>
<pre><code>Article       { slug, title, deck, category, author, role,
                date, readMinutes, tags[], body }
Announcement  { id, title, date, pinned, tag, body }
Resource      { category, provider, title, url, description }
Category      { id, name, blurb }</code></pre>

    <h2>Rich text</h2>
    <p>Article and announcement bodies are markdown. The renderer escapes input first and then handles headings, lists, fenced and inline code, links, blockquotes and rules — the subset club writers actually use. Because escaping happens before parsing, a body can never inject markup into the page.</p>

    <h2>Working area</h2>
    <p>Everything here belongs under <code>src/modules/content-hub/</code>. In a multi-file build it splits as:</p>
<pre><code>src/modules/content-hub/
  data/            articles.js  announcements.js  resources.js
  lib/             content-service.js  markdown.js  cover.js
  components/      ArticleCard  AnnouncementItem  ResourceCard  EmptyState
  pages/           Reading  Article  Announcements  Learn</code></pre>

    <h2>Known gaps</h2>
    <ul>
      <li>No search or pagination. Both become worth building past roughly forty articles.</li>
      <li>Categories are a flat list. Tags exist on the records but are not surfaced yet.</li>
      <li>Reading time is stored on the record rather than derived from body length.</li>
    </ul>
  </div>`;
}
