# Quickstart: Full Document Reader Validation

This guide describes the intended validation path after implementation. It does
not record test results.

## Prerequisites

- Node.js 24.20.0 LTS.
- npm 12.0.2.
- Obsidian 1.13.0 or later for build-contract and desktop smoke checks.
- An iPhone or iPad running iOS 26 or later for Accessibility Reader evidence.
- A disposable test vault containing the representative notes defined in
  `spec.md`.

## Install locked development dependencies

```sh
npm ci
```

Expected result: npm installs exactly the committed lockfile graph and exits
successfully without changing `package.json` or `package-lock.json`.

## Run static checks

```sh
make lint
```

Expected result: formatting, ESLint, and strict TypeScript checks exit zero with
no warning hidden or downgraded.

## Run behavioural regression tests

```sh
make test
```

Expected result: snapshot, property-ordering, reference-normalization,
single-session, failure, manifest, and bundle contract tests pass. This target
does not run metered services, npm audit, or physical-device checks.

## Build the plugin

```sh
make build
```

Expected result: esbuild produces root `main.js`; `manifest.json` remains
mobile-compatible and names Obsidian 1.13.0 as the minimum version.

## Run the vulnerability gate

```sh
make vulncheck
```

Expected result: the repository-owned wrapper validates `package-lock.json`,
obtains and validates npm's audit report, and exits zero only when every finding
is absent or covered by a current exact human-approved exception. The command
makes no source, dependency, lockfile, or configuration change.

## Load in a disposable vault

Because this repository is already placed at an Obsidian plugin path, reload
Obsidian after building and enable **Full Document Reader** under Community
plugins. Use a disposable vault or synthetic notes for verification.

Expected desktop result: the plugin loads without Node.js or Electron warnings,
and no reader ribbon button or command appears. Desktop is a load-boundary smoke
check, not a supported reader platform.

Expected iOS result: the plugin registers **Open full document reader**.

## Configure Accessibility Reader

1. Open the plugin's **How to use** settings page and confirm that the full
   setup and routine instructions are present.
2. Follow the linked Apple instructions to enable Accessibility Reader.
3. Assign Accessibility Reader under **Settings > Accessibility > Accessibility
   Shortcut**.
4. For the baseline flow, make it the only assigned accessibility feature and
   leave Autoplay off.

Expected result: the Help page is discoverable without external guidance and
the iOS shortcut is ready for the three-action routine.

## Exercise the three-action flow

For each representative supported note:

1. Press **Open full document reader**.
2. Invoke the Accessibility Shortcut, using the triple-click side-button method
   for the baseline.
3. Press **Play**.

Expected result: Accessibility Reader discovers one document, starts at the
title, continues through visible properties and body in logical order, and can
reach the final readable segment.

## Boundary checks

- Confirm a 100,000-word note becomes fully available within five seconds and
  remains readable through its final segment.
- Confirm empty and frontmatter-only notes show no stale content.
- Compare the plugin-added reader title with the title Obsidian displays for the
  active view. Confirm a body-initial level-one heading remains a distinct body
  heading rather than replacing or duplicating the plugin-added title.
- Compare the reader's visible-property sequence with the active note's
  **Properties in document** rows and confirm that it matches without
  plugin-owned sorting or grouping.
- Confirm null-valued properties and empty arrays or mappings speak the property
  name without a placeholder or invented value.
- Confirm ordinary links retain labels without navigation and embedded notes do
  not contribute target content.
- Confirm labelled media contributes only its author-supplied description and
  unlabelled media contributes nothing.
- Confirm task state remains readable but cannot edit the source.
- Invoke twice during a slow render and confirm only the latest snapshot opens.
- Invoke with no active Markdown view and confirm the unsupported-state notice.
- Expose an active `.md` `FileView` that is not a `MarkdownView` through a test
  host and confirm the presentation-failure notice rather than either
  unsupported-state notice.
- While a reader is open, invoke from an unsupported active state and confirm
  the old reader closes before the notice appears.
- Confirm no plugin-added section label such as "Properties" or "Document"
  interrupts the title, properties, and body sequence.
- Confirm the source note and metadata are byte-for-byte unchanged after use.
- Monitor network activity and confirm the plugin makes no TTS, telemetry, or
  note-content request.
- Record observable interaction loss and any operating-system memory termination
  while preparing the 100,000-word fixture. Either is retained as failed
  performance evidence, never silently waived.

Physical-device, performance, and human accessibility observations must later
be formalized in `validation.md` by the test-design phase and remain `PENDING`
until actually observed on the implementation revision.
