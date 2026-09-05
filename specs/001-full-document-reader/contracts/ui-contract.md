# UI Contract: Full Document Reader

## Platform contract

- `manifest.json` declares `isDesktopOnly: false` and
  `minAppVersion: "1.13.0"`.
- The reader invocation surfaces are registered only when
  `Platform.isIosApp` is true.
- The bundle imports no Node.js or Electron runtime API.
- Android and desktop behaviour are not part of this feature contract.

## Invocation contract

### Ribbon button

- **Visible name**: `Open full document reader`
- **Accessible name**: `Open full document reader`
- **Action**: Capture and present the active Markdown note.
- **Availability**: iOS only.

### Command

- **Command ID**: `open-full-document-reader`
- **Command name**: `Open full document reader`
- **Action**: The same controller entry point as the ribbon button.
- **Availability**: Enabled only when the active view is a Markdown view.

Neither surface invokes Accessibility Reader or begins speech playback.
The always-available iOS ribbon button exercises both unsupported-state notice
branches. The command is disabled outside an active Markdown view, so it does
not expose either notice in normal user interaction.

## Snapshot and failure contract

| Condition | Observable result |
|---|---|
| No active Markdown view | Notice: `Open a Markdown note to use Full Document Reader.` |
| Active non-Markdown file | Notice: `Full Document Reader supports Markdown notes only.` |
| Active `.md` `FileView` that is not a `MarkdownView` | Notice: `Full Document Reader could not present this note.` |
| Frontmatter, rendering, or normalization failure | Notice: `Full Document Reader could not present this note.` |
| Repeated invocation | Existing reader closes; only the latest successful snapshot opens |
| Unsupported invocation while a reader is open | Existing reader closes before validation; the applicable notice appears and no reader remains open |
| Late stale render | Result is discarded without replacing current content or showing a stale notice |

Failures never display a vault path, note content, exception details, or content
from an earlier snapshot. Diagnostic causes may be logged locally without note
content and must preserve the original error.

Both invocation surfaces enter the same controller. It first checks
`getActiveViewOfType(MarkdownView)`. If that returns null, it checks
`getActiveViewOfType(FileView)`: no active file view receives the
open-a-Markdown-note notice; a non-null file whose extension is not `md`
receives the non-Markdown notice; and a non-null `.md` file not exposed as a
`MarkdownView` receives the presentation-failure notice. It distinguishes all
three outcomes before capture and does not use `getActiveFile()` because that
method can return the most recently active file from a non-file view.

## Reader presentation contract

The modal exposes exactly one document article:

```html
<article class="ios-tts-reader" aria-labelledby="ios-tts-reader-title">
  <h1 id="ios-tts-reader-title">Note title</h1>
  <section class="ios-tts-reader__properties">
    <dl><!-- visible properties in Obsidian parser order --></dl>
  </section>
  <section class="ios-tts-reader__body">
    <!-- normalized Obsidian-rendered Markdown -->
  </section>
</article>
```

- The property section is omitted when no visible property exists.
- Every own enumerable top-level entry returned by Obsidian's frontmatter parser
  is visible for this feature. No display-mode or property-name filter applies.
- Null values and empty arrays or mappings retain the property-name `<dt>` and
  an empty `<dd>` but add no placeholder or invented text.
- The `<h1>` shown before properties is the single title added by the plugin and
  contains the exact active `MarkdownView.getDisplayText()` value. Body heading
  levels remain as rendered by Obsidian; a body may therefore contain its own
  `<h1>` without duplicating the plugin-added title.
- The plugin applies no property sort or grouping. Acceptance compares the
  parser-provided sequence with Obsidian's visible **Properties in document**
  rows for the active note.
- The body section remains present for an empty or frontmatter-only note.
- The article is attached only after the full detached render and normalization
  succeed.
- The modal's close control and any host chrome remain outside the article.
- The internal sections have no accessible name whose label could enter the
  document reading sequence; their structure is implicit.
- There is no loading, Help, status, navigation, playback, or editing control
  inside the article.
- The article is read-only and ordinary text remains selectable.
- Styling uses Obsidian theme variables, scalable units, and ordinary document
  flow; content is not virtualized or paginated.

## Readable-content normalization contract

| Source content | Reader representation |
|---|---|
| `[[Target|Readable label]]` | `Readable label` as text, without navigation |
| `[[Target]]` | `Target` as author-supplied text, without navigation |
| `![[Note|Readable label]]` | `Readable label` only |
| `![[Note]]` | Written target name only |
| Labelled image or media embed | Author-supplied label or alternative text only |
| Unlabelled image or media embed | No placeholder, filename, or invented text |
| External Markdown link | Author-supplied label as text; bare authored URL remains text |
| Task checkbox | Non-interactive checked or unchecked semantic state plus task text |
| Generated copy/collapse/edit control | Removed before attachment |
| Script or executable handler | Removed before attachment |

The normalization step never resolves or appends target-note content.

## Settings Help contract

The plugin settings tab contains a declarative sub-page named **How to use**.
It remains available after setup and contains these sections in order.
`src/main.ts` registers `FullDocumentReaderSettingTab` with
`Plugin.addSettingTab()`. The class is owned by `src/settings-tab.ts`, extends
`PluginSettingTab`, and returns the **How to use** `SettingDefinitionPage` from
`getSettingDefinitions()`.

### Set up Accessibility Reader

1. On iPhone, open **Settings > Accessibility > Read & Speak > Accessibility
   Reader**, then turn Accessibility Reader on.
2. Open **Settings > Accessibility > Accessibility Shortcut**, then select
   Accessibility Reader.
3. Triple-click the side, or lock, button to invoke the shortcut. Control Centre
   and other iOS accessibility launch methods may also be used.

The page explains that assigning several accessibility features can show an
additional chooser. Assigning only Accessibility Reader gives the direct
three-action routine.

### Read a note

1. Open the Markdown note in Obsidian.
2. Press **Open full document reader**.
3. Invoke the configured accessibility shortcut.
4. Press **Play** in Accessibility Reader.

The numbered list contains four contextual steps because opening the note is a
prerequisite. The advertised routine counts the final three user actions.

### Optional Autoplay

The page explains that iOS Accessibility Reader Autoplay can remove the final
manual Play action, but the baseline instructions do not require it.

### External authority

The page links to Apple's current
[Accessibility Reader instructions](https://support.apple.com/guide/iphone/read-listen-text-apps-accessibility-reader-iph406a46ab8/26/ios/26).

## Public-copy contract

- `manifest.json` identifies the complete-note Accessibility Reader purpose in
  concise marketplace metadata.
- README usage details explain the three routine actions in order.
- README and marketplace details state that iOS owns speech and playback.
- README and marketplace details state that the plugin requires no TTS API key,
  external TTS account, pay-per-use plugin charge, metered TTS service, or
  remote speech-processing wait.
- No copy claims that the plugin invokes Accessibility Reader or starts speech.
- Marketplace submission, remote publication, and licence selection require a
  later human instruction.
