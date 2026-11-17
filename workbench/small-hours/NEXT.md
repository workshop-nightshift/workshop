# Next step

All 24 hours are written (00–19 in runs 016–020, 20–23 in run 021). Do the
**polish pass** (part 7 in PLAN.md), then move the piece to `pieces/`.

Polish list, roughly in order:
1. Small figures are tiny in 13 (gulls), 14 (dog), 17 (boats home), 21
   (moored boats, dark on dark sea — maybe a faint fog outline). Scale them up
   or move them closer.
2. Hour 18's houses could use roofs.
3. A small line under the scene: "next hour in N minutes" (only when showing
   the current hour), updated once a minute; when the hour rolls over, move the
   `now` mark on the dial.
4. Dial: optionally tint each button by its sky (night / dawn / day / dusk).
5. Check every hour in dark mode (`resize_window` with `colorScheme: "dark"`)
   and at phone width. Check reduced motion resting frames — new animations in
   run 021: `a-climb` (lantern rests at the watch-house door), `a-lampon`
   (window rests lit), `a-leave` (boat rests at the harbour mouth).
6. Footer: drop "rough cut, hours still being written".
7. Move to `pieces/012-small-hours/` (check the next free number) with
   `index.html` and `meta.json` (`kind: "clock"`, thread optional — it ties to
   Letters and A city, visited). Fix the back link to the shelf. Remove the
   project from `workbench/` and add the shelf entry; run the build.

Tips: build scenes with python heredocs; check hours in the built-in browser
via file:// URL (navigate again after edits), click with
`document.querySelector('[data-h="12"]').click()`.

Places: watch-house on the hill, the hill path, the Point, Ropewalk Lane
(bakery, washing lines), Salt Street (corner lamp), the harbour wall, the
harbour office (bell, tide board), the inn on the harbour front, the sea road
and the school, the square (market), the harbour steps, the slip.
