<!-- SYNC IMPACT: [OLD_VERSION] -> [CONSTITUTION_VERSION] | Principles: [CHANGES OR NONE] | Added: [SECTIONS OR NONE] | Removed: [SECTIONS OR NONE] | TODOs: [ITEMS OR NONE] -->

# [PROJECT_NAME] Constitution

<!-- SDLC-GENERATED-SCAFFOLD: editable until ratification. -->

## Engineering Standards

This project MUST comply with the following canonical standards. The standards are referenced, not copied; load only those relevant to the current operation.

- **Universal engineering behaviour:** `~/.agents/sdlc/MAIN.md`.
- **Specification and requirement quality:** `~/.agents/sdlc/ISSUES.md`.
- **Implementation and design:** `~/.agents/sdlc/CODING.md`.
- **Testing and evidence:** `~/.agents/sdlc/TESTING.md`.
- **Security and vulnerability checking:** `~/.agents/sdlc/SECURITY.md`.
- **Independent audits:** `~/.agents/sdlc/AUDITS.md`.
- **Paired development:** `~/.agents/sdlc/PAIRING.md`.
- **Documentation:** `~/.agents/sdlc/DOCUMENTATION.md`.
- **Source control:** `~/.agents/sdlc/GIT.md`.
- **JavaScript and TypeScript Standards:** `~/.agents/sdlc/technologies/JAVASCRIPT.md`.
- **Web Standards:** `~/.agents/sdlc/technologies/WEB.md`.

A deviation MUST name the standard, reason, risk, and approving authority. Silence is not a deviation.

The adopted SDLC revision is `v2.0.9`.

**Branch strategy:** `current`

Staged delivery MUST follow the phase-boundary synchronization contract in `~/.agents/sdlc/GIT.md`. The selected strategy governs whether work remains on the operator-selected current branch or uses one published branch per feature.


## Specification and Evidence

No implementation may begin without a defined specification. Before drafting a brownfield specification or design, the author MUST examine the current requirement and design authorities, relevant historical work records, the maintained regression test pack, and the affected implementation. The resulting artefact MUST identify what existing behaviour and decisions it preserves, changes, supersedes, or leaves unaffected. Tests MUST be used to trace actively protected behaviour to its originating requirements and compatibility constraints. Tests and code are implementation evidence; they do not approve requirements. Project documentation and the active specification MUST be updated when delivered behaviour or ownership boundaries change.

## Specification Baseline

**Project classification:** Greenfield

No pre-existing requirement baseline existed at ratification. Approved feature specifications establish requirements prospectively.

## Mandatory Independent Audits

For staged Spec Kit delivery, each audit MUST run in a fresh agent context that did not author the artefact and MUST emit the exact structured verdict required by its skill. PASS may retain advisories. A PROVISIONAL verdict becomes effective PASS only through the exact condition receipt defined by the audit standard. On FAIL, the author remediates and a fresh independent audit runs. The next stage MUST NOT begin until the required audit records effective PASS.

1. Specification and clarification require `audit-spec` PASS before planning.
2. Plan and design require `audit-design` PASS before test design and tasks.
3. Test design and traceability require `audit-tests` PASS before implementation.
4. Implementation requires `audit-code` PASS before completion or convergence.

Record each audit name, auditor provider and model, artefact revision, exact verdict, findings, and superseding rerun in the active feature's `audits.md`. `speckit-analyze` is a consistency check and does not replace an independent audit.

When the operator explicitly selects paired development under `~/.agents/sdlc/PAIRING.md`, its change-scoped closure and user-validation contract replaces these staged transitions for that change. Engineering standards and applicable audit requirements remain mandatory.

## Project-Specific Principles

[ADD DURABLE PROJECT-SPECIFIC PRINCIPLES DERIVED FROM VERIFIED PROJECT DOCUMENTATION.]

## Project Ownership and Architecture Boundaries

[ADD DURABLE APPLICATION, DATA, INTEGRATION, AND OPERATIONAL OWNERSHIP BOUNDARIES.]

## Governance

This constitution governs project specifications, plans, tasks, implementation, and review after ratification. Before ratification, this scaffold has no authority. Amendments MUST explain compatibility and migration effects and update the version and dates below.

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Revised**: [LAST_AMENDED_DATE]
