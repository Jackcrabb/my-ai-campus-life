# AI校園·偵探行動 — Game art direction review

**Current title: AI Campus · Detective Mission.** The user selected **Version 1: Crafted Pixel RPG** on 2026-10-08. This selected direction is now integrated into the local v2 game using separately generated production player sprites, NPCs, dialogue portraits and campus backgrounds. The art-option board remains a static reference, not a playable version or animation atlas.

The numbered alternatives below follow the order of the three generated-image results shown for selection. **Art option Version 1** is the approved visual direction; **application v2** describes the expanded game implementation. Versions 2 and 3 below are unselected alternatives, not later product releases.

Generation method for these boards: built-in imagegen, three independent generations, with the three supplied screenshots used as style/composition references. No screenshot pixels are shipped as game assets. Production began after the user's explicit selection, satisfying the requested selection checkpoint. The exact historical prompts are retained below, including their earlier working-name references.

## Integrated production direction

The implemented game has detailed crafted-pixel characters, warm cream/teal campus scenery, visual-novel dialogue and game-stage menus. The current start screen uses a newly generated front-gate background, a centered wordmark, exactly three vertically arranged controls (New Game, Continue, Settings), and a language control. The character preparation room and question panels are inside the game screen. Question panels pair the task with the appropriate student or staff portrait; the game does not use native browser dialogs for these flows.

The latest user-directed UI finish is **Apple-inspired semi-transparent rounded glass**, implemented in `dist/ui-glass.css` for text boxes, dialogue, windows and controls while preserving the integrated pixel characters and scenery. Version 1 remains the approved **art** direction; its preview's menu surfaces are not a requirement for the final UI layer. The latest wardrobe groups boys’ shirts/long trousers with side-part or textured-crop hair, and girls’ shirt dresses with mushroom-bob or ponytail hair. Two matching outfits per category, two hairstyles and three skin tones give **24 visual combinations**. The two boys’ references are Queen’s College summer and HKCWCC winter; the two girls’ references are HKCWCC summer and St. Joan of Arc junior summer. The former Pooi To cheongsam is an archived iteration. The game fills the available viewport and uses WASD/all arrows, Space/Enter, or click-to-approach people and entrances; the separate bottom Move row is removed.

Production records:

- [Asset provenance index](../../ASSET-PROVENANCE.md)
- [Boys’ wardrobe production record](../production-boy-wardrobe.md)
- [Girls’ wardrobe production record](../production-girl-wardrobe.md)
- [School-community sprite record and earlier iterations](../../dist/assets/characters/README.md)
- [Dialogue portrait atlases](../production-portraits.md)
- [Nine background atlases covering 18 locations](../production-backgrounds.md)
- [Centered campus-gate title background](../../dist/assets/backgrounds/README-campus-gate.md)
- [Detective preparation room](../../dist/assets/backgrounds/README-detective-preparation.md)

## Version 1: Crafted Pixel RPG

Saved image: [version-1-crafted-pixel.png](version-1-crafted-pixel.png)

Original generated image: /Users/jackho/.codex/generated_images/01a11b35-a464-72b1-8c43-37ddeaccd3c1/exec-7b48e905-50a4-403f-bd24-de17cdcce65d.png

Final prompt:

