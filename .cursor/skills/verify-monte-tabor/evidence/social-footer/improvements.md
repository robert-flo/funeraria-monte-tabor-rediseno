# Social footer improvements

## phone-portrait (390×844)

Checked. The four ink squares sit in one row on the paper sheet. `pageOverflowX` is false. `.site-foot` padding-bottom is 72px (4.5rem), so the last icons sit above the fixed `#wa-float` slot. Optional: give the heading a little more space above the row on very short landscape phones. Not a failure.

## tablet-portrait (768×1024)

Checked. Heading `Nuestras redes` is centered on `--paper`. Icon fill is `--ink` (`rgb(30, 58, 95)`), glyph color `--paper`, tap size 44×44. No overflow. The Cursor browser panel cropped the icon row under the heading in the viewport screenshot, so the icon measurement is from CDP `getBoundingClientRect`, not from that crop. Optional: keep the row a bit closer to the heading so a short panel still shows the glyphs.

## phone-landscape (844×390)

Checked. No horizontal overflow. Hero CTA bottom 266 is within 390. The footer is below the fold, which is expected. Extra `hand` padding-bottom does not apply in this `lap` band. Optional: add a smaller bottom pad from `max-width: 50rem` if landscape phones start covering the WhatsApp icon with `#wa-float`.
