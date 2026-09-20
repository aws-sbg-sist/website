// Deterministic generated cover art. Inline SVG, fixed aspect ratio,
// nothing to fetch — so covers cannot shift the layout.

/* --- Generated cover art --------------------------------------------------
   Articles have no photography, so each one gets a deterministic figure
   drawn from its slug. Inline SVG, fixed aspect ratio, nothing to load,
   so covers can never shift the layout while a page settles.            */
export function hash(str){ let h = 2166136261; for (const ch of str){ h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export function coverSVG(slug){
  const h = hash(slug), r = rng(h), variant = h % 4;
  const W = 200, H = 125;
  const ink = "var(--ink)", amber = "var(--amber)", teal = "var(--teal)", bg = "var(--surface)";
  let shapes = "";

  if (variant === 0){                     // concentric arcs, off-centre
    const cx = 30 + r() * 80, cy = H * (0.2 + r() * 0.6);
    for (let i = 1; i <= 7; i++){
      shapes += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${i * 13}" fill="none" stroke="${i % 3 === 0 ? amber : ink}" stroke-width="${i % 3 === 0 ? 1.8 : .8}" opacity="${i % 3 === 0 ? .9 : .45}"/>`;
    }
  } else if (variant === 1){              // stacked strata + one solid disc
    let y = 8;
    while (y < H){
      const t = 2 + r() * 9;
      shapes += `<rect x="0" y="${y.toFixed(1)}" width="${W}" height="${t.toFixed(1)}" fill="${ink}" opacity="${(0.08 + r() * 0.28).toFixed(2)}"/>`;
      y += t + 3 + r() * 8;
    }
    shapes += `<circle cx="${(120 + r() * 50).toFixed(0)}" cy="${(30 + r() * 60).toFixed(0)}" r="${(16 + r() * 12).toFixed(0)}" fill="${amber}"/>`;
  } else if (variant === 2){              // node grid with linked pair
    const cols = 9, rows = 6;
    for (let c = 0; c < cols; c++) for (let row = 0; row < rows; row++){
      const x = 16 + c * 21, y = 14 + row * 20;
      shapes += `<circle cx="${x}" cy="${y}" r="${r() > .86 ? 3.6 : 1.5}" fill="${r() > .86 ? teal : ink}" opacity="${r() > .86 ? 1 : .35}"/>`;
    }
    const y1 = 14 + Math.floor(r() * rows) * 20, y2 = 14 + Math.floor(r() * rows) * 20;
    shapes += `<path d="M16 ${y1} H ${W - 16} V ${y2}" fill="none" stroke="${amber}" stroke-width="2"/>`;
  } else {                                // diagonal ribbons
    for (let i = 0; i < 6; i++){
      const x = -40 + i * 46 + r() * 14;
      shapes += `<path d="M${x.toFixed(0)} ${H} L${(x + 34).toFixed(0)} 0 L${(x + 34 + 10 + r() * 14).toFixed(0)} 0 L${(x + 10 + r() * 14).toFixed(0)} ${H} Z" fill="${i === 3 ? amber : ink}" opacity="${i === 3 ? .95 : (0.1 + r() * 0.3).toFixed(2)}"/>`;
    }
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Generated cover figure" preserveAspectRatio="xMidYMid slice"><rect width="${W}" height="${H}" fill="${bg}"/>${shapes}</svg>`;
}
