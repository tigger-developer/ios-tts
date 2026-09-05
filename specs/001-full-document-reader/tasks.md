# Tasks: Full Document Reader

**Input**: Approved design documents from
`/specs/001-full-document-reader/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`,
`contracts/ui-contract.md`, `quickstart.md`, and current Design Audit Attempt 6
PASS with operator sign-off

**Tests**: Retained automated tests cover only stable, objective logic and
build contracts. Physical iOS user testing is the principal acceptance evidence
for native discovery, spoken order, completeness, performance, and Help
usability.

**Organization**: Tasks are grouped by user story. User Story 4 is scheduled
before User Story 3 because it has Priority P2 in the approved specification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: May proceed in parallel because it changes different files and has
  no dependency on an incomplete sibling task.
- **[Story]**: Maps the task to the approved user story.
- Every checklist item names its affected file path.

## Test Selection

- **Automated regression**: Selected for snapshot and property conversion,
  document normalization, reader-session replacement and failure states,
  manifest and bundle contracts, and vulnerability-report handling. These are
  deterministic boundaries with meaningful regression risk.
- **One-off test**: Selected for loading the built plugin on desktop and
  confirming its unsupported-platform boundary. Retaining a desktop host test
  harness would add no proportionate regression value.
- **User tests**: Selected as the critical evidence for physical iOS
  Accessibility Reader discovery, reading sequence, performance, native speech
  ownership, source and privacy safety, and first-use Help.
- **Not selected**: No source-grep behavioural tests, prose-string regression
  tests, mocked Accessibility Reader, Playwright or other browser framework, or
  automated `make sync` execution. Those approaches would not reproduce the
  user boundary or would add disproportionate and potentially mutating
  machinery. The exact `make sync` recipe receives code review and is invoked
  only under separate synchronization authority.

## Phase 1: Setup

**Purpose**: Establish the reproducible TypeScript, npm, build, static-analysis,
and repository entry-point baseline.

- [ ] T001 Extend `.gitignore` with `node_modules/`, generated test output, build caches, and complete `.agent/`, `.agents/`, `.claude/`, and `.codex/` exclusions while preserving `.env`
- [ ] T002 Create pinned Node.js 24.20.0 and npm 12.0.2 project metadata and reviewed development dependencies in `.nvmrc`, `package.json`, and `package-lock.json`
- [ ] T003 Configure strict ECMAScript 2022 application and test compilation in `tsconfig.json` and `tsconfig.test.json`, with Node.js excluded from the plugin runtime types
- [ ] T004 [P] Configure type-aware ESLint, Prettier, and Stylelint without warning suppression in `eslint.config.mjs`, `.prettierrc.json`, and `stylelint.config.mjs`
- [ ] T005 Configure reproducible build, lint, test, idempotent local install, vulnerability, and exact canonical synchronization entry points in `esbuild.config.mjs`, `package.json`, and `Makefile`

**Checkpoint**: Tooling is pinned and repository commands exist; no plugin
behaviour has been implemented.

---

## Phase 2: Foundational Test Support

**Purpose**: Supply realistic synthetic inputs and narrow host-boundary fakes
without adding a browser or Obsidian test framework.

- [ ] T006 [P] Create bounded deterministic synthetic note generators for empty, frontmatter-only, all-structure, reference/media, malformed-property, and exact 100,000-word cases, exposing generator version, parameters, seed, and word count in `tests/fixtures/representative-notes.ts`
- [ ] T007 [P] Create fail-closed minimal lifecycle and DOM boundary fakes that implement only the public behaviour exercised by tests and record any undeclared host, privileged, script, or network capability request in `tests/helpers/fake-host.ts` and `tests/helpers/fake-dom.ts`

**Checkpoint**: Test data contains no vault or personal content and test doubles
model only external host boundaries.

---

## Phase 3: User Story 1 - Read the complete active note (Priority: P1) MVP

**Goal**: Present the active Markdown note from its Obsidian display title
through its final readable body segment as one current, complete document.

**Independent Test**: Automated tests establish deterministic capture,
ordering, normalization, and single-session behaviour. `UT-001 - complete
native reading and performance` in `validation.md` remains the critical
physical-device acceptance test.

### Automated tests for User Story 1

> Write each test before its governed production code, run the focused test,
> and confirm RED for the intended missing behaviour rather than a harness or
> compilation fault.

