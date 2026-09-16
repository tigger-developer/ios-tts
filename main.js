// ABOUTME: Presents whole read-only notes for native Accessibility Reader.
// ABOUTME: Maintained JavaScript; Obsidian owns rendering and Apple owns speech.
// Full Document View for iOS TTS 1.0.3
// Copyright 2026 Tadhg O'Brien
// SPDX-License-Identifier: Apache-2.0
const {
  addIcon,
  Component,
  MarkdownRenderer,
  MarkdownView,
  Modal,
  Notice,
  Platform,
  Plugin,
  PluginSettingTab,
  removeIcon,
  Setting,
} = require("obsidian");

const READER_ICON = "ios-tts-accessibility-reader";
// Artwork from accessibility-reader.svg, scaled from 24 to Obsidian's 100 units.
const READER_ICON_SVG = `<g transform="scale(4.166666666666667)" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <g transform="translate(0,0.16929912)">
    <g transform="translate(0.052269,0.17328146)">
      <path d="m 3.19917,8.5363071 c 3.4994243,0 6.6011868,0.5221162 8.748561,1.7562089 V 21.589212 C 9.8003568,20.544979 6.6985943,20.117793 3.19917,20.117793 Z" style="stroke-width:1.75" />
      <path d="M 11.947731,10.292516 C 14.095105,9.0584233 17.196867,8.5363071 20.696292,8.5363071 V 20.117793 c -3.499425,0 -6.601187,0.427186 -8.748561,1.471419" style="stroke-width:1.75" />
    </g>
    <path d="m 9.25,6.5489083 c 0.7,-0.8 1.62,-1.2 2.75,-1.2 1.13,0 2.05,0.4 2.75,1.2" />
    <path d="m 7.1999999,3.9489083 c 1.25,-1.35 2.8500001,-2.05 4.8000001,-2.05 1.95,0 3.55,0.7 4.8,2.05" />
  </g>
</g>`;

const DEFAULT_MAX_WORDS = 100000;
class ReaderSettings {
  activeLimit = DEFAULT_MAX_WORDS;
  pending = false;
  store;
  constructor(store) {
    this.store = store;
  }
  get maxWords() {
    return this.activeLimit;
  }
  get saving() {
    return this.pending;
  }
  async load() {
    this.activeLimit = DEFAULT_MAX_WORDS;
    try {
      const raw = await this.store.load();
      if (raw == null) return null;
      if (typeof raw !== "object" || Array.isArray(raw)) return "load";
      if (!("maxWords" in raw)) return null;
      if (!validLimit(raw.maxWords)) return "load";
      this.activeLimit = raw.maxWords;
      return null;
    } catch {
      return "load";
    }
  }
  async save(input) {
    if (this.pending) return "busy";
    const trimmed = input.trim();
    const value = Number(trimmed);
    if (!/^[0-9]+$/.test(trimmed) || !validLimit(value)) return "invalid";
    this.pending = true;
    try {
      await this.store.save({ maxWords: value });
      this.activeLimit = value;
      return null;
    } catch {
      return "save";
    } finally {
      this.pending = false;
    }
  }
}
function validLimit(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}
function exceedsWordLimit(source, maximum) {
  const tokens = /\S+/gu;
  let count = 0;
  while (tokens.test(source)) {
    if (++count > maximum) return true;
  }
  return false;
}

class ReaderSession {
  host;
  current = null;
  constructor(host) {
    this.host = host;
  }
  async open(snapshot, maximum) {
    this.close();
    if (!snapshot) {
      this.host.notice("unsupported");
      return;
    }
    if (exceedsWordLimit(snapshot.source, maximum)) {
      this.host.notice("limit", maximum);
      return;
    }
    const session = {};
    this.current = session;
    try {
      session.view = this.host.create(() => {
        if (this.current === session) this.close();
      });
      await session.view.render(snapshot.source, snapshot.path);
      if (this.current === session) session.view.publish();
    } catch {
      if (this.current === session) {
        this.close();
        this.host.notice("render");
      }
    } finally {
      // Release DOM that an already-closed renderer added before settling.
      if (this.current !== session) session.view?.dispose();
    }
  }
  close() {
    const previous = this.current;
    this.current = null;
    previous?.view?.dispose();
  }
}

// Keep the packaged help aligned with docs/reader-help.md.
const READER_HELP = `# Read complete notes with native speech

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

This opens the full-document preview. You can also use
**Preview for Accessibility View (TTS on iOS/macOS)** in Obsidian's **command palette**.
On Mac, you can assign a hotkey to this command in **Obsidian Settings > Hotkeys**
to open the preview from the keyboard.

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
  needs no plugin network service; remote embeds may still need a connection.`;

