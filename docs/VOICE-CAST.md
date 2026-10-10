# Historical Google voice-cast proposal (optional)

**Project:** 我的AI校園生活 / My AI Campus Life  
**Research checked:** 10 October 2026  
**Status:** Historical, optional research; **not the active deployment plan or a setup requirement**. The user selected [free web-generated MP3s](FREE-VOICE-TOOLS.md), with TTSFree primary and TTSMaker as a manual fallback. Google Cloud and self-hosted synthesis are paused. The role directions below remain useful creative references, but the Google IDs and settings do not apply to TTSFree. No paid API calls were made by this research task. No prerecorded MP3 dialogue is integrated into the game, and the current browser speech language/fluency defect is not fully fixed.

## Previous Google proposal / 先前 Google 方案

The earlier proposal was to use **Google Cloud Text-to-Speech, Chirp 3 HD**, to generate reviewed audio files before release. The following instructions apply only if that option is explicitly reactivated. Select one unique named voice for each of the 20 existing NPC identities, and explicitly select the speech language for every file. The official catalog lists 30 named voices in each of `yue-HK`, `cmn-CN`, and `en-GB`, providing enough distinct candidates for this cast. The same suffix is a useful casting convention across languages, but does not guarantee identical perceived identity or equally natural pronunciation; audition all three versions. [Official voice catalog](https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types)

**香港粵語目前屬 Preview。** 預先生成並人工聆聽合格的音檔，可令玩家播放同一個已審核版本，不再依賴裝置的瀏覽器聲線。這仍需要先確認帳戶可用聲線、生成成本及試音品質。Google's documentation marks Cantonese as Preview, and identifies MP3 as a supported batch output. Rate control is available across locales; its special pause-control feature excludes `yue-HK`, so begin with plain dialogue and natural punctuation. [Chirp 3 HD documentation](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd)

Do not let a missing Cantonese file fall back to Mandarin, or a missing Mandarin file fall back to Cantonese. Display subtitles and an honest audio-unavailable state instead. Keep the existing independent music and voice volume controls.

## Provider comparison

| Provider | Verified language/cast position | Historical assessment, not current selection |
|---|---|---|
| Google Chirp 3 HD | Explicit `yue-HK`, `cmn-CN`, `en-GB` catalog with enough independent named voices for 20 roles. Cantonese is Preview. | Former candidate for a 60-clip audition: 20 identities × 3 languages; currently paused. |
| Microsoft Azure Speech | Three native Hong Kong voices are listed: `zh-HK-HiuMaanNeural`, `zh-HK-WanLungNeural`, `zh-HK-HiuGaaiNeural`. Azure also lists `yue-CN` voices and some multilingual voices supporting `zh-HK`; three is therefore not the complete Cantonese-capable catalog. Twenty suitable independent Cantonese voices were not established in this review. | Useful small-cast alternative. Do not present pitch/rate variants of a few voices as 20 separate speakers. |
| ElevenLabs | The current model page lists Cantonese `yue` under **v4/v4 Turbo**. Its **v3** language list includes Mandarin but does not list Cantonese. Its API describes `language_code` as ISO 639-1 and says unsupported values are ignored; a hard `yue` override was not verified here. No account-specific voice IDs have been selected. | Consider v4 auditioning as an alternative only after the accepted Cantonese language parameter and 20 usable voice IDs are verified. Do not promise v3 Cantonese support. |

