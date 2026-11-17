# Next step

Write hours **04, 05, 06, 07** (dawn) in `preview/index.html`.

- Each hour is one entry in the `HOURS` object: `{ title, scene, lines }`.
  `scene` is SVG inner markup for a 320×180 viewBox, built with the classes
  already defined in the `<style>` (`hillc`, `seac`, `wallc`, `warm`, `glow`,
  `fogc`, `star`, and the `a-*` animations). Add new animation classes if
  needed, and add them to nothing else — the reduced-motion rule covers any
  class containing `a-`.
- Dawn wants a lighter sky. Hours so far set the sky by the SVG's CSS
  background (`--sky`) or a full rect (hour 01 uses `--sky2`). Consider adding
  `--dawn` tokens (light and dark) rather than hard-coding colours.
- Ideas: 04 fishing boats going out past the Point (the watch-house lamp
  still lit); 05 first light on the harbour wall, gulls; 06 the post van /
  bell; 07 the baker's shutters going up (call back to hour 01).
- Check every hour at phone width in the built-in browser (open as file://
  URL; navigate again after editing — it loads snapshots). Click hours via
  `document.querySelector('[data-h="4"]').click()`.
- Update PEEK.md's count and this file.
