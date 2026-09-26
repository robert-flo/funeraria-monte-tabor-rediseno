# Floating WhatsApp

A fixed WhatsApp control stays off screen while the masthead or any contact card is visible, then appears so the visitor can still reach an advisor.

## Sub-features

- `float-hidden` keeps `#wa-float` without `is-visible` while `.masthead` or any `.cta` intersects the viewport (observer rootMargin bottom `30%`).
- `float-shown` adds `is-visible` once none of those anchors remain intersecting.
- `float-target` uses the `float` WhatsApp message (proven in [WhatsApp CTAs](./whatsapp-ctas.md)).

## How to get to it (user POV)

- Load `/` at the top: the floating control is not offered.
- Scroll until the header and the WhatsApp cards have left the viewport: the floating `WhatsApp` control appears at the bottom-right.

## Driving it with Cursor browser

Preconditions:

- Doctor is OK at `$VERIFY_URL`.
- Prove on **phone-portrait** first (`390×844`). Desktop height is not a substitute: the float’s `rootMargin` bottom `30%` behaves differently on a short phone screen.
- JS has run (`span.annotation` exists). `IntersectionObserver` is available (it is, in the Cursor browser).

- **Resting state.** Load `/` without scrolling. Run `browser_navigate` to `$VERIFY_URL` and lock. Evaluate `document.getElementById("wa-float").classList.contains("is-visible")` and `getComputedStyle(document.getElementById("wa-float")).visibility`. `is-visible` is false and `visibility` is `hidden`. Save `evidence/floating-whatsapp/top.png`.
- **Reveal.** Scroll until masthead and every `.cta` are off screen. Run `browser_cdp` `Runtime.evaluate` with `document.querySelector(".contact").scrollIntoView({block:"start"})` is **not** enough if that contact `.cta` still intersects — instead set `document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight` or scroll to a position where `getBoundingClientRect()` for `.masthead` and each `.cta` is outside the viewport (remember the observer `rootMargin` `0px 0px 30% 0px`, so a card still in the bottom 30% counts as on screen). Re-evaluate `classList.contains("is-visible")`. It is true and `getComputedStyle(...).visibility` is `visible`. Snapshot includes the accessible name `Escríbenos por WhatsApp al 7465-7567` on `#wa-float`. Save `evidence/floating-whatsapp/revealed.png`.
- **Href still attributed.** Dump `#wa-float.href` (or reuse a full `[data-wa]` dump). It matches the `float` row from `helpers/expected-wa-urls.py`.
- **Proof.** Write `evidence/floating-whatsapp/proof.txt` naming entry points `load /` (hidden) and `scroll past CTAs` (shown) on phone-portrait. Keep both screenshots. Repeat the reveal check on tablet-portrait if the change touches observer logic or CTA layout. Write `improvements.md` if the float covers the plans CTA or sits under a home indicator. Do not click the control.

## Gotchas

- The observer uses `rootMargin: 0px 0px 30% 0px`. A CTA slightly below the fold still hides the float. Scroll further than “heading just out of view”.
- There are three `.cta` nodes plus `.masthead`. Any one intersecting keeps the float hidden.
- Without `IntersectionObserver` the script would force `is-visible` immediately. If the float is visible at scroll top on a capable browser, that is a regression, not the fallback.
- `prefers-reduced-motion: reduce` only drops the transform animation; visibility rules stay the same.
- Unlock the tab when finished. Cleanup does not close the browser tab.
