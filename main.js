// ABOUTME: Presents whole read-only notes for native Accessibility Reader.
// ABOUTME: Maintained JavaScript; Obsidian owns rendering and Apple owns speech.
const {
  Component,
  MarkdownRenderer,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} = require("obsidian");

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
`;

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
  constructor(app, closed) {
    super(app);
    this.closed = closed;
    this.setTitle("Full document reader");
    this.modalEl.addClass("full-document-reader");
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
    this.contentEl.createEl("p", {
      text: "Preparing the full document\u2026",
      attr: { role: "status" },
    });
    this.open();
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
    this.contentEl.replaceChildren(this.article);
  }
  onClose() {
    this.dispose();
    this.closed();
  }
  dispose() {
    this.article.replaceChildren();
    this.contentEl.replaceChildren();
    if (this.disposed) return;
    this.disposed = true;
    this.owner.dispose();
    this.close();
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
    this.addRibbonIcon("book-open", "Open full document reader", () =>
      openReader(),
    );
    this.addCommand({
      id: "open-full-document-reader",
      name: "Open full document reader",
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
        "book-open",
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
