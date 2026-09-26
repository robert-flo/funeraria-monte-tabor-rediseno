#!/usr/bin/env python3
"""Assert a viewport-probe dump against helpers/viewports.json.

Usage:
  helpers/assert-viewport.py phone-portrait evidence/responsive-layout/phone-portrait.json
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = json.loads((ROOT / "viewports.json").read_text(encoding="utf-8"))


def fail(msg: str) -> int:
    sys.stderr.write(f"assert-viewport: FAIL: {msg}\n")
    return 1


def hint_absent(dump: dict, name: str) -> str | None:
    hint = dump.get("tableHintDisplay")
    if hint not in (None, "none"):
        return f"{name} expected no .table-hint (null or display:none), got {hint!r}"
    return None


def plans_on_screen(dump: dict, name: str, width: int) -> str | None:
    rights = dump.get("planRights") or []
    featured = dump.get("featuredRight")
    for i, right in enumerate(rights):
        if right > width + 1:
            return f"{name} plan {i} right {right} exceeds innerWidth {width}"
    if featured is not None and featured > width + 1:
        return f"{name} featured plan right {featured} exceeds innerWidth {width}"
    return None


def main() -> int:
    if len(sys.argv) != 3:
        sys.stderr.write("usage: assert-viewport.py <device-id> <probe.json>\n")
        return 2
    name = sys.argv[1]
    path = Path(sys.argv[2])
    spec = DATA["devices"].get(name)
    if spec is None:
        return fail(f"unknown device {name!r}")
    if not path.is_file():
        return fail(f"missing {path}")
    dump = json.loads(path.read_text(encoding="utf-8"))
    width = dump.get("innerWidth")
    if width != spec["width"]:
        return fail(f"{name} innerWidth {width} != {spec['width']}")
    if dump.get("pageOverflowX") is True:
        return fail(
            f"{name} page overflows horizontally "
            f"(scrollWidth={dump.get('scrollWidth')} clientWidth={dump.get('clientWidth')})"
        )
    company = dump.get("company") or ""
    if "Funeraria Monte Tabor" not in company:
        return fail(f"{name} company text missing: {company!r}")

    plan_count = dump.get("planCount")
    if plan_count != 3:
        return fail(f"{name} expected 3 plan articles, got {plan_count!r}")

    err = hint_absent(dump, name)
    if err:
        return fail(err)
    err = plans_on_screen(dump, name, spec["width"])
    if err:
        return fail(err)

    bucket = spec["cssBucket"]
    hero_cols = dump.get("heroColumns")
    plan_cols = dump.get("planBoardColumns")
    if bucket == "hand":
        if hero_cols != 1:
            return fail(f"{name} expected stacked hero (1 column), got {hero_cols}")
        if plan_cols != 1:
            return fail(f"{name} expected 1 plan-board column, got {plan_cols}")
        if dump.get("opSinceDisplay") != "none":
            return fail(
                f"{name} expected .op-since display:none, got {dump.get('opSinceDisplay')!r}"
            )
        if dump.get("opBandWraps") is True or dump.get("opBandSingleRow") is not True:
            return fail(
                f"{name} expected navy ops phrases on one unwrapped row, "
                f"got singleRow={dump.get('opBandSingleRow')!r} wraps={dump.get('opBandWraps')!r} "
                f"phrases={dump.get('opPhrases')!r}"
            )
    elif bucket == "lap":
        if hero_cols != 2:
            return fail(f"{name} expected two-column hero, got {hero_cols}")
        if plan_cols != 3:
            return fail(f"{name} expected 3 plan-board columns, got {plan_cols}")
        cta_w = dump.get("heroCtaWidth") or 0
        if cta_w > spec["width"] / 2:
            return fail(
                f"{name} expected side-card hero CTA "
                f"(width <= {spec['width'] / 2:.0f}), got {cta_w}"
            )
        heights = dump.get("planHeadHeights") or []
        if len(heights) == 3 and max(heights) - min(heights) > 1:
            return fail(
                f"{name} expected equal plan-head heights, got {heights}"
            )
        fact_tops = dump.get("planFactTops") or []
        if len(fact_tops) == 3 and max(fact_tops) - min(fact_tops) > 1:
            return fail(
                f"{name} expected first tick row aligned, got tops {fact_tops}"
            )
        photo_tops = dump.get("planPhotoTops") or []
        if len(photo_tops) == 3 and max(photo_tops) - min(photo_tops) > 1:
            return fail(
                f"{name} expected plan-photo rows aligned, got tops {photo_tops}"
            )
    elif bucket == "desk":
        if hero_cols != 2:
            return fail(f"{name} expected two-column hero, got {hero_cols}")
        if plan_cols != 3:
            return fail(f"{name} expected 3 plan-board columns, got {plan_cols}")
    else:
        return fail(f"{name} unknown cssBucket {bucket!r}")

    if spec.get("heroCtaOnFirstScreen") or bucket == "hand":
        cta_bottom = dump.get("heroCtaBottom")
        if cta_bottom is None or cta_bottom > spec["height"]:
            return fail(
                f"{name} expected hero CTA on first screen "
                f"(bottom <= {spec['height']}), got {cta_bottom!r}"
            )

    sys.stdout.write(f"assert-viewport: OK {name} {spec['width']}x{spec['height']} {bucket}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