```text
Use case: ui-mockup, game art direction.
Create a production-quality visual design preview of a Hong Kong secondary-school AI detective browser game, for students aged 12–15. This is one coherent art direction, not a comparison of alternatives. Output a landscape 1536 x 1024 art direction board. Use a refined warm cream, deep teal, muted gold visual system.
Input images: first reference shows desired side-scrolling school exploration framing; second shows desired visual novel dialogue composition; third shows the user's preferred charming detailed pixel-art students and environment. Use these as inspiration for composition, level of craft and age-appropriate school atmosphere; create all-original people and architecture. Do not copy characters, school logos or screenshots.
The user's complaint is coarse ugly low-resolution sprites with barely any face/hair/clothing detail. Solve that. Characters must have attractive, clear expressive eyes, carefully shaped short hair or SINGLE ponytail, recognizable uniforms, convincing hands/shoes, natural appealing teen proportions. No tiny square heads, crude block figures, blank faces or 3D render.
Composition for fair comparison across all three candidates: exactly two adjoining areas on the same cream board. Left 34% is an enlarged full-body pair of playable students, a short-haired East Asian boy in a white short-sleeve open-collar shirt and white trousers/black belt, and an East Asian girl with a SINGLE ponytail in a knee-length light-blue striped short-sleeve school dress, navy tie, white ankle socks and dark-brown shoes. Modest age-appropriate school clothing, no emblems. Both holding a notebook or backpack strap, natural gentle expressions, comfortably spaced, full feet visible. Their large size must let the user judge facial and clothing detail.
Right 66% is split into two widescreen game frames: upper frame side-on explorable Hong Kong school corridor, cream walls, green classroom doors, wide blue-gray windows, cork notice board with paper notices but no readable incidental text, terrazzo floors, a potted plant and warm afternoon sun. Show the SAME two students at gameplay scale, one standing and one mid-step, and a woman teacher in a green cardigan carrying a book. All on one floor line with spacious walking room. Lower frame is a closer visual-novel scene in the SAME corridor, the ponytail student's half-body portrait on the right, with dark teal translucent dialogue box and readable cream typography along bottom. Only minimal UI, no browser chrome, card dashboard, extensive menus or extra panels.
Exact UI text: small scene label "1F · 校園走廊"; dialogue speaker "阿晴"; dialogue line "AI 的建議，對每位同學都公平嗎？"; small action "繼續  →". Use Traditional Chinese. The eventual game retains Traditional Chinese, Simplified Chinese and English. No dates, extra slogans, mock statistics or lorem ipsum.
Make a cohesive, polished, clearly legible art presentation. Neither stretch nor warp imagery. This image should convincingly convey the actual desired game art, not a marketing poster.

Direction name: Crafted Pixel RPG.
Style: sophisticated dense hand-placed pixel art, recognizable fine pixel clusters and restrained 48-color ramps, carefully sculpted faces with visible iris highlights, several hair-tone clusters and uniform fabric fold shading. Character proportions about 4.5 heads tall: charming but not squat or babyish. The enlarged pair is a crisp nearest-neighbor enlargement of genuinely detailed sprites, comparable to a roughly 80-by-160-pixel character source, NOT a coarse 16-by-32 sprite. Gameplay and dialogue portrait both follow this polished pixel language; dialogue face still highly expressive and detailed. Background has carefully layered medium-fine pixel textures, crisp silhouette edges, no smoothing, no painterly blur or photographic rendering. Keep warm nostalgic handcrafted feeling. Do not write the direction name or numeric option labels on the image.
```

## Version 2: Luminous High-Definition Pixel

Saved image: [version-2-hd-pixel.png](version-2-hd-pixel.png)

Original generated image: /Users/jackho/.codex/generated_images/01a11b35-a464-72b1-8c43-37ddeaccd3c1/exec-24b03049-7d70-45a8-80c4-6aa6da5e5775.png

Final prompt:

