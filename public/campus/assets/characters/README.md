# Production character artwork

These original assets were generated with the built-in image_gen tool on 2026-10-08 for the approved first crafted-pixel visual direction. The approved reference is `design/art-options/version-1-crafted-pixel.png` (generation exec-7b48e905). No third-party art was downloaded.

## Files and layout

- `students-queens-college.png`: 6 columns × 3 rows; white open-neck short-sleeve shirt, white long trousers, black belt, black shoes; no tie.
- `students-pooi-to.png`: 6 × 3; dark navy cheongsam with three decorative flower fastenings, white socks, black shoes.
- `students-hkcwcc.png`: 6 × 3; white collared dress, plain red belt, white socks, black shoes.
- `students-st-joan.png`: 6 × 3; light-blue striped dress, navy necktie, white socks, dark-brown school shoes.
- `npcs-school-community.png`: 10 × 2; four classmates and six recurring staff visual identities. Rows are idle and speaking.
- `atlas-layout.json`: measured source rectangles, horizontal registration anchors, and footwear baselines. The same metadata is embedded in engine.js to avoid an additional startup request.

Student columns: short hair/light, short/medium, short/dark, single ponytail/light, single ponytail/medium, single ponytail/dark. Rows: idle, first stride, second stride. The generator did not maintain mathematically equal row spacing, so runtime cropping uses measured transparent bounds rather than cutting feet at nominal row divisions. Source PNG files are preserved exactly as generated. Alpha and bounds were inspected with Pillow; no image pixels were edited with Python or another image editor.

NPC columns: Ching; Long; Yau; Chun; female teacher in green cardigan; male teacher in blue shirt; office clerk; principal; vice principal; PE teacher. The selected two-row NPC sheet replaces an earlier three-row attempt whose bottom-row feet were cropped. That rejected image is not deployed.

All five production PNGs are 1536 × 1024 RGBA with genuine transparent background pixels. Their alpha ranges are 0–254. They total approximately 10.7 MB. The engine requests the current student uniform and shared NPC sheet first; other uniform sheets load when selected.

## Generation prompts

Common student prompt:

Use case: stylized-concept. Asset type: PRODUCTION TRANSPARENT SPRITE ATLAS for a side-scrolling Hong Kong secondary-school game. Reference image 1 is the APPROVED ART STYLE ONLY: match its detailed crafted pixel-anime rendering, believable teenage proportions (about 6.5 heads tall), delicate expressive faces, controlled pixel clusters, finely shaded hair and cloth. Do not copy its page layout. Create one landscape sprite atlas, exact 6 equal columns by 3 equal rows, 18 full-body figures. Prefer 1536x1024; every column 256px and every row one third image height. Every frame is centered in its invisible cell; feet baseline exactly 92% of each cell height; character height exactly 84% of cell height; leave generous transparent separation. All figures face 3/4 RIGHT, including walking frames. COLUMN ORDER: 1 short hair/light peach skin, 2 short hair/medium brown skin, 3 short hair/deep brown skin, 4 one SINGLE ponytail/light peach skin, 5 one SINGLE ponytail/medium brown skin, 6 one SINGLE ponytail/deep brown skin. Same teen facial character and dark hair across the six variants; same age and height. ROW ORDER: row1 relaxed idle with both feet grounded; row2 walking left leg forward/right leg back and arms counter-swing; row3 walking right leg forward/left leg back and arms counter-swing. Each column is ONE consistent character through all three rows. Keep neck/head/torso registered identically, no body scale shifts. No ground shadows, no floor, no scenery, no labels, no grid lines, no text, no logo, no crest, no watermark. GENUINE alpha transparency across background. Opaque sprite pixels, crisp pixel-art edges; no blurry painterly edges, no 3D, no chibi, no giant heads, no simplistic block figures. Full head and footwear visible in every cell. Outfit details follow exactly below.

Each student request appended the exact uniform description listed above and required no backpack or held object, free arms for the walking cycle, no crest or logo, and the same uniform on all six hair/skin variants.

Final NPC prompt: detailed crafted pixel-anime full-body sheet matching the approved reference; exactly two rows and ten columns on a transparent 1536 × 1024 image; every figure entirely inside its cell with complete head and footwear; row 1 calm idle, row 2 same identity and registered stance with a small speaking expression/gesture. Exact identity and clothing descriptions were provided for all ten columns. The prompt required no labels, grid, floor, shadows, logos, or opaque background.

## Generation provenance

| Asset | Built-in image generation |
|---|---|
| Queen's College students | exec-ca284faf-c728-41d9-97f2-5e60de4991a5 |
| Pooi To students | exec-e5a183d3-9b1b-4314-933d-81180719e33d |
| HKCWCC students | exec-cb056dc3-8df6-441a-b847-537822087a36 |
| St Joan students | exec-bacce2c6-ec85-47ad-8d66-df575519c166 |
| School NPCs, selected revision | exec-3ebfe1f3-061a-4777-ac3c-b18f5b62fa15 |

## Runtime behavior

The canvas crops the original raster sheets, registers the horizontal anchor and foot baseline, and mirrors only when the facing direction requires it. Character heights are 158 logical pixels for the player, 157 for classmates, and 171 for adults. Walking advances from distance travelled, with centralized speed and cycle-distance constants. Reduced-motion preferences suppress ambient movement. Image-load failure retains the prior procedural fallback so navigation remains usable.

Background contract: `window.CAMPUS_ART[location] = {src, col, row, cols, rows, groundY?}`. Each world is 1500 × 500. A 1536 × 512 panorama scales uniformly to that world. `groundY` controls feet, interaction hit zones, markers, and prompts. Loaded artwork replaces procedural background/door painting; entrance labels and floor chevrons retain navigability.

Additional methods: `setTalking(id, boolean)` selects an NPC speaking frame; `refreshArt()` redraws after a mapping update. Existing APIs are unchanged.
