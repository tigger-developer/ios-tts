# Specification Audit Record: Full Document Reader

## Attempt 1

- Audit: `audit-spec`
- Auditor provider: `nous`
- Auditor model: `z-ai/glm-5.3-flash`
- Artefact revision: SHA-256
  `426fc3cf5e9af52390aae027a1e289e466bafd0d5c55ce260e045f39b6e2298c`
- Verdict: PASS
- Status: Superseded by voluntary remediation of all advisories.

### Findings

1. [ADVISORY] The specification
   (`specs/001-full-document-reader/spec.md`) records no baseline relationship
   to `README.md`, which the constitution names as the durable product-purpose
   authority: the Assumptions section paraphrases the untruncated-presentation
   purpose without citing or explicitly stating that the specification
   preserves it. Add one Assumptions line citing `README.md` and stating that
   the specification preserves and elaborates the documented purpose without
   changing it.
2. [ADVISORY] SC-001 (Complete long-note access) and SC-003 (Native reading
   success) depend on an undefined "representative supported notes" /
   "representative document structures" set; without a bounded definition or
   an identified authority for selecting it, the 100% claims are not fully
   falsifiable. State in Assumptions that the representative set is defined
   during test design from the structures enumerated in the acceptance
   scenarios (headings, paragraphs, lists, quotations, links, code blocks,
   frontmatter, empty, maximum length).
3. [ADVISORY] Edge Cases covers empty, frontmatter-only, linked, over-long, and
   non-Markdown notes, but no case addresses presentation failure (e.g. the
   presentation cannot be created for an otherwise supported note); FR-010
   (Unsupported-state response) covers only the missing/non-Markdown active
   note. Consider one boundary statement that a failed presentation is
   reported without modifying the note or showing stale content, or record in
   Assumptions that this is deferred to error-handling design.

## Attempt 2

- Audit: `audit-spec`
- Auditor provider: `nous`
- Auditor model: `z-ai/glm-5.3-flash`
- Artefact revision: SHA-256
  `3e385a2007c53a822234145c6244cc90495281fed24341b6352cfb9971c5ab91`
- Verdict: PASS
- Status: Superseded by voluntary remediation of all advisories.

### Findings

1. [ADVISORY] FR-005 - readable representation: the generalized rule says
   "standard Markdown elements" while the concrete element set appears only in
   User Story 1 scenario 2; consider enumerating the supported element set (or
   citing it by reference) in FR-005 so the authoritative rule is self-bounded.
   Proposed correction: add "as enumerated in User Story 1 scenario 2" or the
   element list to FR-005.
2. [ADVISORY] FR-011 - linked-content boundary: the readable representation of
   an embedded image or media reference lacking a label or description is an
   undefined product decision (omit, placeholder, or filename). Proposed
   correction: record the intended presentation for unlabelled media in an
   assumption or edge case, or explicitly defer it to planning with the
   deferral named in the specification.
3. [ADVISORY] SC-002 - prompt reader availability and SC-005 - usable reading
   sequence: both depend on "a supported iOS device" whose versions are
   deferred to planning (Assumptions, final bullet). Proposed correction: state
   that the five-second and review criteria are measured on the platform
   versions selected at planning, so the measurement baseline is traceable
   rather than implicit.
4. [ADVISORY] User Story 2 scenario 2 presumes the reader presentation
   "includes plugin controls or identifying text" while FR-007 excludes
   non-document interface text; whether the reader carries any interface text
   at all is an open presentation decision. Proposed correction: either state
   in Assumptions whether the reader has interface chrome, or reword scenario 2
   as "GIVEN any reader presentation text other than the document body" so the
   scenario does not presuppose an undecided design.

## Attempt 3

- Audit: `audit-spec`
- Auditor provider: `nous`
- Auditor model: `z-ai/glm-5.3-flash`
- Artefact revision: SHA-256
  `d41792f786851456da75f559be4b3f6fd585ee60d7d6768b5c2e6e45bddc646e`
- Verdict: FAIL
- Status: Superseded by remediation of the blocking finding and all
  advisories.

### Findings

