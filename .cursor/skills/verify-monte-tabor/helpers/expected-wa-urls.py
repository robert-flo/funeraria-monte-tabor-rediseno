#!/usr/bin/env python3
"""Print the five WhatsApp hrefs the landing must attach after design-system.js runs.

Usage:
  helpers/expected-wa-urls.py
  helpers/expected-wa-urls.py --json
"""
from __future__ import annotations

import json
import sys
from urllib.parse import quote

WA_NUMBER = "50374657567"
WA_MESSAGES = {
    "hero": "Hola, vengo de la página web y quiero información sobre los planes empresariales.",
    "plans": "Hola, vi los planes en la página web y quiero una cotización para mi empresa.",
    "close": "Hola, vengo de la página web y quiero agendar una reunión para conocer los planes empresariales.",
    "float": "Hola, vengo de la página web y quiero hablar con un asesor.",
    "social": "Hola, vengo de las redes en la página web y quiero información sobre los planes empresariales.",
}


def encode_uri_component(text: str) -> str:
    # Match JS encodeURIComponent: unescaped A-Z a-z 0-9 - _ . ! ~ * ' ( )
    return quote(text, safe="-_.!~*'()", encoding="utf-8")


def wa_url(source: str) -> str:
    text = WA_MESSAGES[source]
    return f"https://wa.me/{WA_NUMBER}?text={encode_uri_component(text)}"


def main() -> int:
    rows = [
        {"source": source, "href": wa_url(source), "text": text}
        for source, text in WA_MESSAGES.items()
    ]
    if "--json" in sys.argv:
        json.dump(rows, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")
        return 0
    for row in rows:
        sys.stdout.write(f"{row['source']}\t{row['href']}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
