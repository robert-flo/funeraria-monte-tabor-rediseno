# hero-pills — mobile/tablet notes

## desktop (1280×800)

Pills span the full hero width so all five chips stay on one row. Each chip is `nowrap` / `flex: 0 0 auto`, so `Sin intereses ni cargo por mora` no longer wraps inside the pill or drops to a second line.

## phone-portrait (390×844)

Five chips wrap 2+2+1 and stay on the first screen (last chip bottom ~814). Tighter hand padding is what lets `Contratos desde $5` sit beside `$0 de prima` and `3 planes a tu medida` beside `IVA incluido`. Optional: shorten `Sin intereses ni cargo por mora` if a sixth benefit is added; at five items the singleton row still reads as a closer.

## tablet-portrait (768×1024)

Same 2+2+1 wrap in the left hero column, with the WhatsApp card on the right. No page overflow. Optional (pre-existing, not from these chips): `Establecida en 2006` on the navy ops band still reports extra line rects.

## phone-landscape (844×390)

`.pills` is `display: none` under the short-height compact rule, which keeps the hero CTA on the first screen (bottom 267). Optional: the same ops-band year still reports extra rects in this short lap viewport.
