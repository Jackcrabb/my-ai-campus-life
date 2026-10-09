# Production girl wardrobe

Generated on 2026-10-08 with the built-in imagegen tool for the user-selected crafted-pixel visual direction. This revision implements the requested girl shirt-dress outfits with either a mushroom bob or a single ponytail. No CLI/API fallback was used.

## Delivered assets

| Runtime slot | Asset | Outfit | Generation |
|---|---|---|---|
| 2 | `dist/assets/characters/students-girl-hkcwcc.png` | White short-sleeve collared knee-length shirt-dress, plain red belt, white socks, black shoes; HKCWCC-inspired original interpretation, no emblem. | `exec-a160cb44-4f78-47ab-bccd-ea3b97775845` |
| 3 | `dist/assets/characters/students-girl-st-joan.png` | Light-blue thin-striped collared knee-length shirt-dress, navy necktie, white socks, dark-brown shoes; St. Joan of Arc-inspired original interpretation, no emblem. | `exec-515e87a9-0c40-4083-aff5-b2418b0e7a55` |

Both files are unchanged copies of the generated originals. The old student PNGs were retained rather than overwritten. School-inspired details identify design references only; the characters are original fictional students, and no real school badge or official photograph is included.

## Frame contract

Each 1536 × 1024 RGBA PNG contains six columns and three rows. Columns 0–2 are girls with rounded chin-length mushroom bobs, full fringes and inward-curving ends; columns 3–5 are girls with a single ponytail. Each hair group progresses through light, tan and deep-brown skin tones. All sprites face three-quarter right.

Rows are idle, first stride and second stride. The generation prompt requested opposite leg and arm cycles for the two walking poses. The two poses were inspected as distinct drawings; the final engine animation still needs a motion check for foot timing and registration.

Measured layout data is saved separately in `design/girl-wardrobe-layout.json`, so the engine owner can merge the two records into `dist/assets/characters/atlas-layout.json` without concurrent edits. Each record has `src`, `cols: 6`, `rows: 3`, and 18 row-major `frames`. Each frame contains source-global `x`, `y`, `w`, `h`, `anchorX`, and `baseline`. Do not crop using nominal one-third row heights: the generated rows are not equally spaced.

## Transparency and measurement

- HKCWCC: RGBA, 1536 × 1024, alpha range 0–254; 57.03% of pixels are exactly transparent.
- St. Joan: RGBA, 1536 × 1024, alpha range 0–254; 53.09% of pixels are exactly transparent.
- These are real alpha channels, not a painted checkerboard. Some very faint residual pixels have alpha between 1 and 8; the originals were not altered to remove them. HKCWCC's bottom-left corner has alpha 1; its other corners and all St. Joan corners have alpha 0.
- Crop measurement used read-only Pillow/NumPy inspection. Row/column groups were identified using alpha greater than 32; per-frame bounds use alpha greater than 8 with two-pixel padding within safe group boundaries. Foot baselines use the last visible row at alpha greater than 32. Horizontal anchors use the median centre of the largest opaque torso segment.
- All 36 frame boxes and anchors were checked against image bounds. No Python image editing, background removal, recolouring or raster post-processing was performed.

## Inspected references

- `design/art-options/version-1-crafted-pixel.png`: approved rendering style, proportions and face detail.
- `dist/assets/characters/students-hkcwcc.png`: prior white dress, red belt, skin range and atlas arrangement.
- `dist/assets/characters/students-st-joan.png`: prior striped blue dress, tie, skin range and atlas arrangement.

The earlier short spiky hairstyle was explicitly excluded from the new girl atlas prompts. Existing outfit sheets were treated as references, not as targets to overwrite.

## Original generated source paths

- `students-girl-hkcwcc.png`: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-a160cb44-4f78-47ab-bccd-ea3b97775845.png`
- `students-girl-st-joan.png`: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-515e87a9-0c40-4083-aff5-b2418b0e7a55.png`

## Exact shared prompt

