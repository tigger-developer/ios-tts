# Read complete notes with native speech

Some cloud text-to-speech plugins need API keys and charge for speech generation;
long documents and repeated conversions can make those costs add up. iPhone and
Mac already include native text-to-speech without a speech API key or usage bill.

Obsidian's preview loads only part of a long document, leaving Accessibility
Reader without access to the whole note. This can make listening beyond a page
or two awkward or unusable. Full Document Reader presents the complete note in
a read-only view for Apple's Accessibility Reader.

## Set up an iPhone shortcut

Requires iOS 26 or later.

1. In the iPhone Settings app, open **Accessibility**, then **Read & Speak**.
   Open **Accessibility Reader** and enable it. Leave Autoplay off to start
   playback manually.
2. Return to **Accessibility** and open **Accessibility Shortcut**. Select
   **Accessibility Reader**.
3. In Obsidian, open a note and use **Open full document reader**. Triple-click
   the **side button**, also called the lock button. On an iPhone with a Home
   button, triple-click that instead. If a shortcut menu appears, choose
   Accessibility Reader, then press **Play**.

[Apple's reader guide](https://support.apple.com/guide/iphone/read-listen-text-apps-accessibility-reader-iph406a46ab8/26/ios/26)
and [shortcut guide](https://support.apple.com/en-euro/guide/iphone/iph3e2e31a5/26/ios/26)
provide the platform instructions.

**Alternative: double-tap the back of the phone.** After selecting Accessibility
Reader above, open **Settings > Accessibility > Touch > Back Tap**. Set
**Double Tap** to **Accessibility Shortcut**. With the full document reader open,
tap the back of the phone twice; choose Accessibility Reader if a menu appears,
then press Play. This uses the same configured accessibility shortcut.
[Apple's Back Tap guide](https://support.apple.com/en-us/111772).

## Set up a Mac shortcut

Requires macOS 26 or later. In **System Settings > Accessibility > Read & Speak**,
enable **Accessibility Reader**. Open the note with **Open full document reader**,
then press **Command-Escape**, or the customized shortcut, and press Play.
Voice and playback options belong to macOS.
[Apple's Mac reader guide](https://support.apple.com/en-ca/guide/mac-help/mchl799f6fb9/mac).

## Word limit and limitations

- **Maximum words** defaults to **100,000**. Enter a positive whole number and
  press **Save** to change it. The saved limit applies when the reader next opens.
- **No silent cut-off:** a note exceeding the limit does not open. Increase the
  setting to try the whole note; the plugin never substitutes a shortened copy.
- **Approximate count:** the whole Markdown source is counted, including
  properties. Images and embeds can consume memory independently of word count.
  Higher limits can make the device slow or run out of memory.
- **Native controls:** Apple handles speech, voices and playback. The plugin
  provides no audio export or alternative speech engine and does not configure
  Apple settings. It requires Obsidian 1.13+ on the platforms above.
- **Snapshot only:** reopen after editing. Notes remain unchanged. The plugin
  stores only the word-limit preference, never the note or generated audio.
- **Normal rendering:** links and embeds follow Obsidian's usual behaviour.
  There is no EPUB/PDF conversion or image-text extraction. Reading local text
  needs no plugin network service; remote embeds may still need a connection.
