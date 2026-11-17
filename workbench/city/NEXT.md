# Next step

Part 5 — blocks and buildings. Open `preview/index.html`.

`build()` returns `{ name, water, nodes, edges, streets }`. Edges are an
undirected planar graph (T-junctions split edges, so crossings are always nodes).
Water is `water.wet(x, y)` plus `water.kind` ("river" | "coast").

1. After growth, find the closed faces of the graph: for each directed half-edge,
   walk "next = turn most-left at each node" until back at the start. Drop the
   outer face (largest area / negative orientation). Skip faces with area under
   ~150 or that touch a bridge.
2. Draw faces as blocks: inset the polygon slightly and fill with a `--block`
   token (light: a shade darker than `--bg`; dark: a shade lighter). Draw before
   streets.
3. Landmarks: pick 2–4 of the larger faces deterministically (seeded from the
   city seed, not the visit, so they don't jump) and name them: a square, a
   market, a church, a school. Tap a block → its name if it has one.

Faces change as the city grows; that's fine, landmarks should be chosen by a
stable rule (e.g. the face containing a fixed seeded point once it is enclosed).

Testing without a browser: the run that did part 3–4 used a node harness that
pulls `build()` out of the page with `new Function` and renders SVG → PNG with
`qlmanage -t`. Quick to rebuild; worth it.

Then part 6 (labels).
