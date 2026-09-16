# Full Document Reader

**Full Document Reader** brings Apple's native text-to-speech to complete
Obsidian notes on **iPhone and Mac**. Obsidian's preview is optimized to load
the visible portion of a note, so Accessibility Reader normally has access to
only part of the document. This plugin provides a dedicated preview that makes
the entire note available to Accessibility Reader, ready to read aloud.

No speech service account or API key is needed.

Requires **Obsidian 1.13+** and **iOS 26+ or macOS 26+**.

## How to use

1. Install and enable **Full Document Reader** from its
   [Obsidian Community listing](https://community.obsidian.md/plugins/ios-tts).
2. Open the plugin's settings and follow the instructions to enable Apple's
   **Accessibility Reader** and configure its shortcut. This setup is needed once.
3. Open a note. Tap the **book and sound waves icon** in the note toolbar, or
   choose **Open full document reader** from the command palette or ribbon.
4. Invoke Accessibility Reader and press **Play**. On iPhone, use the configured
   accessibility shortcut; on Mac, use **Command-Escape**, or the customized shortcut.

The reader is a snapshot: reopen it after editing the note. Notes are never
changed. The default limit is **100,000 words**, adjustable in plugin settings.
Notes over the limit show a notice instead of opening a shortened copy. Larger
notes, images and embeds can use substantial memory.

[Shortcut setup and further help](docs/reader-help.md) ·
[Manual installation](docs/readme-history.md#install-and-use) ·
[Development and provenance](docs/readme-history.md#develop-outside-the-vault)

Licensed under [Apache License 2.0](LICENSE).
