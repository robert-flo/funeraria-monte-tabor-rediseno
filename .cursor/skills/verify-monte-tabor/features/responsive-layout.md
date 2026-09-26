# Responsive layout (phone and tablet)

The landing must read as a composed sheet on a phone in one hand and on a tablet on a lap: no page-level horizontal scroll, one-column hero and stacked plan cards on `hand`, a two-column hero and three plan cards on `lap` and `desk`, and WhatsApp cards that remain tappable. Desktop-only proof does not satisfy this feature.

## Sub-features

- `resp-phone-portrait` applies the `hand` band at `390×844` without page overflow; the navy ops band stays one line.
- `resp-tablet-portrait` applies the `lap` band at `768×1024` (two-column hero, three plan cards with aligned heads).
- `resp-phone-landscape` applies the `lap` band at `844×390` with the hero CTA still on the first screen.
- `resp-plans-fit` keeps every `.plan` inside the viewport. There is no swipe hint.
- `resp-desk` at `1024×768` and `1280×800` keeps two-column hero and three plan cards.
- `resp-improvements` records what still feels cramped or easy to miss on small screens.

## How to get to it (user POV)

- Open `/` on a phone in portrait, then rotate to landscape.
- Open `/` on a tablet in portrait, then landscape.
- Scroll through masthead, hero, quota, plan cards, and closing CTA at each size.
- On a phone, read the three plans by scrolling vertically. On a tablet, read all three prices on one row.

## Driving it with Cursor browser

Preconditions:

- Doctor is OK at `$VERIFY_URL`.
- Read `helpers/viewports.json`. Required devices: `phone-portrait`, `tablet-portrait`, `phone-landscape`.
- Do not skip a required device because desktop already looked fine.

- **Phone portrait.** Set metrics. Run `helpers/viewport.py cdp phone-portrait` and pass the JSON to `Emulation.setDeviceMetricsOverride`; enable touch; reload `$VERIFY_URL`; wait for `h1 .annotation`. Evaluate `helpers/viewport-probe.js`. Save as `evidence/responsive-layout/phone-portrait.json`. Run `helpers/assert-viewport.py phone-portrait evidence/responsive-layout/phone-portrait.json`. Exit 0: width `390`, `pageOverflowX` false, hero 1 column, plan-board 1 column, hero CTA bottom at most `844`, ops band one unwrapped row, `.table-hint` absent.
- **Phone hero screenshot.** Capture the top of the page. Run `browser_take_screenshot` to `evidence/responsive-layout/phone-portrait.png`. Company name, annotated heading, and the hero WhatsApp card are all on the first screen without sideways page scroll.
- **Phone plans.** Scroll to the plans heading. Run `Runtime.evaluate` `document.querySelector(".plans h2").scrollIntoView()`. Screenshot `evidence/responsive-layout/phone-portrait-table.png`. Three full-width cards (Económico, Jardín featured, Presidencial) sit in one column. No `Desliza para comparar` copy.
- **Tablet portrait.** Repeat the override for `tablet-portrait` (`768×1024`), reload, probe, `assert-viewport.py tablet-portrait`. Exit 0. Screenshot `evidence/responsive-layout/tablet-portrait.png` (hero) and `tablet-portrait-table.png` (plans). Layout is the `lap` band: two-column hero with a side WhatsApp card, three plan cards on one row with equal heads so `Tipo de ataúd` aligns, no swipe hint.
- **Phone landscape.** Repeat for `phone-landscape` (`844×390`). Exit 0: hero 2 columns, plan-board 3 columns, hero CTA bottom at most `390`. Screenshot `evidence/responsive-layout/phone-landscape.png`.
- **Desk check (when the change can reflow).** Set `tablet-landscape` (`1024×768`) and/or `desktop` (`1280×800`), probe, assert. Hero has 2 columns and plan-board has 3 columns. `.table-hint` is still absent.
- **Improvements.** After looking at the phone and tablet screenshots, write `evidence/responsive-layout/improvements.md` with prioritized notes (overflow, type size, CTA tap area, plan-card scan, float covering copy). A silent pass is invalid.
- **Proof.** `proof.txt` lists feature id `responsive-layout` and viewports actually driven. Keep the JSON probes, screenshots, assert command output, and `improvements.md`.

## Gotchas

- `768px` is `lap`, not `hand`. Asserting “tablet looks like a stacked phone” will fail `assert-viewport.py`.
- Phone landscape (`844×390`) is a `lap` band (hero two columns) with a very short viewport. The compact short-height rules must keep the hero CTA on the first screen; screenshot is required.
- Plan cards use `minmax(0, 1fr)` and must not grow a horizontal scroller. Fail if `documentElement.scrollWidth` exceeds the viewport or if a `.plan` `right` exceeds `innerWidth`.
- `body { min-width: 20rem }` will overflow below 320px CSS pixels. Required devices are wider than that; do not treat a 280px experiment as the phone gate.
- Clear or replace device metrics between devices. A leftover `390` width invalidates a tablet probe.
- `assert-viewport.py` does not judge taste. Screenshots plus `improvements.md` are how cramped type, colliding pills, or a float-over-CTA get reported.
- `browser_take_screenshot` may time out under mobile emulation. Fall back to `Page.captureScreenshot` (`captureBeyondViewport: false`) and `deviceScaleFactor` 1. If the PNG looks like a tiled wallpaper, still trust the probe: this harness can composite device frames that way.
- Never name a local variable `top` inside `Runtime.evaluate` (it collides with `window.top`).