```text
Use case: ui-mockup, game art direction.
Create a production-quality visual design preview of a Hong Kong secondary-school AI detective browser game, for students aged 12–15. This is one coherent art direction, not a comparison of alternatives. Output a landscape 1536 x 1024 art direction board. Use a refined warm cream, deep teal, muted gold visual system.
Input images: first reference shows desired side-scrolling school exploration framing; second shows desired visual novel dialogue composition; third shows the user's preferred charming detailed pixel-art students and environment. Use these as inspiration for composition, level of craft and age-appropriate school atmosphere; create all-original people and architecture. Do not copy characters, school logos or screenshots.
The user's complaint is coarse ugly low-resolution sprites with barely any face/hair/clothing detail. Solve that. Characters must have attractive, clear expressive eyes, carefully shaped short hair or SINGLE ponytail, recognizable uniforms, convincing hands/shoes, natural appealing teen proportions. No tiny square heads, crude block figures, blank faces or 3D render.
Composition for fair comparison across all three candidates: exactly two adjoining areas on the same cream board. Left 34% is an enlarged full-body pair of playable students, a short-haired East Asian boy in a white short-sleeve open-collar shirt and white trousers/black belt, and an East Asian girl with a SINGLE ponytail in a knee-length light-blue striped short-sleeve school dress, navy tie, white ankle socks and dark-brown shoes. Modest age-appropriate school clothing, no emblems. Both holding a notebook or backpack strap, natural gentle expressions, comfortably spaced, full feet visible. Their large size must let the user judge facial and clothing detail.
Right 66% is split into two widescreen game frames: upper frame side-on explorable Hong Kong school corridor, cream walls, green classroom doors, wide blue-gray windows, cork notice board with paper notices but no readable incidental text, terrazzo floors, a potted plant and warm afternoon sun. Show the SAME two students at gameplay scale, one standing and one mid-step, and a woman teacher in a green cardigan carrying a book. All on one floor line with spacious walking room. Lower frame is a closer visual-novel scene in the SAME corridor, the ponytail student's half-body portrait on the right, with dark teal translucent dialogue box and readable cream typography along bottom. Only minimal UI, no browser chrome, card dashboard, extensive menus or extra panels.
Exact UI text: small scene label "1F · 校園走廊"; dialogue speaker "阿晴"; dialogue line "AI 的建議，對每位同學都公平嗎？"; small action "繼續  →". Use Traditional Chinese. The eventual game retains Traditional Chinese, Simplified Chinese and English. No dates, extra slogans, mock statistics or lorem ipsum.
Make a cohesive, polished, clearly legible art presentation. Neither stretch nor warp imagery. This image should convincingly convey the actual desired game art, not a marketing poster.

Direction name: Luminous High-Definition Pixel.
Style: very high-density 2D pixel art with the elegance of a premium modern HD pixel adventure. Dramatically finer and more sophisticated than a conventional retro sprite: fine dark contour pixels, microclusters in hair, richly shaded fabric folds, clearly visible eyes/irises/eyelashes and natural hands. About 5.5 heads tall, appealing adolescent anime proportions. The enlarged characters should feel like about 140-by-280-pixel source artwork enlarged crisply, with tiny visible pixel steps, NOT coarse rectangular blocks. Fine sunlit environment textures, dimensional window frames, clear floor tiles, gentle atmospheric depth from layered warm and cool color values; entirely 2D side-on gameplay, no 3D perspective character model. Preserve crisp art; no dramatic bloom or blur. Large dialogue portrait is beautifully drawn high-resolution anime with subtle pixel edge treatment and detailed expressive face. This is the most refined pixel-based option with an especially rich school environment. Do not write direction name or numeric option labels on the image.
```

## Version 3: Clear Hand-Drawn School Adventure

Saved image: [version-3-hand-drawn.png](version-3-hand-drawn.png)

Original generated image: /Users/jackho/.codex/generated_images/01a11b35-a464-72b1-8c43-37ddeaccd3c1/exec-b3c700da-29ec-4240-8045-a94489abff95.png

Final prompt:

