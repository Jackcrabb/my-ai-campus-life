# 我的 AI 校園生活 · Asset provenance

This index records the original artwork, production metadata and audio sources used by **My AI Campus Life**. It is not a claim of deployment, completed visual QA, school endorsement or learner effectiveness. Current frontend assets live under `public/campus/`; the old static prototype is no longer the application architecture.

## Approved references and production records

The user first selected **Version 1: Crafted Pixel RPG**, recorded in the [art-direction decision record](resources/design/art-options/ART-DIRECTION-REVIEW.md). The subsequent campus-life review approved ordinary new-student onboarding, the teacher workflow, natural character proportions and the later pixel dialogue/audio interface. These are design references, not runnable interfaces or functional test results:

- [Campus-life review](resources/design/campus-life-review-v1/REVIEW.md), [student onboarding](resources/design/campus-life-review-v1/02-student-onboarding.md) and [teacher-workspace proposal](resources/design/campus-life-review-v1/03-teacher-workspace.md).
- [Sixteen-character staff roster](resources/design/campus-life-review-v1/04-npc-roster.md).
- [Approved natural walking proportions, revision 3](resources/design/campus-life-review-v1/05-walk-proportion-v3.md).
- [Pixel dialogue and audio controls](resources/design/campus-life-review-v1/06-pixel-dialogue-audio-proposal.md).

Production art was generated with the built-in imagegen tool. Original generated PNGs and exact prompts/source paths are retained in the linked records. User-provided game screenshots informed composition and interaction; they are not embedded as runtime assets. No third-party game sprites or official school photographs were downloaded for the game. Pixel art and CSS controls are separate: interface text and controls are rendered by the game rather than baked into the scene.

## Player wardrobe

Eight source atlases each contain two hairstyles and five poses per hairstyle: idle plus four alternating walking phases. Skin-region masks support three selectable skin tones. Two character categories × four outfits × two hairstyles × three skin tones produce **48 appearance combinations**, not 48 independently generated atlases. Clothes, hair and skin do not affect learning access or scoring.

| Runtime file under `public/campus/images/life/` | Exact generation and measured-frame record |
|---|---|
| `student-boy-white.png` | [White-shirt boy](resources/design/production-life/student-boy-white.md) |
| `student-boy-grey.png` | [Grey-trouser boy](resources/design/production-life/student-boy-grey.md) |
| `student-boy-striped.png` | [Striped-shirt boy](resources/design/production-life/student-boy-striped.md) |
| `student-boy-blazer.png` | [Blazer boy](resources/design/production-life/student-boy-blazer.md) |
| `student-girl-white.png` | [White-dress girl](resources/design/production-life/student-girl-white.md) |
| `student-girl-striped.png` | [Striped-dress girl](resources/design/production-life/student-girl-striped.md) |
| `student-girl-grey.png` | [Grey-dress girl](resources/design/production-life/student-girl-grey.md) |
| `student-girl-gingham.png` | [Gingham-dress girl](resources/design/production-life/student-girl-gingham.md) |

