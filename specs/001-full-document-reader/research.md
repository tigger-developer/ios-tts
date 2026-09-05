# Research: Full Document Reader

## Decision 1: Use the current official Obsidian plugin toolchain shape

- **Decision**: Use strict TypeScript, the Obsidian public API package,
  esbuild, npm with a committed lockfile, and Node.js 24 LTS as development
  tooling only. Pin direct tools in `package.json` and the resolved graph in
  `package-lock.json`.
- **Rationale**: Obsidian's maintained sample plugin uses TypeScript, npm, and
  esbuild to compile `src/main.ts` into the required `main.js`. Node.js 24 is a
  current LTS line; the plugin bundle itself must not call Node.js or Electron
  APIs because it runs on iOS.
- **Alternatives considered**: Hand-maintained `main.js` avoids a build step but
  loses strict host-boundary types and makes a multi-module accessibility
  implementation harder to maintain. A runtime framework adds weight without
  product value.
- **Sources**: [Obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin),
  [Node.js releases](https://nodejs.org/en/about/previous-releases).

## Decision 2: Set the minimum Obsidian version to 1.13.0

- **Decision**: Declare `minAppVersion: "1.13.0"` and compile against the
  pinned Obsidian 1.13.1 public API types.
- **Rationale**: The persistent How to use page maps directly to Obsidian's
  declarative `SettingDefinitionPage`, introduced in 1.13.0. This gives a
  navigable settings sub-page and makes Help discoverable through settings
  search without maintaining a legacy dual path.
- **Registration composition**: `src/settings-tab.ts` owns a
  `FullDocumentReaderSettingTab` subclass of `PluginSettingTab`. Its
  `getSettingDefinitions()` returns one inline `SettingDefinitionPage` named
  **How to use**, whose `items` contain the static Help definitions.
  `src/main.ts` creates that tab during `onload()` and registers it through
  `Plugin.addSettingTab()`. No imperative `display()` fallback is implemented.
- **Alternatives considered**: An imperative settings tab supports older
  versions but duplicates navigation and search behaviour. A modal-only Help
  surface would not satisfy the persistent settings requirement.
- **Sources**: [Obsidian settings documentation](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/en/Plugins/User%20interface/Settings.md),
  [Obsidian public API declarations](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts),
  [Apple Accessibility Reader instructions](https://support.apple.com/guide/iphone/read-listen-text-apps-accessibility-reader-iph406a46ab8/26/ios/26).
- **Reverification on 2026-09-05**: Apple's current instructions identify
  Accessibility Reader as an iOS 26 feature. Obsidian's current declarations
  identify `SettingDefinitionPage` and settings sub-pages as public APIs since
  1.13.0, and the published API package provides 1.13.1 types. The supported
  contract is therefore Obsidian 1.13.0 or later on iOS 26 or later, compiled
  against the pinned 1.13.1 API types.

## Decision 3: Use a ribbon button and an equivalent command

- **Decision**: On iOS, register a ribbon button titled **Open full document
  reader** and a command with the same name and callback. The ribbon button is
  the documented first action; the command is an alternative invocation path.
- **Rationale**: `Plugin.addRibbonIcon` is a public lifecycle-managed API whose
  title supplies the button tooltip and accessible name. The command improves
  discoverability without changing the three-action baseline.
- **Alternatives considered**: A command alone does not meet the visible-button
  requirement. An editor-menu item is less immediate on iPhone. A custom
  floating button adds layout and accessibility risk.
- **Source**: [Obsidian public API declarations](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts).

## Decision 4: Capture the active Markdown view, not the most recent file

- **Decision**: Resolve `MarkdownView` through `getActiveViewOfType`, require a
  non-null `.file`, and capture its current `getViewData()` and
  `getDisplayText()` strings immediately on invocation. The display text is the
  title added to the reader. The vault-relative path remains identity and
  renderer context only; it is never exposed as title or separate readable
  content.
- **Rationale**: `Workspace.getActiveFile()` may return the most recently active
  file from a non-file view. Capturing `getViewData()` from the active Markdown
  view preserves unsaved text that Obsidian currently knows while avoiding any
  note write.
- **Alternatives considered**: `Vault.cachedRead()` is safe but can omit current
  unsaved editor content. Direct filesystem access is unavailable on mobile and
  violates the host-boundary standard.
- **Unsupported-state distinction**: After a null active `MarkdownView`, resolve
  the active public `FileView`. No active `FileView` receives the
  open-a-Markdown-note notice. A non-null file whose extension is not `md`
  receives the non-Markdown notice. A non-null `.md` file that is not exposed
  as a `MarkdownView` receives the presentation-failure notice because Obsidian
  cannot expose it for capture or rendering. These three outcomes are resolved
  before capture. This avoids treating the most recently active file returned
  from a non-file view as the currently active note.
- **Source**: [Obsidian public API declarations](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts).

## Decision 5: Build one detached semantic article before presentation

- **Decision**: Create a detached container, parse frontmatter with
  `getFrontMatterInfo` and `parseYaml`, render the remaining Markdown once with
  `MarkdownRenderer.render`, normalize the rendered DOM, then attach one
  `<article>` to the modal. The article contains one plugin-added title `<h1>`,
  an ordered property `<dl>` when properties exist, and the rendered body.
- **Rationale**: Obsidian's renderer preserves its Markdown semantics and plugin
  compatibility. Detachment prevents Accessibility Reader from discovering a
  partial document while asynchronous rendering and normalization are in
  progress. A single article supplies the continuous title, properties, and
  body sequence required by the specification.
- **Property-order mapping**: Enumerate the top-level result returned by
  Obsidian's `parseYaml` in its provided order and apply no plugin-owned sort or
  grouping. Every own enumerable top-level property in that result is a visible
  property for this feature; the plugin applies no display-mode or property-name
  filter. The public API exposes no separate current-note property-editor row
  sequence. This Obsidian-parser order is therefore the public-API mapping for
  the specification's "Obsidian's order" requirement. Physical-device
  acceptance must compare it with the visible **Properties in document** rows
  for the representative notes; any mismatch is a failed requirement, not an
  implementation discretion.
- **Title mapping**: Use the active `MarkdownView.getDisplayText()` result as
  the exact public-API value for the note title. Physical-device acceptance
  compares the reader's added title with the text Obsidian displays for that
  view. A mismatch fails FR-017. The implementation neither interprets a
  frontmatter `title` property nor derives a title independently from the raw
  vault path.
- **Alternatives considered**: Cloning the current preview can inherit
  virtualization or truncation. A project-owned Markdown parser would duplicate
  Obsidian behaviour and enlarge the dependency and compatibility surface.
- **Sources**: [Obsidian public API declarations](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts),
  [Obsidian Properties documentation](https://github.com/obsidianmd/obsidian-help/blob/master/en/Editing%20and%20formatting/Properties.md).

## Decision 6: Normalize references and controls after standard rendering

- **Decision**: Before attaching the detached document, replace embedded-note
  containers with their author-supplied alias or written target name; replace
  media with author-supplied alternative text or omit it; unwrap ordinary links
  while retaining their readable labels; remove generated navigation, copy,
  collapse, and editing controls; preserve non-interactive task-state semantics.
- **Rationale**: This keeps the final article document-only, prevents linked or
  embedded target content from entering the reading sequence, and avoids raw
  Markdown syntax. Normalizing after the public renderer avoids writing a
  second Markdown parser and works with current unsaved source.
- **Alternatives considered**: Source replacement using metadata-cache offsets
  can be stale relative to unsaved editor content. Leaving generated controls in
  place pollutes Accessibility Reader's sequence. Recursively resolving embeds
  contradicts the signed-off boundary.
- **Constraint**: The rendered tree remains detached until normalization ends.
  Any normalization failure discards the tree and reports presentation failure;
  no partial or stale article is attached.

## Decision 7: Own a single generation-token reader session

- **Decision**: `ReaderController` owns at most one modal and one monotonically
  increasing generation token. Each invocation invalidates earlier asynchronous
  work and closes the existing modal before it validates or captures the new
  active state. It may publish only when its token is still current. A failed or
  unsupported replacement therefore leaves no earlier presentation open.
- **Rationale**: Markdown rendering is asynchronous. Token validation prevents
  an older slow render from replacing a newer snapshot and enforces the
  single-current-presentation requirement.
- **Alternatives considered**: Serial queuing delays the user's latest request.
  Allowing multiple modals contradicts repeated-invocation behaviour.

## Decision 8: Keep native speech and external services outside the plugin

- **Decision**: The bundle contains no speech synthesis, audio controls,
  network client, telemetry, external account, or API-key handling. It only
  presents a document that iOS Accessibility Reader can consume.
- **Rationale**: This is the feature's privacy, reliability, latency, and cost
  boundary. Apple retains control of Accessibility Reader invocation, playback,
  voice, and Autoplay.
- **Alternatives considered**: Cloud or local plugin-owned speech duplicates
  platform functionality and changes the approved product scope.
- **Source**: [Apple Accessibility Reader instructions](https://support.apple.com/guide/iphone/read-listen-text-apps-accessibility-reader-iph406a46ab8/26/ios/26).

## Decision 9: Use host-relative styling and semantic accessibility

- **Decision**: Style the modal with Obsidian CSS variables and `rem` units.
  Keep the article in ordinary document flow with one heading hierarchy,
  selectable text, visible focus on the host close control, and no colour-only
  meaning. The modal chrome stays outside the article.
- **Rationale**: This respects user themes and font scaling while separating
  document content from controls.
- **Alternatives considered**: A fully custom visual system adds contrast and
  scaling risks. Hiding the host close control from accessibility would strand
  screen-reader users.

## Decision 10: Use proportionate automated and physical-device evidence

- **Decision**: Use Node's built-in test runner for pure snapshot,
  normalization, ordering, failure, and session-race behaviour; use build and
  manifest contract checks for distributable output; reserve Obsidian rendering
  fidelity, Accessibility Reader discovery, five-second performance, and Help
  usability for later physical-device user tests.
- **Resource behaviour**: Keep at most one source snapshot and one detached
  rendered tree, move rather than clone normalized nodes into the article, and
  release source, parser, and render-owner references as soon as their lifecycle
  permits. Peak storage is linear in source plus rendered DOM size. Obsidian's
  public renderer executes on the host's main thread, so the design does not
  claim background rendering or uninterrupted interaction during preparation.
  Physical-device test design must record elapsed presentation time, observable
  interaction loss, and operating-system memory termination for the
  100,000-word fixture. A timeout, renderer failure, or memory termination is a
  failed performance result; the plugin must never publish a partial article.
- **Rationale**: Stable logic deserves retained regression evidence. A mocked
  Apple accessibility service or source-text grep would not prove the
  user-visible behaviour.
- **Alternatives considered**: Playwright cannot reproduce Obsidian iOS or
  Accessibility Reader and would add an unjustified browser-test architecture.
  Manual-only testing would leave deterministic transformation regressions
  unprotected.

## Decision 11: Provide a repository-owned vulnerability gate

- **Decision**: `make vulncheck` runs `node scripts/vulncheck.mjs`. The wrapper
  verifies that `package-lock.json` exists, invokes `npm audit --json` without a
  shell, validates the report, and fails on registry failure, malformed output,
  a stale or incomplete lock, or any non-exempt vulnerability in runtime or
  build-affecting development dependencies.
- **Rationale**: This satisfies the deployable-application security gate while
  keeping vulnerability scanning separate from `make test`.
- **Exception mechanism**: An exception is an exact vulnerability identifier
  and package pair in `security/vulnerability-exceptions.json`, with human
  approver, rationale, reachability evidence, compensating control, and expiry.
  It also records `scannerConfiguration` with the exact value
  `scripts/vulncheck.mjs:npm-audit-json-all-v1`; the wrapper validates that
  value against its fixed all-dependency `npm audit --json` invocation and
  exception-application path. Missing, mismatched, or expired fields fail
  closed. The file is absent when no exception exists.
- **Alternatives considered**: Raw `npm audit` lacks the project's exact
  exception schema. `npm audit fix` mutates dependencies and is prohibited.

## Decision 12: Defer marketplace submission and licensing authority

- **Decision**: Prepare `manifest.json` and README publication copy during
  implementation, but do not create a remote, publish a release, submit to the
  Community Plugins catalogue, or select a licence in this phase.
- **Rationale**: The specification reserves marketplace publication for later
  human authorization. Licence selection is a human legal decision and is not
  necessary to validate the reader locally.
- **Alternatives considered**: Choosing a licence or submitting automatically
  would exceed the approved authority.

## Decision 13: Provide the canonical Make synchronization entry point

- **Decision**: The project Makefile provides `sync` in addition to `lint`,
  `test`, `build`, and `vulncheck`. It implements the SDLC Git contract exactly:
  stage the whole worktree, commit staged changes when present using
  `COMMIT_MESSAGE` or its `chore: sync` default, then pull and push, stopping on
  the first failure.
- **Rationale**: Every Make-based Git software project must expose the canonical
  operator-facing synchronization target. This is a documented future
  interface, not authorization for an agent to invoke it.
- **Alternatives considered**: Omitting `sync` would violate the selected Git
  standard. A project-specific alias would create a competing operator
  contract.
