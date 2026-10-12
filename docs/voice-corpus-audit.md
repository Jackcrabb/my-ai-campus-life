# Historical NPC voice corpus audit

> **Historical proposal, superseded on 11 October 2026.** Keep this audit as a dated corpus inventory, not current playback policy. The user retained strict device Cantonese, removed the teacher Speech Studio and made all academic questions/options/explanations text-only. The current source bundles 104 exact fixed-dialogue MP3s (52 Mandarin and 52 English) for 20 canonical characters, with provider locale/gender and complete decoding/integrity checks; human listening review is not claimed. The earlier “no Web Speech fallback” recommendation below no longer applies. See the [current internal speech service](OPENROUTER-TTS-SERVICE.md) and [README sound policy](../README.md#sound).

Audit date: 10 October 2026. Scope: inspect the current game and author an audition corpus. No runtime changes or speech-synthesis requests were made by this audit.

## Decision and initial review corpus

Use pre-generated audio with an explicit voice for each canonical character and each locale. Do not select a browser voice at playback time, guess a voice from a language family, or silently substitute another locale when a clip is missing.

`data/voice-auditions.json` contains **20 original audition lines, each in `zh`, `cn`, and `en`: 60 candidate clips**. The `zh` text is authored spoken Cantonese; `cn` is Mandarin and `en` is English. These are review samples, not replacements for the complete game dialogue. Names belong to fictional NPCs. No learner names, numbers, grades, class sections, reflections, or teacher-created text appear in the corpus.

Schema: `{schemaVersion: 1, lines: [{id, characterId, text: {zh, cn, en}}]}`. IDs use `audition-<canonical character ID>`. The cast configuration and generation CLI are separate work: `data/voice-cast.json` and `scripts/generate-voices.mjs`. Generation must validate the project's actual provider voice inventory. A configured voice name is not evidence that the project can synthesize it. No audition audio has been generated or approved as part of this audit.

## Current speech entry points

Line numbers refer to the inspected source and can shift with later edits.

| File / function | Current behavior | Migration implication |
| --- | --- | --- |
| `public/campus/game/app.js:760`, `specialDialogue()` | Builds introduction, subject teacher, office, vice principal, mentor and exit dialogue. | Extract static author-owned strings; remove personal and progress interpolation from spoken narrative. |
| `public/campus/game/app.js:918`, `dialogueModel()` | For each case, uses two `mission.opening` lines before completion, and one `mission.takeaway` afterward. Other conversations use `specialDialogue()`, then registry identity overrides. | Case speech sources are in `public/campus/game/content.js`. Keep all opening and completed branches. |
| `public/campus/game/app.js:970`, `renderDialogue()`; call at 995 | The only app call to `audio.speak()`: `{key, text, locale, characterId, gender}`. `key` is `${dialogueVisit}:${dialogueId}:${dialogueLine}:${state.lang}`. | Preserve the key for per-visit playback deduplication. It is not a persistent corpus ID. Resolve the character alias before clip lookup. |
| `public/campus/game/app.js:1531`, action `voice-test` | Unlocks audio from a user gesture, then calls `audio.tryVoice(state.lang)`. | Use a known recorded test line, assigned to an explicit canonical character. |
| `public/campus/game/app.js:1533`, action `voice-replay` | Unlocks audio, then calls `audio.replay()`. | Replay must retain the current dialogue line, including after a test sample. |
| `public/campus/game/campus-audio.js:140`, `speak()` | Current Web Speech implementation selects an available device/provider voice and guards cancellation, retries, timeouts, mute, visibility and music ducking. | Replace the speech transport while preserving lifecycle safeguards. Device voice selection cannot guarantee the same 20 voices across computers. |
| `public/campus/game/campus-audio.js:189–190`, `replay()` / `tryVoice()` | Test text is “歡迎來到我的人工智能校園生活。” / “欢迎来到我的人工智能校园生活。” / “Welcome to your AI campus life.”; the pseudo-character is `preview`. | `preview` is not a canonical NPC. Assign this test to `staff-mentor`, or select a canonical audition explicitly; do not introduce a twenty-first voice. |

The audio object is created with `CampusAudio.create({onState})`. Its public surface is `unlock`, `speak`, `replay`, `tryVoice`, `stopVoice`, `setSettings`, `setMusicPlaying`, `resetSettings`, `dispose`, and a `state` getter. The settings and status UI currently describes device-generated speech and shows `actualLocale`, `requestedLocale`, voice name, fallback/remote/unavailable flags and errors. Those labels need a separate runtime update when recorded audio is ready.

Evidence cards, case options and feedback, repairs, subject questions, the transfer quiz, reflections, reports and teacher editing forms are **not currently sent to `speak()`**. The page's `aria-live` announcements are separate from this audio module. Do not accidentally expand the cloud synthesis corpus by harvesting every visible DOM string.

## Identity and alias rules

`public/campus/game/characters.js` is the identity authority. Its canonical set is:

| Canonical IDs | Role |
| --- | --- |
| `staff-chinese`, `staff-english`, `staff-maths`, `staff-chemistry` | Chinese, English, mathematics, science |
| `staff-geography`, `staff-computer`, `staff-history`, `staff-art` | Geography, ICT, history, visual arts |
| `staff-music`, `staff-library`, `staff-rooftop`, `staff-playground` | Music, librarian, ecology, PE |
| `staff-principal`, `staff-vice`, `staff-office`, `staff-mentor` | Principal, vice principal, school office, new student mentor |
| `voice`, `privacy`, `culture`, `access` | The four case students |

There are **16 staff and four students**. The case students' atlas names such as `student-voice` are not their canonical character IDs.

Resolve `CAMPUS_CHARACTERS.resolve(dialogueId).id` before voice selection:

- `subject:<room>` resolves to that room's teacher; `subject:hall` resolves to `staff-principal`.
- `staff:office` and `staff:vice` resolve to `staff-office` and `staff-vice`.
- Both `prologue` and `finale` resolve to **`staff-mentor`**. Although the prologue helper initially constructs a principal label, `dialogueModel()` replaces it with the registry identity.
- `exit` resolves to `staff-principal`.
- The registry's `boy` / `girl` fields are identity metadata. They are not provider voice identifiers. An explicit cast is authoritative.

## Corpus size and dynamic text

A privacy-safe production dialogue corpus can contain **53 character/line entries per locale, or 159 clips** after dynamic spoken fragments are replaced with fixed authored text:

| Source | Entries per locale |
| --- | ---: |
| Four case students: two openings plus one completed takeaway each | 12 |
| Thirteen subject spaces: introduction plus instructions, voiced by each space's teacher | 26 |
| New student introduction | 4 |
| School office, vice principal and fourth-floor mentor: two each | 6 |
| Exit: two lines for locked and two for unlocked | 4 |
| One explicit mentor test line | 1 |
| **Total** | **53** |

This is a proposed scope, not a claim that 159 files already cover the unchanged runtime. The 60 audition clips are a separate review collection. Identical teacher wording still requires a separate clip when a different character speaks it.

Dynamic fields requiring an explicit decision:

| Current source | Dynamic content | Recommended fixed speech |
| --- | --- | --- |
| `setGradeQuestions()`, `app.js:109` | Overwrites every room description with grade-specific generic text. | A fixed subject introduction or general learning instruction. Keep the grade in a visual badge. **Do not extract the original `subjects.js` descriptions and assume they match current speech.** |
| Prologue first line | Student grade and class section. | Welcome the new student without their grade or class. Show those locally beside the dialogue if useful. |
| Teacher second line | Assignment question count and room star total. | Give fixed instructions about choosing a question, checking evidence and using feedback. Show totals in the question panel. |
| Exit first line, both branches | Earned stars and remaining stars. | State that the gate is open or that exploration can continue; show the actual progress separately. |

Current speech does not contain the student's name or number, but it does contain grade/class values. Future class assignments can change counts and totals, so enumerating all present combinations would not solve the general problem. Keep dynamic values out of synthesis requests. For transcript consistency, the displayed spoken paragraph should match the recorded text; put dynamic badges or counters outside that paragraph. Teacher-authored questions and learner reflections must not enter a cloud generation pipeline implicitly.

Existing `zh` dialogue is mostly formal written Chinese. Authored spoken Cantonese should be reviewed as its own script before full production synthesis. Simplifying the characters in Cantonese text is not a Mandarin translation.

## Matching and manifest recommendation

Use two separate identifiers:

1. A stable content ID, for example `case.voice.opening.0`, `subject.chinese.intro`, `prologue.0`, `exit.locked.0`, or `test.staff-mentor`.
2. The existing transient playback key, which prevents duplicate playback during one dialogue visit.

For content matching, normalize only Unicode NFC, line endings and outer whitespace. Preserve punctuation, script and wording. Hash a versioned UTF-8 tuple such as `[1, canonicalCharacterId, locale, normalizedText]` with SHA-256. A text-only hash may be stored as a separate diagnostic, but lookup must also include canonical character and exact locale. Include provider, full voice name, audio format, speaking rate and other synthesis settings in a separate generation fingerprint so changing the cast invalidates the asset cache.

Each production manifest entry should retain stable line ID, canonical character ID, runtime locale, provider language code, explicit full voice name, text or text hash, generation fingerprint, local asset path, audio checksum and review status. The current generation CLI already records these ideas for auditions; keep its manifest format as the implementation authority instead of adding a competing format.

At runtime, require an exact character/locale/content match and a reviewed asset. Missing, stale or unapproved audio should leave the visible text usable and report unavailable audio. Do not fall back to Web Speech, another locale, another character, or a fuzzy text match. Serve audio assets from the site. Provider credentials belong only in the local generation environment; the browser does not synthesize speech or transmit dialogue to Google.

## Build and verification

The framework project uses Node 22.13 or later. `npm run build` invokes `scripts/run-framework.mjs build`; `npm run lint` runs ESLint. There is no general `npm test` script. The runtime lives in `public/campus`; changes to the archived `dist` game are not the production source. `index.html` loads `campus-audio.js` before `app.js`; a future manifest loader must be available before the audio module needs it.

Relevant existing checks:

- `node tests/voice-generation.test.mjs`: the new generation plan's corpus/cast validation, all 60 locale-specific requests, deterministic fingerprints and missing-provider-voice rejection. It makes no synthesis requests.
- `node tests/campus-audio.test.cjs`: audio lifecycle, user gesture, duplicate/replay handling, locale selection, stale events, cancellation, timeout, mute, visibility and music behavior. Native-synthesis mocks will need adaptation when the transport changes.
- `node tests/progression.test.cjs`: actual app in a VM, including language changes during dialogue, locale-bearing playback keys and the currently displayed translated text.
- `node tests/campus-integration.test.cjs`: app/server integration and changed class assignments. Useful when verifying that custom assignments cannot silently produce cloud speech requests.
- `tests/campus-audio-diagnostic.html`: existing manual audio diagnostics; its device-voice assumptions will need revision.

Before runtime migration is accepted, verify exact locale and canonical voice on all 20 NPCs, stop/replay behavior, language changes mid-clip, background-tab pause, mute and volume, no stale callbacks or overlapping clips, missing/unapproved asset behavior, music ducking, cache invalidation after script/cast changes, and absence of student data from synthesis inputs. Listen to the 60 auditions first: data validation cannot establish pronunciation, naturalness or voice suitability.

Completed for this audit: schema, unique IDs, all three nonempty locales, and an exact match against the 20 registry/cast identities passed. The audition text contains 972 Cantonese, 1,017 Mandarin and 3,082 English Unicode code points, 5,071 in total; this is a text-size inventory, not a provider billing quote. `voice-generation.test.mjs`, `campus-audio.test.cjs` and `progression.test.cjs` all passed. No synthesis request, audio playback review, runtime modification or deployment was performed. A full application build was not needed for these two data/documentation files.
