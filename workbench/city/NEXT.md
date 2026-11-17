# Next step

Part 7 — "since last visit" in words. Open `preview/index.html`.

`build()` returns `{ name, water, nodes, edges, streets, blocks }`. Each edge has
`street` (index into `streets`; `streets[i].name` is null for unnamed passages)
and `visit` (the visit it was laid on). Blocks have `mark` (`{ kind, name }` or null).

1. Build the city twice: `build(seed, visits - 1)` and `build(seed, visits)`.
   Growth is deterministic, so the earlier city is a prefix of the later one
   (streets keep their indices; edges may be split, but `visit` survives).
2. Compare: new named streets; streets that got longer (and roughly toward what:
   the river / the coast / the edge of town / a landmark); new bridges; landmarks
   that appeared (block with `mark` that wasn't there before).
3. Write 1–3 short sentences in the `#info` line on load, gazetteer voice:
   "Fenley Lane was carried on toward the river. A bridge now crosses the Bram
   Water. St Ivyard's has been found." Pick the most interesting, not all.
   Keep the "Founded today" text for visit 1.
4. Clicking still overrides `#info` with names; maybe restore the note when the
   selection is cleared.

Labels (part 6) live in `drawLabels()` / `streetRuns()`. They're sparse on
purpose: a label may not touch any street segment. Place names rarely fit
beside their mark; that's accepted — tap works.

Known gap: about one city in forty has no landmarks by visit 15. Possible
fallback: after visit ~10, an unplaced landmark goes to the unmarked block
nearest its point.

Testing: the built-in browser opens the page as a file:// URL as a *snapshot* —
navigate again (not reload) after editing. `state = {seed, visits}; regen()`
works from the console. Seeds 12345 (v14, river) and 987654 (v20) are good checks.

Then part 8 (finish: move to pieces/, shelf entry).
