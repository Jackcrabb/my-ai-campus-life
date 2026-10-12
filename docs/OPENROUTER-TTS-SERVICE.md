# Internal fixed-dialogue speech service

**Current policy — 11 October 2026:** speech is maintained behind the scenes for **fixed NPC dialogue and the introduction only**. All academic questions, options and explanations are text-only. Teacher changes require no recording refresh. The user no longer wants a Speech Studio in the teacher workspace; ordinary teachers and students do not manage provider keys, generation or voice review.

The user accepted the Mandarin and English audition samples as usable. The requested Cantonese sample was heard as Mandarin and rejected, so OpenRouter `zh` generation remains blocked. **Traditional Chinese retains the existing strict browser/OS Cantonese read-aloud**, including its language/gender availability checks. It makes no OpenRouter request and produces no MP3. No paid Cantonese service is authorized.

## Bundled fixed dialogue — current source

`public/campus/game/fixed-voices.js` contains **104 MP3 entries: 52 Mandarin and 52 English, covering all 20 canonical characters**. The corpus is exported from the actual runtime dialogue model: introduction, subject-teacher greetings, office/vice-principal/principal dialogue and case openings/completion lines. Academic questions, options and explanations are excluded. Variable grade/class/star details are shown in the interface rather than interpolated into fixed speech. Matching requires the exact canonical character, locale and complete sentence.

These are newly authored files from the free Edge speech endpoint, not the earlier OpenRouter trials. The authoring script verified the live voice catalog's locale, gender and GA status before generation:

| Locale / character gender | Voice | Files |
|---|---|---:|
| Mandarin / male | `zh-CN-YunxiNeural` | 23 |
| Mandarin / female | `zh-CN-XiaoxiaoNeural` | 29 |
| English / male | `en-US-GuyNeural` | 23 |
| English / female | `en-US-JennyNeural` | 29 |

The two mentor instructions were revised on **12 October 2026** to refer to each question’s displayed reward and the current star target, so teacher-created activities are not described using fixed starter totals. Only the matching fixed clips were regenerated; teacher questions remain silent.

Rate is **−8%** and pitch is **+0 Hz**. The complete bundle is **6,905,376 bytes / 1,150.90 seconds**. Every file passed full `ffmpeg` decoding, format inspection and SHA-256 verification. The manifest's `approved: true` means this documented **technical release check**; `reviewBasis` is `provider locale/gender metadata and decoded full clip`, and **`audiblyReviewed` remains `false`**. It is not a claim that every line was listened to or that pronunciation/naturalness is certified. Two mentor welcome lines also provide the Mandarin/English preview samples. The lead agent observed male Mandarin recorded playback start and complete without error on the Mac lacking a known male Mandarin device voice; that browser lifecycle check does not prove physical audibility.

Gameplay loads the local MP3 assets: no API key, OpenRouter request or synthesis occurs during playback. If a fixed sentence changes or its file is unavailable, strict matching device speech may be used; an initially empty device voice inventory waits up to three seconds and is cancelled if the request is superseded. Cantonese retains its original device route and still depends on suitable installed language/gender voices. Never substitute a wrong locale or known gender. Source changes, listening checks and successful public deployment are distinct release steps.

## Fixed-dialogue maintenance

The authoring-only script uses Python 3.11 or newer, `edge-tts==7.2.8`, `ffmpeg` and `ffprobe`; these are not application dependencies. Generate in an isolated authoring environment. The public Edge service can change or become unavailable; no ongoing availability or contractual free-service guarantee is claimed. The script has no paid fallback or automatic synthesis retry and cancels its two workers on a failure. Already bundled files need no provider request to play.

1. Export only the bounded fixed corpus with `node scripts/export-fixed-dialogue.mjs`. The exporter rejects unexpected profile/question dependencies.
2. Run `python3 scripts/generate-fixed-voices.py` in the prepared authoring environment when authorized fixed lines change. Cached exact files are reused after verification; changed source/voice/rate/pitch gets a different fingerprint.
3. Run `python3 scripts/generate-fixed-voices.py --validate-only` for offline corpus, manifest, checksum and full-decode checks. This mode does not import Edge or make network requests. `--publish-cache` rebuilds the manifest from verified existing files, also offline.
4. Listen to full lines on target devices to check language, gender, numbers, wording and pacing; record that review separately. Maintain visible text and replay. Do not use the rejected Mandarin-as-Cantonese trial.

