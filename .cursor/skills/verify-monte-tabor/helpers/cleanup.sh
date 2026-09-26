#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "$0")" && pwd)/common.sh"

if [[ ! -f "$STATE_FILE" ]]; then
  echo "verify-monte-tabor cleanup: nothing to stop (no $STATE_FILE)"
  exit 0
fi

# shellcheck disable=SC1090
source "$STATE_FILE"

if [[ -n "${VERIFY_PID:-}" ]] && pid_alive "$VERIFY_PID"; then
  kill "$VERIFY_PID" 2>/dev/null || true
  for _ in $(seq 1 30); do
    pid_alive "$VERIFY_PID" || break
    sleep 0.1
  done
  if pid_alive "$VERIFY_PID"; then
    echo "verify-monte-tabor cleanup: pid $VERIFY_PID did not exit after SIGTERM; sending SIGKILL" >&2
    kill -9 "$VERIFY_PID" 2>/dev/null || true
    wait "$VERIFY_PID" 2>/dev/null || true
  fi
  echo "verify-monte-tabor cleanup: stopped pid $VERIFY_PID"
else
  echo "verify-monte-tabor cleanup: pid ${VERIFY_PID:-unknown} already stopped"
fi

rm -rf "$RUN_DIR"
echo "verify-monte-tabor cleanup: removed $RUN_DIR"
echo "evidence left at $EVIDENCE_DIR"
