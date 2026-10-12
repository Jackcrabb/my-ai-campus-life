# Case students anatomy correction v2

- Asset: `public/campus/images/life/cases-students-v2.png`.
- Measured layout: `cases-students-v2.layout.json`.
- Built-in imagegen anatomy correction, source copied unchanged from `/Users/jackho/.codex/generated_images/01a11b37-f27e-75e3-9f01-083b22e1092d/exec-3ca4af38-a546-4336-867f-a49332da74fa.png`.
- Original `cases-students.png` retained as the earlier version; v2 is the revised production candidate.
- Actual size1254×1254 RGBA,1,256,272bytes. Alpha0–255;68.25%exactly transparent. Sampled empty top/left/bottom gutters0–1.
- Twenty-four fullbody crops and anchors remeasured and validated. Identity standing heights: voice248px, privacy268px, culture264px, access253px. Same six-frame index scheme, all four canonical identities/outfits retained.
- Independent engine review found oversized heads in v1. A first anatomy pass was insufficient; the selected second pass clearly reduces the complete skull/hair/face unit relative to torso/legs. Visual hairtop-to-chin estimates are approximately44–48px, excluding hanging ponytail; these are approximate anatomical judgements, not automated guarantees.
- Fixed identity standingHeight must control scale. Do not scale each frame to the same crop height. Rendering and animated gait still require final game review.
- No programmatic image pixel modifications were performed.

## First anatomy prompt

Use case: precise-object-edit. ANATOMY CORRECTION ONLY.
Image1 is the current4rows×6columns student sprite atlas. Image2 is the approved natural fullbody anatomy. Image3 is accepted staff anatomy revision: use its proportional relationship of head to whole figure, but retain TEENAGER identities and original school uniforms of image1.
Correct ONLY body proportions of all24students. Their current heads are too large. Each full figure MUST be about6heads tall, hairtop-to-chin occupying16–18% of standing hairtop-to-shoes height, NEVER above19%. Reduce each entire head including skull, hair mass, face, ears by about28–32% relative to body. Long ponytail hanging below the head is not part of skull height and should remain long. Do NOT simply shrink entire person. Retain existing overall figureheight and samefootbaseline, using recoveredheadspace to lengthen torso and upper/lowerlegs naturally. Knees correctly placed, shoulders relaxed, arms proportional, modest ordinary school shoes. Natural graceful TEENAGE figures, not chibi or squat children. Girls' skirts remain knee-length and modest.
Keep all24 exact identities, hairstyles, skin tones, clothes, backpacks, faces, clean warm ear palette, right-facing angles and pose sequence. Row1Ching blackbob navy pinafore over white shortsleeves. Row2Long tousledshorthair white shortsleeves/navytie/graylongtrousers. Row3Yau longponytail whiteblouse/navytie/navypleatedkneelengthskirt. Row4Chun longponytail greenwhitePEpolo/navytracktrousers.
Same6poses perrow: idle; walking contactA; compact bentkneepassingA; opposite contactB; compact passingB; gentle talkgesture. Preserve actual walking limbs and opposite arm phases, no drift-only staticframes. Head/face size INVARIANT across all6poses peridentity.
Same squarecanvas and4rows6columns with safe transparent gutters, no touchingrows, full heads/hands/shoesinside. Fine detailed original pixel-anime rendering and clearfaces, no3D. GENUINE TRANSPARENT RGBA background no glow, floor, shadow, matte, grid, words or label. Anatomy correction only, no new outfits.

## Selected stronger correction prompt

HEAD SIZE CORRECTION on all24 figures. The heads in this input are STILL TOO LARGE. Make a clear visible further change: SHRINK EACH ENTIRE HEAD (hair crown+skull+face+ears together) to75% of its current width AND75% current height, relative to unchanged body. Do this to all six figures in EACH of fourrows. Do not just make facialfeatures smaller inside the samehairhalo; entireheadincludinghairmustbe smaller.
The final head unit hairtop-to-chin should be42–45pixels high for a figure270pixels tall, around one-sixth of bodyheight. Current heads about55–60px are too big. Teenager 16–18-year-old natural anatomy, not chibi child. Small natural heads with long slender teenage torso/legs. Keep total figureheight and feetbaseline roughlysame by extending neck/upper-torso naturally into recoveredspace; do not make an unnaturallylong neck, distributeheight into torso/legs. For long ponytails only headscalpskullunit reduces; hangingponytail remains naturallylong.
Keep identitiesrecognizable, exact sameface/haircolor/outfits/backpacks/poses. No hairstylechanges. Same4rows6columns, fullbodysafeinvisiblegutters. Row1girlshortbob/navypinafore, row2boyshort/whitegray, row3girlpony/whitenavyskirt, row4girlpony/greenPE/navypants. Sixposesidle/contactA/passingA/contactB/passingB/talk. Keep actuallegsteps, no fullbodyrescaling.
This is specifically a noticeable25%headreduction, not an illustrationredraw. Preservefinepixelstyle, cleanpeachears, transparentRGBAbackground, no words/grid/floor/shadow/glow.

