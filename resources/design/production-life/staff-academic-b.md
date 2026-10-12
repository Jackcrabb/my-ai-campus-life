# Academic staff atlas B

- Production file: `public/campus/images/life/staff-academic-b.png`
- Layout: `resources/design/production-life/staff-academic-b.layout.json`
- Built-in imagegen: one generation, then targeted gait and framing corrections. Selected output copied unchanged; no pixel manipulation with Python.
- Selected source: `/Users/jackho/.codex/generated_images/01a11b37-3623-7652-90a8-3813a11d2e1c/exec-27d96577-f5a0-4f51-83a4-4602352d7675.png`
- Earlier generated source: `exec-9cc1b5e1-f31e-43d5-b329-5662edd96414.png`; gait correction: `exec-c715fd1d-3e47-4095-8993-2b3d4d893adf.png`, both in the same generated-images directory.
- Visual inspection: 24 complete full-body sprites, agreed four identities, right-facing, neutral / contact / bent-knee passing / contact / bent-knee passing / talk sequence. No image text. Real RGBA alpha verified. Natural proportions remain stylized; runtime gait review remains necessary.
- Use explicit measured bounds and each identity's fixed standingHeight. Generated sheet gutters do not form a mathematically uniform grid.

## Generation prompt

```text
Use case: stylized-concept.
Asset type: game-ready transparent teacher sprite atlas. Generate exactly 24 full-body characters: FOUR ROWS and SIX COLUMNS. This is a production sprite sheet without text, no poster panels.
References: image 1 is the approved Hong Kong school teacher roster; use ONLY its SECOND ROW four identities as the models in order. Image 2 is the approved body-proportion and walking reference; match its NATURAL SMALL HEAD AND LONG LEGS strictly. Do not copy the bust portrait proportions into a full body.
CRITICAL ANATOMY: adults around seven heads tall. Head including hair should occupy approximately ONE SEVENTH of standing body height, not one fourth or one fifth. Slim natural adult torsos, long legs, normal hands and shoes. No chibi, no oversized anime heads, no compressed bodies. Every full sprite stays the SAME SIZE across its six poses. Refined fine pixel game art, crisp subtle pixel clusters and soft restrained shading, friendly faces.

Large portrait sprite sheet ideally 2048×2732. Transparent background with ZERO alpha outside characters. Uniform clear gutters and outer margins. All 24 figures complete from hair to shoes, no overlaps or clipping.
All face right in side / slight three-quarter view. Each row depicts the SAME character six times:

ROW1 Geography teacher: adult man with warm medium-brown skin, loose wavy short dark hair, beige overshirt over dark green polo, dark olive straight full-length trousers, dark brown flat shoes. Match portrait row2 col1.
ROW2 Information Technology teacher: adult East Asian woman, asymmetrical black bob, cobalt blue collared blouse, dark charcoal slim full-length trousers, dark navy practical shoes, small plain lanyard. Match portrait row2 col2.
ROW3 History teacher: adult East Asian man in late middle age, salt-and-pepper short hair and neat salt-and-pepper beard, brown corduroy jacket over cream shirt, taupe straight full-length trousers, brown shoes. Match portrait row2 col3.
ROW4 Visual Art teacher: adult woman with deep brown skin, curly black hair in a loose high bun, teal long-sleeved top, mustard yellow art apron with subtle paint dabs, charcoal full-length trousers, dark low shoes. Match portrait row2 col4. No handheld art props.

SIX COLUMNS, exact pose sequence, all grounded at the same row baseline:
1 relaxed neutral standing idle, arms down, feet planted.
2 LEFT foot forward contact, right foot back, opposite arms naturally swing.
3 PASSING A: right knee swings forward past the left planted leg, right heel lifted, left leg nearly vertical.
4 RIGHT foot forward contact, left foot back, opposite arm swing reversed from col2.
5 PASSING B: left knee swings forward past the right planted leg, left heel lifted, right leg nearly vertical.
6 standing calm conversation, one forearm bent, small open-palm explaining gesture.
The walk must be an actual four-frame alternating foot cycle with bent knees, not duplicate poses. Keep same camera view and consistent identity, wardrobe, head-to-toe scale in all six columns. No books, maps, notebooks, bags or other handheld props. No shadows, floor, backgrounds, text, labels, numbers, cell borders, grid, logos or watermark. TRUE transparent alpha, not a white background or checkerboard.
```

## Gait correction prompt

```text
Use case: precise-object-edit. Edit this production transparent sprite atlas. Preserve all four row identities, hair, faces, wardrobe, right-facing camera, six-column/four-row layout, fullbody frame positions, naturaladult proportions and true alpha background. Change ONLY the WALKING POSES in columns 3 and 5 (counting from left, 1-based). All other columns stay unchanged.
CRITICAL: Columns 3 and 5 MUST BE PASSING-STEP POSES, not wide-stride contact poses. In each of these 8 figures, bring the two legs CLOSE TOGETHER under the hips: one support leg almost straight vertical directly under the body with foot FLAT on the ground; the other swing leg BENT SHARPLY AT THE KNEE to approximately 60 degrees with its lower leg trailing, HEEL LIFTED several inches from ground, knee adjacent to or just ahead of the support knee. Feet must be close together horizontally, NOT spread in a V. The lifted shoe is visibly elevated. Column 3: left leg supporting, right leg bent/swinging. Column 5: right leg supporting, left leg bent/swinging. Opposite arms have a small natural swing. They are mid-step walking positions, not static stance, running, lunging, or tiptoeing. Keep head/torso in exactly their current location so body scale and baseline stay consistent with existing contact columns. Do not enlarge heads.
No text, no border, no checkerboard, no background, no ground shadow. Actual transparent alpha outside sprites.
```

## Framing correction prompt

```text
Use case: precise-object-edit. Repair ONLY framing on this 4×6 transparent sprite atlas: the rightmost column hands and bottom row shoes are cropped by the canvas. Recreate all 24 SAME teachers, SAME poses, SAME wardrobe, SAME natural proportions and colors, at 85% of their current size, centered in a roomy 4-row ×6-column regular layout, with at least 35 transparent pixels around every edge and generous gaps between every character. Extend and show all missing rightmost hands and bottommost shoes completely. CRITICAL: the FULL bodies including fingertips, hair and soles of shoes of ALL 24 sprites must be visible with transparent air around them. KEEP corrected bent-knee passing poses in columns 3 and 5; column1 standing, columns2/4 contact walking, column6 standing explaining gesture. Do not add new identities. No text, no panels, no grid, no floor or shadows. Preserve actual transparent alpha outside sprites. Tall canvas with plenty of room, preferably 1536×2048.
```

