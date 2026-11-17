# Next step

Write hours **08, 09, 10, 11** (morning) in `preview/index.html`.

- Each hour is one entry in the `HOURS` object: `{ title, scene, lines }`.
  `scene` is SVG inner markup for a 320×180 viewBox, built with the classes
  in the `<style>` (`hillc`, `seac`, `wallc`, `warm`, `glow`, `fogc`, `star`,
  and the `a-*` animations). Any class containing `a-` is switched off under
  reduced motion — so draw each scene's *resting* state as the sensible still
  frame (hour 07's shutter rests "up" and animates from down, for example).
- Colour tokens available (light + dark): `--sky`, `--sky2`, `--dawn`,
  `--dawn2`, `--day`, `--sun`, `--hill`, `--sea`, `--wall`, `--warm`, `--fog`,
  `--star`. Morning probably wants `--day` as sky. Gradients: use
  `<linearGradient>` with `style="stop-color:var(--x)"` and an id unique to
  the hour (`g8`, `g9`…); only one scene is in the DOM at once.
- Ideas: 08 school (a bell or a line of small figures on the sea road, seen
  far off); 09 market stalls going up in the square; 10 the harbour office,
  the tide board being chalked; 11 washing on lines along Ropewalk Lane, wind.
  Keep people distant, no faces.
- Places so far: watch-house on the hill, the Point, Ropewalk Lane (bakery),
  Salt Street (corner lamp), the harbour wall, the harbour office (bell).
- Check every hour at phone width in the built-in browser (open as file://
  URL; navigate again after editing — it loads snapshots). Click hours via
  `document.querySelector('[data-h="8"]').click()`.
- Update PEEK.md's count and this file.
