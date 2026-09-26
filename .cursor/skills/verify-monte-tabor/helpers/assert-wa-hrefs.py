#!/usr/bin/env python3
"""Compare a browser dump of [data-wa] links against the WhatsApp contract.

Usage:
  helpers/assert-wa-hrefs.py evidence/whatsapp-ctas/hrefs.json

Input JSON is a list of objects with at least `source` and `href`. Extra keys
(aria-label, className) are ignored. Exit 0 on match, 1 with a diff otherwise.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from importlib.machinery import SourceFileLoader

HELPERS = Path(__file__).resolve().parent
expected_mod = SourceFileLoader(
    "expected_wa_urls", str(HELPERS / "expected-wa-urls.py")
).load_module()


def load_actual(path: Path) -> dict[str, str]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise SystemExit(f"{path}: expected a JSON list of {{source, href}} objects")
    actual: dict[str, str] = {}
    for i, row in enumerate(data):
        if not isinstance(row, dict) or "source" not in row or "href" not in row:
            raise SystemExit(f"{path}: item {i} must have source and href")
        actual[str(row["source"])] = str(row["href"])
    return actual


def main() -> int:
    if len(sys.argv) != 2:
        sys.stderr.write("usage: assert-wa-hrefs.py <hrefs.json>\n")
        return 2
    path = Path(sys.argv[1])
    if not path.is_file():
        sys.stderr.write(f"missing dump: {path}\n")
        return 1
    actual = load_actual(path)
    expected = {source: expected_mod.wa_url(source) for source in expected_mod.WA_MESSAGES}
    missing = [source for source in expected if source not in actual]
    extra = [source for source in actual if source not in expected]
    mismatches = [
        source
        for source in expected
        if source in actual and actual[source] != expected[source]
    ]
    if missing or extra or mismatches:
        sys.stderr.write("WhatsApp href contract failed\n")
        for source in missing:
            sys.stderr.write(f"  missing source: {source}\n")
        for source in extra:
            sys.stderr.write(f"  unexpected source: {source} -> {actual[source]}\n")
        for source in mismatches:
            sys.stderr.write(f"  {source} actual:   {actual[source]}\n")
            sys.stderr.write(f"  {source} expected: {expected[source]}\n")
        return 1
    sys.stdout.write("WhatsApp href contract: OK\n")
    for source in expected:
        sys.stdout.write(f"  {source}: {actual[source]}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
