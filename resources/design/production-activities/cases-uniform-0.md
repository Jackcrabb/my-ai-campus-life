# cases-uniform-0 student activity atlas

Status: the four-row attempts below are archived, unreleased drafts. The completed uniform 0 assets are the reviewed two-row pairs in `cases-uniform-0-a.md` and `cases-uniform-0-b.md`; those separate records are authoritative for runtime registration.


## Bounded uniform-0 recovery, 2026-10-11

Status remains pending visual review; this recovery does not register a runtime sheet.

The released uniform-3 activity sheet was used as the sole edit target, with only clothing and shoes changed to uniform 0. First result had cropped bottom shoes and was rejected. A second framing-only edit restores the soles and transparent margin. It still needs independent side-by-side anatomy review and measured crop registration; do not infer release from this source file.

- Input: `public/campus/images/activities/cases-uniform-3.png`.
- First result (not selected): `/Users/jackho/.codex/generated_images/01a1277c-4383-73f0-ad36-f324f13f70f0/exec-56bcb43e-9cbf-4a84-85ac-036684b14d43.png`.
- Framing result: `/Users/jackho/.codex/generated_images/01a1277c-4383-73f0-ad36-f324f13f70f0/exec-b4377138-780f-43cc-8298-fe6f87739f06.png`.
- Unmodified workspace draft: `resources/design/production-activities/drafts/cases-uniform-0-v3.png`.
- Built-in imagegen only, genuine transparent-background request; no raster processing.

Clothing-only prompt:

```text
Use case: identity-preserve. Edit the attached approved transparent activity sprite atlas; change ONLY school uniforms and footwear, preserving all sixteen figures' exact anatomy, head size, face, hairstyle, skin, hands, poses, prop positions, backpacks, feet positions, layout, and natural teen height-to-head proportions. Do not enlarge heads, shorten bodies, thicken legs, or add accessories. Four rows by four columns remain exactly. Rows 1, 3, 4 girls: replace blue gingham dress with WHITE short-sleeved collared button-front school shirt-dress, knee length, narrow RED belt; retain white socks, change shoes from white to BLACK plain school shoes, preserving shoe shape/size. Row 2 boy: remove navy blazer and tie; WHITE short-sleeved open-collar school shirt tucked into WHITE full-length trousers with narrow dark belt and BLACK school shoes; preserve his body silhouette and arm/pencil/clipboard positions. Every row retains the same exact enter, main A, main B and exit drawings with supported props. The boy keeps clipboard and pencil in exit pose. All clothes use restrained fine pixel-anime fabric shading matching the source quality. Preserve genuine transparent RGBA, no opaque background, no colored halos, no shadows, no captions or grid. Full hair and footwear visible with transparent gutters. Output the corrected 4x4 atlas only, same aspect ratio and framing as source.
```

Framing-only prompt:

```text
Use case: precise-object-edit. Repair ONLY the framing of this transparent 4-by-4 activity atlas. The bottom row's black shoes currently touch/crop at the bottom boundary. Keep every person's face, uniform, anatomy, head-to-body ratio, action, prop, pose and drawing unchanged. Preserve all sixteen complete figures. Fit the WHOLE 4-row grid uniformly into the canvas with at least 24 pixels of completely transparent space below all bottom-row soles, 18 above the top hair and 18 at left/right. Achieve this through a slight uniform reduction of the entire grid with preserved aspect ratio, never squashing individual bodies or reducing only legs. Complete the missing bottom shoe edges naturally. Output portrait 4x4 RGBA atlas, crisp detailed pixel-anime art, genuine transparent background, no shadows, no text/grid, no colored fringes.
```


Generated with the built-in imagegen tool and transparent background enabled. The original PNG will be copied unchanged. Pixel measurements do not edit or recolour the artwork.

References: `public/campus/images/life/cases-uniform-0-v2.png` for canonical identities and clothing, and `resources/design/campus-life-review-v1/05-walk-proportion-v3.png` for approved natural body proportions.

Contract: 4 rows × 4 columns; rows `voice:read`, `privacy:check`, `culture:read`, `access:check`; columns enter, main A, main B, exit. Top-level `uniform: 0`. One measured standing height per identity; do not resize each pose independently.

## Exact prompt

