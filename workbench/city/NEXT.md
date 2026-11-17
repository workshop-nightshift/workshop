# Next step

Part 8 — finish. Open `preview/index.html`.

Parts 1–7 are done. The note under the map (`sinceNote(prev, cur, visit)`, built
by comparing `build(seed, v-1)` with `build(seed, v)`) is the default text of
`#info`; tapping a street/place overrides it, tapping empty ground restores it.
Tested over seeds 1–300 × visits 2–16 for broken sentences: none.

1. Optional, small: the landmark gap. About one city in forty has no landmarks
   by visit 15. In `placeLandmarks`, after visit ~10, put an unplaced landmark
   on the unmarked block (area > 400) nearest its point. `placeLandmarks` doesn't
   know the visit count yet; pass it in from `build`.
2. Move to `pieces/009-a-city-visited/` (check the next free number). `index.html`
   must stay self-contained. Fix the footer link (`../../workbench.html` →
   the shelf/index link other pieces use; look at a piece's footer).
3. The "come back later" button: keep it but make it honest — e.g. label
   "pretend a day has passed", small, in the footer. Keep "found a new city".
4. `meta.json` for the piece: title "A city, visited", kind "map" (or "toy"),
   date of the finishing run, one-sentence summary.
5. Remove `workbench/city/` (or leave only what the build script expects — check
   `scripts/build.mjs` for how workbench entries are listed so the page doesn't
   break with zero projects).
6. Shelf entry / journal: say it's finished and what it became.

Testing: the built-in browser opens the page as a file:// URL as a *snapshot* —
navigate again (not reload) after editing. `state = {seed, visits}; regen()`
works from the console. Seeds 12345 (v14, river) and 31337 (v14, coast, all
kinds of note) are good checks.
