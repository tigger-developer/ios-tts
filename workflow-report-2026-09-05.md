# Workflow Report: 2026-09-05

## Purpose

This report records what I did after the user invoked `$speckit-tasks`, what
happened during that work, which workflow instructions led to those actions,
and why I later described the result as disproportionate for a straightforward
Obsidian plugin.

It is a record of the workflow. It is not a fresh audit or an analysis of how
the SDLC should be changed.

## Starting authority and state

- The working directory was `/Users/tigger/notes/.obsidian/plugins/ios-tts`.
- The repository was on `master`, ahead of `origin/master` by six commits.
- The working tree was clean before task generation began.
- The latest commit was `612a129 docs: record design sign-off`.
- `specs/001-full-document-reader/audits.md` recorded operator design sign-off
  on 2026-09-05.
- The user then invoked `$speckit-tasks`, authorizing the task and test-design
  phase. This did not authorize implementation.
- During task generation, the user added that low-value tests were unwanted and
  that user testing would be a critical element of the solution.

## Instructions and project material I loaded

I read the following before generating tasks:

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

I checked that `.specify/extensions.yml` was absent, so there were no task hooks
to run.

## Task-generation work

I ran `.specify/scripts/bash/setup-tasks.sh --json`, as required by the task
skill. It stopped with this error:

```text
Error: PyYAML is required to resolve preset template composition
```

It then reported that the task template was not found. I separately confirmed
that `.specify/templates/tasks-template.md` existed and that the active preset
did not provide a replacement task template. I therefore used the core task
template manually.

I created:

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

## How I applied the instruction about low-value tests

I made physical iOS testing the principal evidence for behaviour owned by iOS
and Obsidian. In particular, the task design does not propose:

- a mock implementation of Accessibility Reader;
- an automated imitation of native speech playback;
- a browser framework solely for this plugin;
- persistent regression tests that assert prose wording by searching source
  files; or
- metered external TTS calls in the automated test suite.

I retained automated tests for deterministic plugin-owned behaviour, including
snapshot capture, document normalization, replacement of stale sessions,
failure handling, distributable contracts, and the repository-owned
vulnerability-check command.

I specified physical iOS user tests for native document discovery, reading
order, the three-action routine, performance on a 100,000-word note, source and
privacy safety, and first-use Help comprehension.

## Checks performed before the test audit

I:

- processed the new technical documentation through `sanitize`;
- ran `git diff --check`;
- checked the task checklist format;
- checked that task identifiers ran from T001 through T044;
- checked requirement references across the task and validation documents; and
- calculated SHA-256 hashes for the two generated files before each audit
  revision.

Two command mistakes occurred during these checks:

- I initially invoked `sanitize --compare`, which is not a supported option.
  The command exited with an error and made no change. I then used `sanitize`
  through standard input and compared its output with the source files.
- An initial task-count command inherited a local ripgrep configuration and
  reported 70 matching output lines because context lines were included. I
  repeated the check with ripgrep configuration disabled and confirmed 44 task
  entries.

## Independent test-audit sequence

The task skill required an independent `audit-tests` PASS or an effective
PROVISIONAL receipt before implementation. The SDLC autonomous-convergence rule
required me to remediate blocking findings and submit a fresh audit without
handing back between attempts.

### Service incident before attempt 1

The first audit process produced no retrievable result. When I tried to poll it,
the process identifier was no longer known. I treated that as a service
incident, not as a PASS, FAIL, or audit attempt, and reran the unchanged audit.

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

I revised the tasks and validation record to address all five points. This added
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

I revised the task and validation documents again. I added current-content
replacement assertions, explicit structure-by-structure checks, fail-closed
host-boundary evidence, a bounded comparison with standard Obsidian rendering,
subprocess testing through `make vulncheck`, and deterministic fixture metadata.

### Invalid audit report

The next audit process returned a proposed PROVISIONAL condition, but the audit
runner rejected its own output because the condition did not satisfy the
machine-readable correction and `VERIFY` format. I treated this as another
service incident rather than an audit result and retried the unchanged files.

### Valid attempt 3: FAIL

The same auditor reported one blocking finding and one advisory:

- the first-use Help test did not explicitly require evidence of both Settings
  paths, the triple-click side-button example, and the Control Centre
  alternative; and
- the parallel-work example still named the old unit-test path for the
  vulnerability-wrapper test instead of its integration-test path.

The user interrupted the workflow before I applied those two corrections.

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
- I did not start implementation, run product tests, invoke a physical-device
  user test, publish the plugin, select a licence, or submit it to the Obsidian
  marketplace.

## Why I described the result as disproportionate

I said:

> The plugin is simple; I let the assurance workflow become disproportionate.

I said this because the task-design artefacts and audit loop had become much
larger and more detailed than the central product action: open a transient view
containing the complete current note, then let the user invoke native iOS
Accessibility Reader.

The visible signs of that disproportion were:

- 44 tasks before implementation had begun;
- four separate physical-device user-test records plus a desktop one-off test
  and a separate security gate;
- repeated expansion of test procedures to name every individual structure,
  action, setting, fixture property, cleanup step, and evidence field;
- three valid failed audits and two audit-service incidents before the task
  phase reached a handback; and
- increasingly detailed validation procedures, including five repetitions of
  the three-action flow and paired 60-second network-observation windows.

## Workflow instructions that led me down that path

The following instructions materially shaped what I did:

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

Those rules explain why I continued adding explicit traceability and audit
evidence instead of returning a short task list after the first draft.

They do not themselves prescribe 44 tasks, five three-action repetitions, four
user-test entries, or 60-second comparison windows. Those were specific choices
I made while translating the specification and responding to the auditor's
findings. That is why I said that **I let** the workflow become disproportionate,
rather than saying that the SDLC alone required this exact result.
