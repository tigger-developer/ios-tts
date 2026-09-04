# Feature Specification: Full Document Reader

Feature branch: `master`

Created: 2026-09-04

Status: Draft

Input: Write a specification for the straightforward Obsidian plugin described
in `README.md`. Explain the Accessibility Reader setup and three-action reading
flow in persistent help and publishable plugin details. Present native,
non-metered text-to-speech as the plugin's value proposition, and prepare for a
later Obsidian marketplace submission.

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
- In scope: A persistent **How to use page in plugin settings** explains initial
  Accessibility Reader setup and routine use.
- In scope: Publishable plugin metadata and details explain the **three-action
  reading flow** and its **native, non-metered text-to-speech** value.
- Out of scope: The plugin **does not synthesize speech** or provide playback,
  voice, language, pronunciation, or audio controls.
- Out of scope: The plugin **does not provide an editing surface** or reproduce
  unrelated Obsidian navigation and workspace controls.
- Out of scope: The plugin **does not include content at any depth** from linked
  notes, external media, canvases, PDFs, or other non-Markdown files.
- Out of scope: Reader behaviour on desktop or other non-iOS platforms is
  **not specified by this feature**.
- Out of scope: The plugin **does not invoke Accessibility Reader or start
  playback programmatically** because those actions remain under user and iOS
  control.
- Out of scope: Submission to or publication through the Obsidian Community
  Plugins marketplace requires **later human approval**.

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
   Obsidian at that moment

   AND replaces the earlier reader presentation rather than stacking a second
   presentation beside it.

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

### User Story 2 - Use the three-action reading flow (Priority: P2)

An iOS Obsidian user **opens the full document**, **invokes Accessibility
Reader**, and **presses Play** so the operating system reads the note aloud.

Why this priority: The presentation has value only when the native
accessibility facility **recognizes its readable content**.

Independent Test: The three user actions expose **one complete document to
native iOS speech**, which can reach the final readable content.

#### Acceptance Scenarios

1. GIVEN Accessibility Reader is enabled and assigned to a user-selected iOS
   accessibility shortcut

   WHEN the user presses the plugin button, invokes that accessibility
   shortcut, and presses Play

   THEN iOS discovers the **complete reading sequence**

   AND reads it in **logical order through the final content**.

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

### User Story 4 - Configure and understand the reading flow (Priority: P2)

A first-time user opens **How to use** in plugin settings to configure
Accessibility Reader and understand the plugin's three-action reading flow.

Why this priority: **One-time iOS setup enables the plugin's intended value**.

Independent Test: A first-time user can **configure Accessibility Reader and
start reading a full note** without an API key, external account, or other
guidance.

#### Acceptance Scenarios

1. GIVEN Accessibility Reader has not been enabled

   WHEN the user opens the plugin's How to use page

   THEN the page provides **ordered setup instructions** for enabling
   Accessibility Reader and assigning an accessibility shortcut

   AND gives **triple-clicking the side (lock) button** as the principal example
   while noting that other iOS launch methods are available.

2. GIVEN Accessibility Reader is configured

   WHEN the user reads the routine-use instructions

   THEN the page describes the **three actions in order**: press the plugin
   button, invoke the accessibility shortcut, and press Play.

3. GIVEN several features are assigned to the iOS Accessibility Shortcut

   WHEN the user invokes that shortcut

   THEN the help explains that iOS may show an **additional feature chooser**

   AND explains that assigning only Accessibility Reader provides the direct
   **three-action flow**.

4. GIVEN a prospective user reads the publishable plugin metadata and details

   WHEN the user evaluates the plugin before installation

   THEN the description identifies **native iOS Accessibility Reader** as the
   speech facility

   AND states that the plugin requires **no TTS API key, external TTS account,
   pay-per-use charge from the plugin, metered TTS service, or remote
   speech-processing wait**.

### Edge Cases

- An **empty Markdown note** produces an empty document body without showing
  stale content or reporting a false failure.
