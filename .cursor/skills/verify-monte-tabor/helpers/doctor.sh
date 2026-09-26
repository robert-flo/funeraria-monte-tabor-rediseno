#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "$0")" && pwd)/common.sh"
load_state

fail() {
  echo "verify-monte-tabor doctor: FAIL: $*" >&2
  exit 1
}

pid_alive "$VERIFY_PID" || fail "pid $VERIFY_PID is not running"
owner="$(port_owner_pid "$VERIFY_PORT" || true)"
[[ "$owner" == "$VERIFY_PID" ]] || fail "port $VERIFY_PORT is owned by ${owner:-nobody}, expected pid $VERIFY_PID"

body="$(mktemp)"
trap 'rm -f "$body"' EXIT
status="$(curl -sS -o "$body" -w '%{http_code}' --max-time 3 "$VERIFY_URL")"
[[ "$status" == "200" ]] || fail "GET $VERIFY_URL returned HTTP $status"

grep -q "$EXPECTED_TITLE" "$body" || fail "page title $EXPECTED_TITLE not found"
grep -q 'data-wa="hero"' "$body" || fail "hero WhatsApp CTA missing"
grep -q 'data-wa="plans"' "$body" || fail "plans WhatsApp CTA missing"
grep -q 'data-wa="close"' "$body" || fail "close WhatsApp CTA missing"
grep -q 'data-wa="social"' "$body" || fail "social WhatsApp CTA missing"
grep -q 'id="wa-float"' "$body" || fail "floating WhatsApp button missing"
grep -q 'tiktok.com/@Funeraria.monte.tabor' "$body" || fail "TikTok profile href missing"
grep -q 'facebook.com/funeraria.monte.tabor.2025' "$body" || fail "Facebook profile href missing"
grep -q 'instagram.com/funeraria.montetabor' "$body" || fail "Instagram profile href missing"
grep -q 'mailto:funeralesmontetabor@gmail.com' "$body" || fail "email mailto href missing"
grep -q 'src="js/design-system.js"' "$body" || fail "design-system.js is not linked"

js_status="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 3 "${VERIFY_URL}js/design-system.js")"
[[ "$js_status" == "200" ]] || fail "GET js/design-system.js returned HTTP $js_status"
js_body="$(curl -fsS --max-time 3 "${VERIFY_URL}js/design-system.js")"
[[ "$js_body" == *"WA_NUMBER = \"$WA_NUMBER\""* ]] || fail "served JS does not contain WA_NUMBER $WA_NUMBER"

logo_status="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 3 "${VERIFY_URL}assets/dove-logo.png")"
[[ "$logo_status" == "200" ]] || fail "GET assets/dove-logo.png returned HTTP $logo_status"

echo "verify-monte-tabor doctor: OK"
echo "VERIFY_URL=$VERIFY_URL"
echo "VERIFY_PID=$VERIFY_PID"
echo "VERIFY_PORT=$VERIFY_PORT"
echo "VERIFY_REPO=$VERIFY_REPO"
echo "TITLE=$EXPECTED_TITLE"
