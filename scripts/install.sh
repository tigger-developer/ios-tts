#!/usr/bin/env bash
# ABOUTME: Copies the maintained plugin into an explicitly selected Obsidian vault.
# ABOUTME: Preflights destinations and preserves settings and identical files.
# Supports stock macOS Bash 3.2; installation needs no package manager.
set -eo pipefail
project_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
case "$#:${1-}" in
1:-h | 1:--help)
  cat "$project_root/docs/install-help.md"
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
fail() {
  printf 'Installation failed: %s\n' "$1" >&2
  exit 1
}
trap 'fail "Installation cancelled."' INT TERM
destination=${PLUGIN_DIR-}
create=0
if [[ -z $destination ]]; then
  printf 'Disable Full Document Reader in Obsidian before installing.\nObsidian vault root: '
  IFS= read -r destination || fail 'Installation cancelled; enter a vault root to install.'
  destination="${destination#"${destination%%[![:space:]]*}"}"
  destination="${destination%"${destination##*[![:space:]]}"}"
  case $destination in
  \"*\" | \'*\') destination=${destination:1:${#destination}-2} ;;
  esac
  case $destination in \~/*) destination="$HOME/${destination:2}" ;; esac
  [[ -n $destination ]] || fail 'No vault root supplied.'
  create=1
fi
[[ $destination == /* && -d $destination ]] || fail 'Supply an absolute existing directory.'
destination=$(cd -- "$destination" && pwd -P)
if ((create)); then
  for child in .obsidian plugins ios-tts; do
    destination="$destination/$child"
    [[ ! -L $destination ]] || fail "Symlink refused: $destination. Use real plugin files for syncing."
    [[ ! -e $destination || -d $destination ]] || fail "Not a directory: $destination"
    [[ $child != .obsidian || -d $destination ]] || fail 'The vault must already contain .obsidian/.'
  done
fi
files=(main.js manifest.json styles.css)
changed=()
for name in "${files[@]}"; do
  source="$project_root/$name"
  target="$destination/$name"
  [[ -f $source && -r $source && ! -L $source ]] || fail "Missing or unreadable plugin file: $source"
  [[ ! -L $target && (! -e $target || -f $target) ]] || fail "Target must be absent or a regular file: $target"
  if [[ -e $target ]]; then
    if cmp -s "$source" "$target"; then continue; else comparison=$?; fi
    [[ $comparison == 1 ]] || fail "Could not compare $target; check file permissions."
  fi
  changed+=("$name")
done
if ((create)); then mkdir -p -- "$destination"; fi
for name in "${changed[@]}"; do
  if ! cp -- "$project_root/$name" "$destination/$name"; then
    fail 'Installation may be partial. Keep the plugin disabled and retry before enabling it.'
  fi
done
printf 'Plugin directory: %s\nCopied %s changed files. Enable Full Document Reader in Community plugins settings.\n' "$destination" "${#changed[@]}"
