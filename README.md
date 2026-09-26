# Funeraria Monte Tabor

Landing de planes empresariales 2026. Una sola página, sin build, con todos los
llamados a la acción apuntando a WhatsApp.

Sitio en vivo (dominio propio, apex):
https://funeraria-monte-tabor.me/

GitHub Pages sirve esa URL desde `master` (`CNAME` = `funeraria-monte-tabor.me`).
La ruta antigua de project pages
`https://robert-flo.github.io/funeraria-monte-tabor/` redirige al apex; no es la
URL canónica.

`http://www.funeraria-monte-tabor.me/` ya redirige al apex. **HTTPS en www**
sigue sin certificado de GitHub Pages: el registro actual es
`www CNAME funeraria-monte-tabor.me`. GitHub no emite el cert de www con ese
destino. En el registrar (Namecheap / `dns1.registrar-servers.com`), cambiar
solo esto — no hace falta tocar los A del apex:

| Host | Type | Value |
| --- | --- | --- |
| `www` | CNAME | `robert-flo.github.io.` |

Después de propagar, Pages debería emitir un certificado que cubra
`www.funeraria-monte-tabor.me` y redirigir HTTPS www → apex.

## Estructura

- `index.html` — la página completa, con su CSS en línea. Modo claro y oscuro.
- `js/design-system.js` — anotaciones, enlaces de WhatsApp y botón flotante.
- `js/experience.js` — tema, aparición al desplazar, parallax ligero y contadores.
- `fonts/` — Archivo y Archivo Narrow, subconjunto latino, servidas desde el
  mismo dominio para no depender de Google Fonts.
- `assets/` — logo, favicon de 32 px e imagen para compartir en redes.
- `robots.txt` / `sitemap.xml` — rastreo del landing en el apex.

## Atribución de contactos

Cada llamado a la acción abre WhatsApp con un mensaje distinto ya escrito, así
que el primer mensaje del cliente indica desde qué parte de la página escribió:
hero, planes, cierre o botón flotante.

## Analítica

La página usa [GoatCounter](https://www.goatcounter.com/): sin cookies, sin VPS
y compatible con GitHub Pages. Crea un sitio gratis con el código
`funeraria-monte-tabor` para ver visitas y clics a WhatsApp
(`whatsapp-hero`, `whatsapp-plans`, `whatsapp-close`, `whatsapp-float`).
