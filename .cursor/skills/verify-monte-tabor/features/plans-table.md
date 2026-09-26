# Plans board

Three prepaid funeral-plan cards — Económico, Jardín, and Presidencial — show monthly per-collaborator prices, a featured Jardín tab, a coffin photograph with caption Tipo de ataúd plus the model name, shared benefits, and an IVA footnote.

## Sub-features

- `plans-heading` names the section.
- `plans-columns` shows the three plan prices and the Jardín featured tab.
- `plans-rows` shows a coffin photograph with caption plus included-service ticks.
- `plans-note` states that prices include IVA.
- `plans-fit` keeps all three cards on screen. There is no swipe hint.

## How to get to it (user POV)

- Scroll to `Planes Adaptables a las Necesidades de tu Empresa` on `/`.
- On a phone, read the three cards top to bottom. On a tablet, read the three prices in one row.

## Driving it with Cursor browser

Preconditions:

- Doctor is OK at `$VERIFY_URL`.
- Drive phone-portrait (`hand`), tablet-portrait (`lap`), and phone-landscape (`lap`, short) first. Desk-band proof (`tablet-landscape` or `desktop`) is additional, not a substitute.

- **Open section.** Load `/` and scroll to the plans heading. Run `browser_navigate` to `$VERIFY_URL`, lock, then `browser_scroll` until the heading `Planes Adaptables a las Necesidades de tu Empresa` is in view (or `browser_cdp` `Runtime.evaluate` `document.querySelector(".plans h2").scrollIntoView()`). Snapshot contains that heading.
- **Cards.** Read plan names and prices. Snapshot (or evaluate `Array.from(document.querySelectorAll(".plan-board .plan-name, .plan-board .plan-price")).map(n => n.textContent.trim())`) is `Económico`, `$5.00`, `Jardín`, `$10.00`, `Presidencial`, `$20.00`. The Jardín card has text `El más solicitado`.
- **Differentiator.** Each card shows a coffin photograph (`.plan-photo`) with caption `Tipo de ataúd` plus the model name (`Económico`, `Jardín`, `Presidencial`). Coffin type lives in that caption, not in a fact row. On `lap` the three photographs share one top and the first tick rows share one top; the Jardín tab must not push either row down.
- **Included services.** Confirm ticks. Rows `Capilla en sala o a domicilio`, `Preparación química 24 horas`, `Traslados en territorio nacional`, `Café, pan, azúcar y servilletas`, `Dos arreglos florales`, and `Foto conmemorativa 8 × 11` each expose accessible text `Incluido` in every plan (`.visually-hidden`).
- **IVA.** Read the footnote. Snapshot contains `Todos los precios incluyen IVA.`
- **No swipe hint.** After `Emulation.setDeviceMetricsOverride` from `helpers/viewport.py cdp phone-portrait`, reload, then evaluate `document.querySelector(".table-hint")`. The value is `null`. Repeat on `tablet-portrait`. Hint must not be required on any band.
- **Proof.** Save snapshot plus `phone-portrait-table.png` and `tablet-portrait-table.png`. Probe JSON and `assert-viewport.py` for both required devices. Write `improvements.md` about card scan if a benefit row is hard to compare. Desktop-only `viewport.png` is not enough.

## Gotchas

- There is no `.ledger` table and no `.table-wrap`. A screenshot that clips Presidencial is incomplete proof of `plans-columns`.
- Horizontal overflow of a plan card is a fail. Cards shrink with `minmax(0, 1fr)`.
- Ticks are CSS triangles with visually-hidden `Incluido`. Assert that accessible text, not pixel-matching the triangle.
- Reset device metrics after a mobile drive so the next feature does not inherit a phone viewport.
