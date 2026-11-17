# Next step

Part 3 — street naming. Open `preview/index.html`, function `build()` → `tryGrow()`.
When a segment turns (`straight` false) it calls `newStreet(r)`. Change so that:

- a turn off the *end* of a street (node has degree 1) keeps the same street
  ~50% of the time (streets that bend), and
- a branch off the middle of a street always starts a new one.

Then check with the "come back later" button ~12 times: aim for roughly 40–80
streets at visit 13, not 229. Keep determinism: only change logic that every
visit replays identically (changing it will reshape existing cities — that's
fine while it's on the workbench, bump `KEY` to `-v2` if you want clean starts).

After that, part 4 (water).