```text
Use case: ui-mockup, game art direction.
Create a production-quality visual design preview of a Hong Kong secondary-school AI detective browser game, for students aged 12–15. This is one coherent art direction, not a comparison of alternatives. Output a landscape 1536 x 1024 art direction board. Use a refined warm cream, deep teal, muted gold visual system.
Input images: first reference shows desired side-scrolling school exploration framing; second shows desired visual novel dialogue composition; third shows the user's preferred charming detailed pixel-art students and environment. Use these as inspiration for composition, level of craft and age-appropriate school atmosphere; create all-original people and architecture. Do not copy characters, school logos or screenshots.
The user's complaint is coarse ugly low-resolution sprites with barely any face/hair/clothing detail. Solve that. Characters must have attractive, clear expressive eyes, carefully shaped short hair or SINGLE ponytail, recognizable uniforms, convincing hands/shoes, natural appealing teen proportions. No tiny square heads, crude block figures, blank faces or 3D render.
Composition for fair comparison across all three candidates: exactly two adjoining areas on the same cream board. Left 34% is an enlarged full-body pair of playable students, a short-haired East Asian boy in a white short-sleeve open-collar shirt and white trousers/black belt, and an East Asian girl with a SINGLE ponytail in a knee-length light-blue striped short-sleeve school dress, navy tie, white ankle socks and dark-brown shoes. Modest age-appropriate school clothing, no emblems. Both holding a notebook or backpack strap, natural gentle expressions, comfortably spaced, full feet visible. Their large size must let the user judge facial and clothing detail.
Right 66% is split into two widescreen game frames: upper frame side-on explorable Hong Kong school corridor, cream walls, green classroom doors, wide blue-gray windows, cork notice board with paper notices but no readable incidental text, terrazzo floors, a potted plant and warm afternoon sun. Show the SAME two students at gameplay scale, one standing and one mid-step, and a woman teacher in a green cardigan carrying a book. All on one floor line with spacious walking room. Lower frame is a closer visual-novel scene in the SAME corridor, the ponytail student's half-body portrait on the right, with dark teal translucent dialogue box and readable cream typography along bottom. Only minimal UI, no browser chrome, card dashboard, extensive menus or extra panels.
Exact UI text: small scene label "1F · 校園走廊"; dialogue speaker "阿晴"; dialogue line "AI 的建議，對每位同學都公平嗎？"; small action "繼續  →". Use Traditional Chinese. The eventual game retains Traditional Chinese, Simplified Chinese and English. No dates, extra slogans, mock statistics or lorem ipsum.
Make a cohesive, polished, clearly legible art presentation. Neither stretch nor warp imagery. This image should convincingly convey the actual desired game art, not a marketing poster.

Direction name: Clear Hand-Drawn School Adventure.
Style: polished contemporary 2D anime adventure with clean fluid linework, soft cel-shaded color, delicate facial expressions and expertly painted school backgrounds. This is explicitly a non-pixel alternative to eliminate coarse pixel faces completely while keeping the same 2D side-scrolling gameplay and visual-novel dialogue. Fine ink contours, softly shaded layered short hair and single ponytail, clear bright eyes, thoughtful school-uniform seams/folds/buttons, believable hands and shoes. About 5.5 heads tall, approachable natural adolescent proportions. Characters remain beautiful and recognizable at both small gameplay size and enlarged portrait size. Warm sunlit cream-and-teal Hong Kong school corridor, tasteful painted textures, detailed window muntins and terrazzo. All art 2D hand-drawn, no 3D-render, no photographic textures, no cheap vector stock-illustration look and no square-pixel mosaic filter. Do not write direction name or numeric option labels on the image.
```

## Application v2 implementation checkpoint

The local integration now includes all five walkable floors and 18 locations; the four original ethics cases; 13 subject spaces with three questions each; an introduction after character selection; staff guidance; question panels with matching portraits; a journal, reflection and report; persistent one-time rewards; and the school-gate ending. Awards total 78 subject stars + 20 case stars + 5 transfer stars = **103**, with **100** required for the formal exit. Traditional Chinese, Simplified Chinese and English are retained. Character selection, questions, map and settings are operated within the game screen. New Game confirms replacement of an existing save while preserving language, text-size and appearance preferences.

The content, subject and progression automated suites pass. They cover data structure, localized fields, the inquiry pathway, reward arithmetic and non-duplication, save restoration, the 99/100 threshold, menu/panel transitions and new-game confirmation. Browser/device and visual checks must be read from the corresponding version's [QA record](../../QA.md); this art record does not assert that every visual check or learner evaluation has passed.

Release continuity: preserve the existing Site project identity `appgprj_6ac77ac745ec8191a228cc690b33b0c3` when updating. The [existing Site address](https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site) identifies the release target; its presence here is **not a claim that local v2 has been published**. Confirm the native deployment result and independent public access before reporting publication.

The core ethics lesson is planned for 20–30 minutes and the full campus for approximately 45–75 minutes; neither is a measured learner completion time. All in-game AI responses remain authored teaching simulations. The MEDD8934 real-tool live demonstration is a separate activity documented in the [teaching guide](../../DESIGN-AND-TEACHING-GUIDE.md).