- A note containing only frontmatter presents the **title once**, followed by
  the **visible properties in Obsidian's order**, without speaking formatting
  delimiters or inventing prose.
- A note with links or embedded references includes their **readable labels**
  but does not include content belonging only to a referenced target at any
  depth.
- For a bare embedded-note transclusion, the written target name counts as
  **author-supplied reference text**.
- A media reference without an author-supplied readable label or description
  contributes **no invented label, filename, or placeholder text** to the
  reading sequence.
- A note that Obsidian can open remains eligible regardless of length; the
  reader does not impose a separate **content-length limit**.
- If the active file is not a Markdown note, the plugin reports the
  **unsupported file type** without altering or replacing the file.
- If several features share the iOS Accessibility Shortcut, the system chooser
  can add **one selection action** to the routine flow.
- If the user enables Accessibility Reader Autoplay, iOS can omit the final
  **manual Play action**; Autoplay is optional and is not required by the
  plugin.

## Requirements

### Functional Requirements

- FR-001 - Full reader button: The plugin MUST provide a **user-visible button**
  that opens a reader presentation for the active Markdown note and exposes an
  **accessible name identifying the full document reader action**.
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
  full title, visible-properties, and body sequence available as **one
  continuous document** to the native iOS reader accessibility shortcut.
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
- FR-013 - Presentation failure response: If an active Markdown file cannot be
  opened or rendered by Obsidian, or its reader presentation cannot otherwise
  be created, the plugin MUST report the **presentation failure without
  modifying the note or displaying stale content**.
- FR-014 - Referenced-content boundary: The reader MUST NOT include, **at any
  depth, content belonging only to a linked or embedded target**.
- FR-015 - Unlabelled-media boundary: An embedded media reference without an
  author-supplied label or description MUST contribute **no invented label,
  filename, or placeholder text** to the reading sequence.
- FR-016 - Standard-rendering security boundary: The reader MUST introduce
  **no script execution, privileged access, or network request beyond
  Obsidian's standard rendering** of the same note.
- FR-017 - Title and properties order: The reading sequence MUST present the
  **note title exactly once**, followed by **visible properties in Obsidian's
  order**, followed by the **note body**.
- FR-018 - Task state semantics: Task-list checkboxes MUST expose their
  **checked or unchecked state through the semantics Obsidian provides**
  without plugin-invented state text.
- FR-019 - Persistent settings help: Plugin settings MUST provide a
  **discoverable How to use page** that remains available after initial setup.
- FR-020 - Accessibility Reader setup guidance: The How to use page MUST direct
  the user to enable Accessibility Reader at **Settings > Accessibility > Read
  & Speak > Accessibility Reader**.
- FR-021 - Shortcut examples and alternatives: The setup guidance MUST use
  **Settings > Accessibility > Accessibility Shortcut** for assignment, MUST
  use **triple-clicking the side (lock) button** as its principal launch
  example, and MUST state that other iOS launch methods, including Control
  Centre, may be available.
- FR-022 - Routine usage guidance: The How to use page MUST state the routine
  **three-action sequence**: press the plugin button, invoke the configured
  accessibility shortcut, and press Play.
- FR-023 - Multiple-shortcut guidance: The How to use page MUST explain that
  assigning several accessibility features can add an iOS chooser and that
  assigning only Accessibility Reader provides the direct three-action flow.
- FR-024 - Optional Autoplay guidance: The How to use page MUST identify iOS
  Accessibility Reader **Autoplay as optional** and MUST keep the manual Play
  path as the baseline instructions.
- FR-025 - Publishable value proposition: Public plugin metadata and details
  MUST explain the **three-action sequence** from FR-022, state that the plugin
  uses **native iOS Accessibility Reader**, and state that it requires **no TTS
  API key, external TTS account, pay-per-use charge from the plugin, metered
  TTS service, or remote speech-processing wait**.
- FR-026 - Remote-service independence: Presenting the full document MUST NOT
  depend on **remote speech processing, remote TTS availability, or a remote
  TTS response**.