- [ ] T008 [P] [US1] Write snapshot tests for current view text, exact `getDisplayText()` title, frontmatter separation, parser ordering, scalar/date/empty values, and immutable results; run them and confirm intended RED in `tests/unit/note-snapshot.test.ts`
- [ ] T009 [P] [US1] Write document tests for title-properties-body order, complete body retention, headings, paragraphs, lists, quotations, links, code blocks, tables, callouts, footnotes, task-list checkboxes, tags, maths, readable inline HTML, embeds, authored media labels, and removal of non-document controls; assert the expected semantic result and sequence for every structure, then run and confirm intended RED in `tests/unit/reader-document.test.ts`
- [ ] T010 [P] [US1] Write reader-session tests for one owned presentation, generation-token staleness, replacement during preparation or presentation, and render-owner cleanup; change `getViewData()` and `getDisplayText()` between invocations and assert that the replacement contains only the new title and body, then run and confirm intended RED in `tests/unit/reader-controller.test.ts`
- [ ] T011 [P] [US1] Write manifest and built-bundle contract tests for mobile compatibility, Obsidian 1.13.0 minimum, root `main.js`, no runtime dependency graph, and no Node.js or Electron import; run them and confirm intended RED in `tests/contract/manifest.test.ts` and `tests/contract/bundle.test.ts`

### Implementation for User Story 1

- [ ] T012 [US1] Create the mobile-compatible plugin identity and minimum-version contract in `manifest.json`
- [ ] T013 [P] [US1] Implement immutable active-view capture, frontmatter separation, property validation, exact title capture, and typed snapshot failures in `src/note-snapshot.ts`
- [ ] T014 [P] [US1] Implement semantic property values and detached rendered-body normalization without truncation or referenced-target expansion in `src/reader-document.ts`
- [ ] T015 [US1] Implement the monotonic generation-token state machine, one-modal ownership, stale-result rejection, and deterministic teardown in `src/reader-controller.ts`
- [ ] T016 [US1] Implement detached Obsidian Markdown rendering and publish-only-after-normalization modal lifecycle in `src/reader-modal.ts`
- [ ] T017 [P] [US1] Implement theme-relative, scalable, non-virtualized reader styling with visible host-control focus in `styles.css`
- [ ] T018 [US1] Register the iOS ribbon button and active-Markdown command through the shared controller while keeping `src/main.ts` lifecycle-only in `src/main.ts`
- [ ] T019 [US1] Run the focused User Story 1 tests through `Makefile`, confirm GREEN without warnings, and retain `UT-001 - complete native reading and performance` as PENDING in `specs/001-full-document-reader/validation.md`

**Checkpoint**: The built plugin can create one complete reader presentation;
native reading and performance remain explicitly unverified until `UT-001`.

---

## Phase 4: User Story 2 - Use the three-action reading flow (Priority: P2)

**Goal**: Let iOS Accessibility Reader discover the single semantic document
without the plugin invoking accessibility or owning speech playback.

**Independent Test**: `UT-002 - native three-action flow` on physical iOS 26
confirms plugin button, accessibility shortcut, and Play as the baseline flow.

**Automation rationale**: No retained test imitates Accessibility Reader or
asserts source strings. Objective article structure is covered by T009; native
discovery and speech ownership require the physical user boundary.

- [ ] T020 [US2] Finalize one `aria-labelledby` article root, implicit internal sections, selectable text, and exclusion of Help, status, navigation, and playback controls in `src/reader-modal.ts`
- [ ] T021 [US2] Create a disposable physical-device fixture vault with representative Markdown notes and setup guidance, without personal content or a committed 100,000-word file, in `tests/fixtures/vault/README.md` and `tests/fixtures/vault/notes/`

**Checkpoint**: The plugin exposes the approved native-reading boundary; its
actual discovery and playback behaviour remain PENDING for `UT-002`.

---

## Phase 5: User Story 4 - Configure and understand the reading flow (Priority: P2)

**Goal**: Provide persistent setup Help and publishable copy that explain the
native, non-metered three-action workflow accurately.

**Independent Test**: `UT-004 - first-use Help and public-copy clarity` confirms
that a first-time user can configure Accessibility Reader and understand the
value proposition without external guidance.

**Automation rationale**: No prose-string regression test is retained. The
settings registration and manifest schema have objective contract coverage;
instruction clarity and discoverability require human review.

- [ ] T022 [P] [US4] Implement `FullDocumentReaderSettingTab.getSettingDefinitions()` with a declarative **How to use** page and compiled static Help content in `src/settings-tab.ts`
- [ ] T023 [US4] Register the persistent settings tab through `Plugin.addSettingTab()` without an imperative fallback in `src/main.ts`
- [ ] T024 [US4] Replace the vision stub with public purpose, setup, three-action use, optional Autoplay, chooser caveat, privacy boundary, and marketplace-ready value proposition in `README.md`
- [ ] T025 [US4] Align concise plugin metadata with the approved complete-document and native Accessibility Reader purpose in `manifest.json`

