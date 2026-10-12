# Known limitations

This document distinguishes implemented behavior from verification results for **My AI Campus Life**. It records checks and user reports through **12 October 2026**. It does not claim that every browser, device or voice completes playback successfully, or replace the deployment evidence in the [release audit](docs/DISTRIBUTION-AUDIT.md#12-october-2026-release-verification). Public version 4 was successfully deployed on 12 October 2026.

## Speech scope and device limits

**Only fixed NPC dialogue and the introduction use speech. All academic questions, options and explanations are text-only.** Teacher edits therefore need no voice refresh. The backend also rejects academic speech quotes, generation, lookup, approval and playback with HTTP 410 `TTS_SUBJECT_AUDIO_DISABLED`, including older stored rows; those rows remain preserved. There is no teacher-facing Speech Studio; audio preparation and review are internal maintenance work.

The source bundles **104 fixed NPC/introduction MP3s: 52 Mandarin and 52 English lines for 20 canonical characters**. Each manifest entry matches the exact character, locale and text. The free Edge authoring run verified four voices' catalog locale/gender and every complete MP3 decode and SHA-256 hash; total output is 6,905,376 bytes and 1,150.90 seconds. All entries explicitly retain `audiblyReviewed: false`: metadata and decoding do not establish pronunciation, naturalness or physical audibility. The accepted OpenRouter samples are historical auditions, not replacements for unrelated game lines. Gameplay loads bundled audio without provider synthesis or an API key. The separate internal OpenRouter service retains zero-price checks and **6 requests / 3,000 characters / USD 0 per UTC day**. See the [internal service record](docs/OPENROUTER-TTS-SERVICE.md).

The requested OpenRouter Cantonese sample was heard by the user as Mandarin and rejected. **OpenRouter `zh` generation is blocked.** At the user's request, Traditional Chinese retains the existing browser/OS Cantonese path; that playback makes no OpenRouter request and creates no MP3. Paid Cantonese generation is not authorized.

The missing Mandarin report was reproduced on this Mac: female Tingting could speak, but no known male Mandarin device voice passed the gender check. Bundled recordings now cover the fixed male/female Mandarin lines without relying on that inventory. Traditional Chinese, or a changed/missing fixed line using device fallback, still requires a matching installed voice. Browser speech enforces language and known gender, including `boy/girl` aliases; English numerals are expanded in spoken text only. An initially empty voice inventory waits up to three seconds, with cancellation on superseded requests. The earlier inventory found female Cantonese Sinji but no known male Cantonese voice. An unavailable matching voice leaves text visible rather than using a wrong voice. Web Speech has no standard gender property, so selection uses known names/URIs and explicit hints. See [voice properties](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice).

Earlier [manual TTSFree audition files](resources/design/voice-auditions-free/README.md) remain historical production evidence. They are not proof of current full-game audio coverage.

### Current browser speech behavior

The module selects and reports a voice, cancels superseded lines, waits before starting replacements, and permits one retry only for an interrupted/cancelled attempt that has **not started**. Once a line starts, an interruption does not automatically reread it. Use the explicit replay control to try again.

Queueing and speaking have separate watchdogs. A voice must start within 30 seconds. The speaking allowance begins on its actual start event, with a conservative length-based limit. A timeout stops the attempt and releases music ducking; it is not reported as successful playback.

### Earlier browser observations and current checks

| Environment / check | Observation | What it establishes |
|---|---|---|
| Browser voice selection | Cantonese selected 善怡 (`yue-HK`), Mandarin selected 婷婷 (`zh-CN`), and English selected Daniel (`en-GB`). | The requested languages mapped to different matching voice metadata. This alone does not verify audible output or a complete spoken line. |
| Isolated Chrome lifecycle fixture | A long Cantonese utterance emitted an end event about 253 ms after queueing, without a start event. | Complete playback was **not verified**. The module now reports `speech-did-not-start` for an end without a start. The cause in that browser environment was not established. |
| In-app browser switch test | Cantonese started; after a switch, English remained queued for about 14 seconds, then started but did not provide a completion event before the watchdog. | A full switch-and-completion sequence **failed verification**. The later timer change prevents queueing time from consuming the speaking allowance; it does not prove that the browser will now emit an end event. |
| Automated audio tests | All 20 registered NPCs × three locales are checked for gender-consistent selection with fixture voices. Missing-gender handling, aliases/hints, English numbers, natural rate/pitch, inventory changes, replay/cancellation, watchdogs, volume, ducking and cleanup pass. | Application control logic and speech text are tested. Fixture voices do not establish installed voice availability, a provider's reliability or physical audibility. |
| Fixed MP3 bundle | 104 exact lines pass corpus matching, SHA-256 and complete decode; four provider catalog voices match expected locale/gender. | Technical coverage of the fixed Mandarin/English corpus, not a full listening review. |
| Current local recorded playback | The lead agent observed Mandarin male/female and English male/female examples start and reach their end events without error, including male Mandarin on the Mac lacking a matching device voice. | The bundled route resolves this reproduced inventory dependency. Browser events do not establish physical audibility or every device. |

**Reliable end-to-end playback in all three languages remains unverified.** No physical listening test was completed by the automated checks. A status of “speaking” or a matching voice name must not be presented as proof that a user heard the complete sentence.

For a classroom session, use **Test voice** in each intended language on the actual device, then try a complete dialogue and a language switch. If speech fails, continue with the visible text, try explicit replay, or mute voice. Cantonese and device fallback depend on browser/OS voices; some may use a remote service. The bundled Mandarin/English recordings still require files to load and the browser to permit audio playback. The game does not promise twenty unique voices. Future Edge authoring availability is not guaranteed, and no paid fallback is enabled.

## Music verification

The background melody is newly synthesized from a public-domain *Greensleeves* score; no DSE recording is used. A separate Chrome analyser test confirmed a running Web Audio context and nonzero output after the mix adjustment: one sample at 100% music volume measured RMS approximately **0.108**, with an observed peak approximately **0.426**. No clipping was observed in that test.

Those measurements establish generated digital audio. They do **not** establish that the user's speakers produced audible music. Physical listening and target-device checks remain necessary. Playback requires a user gesture and respects the in-game music volume, mute and pause controls.

## Character and interaction verification

The current source uses distinct canonical identities for 20 NPCs, dedicated higher-detail dialogue portraits and four student uniform variants. New student face/build artwork follows the approved review 08 direction. Height variation uses equal scaling on both axes; it does not stretch a shared body. Staff retain their separate existing walking artwork rather than being regenerated without a specific need. Source portrait interiors are near-opaque (typically alpha 252–253/255); browser opacity/interpolation is handled separately.

Engine tests cover identity-preserving uniform selection, portrait crop bounds, fixed per-identity scale, viewport-sized backing resolution, interaction intent, NPC movement at 150 versus player 170 world units/second, and distance-based gait. Actual component screenshots were inspected at desktop and 390×844. This is not a complete animation/accessibility audit or a guarantee of identical rendering on every device.

Names no longer float above NPCs. Cases and Subjects are read-only progress views, not shortcuts into questions. New Game opens the Student / Teacher chooser. Student starts new character setup; Teacher opens the standalone authorized workspace without entering the campus. Opening the chooser or teacher workspace preserves the student save, and Continue opens the saved campus; student report downloads are removed. Teacher Excel results and worksheet PDF access remain.

Purposeful routines now assign duties, stations, partners and 20–60-second dwell to all 20 named people. Seven released sheets provide 96 activity drawings for 24 identity/outfit variants: all 16 staff and the four peers in uniforms 0 and 3. The eight peer variants in uniforms 1–2 are unfinished; missing activities use a neutral fallback. There are five ambient pupils per corridor and three per room, but their faceless activity art awaits confirmation and is not implemented. State-machine tests and source-sheet checks do not replace a scene-by-scene motion review. The [routine status](docs/NPC-BEHAVIOR-PLAN.md) records the remaining work.

Desktop character setup has browser evidence of the restored school background, complete figure and reachable lower form actions at 1440 × 800 and a scrolled 1280 × 600 state. The clean 1280 × 600 unscrolled retake also shows the complete figure and restored background. The clean 390 × 844 phone retake shows the full figure and courtyard above the stacked form; lower-phone control scrolling and complete focus traversal remain separate checks. See the [UX audit](docs/UX-AUDIT.md) for screenshots and scope.

## Teacher questions, stars and reports

The teacher workspace supports more than three subject questions with no fixed question-count cap. Each question accepts **1–10 whole-number stars**. This does not imply unbounded storage or performance: very large banks still depend on browser and hosting capacity. The 39-question, 103-star campus is the starter configuration only. The core AI cases and transfer task remain read-only.

Published changes enter a class through a **new activity**. Existing activities retain the questions and star settings captured when created. First-response percentage scores and one-time earned stars are different measures; a correct retry may earn stars without changing the first-response score. An incomplete percentage stays blank while current earned stars can still be reported.

The Results table, subject Excel, all-subject Excel and subject print report include earned and available stars. The print control requests the browser’s native print flow; users must still select a destination and confirm. Automated print preparation or a call to `window.print()` does not establish that a system dialog or physical printer completed successfully. Deployment verification remains separate from local source checks.

## Uploaded worksheets and printing

The source includes teacher PDF uploads and a **Print control in the top-right HUD**, scoped to the current floor. Physical printer objects have been removed from corridors and rooms. PDF versions may be Traditional Chinese, English or both, with a 5 MiB limit per file. Student access is server-scoped to the owning teacher, class grade and current floor. D1 stores metadata and R2 stores files; these require the corresponding deployed bindings and authorization, beyond a static preview.

Isolated component tests cover language availability, preview/print sequencing, failed-upload form retention and PDF validation. D1/R2 tests also cover exact/over-limit files, Unicode filenames and retention of retryable metadata after storage deletion fails. Teacher hub tests run without a campus engine and cover subject selection, grade/class filters, worksheet scoping, read-only core AI content and both export modes. Responsive browser checks cover preview and download without a horizontal overflow. The browser file-picker upload was not completed because of the local extension’s file-access permission; fixture tests covered multipart success/failure instead. **The native system print dialogue and physical printing were not verified.** Open PDF and Download PDF remain explicit fallbacks. See [WORKSHEETS.md](docs/WORKSHEETS.md) for the exact evidence and limitations.

## Learning and deployment evidence

The 234-question bank is a curated starting point, not a complete S1–S6 curriculum. All 234 authored replacements have been completed against Education Bureau/HKEAA references, with trilingual generation, mathematical/structure/mirror/version tests and cross-agent review. This does not establish external subject-expert endorsement, complete curriculum coverage or student learning efficacy. See [curriculum alignment](docs/CURRICULUM-ALIGNMENT.md). Lesson times are planning estimates; student pilot results and general learning efficacy have not been established. Software tests do not substitute for learner evaluation or a complete accessibility audit.

A deployment is verified separately from local testing. Public entry connectivity was checked on 10 October 2026; feature coverage and the deployed revision are recorded with each release. Local checks alone do not establish the public site’s behavior. Consult the repository's current README and release information for the deployed URL and scope. See the [user guide](USER-GUIDE.md), [teaching guide](DESIGN-AND-TEACHING-GUIDE.md) and [asset/audio provenance](ASSET-PROVENANCE.md) for the intended workflows and sources.