Each request used this shared prompt followed by two newline characters and its outfit specification. The request supplied the approved reference first, the corresponding old outfit atlas second, and `transparent_background: true`.

Use case: illustration-story. Create an ORIGINAL production GIRL PLAYER SPRITE ATLAS for the same Hong Kong school game. Input image 1 is the approved crafted-pixel STYLE reference; input image 2 is only a reference for the outfit, six-column arrangement, skin-tone range and pose scale. IMPORTANT CHANGE: replace the short spiky boy-like characters of the older sheet with recognisably GIRL characters with a rounded MUSHROOM BOB in columns 0–2. All eighteen figures must be girls wearing the specified knee-length shirt-dress; no boys, trousers, shorts or masculine spiky cuts. Fine crafted-pixel illustration faithful to the approved preview: crisp controlled pixel clusters and dark outlines, natural modest teenage proportions, clear expressive faces, delicate but readable eyes, coherent soft golden highlights. NOT chibi, NOT oversized heads, NOT blurry vector cartoon. Output one 1536x1024 PNG on a TRUE RGBA TRANSPARENT BACKGROUND, not a painted checkerboard or coloured matte. The alpha of all empty areas must be zero. No coloured glow, background gradient, floor, drop shadow, text, border, labels, emblems, school badges or watermark. Exact SIX COLUMNS by THREE ROWS with one full-body sprite in each of eighteen separate equal cells; no overlap, every full shoe and hair tip contained with generous transparent padding. All sprites face RIGHT in the same consistent three-quarter side view. Each figure is the same student identity and body scale, with the two requested hairstyles and three skin variants only. COLUMN 0: light skin + mushroom bob. COLUMN 1: tan skin + mushroom bob. COLUMN 2: deep brown skin + mushroom bob. COLUMN 3: light skin + one single ponytail. COLUMN 4: tan skin + one single ponytail. COLUMN 5: deep brown skin + one single ponytail. MUSHROOM BOB means a smooth rounded dome cap with full straight fringe/bangs and chin-length sides curving gently inward, a distinctly rounded girl bob silhouette, never spiky, never cropped boys' hair, no ponytail on bob columns. Ponytail columns have one dark ponytail, soft fringe, no twin tails. All have dark near-black hair with subtle warm highlights. ROW 0: relaxed idle standing, balanced feet, arms naturally lowered. ROW 1: walk A, RIGHT foot forward and LEFT foot behind, opposite arm swing. ROW 2: walk B, LEFT foot forward and RIGHT foot behind, visibly reversed arm swing and leg cycle from row 1. Keep identical head height/body length and consistent foot contact baseline within each row. Clothing sways only subtly between poses. The outfit must remain a continuous collared shirt-DRESS, not a separate shirt and skirt. Refined practical game assets, complete and cleanly separated. Outfit specification follows:

## Exact outfit-specific prompts

### students-girl-hkcwcc.png

Hong Kong Chinese Women's Club College-inspired girls' summer uniform, drawn as an original simplified uniform with NO emblem: a bright WHITE short-sleeve collared knee-length shirt-DRESS, front button placket and naturally pleated lower dress, a PLAIN RED belt at the waist, white ankle socks and simple black school shoes. This must read immediately as a modest white school shirt-dress on a teenage girl in every cell, including the mushroom-bob columns.

### students-girl-st-joan.png

St. Joan of Arc Secondary School-inspired junior girls' summer uniform, drawn as an original simplified uniform with NO emblem: a LIGHT BLUE, very thin white/blue VERTICALLY STRIPED short-sleeve collared knee-length shirt-DRESS, a neat dark navy NECKTIE, natural pleats below the waist, white ankle socks and simple dark-brown school shoes. Keep the same thin stripes, colour and tie on all eighteen girls, including the mushroom-bob columns.

## Scope

This asset task created only the two new PNGs, a separate crop metadata JSON and this production record. Application code, engine code and the shared atlas-layout file were left to their owners. Integration, animated motion QA and publication are separate tasks.
