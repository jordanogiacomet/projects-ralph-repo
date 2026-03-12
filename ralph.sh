#!/bin/bash
# Ralph Visual Loop
# Usage: ./ralph.sh [--tool amp|claude|codex] [max_iterations]

set -euo pipefail

TOOL="codex"
MAX_ITERATIONS=8

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

if [[ "$TOOL" != "amp" && "$TOOL" != "claude" && "$TOOL" != "codex" ]]; then
  echo "Error: Invalid tool '$TOOL'. Must be 'amp', 'claude', or 'codex'."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
REGISTER_FILE="$SCRIPT_DIR/docs/visual-register.md"
PROMPT_FILE="$SCRIPT_DIR/prompt.md"
CODEX_PROMPT_FILE="$SCRIPT_DIR/CODEX.md"
CLAUDE_PROMPT_FILE="$SCRIPT_DIR/prompt.md"
ARCHIVE_DIR="$SCRIPT_DIR/archive-visual"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-visual-branch"

if [[ ! -f "$PRD_FILE" ]]; then
  echo "Error: missing $PRD_FILE"
  exit 1
fi

if [[ ! -f "$PROGRESS_FILE" ]]; then
  echo "Error: missing $PROGRESS_FILE"
  exit 1
fi

if [[ ! -f "$REGISTER_FILE" ]]; then
  echo "Error: missing $REGISTER_FILE"
  exit 1
fi

resolve_prompt_file() {
  case "$TOOL" in
    amp)
      echo "$PROMPT_FILE"
      ;;
    claude)
      echo "$CLAUDE_PROMPT_FILE"
      ;;
    codex)
      echo "$CODEX_PROMPT_FILE"
      ;;
  esac
}

SELECTED_PROMPT_FILE="$(resolve_prompt_file)"

if [[ ! -f "$SELECTED_PROMPT_FILE" ]]; then
  echo "Error: missing prompt file $SELECTED_PROMPT_FILE"
  exit 1
fi

if [[ -f "$LAST_BRANCH_FILE" ]]; then
  CURRENT_BRANCH="$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")"
  LAST_BRANCH="$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")"

  if [[ -n "$CURRENT_BRANCH" && -n "$LAST_BRANCH" && "$CURRENT_BRANCH" != "$LAST_BRANCH" ]]; then
    DATE="$(date +%Y-%m-%d)"
    FOLDER_NAME="$(echo "$LAST_BRANCH" | sed 's|^codex/||; s|^ralph/||')"
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"

    echo "Archiving previous visual run: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    cp "$PRD_FILE" "$ARCHIVE_FOLDER/" || true
    cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/" || true
    cp "$REGISTER_FILE" "$ARCHIVE_FOLDER/" || true
    echo "Archived to: $ARCHIVE_FOLDER"
  fi
fi

CURRENT_BRANCH="$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")"
if [[ -n "$CURRENT_BRANCH" ]]; then
  echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
fi

run_amp() {
  cat "$SELECTED_PROMPT_FILE" | amp --dangerously-allow-all
}

run_claude() {
  claude --dangerously-skip-permissions --print < "$SELECTED_PROMPT_FILE"
}

run_codex() {
  local output_file="$SCRIPT_DIR/.codex-visual-last-message.txt"
  rm -f "$output_file"

  npx -y @openai/codex@latest exec \
    --model gpt-5.4 \
    --config 'model_reasoning_effort="xhigh"' \
    --sandbox danger-full-access \
    --json \
    --output-last-message "$output_file" \
    - < "$SELECTED_PROMPT_FILE"

  if [[ -f "$output_file" ]]; then
    cat "$output_file"
  fi
}

echo "Starting Ralph Visual - Tool: $TOOL - Max iterations: $MAX_ITERATIONS"
echo "PRD: $PRD_FILE"
echo "Progress: $PROGRESS_FILE"
echo "Register: $REGISTER_FILE"
echo "Prompt: $SELECTED_PROMPT_FILE"

if [[ "$TOOL" == "codex" ]]; then
  echo "Codex forced model: gpt-5.4"
  echo "Codex forced reasoning: xhigh"
  echo "Codex sandbox: danger-full-access"
  echo "Codex approval: never"
fi

for i in $(seq 1 "$MAX_ITERATIONS"); do
  echo ""
  echo "==============================================================="
  echo "  Ralph Visual Iteration $i of $MAX_ITERATIONS ($TOOL)"
  echo "==============================================================="

  if [[ "$TOOL" == "amp" ]]; then
    OUTPUT="$(run_amp 2>&1 | tee /dev/stderr)" || true
  elif [[ "$TOOL" == "claude" ]]; then
    OUTPUT="$(run_claude 2>&1 | tee /dev/stderr)" || true
  else
    OUTPUT="$(run_codex 2>&1 | tee /dev/stderr)" || true
  fi

  if echo "$OUTPUT" | grep -q "^COMPLETE$"; then
    echo ""
    echo "Ralph Visual completed all tasks!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi

  echo "Iteration $i complete. Continuing..."
  sleep 2
done

echo ""
echo "Ralph Visual reached max iterations ($MAX_ITERATIONS) without completing all tasks."
echo "Check $PROGRESS_FILE and $REGISTER_FILE for status."
exit 1