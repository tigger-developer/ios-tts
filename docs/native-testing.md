# Native reader test

**First check:** open a long note with **Preview for Accessibility View (TTS on iOS/macOS)** in the command palette, invoke
Apple's **Accessibility Reader**, and check that its text reaches the ending
without scrolling the plugin view. If it stops early, record where it stops.

Test the current maintained JavaScript package in a **disposable vault**,
with the default theme and only core plugins. The package is
`main.js`, `manifest.json` and `styles.css` in the checkout. Record the tested
commit, device, OS and Obsidian versions, and the tester's name.

1. **Reading:** use empty, mixed-Markdown, second-note and 100,000-word notes.
   Confirm the full rendered body in order, including the long ending in the
   native reader. Listen through the short note; navigate native playback to
   hear the long ending. Three markers alone do not prove completeness.
2. **Controls and safety:** try the note's top toolbar book and sound waves icon,
   ribbon and command, editing and reading modes,
   an unsaved edit, note switching, reopen, no note and a non-Markdown tab.
   Check the task checkbox cannot edit its source. Check scrolling, dismissal,
   disable/enable and one Obsidian restart. Compare source hashes taken after
   deliberate edits and before reader use; reader actions must not change them.
   On Mac, use two notes in split panes: each toolbar icon must open its own
   pane's note even when the other pane has focus. On iPhone, verify the top
   icon's placement and touch action. Change files, close and reopen tabs, and
   disable/re-enable: expect one icon per Markdown pane and none after disabling.
   Confirm toolbar and ribbon use the supplied accessibility-reader artwork
   and are visually distinguishable from Obsidian's preview control.
   After rendering, check the hint beneath the title: Command-Escape on Mac,
   accessibility shortcut on iPhone. It must be absent while preparing, remain
   outside the document article, and leave the document scrollable.
   For the focus/isolation amendment, invoke Accessibility Reader immediately
   after rendering: sidebar and other-tab text must not precede the note.
   Check that keyboard focus begins in the document and Tab stays in the modal.
   Close, reopen, close during preparation and disable while open; the workspace
   must remain usable afterwards. A newer dialog opened during preparation must
   keep focus when rendering finishes. Repeat reading and dismissal on iPhone.
3. **Settings:** read the bundled setup and benefits/limitations. Try a small
   limit with notes below, at and above it; test invalid input, Save, reload and
   raising the limit. An open snapshot stays unchanged. Restore 100,000 before
   the long-note check. Check offline help, links and labelled controls.
   Use **Back** with the keyboard on Mac and touch on iPhone; settings should
   close. Reopen after editing without Save and confirm the saved limit remains.
   Check one Back button appears on each reopening, including after closing
   while help is still rendering.
4. **Apple shortcuts:** follow the settings help. Check the Accessibility Reader
   selection on iPhone and invoke it with triple-click lock button. On Mac, use
   Command-Escape. Check that a hotkey assigned through Obsidian Settings > Hotkeys
   opens the plugin preview using the renamed command.
5. **Offline and cleanup:** with Autoplay off, local notes must present offline
   and opening the plugin must not start speech. Remove disposable test data
   and restore any native settings changed for testing.

Record observations separately for **macOS** and **physical iPhone** in the
[validation record](../specs/003-full-document-reader/validation.org), which also
contains the reproducible synthetic-fixture recipe and hashes. The authoritative
procedures are the two user tests in the
[approved specification](../specs/003-full-document-reader/spec.org).
