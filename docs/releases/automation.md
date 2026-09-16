# Automatic releases

Each push to `master` publishes one release, starting with **1.0.0**, then
**1.0.1**, **1.0.2**, and so on. Several commits in one push form one release.
Feature branches and pull requests do not publish releases.

The **Release and attest** workflow uses the latest `master` when its job starts.
It updates the manifest and source version comment, commits the metadata and
pushes an annotated version tag. It publishes only `main.js`, `manifest.json`
and `styles.css`, then invokes **Attest release** to compare and attest those
files. Licence text remains in the repository and inside `main.js`.

GitHub's workflow token prevents its own version-bump push from starting another
release. Release jobs queue instead of cancelling an active publication, up to
GitHub's limit of 100 waiting runs. A competing push that prevents a fast-forward
fails visibly; the workflow never force-pushes.

## Recovery and verification

Rerun a failed **Release and attest** run to reuse its tagged version. A run-ID
trailer on the metadata commit prevents a second version bump. Existing release
assets are never overwritten. An incomplete draft or mismatched asset requires
manual repair before retrying. The manually dispatched **Attest release**
workflow remains available for a published tag.

The attestation records the workflow's triggering revision as its build entry
point. The generated tag contains the version metadata and the exact distributed
files; verification compares the downloads with that tag before signing.

For each downloaded installation file, verify its provenance with GitHub CLI:

```sh
gh attestation verify main.js --repo tigger-developer/ios-tts --signer-workflow tigger-developer/ios-tts/.github/workflows/attest-release.yml --deny-self-hosted-runners
```

Repeat for `manifest.json` and `styles.css`. The reusable **Attest release**
workflow is the signer for both automatic and manual runs.

The earlier manual-only release process is retained in
[README history](../readme-history.md#release-provenance).
