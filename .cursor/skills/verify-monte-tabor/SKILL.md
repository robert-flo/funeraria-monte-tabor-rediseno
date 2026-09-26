---
name: verify-monte-tabor
description: Drive the Funeraria Monte Tabor static landing in a local browser, always on phone and tablet viewports, to prove layout and WhatsApp CTAs and to propose mobile UX improvements. Use when verifying UI, CSS, copy, or design-system.js changes.
---

# Verify Funeraria Monte Tabor

Static one-page landing. No build, no auth, no database. Every sales CTA is a WhatsApp link whose prefilled first message names the section the visitor came from. `js/design-system.js` writes those hrefs and reveals the floating button.

**Surface:** web UI (`index.html` + inline CSS + `js/design-system.js`). Production GitHub Pages (`https://funeraria-monte-tabor.me/`) and GoatCounter are out of band — never drive them for proof.

**Harness:** Cursor browser MCP (`browser_navigate`, `browser_lock`, `browser_snapshot`, `browser_take_screenshot`, `browser_scroll`, `browser_cdp`). There is no Playwright, Cypress, or CLI.

Read `features/README.md` before driving. The map is the source of which entry points exist; proving one convenient path does not cover the others.

## Mobile-first gate (non-negotiable)

Most visitors will see this page on a phone. A run that only used the default desktop tab is **not a verification**.

Every UI/CSS/copy proof must, in the same run:

1. Drive **phone-portrait** (`390×844`), **tablet-portrait** (`768×1024`), and **phone-landscape** (`844×390`) from `helpers/viewports.json`. Those three are required. Also drive tablet-landscape and desktop when the change can reflow (layout, type, table, CTA, header).
2. Fail if the **page** scrolls horizontally (`pageOverflowX`). Plan cards must fit the sheet. Do not treat a missing `.table-hint` as a failure.
3. Capture a screenshot of the affected section at each required viewport, not a single desktop frame.
4. Write `evidence/<feature>/improvements.md`: concrete, prioritized mobile/tablet suggestions (even on a pass). A UI proof without that file is incomplete.

Layout bands are `hand` (`max-width: 40rem`), `lap` (`40rem`–`63.99rem`), and `desk` (`min-width: 64rem`). Tablet portrait (`768px`) is `lap`: two-column hero, three plan cards. Do not treat an iPad as a large phone.

If `browser_take_screenshot` times out (common at `deviceScaleFactor` 2), use `browser_cdp` `Page.captureScreenshot` with `{ "format": "png", "captureBeyondViewport": false }` and write the returned PNG into `evidence/`. Prefer `deviceScaleFactor` 1 while capturing. Trust `viewport-probe.js` for overflow; device-emulation screenshots in this harness can look tiled even when `pageOverflowX` is false.

How to set a viewport (after the tab is locked):

```bash
.cursor/skills/verify-monte-tabor/helpers/viewport.py cdp phone-portrait
```

Pass that JSON as `browser_cdp` method `Emulation.setDeviceMetricsOverride`. For `mobile: true` devices also send `Emulation.setTouchEmulationEnabled` with `{ "enabled": true }`. Reload `$VERIFY_URL`, wait for `span.annotation`, then probe. Clear with `Emulation.clearDeviceMetricsOverride` before the next device (or set the next override directly).

Probe: evaluate the IIFE in `helpers/viewport-probe.js` via `Runtime.evaluate` (`returnByValue: true`). Save JSON to `evidence/<feature>/<device-id>.json` and run:

```bash
.cursor/skills/verify-monte-tabor/helpers/assert-viewport.py phone-portrait evidence/<feature>/phone-portrait.json
.cursor/skills/verify-monte-tabor/helpers/assert-viewport.py tablet-portrait evidence/<feature>/tablet-portrait.json
.cursor/skills/verify-monte-tabor/helpers/assert-viewport.py phone-landscape evidence/<feature>/phone-landscape.json
```

All three required devices must exit 0 for a layout pass. On `hand`, the navy ops band must stay one unwrapped row. On `lap` (including tablet portrait), plan-head heights, `.plan-photo` rows, and the first tick row must align. Phone-landscape is `lap` but short: hero CTA bottom must still be at most `390`.

## Launch

From the repo root:

```bash
.cursor/skills/verify-monte-tabor/helpers/launch.sh
```

This binds `python3 -m http.server` to `127.0.0.1` on a free port, serving `$REPO_ROOT` so `/` is `index.html`. Ready when `GET $VERIFY_URL` returns 200. The script prints `VERIFY_URL`, `VERIFY_PID`, and `STATE_FILE`.

Optional env:

