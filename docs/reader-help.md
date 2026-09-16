# Read complete notes with native speech

Some cloud text-to-speech plugins need API keys and charge for speech generation;
long documents and repeated conversions can make those costs add up. iPhone and
Mac already include native text-to-speech without a speech API key or usage bill.

Obsidian's preview loads only part of a long document, leaving Accessibility
Reader without access to the whole note. This can make listening beyond a page
or two awkward or unusable. Full Document View for iOS TTS presents the complete note in
a read-only view for Apple's Accessibility Reader.

## Set up an iPhone shortcut

Requires iOS 26 or later.

1. Open **Settings > Accessibility > Read & Speak > Accessibility Reader**.
2. Turn on **Accessibility Reader**. Turn on **Autoplay in Accessibility Reader**
   if speech should start as soon as the reader opens. Leave Autoplay off to
   start speech manually with **Play**.
3. Return to **Settings > Accessibility > Accessibility Shortcut** and select
   **Accessibility Reader**. A tick beside it confirms the selection.
4. The shortcut is a **triple-click of the side button** (the lock button), or
   the **Home button** on an iPhone that has one. If several accessibility
   shortcuts are selected, choose **Accessibility Reader** from the menu.

**Optional Back Tap shortcut:** after selecting Accessibility Reader above,
open **Settings > Accessibility > Touch > Back Tap** and set **Double Tap** to
**Accessibility Shortcut**. Double-tap the back of the phone to invoke it.

[Apple's iPhone reader guide](https://support.apple.com/guide/iphone/read-listen-text-apps-accessibility-reader-iph406a46ab8/26/ios/26),
[Accessibility Shortcut guide](https://support.apple.com/en-euro/guide/iphone/iph3e2e31a5/26/ios/26)
and [Back Tap guide](https://support.apple.com/en-us/111772).

## Set up a Mac shortcut

Requires macOS 26 or later.

1. Open **System Settings > Accessibility > Read & Speak**.
2. Turn on **Accessibility Reader**.
3. **Choose the voice:** click the **info button beside System voice** to browse
   and preview voices. Try one of the **Siri** voices for a more natural reading
   voice, where available. Download it if prompted, then select it in
   **System voice**. Finish any download while connected to the internet before
   using it offline.
4. **Check the shortcut:** **Command-Escape** is the default. The separate
   **info button beside Accessibility Reader** opens its options, including
   the keyboard shortcut if a different key combination is preferred.

[Apple's Mac reader guide](https://support.apple.com/en-ca/guide/mac-help/mchl799f6fb9/mac)
and [voice selection guide](https://support.apple.com/en-au/guide/mac-help/mchlp2290/mac).

## Listen to a note

1. Open the note in Obsidian.
2. Tap or click the **book and sound waves icon** beside the note's normal
   edit/preview controls. This opens the full-document preview. The ribbon
   button and **Open full document reader** command do the same thing.
3. Invoke Apple's Accessibility Reader: **triple-click the side/Home button**
   on iPhone, use the configured **Back Tap**, or press **Command-Escape**
   (or the customized shortcut) on Mac.
4. Speech starts automatically if Autoplay is enabled. Otherwise, press
   **Play** in Accessibility Reader. Its controls manage the voice and playback.

These instructions are bundled with the plugin and remain available offline.
[Open the illustrated setup guide](https://github.com/tigger-developer/ios-tts#how-to-use)
for screenshots; that link needs an internet connection.

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
