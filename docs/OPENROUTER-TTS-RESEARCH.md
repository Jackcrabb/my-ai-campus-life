# OpenRouter TTS research for 我的 AI 校園生活

Verified: **11 October 2026, 02:40 HKT**. This is a research and integration proposal, not a claim that cloud narration is installed. Only public documentation and unauthenticated, read-only catalogue requests were used. No account, API key, credit purchase, paid generation, or listening test was used in this audit.

## Recommendation

OpenRouter can provide the proposed server-side speech generation without a Google Cloud project. Start with a small, explicit audition comparing **MiniMax Speech 2.8 Turbo** and **Eleven v4 Turbo**. Both have explicit provider documentation for Cantonese as a language distinct from Mandarin. MiniMax has a documented Cantonese selector and native Cantonese presets; Eleven v4 Turbo is cheaper at the currently advertised launch price. Naturalness, correct numerals, and the suitability of each character's voice remain listening checks.

Do not promise 20 unique, gender-matched Cantonese voices yet. The current game registry has **11 female and 9 male characters**. ElevenLabs' 21 shipped aliases contain only 7 female voices; MiniMax's dedicated Cantonese catalogue has 4 female and 2 male voices. A larger multilingual catalogue is a candidate pool, not proof that every voice sounds natural in Hong Kong Cantonese.

## 1. Verified API contract

