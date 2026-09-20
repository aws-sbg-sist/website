// Hash router + shell wiring. Entry point for the Content Hub module.
import { content, dataset, setDataset, setCategory } from "./lib/content-service.js";
import { ARTICLES } from "./data/articles.js";
import { ANNOUNCEMENTS } from "./data/announcements.js";
import { RESOURCES } from "./data/resources.js";
import { ReadingPage } from "./pages/ReadingPage.js";
import { ArticlePage } from "./pages/ArticlePage.js";
import { AnnouncementsPage } from "./pages/AnnouncementsPage.js";
import { LearnPage } from "./pages/LearnPage.js";
import { NotesPage } from "./pages/NotesPage.js";

const view = document.getElementById("view");
const tabs = document.getElementById("tabs");
const statebar = document.getElementById("statebar");

function currentRoute(){
  const raw = (location.hash || "#/reading").replace(/^#/, "");
  const parts = raw.split("/").filter(Boolean);
  return { section: parts[0] || "reading", param: parts[1] || null };
}

function render(){
  const { section, param } = currentRoute();
  let html, tab = section;

  switch (section){
    case "reading":       html = param ? ArticlePage(param) : ReadingPage(); break;
    case "announcements": html = AnnouncementsPage(); break;
    case "learn":         html = LearnPage(); break;
    case "notes":         html = NotesPage(); break;
    default:              html = ReadingPage(); tab = "reading";
  }

  view.innerHTML = html;

  [...tabs.querySelectorAll("a")].forEach(a => {
    const isCurrent = a.getAttribute("href") === `#/${tab}`;
    if (isCurrent) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");
  });

  // dataset banner
  if (dataset === "many"){
    statebar.hidden = true;
    statebar.innerHTML = "";
  } else {
    statebar.hidden = false;
    statebar.innerHTML = `<div class="wrap">
      <span>Previewing the “${dataset === "one" ? "exactly one record" : "no records"}” state.</span>
      <button type="button" id="reset-state">Show all content</button>
    </div>`;
  }

  const total = ARTICLES.length + ANNOUNCEMENTS.length + RESOURCES.length;
  document.getElementById("foot-count").textContent =
    `Content Hub · ${ARTICLES.length} articles, ${ANNOUNCEMENTS.length} announcements, ${RESOURCES.length} resources`;

  document.title = section === "reading" && param
    ? `${(content.article(param) || {}).title || "Article"} — Content Hub`
    : "Content Hub — AWS Student Builder Group";
}

// delegated interactions
document.addEventListener("click", e => {
  const cat = e.target.closest("[data-cat]");
  if (cat){ setCategory(cat.dataset.cat); render(); return; }

  const set = e.target.closest("[data-set]");
  if (set){ setDataset(set.dataset.set); render(); return; }

  if (e.target.closest("#reset-state")){ setDataset("many"); render(); return; }

  if (e.target.closest("#theme-toggle")){
    const root = document.documentElement;
    const isDark = getComputedStyle(root).getPropertyValue("--paper").trim().startsWith("#0E");
    root.setAttribute("data-theme", isDark ? "light" : "dark");
  }
});

window.addEventListener("hashchange", () => {
  render();
  window.scrollTo({ top:0, behavior:"instant" in window ? "instant" : "auto" });
  document.getElementById("main").focus({ preventScroll:true });
});

render();