Relevant files are `data/fixed-dialogue-corpus.json`, `data/fixed-voice-generation-cache.json`, `public/campus/game/fixed-voices.js` and `public/campus/audio/voices/{cn,en}/`. Current verification includes all 104 exact-dialogue entries, five authoring tests and complete offline validation. No learner data or teacher-authored question text is sent for this production corpus.

## Retained internal OpenRouter capability

This is a separate optional maintenance backend, not the source of the bundled MP3s or a gameplay requirement. It is disabled by default in new installations. This project's configured mode is **FREE_ONLY**, using only `fish-audio/s2.1-pro-free:free`; the audition cast is `staff-chinese` and `staff-maths` in `cn` and `en`. Site-wide daily caps are **6 requests, 3,000 characters and USD 0**. The key is a server secret. Default-voice auditions remain private and cannot be promoted through its review endpoint. The OpenRouter-specific configuration, budget and human-review contract below does not describe the local Edge manifest's technical-review flag.

The existing API route names retain their `teacher/tts` prefix and authorization checks for internal compatibility; they do not imply a teacher-facing product workflow. D1 stores reservations and R2 stores MP3 files. **Academic speech is hard-disabled:** quote, generate, lookup, approval and playback return HTTP 410 `TTS_SUBJECT_AUDIO_DISABLED`, including requests for older question audio. Existing rows remain stored; they are not usable compatibility paths. The owner's ignored `.env.openrouter.local` was a local key handoff file, not a setting included in downloaded source.

## OpenRouter configuration and spending boundary

Configure these through server runtime secrets/settings; never put the API key in public JavaScript, a Git commit, a screenshot, or chat:

| Setting | Default / requirement |
| --- | --- |
| `OPENROUTER_API_KEY` | Absent; a server-only provider key is required. |
| `CAMPUS_TTS_ENABLED` | Disabled unless exactly `1`. |
| `CAMPUS_TTS_MODE` | `FREE_ONLY` unless explicitly set to `BUDGETED`. No paid fallback. |
| `CAMPUS_TTS_AUDITION_ONLY` | Disabled unless exactly `1`; permits private fictional-script auditions in FREE_ONLY mode. |
| `CAMPUS_TTS_CONFIG` | Absent; allowlisted model, locale-specific voices/cast and a current price-review date are required. |
| `CAMPUS_TTS_DAILY_REQUESTS` | Zero unless a positive integer is explicitly configured. |
| `CAMPUS_TTS_DAILY_CHARACTERS` | Zero unless a positive integer is explicitly configured. |
| `CAMPUS_TTS_DAILY_USD` | Must be absent or zero in FREE_ONLY; must be positive in separately authorised BUDGETED mode. |
| `CAMPUS_TTS_BLOCKED_LOCALES` | Operator block list; the new project setting blocks `zh` after its failed Cantonese audition. |

Request and character caps must be positive in both modes. They are **site-wide**, shared by every teacher, and reset by UTC calendar day (08:00 Hong Kong time). A successful, pending, failed or uncertain request consumes a reservation, including a price check stopped before synthesis. Cache hits consume no additional generation reservation. The validation ceilings are 10,000 requests/day, 10 million characters/day and, for BUDGETED only, $1,000/day. These ceilings are not recommended budgets or user authorisation.

### Free-only auditions

Immediately before each newly acquired synthesis POST, the server makes a fresh, unauthenticated `GET https://openrouter.ai/api/v1/models?output_modalities=speech`. It requires the **exact** free model ID, a speech-output modality array, both prompt/completion prices, and zero for **every** numeric pricing field. Missing fields, a changed rate, an additional nonzero request price, malformed data, excessive size, a redirect or a failed lookup stop synthesis. Both provider fetches use Worker-compatible `redirect: "manual"` and reject non-success responses, so a redirect is never followed. The API key is never sent on this public catalog request. Cached playback does not require or trigger another lookup.

The paid `fish-audio/s2.1-pro` model is not an alias or fallback. The service never sends a model fallback list. A live zero-price check is a useful boundary, but does not provide a contractual invoice guarantee or eliminate the interval between catalog lookup and provider processing. Keep a restrictive provider key limit as well. Quotes explicitly state `livePriceCheckRequired: true` and `providerInvoiceGuaranteed: false`; they do not claim that a price was already checked.

