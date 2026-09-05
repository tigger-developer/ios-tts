# Data Model: Full Document Reader

All entities are transient unless explicitly identified as compiled static
content. The plugin does not persist note content or reader state.

## ActiveNoteSnapshot

An immutable capture of the active Markdown view at invocation.

| Field | Type | Rule |
|---|---|---|
| `generation` | positive integer | Monotonically increases for each invocation |
| `filePath` | normalized vault-relative string | Comes from the active `TFile`; used only for identity and renderer context, never exposed as title or separate readable content |
| `title` | string | Exact active `MarkdownView.getDisplayText()` result, added exactly once by the plugin |
| `source` | string | Current `MarkdownView.getViewData()` content |
| `bodyMarkdown` | string | Source after the frontmatter block is separated |
| `properties` | ordered `PropertyEntry[]` | Every own enumerable top-level entry returned by Obsidian `parseYaml`, in parser order, with no display-mode filter, property-name filter, sort, or grouping |

### Validation

- The active view must be a `MarkdownView` with a `.md` file.
- Snapshot creation performs no write and returns either one immutable snapshot
  or a typed failure.
- Invalid frontmatter that cannot be represented safely produces a presentation
  failure rather than raw delimiters or invented prose.
- Empty source and frontmatter-only source remain valid snapshots.
- The title is captured from the active view, not inferred from a frontmatter
  field, basename, filename, or path. Physical-device acceptance compares it
  with the title Obsidian displays for that view; a mismatch fails FR-017.
- The property sequence is obtained by enumerating the top-level object returned
  by Obsidian's parser. Physical-device acceptance compares this sequence with
  the active note's visible **Properties in document** rows; a mismatch fails
  FR-017.

## PropertyEntry

A visible property name and its semantic value.

| Field | Type | Rule |
|---|---|---|
| `name` | non-empty string | Preserves Obsidian parser order and visible property name |
| `value` | `PropertyValue` | Preserves scalar, sequence, or mapping structure |

`PropertyValue` is a string, finite number, boolean, null, valid `Date`, ordered
array of values, or ordered plain mapping of string keys to values. A valid
`Date` renders as its deterministic ISO 8601 string. A plain mapping has
`Object.prototype` or null as its prototype. Undefined, non-finite numbers,
invalid dates, bigint, symbols, functions, non-plain objects, cycles, and arrays
or mappings containing any unsupported value produce a presentation failure.
Rendering uses semantic text, lists, and description lists rather than JSON or
YAML syntax. A null value, empty array, or empty mapping produces an empty
`<dd>` after its property-name `<dt>` and adds no placeholder or invented
readable text.

## NormalizedBody

The detached, post-render document body that is safe to attach to the reader
article.

| Field | Type | Rule |
|---|---|---|
| `root` | detached `HTMLElement` | Never attached until rendering and normalization succeed |
| `readableSegments` | ordered DOM nodes | Covers the body from first through final readable content |

### Normalization rules

- Ordinary links retain author-supplied readable labels and lose navigation
  behaviour.
- Embedded Markdown notes become their alias or written target name only.
- Embedded media become author-supplied alternative text or nothing.
- Referenced-target content is absent at every depth.
- Generated copy, navigation, collapse, editing, and status controls are absent.
- Task checkbox state remains non-interactive semantic document state.
- Script elements, executable attributes, and plugin-added active controls are
  absent from the attached article.

## ReaderDocument

One semantic document exposed to Accessibility Reader.

| Field | Type | Rule |
|---|---|---|
| `article` | `<article>` | Sole document-content accessibility root |
| `title` | `<h1>` | First readable node and added exactly once by the plugin |
| `properties` | optional `<section><dl>` | Follows title in source order |
| `body` | `<section>` | Follows properties and contains `NormalizedBody` |

The article contains no Help, loading, failure, close, playback, or navigation
control. Obsidian modal chrome remains outside it. Body headings retain the
levels produced by Obsidian, including any body `<h1>`; "exactly once" applies
to the plugin-added note title, not to the total number of `<h1>` elements.

## ReaderSession

The controller-owned state for one generation.

```text
IDLE -> PREPARING -> PRESENTED -> CLOSED
                  \-> FAILED

PREPARING, PRESENTED, or FAILED --new invocation--> CLOSED, then new PREPARING
any state --plugin unload--> CLOSED
```

| Field | Type | Rule |
|---|---|---|
| `generation` | positive integer | Must equal the controller's current token before publish |
| `status` | enum | `PREPARING`, `PRESENTED`, `FAILED`, or `CLOSED` |
| `snapshot` | `ActiveNoteSnapshot` | Present after capture succeeds |
| `modal` | reader modal or null | At most one presented modal is controller-owned |
| `renderOwner` | Obsidian `Component` or null | Unloaded on replacement, close, failure, or plugin unload |

Late asynchronous work whose generation is no longer current is discarded and
cannot attach content or show a stale failure.

## HelpContent

Compiled static content exposed through the settings page.

| Field | Type | Rule |
|---|---|---|
| `setupSteps` | ordered strings | Enable Reader, assign shortcut, triple-click example |
| `routineSteps` | three ordered strings | Plugin button, shortcut, Play |
| `alternatives` | ordered strings | Control Centre, chooser caveat, optional Autoplay |
| `appleGuideUrl` | HTTPS URL | Official external authority |

Help content is not persisted and never enters `ReaderDocument`.

## PublicCopy

Compiled project metadata distributed through `manifest.json` and README.

It identifies the complete-document purpose, three-action flow, native iOS
speech ownership, and the absence of an API key, external TTS account,
pay-per-use plugin charge, metered TTS service, and remote speech-processing
wait. Publishing that copy remains outside this phase.
