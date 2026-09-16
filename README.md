# Full Document View for iOS TTS

The purpose of this plugin is to unlock native Apple Text-to-Speech (TTS) on obsidian notes. Normally the Accessibility Reader in iOS only sees a portion of the note, as obsidian's preview is optimized to load only the visible portion of the note give or take some caching. This plugin presents a special preview mode that Accessibility Reader can use to read the entire document

If you are using an iOS device and are using a TTS plugin with an API key, you are spending money for something your device is already capable of doing for free. Modern iOS/macOS TTS has improved substantially and is on a quality par with the best TTS API services. However, accessing it is not straightforward.

By enabling a shortcut to the Accessibility Reader ([instructions](docs/reader-help.md#set-up-an-iphone-shortcut)), you can activate TTS on your notes on-device, even if you have no wifi or data connection.
The one remaining limitation is that Accessibility Reader only sees a portion of the document - per Obsidian's preview optimization. This plugin enables a full-document preview for use with the Accessibility Reader.

Instructions for how to use it and how to invoke it are in the help text and [the setup and usage guide](docs/reader-help.md).

No speech service account or API key is needed.

Requires **Obsidian 1.13+** and **iOS 26+ or macOS 26+**.

## How to use

Install and enable **Full Document View for iOS TTS** from its
[Obsidian Community listing](https://community.obsidian.md/plugins/ios-tts).
Then set up Apple's Accessibility Reader once for each device.

### Set up iPhone (iOS)

1. Open **Settings > Accessibility > Read & Speak > Accessibility Reader**.
2. Turn on **Accessibility Reader**. Turn on **Autoplay in Accessibility Reader**
   if speech should start as soon as the reader opens. Leave Autoplay off to
   start speech manually with **Play**.
3. Return to **Settings > Accessibility > Accessibility Shortcut** and select
   **Accessibility Reader**. A tick beside it confirms the selection.
4. The shortcut is a **triple-click of the side button** (the lock button), or
   the **Home button** on an iPhone that has one. If several accessibility
   shortcuts are selected, choose **Accessibility Reader** from the menu.

<details>
<summary>iPhone setup screenshots</summary>

**Open Read & Speak, then Accessibility Reader.**

<img src="docs/images/setup/ios-read-and-speak.png" alt="iPhone Accessibility settings with Read & Speak highlighted" width="280">
<img src="docs/images/setup/ios-reader-setting.png" alt="Read & Speak settings with Accessibility Reader highlighted" width="280">

**Enable the reader and, optionally, Autoplay.**

<img src="docs/images/setup/ios-reader-autoplay.png" alt="Accessibility Reader and Autoplay switches both turned on" width="280">

**Select Accessibility Reader for the triple-click shortcut.**

<img src="docs/images/setup/ios-shortcut-setting.png" alt="Accessibility settings with Accessibility Shortcut highlighted" width="280">
<img src="docs/images/setup/ios-shortcut-selection.png" alt="Accessibility Reader ticked under Triple-Click the Side Button for" width="280">

</details>

**Optional Back Tap shortcut:** after selecting Accessibility Reader above,
open **Settings > Accessibility > Touch > Back Tap** and set **Double Tap** to
**Accessibility Shortcut**. Double-tap the back of the phone to invoke it.

### Set up Mac (macOS)

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

<details>
<summary>Mac setup screenshots</summary>

**Open Read & Speak in Accessibility settings.**

<img src="docs/images/setup/mac-read-and-speak.png" alt="macOS Accessibility settings with Read & Speak highlighted" width="480">

**Turn on Accessibility Reader; use the lower info button beside System voice to choose a voice.**

<img src="docs/images/setup/mac-reader-and-voice.png" alt="Read & Speak settings with Accessibility Reader enabled and the System voice info button highlighted; Siri Voice 1 is selected" width="480">

</details>

### Listen to a note

1. Open the note in Obsidian.
2. Tap or click the **book and sound waves icon** beside the note's normal
   edit/preview controls. This opens the full-document preview. The ribbon
   button and **Open full document reader** command do the same thing.
3. Invoke Apple's Accessibility Reader: **triple-click the side/Home button**
   on iPhone, use the configured **Back Tap**, or press **Command-Escape**
   (or the customized shortcut) on Mac.
4. Speech starts automatically if Autoplay is enabled. Otherwise, press
   **Play** in Accessibility Reader. Its controls manage the voice and playback.

<img src="docs/images/setup/reader-icon.png" alt="Full-document preview button: an open book with sound waves" width="64">

<details>
<summary>Where to find the button in Obsidian</summary>

<img src="docs/images/setup/obsidian-note-toolbar.png" alt="Obsidian note toolbar with the book and sound waves button highlighted beside the edit and preview controls" width="560">

</details>

[Apple's iPhone instructions](https://support.apple.com/guide/iphone/read-listen-text-apps-accessibility-reader-iph406a46ab8/26/ios/26) ·
[Apple's Mac instructions](https://support.apple.com/en-ca/guide/mac-help/mchl799f6fb9/mac) ·
[Choosing a Mac voice](https://support.apple.com/en-au/guide/mac-help/mchlp2290/mac)

The reader is a snapshot: reopen it after editing the note. Notes are never
changed. The default limit is **100,000 words**, adjustable in plugin settings.
Notes over the limit show a notice instead of opening a shortened copy. Larger
notes, images and embeds can use substantial memory.

[Shortcut setup and further help](docs/reader-help.md) ·
[Manual installation](docs/readme-history.md#install-and-use) ·
[Development](docs/readme-history.md#develop-outside-the-vault) ·
[Release provenance](docs/releases/automation.md)

Licensed under [Apache License 2.0](LICENSE).