The official free-model catalog currently exposes no verified voice inventory (`supported_voices: null`). The marker `__provider_default__` below deliberately omits `voice` in the upstream request. It is allowed **only** in audition mode and makes no dialect, fluency or gender promise. No voice cloning, input references, arbitrary browser text or unlicensed reference recordings are accepted.

The new private audition configuration uses this shape, with a current review date supplied through runtime settings. The documentation example itself does not enable anything. Two characters × two enabled locales produce four possible sample combinations; the daily request cap remains six, not a promise of six usable voices. Cantonese must not be re-enabled on the basis of the model's multilingual marketing or Traditional Chinese text alone:

```json
{
  "schemaVersion": 1,
  "models": {
    "fish-audio/s2.1-pro-free:free": {
      "billing": "free",
      "usdPerMillionCharacters": 0,
      "priceReviewedAt": "YYYY-MM-DD",
      "voices": {
        "cn": ["__provider_default__"],
        "en": ["__provider_default__"]
      }
    }
  },
  "cast": {
    "staff-chinese": {
      "cn": { "model": "fish-audio/s2.1-pro-free:free", "voice": "__provider_default__" },
      "en": { "model": "fish-audio/s2.1-pro-free:free", "voice": "__provider_default__" }
    },
    "staff-maths": {
      "cn": { "model": "fish-audio/s2.1-pro-free:free", "voice": "__provider_default__" },
      "en": { "model": "fish-audio/s2.1-pro-free:free", "voice": "__provider_default__" }
    }
  }
}
```

All audition clips are teacher-private and remain `review`, regardless of how plausible the source text looks. They cannot be approved into student/public playback. Enabling auditions requires `CAMPUS_TTS_MODE=FREE_ONLY`, `CAMPUS_TTS_AUDITION_ONLY=1`, USD limit `0`, plus positive request/character caps and the other required secrets/settings. The release owner has configured this project as described at the top; new installations must configure their own server settings.

### Verified cast and individual clip review

OpenRouter production generation in either mode remains unavailable until an operator has a supported, lawful, actually auditioned voice ID for each enabled character/locale. Replace the default marker in the model allowlist and cast. Every cast entry must include a review record, for example `reviewed: { "locale": "zh", "gender": "female", "date": "YYYY-MM-DD" }`, matching that character's existing canonical gender. The example is a schema, not a real reviewed voice. No working Fish voice IDs are invented or supplied here.

Required outcomes are **Cantonese for zh, Mandarin for cn, English for en**, with numbers read in that language and voice gender matching the role. Voice reuse is permitted. A Traditional Chinese script, model-family multilingual description, inline instruction or saved metadata does not establish these outcomes. Listen to the complete actual output. Twenty characters do not require or imply twenty unique voices.

Even with a reviewed cast, every newly generated clip in either mode starts in `review`. Only its generating teacher can listen. The teacher must explicitly approve that exact clip's language/dialect, gender, numbers and wording before it becomes `ready`; wrong output must remain private. Teacher review is a human attestation, not an automated dialect detector. Unverified/default auditions cannot be promoted by this endpoint: first establish a supported reviewed voice, then create a separate clip under that configuration.

### Separately authorised budgeted mode

BUDGETED is retained as an explicitly selected future option; it is not enabled by choosing FREE_ONLY and has no automatic fallback path. All three caps must be positive. Its ledger reserves `ceil(UTF-16 text length × configured USD per million characters)` micro-dollars, with `billing: "characters"` and a positive reviewed rate in each model config. Per-second/token rates are rejected. A model-price review older than 30 days disables either mode. These reservations are not provider invoices if prices or rules change; an owner-approved budget and provider-side limit are still required. BUDGETED uses the same reviewed cast and per-clip approval requirements as FREE_ONLY. A paid model does not establish correct dialect, gender, numbers or wording; successful synthesis remains teacher-private until that exact clip is reviewed.

For the researched `minimax/speech-2.8-turbo` and `minimax/speech-2.8-hd` models, the adapter supplies only the documented `provider.options.minimax.language_boost` values: `Chinese,Yue` for `zh`, `Chinese` for `cn`, and `English` for `en`. This is a documented request composition, not a live verification of pronunciation or passthrough behavior. The browser cannot override model, voice, language boost, provider options, input text, or upstream URL. Other server-allowlisted models receive only the standard MP3 speech fields.

## HTTP contract

All endpoints are under `/api/campus`. Teacher routes require both the existing allowed ChatGPT identity and an unexpired PIN unlock cookie. Existing loopback-only development identity support remains local-only. JSON writes reject foreign origins. Error shape is `{ "error": { "code": "...", "message": "..." } }`.

