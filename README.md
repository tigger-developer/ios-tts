# Project Vision

Obsidian plugin.

Present the document in its entirety with no truncation (as the obsidien previewer does) in order that the iOS reader view accessibility shortcut can be invoked to read the doc via native ios tts.

The supported-platform intent was expanded to **macOS and iOS** on 2026-09-07.
The plugin remains a complete-document presentation for native accessibility
reading; the operating system owns speech.

The proposed lean definition is
[W003 - Full document reader for macOS and iOS](specs/003-full-document-reader/spec.org).
The settings-help and word-limit amendment awaits definition audit and operator
sign-off. No plugin is implemented yet.

The [product vision](docs/VISION.md) describes the purpose, limits and proposed
Community directory listing. The [settings-panel help](docs/reader-help.md)
contains the user instructions to be bundled with the plugin.

## Planned benefits and limitations

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

These are proposed release claims, not evidence of an available plugin.
