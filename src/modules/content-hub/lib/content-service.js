// The ONLY module that knows where records come from.
// Swap the imports below for fetch() calls and every page keeps working.
import { CATEGORIES, EXTRA_CATEGORIES } from "../data/categories.js";
import { ARTICLES } from "../data/articles.js";
import { ANNOUNCEMENTS } from "../data/announcements.js";
import { RESOURCES } from "../data/resources.js";

export const STATE_KEY = "asbg.contenthub.v1";
export let dataset = "many";                // many | one | none
export let activeCategory = "all";

try {
  const saved = JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
  if (["many","one","none"].includes(saved.dataset)) dataset = saved.dataset;
  if (typeof saved.category === "string") activeCategory = saved.category;
} catch (e) { /* storage unavailable — defaults are fine */ }

export function persist(){
  try { localStorage.setItem(STATE_KEY, JSON.stringify({ dataset, category: activeCategory })); }
  catch (e) { /* ignore */ }
}

export function scale(list){
  if (dataset === "none") return [];
  if (dataset === "one") return list.slice(0,1);
  return list;
}

export const content = {
  categories: () => [...CATEGORIES, ...EXTRA_CATEGORIES],
  category: id => content.categories().find(c => c.id === id),
  articles(){ return scale([...ARTICLES].sort((a,b) => b.date.localeCompare(a.date))); },
  article(slug){ return ARTICLES.find(a => a.slug === slug); },
  related(article, n = 3){
    const pool = ARTICLES.filter(a => a.slug !== article.slug);
    const same = pool.filter(a => a.category === article.category);
    const rest = pool.filter(a => a.category !== article.category);
    return [...same, ...rest].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,n);
  },
  announcements(){
    const sorted = [...ANNOUNCEMENTS].sort((a,b) => b.date.localeCompare(a.date));
    const pinnedFirst = [...sorted.filter(a=>a.pinned), ...sorted.filter(a=>!a.pinned)];
    return scale(pinnedFirst);
  },
  resources(){ return scale(RESOURCES); }
};

/* --- mutators: imported bindings are read-only, so callers use these ----- */

export function setDataset(next){
  if (!["many","one","none"].includes(next)) return;
  dataset = next;
  persist();
}

export function setCategory(next){
  activeCategory = next;
  persist();
}
