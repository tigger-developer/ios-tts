#!/usr/bin/env bash
# ABOUTME: Runs reader logic tests with the JavaScript engine supplied by macOS.
# ABOUTME: Concatenates explicit trusted files and adds no runtime to the plugin.
# Supports stock macOS Bash 3.2; no package manager is required.
set -eo pipefail
project_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
cd -- "$project_root"
case "$#:${1-}" in
1:-h | 1:--help)
  cat docs/test-help.md
  exit 0
  ;;
1:--version)
  printf '1\n'
  exit 0
  ;;
esac
if (($#)); then
  printf 'Unexpected arguments; use --help.\n' >&2
  exit 2
fi
cat tests/setup.js main.js tests/reader-session.test.js tests/reader-settings.test.js tests/run.js |
  osascript -l JavaScript
