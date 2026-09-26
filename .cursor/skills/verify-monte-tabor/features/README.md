# Funeraria Monte Tabor verification map

This directory is the maintained source for verifying the user-facing behavior of the Funeraria Monte Tabor landing. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-monte-tabor/helpers/launch.sh` so the page is served from this checkout on `127.0.0.1`.
- Run `.cursor/skills/verify-monte-tabor/helpers/doctor.sh` and require `OK`, the printed `VERIFY_URL`, and title `Funeraria Monte Tabor — Plan empresarial 2026`.
- Drive only that `VERIFY_URL`. Never use GitHub Pages, `file://`, or a server whose pid is not in `run/state.env`.
- Wait for `js/design-system.js` to run (`span.annotation` present in the hero `h1`) before asserting copy or WhatsApp hrefs.
- Do not click WhatsApp (`wa.me`) or Maps links. Inspect live `href` values instead.
- Set **phone-portrait** (`390×844`), **tablet-portrait** (`768×1024`), and **phone-landscape** (`844×390`) from `helpers/viewports.json` before treating layout as proven. A desktop-only pass is invalid.
- Write `evidence/<feature>/improvements.md` with mobile/tablet notes after looking at those screenshots.

## Driving conventions

- Start every recipe from the baseline (fresh load at `$VERIFY_URL`) unless its preconditions say otherwise.
- Prefer ARIA names, `data-wa` values, and the ids in the skill over coordinates or tab order.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Browser actions go through the Cursor browser MCP. Shell actions go through the helpers in `.cursor/skills/verify-monte-tabor/helpers/`.
- Restore nothing: the page is static. Cleanup stops the server this run started and must leave proof artifacts in place.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot plus screenshots on phone-portrait and tablet-portrait with `Funeraria Monte Tabor` visible.
- Layout proof includes `assert-viewport.py` exit 0 for all three required devices and an `improvements.md`.
- WhatsApp proof is `hrefs.json` plus `assert-wa-hrefs.py` exit 0, not a visit to WhatsApp.
- Record the feature ID and entry point used with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with Cursor browser` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Responsive layout](./responsive-layout.md) is the phone/tablet gate: overflow, `hand`/`lap`/`desk` bands, plan cards, and improvement notes. Run it on every UI change.
- [Landing identity](./landing-identity.md) covers company, period, hero heading annotation, and benefit pills.
- [WhatsApp CTAs](./whatsapp-ctas.md) covers the five attributed WhatsApp destinations.
- [Social footer](./social-footer.md) covers the `Nuestras redes` icon row (TikTok, Facebook, Instagram, WhatsApp) and the mailto line.
- [Plans table](./plans-table.md) covers Económico, Jardín, and Presidencial plan cards.
- [Floating WhatsApp](./floating-whatsapp.md) covers the button that appears only when masthead and contact cards are off screen.
- [Address and affiliations](./address.md) covers the San Salvador address Maps link and membership lines.
