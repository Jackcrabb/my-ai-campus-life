# 我的 AI 校園生活 · Asset provenance

This index records the original artwork, production metadata and audio sources used by **My AI Campus Life**. It is not a claim of deployment, completed visual QA, school endorsement or learner effectiveness. Current frontend assets live under `public/campus/`; the old static prototype is no longer the application architecture.

## Approved references and production records

The user first selected **Version 1: Crafted Pixel RPG**, recorded in the [art-direction decision record](design/art-options/ART-DIRECTION-REVIEW.md). The subsequent campus-life review approved ordinary new-student onboarding, the teacher workflow, natural character proportions and the later pixel dialogue/audio interface. These are design references, not runnable interfaces or functional test results:

- [Campus-life review](design/campus-life-review-v1/REVIEW.md), [student onboarding](design/campus-life-review-v1/02-student-onboarding.md) and [teacher-workspace proposal](design/campus-life-review-v1/03-teacher-workspace.md).
- [Sixteen-character staff roster](design/campus-life-review-v1/04-npc-roster.md).
- [Approved natural walking proportions, revision 3](design/campus-life-review-v1/05-walk-proportion-v3.md).
- [Pixel dialogue and audio controls](design/campus-life-review-v1/06-pixel-dialogue-audio-proposal.md).

Production art was generated with the built-in imagegen tool. Original generated PNGs and exact prompts/source paths are retained in the linked records. User-provided game screenshots informed composition and interaction; they are not embedded as runtime assets. No third-party game sprites or official school photographs were downloaded for the game. Pixel art and CSS controls are separate: interface text and controls are rendered by the game rather than baked into the scene.

## Player wardrobe

Eight source atlases each contain two hairstyles and five poses per hairstyle: idle plus four alternating walking phases. Skin-region masks support three selectable skin tones. Two character categories × four outfits × two hairstyles × three skin tones produce **48 appearance combinations**, not 48 independently generated atlases. Clothes, hair and skin do not affect learning access or scoring.

| Runtime file under `public/campus/assets/life/` | Exact generation and measured-frame record |
|---|---|
| `student-boy-white.png` | [White-shirt boy](design/production-life/student-boy-white.md) |
| `student-boy-grey.png` | [Grey-trouser boy](design/production-life/student-boy-grey.md) |
| `student-boy-striped.png` | [Striped-shirt boy](design/production-life/student-boy-striped.md) |
| `student-boy-blazer.png` | [Blazer boy](design/production-life/student-boy-blazer.md) |
| `student-girl-white.png` | [White-dress girl](design/production-life/student-girl-white.md) |
| `student-girl-striped.png` | [Striped-dress girl](design/production-life/student-girl-striped.md) |
| `student-girl-grey.png` | [Grey-dress girl](design/production-life/student-girl-grey.md) |
| `student-girl-gingham.png` | [Gingham-dress girl](design/production-life/student-girl-gingham.md) |

