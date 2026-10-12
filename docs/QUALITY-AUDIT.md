# Code, interaction and data quality audit

Audit date: 10 October 2026. Scope: the current working source for **我的AI校園生活 / My AI Campus Life**. This is an independent source review with targeted executable checks, not a declaration that the game is bug-free or that its art, audio, accessibility or classroom effectiveness has been fully validated.

## Scope and method

Reviewed the campus engine's pointer/keyboard routing and pause lifecycle; student enrolment, recovery, local persistence and cloud hydration; question attempts and star/score calculation; teacher identity/PIN/ownership boundaries and versioned question editing; worksheet access, upload, preview/print fallbacks; and the XLSX writer. Files include `public/campus/{engine,app,campus-cloud,teacher-ui,worksheet-ui,xlsx-export}.js`, `lib/campus-*.ts`, and the campus API route.

Used the existing small DOM/engine adapters for deterministic reproductions. The backend verification uses isolated **real local D1 and R2**, fictional students and the actual starter question bank. It does not access deployed class records. No browser was operated during this audit, to avoid interference with concurrent visual verification. The complete test matrix was not repeated without a change-related reason.

## Findings

### QA-01 — P2: some approved outfits changed after cloud restore — fixed

**Trigger:** select a boy's uniform slot 2/3, or a girl's slot 0/1, then save and resume on another device. The frontend and current artwork support all four uniform slots for each gender. The server's older gender-specific whitelist silently substituted a different slot.

**Change:** `lib/campus-api.ts`, `sanitiseProgress`, now accepts integer uniform slots 0–3 for either gender. Invalid slots fall back to 0; the remaining validated appearance fields retain their existing handling.

**Evidence:** `tests/backend.test.mjs` saves and reads all eight gender/uniform pairs through separate student sessions, and checks negative, out-of-range, fractional and non-numeric slots. The actual-bank D1 suite passes **166 assertions/API checks** after the change.

### QA-02 — P2: keyboard talk/door commands selected the wrong target type — fixed

**Trigger:** stand at a doorway while an NPC is also in range and press E. Previously E, Space and Enter all called the same nearest-target routine. A deterministic reproduction moved from the corridor into the playground rather than talking to the nearby person, contradicting the displayed controls.

**Change:** `public/campus/game/engine.js` passes an explicit target type: E selects nearby NPCs; Space/Enter select nearby doors. Pointer clicks continue to retain the exact clicked NPC or door. The legacy generic `interact()` entry point retains its existing nearest-target behaviour.

**Evidence:** `tests/campus-engine.test.cjs` checks all three keys with a person exactly at a door, and the generic-button path. Its existing body-hit, floor-tap, pending-intent cancellation, movement, pause and lifecycle checks also pass.

### QA-03 — P2: a late metadata response can regress displayed stars — fixed

**Trigger:** a metadata autosave begins before an answer submission, but its response arrives after the successful answer response. Previously metadata saves queued only against other metadata saves, while answer mutations ran concurrently.

**Evidence:** an isolated reproduction using the actual `campus-cloud.js` held an old save response, accepted a correct attempt with 2 stars, then released the save response. For the same student, assignment and metadata version, `lastProgress.stars` changed **2 → 0**. The app subsequently assigns that result to `cloudSnapshot`. The durable server attempt remains intact, but the client can display stale stars until a subsequent refresh.

**Change:** `public/campus/game/campus-cloud.js` now serializes metadata and answer/case/transfer mutations through one queue. Existing conflict handling and answer idempotency keys remain intact. Each queued mutation captures its authentication generation before waiting; logout invalidates both in-flight and queued work, including when the same student subsequently signs in again.

**Verification:** `tests/backend-client.test.cjs` defers a metadata response and verifies that the answer waits, then remains the final authoritative score snapshot. It also verifies that a failed save does not poison the queue and that old queued mutations make no network writes after logout/resume. `tests/campus-integration.test.cjs` passes with the actual adapter and application, including unknown-outcome retries, activity changes, conflict reload and custom four/five-option questions.

