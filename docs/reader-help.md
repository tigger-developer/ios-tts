# Read complete notes with native speech

Some cloud text-to-speech plugins need API keys and charge for speech generation;
long documents and repeated conversions can make those costs add up. iPhone and
Mac already include native text-to-speech without a speech API key or usage bill.

Obsidian's preview loads only part of a long document, leaving Accessibility
Reader without access to the whole note. This can make listening beyond a page
or two awkward or unusable. Full Document View for iOS TTS presents the complete note in
a read-only view for Apple's Accessibility Reader.

## Set up an iPhone shortcut

Open **Settings > Accessibility > Read & Speak**.

Open **Accessibility Reader** and turn it on.

Turn on **Autoplay in Accessibility Reader** if you want speech to start when
Accessibility Reader opens.

Return to **Settings > Accessibility** and check **Accessibility Shortcut**.

Check that **Accessibility Reader** is selected. The default shortcut is a
**triple-click of the lock button**.

## Set up a Mac shortcut

Open **System Settings > Accessibility > Read & Speak**.

Turn on **Accessibility Reader**.

**Important: for high-quality TTS, click the info button (i) beside System voice
and select a Siri voice.** The default selector alone does not expose the Siri
voices; the info button opens the voice selection options. The standard voice
has much lower fidelity. Download the Siri voice if prompted before using it
offline.

The default Accessibility Reader shortcut is **Command-Escape**.

## Listen to a note

Open a note in Obsidian. The plugin's icon appears beside the normal edit/preview
buttons in the document pane.

Click the plugin's preview icon beside the edit/preview buttons.

This opens **Accessibility Preview**. You can also use
**Preview for Accessibility View (TTS on iOS/macOS)** in Obsidian's **command palette**.
On Mac, you can assign a hotkey to this command in **Obsidian Settings > Hotkeys**
to open the preview from the keyboard.

The preview's **Help** button shows the shortcut reminder when needed. Select
**Help** again to close it before starting Accessibility Reader.

Invoke Apple's Accessibility Reader. The defaults are **triple-click the lock
button** on iPhone and **Command-Escape** on Mac.

Speech starts automatically if Autoplay is enabled. Otherwise, press **Play**.
Accessibility Reader's controls manage the voice and playback.

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