The public discovery request `GET https://openrouter.ai/api/v1/models?output_modalities=speech` returned **32 models**. Read `architecture.output_modalities`, `supported_voices`, and `pricing`; model IDs must come from the live catalogue. The speech endpoint is `POST https://openrouter.ai/api/v1/audio/speech`, with `model`, `input`, and an explicit `voice`. Request `response_format: "mp3"`; the default is PCM, and successful output is raw bytes, not JSON. Check status, MIME type, nonzero size, and decoding before saving. Record `X-Generation-Id` when supplied. [OpenRouter TTS guide](https://openrouter.ai/docs/guides/overview/multimodal/tts), [live speech catalogue](https://openrouter.ai/api/v1/models?output_modalities=speech).

Provider settings belong under `provider.options[providerSlug]`. The general `instructions` field is documented for OpenAI/Gemini, so it must not be used as a presumed language instruction for MiniMax/ElevenLabs. Omit `speed` for the first audition: support varies, and unsupported nondefault values can fail. The regular `provider.only/order/ignore` routing preferences are not applied to speech requests. [OpenRouter TTS guide](https://openrouter.ai/docs/guides/overview/multimodal/tts).

## 2. Model coverage and current prices

All amounts below are **USD per 1,000,000 input characters**, not per million chat tokens. Rates were read from the public catalogue and checked against the model pages. These are a dated quotation, not a permanent price promise.

| Model ID | Cantonese | Mandarin / English | Current rate | Advertised ordinary rate | Selection note |
| --- | --- | --- | ---: | ---: | --- |
| `minimax/speech-2.8-turbo` | Explicit `Chinese,Yue` | Explicit `Chinese` / `English` | $60 | $60 | First native-Cantonese audition candidate |
| `minimax/speech-2.8-hd` | Explicit `Chinese,Yue` | Explicit `Chinese` / `English` | $100 | $100 | Compare only if Turbo's audition is insufficient |
| `elevenlabs/eleven-v4-turbo` | Explicit `yue` | Explicit `cmn` / `eng` | $20 | $40 | Lower-cost multilingual audition candidate |
| `elevenlabs/eleven-v4` | Explicit `yue` | Explicit `cmn` / `eng` | $40 | $80 | Quality comparison candidate |

MiniMax rates: [Speech 2.8 Turbo](https://openrouter.ai/minimax/speech-2.8-turbo), [Speech 2.8 HD](https://openrouter.ai/minimax/speech-2.8-hd). ElevenLabs' displayed rates are **50% off through 19 October 2026**: [v4 Turbo](https://openrouter.ai/elevenlabs/eleven-v4-turbo), [v4](https://openrouter.ai/elevenlabs/eleven-v4).

ElevenLabs explicitly lists Cantonese in the **v4 family**. Its v3 language list includes Mandarin but does not list Cantonese; v2's generic “Chinese” listing is insufficient evidence for Cantonese. Do not silently substitute those older models for a Cantonese request. [ElevenLabs model and language tables](https://elevenlabs.io/docs/overview/models).

MiniMax's current API names Cantonese separately as `language_boost: "Chinese,Yue"`, versus Mandarin `"Chinese"` and English `"English"`; its text field also documents Jyutping pronunciation overrides. These are upstream capabilities. The corresponding OpenRouter passthrough must be verified in the first authorized audition before being marked operational. [MiniMax speech API](https://platform.minimax.io/docs/api-reference/speech-t2a-http).

The public [MiniMax endpoint metadata](https://openrouter.ai/api/v1/models/minimax/speech-2.8-turbo/endpoints) confirms provider tag `minimax`. Combining that tag with the two documented contracts gives this **unexecuted audition request body**; it is an integration candidate, not evidence of successful audio output:

```json
{
  "model": "minimax/speech-2.8-turbo",
  "input": "你好，我哋一齊睇清楚資料，再作決定。",
  "voice": "Cantonese_ProfessionalHost (M)",
  "response_format": "mp3",
  "provider": {
    "options": {
      "minimax": { "language_boost": "Chinese,Yue" }
    }
  }
}
```

For ElevenLabs, upstream `language_code` documentation describes ISO 639-1, while the model language table uses `yue` and `cmn`. The exact accepted Cantonese enforcement value and its passage through OpenRouter have **not** been tested. Do not treat `language_code: "zh"` as proof of Cantonese or assume that an English-prefix voice forces English. [ElevenLabs speech API](https://elevenlabs.io/docs/api-reference/text-to-speech/convert), [dialogue API](https://elevenlabs.io/docs/api-reference/text-to-dialogue/convert).

### Is any speech model actually free?

**Yes.** Exactly one of the 32 discovered speech models had both input and output prices set to zero: **`fish-audio/s2.1-pro-free:free`**. Its official page confirms zero-charge speech generation, intended for tests, prototypes, and low-volume use without production latency or availability guarantees. The catalogue returns `supported_voices: null`; this audit has not established a 20-voice preset cast or explicit Cantonese coverage for it. [Fish Audio's free OpenRouter model](https://openrouter.ai/fish-audio/s2.1-pro-free:free).

OpenRouter's published free-tier guide states 20 requests/minute and 50 requests/day without a qualifying credit purchase, increasing to 1,000/day after a $10 credit purchase. Check the actual authorized account's `free_model_daily_requests` before a batch; account or endpoint exceptions can apply. A free API key does not make paid models free. A zero-cost-only configuration must pin the exact free model and prohibit paid fallback. No key was used to check an account or generate audio here. [Official free-tier guide](https://openrouter.ai/blog/tutorials/how-to-get-the-lowest-cost-llm-inference-on-openrouter/), [current limits reference](https://openrouter.ai/docs/api_reference/limits).

Fish's own documentation describes S2.1 Pro Free as sharing the paid model's quality and 83-language coverage, with automatic language detection and fair-use restrictions. The inspected overview does not separately identify Cantonese, so the number 83 must not be treated as confirmation of Cantonese support. [Fish capabilities](https://docs.fish.audio/overview/capabilities), [Fish model overview](https://docs.fish.audio/developer-guide/models-pricing/models-overview), [Fish model selection guide](https://docs.fish.audio/developer-guide/models-pricing/choosing-a-model).

Other speech models also appear in discovery. Their presence alone does not establish the three required languages, a suitable preset cast, or production availability. This report's recommended shortlist is deliberately narrower than the entire catalogue.

## 3. Voice inventory and the 20-character requirement

### ElevenLabs: 21 available aliases, insufficient female variety for this cast

An unauthenticated `GET https://api.elevenlabs.io/v1/voices` returned 21 entries matching the OpenRouter aliases by name. Their provider `labels.gender` values give the following inventory; gender was not inferred from names:

| Provider label | OpenRouter aliases |
| --- | --- |
| Female, 7 | `alice`, `bella`, `jessica`, `laura`, `lily`, `matilda`, `sarah` |
| Male, 13 | `adam`, `bill`, `brian`, `callum`, `charlie`, `chris`, `daniel`, `eric`, `george`, `harry`, `liam`, `roger`, `will` |
| Neutral, 1 | `river` |

Sources: [public ElevenLabs voice catalogue](https://api.elevenlabs.io/v1/voices), [voice metadata API](https://elevenlabs.io/docs/api-reference/voices/search), [OpenRouter speech catalogue](https://openrouter.ai/api/v1/models?output_modalities=speech). The returned voice labels identify English as their original language; the model's multilingual ability must still be auditioned with the intended Cantonese and Mandarin scripts.

**Maintenance concern:** ElevenLabs says its old Default voices expire on **31 December 2026**, with account-age restrictions already applying. OpenRouter currently lists those familiar aliases. Confirm its replacement/alias policy before committing a long-lived cast. Saving approved MP3s protects existing playback; future regeneration could still change timbre. [ElevenLabs Default voice transition](https://elevenlabs.io/docs/help-center/product/voices/my-voices/what-are-default-voices).

### MiniMax: explicit Cantonese presets, plus a larger candidate pool

The official system list contains six Cantonese presets:

| Label | Exact voice IDs |
| --- | --- |
| Female, 4 | `Cantonese_ProfessionalHost (F)`, `Cantonese_GentleLady`, `Cantonese_CuteGirl`, `Cantonese_KindWoman` |
| Male, 2 | `Cantonese_ProfessionalHost (M)`, `Cantonese_PlayfulMan` |

The same list has 45 English and 34 Mandarin entries. OpenRouter's MiniMax catalogue lists the 45 English IDs and its model descriptions explicitly allow arbitrary MiniMax voice IDs. This supports trying the Cantonese system IDs through OpenRouter; it does not mean that this audit has already generated them successfully. [MiniMax system voices](https://platform.minimax.io/docs/faq/system-voice-id), [OpenRouter MiniMax model](https://openrouter.ai/minimax/speech-2.8-turbo).

These **20 distinct English-listed candidates** have explicit female/male descriptions in the provider catalogue and fit the cast's 11/9 count. They are an audition shortlist, **not final assignments or 20 proven Cantonese voices**:

| Female candidates, 11 | Male candidates, 9 |
| --- | --- |
| `English_radiant_girl` | `English_magnetic_voiced_man` |
| `English_compelling_lady1` | `English_Trustworth_Man` |
| `English_captivating_female1` | `English_Gentle-voiced_man` |
| `English_Upbeat_Woman` | `English_Diligent_Man` |
| `English_CalmWoman` | `English_ReservedYoungMan` |
| `English_Graceful_Lady` | `English_ManWithDeepVoice` |
| `English_LovelyGirl` | `English_Deep-VoicedGentleman` |
| `English_Wiselady` | `English_DecentYoungMan` |
| `English_Soft-spokenGirl` | `English_PatientMan` |
| `English_SereneWoman` | — |
| `English_ConfidentWoman` | — |

Source: [MiniMax system voices](https://platform.minimax.io/docs/faq/system-voice-id). If cross-language auditions fail, retain approved native voices with honest reuse, or obtain an expanded, verified library. Do not manufacture “20 voices” by changing pitch on six presets. Store a stable mapping per `characterId + locale`; changing one locale need not change the other two.

## 4. Budget and key controls

The existing [60 authored audition lines](../data/voice-auditions.json) contain **5,071 Unicode code points** across 20 characters × 3 locales. At the quoted character rates, one pass is approximately **$0.10 v4 Turbo**, **$0.20 v4**, **$0.30 MiniMax Turbo**, or **$0.51 MiniMax HD**, before credit-purchase fees. These are local arithmetic estimates, not invoices: provider character accounting, revised scripts, retries, and additional auditions can change usage. Refresh the estimate after any script or price change.

OpenRouter Standard currently adds **5.5% to credit purchases**, with a **$0.80 minimum fee** documented in its official guidance. The fee is separate from model inference. A small generation estimate is not the checkout total or a guarantee of a particular minimum top-up. [OpenRouter pricing](https://openrouter.ai/pricing), [official fee explanation](https://openrouter.ai/blog/tutorials/any-coding-agent/).

Use a dedicated, ordinary inference key with a small USD spending limit. The key API supports `limit`, `limit_reset` (`daily`, `weekly`, `monthly`, or no reset), and expiry; resets are UTC. A non-resetting pilot cap is simpler than an automatically replenishing allowance. Key creation through the management API requires a separate management key; the game should never need that administrative credential. A key limit does not purchase credits. [API key limits](https://openrouter.ai/docs/api/api-reference/api-keys/create-keys), [management keys](https://openrouter.ai/docs/guides/overview/auth/management-api-keys).

## 5. Proposed website workflow and release checks

These are application recommendations, not claims about completed implementation:

1. Keep the API key in a server secret. Never embed it in JavaScript, GitHub, localStorage, screenshots, or a generated manifest. Reuse authorized teacher identity and server-side unlock checks for generation controls.
2. The server accepts an approved line ID, character, locale, and voice selection. It resolves authored text itself and rejects arbitrary public text. Do not send actual student names, classes, grades, answers, or reflections to the voice provider.
3. Show the exact script, selected voice, character count, estimated cost, and remaining application budget before the explicit Generate action. Begin with two voices × three languages; expand to 60 auditions after pronunciation and timbre are accepted.
4. Use complete sentences. Author Cantonese conversationally; do not rely on reading formal Mandarin wording with a Cantonese voice. Check English numerals, decimals, fractions, percentages, Chinese names, and mixed-language classroom terminology without changing visible learning content.
5. Cache approved audio by a hash of text + locale + character ID + model + voice + settings version. Store MP3s in the project's controlled asset storage and serve them without a provider call on every student replay. Deduplicate concurrent generation and enforce server request/character/budget limits.
6. Confirm a valid, decodable, nonempty MP3 before publishing its manifest entry. Preserve the last approved clip on generation failure. Stop previous playback on Next, Replay, locale change, or leaving dialogue; no overlapping utterances.
7. Teacher text edits invalidate matching audio. Display the latest written text as authoritative and expose manual regeneration/review. Never play an obsolete answer clip against a newly edited question.
8. Release only after listening to each character in each locale and reviewing stable gender/timbre, correct language, normal pace, and clear numbers. If a voice or language cannot be supplied, retain the visible text and an honest unavailable status rather than silently substituting the wrong voice.

No runtime files were changed by this research. Generation success, audible quality, provider-language passthrough, and a complete approved 20-character cast remain unverified until an explicitly authorized pilot is run.
