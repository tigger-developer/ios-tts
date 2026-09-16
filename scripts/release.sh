#!/usr/bin/env bash
# ABOUTME: Publishes one version-bumped GitHub release of the three plugin files.
# ABOUTME: Signing stays with the Attest release workflow that publication triggers.
# Supports stock macOS Bash 3.2; releasing needs no package manager.
set -eo pipefail
project_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
release_branch=master
dry_run=0
case "$#:${1-}" in
1:-h | 1:--help)
  cat "$project_root/docs/release-help.md"
  exit 0
  ;;
1:--version)
  printf '1\n'
  exit 0
  ;;
1:--dry-run)
  dry_run=1
  ;;
0:) ;;
*)
  printf 'Unexpected arguments; use --help.\n' >&2
  exit 2
  ;;
esac
fail() {
  printf 'Release failed: %s\n' "$1" >&2
  exit 1
}
for tool in git jq gh trash; do
  command -v "$tool" >/dev/null || fail "Releasing requires $tool."
done
cd -- "$project_root"
branch=$(git rev-parse --abbrev-ref HEAD)
[[ $branch == "$release_branch" ]] ||
  fail "Releases are published from $release_branch; the current branch is $branch."
[[ -z $(git status --porcelain) ]] ||
  fail 'The working tree has uncommitted changes. Commit or set them aside so the release matches the published files.'
git fetch --quiet origin "$release_branch"
[[ $(git rev-parse HEAD) == $(git rev-parse "origin/$release_branch") ]] ||
  fail "Local $release_branch differs from origin/$release_branch. Pull or push first so the release tag matches the published branch."
semver='^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$'
if [[ -n ${VERSION-} ]]; then
  if [[ ! $VERSION =~ $semver ]]; then
    printf 'VERSION must be an x.y.z version, not: %s\n' "$VERSION" >&2
    exit 2
  fi
  version=$VERSION
else
  current=$(jq -er '.version' manifest.json)
  [[ $current =~ $semver ]] ||
    fail "The manifest version must be an x.y.z version, not: $current"
  version=$(jq -nr --arg version "$current" \
    '$version | split(".") | .[2] = ((.[2] | tonumber) + 1 | tostring) | join(".")')
fi
if git rev-parse --verify --quiet "refs/tags/$version" >/dev/null ||
  [[ -n $(git ls-remote --tags origin "refs/tags/$version") ]]; then
  fail "Tag $version already exists; choose another VERSION."
fi
name=$(jq -er '.name' manifest.json)
if ((dry_run)); then
  printf 'Dry run: would release %s %s from %s\n' "$name" "$version" "$release_branch"
  printf 'Dry run: would attach main.js, manifest.json and styles.css\n'
  exit 0
fi
# The temporary files stay beside their targets so each replacement is a rename.
versioned_manifest=$(mktemp "$project_root/.manifest.XXXXXX.json")
versioned_source=$(mktemp "$project_root/.main.XXXXXX.js")
cleanup() {
  for scratch in "$versioned_manifest" "$versioned_source"; do
    if [[ -e $scratch ]]; then trash -- "$scratch"; fi
  done
}
trap cleanup EXIT INT TERM
jq --arg version "$version" '.version = $version' manifest.json >"$versioned_manifest"
jq -R -s -j --arg name "$name" --arg version "$version" \
  'split("\n") | .[2] = ("// " + $name + " " + $version) | join("\n")' \
  main.js >"$versioned_source"
mv -- "$versioned_manifest" manifest.json
mv -- "$versioned_source" main.js
git add manifest.json main.js
git commit -m "chore: release $version"
git tag -a "$version" -m "$name $version"
git push --atomic origin "HEAD:refs/heads/$release_branch" "refs/tags/$version"
gh release create "$version" main.js manifest.json styles.css \
  --verify-tag --title "$name $version" --generate-notes
printf 'Released %s. The Attest release workflow signs the three attached files.\n' "$version"
