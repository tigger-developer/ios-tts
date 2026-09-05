# Implementation Plan: Full Document Reader

**Branch**: `master` | **Date**: 2026-09-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from
`/specs/001-full-document-reader/spec.md`

**Note**: This plan follows the effective latest
`.specify/templates/plan-template.md`. The active preset provides no
plan-template override.

## Summary

Build a small, mobile-compatible Obsidian plugin in strict TypeScript. An iOS
ribbon button and equivalent command capture the active Markdown view, create a
single transient snapshot, render it through Obsidian's public Markdown API in
a detached container, normalize it into one read-only semantic article, and
then present it in a modal for iOS Accessibility Reader. A declarative settings
sub-page provides permanent setup help. The plugin has no runtime dependency,
network client, speech engine, or persistent note data.

## Technical Context

**Language/Version**: TypeScript 5.8.3 in strict mode, emitting ECMAScript 2022;
Node.js 24.20.0 LTS and npm 12.0.2 for development tooling only

**Primary Dependencies**: Obsidian public API 1.13.1 as a development-only peer
contract; Obsidian `Plugin`, `Platform`, `FileView`, `MarkdownView`, `MarkdownRenderer`,
`Modal`, `Notice`, `PluginSettingTab`, and declarative `SettingDefinitionPage`;
esbuild 0.25.5 for bundling; no plugin runtime dependency

**Storage**: N/A; note snapshots and reader sessions are transient, and Help
content is compiled into the plugin

**Testing**: Node's built-in test runner against TypeScript-compiled pure
modules; build and manifest contract checks; later human verification in
Obsidian 1.13+ on a physical iOS 26 device

**Target Platform**: Obsidian 1.13.0 or later on iOS 26 or later;
`isDesktopOnly: false`; desktop and Android behaviour remain outside the
feature contract

**Project Type**: Mobile-capable host-application plugin

**Performance Goals**: Present every readable segment of a representative
100,000-word note within five seconds and preserve logical order through the
final segment

**Constraints**: Read-only; offline-capable; no Node.js or Electron runtime
API; no remote TTS, telemetry, API key, account, or note-content transfer; one
reader presentation at a time; no plugin-imposed content-length limit

**Scale/Scope**: One active Markdown note and one transient reader session;
complete title, visible properties, and body; all Markdown structures rendered
by Obsidian; static settings Help and publication copy

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-design gate

- **Specification evidence**: PASS. `audits.md` attempt 9 records the current
  `audit-spec` PASS for SHA-256
  `ce50e3c57bb96e4bfb09151f4874aa0e7641d2a2e92754eb67547894a26f7715`.
- **Operator authority**: PASS. The 2026-09-05 instruction to refresh the design
  advances the audited specification into planning.
- **Complete-document accessibility**: PASS. The design builds one untruncated
  semantic article before exposing it to the native reader.
- **Platform ownership**: PASS. Obsidian owns Markdown rendering and plugin
  lifecycle; iOS owns Accessibility Reader and speech playback.
- **Privacy and security**: PASS. The runtime contains no network client,
  telemetry, external TTS dependency, or Node/Electron API.
- **Selected standards**: PASS. The design applies the constitution's SDLC,
  JavaScript/TypeScript, and Web standards. The selected JavaScript standard
  transitively applies the Node standard to npm-managed development tooling;
  Node is not the application runtime.
- **Clarifications**: PASS. Research contains no unresolved design question.

### Post-design gate

- **Traceability**: PASS. `data-model.md` and `contracts/ui-contract.md` map the
  snapshot, session, reader, Help, error, and public-copy decisions to the
  specification.
- **Boundary control**: PASS. Rendering occurs off-DOM; referenced-target
  content and non-document controls are removed before the article is attached
  to the live modal.
- **Lifecycle and repetition**: PASS. A monotonic generation token prevents a
  stale asynchronous render from replacing the latest presentation, and plugin
  unload closes the owned modal and render component.
- **Verification design**: PASS. Pure transformations receive automated tests;
  Obsidian and Accessibility Reader integration remains a physical-device user
  test to be formalized before implementation.
- **Vulnerability gate**: PASS. The project will own a fail-closed
  `make vulncheck` wrapper around npm's lockfile audit, separate from behavioural
  tests, with human-approved, expiring exceptions only.
- **Deviations**: None.

## Project Structure

### Documentation (this feature)

```text
specs/001-full-document-reader/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
├── checklists/
│   └── requirements.md
├── audits.md
├── validation.md             # Created by the later test-design phase
└── tasks.md                  # Created by the later task phase
```

### Source Code (repository root)

```text
src/
├── main.ts                   # Plugin lifecycle, ribbon button, command, settings
├── note-snapshot.ts          # Active-view capture and frontmatter separation
├── reader-controller.ts      # Single-session orchestration and race control
├── reader-document.ts        # Semantic title, property, and body assembly
├── reader-modal.ts           # Detached Markdown render and modal lifecycle
└── settings-tab.ts           # Declarative How to use settings page

tests/
├── unit/
│   ├── note-snapshot.test.ts
│   ├── reader-controller.test.ts
│   └── reader-document.test.ts
└── contract/
    ├── manifest.test.ts
    └── bundle.test.ts

scripts/
└── vulncheck.mjs             # Read-only, fail-closed npm audit wrapper

security/
└── vulnerability-exceptions.json
                               # Absent unless a current human-approved exception exists

main.js                       # Generated Obsidian bundle
manifest.json                 # Mobile-compatible plugin manifest
styles.css                    # Theme-relative reader presentation
package.json
package-lock.json
tsconfig.json
tsconfig.test.json
eslint.config.mjs
.prettierrc.json
Makefile                       # lint, test, build, vulncheck, and canonical sync targets
```

**Structure Decision**: Use the official Obsidian sample plugin's TypeScript and
esbuild shape, split only at stable boundaries: host lifecycle, snapshot
capture, reader-session ownership, semantic document construction, modal
presentation, and settings Help. Keep `main.ts` thin and keep pure snapshot and
document transformations independent of the Obsidian host for deterministic
tests.

## Complexity Tracking

No constitution violation or approved deviation is present.
