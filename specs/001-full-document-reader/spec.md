# Feature Specification: Full Document Reader

Feature branch: `master`

Created: 2026-09-04

Status: Draft

Input: Write a specification for the straightforward Obsidian plugin described in `README.md`.

## Scope

- In scope: An Obsidian user can **open the active Markdown note** as a
  **complete, read-only document** that the native iOS reader accessibility
  shortcut can discover and read.
- In scope: The specified reader behaviour applies to **Obsidian on iOS**.
- In scope: The presentation contains the note's **entire readable content** in
  its **logical reading order**, without omitting content near the end of a long
  note.
- In scope: The presentation keeps note content **on the user's device** and
  leaves the source note unchanged.
- Out of scope: The plugin **does not synthesize speech** or provide playback,
  voice, language, pronunciation, or audio controls.
- Out of scope: The plugin **does not provide an editing surface** or reproduce
  unrelated Obsidian navigation and workspace controls.
- Out of scope: The plugin **does not recursively include content** from linked
  notes, external media, canvases, PDFs, or other non-Markdown files.
- Out of scope: Reader behaviour on desktop or other non-iOS platforms is
  **not specified by this feature**.

## User Scenarios & Testing

### User Story 1 - Read the complete active note (Priority: P1)

An iOS Obsidian user **opens the active Markdown note** in a complete reader
presentation so native iOS text-to-speech can **read the whole note**.

Why this priority: **Complete note access** is the plugin's sole essential user
value.

Independent Test: A long supported note is **available from its first through
its final readable content** in one reader presentation.

#### Acceptance Scenarios

1. GIVEN an active Markdown note whose content extends beyond the portion
   ordinarily presented at one time

   WHEN the user opens the full document reader

   THEN the reader presents the note's **complete readable content**

   AND the **final readable content remains available** to the iOS reader
   accessibility shortcut.

2. GIVEN an active Markdown note containing headings, paragraphs, lists,
   quotations, links, code blocks, tables, callouts, footnotes, task-list
   checkboxes, tags, maths, or readable inline HTML

   WHEN the user opens the full document reader

   THEN the reader presents every element's readable content in its **logical
   document order**

   AND their **readable text remains distinguishable** without requiring the
   user to interpret Markdown source syntax.

3. GIVEN an active Markdown note that has changed since an earlier reader
   presentation was opened

   WHEN the user opens the full document reader again

   THEN the new presentation reflects the **current note content** known to
   Obsidian at that moment.

4. GIVEN an active Markdown note containing links, embedded references, or
   media descriptions

   WHEN the user opens the full document reader

   THEN the reader includes each **readable label or description from the
   active note**

   AND does **not append content belonging only to the referenced target**.

5. GIVEN an active Markdown note containing a title, visible properties, and
   body content

   WHEN the user opens the full document reader

   THEN the reading sequence presents the **title once**, followed by the
   **visible properties in Obsidian's order**, followed by the **body content**.

### User Story 2 - Invoke native iOS reading (Priority: P2)

An iOS Obsidian user **invokes the configured native reader shortcut** against
the full document presentation so the operating system can **read the note
aloud**.

Why this priority: The presentation has value only when the native
accessibility facility **recognizes its readable content**.

Independent Test: The configured native iOS shortcut **discovers one complete
document** and can reach its final readable content.

#### Acceptance Scenarios

1. GIVEN the full document reader is displaying a supported note

   WHEN the user invokes the configured iOS reader accessibility shortcut

   THEN iOS discovers the **document's readable body**

   AND can proceed through that body in **logical reading order**.

2. GIVEN any reader presentation text exists outside the document body

   WHEN iOS discovers the readable body

   THEN **non-document interface text is excluded** from the note's reading
   sequence.

3. GIVEN no native speech session is active

   WHEN the user opens the full document reader

   THEN the plugin **does not begin audio playback**

   AND the native iOS facility retains **speech and playback control**.

### User Story 3 - Preserve the source note (Priority: P3)

An Obsidian user can **open and close the reader without changing the source
note** or transmitting its content elsewhere.

Why this priority: Accessibility must **preserve the user's writing and
privacy**.

Independent Test: Reader use causes **no source-note change** and **no external
content transfer**.

#### Acceptance Scenarios

1. GIVEN an active supported note

   WHEN the user opens and closes the full document reader

   THEN the source note's **content and metadata remain unchanged**.

2. GIVEN an active supported note

   WHEN the reader presentation is created or used

   THEN the note content **remains on the device**

   AND is **not sent to an external service** by the plugin.

3. GIVEN there is no active Markdown note

   WHEN the user invokes the full document reader action

   THEN the plugin reports that a **Markdown note must be active**

   AND does **not display stale content** from a previously opened note.

4. GIVEN an active supported note

   WHEN the reader presentation cannot be created

   THEN the plugin reports the **presentation failure**

   AND does **not modify the note or display stale content**.

5. GIVEN a note containing inline HTML, executable content, or references that
   can trigger network access

   WHEN the user opens or uses the full document reader

   THEN the reader introduces **no additional script execution, privileged
   access, or network request** beyond Obsidian's standard rendering of the
   same note.

### Edge Cases

- An **empty Markdown note** produces an empty document body without showing
  stale content or reporting a false failure.
- A note containing only frontmatter presents the **title once**, followed by
  any human-readable property names and values in the order Obsidian exposes
  them, without speaking formatting delimiters or inventing prose.
- A note with links or embedded references includes their **readable labels**
  but does not recursively append the referenced content.