- FR-027 - Help isolation: Any Help control shown beside the reader MUST remain
  **outside the document's accessibility reading sequence**.
- FR-028 - Repeated invocation: Invoking the full document reader while an
  earlier presentation is open MUST **replace that presentation with one
  current presentation**, rather than stacking multiple reader presentations.

### Key Entities

- Active Markdown note: The Obsidian note **selected at invocation**, including
  its current readable content and document order.
- Supported note: An active Markdown note that **Obsidian can open and render**.
- Unsupported active state: A **missing or non-Markdown active file** receives
  the unsupported-state response in FR-010.
- Presentation failure state: An **active Markdown file that Obsidian cannot
  open or render**, or whose reader presentation otherwise cannot be created,
  receives the presentation-failure response in FR-013.
- Reader presentation: A **transient, read-only representation** of one active
  Markdown note. Its continuous document comprises the complete title,
  visible-properties, and body sequence available to iOS accessibility
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
  structures defined under Assumptions**, the configured native iOS shortcut
  discovers the complete reading sequence and can reach its final readable
  content.
- SC-004 - Source and privacy safety: Across all acceptance sessions, opening
  and using the reader causes **zero source-note changes** and **zero external
  transfers of note content** by the plugin.
- SC-005 - Usable reading sequence: On the supported platform versions selected
  during planning, the project owner can confirm in human accessibility review
  that each representative note is read in its **expected logical order**
  without unrelated interface text interrupting the document.
- SC-006 - Guided first use: Without external guidance, a first-time user can
  find the settings help, configure Accessibility Reader, and start native
  playback of a full note within **five minutes**.
- SC-007 - Three-action routine: With Accessibility Reader assigned as the only
  feature on the selected accessibility shortcut and Autoplay disabled, **100%
  of routine reading sessions require three user actions** before speech
  begins: plugin button, accessibility shortcut, and Play.
- SC-008 - Publishable clarity: In human review, the project owner can identify
  the **purpose, three-action flow, native speech ownership, and absence of API
  keys, external TTS accounts, pay-per-use TTS charges from the plugin, metered
  TTS services, or remote speech-processing waits** from the public plugin
  metadata and details without consulting another source.
- SC-009 - Remote-service independence: Across all acceptance sessions,
  opening the reading view makes **zero metered TTS calls** and never waits for
  a remote TTS response before presenting the document.

## Assumptions

- This specification **preserves and elaborates the product purpose** recorded
  in `README.md`: present the complete, untruncated Obsidian document so native
  iOS text-to-speech can read it. It changes no earlier approved feature
  requirement because none exists in the greenfield baseline. The README's
  comparison with Obsidian's previewer is illustrative context for the
  no-truncation expectation; FR-002 is the authoritative requirement.
- The user has a **supported Obsidian iOS installation** and has configured the
  native reader accessibility shortcut.
- Accessibility Reader requires **iOS 26 or later**. Earlier iOS speech
  facilities are outside this feature.
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
- The invocation button's placement, and whether a command-palette alternative
  accompanies it, are **planning decisions** that do not reduce FR-001's
  requirement for a user-visible button.
- A reader-adjacent Help control is **optional**. If planning includes one,
  FR-027 applies; the persistent settings help in FR-019 remains mandatory.
- The setup guidance links to Apple's current
  [Accessibility Reader instructions](https://support.apple.com/guide/iphone/read-listen-text-apps-accessibility-reader-iph406a46ab8/26/ios/26)
  as the external authority for system-owned steps.
- The user authorizes **no external TTS service, account, API key, subscription,
  or pay-per-use speech processing** for this feature.
- Marketplace metadata and usage details are prepared for human review in this
  feature. Actual Obsidian Community Plugins submission and publication are a
  **later operator-authorized activity**.
- Obsidian and iOS remain **external platform contracts**. Exact supported
  Obsidian versions will be selected during planning without reducing the
  observable behaviour specified here.
