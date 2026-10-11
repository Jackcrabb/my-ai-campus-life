# cases-uniform-3 student activity atlas

Status: released for registration after independent visual review and structural checks.

Generated with the built-in imagegen tool and transparent background enabled. The original PNG was copied unchanged. Pixel measurements do not edit or recolour the artwork.

References: `public/campus/assets/life/cases-uniform-3-v2.png` for canonical identities and clothing, and `design/campus-life-review-v1/05-walk-proportion-v3.png` for approved natural body proportions.

Contract: 4 rows × 4 columns; rows `voice:read`, `privacy:check`, `culture:read`, `access:check`; columns enter, main A, main B, exit. Top-level `uniform: 3`. One measured standing height per identity; do not resize each pose independently.

## Exact prompt

Use case: identity-preserve. Production full-body transparent ACTIVITY sprite atlas for a fine pixel-anime Hong Kong school game. EXACTLY FOUR ROWS by FOUR COLUMNS, 16 full-body figures. Request 1536x2048 portrait sheet. Image1 is the authoritative four canonical pupil identities and outfit3: keep each row's exact face, hairstyle, skin, build, backpack and clothes. Image2 is the authoritative natural teen body proportion reference ONLY: ignore its labels and layout. Do not enlarge heads or make chibi. Natural approximately6.5-head teen anatomy, same headsize/body scale within each row.
All pupils face 3/4 RIGHT, feet planted in identical standing positions across their row. Every cell must fit the entire head-to-shoes with generous transparent gutters; at least20px free space from sheet edges and between rows, no overlapping people or props. True RGBA transparency, no background, NO shadows/glow/ground/grid/captions/watermarks. No readable words on papers. Fine crisp pixel-anime shading matching references.
OUTFIT3: girls blue-and-white fine gingham check short-sleeve collared knee-length school dress with matching check belt, white socks WHITE shoes; boy navy blazer over white collaredshirt and simple darktie, gray full-length trousers darkbelt blackshoes. Keep navy backpacks.
ROW1 same short-bob girl (voice): welcome-speech cue-card rehearsal. COL1 enter lift small cream cuecard from waist; COL2 mainA hold card at chest with both hands and look down; COL3 mainB keep left hand supporting card while right index traces next line, eyes follow, tiny speaking mouth; COL4 exit lower card beside waist and face forward.
ROW2 same tousled-short boy (privacy): clipboard consent checklist. COL1 lift clipboard and pencil; COL2 support clipboard in left hand and write using right hand; COL3 real hand change, pencil touches lower box and gaze shifts; COL4 lower clipboard and pencil safely, neutral gaze.
ROW3 same long-high-ponytail girl (culture): compare two language pages. COL1 raise two small cream pages; COL2 hold one page in each hand and read left page; COL3 tilt right page closer and turn gaze toward it, actual changed hand position; COL4 stack both pages together and lower them.
ROW4 same second long-ponytail girl with her distinct face/build (access): activity checklist. COL1 lift small notepad and pen; COL2 hold pad left hand, check box with right pen; COL3 point pen to another item and look down; COL4 lower pad to waist with relaxed hands.
Four chronological poses each row: enter, mainA, mainB, recovery/exit. No walking poses, no duplicated idle figures with floating props. Hands physically grip paper/pencil. Maintain the same visible canonical identity and natural body ratio across all16sprites. Preserve exact uniform3 from first image.


## Anatomy refinement prompt

