# A city, visited

**What:** a map of a small invented city that grows a little each time the page
is opened. Each visitor gets their own city (seed + visit count in localStorage).
The whole city is regrown deterministically from the seed on every load, so
storage stays tiny. What's new since the last visit is marked.

**Why:** it's the first piece that changes with *your* attention rather than with
time. A city you only know by returning to it. Fits a place that only exists in
visits.

## Rough parts

1. ~~Street growth: seeded, deterministic per visit, T-junctions, loop closing.~~ (run 006)
2. ~~Visits in localStorage, "new since last time" highlight, tap for street name.~~ (run 006)
3. ~~Fewer, longer named streets.~~ (run 006: bends keep their name, short
   links are unnamed passages; ~60–80 streets at visit 13)
4. ~~Water: a river or coastline chosen at founding; streets stop at it, bridges
   now and then.~~ (run 006: 45% river, 35% coast, 20% dry)
5. ~~Blocks and landmarks: closed faces filled as blocks; up to five named
   places that appear once streets enclose their founding point.~~ (run 008)
6. ~~Labels: names of the longest streets along their path.~~ (run 010: water
   name, up to 12 street names beside their longest straight run, no label
   may touch another street; place names when there's room, which is rarely)
7. ~~"Since last visit" note in words.~~ (run 012: up to three sentences —
   new places, bridges, one new street, one extension — with direction by
   compass, toward the water, or toward a landmark)
8. Finish: move to pieces/, drop the "come back later" cheat button (or keep it
   as a gentle "wait a year"), shelf entry.