1. [BLOCKING] FR-004 - Logical reading order and FR-005 - Readable
   representation enumerate a fixed element set that omits common Markdown
   structures such as tables, callouts, footnotes, task-list checkboxes, tags,
   math, and inline HTML. This contradicts the complete-content commitment and
   permits raw authoring syntax for unlisted structures. Generalize both
   requirements to every Markdown structure the note contains, name the
   omitted structures as required examples, and include them in the
   representative note set.
2. [ADVISORY] The functional requirements lack an explicit platform boundary,
   allowing divergent iOS and desktop interpretations. State the iOS scope and
   the status of other platforms.
3. [ADVISORY] The position of visible properties and the note title or filename
   in the reading sequence is undefined. State their placement and whether the
   title or filename belongs to the document body.
4. [ADVISORY] FR-011 - Linked-content boundary bundles label exposure, no
   recursive inclusion, and no invented unlabelled-media text. Split these
   independently failing conditions into atomic requirements.
5. [ADVISORY] No requirement constrains untrusted inline HTML or scripts. State
   that the reader introduces no script execution, privileged access, or
   network fetch beyond Obsidian's standard rendering contract.

## Runner Error Before Attempt 3

- Candidate revision: SHA-256
  `d41792f786851456da75f559be4b3f6fd585ee60d7d6768b5c2e6e45bddc646e`
- Result: The runner rejected the external auditor output because the verdict
  contained an unstructured Markdown fence.
- Effect: No valid audit verdict was recorded for that invocation. A fresh
  audit produced Attempt 3 above.

## Attempt 4

- Audit: `audit-spec`
- Auditor provider: `nous`
- Auditor model: `z-ai/glm-5.3-flash`
- Artefact revision: SHA-256
  `70445bea4c375b62481f9dfa6d608bdc4cb8ced607eb770d766ae8c4e20ef4cc`
- Verdict: PASS
- Status: Current effective PASS with retained advisories.

### Findings

1. [ADVISORY] FR-006 (native accessibility discovery) and the US2 (invoke
   native iOS reading) scenarios call the unit iOS discovers the "document's
   readable body"/"document body", while FR-017 (title and properties order)
   places the title and visible properties inside the reading sequence and the
   frontmatter-only edge case uses "document body" for the body portion alone;
   a literal reading could exclude the title and properties from native
   discovery, contradicting FR-017 and US1 (read the complete active note)
   scenario 5; add one definition (Key Entities or Assumptions) stating that
   the continuous document FR-006 exposes comprises the complete FR-017 reading
   sequence.
2. [ADVISORY] US1 scenario 2 and FR-004 (logical reading order) enumerate
   task-list checkboxes but no statement fixes whether checked/unchecked state
   is part of the readable content, so implementations may either inject
   invented state text in tension with FR-015 (unlabelled-media boundary) or
   omit state the listener needs; add a sentence stating that checkbox state is
   carried by the same semantic presentation Obsidian's standard reading view
   provides, not by plugin-invented text.
3. [ADVISORY] FR-011 (linked-content labels), FR-014 (referenced-content
   boundary), and FR-015 (unlabelled-media boundary) leave an embedded note
   transclusion without an author-supplied label (a bare `![[Note]]`) undefined
   because FR-015's no-invented-label-or-filename rule covers embedded media
   only; specify the case - recommend the target name counts as the
   author-supplied reference text, or state the embed contributes nothing -
   otherwise implementations diverge between speaking filenames for notes
   (banned for media) and silent omission.
4. [ADVISORY] SC-004 (source and privacy safety) counts "zero external content
   transfers" while FR-016 (standard-rendering security boundary) permits
   network activity up to Obsidian's standard-rendering parity, so a
   presentation fetching remote references at parity would record a nonzero
   transfer and appear to fail the criterion; reword SC-004 to measure
   transfers of note content to external destinations, matching FR-009 (local
   content boundary) and US3 (preserve the source note) scenario 2.
5. [ADVISORY] FR-013 (presentation failure response), SC-001 (complete
   long-note access), and the US2 independent test rely on the undefined term
   "supported note" whose only anchor is the edge case "a note that Obsidian
   can open"; define it once (e.g., in Key Entities) and state which response
   applies to a Markdown file Obsidian cannot open - FR-010 (unsupported-state
   response) or FR-013.