**Checkpoint**: Help and public copy are available for human comprehension
testing; no marketplace submission or licence choice is made.

---

## Phase 6: User Story 3 - Preserve the source note (Priority: P3)

**Goal**: Keep source content and metadata unchanged, keep note content local,
and report every unsupported or failed presentation without stale disclosure.

**Independent Test**: Automated failure and boundary tests pass, while `UT-003
- source, privacy, and failure safety` confirms the physical host and network
boundary.

### Automated tests for User Story 3

> Extend the tests first and confirm each focused test fails for the intended
> missing branch before changing its production module.

- [ ] T026 [P] [US3] Extend snapshot tests for no active file, non-Markdown `FileView`, `.md` `FileView` without `MarkdownView`, null `MarkdownView.file`, invalid frontmatter values, and no write calls; assert that null `MarkdownView.file` yields the approved presentation-failure notice with no stale content or source mutation, then run and confirm intended RED in `tests/unit/note-snapshot.test.ts`
- [ ] T027 [P] [US3] Extend controller tests for unsupported replacement, preparation failure, stale failure suppression, user close, plugin unload, and content-free diagnostics; run and confirm intended RED in `tests/unit/reader-controller.test.ts`
- [ ] T028 [P] [US3] Extend normalization tests for scripts, executable attributes, nested target content, labelled and unlabelled media, links without navigation, and zero undeclared privileged, script, or network capability requests through the fail-closed boundary fakes; run and confirm intended RED in `tests/unit/reader-document.test.ts`
- [ ] T029 [P] [US3] Write isolated subprocess tests that invoke the operator-facing `make vulncheck` target with a bounded fake scanner executable at the process boundary; cover absent or stale locks, scanner failure, malformed reports, exact current exceptions, expired or mismatched exceptions, concise evidence, exit status, non-mutation, and temporary-state teardown, then run and confirm intended RED in `tests/integration/vulncheck.test.ts`

### Implementation for User Story 3

- [ ] T030 [US3] Map all active-view and parser failures to the approved notices, including null `MarkdownView.file`, without paths or note content in `src/note-snapshot.ts`
- [ ] T031 [US3] Close prior sessions before validation, suppress stale results, release on user close or unload, and preserve diagnostic causes without content in `src/reader-controller.ts`
- [ ] T032 [US3] Remove executable content and active controls, preserve authored labels only, and discard failed detached trees before attachment in `src/reader-document.ts` and `src/reader-modal.ts`
- [ ] T033 [P] [US3] Implement the direct-process, all-dependency npm audit wrapper and exact expiring exception schema in `scripts/vulncheck.mjs` and `security/vulnerability-exceptions.schema.json`
- [ ] T034 [US3] Enforce no runtime dependencies, Node.js or Electron APIs, speech engine, telemetry, or external TTS client in `package.json`, `esbuild.config.mjs`, and `src/main.ts`
- [ ] T035 [US3] Run the focused User Story 3 regression tests through `Makefile`, confirm GREEN without warnings, and retain `UT-003 - source, privacy, and failure safety` as PENDING in `specs/001-full-document-reader/validation.md`

**Checkpoint**: Deterministic source, failure, privacy, and security boundaries
have regression evidence; physical device observations remain PENDING.

---

## Phase 7: Cross-Cutting Verification and Human Validation

**Purpose**: Establish implementation evidence, audit the code, then execute
the selected environment and user tests against the audited revision.

- [ ] T036 Run `make lint`, `make test`, and `make build` against the candidate and record command, revision, result, warnings, and generated artefact outcome under Automated Evidence in `specs/001-full-document-reader/validation.md`
- [ ] T037 Obtain a current effective `audit-code` verdict for the implementation and append provider, model, hashes, verdict, findings, and dispositions to `specs/001-full-document-reader/audits.md`
- [ ] T038 After T037, run `make vulncheck` separately from behavioural tests and record scanner, `package-lock.json` input, findings or exceptions, non-mutation check, and result under Security Gate Evidence in `specs/001-full-document-reader/validation.md`
- [ ] T039 After T037, execute `OT-001 - desktop load boundary` in Obsidian 1.13.0 or later, remove the disposable desktop vault and confirm teardown, and replace its PENDING status with observed evidence in `specs/001-full-document-reader/validation.md`
- [ ] T040 After T037, execute the critical `UT-001 - complete native reading and performance` on a physical iOS 26 device, remove the fixture vault and generated long-note data and confirm teardown, and replace its PENDING status with operator evidence in `specs/001-full-document-reader/validation.md`
- [ ] T041 After T037, execute `UT-002 - native three-action flow` on a physical iOS 26 device, including the accessible-name observation and five baseline repetitions, restore the prior Accessibility settings, and replace its PENDING status with operator evidence in `specs/001-full-document-reader/validation.md`
- [ ] T042 After T037, execute `UT-003 - source, privacy, and failure safety` with a disposable vault and bounded network observation, remove the vault and network-observation state and confirm teardown, then replace its PENDING status with operator evidence in `specs/001-full-document-reader/validation.md`
- [ ] T043 After T037, execute `UT-004 - first-use Help and public-copy clarity` with a first-time user in disposable test state, restore the prior Accessibility settings and remove test data, and replace its PENDING status with named human evidence in `specs/001-full-document-reader/validation.md`
- [ ] T044 Reconcile implemented behaviour, supported versions, commands, test evidence, and remaining publication boundaries across `README.md`, `specs/001-full-document-reader/quickstart.md`, `specs/001-full-document-reader/validation.md`, and `specs/001-full-document-reader/audits.md`

