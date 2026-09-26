# Social footer

The last block on the paper sheet is `Nuestras redes`, a centered row of rounded-square icons for TikTok, Facebook, Instagram, and WhatsApp, plus a `mailto` line for `funeralesmontetabor@gmail.com`.

## Sub-features

- `social-heading` is the `h2#nuestras-redes` `Nuestras redes` in `footer.site-foot`. The icon list uses `aria-labelledby="nuestras-redes"`.
- `social-tiktok` is the first icon, a profile link to `https://www.tiktok.com/@Funeraria.monte.tabor`.
- `social-facebook` is the second icon, a profile link to `https://www.facebook.com/funeraria.monte.tabor.2025/`.
- `social-instagram` is the third icon, a profile link to `https://www.instagram.com/funeraria.montetabor/`.
- `social-whatsapp` is the fourth icon (`data-wa="social"`), proven with the other WhatsApp sources in [WhatsApp CTAs](./whatsapp-ctas.md).
- `social-email` is the visible `mailto:funeralesmontetabor@gmail.com` line under the icons.

## How to get to it (user POV)

- Scroll to the bottom of `/` after `Siguiente paso`. The heading is `Nuestras redes`.
- Choose TikTok, Facebook, or Instagram to open that profile in a new tab.
- Choose the WhatsApp icon to open a chat whose first message names the social footer.
- Choose `funeralesmontetabor@gmail.com` to open a mail draft.

## Driving it with Cursor browser

Preconditions:

- Doctor is OK at `$VERIFY_URL`.
- JS has run (`span.annotation` exists).
- Do not click any footer link.

- **Scroll to the sheet foot.** Navigate to `$VERIFY_URL`. Run `browser_navigate` then lock. Evaluate `document.querySelector(".sheet-inner > footer.site-foot") === document.querySelector(".sheet-inner").lastElementChild`. It is true. Snapshot includes heading `Nuestras redes`.
- **Order and names.** Dump the four `.social-link` nodes and `.site-mail`. Run `browser_cdp` `Runtime.evaluate` with `returnByValue` true and expression `JSON.stringify({ icons: Array.from(document.querySelectorAll(".social-link")).map(function (a) { return { href: a.getAttribute("href"), aria: a.getAttribute("aria-label"), social: a.getAttribute("data-social"), wa: a.getAttribute("data-wa") }; }), mail: { href: document.querySelector(".site-mail").getAttribute("href"), text: document.querySelector(".site-mail").textContent.trim() } })`. Icon order is TikTok, Facebook, Instagram, WhatsApp. `.site-mail` href is `mailto:funeralesmontetabor@gmail.com` and the visible text is that address. Do not click.
- **Live WhatsApp href.** After JS, the social icon `href` matches the `social` row from `helpers/expected-wa-urls.py`. Reuse a `[data-wa]` dump plus `helpers/assert-wa-hrefs.py` when you also prove WhatsApp CTAs. Do not click.
- **Phone portrait.** Set `phone-portrait` (`390×844`) with `helpers/viewport.py cdp phone-portrait`. Screenshot `footer.site-foot` as `evidence/social-footer/phone-portrait.png`. Probe overflow. `pageOverflowX` is false. The four icons stay inside the sheet (they wrap if needed). `#wa-float` does not cover the last icon once it is visible.
- **Tablet portrait.** Set `tablet-portrait` (`768×1024`). Screenshot `evidence/social-footer/tablet-portrait.png`. The row stays centered on paper (`--paper`), with `--ink` fills, not black circles on gray.
- **Proof.** Save `browser_snapshot` to `evidence/social-footer/snapshot.aria.yml`. Write the href dump to `evidence/social-footer/hrefs.json`. Record feature id `social-footer`, entry point `scroll to Nuestras redes`, and viewports in `evidence/social-footer/proof.txt`. Write `improvements.md`.

## Gotchas

- Clicking a profile, WhatsApp icon, or the mailto line leaves the landing and may ping GoatCounter (`social-tiktok`, `social-facebook`, `social-instagram`, `social-email`, `whatsapp-social`). Href inspection is the proof.
- The WhatsApp icon tracks `whatsapp-social` via `data-wa`. It must not also carry `data-social`.
- `#wa-float` is `position: fixed` at the bottom-right. On `hand` (`max-width: 40rem`) `.site-foot` needs extra bottom padding so the last icons stay tappable.
- The footer is inside `.sheet-inner`. A dark band on `body` is a regression.
- Doctor greps the three profile host paths and `data-wa="social"`. It does not execute JS, so the WhatsApp query string is still proven with `assert-wa-hrefs.py`.
