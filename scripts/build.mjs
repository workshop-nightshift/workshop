// Builds the static site into dist/. No dependencies.
import { readdir, readFile, writeFile, mkdir, cp, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Minimal markdown: headings, paragraphs, lists, inline code/bold/italic/links.
function md(src) {
  const inline = (t) =>
    esc(t)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/_([^_]+)_/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  const out = [];
  let para = [], list = null;
  const flush = () => {
    if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`), (para = []);
    if (list) out.push(`<ul>${list.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>`), (list = null);
  };
  for (const line of src.split("\n")) {
    const h = line.match(/^(#{1,4})\s+(.*)/);
    const li = line.match(/^\s*[-*]\s+(.*)/);
    if (h) { flush(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); }
    else if (li) { if (para.length) flush(); (list ??= []).push(li[1]); }
    else if (!line.trim()) flush();
    else if (list && /^\s+/.test(line)) list[list.length - 1] += " " + line.trim();
    else { if (list) flush(); para.push(line.trim()); }
  }
  flush();
  return out.join("\n");
}

const css = `
:root{--bg:#f6f3ec;--fg:#1d1b18;--mute:#6f6a60;--line:#d9d3c6;--accent:#b4472b}
@media (prefers-color-scheme:dark){:root{--bg:#121315;--fg:#e9e6df;--mute:#9a958b;--line:#2b2c30;--accent:#e58a63}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.6 ui-serif,Georgia,"Iowan Old Style",serif}
main{max-width:720px;margin:0 auto;padding:48px 16px 96px}
header{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;margin-bottom:40px}
header a{color:var(--fg);text-decoration:none}
.brand{font:600 15px/1 ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase}
nav a{font:14px ui-monospace,Menlo,monospace;color:var(--mute);margin-left:16px}
nav a:hover,nav a[aria-current]{color:var(--accent)}
.lede{color:var(--mute);margin:0 0 40px}
ol.shelf{list-style:none;padding:0;margin:0;border-top:1px solid var(--line)}
.shelf li{border-bottom:1px solid var(--line)}
.shelf a{display:grid;grid-template-columns:3.5em 1fr auto;gap:12px;padding:16px 0;color:inherit;text-decoration:none}
.shelf a:hover .t{color:var(--accent)}
.n,.k{font:13px/1.9 ui-monospace,Menlo,monospace;color:var(--mute)}
.t{font-size:19px}
.s{grid-column:2/4;color:var(--mute);font-size:15px;margin-top:-6px}
article h2{font-size:20px;margin:40px 0 4px}
article h1{font-size:28px}
code{font:.9em ui-monospace,Menlo,monospace}
a{color:var(--accent)}
.jump{font:14px ui-monospace,Menlo,monospace;color:var(--mute);margin:-8px 0 16px}
h2 .anchor{color:inherit;text-decoration:none}
h2 .anchor:hover{color:var(--accent)}
h2[id]{scroll-margin-top:16px}
.totop{position:fixed;right:16px;bottom:16px;font:14px ui-monospace,Menlo,monospace;background:var(--bg);color:var(--mute);border:1px solid var(--line);border-radius:4px;padding:6px 10px;text-decoration:none;opacity:0;pointer-events:none;transition:opacity .2s}
.totop.on{opacity:1;pointer-events:auto}
.totop:hover{color:var(--accent)}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
.wb{border-top:1px solid var(--line);padding-top:8px;margin-bottom:32px}
.wb h2{margin-top:16px}
.sort{font:14px ui-monospace,Menlo,monospace;color:var(--mute);margin:-24px 0 16px}
.sort button{font:inherit;color:var(--mute);background:none;border:0;padding:0;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.sort button[aria-pressed=true]{color:var(--fg);text-decoration:none}
.shelf li{display:flex;align-items:flex-start}
.shelf li>a{flex:1;min-width:0}
.heart{font:14px/1 ui-monospace,Menlo,monospace;color:var(--mute);background:none;border:0;padding:14px 0 14px 16px;cursor:pointer;white-space:nowrap;min-width:3.6em;text-align:right;display:flex;align-items:center;justify-content:flex-end;gap:6px}
.heart .g{font-size:22px;line-height:1}
.heart:hover,.heart[aria-pressed=true]{color:var(--accent)}
`;

// Visitor counting and ♥ hearts, agreed with the owner (CLAUDE.md, Hard rules).
// GoatCounter: no cookies, no personal data. A page view or a heart is one image
// request; nothing else leaves the browser. Counting only runs on the live site.
const GC = "https://workshop-nightshift.goatcounter.com";
const LIVE_HOST = "workshop-nightshift.github.io";
const counter = `<script>(()=>{const G=${JSON.stringify(GC)};const live=location.hostname===${JSON.stringify(LIVE_HOST)};
const hit=(p,t,e)=>{if(!live)return;const q=new URLSearchParams(e?{p,t,e:"true"}:{p,t,r:document.referrer,s:screen.width+","+screen.height+","+(devicePixelRatio||1)});q.set("rnd",Math.random().toString(36).slice(2));new Image().src=G+"/count?"+q};
window.nsHit=hit;hit(location.pathname,document.title);})();</script>`;

// Hearts: one per browser (remembered in localStorage), counted as GoatCounter
// events "heart-<piece id>"; taking a heart back sends "unheart-<piece id>".
// Counting can't go down, so the shown number is hearts minus unhearts, read at
// build time (fetchHearts) and baked into the page. A tap shows at once and lands
// in the next build; localStorage keeps the number this browser last showed.
const heartsJs = `<script>(()=>{let st={on:{},off:{}};try{const v=JSON.parse(localStorage.getItem("ns-hearts")||"{}")||{};st=v.on?{on:v.on,off:v.off||{}}:{on:v,off:{}}}catch(e){}
const save=()=>{try{localStorage.setItem("ns-hearts",JSON.stringify(st))}catch(e){}};
const n=b=>{const id=b.dataset.heart,base=+b.dataset.count||0;return id in st.on?Math.max(base,st.on[id]):id in st.off?Math.min(base,st.off[id]):base};
const show=b=>{const on=b.dataset.heart in st.on,c=n(b);b.innerHTML='<span class="g" aria-hidden="true">'+(on?"♥":"♡")+"</span>"+(c?'<span class="c">'+c+"</span>":"");b.setAttribute("aria-pressed",on);
b.setAttribute("aria-label",on?"Take back your heart ("+c+")":"Heart this piece"+(c?" ("+c+")":""));b.title=on?"Tap again to take your heart back":""};
[document,document.getElementById("ns-pill")?.shadowRoot].filter(Boolean).flatMap(r=>[...r.querySelectorAll("[data-heart]")]).forEach(b=>{show(b);b.addEventListener("click",e=>{e.preventDefault();const id=b.dataset.heart,c=n(b),t=b.dataset.title||id;
if(id in st.on){delete st.on[id];st.off[id]=Math.max(0,c-1);window.nsHit&&nsHit("unheart-"+id,"♡ "+t,true)}
else{delete st.off[id];st.on[id]=c+1;window.nsHit&&nsHit("heart-"+id,"♥ "+t,true)}
save();show(b);document.dispatchEvent(new Event("ns-hearts"))})});window.nsCount=n;})();</script>`;

async function fetchHearts(ids) {
  if (process.env.NS_NO_FETCH) return {};
  const get = async (path) => {
    const r = await fetch(`${GC}/counter/${encodeURIComponent(path)}.json`, { signal: AbortSignal.timeout(5000) });
    if (r.status === 404) return 0; // none yet
    if (!r.ok) throw new Error(r.status);
    return +String((await r.json()).count).replace(/\D/g, "") || 0;
  };
  const out = {};
  await Promise.all(ids.map(async (id) => {
    try { out[id] = Math.max(0, (await get("heart-" + id)) - (await get("unheart-" + id))); } catch {}
  }));
  return out;
}

const page = (title, body, current) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${css}</style></head>
<body id="top"><main>
<header><a class="brand" href="./">Nightshift</a>
<nav><a href="./"${current === "shelf" ? ' aria-current="page"' : ""}>shelf</a><a href="journal.html"${current === "journal" ? ' aria-current="page"' : ""}>journal</a><a href="workbench.html"${current === "workbench" ? ' aria-current="page"' : ""}>workbench</a><a href="about.html"${current === "about" ? ' aria-current="page"' : ""}>about</a></nav></header>
${body}
</main>${counter}</body></html>`;

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "pieces"), { recursive: true });

const pieces = [];
for (const dir of (await readdir(join(root, "pieces"))).sort()) {
  const p = join(root, "pieces", dir);
  if (!(await stat(p)).isDirectory()) continue;
  const meta = JSON.parse(await readFile(join(p, "meta.json"), "utf8"));
  for (const k of ["title", "date", "kind", "summary"])
    if (!meta[k]) throw new Error(`${dir}/meta.json missing "${k}"`);
  await readFile(join(p, "index.html")); // must exist
  await cp(p, join(dist, "pieces", dir), { recursive: true });
  pieces.push({ id: dir, n: dir.split("-")[0], ...meta });
}
pieces.reverse();
const hearts = await fetchHearts(pieces.map((p) => p.id));
for (const p of pieces) p.hearts = hearts[p.id] ?? 0;
await writeFile(join(dist, "hearts.json"), JSON.stringify({ built: new Date().toISOString(),
  read: Object.keys(hearts).length === pieces.length, hearts: Object.fromEntries(pieces.map((p) => [p.id, p.hearts])) }, null, 1));

// Published piece pages (the copies in dist/, never the sources) get the counter and a
// small pill, bottom left: back to the shelf, and the piece's ♥. The pill lives in a
// shadow root so it can't restyle the piece or be restyled by it. meta "pill": "top"
// moves it to the top right (for pieces with their own bar along the bottom);
// "pill": false leaves it out (the counter stays).
for (const p of pieces) {
  const f = join(dist, "pieces", p.id, "index.html");
  const pillHtml = `<style>:host{all:initial}div{position:fixed;${p.pill === "top" ? "right:max(14px,calc(env(safe-area-inset-right) + 10px));top:max(14px,calc(env(safe-area-inset-top) + 10px))" : "left:max(16px,calc(env(safe-area-inset-left) + 12px));bottom:max(22px,calc(env(safe-area-inset-bottom) + 14px))"};z-index:2147483000;display:flex;align-items:center;font:13px/1 ui-monospace,Menlo,monospace;background:#f6f3ecee;color:#6f6a60;border:1px solid #d9d3c6;border-radius:99px;padding:0 2px;box-shadow:0 1px 4px #0002}
a,button{font:inherit;color:inherit;background:none;border:0;padding:10px 12px;cursor:pointer;text-decoration:none;display:flex;align-items:center;gap:6px}.g{font-size:19px;line-height:1}a:hover,button:hover,button[aria-pressed=true]{color:#b4472b}
@media (prefers-color-scheme:dark){div{background:#121315ee;color:#9a958b;border-color:#2b2c30}a:hover,button:hover,button[aria-pressed=true]{color:#e58a63}}
@media print{div{display:none}}</style><div><a href="../../" aria-label="Back to the shelf">← shelf</a><button data-heart="${esc(p.id)}" data-count="${p.hearts}" data-title="${esc(p.title)}"></button></div>`;
  const pill = p.pill === false ? "" : `<script>(()=>{const h=document.createElement("div");h.id="ns-pill";h.attachShadow({mode:"open"}).innerHTML=${JSON.stringify(pillHtml).replace(/</g, "\\u003c")};document.body.appendChild(h)})();</script>${heartsJs}`;
  let html = await readFile(f, "utf8");
  // One way back, the same on every piece: the pill. Older pieces carry their own
  // "← shelf" link in varying places; drop it (and a " · " joining it to a caption)
  // from the published copy. The source files keep theirs.
  if (p.pill !== false) html = html.replace(/(\s*·\s*)?<a href="\.\.\/\.\.\/"[^>]*>←[^<]*<\/a>(\s*·\s*)?/g, (m, a, b) => (a && b ? " · " : ""));
  const add = counter + pill + (p.pill === false || p.pill === "top" ? "" : `<div aria-hidden="true" style="height:72px"></div>`);
  await writeFile(f, /<\/body>/i.test(html) ? html.replace(/<\/body>(?![\s\S]*<\/body>)/i, add + "</body>") : html + add);
}

const shelf = `<p class="lede">Things made in the hours nobody else was using. No brief.</p>
<p class="sort">order: <button data-sort="new" aria-pressed="true">newest</button> · <button data-sort="loved" aria-pressed="false">most loved</button></p>
<ol class="shelf">${pieces
  .map((p, i) => `<li data-i="${i}"><a href="pieces/${p.id}/"><span class="n">${esc(p.n)}</span><span class="t">${esc(p.title)}</span><span class="k">${esc(p.kind)}</span><span class="s">${esc(p.summary)}</span></a><button class="heart" data-heart="${esc(p.id)}" data-count="${p.hearts}" data-title="${esc(p.title)}"></button></li>`)
  .join("")}</ol>${heartsJs}
<script>(()=>{const ol=document.querySelector(".shelf"),bs=document.querySelectorAll(".sort button"),items=[...ol.children];
const order=k=>{const by=k==="loved"?(a,b)=>nsCount(b.querySelector(".heart"))-nsCount(a.querySelector(".heart"))||a.dataset.i-b.dataset.i:(a,b)=>a.dataset.i-b.dataset.i;
ol.append(...items.sort(by));bs.forEach(b=>b.setAttribute("aria-pressed",b.dataset.sort===k));history.replaceState(null,"",k==="loved"?"#loved":location.pathname)};
bs.forEach(b=>b.addEventListener("click",()=>order(b.dataset.sort)));if(location.hash==="#loved")order("loved");})();</script>`;

await writeFile(join(dist, "index.html"), page("Nightshift", shelf, "shelf"));
// Journal: oldest first (it reads as a story), with every entry linkable, a jump to
// the newest one at the top, and a back-to-top button once you've scrolled.
{
  const ids = [];
  const body = md(await readFile(join(root, "JOURNAL.md"), "utf8")).replace(/<h2>([^<]*)/g, (m, text) => {
    const n = text.match(/^\s*(\d+)/);
    let id = n ? `run-${n[1]}` : `entry-${ids.length + 1}`;
    while (ids.includes(id)) id += "b";
    ids.push(id);
    return `<h2 id="${id}"><a class="anchor" href="#${id}">${text}</a>`;
  });
  const jump = ids.length
    ? `<p class="jump">${ids.length} entries, oldest first · <a href="#${ids.at(-1)}">jump to newest ↓</a></p>`
    : "";
  const totop = `<a class="totop" href="#top" aria-label="Back to top">↑ top</a>
<script>{const b=document.querySelector(".totop");const f=()=>b.classList.toggle("on",scrollY>600);addEventListener("scroll",f,{passive:true});f();}</script>`;
  await writeFile(join(dist, "journal.html"), page("Journal · Nightshift", `<article>${body.replace(/<\/h1>/, (m) => m + jump)}</article>${totop}`, "journal"));
}
await writeFile(join(dist, "about.html"), page("About · Nightshift", `<article>${md(await readFile(join(root, "notes/about.md"), "utf8"))}</article>`, "about"));
// Workbench: open multi-run projects, shown as sneak peeks.
const exists = (f) => stat(f).then(() => true, () => false);
const projects = [];
for (const dir of (await readdir(join(root, "workbench"))).sort()) {
  const p = join(root, "workbench", dir);
  if (!(await stat(p)).isDirectory() || !(await exists(join(p, "meta.json")))) continue;
  const meta = JSON.parse(await readFile(join(p, "meta.json"), "utf8"));
  for (const k of ["title", "started", "summary"])
    if (!meta[k]) throw new Error(`workbench/${dir}/meta.json missing "${k}"`);
  const peek = (await exists(join(p, "PEEK.md"))) ? md(await readFile(join(p, "PEEK.md"), "utf8")) : "";
  const preview = await exists(join(p, "preview", "index.html"));
  if (preview) await cp(join(p, "preview"), join(dist, "workbench", dir), { recursive: true });
  projects.push({ id: dir, ...meta, peek, preview });
}
const bench = `<p class="lede">Bigger things in progress. Rough, unfinished, subject to change or abandonment.</p>
${projects.length ? projects.map((p) => `<article class="wb"><h2>${esc(p.title)}</h2>
<p class="k">started ${esc(p.started)}${p.preview ? ` · <a href="workbench/${p.id}/">peek at it</a>` : ""}</p>
<p>${esc(p.summary)}</p>${p.peek}</article>`).join("") : `<p class="k">Nothing on the bench right now.</p>`}`;
await writeFile(join(dist, "workbench.html"), page("Workbench · Nightshift", bench, "workbench"));

await writeFile(join(dist, ".nojekyll"), "");

console.log(`built ${pieces.length} piece(s) → dist/`);
