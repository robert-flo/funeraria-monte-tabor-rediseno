# Address and affiliations

The masthead band states where the funeral home is and which trade bodies it belongs to, and the street address opens Google Maps in a new tab.

## Sub-features

- `address-line` shows the San Salvador street address as a link.
- `address-landmark` names the neighboring universities.
- `address-affiliations` names Cámara de Comercio e Industria de El Salvador and AFUSAL.

## How to get to it (user POV)

- Read the address block after the hero on `/` (no navigation). The block sits between the hero and the quota section.
- Choose the street-address link to open Maps.

## Driving it with Cursor browser

Preconditions:

- Doctor is OK at `$VERIFY_URL`.
- Do not click the Maps link.

- **Open landing.** Navigate to `$VERIFY_URL`. Run `browser_navigate` and lock. Snapshot includes `17 Av. Norte y 3.ª Calle Poniente # 237, San Salvador`.
- **Landmark.** Read the note under the address. Snapshot includes `Entre Universidad Tecnológica y Universidad Alberto Masferrer`.
- **Maps href.** Inspect `a.meta-place`. Evaluate `document.querySelector("a.meta-place").href`. It is `https://www.google.com/maps/search/?api=1&query=Funeraria%20Monte%20Tabor%2017%20Av.%20Norte%20y%203a%20Calle%20Poniente%20237%20San%20Salvador` (or the same URL with equivalent percent-encoding). `target` is `_blank`.
- **Affiliations.** Read the right-hand (desktop) / following (mobile) paragraph. Snapshot includes `Cámara de Comercio e Industria de El Salvador` and `Asociación de Funerarias Salvadoreñas (AFUSAL)`.
- **Operations band.** Confirm service claims in `.op-band`. On `lap`/`desk` the snapshot includes `Servicio dentro y fuera de San Salvador` and `24 horas, 365 días del año`. On `hand` the visible line is `San Salvador y todo el país` and `24/7/365` (full phrases stay in the DOM for screen readers). `Establecida en 2006` is hidden on `hand` and visible from `lap` up. The `hand` line must not wrap.
- **Proof.** Save snapshot plus phone-portrait and tablet-portrait screenshots of the address block (`phone-portrait.png`, `tablet-portrait.png`). Record the Maps `href` in `evidence/address/maps-href.txt`. Write `improvements.md` if the stacked mobile meta-row is hard to scan.

## Gotchas

- Clicking the address leaves the landing. Href inspection is the proof.
- Encoding of `3.ª` vs `3a` lives in the query, not in the visible text. Assert visible copy from the snapshot and the `href` from the DOM separately.
- On the `hand` band (at most `40rem`), affiliations stack under the address and lose right alignment. Both layouts must still show the same three affiliation/address strings.
