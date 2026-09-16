#!/usr/bin/env bash
# ABOUTME: Creates a commit checkpoint and synchronizes through Git.
# ABOUTME: Stops on failure and never selects branches or rewrites history.
# Supports stock macOS Bash 3.2.
set -eo pipefail
project_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
case "$#:${1-}" in
1:-h | 1:--help)
  cat "$project_root/docs/sync-help.md"
  exit 0
  ;;
1:--version)
  printf '1\n'
  exit 0
  ;;
0:) ;;
*)
  printf 'Unexpected arguments; use --help.\n' >&2
  exit 2
  ;;
esac
cd -- "$project_root"
git add -A
if git diff --cached --quiet; then
  printf 'No staged changes to commit.\n'
else
  status=$?
  if [[ $status != 1 ]]; then exit "$status"; fi
  git commit -m "${COMMIT_MESSAGE:-chore: sync}"
fi
git pull
git push