- A media reference without an author-supplied readable label or description
  contributes **no invented label, filename, or placeholder text** to the
  reading sequence.
- A note that Obsidian can open remains eligible regardless of length; the
  reader does not impose a separate **content-length limit**.
- If the active file is not a Markdown note, the plugin reports the
  **unsupported file type** without altering or replacing the file.

## Requirements

### Functional Requirements

- FR-001 - Full reader action: The plugin MUST provide an action that opens a
  **reader presentation for the active Markdown note**.
- FR-002 - Complete readable content: The reader MUST include the note's
  **readable content from beginning to end** without a plugin-imposed
  content-length limit or truncation.
- FR-003 - Current content: Each newly opened reader presentation MUST reflect
  the **current note content known to Obsidian** when the action is invoked.
- FR-004 - Logical reading order: The reader MUST expose the readable content
  of **every Markdown structure present in the active note** in logical
  document order. Required examples include headings, paragraphs, lists,
  quotations, links, code blocks, tables, callouts, footnotes, task-list
  checkboxes, tags, maths, and readable inline HTML.
- FR-005 - Readable representation: Every Markdown structure that Obsidian's
  standard reading view presents as readable content MUST appear as **readable
  semantic content**, rather than requiring the user to interpret formatting
  delimiters or other authoring syntax.
- FR-006 - Native accessibility discovery: The reader MUST make the note's
  readable body available as **one continuous document** to the native iOS
  reader accessibility shortcut.
- FR-007 - Document-only sequence: The reading sequence MUST exclude
  **navigation, controls, status text, and other non-document interface text**.
- FR-008 - Read-only operation: Opening, using, reopening, or closing the reader
  MUST NOT **modify the source note or its metadata**.
- FR-009 - Local content boundary: The plugin MUST NOT **transmit note content
  to an external service** when creating or presenting the reader view.
- FR-010 - Unsupported-state response: When no Markdown note is active, the
  plugin MUST identify the **missing or unsupported active note** and MUST NOT
  display content from another note.
- FR-011 - Linked-content labels: Links and embedded references MUST expose
  their **author-supplied readable labels**.
- FR-012 - Native speech boundary: Speech generation, playback, voice,
  language, pronunciation, and audio controls MUST remain under **native iOS
  ownership** rather than being duplicated by the plugin.
- FR-013 - Presentation failure response: If the reader presentation cannot be
  created for a supported note, the plugin MUST report the **failure without
  modifying the note or displaying stale content**.
- FR-014 - Referenced-content boundary: The reader MUST NOT **recursively append
  content belonging only to a linked or embedded target**.
- FR-015 - Unlabelled-media boundary: An embedded media reference without an
  author-supplied label or description MUST contribute **no invented label,
  filename, or placeholder text** to the reading sequence.
- FR-016 - Standard-rendering security boundary: The reader MUST introduce
  **no script execution, privileged access, or network request beyond
  Obsidian's standard rendering** of the same note.
- FR-017 - Title and properties order: The reading sequence MUST present the
  **note title exactly once**, followed by **visible properties in Obsidian's
  order**, followed by the **note body**.

### Key Entities

- Active Markdown note: The Obsidian note **selected at invocation**, including
  its current readable content and document order.
- Reader presentation: A **transient, read-only representation** of one active
  Markdown note whose complete readable body is available to iOS accessibility
  facilities.

## Success Criteria

### Measurable Outcomes

- SC-001 - Complete long-note access: For **100% of representative supported
  notes**, including notes of at least **100,000 words**, every readable segment
  from the first through the final segment is available in the reader in the
  correct order.
- SC-002 - Prompt reader availability: For a supported note of up to **100,000
  words**, the complete reader presentation becomes available within **five
  seconds** of invocation on the supported platform versions selected during
  planning.
- SC-003 - Native reading success: In **100% of the representative document
  structures** used for acceptance, the configured native iOS shortcut
  discovers the document body and can reach its final readable content.
- SC-004 - Source and privacy safety: Across all acceptance sessions, opening
  and using the reader causes **zero source-note changes** and **zero external
  content transfers** by the plugin.
- SC-005 - Usable reading sequence: On the supported platform versions selected
  during planning, the project owner can confirm in human accessibility review
  that each representative note is read in its **expected logical order**
  without unrelated interface text interrupting the document.

## Assumptions

- This specification **preserves and elaborates the product purpose** recorded
  in `README.md`: present the complete, untruncated Obsidian document so native
  iOS text-to-speech can read it. It changes no earlier approved feature
  requirement because none exists in the greenfield baseline.
- The user has a **supported Obsidian iOS installation** and has configured the
  native reader accessibility shortcut.
- "Entire document" means the active Markdown note's **readable semantic
  content**, including visible property names and values, link labels, and
  media descriptions. It excludes formatting delimiters and content belonging
  only to referenced files or external media.
- "Note title" means the **title Obsidian displays for the active note**. The
  filename or path is not spoken separately.
- The reader is a **snapshot at invocation time**. Live synchronization while
  the reader remains open is not required; invoking the action again refreshes
  the presentation.
- The **representative supported-note set** for SC-001 and SC-003 includes, at
  minimum, an empty note, a frontmatter-only note, a note containing all
  structures enumerated in User Story 1 scenario 2, a note containing links
  and embedded references, and a note of at least 100,000 words.
- iOS **owns speech and playback behaviour**. The plugin owns only the
  accessible document presentation within Obsidian.
- Obsidian and iOS remain **external platform contracts**. Exact supported
  versions will be selected during planning without reducing the observable
  behaviour specified here.
