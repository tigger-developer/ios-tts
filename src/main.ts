// ABOUTME: Presents full Markdown snapshots for Apple's native Accessibility Reader.
// ABOUTME: Owns transient UI and a saved limit; the host owns rendering.
import {
  Component,
  MarkdownRenderer,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";
import type { App, ButtonComponent } from "obsidian";
import { ReaderSession } from "./reader-session.ts";
import type { ReaderView } from "./reader-session.ts";
import { ReaderSettings } from "./reader-settings.ts";
import help from "../docs/reader-help.md";

// Do not load or retain registrations arriving after an asynchronous render closes.
class RenderOwner extends Component {
  private disposed = false;
  override addChild<T extends Component>(child: T): T {
    if (this.disposed) {
      child.unload();
      return child;
    }
    return super.addChild(child);
  }
  override register(callback: () => void): void {
    if (this.disposed) callback();
    else super.register(callback);
  }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.unload();
  }
}

class ReaderModal extends Modal implements ReaderView {
  private readonly owner = new RenderOwner();
  private readonly article: HTMLElement;
  private readonly closed: () => void;
  private disposed = false;

  constructor(app: App, closed: () => void) {
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
    const blockTaskEdit = (event: Event): void => {
      const target = event.target as Node | null;
      if (
        target?.instanceOf(Element) &&
        target.closest('input[type="checkbox"]')
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    for (const event of ["click", "change", "input"] as const) {
      this.owner.registerDomEvent(this.article, event, blockTaskEdit, true);
    }
  }

  async render(source: string, path: string): Promise<void> {
    this.contentEl.createEl("p", {
      text: "Preparing the full document…",
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

  publish(): void {
    if (this.disposed) return;
    for (const checkbox of this.article.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    )) {
      checkbox.disabled = true;
    }
    this.contentEl.replaceChildren(this.article);
  }

  override onClose(): void {
    this.dispose();
    this.closed();
  }

  dispose(): void {
    this.article.replaceChildren();
    this.contentEl.replaceChildren();
    if (this.disposed) return;
    this.disposed = true;
    this.owner.dispose();
    this.close();
  }
}

class ReaderSettingsTab extends PluginSettingTab {
  private readonly preference: ReaderSettings;
  private helpOwner: RenderOwner | null = null;
  private saveButton: ButtonComponent | null = null;

  constructor(app: App, plugin: Plugin, preference: ReaderSettings) {
    super(app, plugin);
    this.preference = preference;
  }

  override display(): void {
    this.hide();
    const owner = new RenderOwner();
    this.helpOwner = owner;
    owner.load();
    const container = this.containerEl;
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
    void MarkdownRenderer.render(this.app, help, helpEl, "", owner)
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

  override hide(): void {
    this.helpOwner?.dispose();
    this.helpOwner = null;
    this.saveButton = null;
    this.containerEl.replaceChildren();
  }
}

export default class FullDocumentReaderPlugin extends Plugin {
  private reader: ReaderSession | null = null;
  private settingsTab: ReaderSettingsTab | null = null;
  private stopped = false;

  override async onload(): Promise<void> {
    this.stopped = false;
    const preference = new ReaderSettings({
      load: async () => {
        const data: unknown = await this.loadData();
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
    const openReader = (): void => {
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      const file = view?.file;
      const snapshot =
        view && file?.extension === "md"
          ? { source: view.getViewData(), path: file.path }
          : null;
      void reader.open(snapshot, preference.maxWords);
    };
    this.addRibbonIcon("book-open", "Open full document reader", openReader);
    this.addCommand({
      id: "open-full-document-reader",
      name: "Open full document reader",
      callback: openReader,
    });
    this.settingsTab = new ReaderSettingsTab(this.app, this, preference);
    this.addSettingTab(this.settingsTab);
  }

  override onunload(): void {
    this.stopped = true;
    this.reader?.close();
    this.reader = null;
    this.settingsTab?.hide();
    this.settingsTab = null;
  }
}
