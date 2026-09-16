# Full Document Reader

Open the whole current Markdown note for Apple's Accessibility Reader on
**macOS and iOS**. Apple supplies speech; the plugin supplies a complete,
read-only snapshot.

**Version 0.1.0**, licensed under [Apache License 2.0](LICENSE).
The macOS and iPhone user tests were reported passed and the reader accepted
by Taḋg on 2026-09-16. See the [validation record](specs/003-full-document-reader/validation.org)
for the scope and limits of that operator report.

[Release 0.1.0](https://github.com/tigger-developer/ios-tts/releases/tag/0.1.0)
provides the installation files. Community-directory submission is pending.

## Install and use

Requires **Obsidian 1.13+**, **macOS 26+** or **iOS 26+**.

Download the three installation files from
[release 0.1.0](https://github.com/tigger-developer/ios-tts/releases/tag/0.1.0).
The same maintained files are available in this checkout.

1. Disable this plugin before replacing its files. Put **main.js**,
   **manifest.json** and **styles.css** in your vault's
   `.obsidian/plugins/ios-tts/` directory, then enable Full Document Reader in
   Obsidian's Community plugins settings. Use the same three files on iOS.
2. In the plugin settings panel, follow the bundled Apple shortcut instructions.
   iPhone supports triple-clicking the side/lock button, or double-tap Back Tap
   assigned to Accessibility Shortcut. On Mac, use Command-Escape after setup.
3. Open a note and use the **book and sound waves icon in its top toolbar**, or
   choose **Open full document reader** from the ribbon or command palette. Invoke
   **Accessibility Reader**, then press **Play**.

Once rendering finishes, a hint beneath the reader title shows **⌘Esc** on Mac
(or the customized shortcut), or reminds iOS users to use their accessibility
shortcut. Setup instructions remain in the plugin settings panel.

The reader moves keyboard focus into the rendered document and temporarily
isolates the background workspace. Closing it restores background interaction.
Native macOS and iPhone workflow passes are recorded on the operator's authority.

The [settings help](docs/reader-help.md) includes Apple's setup links, the
Home-button alternative and the menu shown when several shortcuts are selected.
Help is bundled, so it remains readable offline.
Use **Back** at the top of the plugin settings to return to the note.
Back does not save changes; use **Save** to retain a new word limit.

**Maximum words** defaults to **100,000**. Save a positive whole number to use
on the next invocation. Notes over the limit are refused with a notice, never
shortened. Reopen the reader after editing; an open snapshot does not update.

## Develop outside the vault

The plugin is maintained directly as **main.js**, **manifest.json** and
**styles.css**. No Node, npm, TypeScript, compilation or dependency installation
is required. The three files in the checkout are the installation package.
The source artwork is retained in `accessibility-reader.svg` and embedded in
`main.js`; the SVG does not need a separate installation step.

```sh
make install
```

The Bash installer asks for the **Obsidian vault root**, then copies the three
files into `.obsidian/plugins/ios-tts/`. The vault must contain `.obsidian/`;
missing plugin directories are created. Paths may include spaces, matching
quotes or a leading `~/`. Blank input, EOF or Ctrl-C cancels. Keep the plugin
disabled while installing.

Settings and unrelated files are preserved. Identical files keep their
modification times. The prompt refuses symlinked configuration/plugin directories;
existing links are never replaced. After a copy failure, keep the plugin disabled
and retry. See the [installer help](docs/install-help.md).

The existing non-interactive route accepts an absolute existing plugin directory:

```sh
make install PLUGIN_DIR=/absolute/path/to/vault/.obsidian/plugins/ios-tts
```

That route permits an explicitly selected directory symlink. A symlink to this
checkout requires no copying. For iOS, transfer the actual three files through
the existing vault synchronization process, then enable the plugin on the phone.
No clone, compiler or development dependencies are needed on iOS.

- `make test`: the 12 session and word-limit checks, using macOS's built-in
  JavaScript for Automation. See [test help](docs/test-help.md).
- `make lint`: native `oxlint`, `biome`, `shellcheck` and `shfmt` executables.
  These are developer checks, not installation prerequisites.
- `make sync`: stage all changes, commit if needed, pull, then push. Supply
  `COMMIT_MESSAGE` to replace its default message. See [sync help](docs/sync-help.md).

The former `make build` and npm-based `make vulncheck` targets were removed:
there is no compilation step or package-managed dependency graph. This replaces
the previous TypeScript/esbuild development arrangement under the operator's
2026-09-10 `BYPASS-GATE-7` instruction.

The [validation record](specs/003-full-document-reader/validation.org) separates
automated evidence from operator-reported native-platform passes. Remove the testing
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
evidence; [earlier reviews](specs/003-full-document-reader/audits.yaml) retain
historical evidence. The [validation record](specs/003-full-document-reader/validation.org)
records executed checks and operator-reported results for the [native tests](docs/native-testing.md).

The [product vision](docs/VISION.md) describes the purpose, limits and proposed
Community directory listing. The [settings-panel help](docs/reader-help.md)
contains the user instructions bundled with the plugin.

## Benefits and limitations for the proposed listing

- **Native reading:** present the whole note for Apple's Accessibility Reader,
  with no speech API key or usage charge. Some cloud TTS plugins charge for
  generation; native alternatives also exist.
- **Long notes:** a configurable **100,000-word default limit**, with an explicit
  notice for notes over the limit and no silent truncation.
- **Supported platforms:** Obsidian 1.13+, iOS 26+ and macOS 26+. Native workflow passes
  were reported by the operator; device versions and detailed fixture observations
  are not supplied in that report.
- **Setup and resources:** configure an Apple accessibility shortcut first.
  Increasing the limit may make rendering slow or exhaust memory; images and
  embeds are not bounded by the word count.
- **Focused purpose:** read-only snapshots using normal Markdown rendering;
  no speech engine, audio export or EPUB/PDF conversion. Apple owns playback.

The release retains normal Obsidian rendering: remote images or embeds may
access their original services. The plugin adds no network service or telemetry.

Version 0.1.0 release notes are [maintained here](docs/releases/0.1.0.md).
Community-directory submission remains separate from the GitHub release.

### Validation history

Before the 2026-09-16 acceptance, the package was labelled a development package:
an earlier macOS report predated the JavaScript conversion, and the rewritten
package's native smoke test, long-note evidence and physical-iPhone test were
pending. The dated records remain in the validation history; the operator's
current pass declaration supersedes their pending user-test status.