- `VERIFY_PORT` — pin the port instead of picking a free one.
- `VERIFY_RUN_DIR` — state directory for a parallel instance (must also pick a free `VERIFY_PORT`).
- `VERIFY_EVIDENCE_DIR` — override the evidence root (default `.cursor/skills/verify-monte-tabor/evidence`).

Ready signal: launch exits 0 and doctor (below) prints `OK`. The server log is `$VERIFY_RUN_DIR/server.log`.

If `STATE_FILE` already names a live pid, launch **refuses**. Do not reuse a server you did not start. Do not kill by process name (`python`, `http.server`). Two instances may run side by side only with distinct `VERIFY_RUN_DIR` and ports.

Teardown: `helpers/cleanup.sh` (see Cleanup).

## Doctor

Run this first whenever anything looks off:

```bash
.cursor/skills/verify-monte-tabor/helpers/doctor.sh
```

Pass means: the pid in `STATE_FILE` is alive, that pid owns `VERIFY_PORT`, `GET $VERIFY_URL` is 200, the HTML title is `Funeraria Monte Tabor — Plan empresarial 2026`, the five WhatsApp handles exist (`data-wa="hero"|"plans"|"close"|"social"` and `#wa-float`), the three profile hrefs exist (TikTok `@Funeraria.monte.tabor`, Facebook `funeraria.monte.tabor.2025`, Instagram `funeraria.montetabor`), the footer mailto is `funeralesmontetabor@gmail.com`, and `js/design-system.js` plus `assets/dove-logo.png` both 200. Fail means this instance is not worth driving — launch again rather than pointing the browser at some other origin.

Doctor does not load GoatCounter, does not execute JavaScript, and does not prove layout. JS-backed and viewport proof happen in Drive.

## Drive

1. `helpers/doctor.sh` must be OK.
2. List browser tabs. If a tab already exists, `browser_lock` with `action: "lock"` before touching it. Otherwise `browser_navigate` to `$VERIFY_URL`, then lock.
3. Apply the first **required** viewport (`phone-portrait`) before judging layout. Wait until `document.readyState === "complete"` and `document.querySelector(".annotation")` exists (the hero `h1[data-annotate]` is rewritten on `DOMContentLoaded`). Poll with `browser_cdp` `Runtime.evaluate`, `returnByValue: true`. Do not treat the raw HTML `[colaboradores]` as the live heading.
4. Drive with snapshots and accessible names, not coordinates. Stable handles:

| User control | Handle |
| --- | --- |
| Company name | text `Funeraria Monte Tabor` in `.company` |
| Hero heading | `h1` with a child `span.annotation` whose text is `[colaboradores]` |
| Hero WhatsApp | `a[data-wa="hero"]`, aria-label `Escríbenos por WhatsApp al 7465-7567` |
| Plans WhatsApp | `a[data-wa="plans"]`, aria-label `Cotiza el plan de tu empresa por WhatsApp al 7465-7567` |
| Close WhatsApp | `a[data-wa="close"]` (contact section) |
| Floating WhatsApp | `a#wa-float[data-wa="float"]` |
| Social footer | `footer.site-foot` with four `.social-link` items (TikTok, Facebook, Instagram, WhatsApp `data-wa="social"`) |
| Plans board | `.plan-board` with three `.plan` articles: Económico `$5.00`, Jardín `$10.00` (featured), Presidencial `$20.00` |
| Address | `a.meta-place` to Google Maps for `17 Av. Norte y 3.ª Calle Poniente # 237, San Salvador` |

5. **Do not click WhatsApp, social profile, or Maps links.** A click leaves the landing, may open WhatsApp, and fires GoatCounter `sendBeacon` (`whatsapp-hero`, `whatsapp-plans`, `whatsapp-close`, `whatsapp-float`, `whatsapp-social`, plus `social-tiktok` / `social-facebook` / `social-instagram` on the profile icons). Proof of a CTA is the live `href` after JS, compared with `helpers/assert-wa-hrefs.py`.
6. Dump live hrefs with `browser_cdp` `Runtime.evaluate` (expression below), write the JSON to `evidence/<feature>/hrefs.json`, then run the assert helper.

```javascript
JSON.stringify(Array.from(document.querySelectorAll("[data-wa]")).map(function (a) {
  return { source: a.getAttribute("data-wa"), href: a.href, aria: a.getAttribute("aria-label") };
}))
```

Expected hrefs (also printed by `helpers/expected-wa-urls.py --json`):