| Method and route | Behavior |
| --- | --- |
| `GET /tts/catalog` | Public, static fictional audition catalog. Twenty stable character IDs, canonical role gender and three language texts; no generation or secrets. |
| `GET /teacher/tts/status` | Mode, audition/publication state, review requirements, missing-configuration reasons, UTC budget day, caps and reserved usage. No provider call. |
| `GET /teacher/tts/quote?sourceKind=script&sourceId=sample-staff-chinese&locale=en` | Preview the exact server text, model/voice, reviewed date, character count, reservation estimate and existing matching clip. No reservation or provider call. Academic question sources return HTTP 410. |
| `POST /teacher/tts/generate` | The only route that can request synthesis of an allowed fixed script; one explicitly confirmed source at a time. Academic sources return HTTP 410. FREE_ONLY first verifies live zero pricing. |
| `POST /teacher/tts/:hash/approve` | Authorized operator confirms a production fixed-script clip's actual listening review. Cannot publish a default/private audition; academic clips return HTTP 410. No provider call. |
| `GET /teacher/tts/lookup?hash=...` | Poll an owned fixed-script clip or a ready public script. Another owner's unreviewed clip is unavailable; academic clips return HTTP 410. No provider call. |
| `GET /tts/lookup?sourceId=sample-staff-chinese&locale=en` | Guest/student lookup of a ready public script matching its current catalog revision. No provider call. |
| `GET /student/tts?questionId=...&revision=1&locale=zh&part=question` | Disabled academic endpoint: HTTP 410 `TTS_SUBJECT_AUDIO_DISABLED`. No provider call or playback, including older stored question clips. |
| `GET /audio/:hash` | Existing allowed fixed-script MP3 bytes only. Review clips are creator-only; ready public scripts allow guests. Academic clips return HTTP 410 even if previously stored. |

Explicit generation body:

```json
{
  "idempotencyKey": "a-new-random-uuid",
  "locale": "en",
  "source": { "kind": "script", "id": "sample-staff-chinese", "revision": 1 },
  "confirmNoPersonalData": true
}
```

Academic `question`, `option:<option-id>` and `takeaway` sources are rejected with HTTP 410 `TTS_SUBJECT_AUDIO_DISABLED`. Saved revisions, ownership and prior clip status do not re-enable speech. Historical question rows are retained for record integrity; no migration deletes them and no playback path serves them.

Generated result is `{clip,cached}`: HTTP `201` for a newly stored MP3, `200` for an existing stored clip, `202` for one already pending. A clip contains `hash`, `status`, `locale`, `characterId`, `source`, `scope`, `url`, `bytes`, `failureCode`, `reservedUsd`, `auditionOnly`, `reviewed`, `expectedGender` and `automaticRetry:false`. `url` is non-null for ready or review clips, but a review URL still requires its owning teacher. `cached` is true only for a ready hit. Failed/uncertain repeats return `409 TTS_REVIEW_REQUIRED` with no new provider attempt. Reusing an idempotency key for different content returns `409 TTS_IDEMPOTENCY_CONFLICT`.

Example review body, sent only after listening to the whole production clip:

```json
{
  "locale": "en",
  "gender": "female",
  "languageAndDialect": true,
  "numbers": true,
  "wording": true
}
```

`locale` and `gender` must match the clip and canonical role. Every confirmation must be true, its reviewed server cast must still match, and the MP3 must exist. A private audition returns `409 TTS_AUDITION_PRIVATE`. A successful approval records teacher identity and time without generating again. Public/student lookup never returns a `review` clip.

Generation is unavailable with `503 TTS_NOT_CONFIGURED` or `TTS_VOICE_NOT_CONFIGURED`. A failed live free-price check returns `503 TTS_FREE_PRICE_CHANGED` or `TTS_FREE_PRICE_UNVERIFIED` before synthesis, retains its zero-USD request reservation, and is never retried automatically. Exhausted caps return `429 TTS_BUDGET_LIMIT`. Teacher generation also has a 12-request/minute limit. Lookup or text availability is never presented as successful speech generation.

## Cache, concurrency and failure handling

The SHA-256 cache identity includes text, revision, source/part, locale, canonical character, model, voice, fixed provider-language options, audition mode and owner/class scope. A text, voice or revision change produces a new key; an earlier version stays immutable. Ready public authored scripts can share one clip; private auditions never share a cache entry across owners. Historical question cache records remain stored but are blocked from lookup and playback.

