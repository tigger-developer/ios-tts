# Workflow Report: 2026-09-05

## Purpose

Historical record of task generation, test design and review on 2026-09-05.
The scope and workflow below predate W003 and do not define current requirements.

## Starting state

- The working directory was `/Users/tigger/notes/.obsidian/plugins/ios-tts`.
- The repository was on `master`, ahead of `origin/master` by six commits.
- The working tree was clean before task generation began.
- The latest commit was `612a129 docs: record design sign-off`.
- `specs/001-full-document-reader/audits.md` recorded design approval
  on 2026-09-05.
- Task generation and test design were authorized; implementation was excluded.
- Test scope prioritized native user tests and excluded low-value automation.

## Reference material

Task generation used the following references:

- the supplied `AGENTS.md` instructions;
- `~/.agents/sdlc/MAIN.md`;
- `~/.agents/sdlc/AUDITS.md`;
- `~/.agents/sdlc/TESTING.md`;
- `~/.agents/sdlc/SECURITY.md`;
- `~/.agents/sdlc/DOCUMENTATION.md`;
- `~/.agents/sdlc/ISSUES.md`;
- `~/.agents/sdlc/CODING.md`;
- `~/.agents/sdlc/GIT.md`;
- `~/.agents/sdlc/technologies/JAVASCRIPT.md`;
- `~/.agents/sdlc/technologies/WEB.md`;
- `~/.agents/sdlc/technologies/NODE.md`;
- `.agents/skills/speckit-tasks/SKILL.md`;
- `.agents/skills/audit-tests/SKILL.md`;
- `.specify/memory/constitution.md`;
- the feature specification, plan, research, data model, UI contract,
  quickstart, and existing audit record;
- the project README and task template; and
- the relevant project memory record and earlier specification rollout
  summary.

No task hooks were configured: `.specify/extensions.yml` was absent.

## Task-generation work

The required `.specify/scripts/bash/setup-tasks.sh --json` command failed:

```text
Error: PyYAML is required to resolve preset template composition
```

The command also reported that the task template was not found.
`.specify/templates/tasks-template.md` existed, and the active preset had no
replacement task template. Task generation used the core template manually.

Generated files:

- `specs/001-full-document-reader/tasks.md`; and
- `specs/001-full-document-reader/validation.md`.

The generated task document currently contains 44 tasks, numbered T001 through
T044. It divides the work into setup, foundational test support, four user-story
phases, and cross-cutting verification.

The validation record currently contains:

- one automated-evidence record;
- one separate dependency-vulnerability security gate;
- one desktop one-off test; and
- four physical-device user tests.

All validation entries remain `PENDING` because no implementation or final
validation was authorized or performed.

## Test scope

Physical iOS testing provided the planned evidence for behaviour owned by iOS
and Obsidian. In particular, the task design does not propose:

- a mock implementation of Accessibility Reader;
- an automated imitation of native speech playback;
- a browser framework solely for this plugin;
- persistent regression tests that assert prose wording by searching source
  files; or
- metered external TTS calls in the automated test suite.

Automated test definitions covered deterministic plugin-owned behaviour, including
snapshot capture, document normalization, replacement of stale sessions,
failure handling, distributable contracts, and the repository-owned
vulnerability-check command.

Physical iOS user-test definitions covered native document discovery, reading
order, the three-action routine, performance on a 100,000-word note, source and
privacy safety, and first-use Help comprehension.

## Checks performed before the test audit

The checks:

- processed the new technical documentation through `sanitize`;
- ran `git diff --check`;
- checked the task checklist format;
- checked that task identifiers ran from T001 through T044;
- checked requirement references across the task and validation documents; and
- calculated SHA-256 hashes for the two generated files before each audit
  revision.

Two command mistakes occurred during these checks:

- `sanitize --compare` failed because the option is unsupported and changed no files.
  Running `sanitize` through standard input allowed output comparison with source.
- An initial task-count command inherited a local ripgrep configuration and
  reported 70 matching output lines because context lines were included.
  Repeating with ripgrep configuration disabled confirmed 44 task entries.

## Independent test-audit sequence

The task skill required an independent `audit-tests` PASS or an effective
PROVISIONAL receipt before implementation. The SDLC autonomous-convergence rule
required remediation and a fresh audit after blocking findings.

### Service incident before attempt 1

The first audit process produced no retrievable result; its process identifier
was unavailable at polling. This was a service incident, excluded from audit
attempt counts. The unchanged audit was retried.

### Valid attempt 1: FAIL

The auditor was `openai-codex` using `gpt-5.6-luna`. It reported four blocking
findings and one advisory:

- no explicit observation of the plugin button's accessible name;
- no bounded repetition count supporting the claim that every baseline session
  uses exactly three actions;
