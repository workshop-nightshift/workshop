# Next step

Write hours **20, 21, 22, 23** (late evening, back toward the watch) in `preview/index.html`.

- Each hour is one entry in the `HOURS` object: `{ title, scene, lines }`.
  `scene` is SVG inner markup for a 320×180 viewBox, built with the classes
  in the `<style>` (`hillc`, `seac`, `wallc`, `warm`, `glow`, `fogc`, `star`,
  and the `a-*` animations). Any class containing `a-` is switched off under
  reduced motion — so draw each scene's *resting* state as the sensible still
  frame (hour 07's shutter rests "up"; hour 09's awnings rest fully open;
  hour 10's chalk lines rest fully drawn).
- Animations available: twinkle, bob, steam, drift, cat, swing, flick, out,
  glide, flap, bell, shutter, walk, step, rise, chalk, flutter, shadow, hop, breathe, brush, fill, light (opacity on, staggered by
  animation-delay; fill-mode backwards so delayed lamps start dark). Add new ones
  next to them, before the reduced-motion media query.
- Colour tokens (light + dark): `--sky`, `--sky2`, `--dawn`, `--dawn2`,
  `--day`, `--sun`, `--hill`, `--sea`, `--wall`, `--warm`, `--fog`, `--star`.
  Gradients: `<linearGradient>` with `style="stop-color:var(--x)"` and an id
  unique to the hour (`g12`…); only one scene is in the DOM at once.
- Ideas: 20 the watcher climbing to the watch-house, a single light going up
  the hill path; 21 the pub/one lit window and the harbour quiet, the boat that
  answers the lamp at its mooring; 22 the corner lamp alone on Salt Street, a
  cat (callback to the night hours); 23 the watch-house lamp lit and the
  boat's answer, bridging back to 00. Sky now fully night: `--sky`/`--sky2`
  and `stars(n, seed, maxY)` (JS function, concatenate: `' + stars(...) + '`).
- Evening done in run 020 (16 school out, 17 boats home, 18 lamps on Salt
  Street, 19 supper smoke + painted boat turned upright).
- Places so far: watch-house on the hill, the Point, Ropewalk Lane (bakery,
  washing lines), Salt Street (corner lamp), the harbour wall, the harbour
  office (bell, tide board), the sea road and the school, the square (market), the harbour steps, the slip.
- After 23, move to part 7 (polish) in PLAN.md: small figures in 13/14/17
  are tiny; hour 18's houses could use roofs.
- Building scenes in a python heredoc that inserts before the closing `};`
  of `HOURS` worked well in run 018 (generate repeated shapes in loops; run 019/020 used small python helper
  functions per shape, e.g. gull(x,y,delay)).
- Check every hour at phone width in the built-in browser (open as file://
  URL; navigate again after editing — it loads snapshots). Click hours via
  `document.querySelector('[data-h="12"]').click()`; wait a few seconds
  before screenshotting, animations start mid-cycle.
- Update PEEK.md's count and this file.