**Checkpoint**: Closure remains blocked while any required validation entry is
PENDING, FAIL, missing, or stale for the audited implementation revision.

---

## Dependencies and Execution Order

### Phase dependencies

- **Setup**: No dependencies.
- **Foundational Test Support**: Depends on Setup and blocks story work.
- **User Story 1**: Depends on Foundational Test Support and supplies the core
  presentation used by User Stories 2 and 3.
- **User Story 2**: Depends on User Story 1 because native iOS must discover the
  completed reader presentation.
- **User Story 4**: Depends on Foundational Test Support and can proceed in
  parallel with User Story 1, except for its `src/main.ts` and `manifest.json`
  integration tasks.
- **User Story 3**: Depends on User Story 1's snapshot, document, controller,
  and modal boundaries.
- **Cross-Cutting Verification**: Depends on every selected story. User and
  one-off tests execute only after an effective `audit-code` PASS.

### User story completion order

```text
Setup -> Foundation -> US1 -> US2
                    |     -> US3
                    \-> US4

US1 + US2 + US4 + US3 -> automated checks -> audit-code
                       -> security gate -> one-off and user tests
```

### Within each story

- Automated tests are written and observed RED before their governed
  production change.
- The smallest coherent production change is made, followed by focused GREEN
  evidence and refactoring without losing the evidence.
- Physical user tests do not require a pre-change failure and remain PENDING
  until run against the audited implementation revision.

### Parallel opportunities

- T004 can proceed while T003 is prepared after package versions are agreed.
- T006 and T007 affect separate fixture and helper files.
- T008 through T011 affect separate test modules and can proceed together.
- T013, T014, and T017 affect independent source or style files after their
  corresponding RED tests exist.
- T022 and T024 can proceed independently of the User Story 1 source modules.
- T026 through T029 extend separate test files.
- T033 can proceed alongside T030 through T032 after its own RED test exists.

## Parallel Example: User Story 1

```text
Task: T008 - snapshot conversion tests in tests/unit/note-snapshot.test.ts
Task: T009 - document normalization tests in tests/unit/reader-document.test.ts
Task: T010 - reader-session tests in tests/unit/reader-controller.test.ts
Task: T011 - distributable contract tests in tests/contract/
```

## Parallel Example: User Story 3

```text
Task: T026 - unsupported snapshot tests in tests/unit/note-snapshot.test.ts
Task: T027 - failure lifecycle tests in tests/unit/reader-controller.test.ts
Task: T028 - executable and reference boundary tests in tests/unit/reader-document.test.ts
Task: T029 - vulnerability wrapper tests in tests/unit/vulncheck.test.ts
```

## Implementation Strategy

### MVP first

1. Complete Setup and Foundational Test Support.
2. Implement User Story 1 through RED and GREEN evidence.
3. Treat User Story 1 as the buildable MVP increment, but do not describe it as
   user-validated until critical `UT-001` and `UT-002` pass on physical iOS.

### Incremental delivery

1. Add User Story 4 Help independently once foundational tooling exists.
2. Add User Story 3 failure, privacy, and vulnerability boundaries after the
   core reader exists.
3. Run complete automated checks and `audit-code` before physical validation.
4. Run the security gate separately, then execute every PENDING one-off and
   user test against the audited revision.

## Notes

- `[P]` never permits parallel edits to the same file.
- `make test` excludes `make vulncheck`, physical devices, live network
  observation, and metered services.
- Failed or timed-out audit harness runs are recorded as service incidents, not
  PASS or FAIL evidence.
- Publication, remote creation, licence selection, and `make sync` execution
  remain outside this task phase's authority.