- no explicit cleanup for disposable vaults, fixtures, and network-observation
  state;
- no stated expected notice for the null `MarkdownView.file` failure branch;
  and
- no explicit rationale for omitting migration tests.

The revised tasks and validation record addressed all five points by adding
a VoiceOver accessible-name observation, five baseline repetitions of the
three-action flow, teardown requirements, a specific null-file failure
assertion, and a statement that migration testing was not applicable because
the feature stores no persistent reader state.

### Valid attempt 2: FAIL

The same auditor reported four blocking findings and one advisory:

- no test changed the active note between reader invocations and verified that
  only the new title and body appeared;
- the test plan did not individually enumerate every Markdown structure named
  in the specification;
- the security comparison did not define reproducible evidence for additional
  scripts, privileged access, or network requests relative to standard Obsidian
  rendering;
- the vulnerability-wrapper test did not explicitly exercise the public
  `make vulncheck` process boundary; and
- the 100,000-word fixture record lacked generator parameters, seed, and exact
  word count.

The next revision added current-content
replacement assertions, explicit structure-by-structure checks, fail-closed
host-boundary evidence, a bounded comparison with standard Obsidian rendering,
subprocess testing through `make vulncheck`, and deterministic fixture metadata.

### Invalid audit report

The next audit process returned a proposed PROVISIONAL condition, but the audit
runner rejected its own output because the condition did not satisfy the
machine-readable correction and `VERIFY` format. This was a service incident,
excluded from verdicts; the unchanged files were retried.

### Valid attempt 3: FAIL

The same auditor reported one blocking finding and one advisory:

- the first-use Help test did not explicitly require evidence of both Settings
  paths, the triple-click side-button example, and the Control Centre
  alternative; and
- the parallel-work example still named the old unit-test path for the
  vulnerability-wrapper test instead of its integration-test path.

The workflow stopped before those two corrections were applied.

## State when the workflow was interrupted

- `tasks.md` and `validation.md` exist as untracked working-tree files.
- Their current SHA-256 hashes are:
  - `tasks.md`:
    `07931563c5f84bc712584e437cf934848d49565b6d4e879199d1c70d36514bd1`;
  - `validation.md`:
    `632bab009286a8bc3894f5cc684b1b3094408494f149f921eb482e6d6f9e0d12`.
- The current test-design verdict is FAIL after three valid audit attempts.
- There were also two service incidents that were not counted as audit
  attempts.
- The final blocking Help-evidence finding and stale example path remain
  uncorrected.
- The audit attempts have not been appended to
  `specs/001-full-document-reader/audits.md`.
- No implementation, product testing, physical-device testing, publication,
  licence selection or marketplace submission took place.

## Scope expansion

The task design expanded beyond the central product action: open a transient
view containing the complete current note for native iOS Accessibility Reader.
The recorded expansion comprised:

- 44 tasks before implementation had begun;
- four separate physical-device user-test records plus a desktop one-off test
  and a separate security gate;
- repeated expansion of test procedures to name every individual structure,
  action, setting, fixture property, cleanup step, and evidence field;
- three valid failed audits and two audit-service incidents before the task
  phase reached a handback; and
- increasingly detailed validation procedures, including five repetitions of
  the three-action flow and paired 60-second network-observation windows.

## Applicable workflow requirements

The task-generation workflow applied these requirements:

- `.agents/skills/speckit-tasks/SKILL.md` requires task coverage for
  specification evidence, errors and boundaries, documentation, migration,
  security, and human validation where relevant.
- The same skill requires a separate `make vulncheck` security gate for a
  deployable application.
- It requires selection of every applicable test type, RED-before-code ordering
  for retained automated tests, a `validation.md` record for one-off and user
  tests, and tasks that later record their results.
- It requires a current `audit-tests` PASS or effective PROVISIONAL receipt
  before implementation and directs the agent to converge under the autonomous
  audit contract before requesting sign-off.
- Its output structure requires setup and foundational phases, one phase per
  user story, independent test criteria, file paths, dependencies, parallel
  examples, and an MVP strategy.
- `~/.agents/sdlc/TESTING.md` requires compound requirements to be checked
  condition by condition, including failures, bounds, security, repetition,
  compatibility, migration, and human judgement where relevant.
- The testing standard requires planned one-off and user tests to be recorded
  before implementation with identifiers, traceability, expected results,
  procedures, and `PENDING` status.
- `~/.agents/sdlc/AUDITS.md` requires remediation and fresh audit submission
  after a FAIL and normally prevents handback until PASS, effective
  PROVISIONAL, a fifth failed attempt, or a human-controlled blocker.

These rules required traceability and audit evidence. They did not prescribe
44 tasks, five three-action repetitions, four user-test entries or 60-second
comparison windows. Those quantities were specific test-design choices.
