# Landing identity

The page identifies Funeraria Monte Tabor as a 2026 corporate funeral-plan offer, with a stamped annotation on the word `[colaboradores]` in the hero heading and five benefit pills.

## Sub-features

- `identity-masthead` shows the company name, slogan, and Cámara de Comercio membership.
- `identity-hero` shows the annotated heading and supporting note.
- `identity-pills` lists the five hero benefits.

## How to get to it (user POV)

- Open the landing at `/` (top of the page; no other route exists).

## Driving it with Cursor browser

Preconditions:

- Doctor is OK at `$VERIFY_URL`.
- The tab is on `$VERIFY_URL` and `span.annotation` exists inside the hero `h1`.
- Phone-portrait metrics are applied before the first layout screenshot (`helpers/viewport.py cdp phone-portrait`).

- **Open landing.** Navigate to `$VERIFY_URL`. Run `browser_navigate` to that URL, then `browser_lock` `{ "action": "lock" }`. The document title is `Funeraria Monte Tabor — Plan empresarial 2026`.
- **Masthead.** Read the header. Run `browser_snapshot`. The snapshot includes `Funeraria Monte Tabor`, the slogan `El servicio completo en el momento necesario`, and `Miembro de la Cámara de Comercio e Industria de El Salvador`.
- **Hero annotation.** Inspect the heading. Run `browser_cdp` `Runtime.evaluate` with `expression` `document.querySelector("h1 .annotation").textContent` and `returnByValue` true. The value is `[colaboradores]`. The heading also contains `Planes de protección corporativa para` and no leftover raw `[colaboradores]` outside that span.
- **Pills.** Confirm the hero benefits. The snapshot (or a snapshot scoped to `.pills`) includes `Contratos desde $5`, `$0 de prima`, `3 planes a tu medida`, `Sin intereses ni cargo por mora`, and `IVA incluido`.
- **Proof.** Save `browser_snapshot` to `evidence/landing-identity/snapshot.aria.yml`. Screenshot the hero on phone-portrait and tablet-portrait (`phone-portrait.png`, `tablet-portrait.png`). Probe plus `assert-viewport.py` on both required devices. Write `improvements.md` if type, pills, or the heading annotation wrap badly.

## Gotchas

- `js/design-system.js` is `defer`. A snapshot taken before `DOMContentLoaded` still shows raw `[colaboradores]` with no `.annotation` span — wait, then retry.
- The logo `img.mark` has empty `alt`. Identify the company from `.company` text, not from the image name.
- Production GitHub Pages is a different origin. A matching title there is not proof of this checkout.