Use case: identity-preserve. Production full-body transparent ACTIVITY sprite atlas for a fine pixel-anime Hong Kong school game. EXACTLY FOUR ROWS by FOUR COLUMNS, 16 full-body figures. Request 1536x2048 portrait sheet. Image1 is the authoritative four canonical pupil identities and outfit0: keep each row's exact face, hairstyle, skin, build, backpack and clothes. Image2 is the authoritative natural teen body proportion reference ONLY: ignore its labels and layout. Do not enlarge heads or make chibi. Natural approximately6.5-head teen anatomy, same headsize/body scale within each row.
All pupils face 3/4 RIGHT, feet planted in identical standing positions across their row. Every cell must fit the entire head-to-shoes with generous transparent gutters; at least20px free space from sheet edges and between rows, no overlapping people or props. True RGBA transparency, no background, NO shadows/glow/ground/grid/captions/watermarks. No readable words on papers. Fine crisp pixel-anime shading matching references.
OUTFIT0: girls white short-sleeve collared knee-length shirt-dress red belt, white socks black shoes; boy white open-collar short-sleeve shirt, white full-length trousers darkbelt blackshoes. Keep navy backpacks.
ROW1 same short-bob girl (voice): welcome-speech cue-card rehearsal. COL1 enter lift small cream cuecard from waist; COL2 mainA hold card at chest with both hands and look down; COL3 mainB keep left hand supporting card while right index traces next line, eyes follow, tiny speaking mouth; COL4 exit lower card beside waist and face forward.
ROW2 same tousled-short boy (privacy): clipboard consent checklist. COL1 lift clipboard and pencil; COL2 support clipboard in left hand and write using right hand; COL3 real hand change, pencil touches lower box and gaze shifts; COL4 lower clipboard and pencil safely, neutral gaze.
ROW3 same long-high-ponytail girl (culture): compare two language pages. COL1 raise two small cream pages; COL2 hold one page in each hand and read left page; COL3 tilt right page closer and turn gaze toward it, actual changed hand position; COL4 stack both pages together and lower them.
ROW4 same second long-ponytail girl with her distinct face/build (access): activity checklist. COL1 lift small notepad and pen; COL2 hold pad left hand, check box with right pen; COL3 point pen to another item and look down; COL4 lower pad to waist with relaxed hands.
Four chronological poses each row: enter, mainA, mainB, recovery/exit. No walking poses, no duplicated idle figures with floating props. Hands physically grip paper/pencil. Maintain the same visible canonical identity and natural body ratio across all16sprites. Preserve exact uniform0 from first image.


## Anatomy refinement prompt

Use case: identity-preserve. Edit this exact transparent 4row x4column 16figure student activity atlas. Fix ONLY the oversized head anatomy. Every skull/face/head silhouette is currently too big. Shrink each complete skull+face+fringe+closehair unit to approximately65% of its current linear size, maintaining its connection to the SAME neck. The desired hairtop-to-chin length is about16% of the final head-to-feet height, natural approximately6.2-head teenager, matching the approved natural anime proportion. This is a MATERIAL visible reduction of head width AND height together, NOT merely shrinking eyes. Preserve exactly each identity's face design, hair type, skin, emotion, gaze; redraw at smaller scale. Long ponytail can still drape to upper back naturally, with smaller skull volume. Do not stretch limbs or torso. Body, torso, legs, uniform, backpack, papers, props, four activity phases, row and column order, plantedfeet baseline all stay exactly as currently. Keep full feet and≥15px outer transparent margins; no clipping. Preserve true alpha and crisp fine anime/pixel shading; no glow, no shadow, no matte background. Do not add text. Every one of16heads mustbe materially smaller and consistent withinitsrow. Return same4x4atlas only.

Initial generated source: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-213d96a0-27c9-4d85-a230-4a4a519bb145.png`. This first pass is not the release asset.
# Second anatomy correction

Independent review found the first correction still visually too squat, with heads approximately 19–21% of figure height. The approved anatomy guide is used separately from the identity/costume reference in this pass. This judgement is visual, not a biometric measurement.

Input: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-cb94a050-3f37-4151-8403-bc338e06ea7b.png`

Exact prompt:

```text
Use case: identity-preserve, anatomy correction of transparent sprite atlas. Edit FIRST reference image only. SECOND reference is solely a natural 6-to-6.5-head teenage anatomy guide, NOT a source of clothes, layout, poses or identities.

The 16 students in first reference remain too squat/young-looking. Make the whole head unit (skull, face, fringe and close-fitting hair) 20% SMALLER in both width and height in EVERY figure. Preserve the person's recognizable face and hair pattern, expression, glasses if any, skin and gender. Do not only shrink facial features inside a large head. Head from hairtop to chin must be 15.5–17% of total figure height, like the anatomy reference. Preserve total headtop-to-feet HEIGHT and feet baseline by redistributing the released space into slightly longer natural torso and legs, especially below waist. Keep body width, hand size, uniforms, held props and backpack unchanged. Long ponytails should connect naturally to the smaller skull while draping behind the shoulder. Neither chibi nor tiny head: natural slim secondary-school teens.

Keep 4 rows by 4 columns exactly, with SAME identities, uniforms, chronological activity drawings, facing direction and planted shoe positions. For each identity, head size and total body height MUST be identical in all four columns. Columns are enter, main A, main B, exit lowering the same paper/clipboard. Every prop is retained across phases; paper/checklist remains in hands at exit. No new accessories, logos, text, grids, floor or shadow. Entire shoes must be visible, with at least 15 pixels transparent margin to canvas bottom, and clear gutters separating all 16 figures. Fine crisp anime pixel illustration, original palette/shading, genuine transparent RGBA. Return only the corrected 4x4 sprite atlas.
```