Use case: identity-preserve. Edit this exact transparent 4row x4column 16figure student activity atlas. Fix ONLY the oversized head anatomy. Every skull/face/head silhouette is currently too big. Shrink each complete skull+face+fringe+closehair unit to approximately65% of its current linear size, maintaining its connection to the SAME neck. The desired hairtop-to-chin length is about16% of the final head-to-feet height, natural approximately6.2-head teenager, matching the approved natural anime proportion. This is a MATERIAL visible reduction of head width AND height together, NOT merely shrinking eyes. Preserve exactly each identity's face design, hair type, skin, emotion, gaze; redraw at smaller scale. Long ponytail can still drape to upper back naturally, with smaller skull volume. Do not stretch limbs or torso. Body, torso, legs, uniform, backpack, papers, props, four activity phases, row and column order, plantedfeet baseline all stay exactly as currently. Keep full feet and≥15px outer transparent margins; no clipping. Preserve true alpha and crisp fine anime/pixel shading; no glow, no shadow, no matte background. Do not add text. Every one of16heads mustbe materially smaller and consistent withinitsrow. Return same4x4atlas only.
Ensure allfourfiguresinbottomrow haveentirewhite shoesfullyinside canvaswithatleast15pxtransparentbottommargin. Move thatrowupslightly ifneeded; doNOTcrop orstretch.

Initial generated source: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-2c39cae1-5de0-4164-9fcb-ccc3f02d1138.png`. This first pass is not the release asset.
## Second anatomy correction

Independent review found the first correction still visually too squat, with heads approximately 19–21% of figure height. The approved anatomy guide is used separately from the identity/costume reference in this pass. This judgement is visual, not a biometric measurement.

Input: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-d9fa00be-3474-4a17-b658-bb1b5d146dab.png`

Exact prompt:

```text
Use case: identity-preserve, anatomy correction of transparent sprite atlas. Edit FIRST reference image only. SECOND reference is solely a natural 6-to-6.5-head teenage anatomy guide, NOT a source of clothes, layout, poses or identities.

The 16 students in first reference remain too squat/young-looking. Make the whole head unit (skull, face, fringe and close-fitting hair) 20% SMALLER in both width and height in EVERY figure. Preserve the person's recognizable face and hair pattern, expression, glasses if any, skin and gender. Do not only shrink facial features inside a large head. Head from hairtop to chin must be 15.5–17% of total figure height, like the anatomy reference. Preserve total headtop-to-feet HEIGHT and feet baseline by redistributing the released space into slightly longer natural torso and legs, especially below waist. Keep body width, hand size, uniforms, held props and backpack unchanged. Long ponytails should connect naturally to the smaller skull while draping behind the shoulder. Neither chibi nor tiny head: natural slim secondary-school teens.

Keep 4 rows by 4 columns exactly, with SAME identities, uniforms, chronological activity drawings, facing direction and planted shoe positions. For each identity, head size and total body height MUST be identical in all four columns. Columns are enter, main A, main B, exit lowering the same paper/clipboard. Every prop is retained across phases; paper/checklist remains in hands at exit. No new accessories, logos, text, grids, floor or shadow. Entire shoes must be visible, with at least 15 pixels transparent margin to canvas bottom, and clear gutters separating all 16 figures. Fine crisp anime pixel illustration, original palette/shading, genuine transparent RGBA. Return only the corrected 4x4 sprite atlas.
```

## Released asset and verification

- Source: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-91df965d-f159-4f67-b6c1-1b428172ef93.png`.
- Copy: `public/campus/assets/activities/cases-uniform-3.png`; SHA-256 `7f9b4da7e0fa89cd93659f09ff4d2164ee5180db6796b675e8c4f3c6470887dc`. Original pixels unchanged.
- Explicit crop metadata: `design/production-activities/cases-uniform-3.layout.json`; `uniform: 3`; actual size **1086 × 1448 RGBA**.
- Fixed standing heights, in row order: **336 / 356 / 346 / 342 px**. Source-pose height spread is **0.30% / 1.12% / 1.45% / 0.58%**; runtime must use the single identity height, never per-frame resizing.
- Confirmed 16 separated full-body components, complete feet, retained props and four activity phases. All four alpha corners are zero; the top and bottom outer eight pixels are fully transparent. The background has 64.24% exactly transparent pixels.
- Independent visual review judged the natural teen build consistent with the approved reference. Head ratios are visual judgements, not a validated anatomy metric.
- This is an asset/geometry review. Continuous in-game enter/loop/exit timing and foot-lock still require integration review; no claim of a classroom trial.
