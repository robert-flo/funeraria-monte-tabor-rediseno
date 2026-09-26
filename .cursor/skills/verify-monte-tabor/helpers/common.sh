HELPERS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$HELPERS_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SKILL_DIR/../../.." && pwd)"
RUN_DIR="${VERIFY_RUN_DIR:-$SKILL_DIR/run}"
STATE_FILE="$RUN_DIR/state.env"
LOG_FILE="$RUN_DIR/server.log"
EVIDENCE_DIR="${VERIFY_EVIDENCE_DIR:-$SKILL_DIR/evidence}"
EXPECTED_TITLE="Funeraria Monte Tabor — Plan empresarial 2026"
WA_NUMBER="50374657567"

load_state() {
  if [[ ! -f "$STATE_FILE" ]]; then
    echo "verify-monte-tabor: no state file at $STATE_FILE (launch first)" >&2
    return 1
  fi
  # shellcheck disable=SC1090
  source "$STATE_FILE"
  if [[ -z "${VERIFY_PID:-}" || -z "${VERIFY_PORT:-}" || -z "${VERIFY_URL:-}" ]]; then
    echo "verify-monte-tabor: state file is incomplete: $STATE_FILE" >&2
    return 1
  fi
}

pid_alive() {
  local pid="$1"
  kill -0 "$pid" 2>/dev/null
}

port_owner_pid() {
  local port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null | awk 'NR==1 { print; exit }'
}
