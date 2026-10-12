# Four case-student production atlas

- PNG: `public/campus/images/life/cases-students.png`.
- Metadata: `cases-students.layout.json`.
- Final source: `/Users/jackho/.codex/generated_images/01a11b37-f27e-75e3-9f01-083b22e1092d/exec-08589dca-772b-40f2-870e-e761db146ebd.png`, copied unchanged; built-in image generation with transparent background.
- Actual image: 1254 × 1254 RGBA, 1488509 bytes. Alpha range 0–255; 60.69% exactly transparent. Sampled top/left/bottom empty gutters alpha0–1.
- Layout: four rows × six columns. Columns: idle, contact A, passing A, contact B, passing B, gentle conversation. The final sheet is square to leave safe vertical gutters.
- Identity rows and measured standing heights: student-voice 260px; student-privacy 275px; student-culture 262px; student-access 249px.
- Source references: `public/campus/images/portraits/students.png` for canonical identity; `resources/design/campus-life-review-v1/05-walk-proportion-v3.png` for natural teenage body proportions; completed student-girl-white atlas for production style.
- Canonical outfits checked against portraits: Ching navy pinafore over white short sleeves; Long white short-sleeve shirt/navy tie/grey trousers; Yau white blouse/navy tie/navy skirt; Chun green-white polo/navy track trousers.
- All24 measured crop bounds and anchors are inside the PNG and each nominal cell. Every full foot and head is present. Tight rows in the initial output were corrected by generating a larger square composition; the cramped and shortened-body attempts are not production files.
- Global source coordinates are in JSON. Alpha >16 selects visible artwork; bounds include2px margins. Horizontal anchors track face position at one fixed per-identity offset. Use invariant standingHeight, never each frame height.
- Four drawn walk keys are available, not eight independently drawn poses. Passing keys can have similar silhouettes at small sizes; runtime must verify rhythm, distance-per-step and transition timing. The conversation frame is separate and should be selected only for deliberate interaction. Pixel-perfect pose/anatomy preservation across generative edits is not claimed.
- No programmatic image pixels were edited. Read-only pixel analysis and source-file copying produced the metadata.

## Initial four identities and motion sheet

Use case: illustration-story. Create a PRODUCTION transparent game sprite atlas of FOUR existing Hong Kong teenage classmates, with the approved natural elongated body proportions.
INPUT ROLES: image1 is canonical face/hair/clothing portrait reference ONLY, four rows each one identity. Image2 is STRICT FULL-BODY PROPORTION AUTHORITY: match its normal slender teenage torso and long legs, moderate small head, clean peach ears; absolutely no chibi or squat body. Image3 is a finished production sprite style and motion reference.
Layout: EXACTLY FOUR ROWS × SIX COLUMNS =24 completely separate FULL BODY characters. Prefer3072×2048 PNG (otherwise same3:2 sheet ratio). Each row is SAME person with invariant face, head size, overall body dimensions and foot baseline. Six equal columns: 1 quiet standing idle; 2 walking left-foot contact forward; 3 passing position with one foot supporting and the other bending under body; 4 opposite right-foot contact with OPPOSITE arm swing and correct leg layering; 5 opposite passing position, opposite support leg and opposite arm swing; 6 standing with one gentle conversational hand gesture and slightly open mouth. All walk poses move toward viewer's RIGHT, three-quarter side facing, modest ordinary walking stride, never running. Distinct stance phases, not duplicate idle drifting sideways. Shoe baseline equal in each row, no jumping/bouncing heads.
ROW1 identity Ching from portrait row1: teenage GIRL with short BLACK BOB, light warm skin, navy sleeveless SQUARE-NECK pinafore over WHITE SHORT-SLEEVE collared blouse, navy pleated knee-length skirt, white socks and black school shoes. Navy pinafore, NOT grey. No tie.
ROW2 identity Long from portrait row2: teenage BOY with tousled BLACK SHORT HAIR, light warm skin, WHITE SHORT-SLEEVE collared shirt with NAVY TIE, straight medium-GREY LONG TROUSERS, black belt, black school shoes. No book in the walking hands.
ROW3 identity Yau from portrait row3: teenage GIRL with long BLACK SINGLE PONYTAIL, light warm skin, WHITE SHORT-SLEEVE collared blouse with NAVY TIE tucked into NAVY PLEATED KNEE-LENGTH SKIRT, white socks, black school shoes. No blue stripes. Navy backpack.
ROW4 identity Chun from portrait row4: teenage GIRL with BLACK SINGLE PONYTAIL, light warm skin, GREEN-and-WHITE short-sleeve PE POLO with NAVY COLLAR (green sleeves and white torso center matching portrait), NAVY LONG TRACK TROUSERS with subtle white side piping, white sneakers. Sporty ordinary school student, same natural body ratio.
All heads and feet fully visible within cells, generous clear margins. Keep canon portrait identities/sex/hair exactly; do not invent boy Chun or change skirt identities. Same fine detailed original pixel-anime brushwork across all24, refined tiny pixel clusters, clear faces, subtle cloth fold highlights, no3D. Wardrobes without logos or text.
FULLY TRANSPARENT RGBA background including every gutter, no backdrop/matte, no shadows, no floor lines, no glow. NO labels, NO names, NO grid, NO UI. Each complete fullbody sprite is independently crop-safe.

## Passing-step correction