### QA-04 — P2: character frame lookup repeatedly rebuilt scene geometry — fixed

**Trigger:** `registeredFrame()` recreated the entrance-art maps and rewrote door/plaque geometry across all 18 scenes every time an actor's walking eligibility or drawing frame was requested. This work belongs to scene initialization, not the frequently called character-rendering path. This finding was also identified by the independent NPC/art review.

**Change:** the unchanged geometry maps and their application loop now run once, immediately after normalizing world dimensions and before runtime scenes are created. Character frame selection only resolves the relevant identity, atlas and pose.

**Evidence:** the engine test freezes initialized door objects and successfully resolves a character frame; the previous write-heavy implementation would throw on those frozen properties. Existing door anchor bounds and camera/label alignment assertions continue to pass. No frame-rate improvement or on-device battery saving was measured or claimed.

### QA-05 — P2: future budgeted speech could bypass language and gender review — fixed

**Trigger:** configure the optional `BUDGETED` mode with an allowed voice but no reviewed locale/gender record, then generate a clip. The earlier branch accepted that cast and immediately marked successful audio `ready`. The current `FREE_ONLY` audition configuration was already protected; this issue affected the separately configured future paid mode.

**Change:** `lib/campus-tts.ts` now applies the same reviewed cast requirement in both modes. Every newly generated clip starts in `review`, and only its generating teacher can approve its actual language/dialect, role gender, numbers and wording. Provider-default auditions remain permanently private. Neither approval nor playback sends another synthesis request.

**Evidence (11 October 2026):** the new regression first reproduced a successful `201 ready` response where an unreviewed budgeted cast should have been rejected. After the repair, `tests/tts-backend.test.mjs` passes **142 real isolated D1/R2 route checks**, including wrong/missing cast metadata and guest/student denial before exact-clip approval. Speech studio checks and TypeScript also pass. Speech-provider responses are mocked; these results do not establish actual Cantonese, Mandarin, English, gender matching or fluency.

### QA-06 — P2: Worker redirect option prevented live speech catalogue checks — fixed

**Trigger:** the website's first free audition stopped at `TTS_FREE_PRICE_UNVERIFIED`, although the public model catalogue was reachable with Node. An isolated local Workerd/Miniflare request reproduced a `TypeError`: the Worker runtime supports `redirect: "follow"` or `"manual"`, but rejects `"error"` before sending the request. The same unsupported option was also present on the synthesis request.

**Change:** both provider fetches use `redirect: "manual"`. Existing non-success response checks reject redirects; neither the public catalogue nor the authenticated synthesis request follows a Location header. This preserves the original no-redirect boundary without forwarding credentials.

**Evidence (11 October 2026):** an isolated actual Worker public-catalogue GET, with both `redirect: "manual"` and `cache: "no-store"`, returned 200 and the exact free model with zero prompt/completion prices. No key or synthesis request was used in this diagnosis. The expanded mocked TTS suite passes **148 D1/R2 route checks**, including catalogue and synthesis 307 responses, retained reservations and no retries. TypeScript and focused ESLint pass. Previously failed generation reservations were not reset.

No P1 issue was established in this bounded review. This is not a security certification or a statement that no P1 issue can exist.

## Verified boundaries and preserved behaviour

