# Releases and provenance

Releases are published on demand from the `master` branch:

```sh
make release
```

The target runs `make lint` and `make test`, then `scripts/release.sh`. The
script increments the manifest's patch version, updates the matching version
comment in `main.js`, commits both as `chore: release <version>`, creates an
annotated tag, pushes the commit and tag atomically, and creates the GitHub
release with `main.js`, `manifest.json` and `styles.css` attached. Licence text
remains in the repository and inside `main.js`.

`VERSION=x.y.z make release` publishes that exact version instead of the next
patch. `bash scripts/release.sh --dry-run` reports the version and attachments
without changing the repository or the remote. See the
[release help](../release-help.md).

The release stops before changing anything when a required tool is missing, the
current branch is not `master`, the working tree has uncommitted changes, the
local branch differs from `origin/master`, or the computed tag already exists
locally or on the remote. Pushing the commit and tag is atomic, so a competing
push fails visibly rather than being forced.

Pushing to `master` no longer publishes a release. The previous push-triggered
`Release and attest` workflow was removed when `make release` took ownership of
publication; releases 1.0.0 to 1.0.4 were produced by that superseded process.

## Attestation

Publishing a release triggers the **Attest release** workflow. It checks out the
release tag without persisted credentials, confirms the tag exists and that the
manifest version equals it, confirms the release is not a draft and carries
exactly `main.js`, `manifest.json` and `styles.css`, then downloads those assets
and compares each with both the tagged source and its own checkout. Only then
does it create GitHub provenance attestations. It never builds, executes or
modifies release content, and any mismatch stops signing.

The workflow also accepts a manual dispatch with a published `release_tag`, which
attests or re-attests an existing release. Concurrent runs queue rather than
cancel an active signing run.

For each downloaded installation file, verify its provenance with GitHub CLI:

```sh
gh attestation verify main.js --repo tigger-developer/ios-tts --signer-workflow tigger-developer/ios-tts/.github/workflows/attest-release.yml --deny-self-hosted-runners
```

Repeat for `manifest.json` and `styles.css`.

The earlier manual-only release process is retained in
[README history](../readme-history.md#release-provenance).
