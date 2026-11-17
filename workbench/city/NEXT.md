# Next step

Part 6 — labels. Open `preview/index.html`.

`build()` returns `{ name, water, nodes, edges, streets, blocks }`. Each edge has
`street` (index into `streets`; `streets[i].name` is null for unnamed passages).
Blocks have `pts`, `area`, `cx/cy`, and `mark` (`{ kind, name }` or null).

1. Group edges by street; for each named street, chain its edges into one or more
   polylines (walk from a degree-1 end of the street's own subgraph).
2. Pick the ~8–12 longest streets (by world length) that fit at the current
   scale. Draw the name along the polyline: place characters one by one on the
   longest straight-ish run, flipping so text never reads upside down. Small
   serif, `--mute`, with a `--bg` halo (strokeText first).
3. Skip a label if its box overlaps an already placed label or a landmark glyph.
   At phone width there'll be fewer; that's fine.
4. Landmark names: maybe label them too, small italic, near the glyph, if there
   is room. Optional.

Known gap: about one city in forty has no landmarks by visit 15 (their seeded
points land where the city doesn't grow). Could add a fallback later: after
visit ~10, an unplaced landmark goes to the unmarked block nearest its point.

Testing: the built-in browser can open the page as a file:// URL, but it loads
a *snapshot* — navigate again (not reload) after editing. `build(seed, n)` and
`state = {seed, visits}; regen()` work from the console.

Then part 7 (gazetteer / "since last visit" in words).