One D1 transaction inserts the immutable owner/idempotency mapping and conditionally inserts a unique clip while checking global request/character totals and, for BUDGETED, USD reservations. Only the worker whose insertion succeeds can call the provider. It works across concurrent workers without an in-memory Promise map. FREE_ONLY reservations are zero USD but remain bounded by requests and characters, including when earlier budgeted rows exist on that day.

The server posts only to `https://openrouter.ai/api/v1/audio/speech`, requests MP3, disallows redirects, and aborts after 45 seconds. It validates HTTP status, `audio/mpeg`, a basic MP3 signature, and a maximum 8 MiB bounded read before writing R2. This is format validation, not an audible-quality check.

There are **no automatic synthesis retries**, including after timeout, an unknown network outcome, malformed audio, storage failure or the next budget day. Reservations remain counted. A pending job older than two minutes is reported as unknown and still cannot reacquire permission. The owner must reconcile the provider's generation record and storage before any deliberate manual repair; no browser control deletes or refunds a reservation. Provider response bodies, raw errors, API keys and student records are not returned or logged by the adapter.

## Privacy and source boundaries

The generator does not accept free-form browser text or academic question sources. It resolves the repository's bounded fictional script catalog and never uses student names, numbers, reflections, answers, recovery codes or class join codes as a speech source. Internal operators review scripts before sending them to an external provider.

Unreviewed MP3 responses use `private, no-store`; direct hash guesses do not bypass authorization. Only ready public fixed scripts may use public HTTP caching. Academic quote, generation, lookup, approval and playback remain blocked in every mode, including BUDGETED and previously stored records. Adding fixed lines requires reviewed source entries and explicit generation; an academic edit never creates a voice-maintenance task.

## Validation and release boundary

Run with the project's supported Node runtime:

```sh
node tests/tts-backend.test.mjs
node tests/backend.test.mjs
node tests/worksheet-backend.test.mjs
node tests/campus-teacher.test.cjs
node node_modules/typescript/bin/tsc --noEmit
```

The latest TTS suite passed **180 checks** using real isolated local D1/R2 and a mocked provider; the main backend suite passed **166 assertions/API checks**. An unmocked global network request fails the TTS test. It covers teacher identity/PIN, default-off, source restrictions, cache/singleflight, atomic caps, retained unknown outcomes, revisions/privacy, exact free-model checks, changed/missing prices, private auditions, explicit per-clip review, and HTTP 410 denial of all academic speech paths including old stored audio. Real website generation separately produced English and Mandarin audition files, which the user accepted as usable. The requested Cantonese sample failed user listening because it was Mandarin. The former Speech Studio UI is removed from the teacher product at the user’s request; integration mocks confirm NPC greetings can speak while subsequent questions, options and feedback remain silent. These backend tests are separate from the 104-file fixed-corpus verification documented above. The lead agent also observed local recorded playback complete for Mandarin male/female and English male/female examples; full human listening and broad-device checks remain outstanding.

Migration `0003_peaceful_mister_fear.sql` adds the clip/request ledger; `0004_mighty_miek.sql` adds audition and review fields. Both must be applied in order before using these endpoints, after migrations 0000–0002. The release owner is handling local application and the next hosted deployment; the existence of migration files alone is not proof of either database's applied state. Keep the deployment record separate from source and component-test results.

Primary references for the retained OpenRouter backend: [speech contract](https://openrouter.ai/docs/guides/overview/multimodal/tts), [live speech-model catalog](https://openrouter.ai/api/v1/models?output_modalities=speech), [exact free model](https://openrouter.ai/fish-audio/s2.1-pro-free:free), [MiniMax speech parameters](https://platform.minimax.io/docs/api-reference/speech-t2a-http), and [MiniMax voice IDs](https://platform.minimax.io/docs/faq/system-voice-id). The [Fish S2 family article](https://fish.audio/zh-CN/blog/fish-audio-s2-fine-grained-ai-voice-control-at-the-word-level/) describes multilingual capabilities but is not a verified voice/dialect contract for this exact free endpoint. Dated comparisons are in [OPENROUTER-TTS-RESEARCH.md](OPENROUTER-TTS-RESEARCH.md). This optional backend remains FREE_ONLY with no paid fallback; the current game bundle is produced by the separate Edge authoring workflow above.