The current wardrobe uses fictional style names. Earlier school-specific sheets are historical iterations, documented in the [boy wardrobe record](resources/design/production-boy-wardrobe.md), [girl wardrobe record](resources/design/production-girl-wardrobe.md), and [teaching guide, section 13](DESIGN-AND-TEACHING-GUIDE.md#13-人物與服裝來源--character-and-wardrobe-provenance). Those records do not imply that the current eight outfits are official uniforms. The former Pooi To cheongsam is not a current selectable outfit. No crests or school badges are used.

## Staff, classmates and animation

The shared [character registry](public/campus/game/characters.js) identifies each character, dialogue portrait and runtime atlas. The engine uses measured bounds, consistent standing height and foot anchors, not independent frame-height scaling. Walk cycles distinguish alternating contacts and passing poses; explicit movement and conversation states decide when they appear.

| Production family | Identities | Original and anatomy-revision records |
|---|---|---|
| `staff-academic-a` | Chinese, English, mathematics, science/chemistry | [Original](resources/design/production-life/staff-academic-a.md), [anatomy revision](resources/design/production-life/staff-academic-a-v2.md) |
| `staff-academic-b` | Geography, computing, history, visual art | [Original](resources/design/production-life/staff-academic-b.md), [anatomy revision](resources/design/production-life/staff-academic-b-v2.md) |
| `staff-community` | Music, library, rooftop ecology, PE | [Original](resources/design/production-life/staff-community.md), [anatomy revision](resources/design/production-life/staff-community-v2.md) |
| `staff-leadership` | Principal, vice-principal, office clerk, mentor | [Original](resources/design/production-life/staff-leadership.md), [anatomy revision](resources/design/production-life/staff-leadership-v2.md) |
| `cases-students` | Four students in the voice, privacy, culture and access scenarios | [Original](resources/design/production-life/cases-students.md), [anatomy revision](resources/design/production-life/cases-students-v2.md) |
| `staff-roster.png` | Dialogue portrait reference for the 16 staff identities | [Approved original roster](resources/design/campus-life-review-v1/04-npc-roster.md) |

Staff sheets contain four identities × six poses: neutral, four walk phases, and one conversation gesture. Each production record links a sibling `.layout.json` with source dimensions, frame bounds, anchors and standing heights. `-v2` files are separately generated anatomy revisions; originals remain for traceability. **The registry determines which revision is loaded; the presence of a PNG alone does not establish integration or visual approval.** Approximate head-to-body checks in the revision records are inspection estimates, not automatic guarantees of natural animation.

The four students and 16 staff are fictional. A varied cast supports representation, but appearance must not be treated as evidence of expertise or correctness. The current cases are authored school-life situations, not allegations about real people or schools.

## Environments and earlier assets

| Resource | Provenance |
|---|---|
| Nine `public/campus/images/backgrounds/campus-pair-*.png` sheets covering 18 locations | [Campus background production](resources/design/production-backgrounds.md), with exact prompts and scene mappings; runtime locations use [campus-art.js](public/campus/game/campus-art.js) |
| `public/campus/images/backgrounds/campus-gate.png` | [Campus gate record](public/campus/images/backgrounds/README-campus-gate.md) |
| `public/campus/images/backgrounds/detective-preparation.png` | [Original preparation-room record](public/campus/images/backgrounds/README-detective-preparation.md); filename preserves its prototype origin, not the player's current role |
| `public/campus/images/title-campus.png` | Original prologue illustration; exact archived prompt below |
| Earlier student and staff portrait sheets under `public/campus/images/portraits/` | [Dialogue portrait production](resources/design/production-portraits.md); these remain historical/fallback resources where referenced |
| Earlier community sprite sheet and metadata | [Original community artwork record](public/campus/images/characters/README.md) |

Only source files actually selected by the runtime should be described as active art. Older review and production files are kept for traceability and should not be confused with the current title or feature set.

## Audio sources and runtime limits

**Fixed Mandarin/English dialogue — 11 October 2026:** [campus-audio.js](public/campus/game/campus-audio.js) loads 104 generated MP3s under `public/campus/audio/voices/`, matched to the exact character, locale and text in [fixed-voices.js](public/campus/game/fixed-voices.js). The runtime-derived [corpus](data/fixed-dialogue-corpus.json) contains 52 Mandarin and 52 English lines for 20 fictional characters. It excludes academic questions, options, explanations, teacher-authored question content and personal student details. No cloned voice, actor reference or third-party performance recording was supplied.

The two mentor instructions were revised on **12 October 2026** to refer to each question’s displayed reward and the current star target, so teacher-created activities are not described using fixed starter totals. Only the matching fixed clips were regenerated; teacher questions remain silent.

The files were authored with `edge-tts==7.2.8` through the free Microsoft Edge online speech service: `zh-CN-YunxiNeural` (male, 23 clips), `zh-CN-XiaoxiaoNeural` (female, 29), `en-US-GuyNeural` (male, 23) and `en-US-JennyNeural` (female, 29), at rate −8% and pitch +0 Hz. The [generation cache](data/fixed-voice-generation-cache.json) preserves per-file source fingerprints, voice metadata, generation timestamps, duration and SHA-256. Total output is 6,905,376 bytes and 1,150.90 seconds. Provider locale/gender metadata, full decoding and integrity were verified; `audiblyReviewed: false` explicitly records that complete human listening review is not claimed. Free endpoint availability is not a permanent-service or output-licensing guarantee. See the [authoring and review record](docs/OPENROUTER-TTS-SERVICE.md) for exact boundaries. Gameplay loads bundled files without API keys or provider generation.

**Cantonese and device fallback:** Traditional Chinese retains the existing strict browser/OS Cantonese (`zh-HK` or `yue`) route. A changed or missing fixed recording may use a matching device voice. Cantonese and Mandarin never substitute for one another, and known character gender must match. An empty voice inventory waits up to three seconds; if no suitable voice is available, text remains visible. The browser API has no standard gender field, so the runtime uses known voice metadata/hints and does not promise twenty distinct voices. The user's rejected OpenRouter Cantonese trial is not included as Cantonese game speech. All academic questions/options/explanations remain text-only.

Within the selected language preference, local voices are preferred. A voice with `localService: false` may use the browser provider's remote service; speech must not be represented as always local or offline. Users retain text, replay, separate voice/music volumes and mute. Audio begins only after a user gesture. Music ducks for speech, visibility changes suspend playback, and disposal clears timers/nodes. The module's mocked tests verify control logic, not audible quality or device voice availability. Primary API references: [MDN SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), [SpeechSynthesisVoice](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice), and [Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices).

**Music:** the melody of *Greensleeves* is transcribed from the Mutopia traditional-melody edition, typeset by Steve Dunlop, marked public domain in its source. Sources: [score PDF](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves-let.pdf) and [LilyPond source](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves.ly). The project creates its own gentle Web Audio plucked-keyboard/harp-like timbre and accompaniment at runtime. No DSE recording, third-party performance recording or commercial audio file is reused. Public-domain status of a melody does not grant rights to unrelated recordings; none are included here.

## Archived prototype portrait prompt

Use case: illustration-story. Create an original production character portrait SPRITE SHEET for a polished Hong Kong secondary school AI detective visual novel. One square image, strict 2 by 2 equal grid, TRANSPARENT background, four fully separate waist-up portraits, each contained entirely inside its own quadrant with 8% padding, no overlap, no frames, no writing, no logos. Clean refined 2D hand-drawn anime visual novel style, sophisticated expressive faces, soft cel shading, fine controlled dark ink outlines, subtle muted colors, age-appropriate ordinary 15-year-old student proportions and modest school uniforms. All four original characters looking slightly toward viewer, thoughtful friendly expressions. TOP LEFT: East Asian student girl, short dark bob with teal hairclip, white collared blouse navy pinafore, holding notebook, concerned but determined. TOP RIGHT: East Asian boy, tousled dark hair round glasses, white shirt navy tie, holding small folder, thoughtful. BOTTOM LEFT: Hong Kong South Asian student girl, medium brown skin, long dark hair in a low ponytail, white short-sleeve blouse navy tie, holding book, curious. BOTTOM RIGHT: East Asian student boy with dark auburn short hair, green and cream sports polo, gently smiling. Portraits must fill their quadrants with heads at similar height and waist at lower edge, clean transparent cutout. Original characters not resembling existing anime characters. No accessories indicating disability, no text.

## Archived original campus illustration prompt (now prologue)

Built-in imagegen; no input image copied into the generated output.

Use case: illustration-story. Asset type: original wide 16:9 pixel-art title-screen background for an educational mystery adventure set in a Hong Kong secondary school. Refined detailed 32-bit era hand-pixelled art with deliberate crisp square pixels, gorgeous layered pixel shading and thoughtful limited palette. Main subject: a handsome cream plaster and dark teal school entrance with large arched fanlight, green double doors, red brick accents, covered corridor extending left, tropical trees with variegated olive and jade foliage, climbing vines, tiled path, potted plants, subtle modern Hong Kong skyline in distance. Soft late-afternoon sunshine, long lavender-blue shadows, a gently mysterious but welcoming atmosphere, school-life nostalgia. Composition landscape panoramic eye-level side view, architectural gate dominates center-right, open shaded walkway on the left gives quiet room for title overlay. Color palette cream ivory, deep blue ink, dark teal, jade, warm coral highlights and golden light. Detailed pixel texture and edge highlights, avoid blocky flat rectangles and vector appearance. NO people, NO text, NO signage letters, NO logos, NO watermarks. Entire scene fully drawn original with no copyrighted character designs. Output a single unified background, no panels or grid.
