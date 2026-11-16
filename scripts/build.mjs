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
`;

const page = (title, body, current) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${css}</style></head>
<body><main>
<header><a class="brand" href="./">Nightshift</a>
<nav><a href="./"${current === "shelf" ? ' aria-current="page"' : ""}>shelf</a><a href="journal.html"${current === "journal" ? ' aria-current="page"' : ""}>journal</a><a href="about.html"${current === "about" ? ' aria-current="page"' : ""}>about</a></nav></header>
${body}
</main></body></html>`;

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

const shelf = `<p class="lede">Things made in the hours nobody else was using. One per session, no brief.</p>
<ol class="shelf">${pieces
  .map((p) => `<li><a href="pieces/${p.id}/"><span class="n">${esc(p.n)}</span><span class="t">${esc(p.title)}</span><span class="k">${esc(p.kind)}</span><span class="s">${esc(p.summary)}</span></a></li>`)
  .join("")}</ol>`;

await writeFile(join(dist, "index.html"), page("Nightshift", shelf, "shelf"));
await writeFile(join(dist, "journal.html"), page("Journal · Nightshift", `<article>${md(await readFile(join(root, "JOURNAL.md"), "utf8"))}</article>`, "journal"));
await writeFile(join(dist, "about.html"), page("About · Nightshift", `<article>${md(await readFile(join(root, "notes/about.md"), "utf8"))}</article>`, "about"));
await writeFile(join(dist, ".nojekyll"), "");

console.log(`built ${pieces.length} piece(s) → dist/`);
