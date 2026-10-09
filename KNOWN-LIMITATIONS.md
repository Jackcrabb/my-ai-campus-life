# Known limitations

This document distinguishes implemented behavior from verification results for **My AI Campus Life**. It records the audio checks made on **9 October 2026**. It does not claim that every browser, device or voice completes playback successfully.

## Dialogue speech is browser-dependent

The game uses Web Speech to synthesize the displayed dialogue at playback time. It does not include pre-recorded character audio. Traditional Chinese selects Cantonese, Simplified Chinese selects Mandarin, and English selects English; Cantonese and Mandarin are never substituted for one another. Missing or failed speech leaves the text available.

The module selects and reports a voice, cancels superseded lines, waits before starting replacements, and permits one retry only for an interrupted/cancelled attempt that has **not started**. Once a line starts, an interruption does not automatically reread it. Use the explicit replay control to try again.

Queueing and speaking have separate watchdogs. A voice must start within 30 seconds. The speaking allowance begins on its actual start event, with a conservative length-based limit. A timeout stops the attempt and releases music ducking; it is not reported as successful playback.

### What was observed

| Environment / check | Observation | What it establishes |
|---|---|---|
| Browser voice selection | Cantonese selected 善怡 (`yue-HK`), Mandarin selected 婷婷 (`zh-CN`), and English selected Daniel (`en-GB`). | The requested languages mapped to different matching voice metadata. This alone does not verify audible output or a complete spoken line. |
| Isolated Chrome lifecycle fixture | A long Cantonese utterance emitted an end event about 253 ms after queueing, without a start event. | Complete playback was **not verified**. The module now reports `speech-did-not-start` for an end without a start. The cause in that browser environment was not established. |
| In-app browser switch test | Cantonese started; after a switch, English remained queued for about 14 seconds, then started but did not provide a completion event before the watchdog. | A full switch-and-completion sequence **failed verification**. The later timer change prevents queueing time from consuming the speaking allowance; it does not prove that the browser will now emit an end event. |
| Automated audio tests | Strict language selection, cancellation generations, bounded pre-start retry, no automatic repeat after start, late-event guards, separate queue/playback timeouts, volume, ducking and cleanup pass with mocked APIs. | Application control logic is tested. Mocks do not establish a browser provider's reliability or physical audibility. |

**Reliable end-to-end playback in all three languages remains unverified.** No physical listening test was completed by the automated checks. A status of “speaking” or a matching voice name must not be presented as proof that a user heard the complete sentence.

For a classroom session, use **Test voice** in each intended language on the actual device, then try a complete dialogue and a language switch. If speech fails, continue with the visible text, try explicit replay, or mute voice. Voice availability depends on the browser/OS; some voices may use the provider's remote service. The game cannot guarantee a unique or gender-matched voice for every character.

## Music verification

The background melody is newly synthesized from a public-domain *Greensleeves* score; no DSE recording is used. A separate Chrome analyser test confirmed a running Web Audio context and nonzero output after the mix adjustment: one sample at 100% music volume measured RMS approximately **0.108**, with an observed peak approximately **0.426**. No clipping was observed in that test.

Those measurements establish generated digital audio. They do **not** establish that the user's speakers produced audible music. Physical listening and target-device checks remain necessary. Playback requires a user gesture and respects the in-game music volume, mute and pause controls.

## Learning and deployment evidence

The 234-question bank is a curated starting point, not a complete S1–S6 curriculum. Lesson times are planning estimates; student pilot results and general learning efficacy have not been established. Software tests do not substitute for learner evaluation or a complete accessibility audit.

A deployment is verified separately from local testing. Consult the repository's current README and release information for the actual deployed URL and scope. See the [user guide](USER-GUIDE.md), [teaching guide](DESIGN-AND-TEACHING-GUIDE.md) and [asset/audio provenance](ASSET-PROVENANCE.md) for the intended workflows and sources.
