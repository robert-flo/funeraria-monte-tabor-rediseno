# Mobile and tablet notes after the layout follow-up

Checked phone-portrait `390×844`, tablet-portrait `768×1024`, phone-landscape `844×390`, plus tablet-landscape `1024×768` and desktop `1280×800`. `assert-viewport.py` exited 0 on all five. `assert-wa-hrefs.py` exited 0.

## phone-portrait (`hand`)

Navy ops is one unwrapped row. Visible copy is `San Salvador y todo el país` and `24/7/365` (probe `opBandWraps` false, both `top` 174, `lines` 1). Hero WhatsApp sits on the first screen (`heroCtaBottom` 537, fold 844). Spacer tabs are `display:none` on stacked cards, so only Jardín shows `El más solicitado`. Optional: the brief hours string is denser than the tablet phrase `24 horas, 365 días del año`.

## tablet-portrait (`lap`)

Three plan cards share a 117px head. `Tipo de ataúd` tops are 1560 across Económico, Jardín, and Presidencial. Screenshot of the board matches that alignment. Optional: `Establecida en 2006` still reports three client rects on the right of the navy band because the gold year is a nested span.

## phone-landscape (`lap`, short)

Compact `max-height: 28rem` rules hide `.hero-note` and `.pills`. Hero is two columns. CTA bottom is 265 (fold 390). Plan heads stay equal (118px) and the first fact row stays aligned. Optional: the same nested year span still reports extra rects on the ops band.

## desk (optional this run)

Tablet-landscape and desktop keep two hero columns, three plan columns, equal heads, and no page overflow.
