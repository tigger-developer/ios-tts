# Validation: Full Document Reader

This record defines non-automated acceptance evidence before implementation.
Every entry remains `PENDING` until observed against the current audited
implementation revision. An implementation claim, checked task, or audit
verdict does not substitute for the result.

## Test Selection

- Physical iOS user tests are the principal evidence because native
  Accessibility Reader discovery, spoken order, performance, and first-use
  comprehension cannot be reproduced honestly by Node.js or a mocked browser.
- One desktop smoke test covers only the unsupported-platform load boundary.
- Stable pure logic and distributable contracts remain automated in
  `make test`; their later results are recorded separately below.
- `make vulncheck` remains a security gate, not a behavioural test.
- Migration testing is not applicable because the feature introduces no
  persisted reader state, stored schema, or migration path.

## Automated Evidence

- **Scope**: `make lint`, `make test`, and `make build`.
- **Status**: PENDING
- **Required record**: Tested revision, environment, command results, warning
  status, generated artefact outcome, and the retained null-file assertion that
  the approved presentation-failure notice appears without stale content or
  source mutation. Record zero undeclared privileged, script, or network
  capability requests from the fail-closed host boundary tests.

## Security Gate Evidence

### SG-001 - Locked npm dependency vulnerability gate

- **Category**: Security gate, separate from behavioural tests.
- **Requirements and tasks**: Application Security Standards; T029 -
  vulnerability-wrapper regression design; T033 - wrapper implementation; T038
  - final gate execution.
- **Status**: PENDING
- **Expected result**: `make vulncheck` identifies `npm audit --json` and
  `package-lock.json`, validates the complete report, lists every finding and
  exact applied exception, changes no managed file, and exits zero only with no
  unapproved vulnerability.
- **Procedure and conditions**: Run after effective `audit-code` PASS with the
  committed lockfile and available npm advisory service. Compare Git status
  before and after. A missing scanner, unavailable or malformed advisory
  response, stale lock, expired or mismatched exception, mutation, or finding
  without an exact current human-approved exception is FAIL.

## One-Off Tests

### OT-001 - Desktop load boundary

- **Category**: One-off test.
- **Requirements and tasks**: Platform contract; T039 - desktop smoke
  execution.
- **Status**: PENDING
- **Expected result**: On Obsidian 1.13.0 or later for desktop, the built plugin
  loads without Node.js or Electron warnings and exposes no reader ribbon button
  or command.
- **Procedure and conditions**: Install the audited build in a disposable
  desktop vault, enable it, inspect the ribbon and command palette, reload once,
  and inspect the developer console. Remove the disposable vault through the
  platform's recoverable deletion mechanism and record that no test vault or
  plugin files remain. Do not infer iOS behaviour from this test.

## User Tests

### UT-001 - Complete native reading and performance

- **Category**: Critical user test.
- **Requirements and tasks**: FR-002 - complete readable content; FR-003 -
  current content; FR-004 - logical order; FR-005 - readable semantics; FR-006
  - one continuous document; FR-007 - document-only sequence; FR-011 - authored
  labels; FR-014 - no target content; FR-015 - no invented media text; FR-017 -
  title and property order; FR-018 - task state; SC-001 - complete long-note
  access; SC-002 - availability within five seconds; SC-003 - native reading;
  SC-005 - usable order; T040 - physical execution.
- **Status**: PENDING
- **Expected result**: Accessibility Reader discovers one document whose first
  readable node is the exact Obsidian-displayed title, followed by every visible
  property in Obsidian's order and the complete semantic body through its final
  segment. A 100,000-word note is fully available within five seconds without
  truncation, partial publication, operating-system memory termination, or
  unacceptable interaction loss.
- **Procedure and conditions**: On a physical iPhone running iOS 26 or later
  with Obsidian 1.13.0 or later, use the disposable fixture vault to read the
  empty, frontmatter-only, all-structure, reference/media, and generated
  100,000-word notes. For headings, paragraphs, lists, quotations, links, code
  blocks, tables, callouts, footnotes, task-list checkboxes, tags, maths, and
  readable inline HTML, record the expected position and semantic reading, then
  record PASS or FAIL for each observed position and result. Compare title and
  property order with Obsidian, listen through the final segment, and inspect
  authored link and media labels, unlabelled media, embedded-reference
  boundaries, task state, and removal of authoring syntax. Time presentation
  availability and record device, OS, Obsidian version, elapsed time,
  responsiveness, memory outcome, generator version and parameters,
  deterministic seed, and exact generated word count. Any missing, reordered,
  invented, target-only, control, status, plugin-added section text, or
  unrecorded representative structure is FAIL. Remove the disposable fixture
  vault and generated 100,000-word note after evidence capture, and record
  successful teardown.

### UT-002 - Native three-action flow

- **Category**: Critical user test.
- **Requirements and tasks**: FR-001 - accessible button; FR-006 - native
  discovery; FR-012 - native speech ownership; FR-022 - three-action guidance;
  FR-023 - chooser guidance; FR-024 - optional Autoplay; SC-003 - native reading;
  SC-007 - three-action routine; T041 - physical execution.
