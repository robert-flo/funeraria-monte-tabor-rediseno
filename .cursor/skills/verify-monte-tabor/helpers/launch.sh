#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "$0")" && pwd)/common.sh"

if [[ ! -f "$REPO_ROOT/index.html" ]]; then
  echo "verify-monte-tabor: index.html missing at $REPO_ROOT" >&2
  exit 1
fi

mkdir -p "$RUN_DIR"

if [[ -f "$STATE_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$STATE_FILE"
  if [[ -n "${VERIFY_PID:-}" ]] && pid_alive "$VERIFY_PID"; then
    echo "verify-monte-tabor: refusing to start a second instance on $STATE_FILE" >&2
    echo "already running pid=$VERIFY_PID url=${VERIFY_URL:-unknown}" >&2
    echo "set VERIFY_RUN_DIR to a new directory (and VERIFY_PORT) for a parallel run" >&2
    exit 1
  fi
  rm -f "$STATE_FILE"
fi

if [[ -z "${VERIFY_PORT:-}" ]]; then
  VERIFY_PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
fi

existing_owner="$(port_owner_pid "$VERIFY_PORT" || true)"
if [[ -n "$existing_owner" ]]; then
  echo "verify-monte-tabor: port $VERIFY_PORT is already owned by pid $existing_owner" >&2
  exit 1
fi

python3 -m http.server --bind 127.0.0.1 --directory "$REPO_ROOT" "$VERIFY_PORT" \
  >"$LOG_FILE" 2>&1 &
VERIFY_PID=$!

cleanup_failed_start() {
  if pid_alive "$VERIFY_PID"; then
    kill "$VERIFY_PID" 2>/dev/null || true
    wait "$VERIFY_PID" 2>/dev/null || true
  fi
  rm -f "$STATE_FILE"
}

VERIFY_URL="http://127.0.0.1:${VERIFY_PORT}/"
ready=0
for _ in $(seq 1 50); do
  if ! pid_alive "$VERIFY_PID"; then
    echo "verify-monte-tabor: server exited during startup; log:" >&2
    cat "$LOG_FILE" >&2 || true
    cleanup_failed_start
    exit 1
  fi
  if curl -fsS --max-time 1 "$VERIFY_URL" >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 0.1
done

if [[ "$ready" -ne 1 ]]; then
  echo "verify-monte-tabor: server did not answer on $VERIFY_URL" >&2
  cat "$LOG_FILE" >&2 || true
  cleanup_failed_start
  exit 1
fi

owner="$(port_owner_pid "$VERIFY_PORT" || true)"
if [[ "$owner" != "$VERIFY_PID" ]]; then
  echo "verify-monte-tabor: pid $VERIFY_PID started but port $VERIFY_PORT is owned by ${owner:-nobody}" >&2
  cleanup_failed_start
  exit 1
fi

cat >"$STATE_FILE" <<EOF
VERIFY_PID=$VERIFY_PID
VERIFY_PORT=$VERIFY_PORT
VERIFY_URL=$VERIFY_URL
VERIFY_REPO=$REPO_ROOT
VERIFY_STARTED_AT=$(date -Iseconds)
EOF

echo "VERIFY_URL=$VERIFY_URL"
echo "VERIFY_PID=$VERIFY_PID"
echo "STATE_FILE=$STATE_FILE"
echo "EVIDENCE_DIR=$EVIDENCE_DIR"
