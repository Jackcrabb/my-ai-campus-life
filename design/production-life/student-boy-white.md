# Production asset — boy white summer uniform

Generated on 2026-10-09 using the built-in OpenAI ImageGen tool, following explicit approval of the v3 body-proportion and clean-ear review. This is a production artwork asset; no runtime code was edited in this task.

## Files

- PNG: `public/campus/assets/life/student-boy-white.png`
- Geometry: `design/production-life/student-boy-white.layout.json`
- Runtime atlas ID: `player-boy-0`
- Actual output: 1536 × 1024 RGBA PNG, 1,935,064 bytes.
- Alpha range 0–254; 67.1% of pixels have alpha exactly zero. PNG copied unchanged; no programmatic background removal, recolouring, stretching or pixel editing.
- Empty top/left/right gutters and the gap between rows have alpha 0–1 only (maximum 0.39% opacity). Some transparent pixels retain dark/brown RGB data; this is not an opaque backdrop. No background erasure was performed.

## Authoritative references

1. `design/campus-life-review-v1/05-walk-proportion-v3.png`: approved natural teenage body proportions, face, clean warm-peach ears, white summer outfit, navy backpack and walking style. Only the boy row applies.
2. `design/character-review/BOYS-REVIEW-v1.png`: only the approved extreme-short buzz-cut appearance. It does not replace the v3 body reference.

## Atlas contract

The sheet has two rows and five columns. Row 0 is tousled short hair; row 1 is the near-scalp buzz cut. Column order is idle, left-foot contact, passing A, right-foot contact, passing B. Both rows retain the white short-sleeve open-neck shirt, white full-length trousers, black belt and shoes, and navy backpack.

Use measured global frame rectangles and anchors, because generated spacing is not perfectly uniform. All ten figures and shoes are complete and separated. Source bounds were calculated read-only from alpha >16, with a two-pixel crop margin where available. The horizontal anchor follows the head centre consistently; the baseline is the lowest visible shoe pixel.

- Row 0: idle frame 0; walk frames [1,2,3,4]; invariant standingHeight 450 source pixels.
- Row 1: idle frame 5; walk frames [6,7,8,9]; invariant standingHeight 445 source pixels.
- Render facing right, and mirror only when changing direction.
- Use ONE scale per identity derived from standingHeight. Do not normalize each pose using its own frame.h: slight physical lowering in a passing pose must not enlarge the head.
- There are four separately drawn walking key poses per hairstyle, not eight independent drawings. Any repeated/held display sequence must not be described as an eight-drawing atlas.

## Inspection and correction

The first generation's fifth column repeated a contact-like stride. A targeted ImageGen edit replaced the fifth column in both rows with a compact passing pose. The final sheet was visually inspected: elongated v3-style body, two distinct hair silhouettes, clean warm ears, complete footwear, true alpha and compact passing frames. The two contact poses have opposing arm swings; passing poses maintain planted support feet. The two passing silhouettes are similar in side view; their subtle leg overlap and arm phase must still be assessed in the runtime animation at the selected speed. This document does not claim pixel-perfect equivalence to the review or completed runtime gait verification.

Read-only alpha inspection validated all frame rectangles inside the 1536 × 1024 canvas. Baselines vary by several source pixels and are explicitly registered by metadata; they are not corrected by raster editing.

## Provenance

- Initial generation: `exec-2b3d04f7-96bd-4b00-bbf9-91a9ac31ed8f`.
- Final targeted correction: `exec-4ec6492c-91d8-4a5d-8966-71979c0a5562`.
- Final original source: `/Users/jackho/.codex/generated_images/01a11b37-f27e-75e3-9f01-083b22e1092d/exec-4ec6492c-91d8-4a5d-8966-71979c0a5562.png`.

## Exact initial prompt

