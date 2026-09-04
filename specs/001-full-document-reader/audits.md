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
- Status: Superseded by the operator-directed help, usage, and publication
  revision.

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

## Operator Revision After Attempt 4

- Adds persistent How to use guidance in plugin settings.
- Defines the routine three-action flow: plugin button, accessibility shortcut,
  and Play.
- Uses triple-clicking the side button as the principal setup example while
  acknowledging other iOS launch methods.
- Defines the native, non-metered, no-API-key value proposition for public
  plugin metadata and details.
- Prepares metadata and guidance for later human-authorized Obsidian marketplace
  submission.
- Resolves all five Attempt 4 advisories in the revised candidate.

## Attempt 5

- Auditor: `audit-spec` via `sdlc-audit`
- Auditor provider: `nous`
- Auditor model: `z-ai/glm-5.3-flash`
- Artefact revision: SHA-256
  `b2a37eef52e4375b0284cedf5322afe6dbb5db082ec9588f1f83867f63c18745`
- Verdict: PASS
- Status: Superseded by remediation of both retained advisories.

### Findings

1. [ADVISORY] User Story 4 scenario 4 used a shorter exclusion list than FR-025
   and SC-008, which could let acceptance omit the external-account and
   pay-per-use conditions.
2. [ADVISORY] FR-008 and the snapshot assumption did not specify whether a new
   invocation replaces the earlier presentation or stacks another one.

### Disposition

- Aligned User Story 4 scenario 4 with FR-025 and SC-008 while retaining the
  remote-response boundary from FR-026.
- Added explicit replacement behaviour to User Story 1 scenario 3 and FR-028.

## Attempt 6

- Auditor: `audit-spec` via `sdlc-audit`
- Auditor provider: `nous`
- Auditor model: `z-ai/glm-5.3-flash`
- Artefact revision: SHA-256
  `330579357e58bd722054983d0ace5b5d681676f2c14b659e22824661878295be`
- Verdict: FAIL
- Status: Superseded by remediation of the blocking finding and all three
  advisories.

### Findings

1. [BLOCKING] FR-010, FR-013, and the Supported note definition left an active
   Markdown file that Obsidian cannot open or render outside both specified
   failure branches.
2. [ADVISORY] The Supported note entity combined its definition and two failure
   assignments in one bullet.
3. [ADVISORY] The frontmatter-only edge case used different property wording
   from User Story 1 scenario 5 and FR-017.
4. [ADVISORY] The README relationship did not say how its previewer comparison
   relates to authoritative FR-002.

### Disposition

- Assigned any active Markdown file that Obsidian cannot open or render to the
  FR-013 presentation-failure response.
- Split supported, unsupported, and presentation-failure states into separate
  Key Entities bullets.
- Standardized the frontmatter-only edge case on visible properties in
  Obsidian's order.
- Recorded the README previewer comparison as illustrative no-truncation
  context and FR-002 as the authoritative requirement.

## Attempt 7

- Auditor: `audit-spec` via `sdlc-audit`
- Auditor provider: `nous`
- Auditor model: `z-ai/glm-5.3-flash`
- Artefact revision: SHA-256
  `07224175989494dc7ebefd21b612a64af28e66f19692a1bbd9ac29744bec6441`
- Verdict: PROVISIONAL
- Status: Superseded by condition remediation.

### Findings

1. [CONDITION] FR-001 required a user-visible button without stating that its
   placement is a planning decision.
2. [ADVISORY] FR-027 did not state that a reader-adjacent Help control is
   optional.
3. [ADVISORY] Three acceptance scenarios repeat their connected requirements,
   although the reviewer acknowledged their concrete-example value.
4. [ADVISORY] SC-003 did not directly point to the Assumptions bullet defining
   its representative acceptance set.

### Disposition

- Explicitly deferred button placement and any command-palette alternative to
  planning without weakening FR-001.
- Made a reader-adjacent Help control optional and retained settings help as
  mandatory.
- Retained the three acceptance scenarios because they provide concrete
  feature-level examples for acceptance testing.
- Added the Assumptions cross-reference to SC-003.

## Attempt 8

- Auditor: `audit-spec` via `sdlc-audit`
- Auditor provider: `nous`
- Auditor model: `z-ai/glm-5.3-flash`
- Artefact revision: SHA-256
  `2f52999f7911b15d38f77f8dfd86161d37c566bf6c036a90f04160dc475e2f5a`
- Verdict: FAIL
- Status: Superseded by remediation of both blocking findings and both
  advisories.

### Findings

1. [BLOCKING] Scope and SC-008 required public metadata to explain the
   three-action flow, but FR-025 did not.
2. [BLOCKING] User Story 4 scenario 4 required the public description to state
   that there is no remote speech-processing wait, but FR-025 and SC-008 did
   not carry the same claim.
3. [ADVISORY] FR-014's word "recursively" could permit first-level inclusion of
   referenced-target content.
4. [ADVISORY] FR-001 did not require an accessible name for the invocation
   button.

### Disposition

- Extended FR-025 to require the public three-action sequence and aligned it
  with FR-022.
- Added the absence of a remote speech-processing wait to FR-025 and SC-008.
- Reworded the referenced-content boundary to exclude target-only content at
  any depth.
- Required the invocation button to expose an accessible name identifying the
  action.

## Attempt 9

- Auditor: `audit-spec` via `sdlc-audit`
- Auditor provider: `nous`
- Auditor model: `z-ai/glm-5.3-flash`
- Artefact revision: SHA-256
  `ce50e3c57bb96e4bfb09151f4874aa0e7641d2a2e92754eb67547894a26f7715`
- Verdict: PASS
- Status: Current effective PASS with two retained advisories.
- Service note: The first execution produced no output for more than eleven
  minutes and was terminated without a verdict. An identical retry returned
  the result recorded here.

### Findings

1. [ADVISORY] SC-008 repeats FR-025's full service-independence list rather than
   cross-referencing it, which creates a maintenance risk if FR-025 changes.
2. [ADVISORY] The iOS 26 availability floor should be marked as derived from
   the cited Apple instructions or reverified during planning.

### Disposition

- Retained SC-008's explicit list because it makes the human-review measurement
  self-contained and permits direct comparison with FR-025.
- Retained the iOS 26 floor as a documented assumption derived from the linked
  Apple Accessibility Reader instructions; planning must reverify external
  platform versions before selecting the supported-version contract.
