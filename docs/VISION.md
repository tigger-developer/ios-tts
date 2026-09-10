# Full Document Reader: product vision

Last updated: 2026-09-10

**Purpose:** make complete Obsidian notes available to Apple's native
Accessibility Reader on iOS and macOS, without a paid speech service.
The [current specification](../specs/003-full-document-reader/spec.org) defines
the approved behaviour. The development implementation is available; native-device
validation remains pending in the linked validation record.

## Why this plugin exists

For long documents, Obsidian preview loads only a portion for display.
Accessibility Reader cannot access the unloaded content. The operator reports
that this makes listening to documents longer than a page or two awkward or
unusable; page count is an illustration, not a fixed technical threshold.

Some cloud TTS plugins require provider API keys and charge for generated speech.
Costs can accumulate when long documents are converted repeatedly. For example,
[Aloud documents API-key setup and paid providers](https://github.com/adrianlyjak/obsidian-aloud-tts).
Other plugins use native speech, including
[Text to Speech](https://github.com/joethei/obsidian-tts), so this is not a claim
that every alternative charges money.

Apple devices already include native speech through
[Accessibility Reader on iPhone](https://support.apple.com/guide/iphone/read-listen-text-apps-accessibility-reader-iph406a46ab8/26/ios/26)
and [Accessibility Reader on Mac](https://support.apple.com/en-ca/guide/mac-help/mchl799f6fb9/mac).
Paying for cloud speech should be optional when the device can already read
text aloud without a speech API key or usage bill.

## Intended experience

- **Whole-note reading:** one button or command opens the complete current
  Markdown note as a read-only snapshot using normal Obsidian rendering.
- **Native speech:** the user invokes Accessibility Reader and presses Play.
  Apple owns the voice, playback and accessibility controls.
- **Useful settings:** the plugin's settings panel explains its benefits,
  limitations and shortcut setup, beside one configurable maximum-word field.
- **Explicit size limit:** the default is **100,000 words**, adjustable in
  settings. A note over the chosen limit is refused with guidance to raise it;
  a shortened document must never be presented as complete.

The [settings-panel help](reader-help.md) supplies the maintained user-facing
copy, including triple-clicking the side/lock button and double-tapping the back
of an iPhone. It is bundled with the plugin so reading the help needs no network.

## Benefits and limitations

- **No paid speech service:** no provider account, API key or metered speech
  charge. The plugin adds no service that receives note content.
- **Long-document access:** complete rendering addresses the reported preview
  limitation; it does not alter the source note.
- **Platform dependency:** the proposed support is Obsidian 1.13+, iOS 26+ and
  macOS 26+. Native reading and shortcut behaviour require device verification.
- **Setup required:** accessibility shortcuts are configured in Apple settings.
  The plugin does not change system settings or start speech itself.
- **Finite device resources:** increasing the word limit can slow rendering or
  exhaust memory. The count includes Markdown source, including properties;
  it is approximate and does not bound the size of images or embeds.
- **Deliberately limited:** no speech engine, audio export, EPUB/PDF conversion,
  image-text extraction or live updating of an open snapshot. Existing embeds
  and third-party rendering retain Obsidian's usual behaviour.

## Community-directory listing

**Recommendation:** prepare an Obsidian Community directory listing after the
macOS and physical-iPhone workflow tests establish the advertised behaviour.
Reuse the benefits, limitations and shortcut instructions above in the README
and plugin settings; the listing must not imply paid APIs are the only alternative.

Proposed display name: **Full Document Reader**. Proposed short description:

> Open complete notes for Apple's Accessibility Reader on iOS and macOS, with
> a configurable word limit and no speech API key or usage charges.

The current [submission guide](https://docs.obsidian.md/plugins/releasing/submit-plugin)
uses the Community directory, with an Obsidian account linked to GitHub.
It requires a README, licence, manifest and a GitHub release whose tag matches
the manifest version, with the built plugin attached. The public listing shows
an excerpt of the README, so both benefits and limitations belong there.
The [submission requirements](https://docs.obsidian.md/community-directory/submission-requirements-for-plugins)
require a short description of at most 250 characters, ending with a full stop,
and accurate mobile compatibility.

**Readiness:** the development build now supplies the implementation, manifest
and three local installation artefacts. No licence or published release has
been selected. Before submission, record successful platform tests, choose the
licence and final name, check identifier availability, and prepare the release.
Account linking and submission are operator actions following review of that
concrete release; this change prepares the copy and records the route.

At definition time there was no implementation, manifest or release package;
the local development build is the delivery update to that starting position.

## Definition history

On 2026-09-08, the operator requested settings-panel guidance, a configurable
word limit, this vision document and investigation of marketplace listing.
These replace the earlier draft's README-only help, absence of saved settings
and absence of a plugin word limit. Complete-document presentation remains
the governing requirement.

## Implementation simplification

On 2026-09-10 the operator authorized removing Node, npm and TypeScript under
`BYPASS-GATE-7`. The three installation files are now maintained directly;
installation uses Bash without a build or package manager. Native reading,
settings, saved preferences, platform support and listing scope are unchanged.
The existing logic tests use the JavaScript engine already included with macOS.
