<!-- SYNC IMPACT: 1.0.0 -> 1.0.1 | Principles: None (SDLC v2.0.8 -> v2.0.9) | Added: None | Removed: None | TODOs: None -->

# iOS TTS Constitution

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


## Specification and Evidence

No implementation may begin without a defined specification. Before drafting a brownfield specification or design, the author MUST examine the current requirement and design authorities, relevant historical work records, the maintained regression test pack, and the affected implementation. The resulting artefact MUST identify what existing behaviour and decisions it preserves, changes, supersedes, or leaves unaffected. Tests MUST be used to trace actively protected behaviour to its originating requirements and compatibility constraints. Tests and code are implementation evidence; they do not approve requirements. Project documentation and the active specification MUST be updated when delivered behaviour or ownership boundaries change.

## Specification Baseline

**Project classification:** Greenfield

No pre-existing requirement baseline existed at ratification. Approved feature specifications establish requirements prospectively.

The current durable product-purpose authority is `README.md`. No approved architecture or design
authority and no maintained regression test pack exist in this greenfield baseline.

## Mandatory Independent Audits

For staged Spec Kit delivery, each audit MUST run in a fresh agent context that did not author the artefact and MUST emit the exact structured verdict required by its skill. PASS may retain advisories. A PROVISIONAL verdict becomes effective PASS only through the exact condition receipt defined by the audit standard. On FAIL, the author remediates and a fresh independent audit runs. The next stage MUST NOT begin until the required audit records effective PASS.

1. Specification and clarification require `audit-spec` PASS before planning.
2. Plan and design require `audit-design` PASS before test design and tasks.
3. Test design and traceability require `audit-tests` PASS before implementation.
4. Implementation requires `audit-code` PASS before completion or convergence.

Record each audit name, auditor provider and model, artefact revision, exact verdict, findings, and superseding rerun in the active feature's `audits.md`. `speckit-analyze` is a consistency check and does not replace an independent audit.

When the operator explicitly selects paired development under `~/.agents/sdlc/PAIRING.md`, its change-scoped closure and user-validation contract replaces these staged transitions for that change. Engineering standards and applicable audit requirements remain mandatory.

## Project-Specific Principles

### I. Complete-Document Accessibility

The project MUST keep complete, untruncated Obsidian document content available to native iOS
text-to-speech accessibility facilities. Every feature specification and design MUST preserve this
purpose unless a constitutional amendment explicitly changes it.

**Rationale:** Partial document presentation defeats the project's durable accessibility purpose.

## Project Ownership and Architecture Boundaries

- **Human governance:** Tadhg O'Brien, the human project owner, controls constitutional ratification,
  amendments, and standards deviations.
- **Engineering and governance:** This constitution and its selected standards
  govern engineering and governance within their named concerns.
- **Purpose and policy:** `README.md` governs durable project purpose and policy. Approved feature
  specifications govern observable behaviour and may not be overruled by undifferentiated project
  documentation.
- **Design:** Approved architecture and design records govern technical choices within approved
  requirements. Archived or superseded implementation plans are historical provenance, not current
  design authority.
- **Procedures and evidence:** Operational, testing, migration, and user documentation govern their
  respective procedures and evidence. Code and tests record implemented state and evidence; they do
  not approve requirements.
- **External contracts:** Obsidian and iOS define and evolve their respective platform and native
  accessibility contracts. This project consumes those contracts, owns its plugin behaviour and
  integration implementation, and MUST comply with each external contract only within that
  contract's ownership boundary.
- **Precedence and supersession:** Within a concern, later explicit human-approved authority
  supersedes earlier authority only when it identifies the superseded decision and preserves its
  lineage. Recency does not grant a source authority outside its concern.

## Governance

This constitution governs project specifications, plans, tasks, implementation, and review.

Tadhg O'Brien, the human project owner, is the ratification and amendment authority. An amendment
MUST state its compatibility and migration effects and update the version and dates below.

Amendment 1.0.1 updates only the adopted SDLC release from `v2.0.8` to `v2.0.9`. It changes no
project-specific principle, product behaviour, data format, or migration requirement. Tadhg O'Brien
ratified this amendment on 2026-09-05.

MAJOR removes or incompatibly redefines governance, MINOR adds or materially expands governance,
and PATCH clarifies governance without changing its meaning.

Compliance review MUST report the applicable constitutional principles, every approved deviation,
and every unresolved constitutional conflict. No standards deviation is approved.

**Version**: 1.0.1 | **Ratified**: 2026-09-04 | **Last Revised**: 2026-09-05