- **Scoring:** the server chooses the assigned question revision and answer key. It computes first-response subject marks separately from completion stars. Correct retries can earn the single completion award without replacing the initial grade. Client-supplied score/completion metadata is not accepted as authority.
- **Core activities:** submissions require valid evidence indices and a valid decision/repair selection; the transfer activity requires completion of the four core activities. These checks validate a submission's shape and answer, not whether a learner actually read or understood the evidence.
- **Versioning:** an activity freezes its question revisions. Editing or archiving the current bank does not replace questions or marks in an existing assignment. A later activity can use the new bank.
- **Permissions:** teacher routes require an allowlisted authenticated identity and an unexpired PIN-unlock token. Class, result, question and worksheet access is scoped by ownership. Student progress uses the session identity rather than a caller-selected student ID. Cross-owner results/worksheet requests, student-session expiry, recovery rotation, CSRF-origin rejection and PIN rate limiting are exercised by the D1 suite.
- **Recovery:** the backend can rotate a student's recovery code and revoke existing sessions. As already stated in `USER-GUIDE.md`, the teacher interface does not yet expose a self-service recovery-reset button; this remains an administrator-assisted workflow.
- **Worksheets and exports:** teacher PDF uploads have type/size checks and scoped retrieval; the UI keeps an explicit open/download fallback when native preview/printing is unavailable. Excel output uses explicit inline-string cells for names/student numbers, so formula-looking names remain text. The requested four column headers are retained.
- **Accessible controls:** the source contains keyboard-operable form controls, radio labels/legends, focus restoration, visible focus styles, live feedback regions, a dynamic skip-link target and reduced-motion handling. The above keyboard routing fix addresses one concrete mismatch; it does not establish conformance for all assistive technology.

## Verification performed in this audit

| Check | Outcome |
| --- | --- |
| `node tests/tts-backend.test.mjs` | Pass on 11 October; 148 isolated D1/R2 route checks with a mocked upstream, including both modes' review gates and redirect rejection |
| `node tests/speech-studio.test.cjs` | Pass; explicit generation, private auditions, exact-clip review and lifecycle cleanup |
| `node tests/backend.test.mjs` | Pass; actual starter bank, isolated D1/R2, 166 assertions/API checks |
| `node tests/campus-engine.test.cjs` | Pass; targeted keyboard routing plus existing engine regressions |
| `node tests/backend-client.test.cjs` | Pass; shared mutation ordering, failed-queue recovery, stale-session cancellation and existing adapter checks |
| `node tests/campus-integration.test.cjs` | Pass; actual app/adapter integration with a controlled server |
| `node node_modules/typescript/bin/tsc --noEmit` | Pass |
| `git diff --check` | Pass at the recorded checkpoint |
| Deferred metadata/answer response reproduction | Reproduced QA-03 before repair; permanent ordering regression now passes |

Use the project's configured Node runtime; these checks used the bundled Node runtime. No paid API, deployed database, production student data, native printer or audible playback was involved.

## Limits and follow-up acceptance checks

1. **Visual review is separate.** This source review cannot establish portrait readability, pixel-art quality, phone clipping, contrast in actual scenes or animation feel. Follow the visual evidence and outstanding checks in `design-qa.md` rather than treating this document as art approval.
2. **Accessibility needs a real assistive-technology pass.** Canvas exploration remains spatial. Keyboard support alone does not demonstrate that a screen-reader user can identify and reach every NPC. Test VoiceOver with the full student route, large text, visible focus and reduced motion before claiming broad accessibility.
3. **Audio is browser-dependent.** No physical listening test was performed here. Text remains available when a voice is absent or fails. Teacher-authored question changes do not guarantee that separately generated audio updates with them.
4. **PDF printing is device-dependent.** Code and component tests cannot establish successful native PDF preview, OS print dialogs, page layout or a physical printout on every browser. Check actual uploaded Chinese/English PDFs on the intended classroom devices and retain the open/download fallback.
5. **Authentication depends on the hosting boundary.** The current teacher integration trusts the Sites-authenticated identity headers. The production gateway must strip caller-supplied identity headers before injecting trusted identity. A standalone deployment outside that boundary requires equivalent authentication; this audit did not penetrate-test the live gateway.
6. **Class enrolment is classroom access, not examination identity proof.** A class code plus a newly registered student number/name is suitable only within the teacher's enrolment workflow. Teachers should verify their roster; the game does not independently prove a student's real identity.
7. **Learning claims remain bounded.** Scores report responses to the authored activities. Three questions in a subject do not establish curriculum mastery; stars are progress indicators. No classroom pilot, measured completion-time study or efficacy claim was added by this audit.