Use case: stylized-concept.
Asset type: PRODUCTION TRANSPARENT FULL-BODY WALKING SPRITE ATLAS for an original Hong Kong school game.
Create exactly TEN figures in an exact TWO ROWS × FIVE COLUMNS arrangement. Target canvas 1920×1280, each invisible cell384×640. If output size changes, preserve the equal5×2cell layout. Every character entirely within its own cell with generous transparent gaps, identical body scale, identical torso location, and planted shoe baseline at95%of cellheight. No clipping or overlapping cells.
REFERENCE1 is the USER-APPROVED v3 body-proportion and walking review board. Reproduce its BOY exactly: same fine-pixel face, natural elongated teenage body, torso/leg proportions, clean warm-peach ear colour, backpack, and clothing. Use ONLY its top boy row, not the girl or poster layout. Crucially do NOT shorten the body or enlarge the head. REFERENCE2 is ONLY the approved near-scalp BUZZ-CUT hairstyle appearance from its TOP ROW; ignore its outfits, body scale, labels and poster composition. All anatomy must come from REFERENCE1.
The SAME light-medium warm-skinned teenage boy identity appears in all TEN cells; only hairstyle differs between rows. ROW1: approved dark tousled short boy hair fromREFERENCE1. ROW2: dark EXTREMELY SHORT near-scalp BUZZ CUT as inREFERENCE2B1, visible stubble and uncovered ears, no fringe/quiff/bob/bun. All facing three-quarter RIGHT at exactly the same camera angle, not pure front.
OUTFIT EXACTLY SAME ALL10: WHITE SHORT-SLEEVE open-neck collared shirt, tucked into WHITE FULL-LENGTH STRAIGHT TROUSERS, plain BLACK BELT, BLACK LEATHER SHOES, dark NAVY BACKPACK worn correctly on BOTH shoulders. No tie, no dress, no shorts, no logo. Hands empty. White cloth opaque with pale grey-blue shading; warm peach ears with tiny soft tan innerfold, no red/purple/grey blotch.
Both rows have the SAME FIVE poses in the SAME COLUMN order:
COL1 IDLE: relaxed natural upright stance, feet together at ground, arms relaxed at sides (neither hand in pocket, so transition to walking is clean).
COL2 LEFT-FOOT CONTACT: anatomical LEFT leg forward with left heel contacting baseline, RIGHT leg behind with right heel lifted/toes contacting baseline. RIGHT arm forward, LEFT arm back.
COL3 FIRST PASSING: LEFT foot planted directly beneath hip bearing weight, RIGHT thigh/knee passing forward underneath pelvis, right shoe hovering only slightly above baseline; arms cross through near-neutral. Upright body, slight natural knee bend only.
COL4 RIGHT-FOOT CONTACT: anatomical RIGHT leg forward with right heel contacting baseline, LEFT leg behind with left heel lifted/toes contacting baseline. LEFT arm forward, RIGHT arm back. It is the OPPOSITE limb phase toCOL2; distinguish leg overlaps and arm swing, do not duplicateCOL2.
COL5 SECOND PASSING: RIGHT foot planted directly beneath hip bearing weight, LEFT knee passes forward underneath pelvis and left shoe clears ground only slightly; opposite toCOL3. Near-neutral arms.
All steps are modest everyday walking, not exaggerated wide march, jump or run. At least one shoe bears weight at baseline in every cell. Feet are not held far apart; same relaxed shoulderwidth-scale stride asapprovedREFERENCE1. Backpack size/straps fixed, slight plausible sway only.
Critical registration: HEAD SIZE, neck length, shoulders, torso length and limb lengths MUST NOT change with pose. Keep the same physical body scale even when knee bending lowers head slightly. NEVER enlarge a crouched pose to force its totalheight to matchidle. Head stays the samepixelwidth/height within eachrow; hairvariantchangesonlyhair. Keep complete feet and backpack visible. No shortened legs, no chibi, no giant-head children.
Style: approved fine crafted-pixel anime, tiny precise pixel clusters, crisp silhouettes, subtle fabric folds and clear face at native size. Genuine clean alpha transparency outside all figures, no background colour, no white/cream backdrop, no floor, no ground shadows, no glow/halo, no text, no labels, no gridlines, no watermark. Only ten complete original character sprites.

## Exact targeted correction prompt

Use case: precise-object-edit.
Edit the supplied transparent10figure atlas with ONE targeted correction: replace ONLY the last/rightmost column in BOTH rows (top-row tousled-hair boy and bottom-row buzz-cut boy) with the missing SECOND PASSING walking pose. There are5columns2rows. KEEP ALL8OTHERFIGURES COMPLETELY UNCHANGED: same pixels/style/scale, face, clean peach ears, headsize, clothes/backpacks, location and transparency. Do not regenerate the rest of the sheet.
CURRENT PROBLEM: rightmost figures repeat a wide contact stride. Desired rightmost pose is COMPACT PASSING: the near-to-camera RIGHT leg is the straight weight-bearing leg directly VERTICAL beneath the pelvis, its black shoe flat on the SAME ground baseline as otherframes. The far LEFT leg is bent at knee and passes forward closely UNDER the pelvis, with its shoe hovering slightly beside the planted ankle, not reaching far forward or backward. Clearly show two different legs: one planted straight under thebody, the other flexed with shoe just aboveground. Feet horizontal separation must be less than HALF SHOULDERWIDTH. NO widely separated legs. No duplicate contactstep, no longstride, no jumping/bothfeetoffground. This passing pose is the opposite support leg to column3. Keep torso upright and long natural v3 proportions, face/head at samepixelSIZE, knee bending lowers head onlytinyamount. Arms swing gently near neutral in opposite phase, not giant armwave.
TOP ROW LAST CELL preserves dark tousledhair; BOTTOM ROW LAST CELL preserves near-scalp buzzcut. Everything else within these2figures remains the same identity, light-medium warm skin, white short-sleeve collaredshirt, white full-lengthtrousers, blackbelt/shoes, navybackpack.
Preserve true transparent alpha outside figures. No background, no newshadow, no text, no grid, no glow. Keep fullcanvas1536x1024 and exact existing5×2layout; every shoe complete. ONLY change the2last-column walking leg/arm pose, not theothers.