| `data-wa` | Prefilled first message |
| --- | --- |
| `hero` | Hola, vengo de la página web y quiero información sobre los planes empresariales. |
| `plans` | Hola, vi los planes en la página web y quiero una cotización para mi empresa. |
| `close` | Hola, vengo de la página web y quiero agendar una reunión para conocer los planes empresariales. |
| `float` | Hola, vengo de la página web y quiero hablar con un asesor. |
| `social` | Hola, vengo de las redes en la página web y quiero información sobre los planes empresariales. |

Number is always `50374657567` (`wa.me/50374657567?text=…`). The visible phone is `7465-7567`.

7. Repeat the layout-sensitive steps on **tablet-portrait**. Then write `improvements.md` (see Evidence).
8. Unlock the tab (`browser_lock` `action: "unlock"`) when the drive is finished.

`window.DesignSystem.waUrl` exists for debugging. Do not treat calling it as user-path proof — assert the rendered `a[data-wa]` hrefs.

## Evidence

Root: `.cursor/skills/verify-monte-tabor/evidence/<feature-id>/`

Required for a pass:

- Feature id, entry point, and **viewport ids** recorded in `proof.txt`.
- ARIA snapshot (`browser_snapshot`) saved as `snapshot.aria.yml` (phone-portrait unless the feature says otherwise).
- Screenshots of the affected section on **phone-portrait** and **tablet-portrait** (`phone-portrait.png`, `tablet-portrait.png`). Capture the action state, not only a cropped final frame. Desktop-only `viewport.png` is not enough.
- Viewport probes `phone-portrait.json`, `tablet-portrait.json`, and `phone-landscape.json` plus `assert-viewport.py` exit 0 on all three.
- `improvements.md`: at least one specific observation per required viewport (layout, type, tap target, table, CTA, or overflow). If nothing is broken, say what was checked and one optional enhancement. Do not invent issues; do not stay silent.
- For WhatsApp: `hrefs.json` plus `helpers/assert-wa-hrefs.py evidence/<feature>/hrefs.json` exit 0.
- For the float: a before screenshot (hidden at top) and an after screenshot (revealed after scroll) **on phone-portrait**. See `features/floating-whatsapp.md`.

Standards:

- Exercise the real page at `$VERIFY_URL`, not GitHub Pages, not `file://`, not `DesignSystem.waUrl()` in isolation.
- Do not click through to `wa.me` or Google Maps.
- GoatCounter (`gc.zgo.at`, `funeraria-monte-tabor.goatcounter.com`) is a production boundary. A missing analytics ping is not a failure. Do not require a live count as proof.
- Mocks are not used. If the page is opened with JS disabled, annotations and WhatsApp query strings will be wrong — that is a failed drive, not an alternate mode.
- Looking at a desktop screenshot and imagining mobile is not proof.

## Cleanup

```bash
.cursor/skills/verify-monte-tabor/helpers/cleanup.sh
```

Sends SIGTERM (then SIGKILL if needed) **only** to `VERIFY_PID` from `STATE_FILE`, then deletes `$VERIFY_RUN_DIR`. It never deletes `evidence/`. After cleanup, confirm the proof files are still in `evidence/<feature>/`.

Failed iterations must also run cleanup so ports and pids do not strand.

## Helpers

All paths are from the repo root. Scripts are executable.

| Command | What it does |
| --- | --- |
| `.cursor/skills/verify-monte-tabor/helpers/launch.sh` | Start the isolated static server; print `VERIFY_URL`. |
| `.cursor/skills/verify-monte-tabor/helpers/doctor.sh` | Read-only: pid, port owner, HTTP 200, title, CTA marks, JS and logo. |
| `.cursor/skills/verify-monte-tabor/helpers/cleanup.sh` | Stop that pid; remove `run/`; keep `evidence/`. |
| `.cursor/skills/verify-monte-tabor/helpers/viewport.py list` | Print the device matrix (required vs optional). |
| `.cursor/skills/verify-monte-tabor/helpers/viewport.py cdp <id>` | Print `Emulation.setDeviceMetricsOverride` params. |
| `.cursor/skills/verify-monte-tabor/helpers/assert-viewport.py <id> <probe.json>` | Exit 0 iff width, overflow, hero/plan columns, first-screen CTA on `hand` and phone-landscape, unwrapped ops on `hand`, aligned plan heads on `lap`, and absent hint match. |
| `.cursor/skills/verify-monte-tabor/helpers/expected-wa-urls.py` | Print the five contract hrefs (`--json` for JSON). |
| `.cursor/skills/verify-monte-tabor/helpers/assert-wa-hrefs.py <hrefs.json>` | Exit 0 iff the dump matches the contract. |

`helpers/viewport-probe.js` is the exact `Runtime.evaluate` expression for layout probes. `helpers/viewports.json` is the device source of truth.