The current wardrobe uses fictional style names. Earlier school-specific sheets are historical iterations, documented in the [boy wardrobe record](design/production-boy-wardrobe.md), [girl wardrobe record](design/production-girl-wardrobe.md), and [teaching guide, section 13](DESIGN-AND-TEACHING-GUIDE.md#13-人物與服裝來源--character-and-wardrobe-provenance). Those records do not imply that the current eight outfits are official uniforms. The former Pooi To cheongsam is not a current selectable outfit. No crests or school badges are used.

## Staff, classmates and animation

The shared [character registry](public/campus/characters.js) identifies each character, dialogue portrait and runtime atlas. The engine uses measured bounds, consistent standing height and foot anchors, not independent frame-height scaling. Walk cycles distinguish alternating contacts and passing poses; explicit movement and conversation states decide when they appear.

| Production family | Identities | Original and anatomy-revision records |
|---|---|---|
| `staff-academic-a` | Chinese, English, mathematics, science/chemistry | [Original](design/production-life/staff-academic-a.md), [anatomy revision](design/production-life/staff-academic-a-v2.md) |
| `staff-academic-b` | Geography, computing, history, visual art | [Original](design/production-life/staff-academic-b.md), [anatomy revision](design/production-life/staff-academic-b-v2.md) |
| `staff-community` | Music, library, rooftop ecology, PE | [Original](design/production-life/staff-community.md), [anatomy revision](design/production-life/staff-community-v2.md) |
| `staff-leadership` | Principal, vice-principal, office clerk, mentor | [Original](design/production-life/staff-leadership.md), [anatomy revision](design/production-life/staff-leadership-v2.md) |
| `cases-students` | Four students in the voice, privacy, culture and access scenarios | [Original](design/production-life/cases-students.md), [anatomy revision](design/production-life/cases-students-v2.md) |
| `staff-roster.png` | Dialogue portrait reference for the 16 staff identities | [Approved original roster](design/campus-life-review-v1/04-npc-roster.md) |

Staff sheets contain four identities × six poses: neutral, four walk phases, and one conversation gesture. Each production record links a sibling `.layout.json` with source dimensions, frame bounds, anchors and standing heights. `-v2` files are separately generated anatomy revisions; originals remain for traceability. **The registry determines which revision is loaded; the presence of a PNG alone does not establish integration or visual approval.** Approximate head-to-body checks in the revision records are inspection estimates, not automatic guarantees of natural animation.

The four students and 16 staff are fictional. A varied cast supports representation, but appearance must not be treated as evidence of expertise or correctness. The current cases are authored school-life situations, not allegations about real people or schools.

## Environments and earlier assets

| Resource | Provenance |
|---|---|
| Nine `public/campus/assets/backgrounds/campus-pair-*.png` sheets covering 18 locations | [Campus background production](design/production-backgrounds.md), with exact prompts and scene mappings; runtime locations use [campus-art.js](public/campus/campus-art.js) |
| `public/campus/assets/backgrounds/campus-gate.png` | [Campus gate record](public/campus/assets/backgrounds/README-campus-gate.md) |
| `public/campus/assets/backgrounds/detective-preparation.png` | [Original preparation-room record](public/campus/assets/backgrounds/README-detective-preparation.md); filename preserves its prototype origin, not the player's current role |
| `public/campus/title-campus.png` | Original prologue illustration; exact archived prompt below |
| Earlier student and staff portrait sheets under `public/campus/assets/portraits/` | [Dialogue portrait production](design/production-portraits.md); these remain historical/fallback resources where referenced |
| Earlier community sprite sheet and metadata | [Original community artwork record](public/campus/assets/characters/README.md) |

Only source files actually selected by the runtime should be described as active art. Older review and production files are kept for traceability and should not be confused with the current title or feature set.

## Audio sources and runtime limits

**Dialogue:** [campus-audio.js](public/campus/campus-audio.js) uses the browser's Web Speech API to synthesize the displayed dialogue at playback time. There are no pre-recorded actor files or cloned voices. Traditional Chinese requires Cantonese (`zh-HK` or `yue`); Simplified Chinese requires Mandarin (`zh-CN` preferred, with `zh-SG`/`zh-TW` alternatives); English requires an English voice (`en-GB` preferred). Cantonese and Mandarin never substitute for one another. If the required language is absent, the module returns unavailable and the interface retains text. Regional fallback is permitted only within the required language. Voices are selected consistently from the device's available set; the browser API has no standard gender field, so a particular character gender or unique voice cannot be guaranteed.

Within the selected language preference, local voices are preferred. A voice with `localService: false` may use the browser provider's remote service; speech must not be represented as always local or offline. Users retain text, replay, separate voice/music volumes and mute. Audio begins only after a user gesture. Music ducks for speech, visibility changes suspend playback, and disposal clears timers/nodes. The module's mocked tests verify control logic, not audible quality or device voice availability. Primary API references: [MDN SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), [SpeechSynthesisVoice](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice), and [Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices).

**Music:** the melody of *Greensleeves* is transcribed from the Mutopia traditional-melody edition, typeset by Steve Dunlop, marked public domain in its source. Sources: [score PDF](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves-let.pdf) and [LilyPond source](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves.ly). The project creates its own gentle Web Audio plucked-keyboard/harp-like timbre and accompaniment at runtime. No DSE recording, third-party performance recording or commercial audio file is reused. Public-domain status of a melody does not grant rights to unrelated recordings; none are included here.

## Archived prototype portrait prompt

Use case: illustration-story. Create an original production character portrait SPRITE SHEET for a polished Hong Kong secondary school AI detective visual novel. One square image, strict 2 by 2 equal grid, TRANSPARENT background, four fully separate waist-up portraits, each contained entirely inside its own quadrant with 8% padding, no overlap, no frames, no writing, no logos. Clean refined 2D hand-drawn anime visual novel style, sophisticated expressive faces, soft cel shading, fine controlled dark ink outlines, subtle muted colors, age-appropriate ordinary 15-year-old student proportions and modest school uniforms. All four original characters looking slightly toward viewer, thoughtful friendly expressions. TOP LEFT: East Asian student girl, short dark bob with teal hairclip, white collared blouse navy pinafore, holding notebook, concerned but determined. TOP RIGHT: East Asian boy, tousled dark hair round glasses, white shirt navy tie, holding small folder, thoughtful. BOTTOM LEFT: Hong Kong South Asian student girl, medium brown skin, long dark hair in a low ponytail, white short-sleeve blouse navy tie, holding book, curious. BOTTOM RIGHT: East Asian student boy with dark auburn short hair, green and cream sports polo, gently smiling. Portraits must fill their quadrants with heads at similar height and waist at lower edge, clean transparent cutout. Original characters not resembling existing anime characters. No accessories indicating disability, no text.

## Archived original campus illustration prompt (now prologue)

Built-in imagegen; no input image copied into the generated output.

Use case: illustration-story. Asset type: original wide 16:9 pixel-art title-screen background for an educational mystery adventure set in a Hong Kong secondary school. Refined detailed 32-bit era hand-pixelled art with deliberate crisp square pixels, gorgeous layered pixel shading and thoughtful limited palette. Main subject: a handsome cream plaster and dark teal school entrance with large arched fanlight, green double doors, red brick accents, covered corridor extending left, tropical trees with variegated olive and jade foliage, climbing vines, tiled path, potted plants, subtle modern Hong Kong skyline in distance. Soft late-afternoon sunshine, long lavender-blue shadows, a gently mysterious but welcoming atmosphere, school-life nostalgia. Composition landscape panoramic eye-level side view, architectural gate dominates center-right, open shaded walkway on the left gives quiet room for title overlay. Color palette cream ivory, deep blue ink, dark teal, jade, warm coral highlights and golden light. Detailed pixel texture and edge highlights, avoid blocky flat rectangles and vector appearance. NO people, NO text, NO signage letters, NO logos, NO watermarks. Entire scene fully drawn original with no copyrighted character designs. Output a single unified background, no panels or grid.
