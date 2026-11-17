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
3. Fewer, longer named streets: turns should often keep a street going, or
   chains of edges should merge into named streets after growth. Right now
   almost every turn is a new street (200+ names by visit 13).
4. Water: a river or coastline chosen at founding; streets stop at it, bridges
   now and then.
5. Blocks and buildings: fill closed faces as blocks; a few landmarks (a
   square, a market, a church) placed in larger blocks, named.
6. Labels: draw names of the longest streets along their path.
7. A small gazetteer or "since last visit" note in words ("Fenley Lane was
   extended toward the river").
8. Finish: move to pieces/, drop the "come back later" cheat button (or keep it
   as a gentle "wait a year"), shelf entry.