// Do not retain registrations arriving after an asynchronous render closes.
class RenderOwner extends Component {
  disposed = false;
  addChild(child) {
    if (this.disposed) {
      child.unload();
      return child;
    }
    return super.addChild(child);
  }
  register(callback) {
    if (this.disposed) callback();
    else super.register(callback);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.unload();
  }
}
class ReaderModal extends Modal {
  owner = new RenderOwner();
  article;
  closed;
  disposed = false;
  background = [];
  previousFocus = null;
  constructor(app, closed) {
    super(app);
    this.closed = closed;
    this.setTitle("Full document reader");
    this.modalEl.addClass("full-document-reader");
    this.modalEl.setAttribute("role", "dialog");
    this.modalEl.setAttribute("aria-modal", "true");
    this.modalEl.setAttribute("aria-label", "Full document reader");
    this.modalEl.tabIndex = -1;
    this.article = this.contentEl.ownerDocument.createElement("article");
    this.article.classList.add(
      "markdown-rendered",
      "full-document-reader-article",
    );
    this.article.setAttribute("aria-label", "Document");
    this.article.tabIndex = 0;
    this.owner.load();
    // Capture before task handlers, including checkboxes added after rendering.
    const blockTaskEdit = (event) => {
      const target = event.target;
      if (
        target?.instanceOf(Element) &&
        target.closest('input[type="checkbox"]')
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    for (const event of ["click", "change", "input"]) {
      this.owner.registerDomEvent(this.article, event, blockTaskEdit, true);
    }
  }
  async render(source, path) {
    this.previousFocus = this.contentEl.ownerDocument.activeElement;
    this.contentEl.createEl("p", {
      text: "Preparing the full document\u2026",
      attr: { role: "status" },
    });
    this.open();
    this.modalEl.focus({ preventScroll: true });
    this.isolateBackground();
    await MarkdownRenderer.render(
      this.app,
      source,
      this.article,
      path,
      this.owner,
    );
  }
  publish() {
    if (this.disposed) return;
    for (const checkbox of this.article.querySelectorAll(
      'input[type="checkbox"]',
    )) {
      checkbox.disabled = true;
    }
    const shortcut = Platform.isIosApp
      ? "Use your accessibility shortcut to open Accessibility Reader."
      : Platform.isDesktopApp && Platform.isMacOS
        ? "Press \u2318Esc to open Accessibility Reader, or use your customized shortcut."
        : "";
    this.contentEl.replaceChildren();
    if (shortcut) {
      this.contentEl.createEl("p", {
        text: shortcut,
        cls: "full-document-reader-hint",
      });
    }
    this.contentEl.append(this.article);
    // Do not take focus back from a newer dialog opened during rendering.
    if (this.containerEl.contains(this.article.ownerDocument.activeElement)) {
      this.article.focus({ preventScroll: true });
    }
  }
  isolateBackground() {
    // Keep the host's backdrop and close controls usable. Only sibling branches
    // outside the modal container become inert; its ancestors must stay active.
    const body = this.containerEl.ownerDocument.body;
    let branch = this.containerEl;
    while (branch.parentElement && branch !== body) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && !sibling.hasAttribute("inert")) {
          this.background.push(sibling);
          sibling.setAttribute("inert", "");
        }
      }
      branch = branch.parentElement;
    }
  }
  onClose() {
    this.dispose();
    this.closed();
  }
  dispose() {
    const doc = this.contentEl.ownerDocument;
    const restoreFocus =
      doc.activeElement === doc.body ||
      this.containerEl.contains(doc.activeElement);
    this.article.replaceChildren();
    this.contentEl.replaceChildren();
    if (this.disposed) return;
    this.disposed = true;
    for (const element of this.background) {
      // Preserve pre-existing inert attributes and any later replacement value.
      if (element.getAttribute("inert") === "")
        element.removeAttribute("inert");
    }
    this.background = [];
    this.owner.dispose();
    this.close();
    const previous = this.previousFocus;
    this.previousFocus = null;
    if (
      restoreFocus &&
      doc.activeElement === doc.body &&
      previous?.isConnected &&
      !previous.closest('[inert], [aria-hidden="true"]')
    ) {
      previous.focus({ preventScroll: true });
    }
  }
}
class ReaderSettingsTab extends PluginSettingTab {
  preference;
  helpOwner = null;
  saveButton = null;
  constructor(app, plugin, preference) {
    super(app, plugin);
    this.preference = preference;
  }
  display() {
    this.hide();
    const owner = new RenderOwner();
    this.helpOwner = owner;
    owner.load();
    const container = this.containerEl;
    const backButton = container.createEl("button", {
      text: "Back",
      attr: { type: "button", "aria-label": "Back to note" },
    });
    owner.registerDomEvent(backButton, "click", () => {
      // Closing settings is an internal host API; check before invoking it.
      if (typeof this.app.setting?.close !== "function") {
        new Notice("Use Obsidian's close control to return to the note.");
        return;
      }
      this.app.setting.close();
    });
    let input = String(this.preference.maxWords);
    const status = container.ownerDocument.createElement("p");
    status.setAttribute("role", "status");
    new Setting(container)
      .setName("Maximum words")
      .setDesc(
        "Positive whole number. Saved changes apply when you next open the reader.",
      )
      .addText((text) => {
        text.setValue(input).onChange((value) => {
          input = value;
        });
        text.inputEl.inputMode = "numeric";
        text.inputEl.setAttribute("aria-label", "Maximum words");
      })
      .addButton((button) => {
        this.saveButton = button;
        button
          .setButtonText("Save")
          .setDisabled(this.preference.saving)
          .onClick(async () => {
            button.setDisabled(true);
            const result = await this.preference.save(input);
            this.saveButton?.setDisabled(this.preference.saving);
            if (this.helpOwner !== owner) return;
            const messages = {
              invalid:
                "Enter a positive whole number no greater than 9007199254740991.",
              busy: "A save is already in progress. Try again when it finishes.",
              save: "Could not save Maximum words. The previous value is still active. Try Save again.",
            };
            status.textContent = result
              ? messages[result]
              : `Saved. The next reader uses a maximum of ${this.preference.maxWords.toLocaleString()} words.`;
          });
      });
    container.append(status);
    const helpEl = container.createDiv({ cls: "markdown-rendered" });
    void MarkdownRenderer.render(this.app, READER_HELP, helpEl, "", owner)
      .catch(() => {
        if (this.helpOwner === owner)
          helpEl.setText(
            "Could not display reader help. Close and reopen settings to retry.",
          );
      })
      .finally(() => {
        if (this.helpOwner !== owner) helpEl.replaceChildren();
      });
  }
  hide() {
    this.helpOwner?.dispose();
    this.helpOwner = null;
    this.saveButton = null;
    this.containerEl.replaceChildren();
  }
}
class FullDocumentReaderPlugin extends Plugin {
  reader = null;
  settingsTab = null;
  headerButtons = new Map();
  stopped = false;
  async onload() {
    this.stopped = false;
    const preference = new ReaderSettings({
      load: async () => {
        const data = await this.loadData();
        return data;
      },
      save: (value) => this.saveData(value),
    });
    const loadError = await preference.load();
    if (this.stopped) return;
    addIcon(READER_ICON, READER_ICON_SVG);
    this.register(() => removeIcon(READER_ICON));
    if (loadError)
      new Notice(
        "Could not load Maximum words. Using 100,000; check the value in Full document reader settings and Save to replace it.",
      );
    const reader = new ReaderSession({
      create: (onClose) => new ReaderModal(this.app, onClose),
      notice: (reason, maximum) => {
        const messages = {
          unsupported:
            "Open a Markdown note, then open the full document reader.",
          render:
            "Could not open the full document reader. Try opening it again.",
          limit: `This note exceeds the maximum of ${maximum?.toLocaleString()} words. Increase Maximum words in Full document reader settings to read it.`,
        };
        new Notice(messages[reason]);
      },
    });
    this.reader = reader;
    const openReader = (
      view = this.app.workspace.getActiveViewOfType(MarkdownView),
    ) => {
      const file = view?.file;
      const snapshot =
        view && file?.extension === "md"
          ? { source: view.getViewData(), path: file.path }
          : null;
      void reader.open(snapshot, preference.maxWords);
    };
    this.addRibbonIcon(READER_ICON, "Open full document reader", () =>
      openReader(),
    );
    this.addCommand({
      id: "open-full-document-reader",
      name: "Preview for Accessibility View (TTS on iOS/macOS)",
      callback: () => openReader(),
    });
    const updateHeaders = () => this.updateHeaderButtons(openReader);
    this.registerEvent(this.app.workspace.on("layout-change", updateHeaders));
    this.registerEvent(this.app.workspace.on("file-open", updateHeaders));
    this.app.workspace.onLayoutReady(updateHeaders);
    this.settingsTab = new ReaderSettingsTab(this.app, this, preference);
    this.addSettingTab(this.settingsTab);
  }
  updateHeaderButtons(openReader) {
    if (this.stopped) return;
    const views = new Set(
      this.app.workspace
        .getLeavesOfType("markdown")
        .map((leaf) => leaf.view)
        .filter((view) => view instanceof MarkdownView),
    );
    for (const [view, button] of this.headerButtons) {
      if (!views.has(view)) {
        button.remove();
        this.headerButtons.delete(view);
      }
    }
    for (const view of views) {
      if (this.headerButtons.has(view)) continue;
      const button = view.addAction(
        READER_ICON,
        "Open full document reader",
        () => openReader(view),
      );
      this.headerButtons.set(view, button);
    }
  }
  onunload() {
    this.stopped = true;
    for (const button of this.headerButtons.values()) button.remove();
    this.headerButtons.clear();
    this.reader?.close();
    this.reader = null;
    this.settingsTab?.hide();
    this.settingsTab = null;
  }
}

module.exports = FullDocumentReaderPlugin;

/*
Copyright 2026 Tadhg O'Brien

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