- **Status**: PENDING
- **Expected result**: With Accessibility Reader as the only assigned shortcut
  feature and Autoplay off, speech begins only after exactly three user actions:
  press **Open full document reader**, invoke the shortcut, and press **Play**.
  Every one of five baseline repetitions meets that count. VoiceOver announces
  the plugin button as **Open full document reader**. The plugin never invokes
  Accessibility Reader or starts speech itself.
- **Procedure and conditions**: On the same supported physical device, enable
  VoiceOver, focus the plugin button, and record its announced accessible name.
  Then disable VoiceOver, enable Accessibility Reader, assign it alone to the
  accessibility shortcut, disable Autoplay, and execute five independent
  baseline reading sessions. Every session must record exactly three actions
  before speech, otherwise SC-007 is FAIL. Repeat with another
  accessibility feature assigned to confirm the chooser caveat, then enable
  Autoplay to confirm it is an optional system-owned variation. Record observed
  action counts and native controls. Restore the device's previous VoiceOver,
  shortcut-assignment, and Autoplay settings, and record successful teardown.

### UT-003 - Source, privacy, and failure safety

- **Category**: Critical user test.
- **Requirements and tasks**: FR-008 - read-only operation; FR-009 - local
  content; FR-010 - unsupported state; FR-013 - presentation failure; FR-016 -
  standard-rendering security; FR-026 - remote independence; FR-028 - repeated
  invocation; SC-004 - source and privacy; SC-009 - no metered TTS; T042 -
  physical execution.
- **Status**: PENDING
- **Expected result**: Reader use changes no source or metadata, sends no note
  content to a plugin-owned service, makes no metered TTS call, waits for no
  remote speech response, exposes no stale content, and leaves at most one
  current presentation. Missing, unsupported, and failed states show their
  approved notices without a vault path, content, or exception detail. Relative
  to Obsidian's standard rendering of the same controlled note, the reader adds
  no script execution, privileged host access, or network request.
- **Procedure and conditions**: In a disposable vault on the supported physical
  device, record byte hashes and metadata before and after open, close, repeat,
  unsupported-file, failed-render, inline-HTML, and external-media cases. The
  retained automated T026 assertion covers the host-only null-file branch and
  requires the approved presentation-failure notice without stale content or
  source mutation.
  From the same clean application state and network conditions, first open the
  controlled note in standard Obsidian reading view for 60 seconds, then restart
  to the same state and open the plugin reader for 60 seconds. In both windows,
  record controlled script-canary state, privileged-access indicators, and
  every request's destination and initiator. Reconcile every plugin-window
  request to the same-note standard-rendering baseline; any added execution,
  privileged access, or unmatched request is FAIL. Retain the automated
  fail-closed host-boundary record as the privileged-capability evidence.
  Invoke twice during slow preparation and invoke an unsupported state while a
  reader is open. Record hashes, notices, open-reader count, the comparison,
  and whether stale content appeared. Stop the bounded observation, remove its
  capture state and the disposable vault, and record successful teardown.

### UT-004 - First-use Help and public-copy clarity

- **Category**: Critical user test.
- **Requirements and tasks**: FR-019 - persistent Help; FR-020 - enablement
  path; FR-021 - shortcut example and alternatives; FR-022 - routine guidance;
  FR-023 - chooser guidance; FR-024 - optional Autoplay; FR-025 - publishable
  value proposition; FR-027 - Help isolation; SC-006 - guided first use; SC-008
  - publishable clarity; T043 - human execution.
- **Status**: PENDING
- **Expected result**: Without external guidance, a first-time user finds the
  persistent **How to use** page, enables and assigns Accessibility Reader, and
  starts full-note playback within five minutes. From Help, README, and plugin
  metadata, the user identifies the three actions, triple-click example,
  alternatives, chooser caveat, optional Autoplay, native speech ownership, and
  absence of API keys, accounts, plugin pay-per-use charges, metered TTS, and
  remote speech-processing delay.
- **Procedure and conditions**: Use a first-time participant on supported iOS
  in disposable test state with the plugin installed but Accessibility Reader
  unconfigured. Provide no coaching beyond asking the participant to use the
  plugin to hear the complete open note. Time the attempt, observe navigation
  and misunderstandings, then ask the participant to explain the product
  boundary from the public copy. Record device, versions, elapsed time, tester
  identity, observations, and the participant's understanding. Confirm Help
  remains outside the document reading sequence. Restore prior Accessibility
  settings, remove the disposable test data, and record successful teardown.

## Result Recording Rules

- Replace PENDING only with an observed PASS, FAIL, or SUPERSEDED result.
- Add the tested commit, environment, exact observations, supporting evidence,
  and tester or human authority to every completed entry.
- A later relevant implementation change makes only the affected result stale;
  preserve it as SUPERSEDED and record the replacement.
- Any required PENDING, FAIL, missing, or materially stale entry blocks feature
  closure.
