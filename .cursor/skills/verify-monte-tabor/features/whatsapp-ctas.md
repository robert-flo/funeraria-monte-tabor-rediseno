# WhatsApp CTAs

Each on-page sales control opens WhatsApp to `50374657567` with a first message that names the section the visitor used: hero, plans table, closing ask, social footer, or the floating button.

## Sub-features

- `wa-hero` is the compact card in the hero (`data-wa="hero"`).
- `wa-plans` is the row under the plans table (`data-wa="plans"`).
- `wa-close` is the card in the closing section (`data-wa="close"`).
- `wa-social` is the WhatsApp icon in `footer.site-foot` (`data-wa="social"`).
- `wa-float` is the fixed control `#wa-float` (`data-wa="float"`).

## How to get to it (user POV)

- Choose `Escríbenos por WhatsApp` / `Abrir chat de WhatsApp` in the hero (phone `7465-7567`).
- Choose `Cotiza el plan de tu empresa` under the plans table.
- Choose `Escríbenos por WhatsApp` in `Siguiente paso`.
- Choose the WhatsApp icon in `Nuestras redes`.
- Choose the floating `WhatsApp` control once it is visible (see [Floating WhatsApp](./floating-whatsapp.md) for visibility).

## Driving it with Cursor browser

Preconditions:

- Doctor is OK at `$VERIFY_URL`.
- The tab is on `$VERIFY_URL` and `span.annotation` exists (JS has run, so WhatsApp hrefs are rewritten).
- Do not click any of these links.

- **Load and wait.** Navigate to `$VERIFY_URL`. Run `browser_navigate` then lock. Hero, plans, close, social, and `#wa-float` are all present in `browser_snapshot`.
- **Dump live hrefs.** Read the destinations. Run `browser_cdp` `Runtime.evaluate` with `returnByValue` true and expression `JSON.stringify(Array.from(document.querySelectorAll("[data-wa]")).map(function (a) { return { source: a.getAttribute("data-wa"), href: a.href, aria: a.getAttribute("aria-label") }; }))`. Write the parsed list to `evidence/whatsapp-ctas/hrefs.json`.
- **Check contract.** Compare to the five messages. Run `.cursor/skills/verify-monte-tabor/helpers/assert-wa-hrefs.py evidence/whatsapp-ctas/hrefs.json`. Exit code `0`. The five sources `hero`, `plans`, `close`, `float`, and `social` are present; each `href` starts with `https://wa.me/50374657567?text=` and decodes to the matching row in `helpers/expected-wa-urls.py`.
- **Visible phone.** Confirm the user-facing number. Snapshot text on the three `.cta` cards includes `7465-7567` and `Abrir chat de WhatsApp`.
- **Aria names.** Confirm the two distinct labels. `a[data-wa="hero"]` and `a[data-wa="close"]` and `#wa-float` use `Escríbenos por WhatsApp al 7465-7567`. `a[data-wa="plans"]` uses `Cotiza el plan de tu empresa por WhatsApp al 7465-7567`.
- **Proof.** Save `browser_snapshot` to `evidence/whatsapp-ctas/snapshot.aria.yml`. Screenshot a WhatsApp card on phone-portrait and tablet-portrait. Keep `hrefs.json`. Record feature id `whatsapp-ctas`, entry point `load /`, and viewports in `evidence/whatsapp-ctas/proof.txt`. Write `improvements.md` if a card is hard to tap or the phone number wraps.

## Gotchas

- Clicking a CTA navigates off the landing and may ping GoatCounter. That is not a verification step.
- The HTML `href` before JS is `https://wa.me/50374657567` with no `text`. Asserting that raw attribute from `curl` is not user-path proof.
- `wa.me` query encoding must match JS `encodeURIComponent`. Use `assert-wa-hrefs.py`; do not rebuild the query by hand in a way that uses `+` for spaces.
- Visibility of `#wa-float` is a separate feature. This recipe only requires the node and its `href` to exist.
- Changing copy in `js/design-system.js` requires updating `helpers/expected-wa-urls.py` and this file together.
