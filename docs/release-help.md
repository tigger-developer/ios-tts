# Release help

`make release` runs `make lint` and `make test`, then `scripts/release.sh`,
which publishes one GitHub release of the three installation files from the
`master` branch:

1. Increment the manifest's patch version, or use `VERSION` when supplied.
2. Update the version comment in `main.js` to match.
3. Commit both files as `chore: release <version>`.
4. Create an annotated tag and push the commit and tag atomically.
5. Create the GitHub release with `main.js`, `manifest.json` and `styles.css`
   attached, using generated notes.

Signing is not performed here. Publishing the release triggers the **Attest
release** workflow, which compares the attached files with the tagged source
and attests them.

The release refuses to run when a required tool is missing, the current branch
is not `master`, the working tree has uncommitted changes, the local branch
differs from `origin/master`, or the computed tag already exists locally or on
the remote.

Options:

- `--help`, `-h`: display this help.
- `--version`: display the release script version.
- `--dry-run`: report the version that would be released and the files that
  would be attached, without changing the repository or the remote.

Variables:

- `VERSION=x.y.z`: release that exact version instead of the next patch.

Requires `git`, `jq`, `trash` and an authenticated `gh`.

If the push succeeds but release creation fails, the commit and tag are already
published. Create the release for the existing tag rather than tagging again:

```sh
gh release create <version> main.js manifest.json styles.css --verify-tag
```
