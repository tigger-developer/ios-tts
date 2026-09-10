# Full Document Reader

Open the whole current Markdown note for Apple's Accessibility Reader on
**macOS and iOS**. Apple supplies speech; the plugin supplies a complete,
read-only snapshot.

**Development build:** the operator has reported a passing macOS test. Detailed
long-note evidence and the physical-iPhone test remain pending. No release has
been published.

## Install and use

Requires **Obsidian 1.13+**, **macOS 26+** or **iOS 26+**.

1. Disable this plugin before replacing its files. Put **main.js**,
   **manifest.json** and **styles.css** in your vault's
   `.obsidian/plugins/ios-tts/` directory, then enable Full Document Reader in
   Obsidian's Community plugins settings. Use the same three files on iOS.
2. In the plugin settings panel, follow the bundled Apple shortcut instructions.
   iPhone supports triple-clicking the side/lock button, or double-tap Back Tap
   assigned to Accessibility Shortcut. On Mac, use Command-Escape after setup.
3. Open a note, choose **Open full document reader** from the ribbon or command
   palette, invoke **Accessibility Reader**, then press **Play**.

The [settings help](docs/reader-help.md) includes Apple's setup links, the
Home-button alternative and the menu shown when several shortcuts are selected.
Help is bundled, so it remains readable offline.

**Maximum words** defaults to **100,000**. Save a positive whole number to use
on the next invocation. Notes over the limit are refused with a notice, never
shortened. Reopen the reader after editing; an open snapshot does not update.

## Develop outside the vault

Use **Node 24 LTS (24.12 or later)** and npm. This candidate was built with
Node 24.20.0 and npm 11.19.0; direct development dependencies are pinned in
`package.json`, with transitive versions in `package-lock.json`.

```sh
npm ci --ignore-scripts
```

```sh
make build
```

The build writes `main.js` beside the tracked manifest and stylesheet. You can
symlink this checkout as the vault's `ios-tts` plugin directory yourself.
`data.json`, build output and development dependencies are ignored by Git.

For a separate installation, run:

```sh
make install
```

The installer asks for the **Obsidian vault root**, such
as `/Users/yourname/notes`, then install to `.obsidian/plugins/ios-tts/` within
it. The vault must already contain `.obsidian/`; missing plugin directories
are created. Enter the absolute path (spaces need no escaping), or use
`~/notes`. Blank input or Ctrl-C cancels. Keep the plugin disabled while installing.

The existing non-interactive route remains available for an **existing,
absolute plugin directory**:

```sh
make install PLUGIN_DIR=/absolute/path/to/vault/.obsidian/plugins/ios-tts
```

Installation builds first, validates all three targets, preserves unrelated
files (including settings), and leaves identical destination files untouched.
The explicit `PLUGIN_DIR` route allows a destination directory symlink; a
symlink back to this checkout needs no copy. The vault-root prompt refuses
symlinked configuration/plugin directories so the synced installation contains
real files. Existing links are never replaced automatically. Symlinks or
directories at individual artefact paths are refused.
Copies are not transactional: after an I/O failure, keep the plugin disabled
and retry before enabling it. The command never changes the enabled-plugin list.

- `make lint`: TypeScript, ESLint, CSS and formatting checks.
- `make test`: the two focused regression files using Node's test runner.
- `make vulncheck`: one non-mutating npm dependency audit; requires network.
- `make sync`: stage all changes, commit if needed, pull, then push. Supply
  `COMMIT_MESSAGE` to replace its default message.

The [validation record](specs/003-full-document-reader/validation.org) separates
automated evidence from the pending native-platform checks. Remove the testing
symlink or installed artefacts after disabling the plugin to uninstall it.
The saved limit may remain; no note migration or restoration is needed.

## Original project brief

The original brief is retained below as project history.

Obsidian plugin.

Present the document in its entirety with no truncation (as the obsidien previewer does) in order that the iOS reader view accessibility shortcut can be invoked to read the doc via native ios tts.

The supported-platform intent was expanded to **macOS and iOS** on 2026-09-07.
The plugin remains a complete-document presentation for native accessibility
reading; the operating system owns speech.

The approved lean definition is
[W003 - Full document reader for macOS and iOS](specs/003-full-document-reader/spec.org).
Taḋg approved implementation on 2026-09-08. The
[audit record](specs/003-full-document-reader/audits.yaml) owns current audit
evidence; [earlier reviews](specs/003-full-document-reader/audits.org) retain
historical evidence. The [validation record](specs/003-full-document-reader/validation.org)
records executed checks and the remaining [native tests](docs/native-testing.md).

The [product vision](docs/VISION.md) describes the purpose, limits and proposed
Community directory listing. The [settings-panel help](docs/reader-help.md)
contains the user instructions bundled with the plugin.

## Benefits and limitations for the proposed listing

- **Native reading:** present the whole note for Apple's Accessibility Reader,
  with no speech API key or usage charge. Some cloud TTS plugins charge for
  generation; native alternatives also exist.
- **Long notes:** a configurable **100,000-word default limit**, with an explicit
  notice for notes over the limit and no silent truncation.
- **Supported platforms:** Obsidian 1.13+, iOS 26+ and macOS 26+. Full-document
  native reading remains unverified until the platform tests pass.
- **Setup and resources:** configure an Apple accessibility shortcut first.
  Increasing the limit may make rendering slow or exhaust memory; images and
  embeds are not bounded by the word count.
- **Focused purpose:** read-only snapshots using normal Markdown rendering;
  no speech engine, audio export or EPUB/PDF conversion. Apple owns playback.

These are proposed release claims. The development build is available locally;
publication requires native-platform evidence and a separate release review.
