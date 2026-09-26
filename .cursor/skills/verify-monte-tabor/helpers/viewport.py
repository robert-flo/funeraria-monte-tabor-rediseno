#!/usr/bin/env python3
"""Print CDP params or list required viewports.

Usage:
  helpers/viewport.py list
  helpers/viewport.py cdp phone-portrait
  helpers/viewport.py required
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

DATA = json.loads((Path(__file__).with_name("viewports.json")).read_text(encoding="utf-8"))


def device(name: str) -> dict:
    devices = DATA["devices"]
    if name not in devices:
        known = ", ".join(devices)
        raise SystemExit(f"unknown viewport {name!r}; known: {known}")
    return devices[name]


def cdp_metrics(name: str) -> dict:
    spec = device(name)
    return {
        "width": spec["width"],
        "height": spec["height"],
        "deviceScaleFactor": spec["deviceScaleFactor"],
        "mobile": spec["mobile"],
    }


def main() -> int:
    if len(sys.argv) < 2 or sys.argv[1] in {"-h", "--help"}:
        sys.stderr.write(__doc__.strip() + "\n")
        return 2
    cmd = sys.argv[1]
    if cmd == "list":
        for name, spec in DATA["devices"].items():
            flag = "required" if name in DATA["required"] else "optional"
            sys.stdout.write(
                f"{name}\t{spec['width']}x{spec['height']}\t{spec['cssBucket']}\t{flag}\t{spec['label']}\n"
            )
        return 0
    if cmd == "required":
        json.dump(DATA["required"], sys.stdout)
        sys.stdout.write("\n")
        return 0
    if cmd == "cdp":
        if len(sys.argv) != 3:
            sys.stderr.write("usage: viewport.py cdp <device-id>\n")
            return 2
        json.dump(cdp_metrics(sys.argv[2]), sys.stdout)
        sys.stdout.write("\n")
        return 0
    sys.stderr.write(f"unknown command {cmd!r}\n")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
