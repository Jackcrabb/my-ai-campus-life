# staff-academic-b-v2 anatomy revision

- Production sibling: `public/campus/assets/life/staff-academic-b-v2.png`; layout: `staff-academic-b-v2.layout.json`.
- Built-in imagegen. Three imagegen steps: anatomy, compact art head, framing. Intermediate sources exec-47ec66aa-a9eb-4654-99a5-38b719fc362b.png and exec-910ded4e-3cce-4533-a944-5bf272ce8282.png retained in generated-images. Art's initial v2 failed the head-ratio check; final selected image replaces only the unreleased draft v2, original v1 preserved.
- Selected source copied unchanged: `/Users/jackho/.codex/generated_images/01a11b37-3623-7652-90a8-3813a11d2e1c/exec-c630d848-f3c0-4d36-9200-b8f41c118bab.png`.
- All24 full bodies inspected, real alpha measured, explicit frames/fixed standing heights regenerated. No pixel editing by Python or canvas.
- Approximate idle hairtop-to-chin head heights and ratios recorded in metadata, excluding neck and hanging hair below chin. These are visual estimates with approximately3px uncertainty, not algorithmic anatomy guarantees. Parent should compare runtime visuals against approved05-v3 before final visual signoff.

## Anatomy correction — exact prompt

```text
Use case: precise-object-edit.
Target image1 is a 4-row ×6-column school teacher sprite atlas. Reference image2 is the approved NATURAL BODY PROPORTION; it is a style/anatomy reference, not a composition to copy.
Correct ONLY BODY PROPORTIONS of all24 adults, preserving exact four identities, clothes, right-facing view, fullbody six-pose sequence, transparency and regular arrangement.
MANDATORY QUANTITATIVE PROPORTION: each adult must be 6.2 to6.8 HEADS TALL. The head unit includes HAIR TOP to CHIN. Each head from hairtop to chin must occupy ONLY15–16.5% of standing hairtop-to-shoes body height and NEVER exceed18%. Current heads are too large: reduce every hair/head/face unit by approximately35–40% relative to body. This applies to every one of the24 poses including women with bobs and ponytail. Keep hairstyles/face identities but smaller natural adult head units. Ears/features scale together; don't leave huge hair halo.
Keep each character's existing full hairtop-to-shoes height and rowbaseline roughly unchanged. Use the space recovered from smaller head to LENGTHEN torso and especially upper/lower legs naturally: anatomically realistic long-legged adult proportions, NOT miniaturized children. Knees at natural adult position, normal shoulders, natural hands and footwear. Do not scale entire character down; REDUCE HEAD relative to whole body. No chibi/anime oversized heads. Natural tall elegant adults matching reference2.
Keep six poses: relaxed standing; left contact; bent-knee passingA with one raised heel; right contact; bent-knee passingB; calm open-hand conversation. Preserve coherent actual walking limbs. Same adult size in all6poses.
Four identities unchanged in row order: Geography wavy-darkhair man medium-brownskin beige overshirt green polo olive trousers; Computing EastAsian woman asymmetric blackbob cobalt blouse charcoaltrousers lanyard; History older saltpepperhaired bearded man brown corduroyjacket creamshirt taupetrousers; Art darkskinned woman blackcurlybun tealshirt mustardpaintapron darktrousers. Art teacher's hair bun must remain a natural compact bun, not oversized. Original fine pixel game rendering, warm face likeness, subtle shading.
All full hair, hands and shoes inside the canvas with clear transparent outer margins and gutters. No backgrounds, floor, shadow, text, labels, grid, border, checkerboard or watermark. Preserve genuine transparent alpha. This is an anatomy correction, not an outfit redesign.
The target is this academic B atlas. Especially reduce the geography, computing and art head units. Keep roomy outer margins and 24 completely uncropped bodies. Do not turn raised passing knees into wide contact strides. Reference3 shows the desired smaller-head correction already applied to another staff set; follow its anatomy refinement, not its identities.
```

## Compact art head correction — exact prompt

```text
Use case: precise-object-edit. This is a transparent 4-row ×6-column teacher sprite atlas. Preserve ALL24 bodies, outfits, walking poses, exact layout and alpha. Change ONLY the fourth/bottom row ART TEACHER's head/hair in all six poses. Her curly bun makes the hairtop-to-chin head unit too large (approximately61pixels out of314bodypixels). Reduce that entire head+hair unit to a COMPACT NATURAL adult head of approximately47–49pixels from hairtop to chin, or 15–16% of body height. Reduce face, skull, curls and bun together, preserving her deep brown skin, face identity and compact curly black bun. Do not leave a large hair halo. Keep total body height the same by placing a natural longer neck/upper torso below the smaller head, proportionately adjusting upperbody; same fullsize adult arms/legs and mustardapron tealshirt. No other changes to any row. Fullbody frames uncropped; keep a transparent margin at all four sheet edges. Genuine transparent alpha, no background,text,grid,border or shadow. Preserve bent-knee raised heel passing columns3and5.
```

## Framing repair — exact prompt

```text
Use case: precise-object-edit. Repair ONLY FRAMING on this transparent sprite atlas. Preserve the newly corrected small adult heads, all4identities, clothing, poses and adult anatomy EXACTLY. The rightmost hands and bottom shoes are clipped; regenerate the complete missing hands/shoes, and arrange ALL24 full bodies at80% of their current size in a roomy FOUR ROW × SIX COLUMN atlas with at least50transparent pixels on ALL outer edges. Never crop any sprite. All24 must be visible from hairtop to fingertips and soles. Equal comfortable gutters. Keep sixpose sequence: idle, contact, BENT KNEE raisedheel passing, contact, BENT KNEE passing, talk. Artteacher bottomrow keeps small compactbun and refined adult head. Keep all current head-to-body ratios unchanged. This is only zooming out the atlas layout to fit the full bodies, no anatomy change. No text,numbers,grid,border,shadow,floor orbackground. Actual transparent alpha.
```

