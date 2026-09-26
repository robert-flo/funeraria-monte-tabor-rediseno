# Plan photos, mobile notes

Measured at `$VERIFY_URL` on 19 Sep 2026. `assert-viewport.py` exited 0 for phone-portrait, tablet-portrait, and phone-landscape.

## Phone-portrait (390×844, `hand`)

Checked: one column, `pageOverflowX` false, square photos 309×309, captions `Tipo de ataúd` plus model name, dummy tabs `display: none` on non-featured cards. Hero CTA bottom 554, inside 844.

Each stacked card is tall because the photo is square. The visitor scrolls past a full chapel shot before Jardín. That is acceptable while the photo is the differentiator. A shorter crop would hide more of the coffin in this placeholder.

The floating WhatsApp control covers the last tick of a card when that row sits at the bottom of the screen. That predates this change.

## Tablet-portrait (768×1024, `lap`)

Checked: three columns, `grid-row: span 3`, head heights 118/118/118, photo tops 218/218/218, first tick tops 469/469/469. Jardín’s gold tab does not drop the photo row. No horizontal overflow.

The three photos are the same placeholder, so the board cannot yet show a real coffin comparison. Swap `assets/planes/{id}.png` when the final shots exist.

## Phone-landscape (844×390, `lap`)

Checked: three columns, heads 119/119/119, photo tops aligned, first ticks aligned, hero CTA bottom 266 (limit 390), no overflow.

The short viewport clips the captions and ticks. The three coffins still sit in one row for a glance comparison. That is the useful part of this band.

Optional later: a shorter `aspect-ratio` only if final photos are wide product shots. Do not add a second crop policy until those files arrive.
