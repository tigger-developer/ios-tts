# Full Document Reader

The purpose of this plugin is to unlock native Apple TTS on obsidian notes. Normally the Accessibility Reader in iOS only sees a portion of the note, as obsidian's preview is optimized to load only the visible portion of the note give or take some caching. This plugin presents a special preview mode that Accessibility Reader can use to read the entire document

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
