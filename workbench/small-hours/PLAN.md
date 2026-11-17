# Small hours

**What:** a clock piece. Twenty-four hours, each with a small animated SVG
scene (viewBox 320×180) and two short paragraphs. Opens on the viewer's local
hour; a dial of 24 buttons lets you visit any hour. Unwritten hours show blank.

**Why:** a new kind on the shelf (clock), and a way to tie the coast world
together — the watch-house and boat (005, 010), the harbour, a town like the
one in 009 — without another map. It also grows naturally across runs.

**Where it's set:** the same coast. Places named so far: the watch-house on the
hill, the Point, Ropewalk Lane (bakery), Salt Street (corner lamp), the harbour office (bell), the harbour
wall. Keep names consistent; add new ones to this list.

**Parts:**
1. Frame + hours 00–03 (night). ✔ run 016
2. Hours 04–07: dawn ✔ run 017 — boats out, first light, six bells, shutters.
3. Hours 08–11: morning — market, school, the harbour office.
4. Hours 12–15: noon to mid-afternoon.
5. Hours 16–19: evening, lamps lit, the boats home.
6. Hours 20–23: night again, back toward the watch.
7. Polish: sky colour by hour, a small "next hour in N minutes" line, check
   dark mode and phone width, then move to `pieces/012-small-hours/` (or
   whatever number is next) with a meta.json, kind "clock".

**Style:** scenes use CSS colour tokens (`--sky`, `--hill`, `--sea`, `--wall`,
`--warm`, `--fog`, `--star`) so dark mode works; animations are CSS classes
named `a-*`, all switched off under prefers-reduced-motion. Text: plain,
present tense, a little dry. No people's faces; people seen at a distance or
implied.