Precise motion correction to this ONE existing4-row×6-column transparent atlas. Preserve four character identities, clothing, natural long-body proportions, exact face/head sizes, fine detailed pixel-anime style and transparency.
Change only the WALKING PHASES in columns3,4,5 of EVERY ROW. Column1 idle and column6 gentle conversation stay unchanged.
Column2 is left-foot contact. Make column3 a TRUE compact passing step: weight-bearing right leg almost vertical under the pelvis; left knee bends, left heel lifts behind the standing ankle. Feet close together in x, not spread widely; one foot supports body. Column4 opposite right-foot contact: keep normal contact stride but visible near arm swings forward and far arm backwards, opposite tocolumn2, and leg overlap reversed. Column5 is a TRUE opposite passing step: weight-bearing left leg vertical under pelvis, right knee bends and heel lifts, opposite arm/leg layer order tocolumn3. Columns3/5 must be compact narrow silhouettes with bent lifted foot, NOT another contact stride.
Apply faithfully to ALL FOUR rows, especially boy row2 and tracksuit girl row4 that previously had only wide strides. Do not change trouser lengths/skirts/skin/earshade/face/hairstyle or backpacks. Keep each head at exact unchanged height within its row; never enlarge head or shorten legs. Correct anatomically opposite arm swing. Tiny natural motions, no running, no jumping, no handtalkgesture inwalkingframes.
Keep completeheads/feet within PNG, same24figures only, stable individual row baseline. TransparentRGBA background, no matte/floor/shadows/glow/text/grid.

## Arm-swing correction

Precise tiny arm-swing repair on this exact4-row×6-column character sprite sheet. Keep ALL faces, head sizes, bodies, lower bodies, leg poses, feet, clothing, backpacks, source positions and transparencies unchanged. Only change listed arms/hands so walk alternates visibly.
- ROW1 COLUMN5: near arm swings gently FORWARD (bent slightly with hand right of waist), opposite its column3 near arm backward.
- ROW2 COLUMN4: near arm swings FORWARD right of waist, opposite its column2 near arm backward; far arm back.
- ROW3 COLUMN4: near arm swings FORWARD right of waist, opposite column2; far arm back.
- ROW3 COLUMN5: near arm swings BACK naturally behind body, hand left of hip, opposite its column3 forward arm. Far arm a little forward.
- ROW4 COLUMN4: near arm swings FORWARD right of waist, opposite column2; far arm back.
- ROW4 COLUMN5: near arm swings BACK, hand left of hip, opposite its column3 forward arm. Far arm a little forward.
Do NOT edit other cells. Do NOT alter legs or grounded feet. Natural ordinary walk hand position, not waving, no talk gestures on walkframes. All identities, clothing, body/head proportions, natural teen elongated legs, fine pixel-anime detail remain exact. Keep same4rows6columns fullbody layout; transparentRGBA background, no floor/shadow/text/grid.

## Rejected cramped-sheet registration attempt

Sprite atlas REGISTRATION and TRANSPARENT GUTTER correction ONLY.
Take this exact24-character4-row6-column atlas and keep every character's identity, fine detailed pixel-anime style, face, clothes, body/head ratio, walking limb pose and gentle talk pose unchanged. The current rows touch; fix only scale and positioning:
Uniformly scale EACH full character DOWN to87% of its current size (head AND body AND feet together, preserving aspect ratio). Do not change head relative to body. Keep six equal columns and FOUR EXACT EQUAL ROWS in1536x1024 image. Each cell is256px wide×256px high. Center each figure horizontally in its cell, with its feet at cell-local y238 and its full hair top at y15 or lower. Row foot baselines y238,494,750,1006. Leave at least14fullytransparent pixels between every character and each cell edge; no hair/feet can touch adjacent row. Fullbody height about218–224px. Keep all24complete bodies/feet. This is a technical sprite sheet, so exact separated cells matter.
Preserve the current poses in each row: idle, walking contactA, compact passingA, opposite contactB, compact passingB, talk. No invented moves, no enlarged heads, no shortened legs. Same small natural teenager head/bodyratio from input. Render only characters on FULLY TRANSPARENT RGBA, no background/matte/gradient/shadow/floor/text/grid/labels.
All head, limb, wardrobe details remain same; only uniform whole-figure reduction/re-registration within fixed equalcells.

## Final square-sheet registration

Reformat this existing sprite sheet onto a SQUARE, LARGER CANVAS with generous transparent gutters. Use1536×1536 transparentPNG, NOT the original1536×1024ratio. Six columns by four rows, each cell256wide×384high.
Image1 is existing24sprites; keep EXACT same bodies, all poses, headsizes and natural longleg proportion, clothing, finepixelstyle. DO NOT SHRINK BODIES OR ENLARGE HEADS. Image2 approvedbodyshape shows the proper natural slender teenage figure; do not makecute/chibi.
Reposition the complete24sprites unchanged on the larger square canvas: same4rows6columns. Eachspriteapprox250pixels tall, with hairtop aroundcelllocal60 and feetbaselinecelllocal315. Transparentspaceaboveandbelow each, minimum30pixels betweenrows. Feetbaselines315,699,1083,1467. Do NOT use fullrowheight for character. No cross-row overlap.
Row1navypinaforebobgirl. Row2whitecollaredshirt/navytie/graytrousersshorthairboy. Row3whitecollaredblouse/navytie/navypleatedskirtponygirl. Row4greenwhitePEpolonavypantsponygirl.
Eachrowcolumn1idle,2contactA,3narrowbentkneepassingA,4oppositecontactB,5narrowpassingB,6gentletalkgesture. Preserveexistingexactwalkingarmsandposes and sourcefigurehead/bodyratios. Do not redesignthem. Crucial purpose is MORE TRANSPARENT VERTICAL SPACE usingSQUARE canvas, not shrinkage.
No text, no grid, no shadows, no matte, no glow, no floor; genuine transparentRGBA everywhereexceptfigures. Finepixels and completefeet.


