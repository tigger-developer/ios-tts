# Full Document View for iOS TTS: product vision

Last updated: 2026-09-16

**Purpose:** make complete Obsidian notes available to Apple's native
Accessibility Reader on iOS and macOS, without a paid speech service.

## Why this plugin exists

Obsidian's preview is optimized to load the visible portion of a note.
Accessibility Reader can access that loaded content. A full-document preview
makes the entire note available for native Text-to-Speech (TTS).

Apple devices include native speech through
[Accessibility Reader on iPhone](https://support.apple.com/guide/iphone/read-listen-text-apps-accessibility-reader-iph406a46ab8/26/ios/26)
and [Accessibility Reader on Mac](https://support.apple.com/en-ca/guide/mac-help/mchl799f6fb9/mac).
The plugin provides access to this capability without a speech API key or usage
charge. Downloaded voices support offline listening.

Some cloud TTS plugins require API keys and charge for generated speech, including
[Aloud](https://github.com/adrianlyjak/obsidian-aloud-tts).
Native alternatives also exist, including
[Text to Speech](https://github.com/joethei/obsidian-tts).

## Intended experience

- **Whole-note reading:** a toolbar button, ribbon button or command opens the
  complete current Markdown note as a read-only snapshot using Obsidian rendering.
  Each note toolbar opens the note belonging to that pane.
- **Native speech:** Accessibility Reader supplies voices, playback and
  accessibility controls. Speech starts through Apple's controls or Autoplay.
- **Clear setup:** bundled settings help explains iPhone and Mac shortcuts,
  benefits and limitations. The help remains available offline.
- **Explicit size limit:** the default is **100,000 words**, adjustable in
  settings. A note over the limit is refused with guidance to raise it.
  A shortened document must never be presented as complete.

## Boundaries

- **Source preservation:** opening or closing a snapshot does not change the note.
- **Privacy:** the plugin adds no service that receives note content, telemetry,
  account requirement or speech API integration.
- **Supported platforms:** Obsidian 1.13+, iOS 26+ and macOS 26+.
- **System setup:** accessibility shortcuts are configured in Apple settings.
  The plugin does not change system settings or start speech itself.
- **Finite resources:** raising the word limit can slow rendering or exhaust
  memory. The approximate count includes Markdown source and properties;
  it does not bound the size of images or embeds.
- **Scope:** no speech engine, audio export, EPUB/PDF conversion, image-text
  extraction or live updating of an open snapshot. Embeds and third-party
  rendering retain Obsidian's usual behaviour, including remote resource access.

The [reader specification](../specs/003-full-document-reader/spec.org) defines
the behaviour. The [setup guide](reader-help.md) contains the instructions bundled
with the plugin. Release and submission details belong to
[Marketplace prep](../specs/004-marketplace-prep/spec.org) and
[release documentation](releases/automation.md).