Azure evidence: [language and voice table](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts#text-to-speech-voices), [multilingual voice locale support and SSML roles](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice#multilingual-voices-with-the-lang-element). For example, the Andrew, Ava, Brian and Emma `en-US-*MultilingualNeural` voices explicitly include `zh-HK`. Roles and prosody alter delivery rather than establishing a new voice identity.

ElevenLabs evidence: [current models and their separate language lists](https://elevenlabs.io/docs/overview/models), [speech API language parameter](https://elevenlabs.io/docs/api-reference/text-to-speech/convert). Search snippets can combine different model sections; the v4 Cantonese list must not be attributed to v3.

## Cost and distribution

- **Google:** the published Chirp 3 HD rate is **US$30 per million characters**, after the listed first one million free characters. Eligibility, billing period and the account's remaining allowance must be checked before generation. Illustratively, 300,000 billable characters cost US$9 at that rate, before any allowance, tax, storage or network charge. Regenerations count again; ordinary playback of already-hosted files does not invoke TTS. [Official pricing](https://cloud.google.com/text-to-speech/pricing)
- **Azure:** the official page lists **500,000 free neural characters per month**. Paid-rate fields were not readable as dollar amounts in this research, so no specific paid price is asserted. [Official pricing](https://azure.microsoft.com/en-us/pricing/details/speech/)
- **ElevenLabs:** the current API page lists v3 at **US$0.08 per 1,000 characters** and v4 at the same standard rate, with a temporary v4 **US$0.022 per 1,000** promotion through 12 October. It lists Starter at **US$6/month**, with an introductory discount. Do not base a lasting project budget on the temporary offer. [Official API pricing](https://elevenlabs.io/pricing/api)

Google expressly describes using generated audio files in applications and media, subject to its terms. Its Preview terms provide limited commitments and say not to submit personal or regulated data to Pre-GA services. Only fictional, author-approved NPC scripts should be sent; real student names, recovery codes, grades and teacher credentials are unnecessary. [Audio use documentation](https://docs.cloud.google.com/text-to-speech/docs/basics), [Pre-GA terms, section 5](https://cloud.google.com/terms/service-terms)

Azure documents exporting audio for applications and products; confirm the project's subscription agreement before distribution. [Audio Content Creation export](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-audio-content-creation)

ElevenLabs states that paid-plan content can be used commercially and indefinitely under its terms; free-plan content has noncommercial and attribution restrictions. Its help page also excludes Beta Services from commercial/production use. Verify the selected model's release status and voice rights before production. [Official publishing/license guidance](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform)

## Stable 20-role casting / 角色配音表

The IDs and names below match `public/campus/characters.js`. **Age, manner and pacing are creative direction, not claims about a provider voice's real performer or acoustic characteristics.** Google suffixes are verified catalog candidates; the assignments remain provisional until listening tests. Each suffix is used once. Do not clone a real pupil or teacher. Student characters should receive a youthful, natural performance without exaggerated baby voices.

| Canonical ID | Character / role | Direction: perceived age, gender, personality | Initial pace | Candidate suffix |
|---|---|---|---|---|
| `staff-chinese` | 林念慈老師 / Ms Lam, Chinese | Woman, 35–45; composed, attentive; give phrases room to breathe | 0.96× | `Kore` |
| `staff-english` | 李英秀老師 / Ms Lee, English | Woman, 30–40; approachable, crisp phrasing; encourage without sing-song delivery | 0.96× | `Aoede` |
| `staff-maths` | 黃修端老師 / Mr Wong, Mathematics | Man, 35–45; precise, patient; short pause between calculation steps | 0.94× | `Charon` |
| `staff-chemistry` | 鄭幼羚老師 / Ms Cheng, Science | Woman, 30–40; curious and methodical; clear names and units | 0.96× | `Erinome` |
| `staff-geography` | 周向華老師 / Mr Chow, Geography | Man, 35–45; open and conversational; gently invite observation | 0.98× | `Achird` |
| `staff-computer` | 張有容老師 / Ms Cheung, ICT | Woman, 30–40; brisk but understandable; confident, never robotic | 0.98× | `Autonoe` |
| `staff-history` | 許允行老師 / Mr Hui, History | Man, 50–60; reflective, grounded; emphasize evidence rather than drama | 0.94× | `Algenib` |
| `staff-art` | 葉家寶老師 / Ms Yip, Visual Arts | Woman, 35–45; imaginative and warm; allow expressive curiosity | 0.98× | `Pulcherrima` |
| `staff-music` | 吳一心老師 / Mr Ng, Music | Man, 30–40; relaxed, lightly expressive; natural rhythm without singing | 0.98× | `Algieba` |
| `staff-library` | 梁念慈老師 / Ms Leung, Librarian | Woman, 55–65; calm and reassuring; audible, not whispered | 0.94× | `Gacrux` |
| `staff-rooftop` | 楊思賢老師 / Mr Yeung, Ecology | Man, 25–35; enthusiastic and observant; soften instructions | 1.00× | `Fenrir` |
| `staff-playground` | 陳向華老師 / Mr Chan, PE | Man, 30–40; energetic and supportive; clear, never shouting | 1.00× | `Orus` |
| `staff-principal` | 何修端校長 / Principal Ho | Man, 55–65; measured authority and warmth; welcome rather than announce | 0.94× | `Alnilam` |
| `staff-vice` | 周英秀副校長 / Vice principal | Woman, 45–55; practical, composed; firm but respectful | 0.96× | `Sulafat` |
| `staff-office` | 林有容書記 / Office secretary | Man, 35–45; efficient, friendly; articulate class and document instructions | 0.96× | `Schedar` |
| `staff-mentor` | 許幼羚老師 / New student mentor | Woman, 25–35; welcoming and encouraging; easy conversational tone | 0.98× | `Callirrhoe` |
| `voice` | 一心 / Yat-sum, student | Girl, 14–16; thoughtful, initially uncertain; retain dignity when discussing accents | 0.98× | `Zephyr` |
| `privacy` | 允行 / Wan-hang, student | Boy, 14–16; candid and curious; concern without panic | 1.00× | `Puck` |
| `culture` | 家寶 / Ka-po, student | Girl, 14–16; self-assured, reflective; proud of cultural voice | 0.98× | `Leda` |
| `access` | 思賢 / Sze-yin, student | Girl, 14–16; practical and friendly; no disability-related vocal stereotype | 0.98× | `Laomedeia` |

In this historical Google proposal only, `1.00×` means that provider's unadjusted pace. These values do not describe TTSFree's Voice Speed 100% or Speech Pitch 100% settings and must not be converted into them. They are starting values to audition, not different voice identities. For English learning dialogue, clarity and meaningful pauses take priority over speed. The character's gender remains stable across all three languages; accent must not be inferred from sprite skin colour.

For each selected suffix, use the catalog's full ID and explicit language:

| Game locale | Required spoken language | Example for the Chinese teacher |
|---|---|---|
| `zh` | Hong Kong Cantonese | language `yue-HK`; voice `yue-HK-Chirp3-HD-Kore` |
| `cn` | Mandarin | language `cmn-CN`; voice `cmn-CN-Chirp3-HD-Kore` |
| `en` | English, initially UK | language `en-GB`; voice `en-GB-Chirp3-HD-Kore` |

All 20 suffixes above appear in all three official locale sections. Recheck them using the provider's voice-list endpoint for the configured project before starting a production batch; do not synthesize with an unspecified/default voice. Voice identity cannot be guaranteed solely by identical suffixes across languages, so approve the three-language set as one character.

## Dialogue preparation and release checks

1. **Freeze a dialogue inventory.** Record character ID, stable line ID, locale, source-text hash and revision. Give each locale its own spoken script. Traditional Chinese display text is not automatically idiomatic spoken Cantonese: a fluent reviewer should adapt it while preserving teaching meaning. Keep displayed text accessible alongside speech.
2. **Audition 60 short clips.** One representative line per role per language. Include a question and a school/AI term. Review language accuracy, pronunciation, pace, tone, character distinctness and subtitle fidelity; replace an unsuitable candidate before generating the full set. This is a proposed human review, not a completed test.
3. **Generate fixed assets once.** Store separate files by locale, character and line. Record provider, model, full voice ID, settings, text hash, creation date and license basis in an audio manifest. Preserve reviewed masters; use browser-compatible compressed files for delivery. Root architecture work owns implementation.
4. **Validate the actual output.** Check that files decode, have nonzero duration and signal, contain the complete line, do not clip and play through to `ended`. A fluent Cantonese listener and a fluent Mandarin listener must distinguish the two versions; metadata or waveform checks alone are insufficient. Listen on real speakers/headphones in target browsers.
5. **Handle revisions honestly.** Teacher-edited questions or a changed line invalidate the old text hash. Until a matching approved clip exists, show text without playing an unrelated recording. Generic greetings avoid sending pupils' real names to a speech provider. No browser speech fallback should silently introduce the wrong language.
6. **Keep one voice active.** A new NPC line or locale change stops the previous file; background music ducks while speech plays. Replay, mute and volume remain user controlled. A missing asset or failed play operation leaves readable text and a clear audio state.

### Suggested language audition

These original samples deliberately differ in spoken language rather than merely changing script:

- **粵語:** 「你好，歡迎嚟到明澄書院。我哋先睇吓 AI 用咗邊啲資料，再一齊諗吓個建議公唔公平。」
- **普通话:** “你好，欢迎来到明澄书院。我们先看看 AI 使用了哪些资料，再一起想想这个建议是否公平。”
- **English:** “Welcome to Ming Ching College. Let's first look at the information the AI used, then decide whether its suggestion is fair.”

Names, numbers, English abbreviations, mathematical notation and Cantonese lexical items need a pronunciation checklist. A character's emotion should support understanding without suggesting that a confident voice makes an AI claim correct.

## Tool availability and remaining prerequisites

The enabled tool inventory was searched for speech/TTS/audio generation. **No dedicated text-to-speech generation connector is available in this session.** A Canva audio-upload capability is not a speech-generation service. No credentials were requested or inspected.

Only if the Google option is explicitly reactivated: confirm an authorized billing/project setup, establish a spending limit, recheck the catalog and conduct the 60-clip audition before a production batch. Do not paste secret API keys into this document, game files or chat. These Cloud prerequisites are **not required by the current free web workflow**. Its next steps are manual generation, listening review and later MP3 integration, as described in [FREE-VOICE-TOOLS.md](FREE-VOICE-TOOLS.md). Teacher-edited questions need a matching new recording; the latest written text remains authoritative. Provider documentation is not evidence of finished audio quality.
