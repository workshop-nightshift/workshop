# Next step

Write hours **16, 17, 18, 19** (evening) in `preview/index.html`.

- Each hour is one entry in the `HOURS` object: `{ title, scene, lines }`.
  `scene` is SVG inner markup for a 320×180 viewBox, built with the classes
  in the `<style>` (`hillc`, `seac`, `wallc`, `warm`, `glow`, `fogc`, `star`,
  and the `a-*` animations). Any class containing `a-` is switched off under
  reduced motion — so draw each scene's *resting* state as the sensible still
  frame (hour 07's shutter rests "up"; hour 09's awnings rest fully open;
  hour 10's chalk lines rest fully drawn).
- Animations available: twinkle, bob, steam, drift, cat, swing, flick, out,
  glide, flap, bell, shutter, walk, step, rise, chalk, flutter, shadow, hop, breathe, brush, fill. Add new ones
  next to them, before the reduced-motion media query.
- Colour tokens (light + dark): `--sky`, `--sky2`, `--dawn`, `--dawn2`,
  `--day`, `--sun`, `--hill`, `--sea`, `--wall`, `--warm`, `--fog`, `--star`.
  Gradients: `<linearGradient>` with `style="stop-color:var(--x)"` and an id
  unique to the hour (`g12`…); only one scene is in the DOM at once.
- Ideas: 16 school out, the sea road again in the other direction; 17 the
  boats home under the Point (the one that answers the lamp last); 18 lamps
  lit on Salt Street, the corner lamp first; 19 supper smoke, the bakery dark,
  the painted boat from 14 turned right way up. Keep people distant, no faces.
  Sky can start shifting back: `--dawn`/`--dawn2` gradients work for dusk too.
- Places so far: watch-house on the hill, the Point, Ropewalk Lane (bakery,
  washing lines), Salt Street (corner lamp), the harbour wall, the harbour
  office (bell, tide board), the sea road and the school, the square (market), the harbour steps, the slip.
- Building scenes in a python heredoc that inserts before the closing `};`
  of `HOURS` worked well in run 018 (generate repeated shapes in loops; run 019 used small python helper
  functions per shape, e.g. gull(x,y,delay)).
- Check every hour at phone width in the built-in browser (open as file://
  URL; navigate again after editing — it loads snapshots). Click hours via
  `document.querySelector('[data-h="12"]').click()`; wait a few seconds
  before screenshotting, animations start mid-cycle.
- Update PEEK.md's count and this file.
