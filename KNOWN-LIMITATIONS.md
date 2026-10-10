# Known limitations

This document distinguishes implemented behavior from verification results for **My AI Campus Life**. It records checks and user reports through **10 October 2026**. It does not claim that every browser, device or voice completes playback successfully.

## Dialogue speech is browser-dependent

The game uses Web Speech at playback time and does not include pre-recorded character dialogue. **The reported selection bugs have received code fixes:** `boy/girl` aliases now normalize correctly, and matching language plus known gender are required before regional, local or standard-voice preferences. English numerals become English words in the spoken text only; the display stays unchanged and full sentences are not split into separate utterances. Speech rate and pitch are both `1`. Delayed starts recheck voice availability, and language changes or replay cancel superseded speech.

These fixes are covered by tests, but they do not establish audible pronunciation or fluency on every device. The read-only native voice audit on this Mac found female Cantonese Sinji and female Mandarin Tingting/Meijia, but no known male Cantonese or Mandarin voice. **Where a matching known gender is absent, automatic NPC speech remains unavailable instead of using an opposite-gender voice.** Browser inventories can differ from the native list. Web Speech exposes no standard gender property, so the code uses verified name/URI aliases and explicit hints; it does not guess unspecified novelty voices. See [the Web Speech voice properties](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice).

The selected replacement is **free MP3 production through TTSFree, with TTSMaker as a manual fallback**. See the [production workflow](docs/FREE-VOICE-TOOLS.md). Google Cloud and self-hosted model research are historical alternatives, not current deployment requirements. This documentation update creates no accounts, uses no keys and makes no paid calls. The latest audition baseline is **TTSFree Default: raw rate `0`, pitch `0`**; the earlier `100/100` and `70/100` adjustments are superseded. These controls are not Web Speech multipliers. Three Default auditions have been downloaded: Cantonese HiuMaan, Mainland Mandarin Xiaoyi and British English Sonia, each about 9–10 seconds. The Taiwan Mandarin YunJhe attempt failed twice with zero-byte output and is not a usable sample. The three files still require listening approval; they do not constitute a completed character voice library. See the [audition files and production record](design/voice-auditions-free/README.md). **No prerecorded MP3 dialogue is integrated yet.** The current game uses the corrected Web Speech implementation, with the availability and listening limitations above. No new synthesis API, credentials or fees were introduced by those fixes.

### Manual recordings do not automatically follow question edits

Teacher-created or edited questions may have no matching MP3 or only an outdated version. **The latest written question, options and feedback are authoritative.** Each new revision needs separate manual generation, listening review and integration. Saving or publishing a question does not update an audio file. The planned playback integration must check the matching language and text revision, preserve the visible text and avoid playing an obsolete clip; this is a pending requirement, not a claim that the MP3 integration already exists.

TTSFree lists three Cantonese voices in the checked catalog. That does not provide twenty independent Cantonese voices for twenty characters. Different characters may share a voice, while one character must retain a consistent selected voice within each language. Free quotas, manual verification and listening review also limit production speed; they do not guarantee a full set of approved recordings.

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

**Reliable end-to-end playback in all three languages remains unverified.** No physical listening test was completed by the automated checks. A status of “speaking” or a matching voice name must not be presented as proof that a user heard the complete sentence.

For a classroom session, use **Test voice** in each intended language on the actual device, then try a complete dialogue and a language switch. If speech fails, continue with the visible text, try explicit replay, or mute voice. Voice availability depends on the browser/OS; some voices may use the provider's remote service. The game cannot guarantee that a matching voice is installed for every character. It leaves the line silent when the required known gender or language is unavailable, and does not promise twenty unique voices.

## Music verification

The background melody is newly synthesized from a public-domain *Greensleeves* score; no DSE recording is used. A separate Chrome analyser test confirmed a running Web Audio context and nonzero output after the mix adjustment: one sample at 100% music volume measured RMS approximately **0.108**, with an observed peak approximately **0.426**. No clipping was observed in that test.

Those measurements establish generated digital audio. They do **not** establish that the user's speakers produced audible music. Physical listening and target-device checks remain necessary. Playback requires a user gesture and respects the in-game music volume, mute and pause controls.

## Character and interaction verification

The current source uses distinct canonical identities for 20 NPCs, dedicated higher-detail dialogue portraits and four student uniform variants. New student face/build artwork follows the approved review 08 direction. Height variation uses equal scaling on both axes; it does not stretch a shared body. Staff retain their separate existing walking artwork rather than being regenerated without a specific need. Source portrait interiors are near-opaque (typically alpha 252–253/255); browser opacity/interpolation is handled separately.

Engine tests cover identity-preserving uniform selection, portrait crop bounds, fixed per-identity scale, viewport-sized backing resolution, interaction intent, NPC movement at 150 versus player 170 world units/second, and distance-based gait. Actual component screenshots were inspected at desktop and 390×844. This is not a complete animation/accessibility audit or a guarantee of identical rendering on every device.

Names no longer float above NPCs. Cases and Subjects are read-only progress views, not shortcuts into questions. New Game opens the Student / Teacher chooser. Student starts new character setup; Teacher opens the standalone authorized workspace without entering the campus. Opening the chooser or teacher workspace preserves the student save, and Continue opens the saved campus; student report downloads are removed. Teacher Excel results and worksheet PDF access remain.

## Uploaded worksheets and printing

The source includes teacher PDF uploads and a **Print control in the top-right HUD**, scoped to the current floor. Physical printer objects have been removed from corridors and rooms. PDF versions may be Traditional Chinese, English or both, with a 5 MiB limit per file. Student access is server-scoped to the owning teacher, class grade and current floor. D1 stores metadata and R2 stores files; these require the corresponding deployed bindings and authorization, beyond a static preview.

Isolated component tests cover language availability, preview/print sequencing, failed-upload form retention and PDF validation. D1/R2 tests also cover exact/over-limit files, Unicode filenames and retention of retryable metadata after storage deletion fails. Teacher hub tests run without a campus engine and cover subject selection, grade/class filters, worksheet scoping, read-only core AI content and both export modes. Responsive browser checks cover preview and download without a horizontal overflow. The browser file-picker upload was not completed because of the local extension’s file-access permission; fixture tests covered multipart success/failure instead. **The native system print dialogue and physical printing were not verified.** Open PDF and Download PDF remain explicit fallbacks. See [WORKSHEETS.md](docs/WORKSHEETS.md) for the exact evidence and limitations.

## Learning and deployment evidence

The 234-question bank is a curated starting point, not a complete S1–S6 curriculum. All 234 authored replacements have been completed against Education Bureau/HKEAA references, with trilingual generation, mathematical/structure/mirror/version tests and cross-agent review. This does not establish external subject-expert endorsement, complete curriculum coverage or student learning efficacy. See [curriculum alignment](docs/CURRICULUM-ALIGNMENT.md). Lesson times are planning estimates; student pilot results and general learning efficacy have not been established. Software tests do not substitute for learner evaluation or a complete accessibility audit.

A deployment is verified separately from local testing. Public entry connectivity was checked on 10 October 2026; feature coverage and the deployed revision are recorded with each release. Local checks alone do not establish the public site’s behavior. Consult the repository's current README and release information for the deployed URL and scope. See the [user guide](USER-GUIDE.md), [teaching guide](DESIGN-AND-TEACHING-GUIDE.md) and [asset/audio provenance](ASSET-PROVENANCE.md) for the intended workflows and sources.
