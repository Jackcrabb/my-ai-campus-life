# Production campus backgrounds

Generated on 2026-10-08 with the built-in imagegen tool, using the user-selected crafted-pixel preview as a style reference. No CLI/API fallback was used.

Reference: `design/art-options/version-1-crafted-pixel.png`. All nine generated PNG files were visually inspected and then copied unchanged into the deployment folder; original generated files were retained. No Python image editing or raster post-processing was performed.

## Atlas and rendering contract

Each verified file is exactly **1536 × 1024 PNG**, containing two equally sized full-width **1536 × 512** side-on environments. Top row is `row: 0`; bottom row is `row: 1`. All records use `col: 0`, `cols: 1`, `rows: 2`. The runtime mapping is `dist/campus-art.js`, exposing `window.CAMPUS_ART`.

The requested 76% floor baseline was not rendered identically in every generated scene. `groundY` therefore gives a visually reviewed approximate character-feet position after the selected panel is scaled to **1500 × 500**. These positions sit on clear foreground floor, usually about 20 pixels below the wall/floor join; rooms with projecting furniture allow extra clearance. They are placement guidance, not collision geometry. Preserve the full panel and adapt actor baselines rather than stretching the architecture.

All environments were inspected for the chosen cream/teal/golden palette, side-on composition, two-panel division, discipline-specific props, a clear walking line, and absence of people or UI. Small noticeboard marks are decorative, not reliable readable content. The generated art is original school-inspired scenery, with no official school photos or badges.

| File | Top location | Top groundY | Bottom location | Bottom groundY |
|---|---|---:|---|---:|
| `dist/assets/backgrounds/campus-pair-01.png` | `corridor` | 442 | `playground` | 380 |
| `dist/assets/backgrounds/campus-pair-02.png` | `hall` | 430 | `corridor1` | 385 |
| `dist/assets/backgrounds/campus-pair-03.png` | `chinese` | 450 | `english` | 448 |
| `dist/assets/backgrounds/campus-pair-04.png` | `maths` | 460 | `corridor2` | 392 |
| `dist/assets/backgrounds/campus-pair-05.png` | `chemistry` | 455 | `geography` | 420 |
| `dist/assets/backgrounds/campus-pair-06.png` | `computer` | 442 | `corridor3` | 405 |
| `dist/assets/backgrounds/campus-pair-07.png` | `history` | 445 | `art` | 430 |
| `dist/assets/backgrounds/campus-pair-08.png` | `music` | 445 | `corridor4` | 392 |
| `dist/assets/backgrounds/campus-pair-09.png` | `library` | 440 | `rooftop` | 365 |

## Original generated source paths

- Pair 01: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-134ddf53-1677-42a1-b0cf-709cff325784.png`
- Pair 02: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-d5366927-85ef-4a79-aabd-086f2004b6b7.png`
- Pair 03: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-6efc7a4f-01fa-442b-94c0-a665f53b9c3a.png`
- Pair 04: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-4443763a-6b49-46a4-8b03-86b644cabc1c.png`
- Pair 05: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-3b686abf-8c0c-4824-b7f0-de7e2cbd2f07.png`
- Pair 06: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-d9f1e453-b20a-4cac-ad07-4f31be343ee9.png`
- Pair 07: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-fdd3c47f-3bfd-44f5-8aa7-83746e0a6a74.png`
- Pair 08: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-a0b65b8c-1d0c-4ec4-9778-5e88dbf620b6.png`
- Pair 09: `/Users/jackho/.codex/generated_images/01a11b36-eec1-7b41-bba2-8a0eacf03c12/exec-4c370e97-1497-46ff-b0e5-1f1802eca371.png`

## Exact shared prompt

Each request used the following exact shared prompt, followed by two newline characters and its pair-specific prompt below. Every request referenced the selected local image with `transparent_background: false`.

Use case: illustration-story. Production background atlas for a Hong Kong secondary-school side-view 2D exploration game. The input image is STYLE REFERENCE ONLY: faithfully match its crafted pixel treatment, finely controlled dark outlines, warm cream architecture, deep teal doors, golden sunlight, mottled terrazzo and detailed Hong Kong window frames. Do not copy its people, portraits, UI, letters or collage layout. Create a NEW opaque landscape PNG, exactly 1536 x 1024 pixels. The image is an ATLAS with EXACTLY TWO equally sized horizontal panorama panels stacked vertically: TOP is x=0,y=0,width=1536,height=512; BOTTOM is x=0,y=512,width=1536,height=512. No borders, gutters, labels, margins or dividers. Each panel fills its full 1536 x 512 area and depicts a separate complete original school environment. Each panel is a strict front-elevation side-on game background, not a view looking down a corridor: no central vanishing point, no isometric view, no steep diagonal room geometry. Horizontal wall-foot line at exactly 76% of EACH panel height (389 pixels within panel); the lower 24% is an unobstructed walkable floor foreground, spanning edge to edge with no obstacles. Furniture and props sit behind this continuous clear walking lane. The player's feet will be at y=382 in a 1500x500 scaled panel. Keep important architectural features along the back wall, all upright and square to the camera, with very shallow depth only. Interior rooms have one exit door at far left and a teacher area near centre/right. Large windows can show Hong Kong apartment blocks and greenery. Refined handcrafted pixel-art environment with crisp small pixel clusters and subtle texture, rich intentional school-life detail, coherent scale and lighting, not flat rectangles or blurry painted gradients. No characters, no people, no silhouettes, no animals, no readable writing, no UI, no game objects hovering, no logos, no school badges, no watermarks. Blank paper rectangles and nonlinguistic diagram marks are allowed. Keep every scene visually distinct and instantly recognisable by its discipline props. Panel specifications follow:

## Exact pair-specific prompts

### Pair 01 — corridor / playground

TOP: ground-floor Hong Kong secondary-school corridor, three deep-teal classroom doors spaced across the back wall, glazed transom windows, cork notices with abstract papers, cream tiles, ceiling conduits, lush potted plants behind the walk lane, narrow side window and stairwell entrance at far right. BOTTOM: outdoor school playground, empty basketball court fence and single hoop behind the walking lane, low school facade with teal doors, leafy trees, planters, warm afternoon gold shadows, distant Hong Kong apartment blocks. Keep court foreground clear.

### Pair 02 — hall / corridor1

TOP: school assembly hall, polished wood floor, low stage along back wall with closed dark-teal curtains, small podium and neatly stacked folding chairs behind walk lane, high windows, warm ceiling beams, exit door far left; no writing. BOTTOM: first-floor school corridor, four teal classroom doors along back wall, transom windows, cork board of abstract language-club notices, wall clock without legible numerals, stairwell opening at far right, cream terrazzo and long golden window-light bands.

### Pair 03 — chinese / english

TOP: Chinese-language classroom, left exit door, broad dark green teaching board with abstract chalk strokes only, elegant ink-painting landscape mounted on wall, calligraphy brushes and rolled blank rice paper on rear teacher table, low bookcases, windows and cream terrazzo clear foreground. BOTTOM: English-language classroom, left exit door, broad teal teaching board, colourful word-card-sized rectangles without writing, open storybooks on a rear reading table, globe, reading corner shelves and large windows, subtly different pale warm wall.

### Pair 04 — maths / corridor2

TOP: mathematics classroom, left exit door, teaching board with clean nonlinguistic geometry drawings of triangle/circle/coordinate grid but NO numbers or letters, large compass and set-square shapes on wall, coloured geometric solid models on rear teacher table, orderly windowframes, clean foreground. BOTTOM: second-floor science-wing corridor, three teal doors with small glass panes, a science display case of harmless geometric models and rocks, abstract notices, side windows, visible stairwell end on far right, cream tile and golden terrazzo.

### Pair 05 — chemistry / geography

TOP: junior science laboratory, exit door far left, rear benches with small neatly closed sample bottles and empty glass beakers, sink, storage cabinets, safe mineral samples and balance, abstract molecular diagrams without letters, no flames, no experiments in progress, no hazard drama, clear foreground lane. BOTTOM: geography classroom, exit door left, large stylized relief world map without labels, globe, rock trays, rain-gauge model and contour-landform model on back tables, tall windows, corkboard map swatches, clear terrazzo foreground.

### Pair 06 — computer / corridor3

TOP: computer and information technology room, far-left exit door, neat rear row of computers viewed straight on with dark-teal screens showing abstract geometric interface shapes only, cable channels, teacher workstation rear centre/right, noticeboard with abstract circuit pattern and potted plant, clear foreground floor. BOTTOM: third-floor humanities-and-arts corridor, four deep-teal doors, rotating display boards of abstract art and historical silhouettes of buildings not people, side window, cream architecture, warm golden highlights and stairwell doorway at far right.

### Pair 07 — history / art

TOP: history study room, left exit door, glass cabinet of original generic pottery and model architecture, old-map-style panel with no words, rolled documents, archival storage boxes, rear desk with magnifier and documents, warm wood bookcases, cream walls and teal trim. BOTTOM: visual arts studio, left exit door, wooden easels holding abstract landscapes behind clear lane, rear sink and paint jars, brushes and coloured-paper storage, corkboard colour swatches, broad windows, art-filled but orderly room with clear foreground.

### Pair 08 — music / corridor4

TOP: music room, exit far left, upright piano at rear centre/right, music stands behind the walking lane with abstract staff lines and notes but no readable lettering, guitar rack, closed instrument cases, small drums and acoustic wall panels, tall windows, polished warm wood floor. BOTTOM: fourth-floor quiet-study corridor, three teal doors, tall side windows with treetop and apartment view, library return trolley behind walking lane, abstract notices, potted foliage, quiet sunlit cream terrazzo and stairwell entrance at far right.

### Pair 09 — library / rooftop

TOP: school library, left exit door, rich wooden bookshelves filled with individually shaded blank-spine books, low reading desks behind lane, librarian desk rear right, reading lamps, sunny Hong Kong-style windows and potted foliage, warm terrazzo unobstructed foreground. BOTTOM: secure school rooftop garden, high protective mesh fence and cream parapet along back, raised planting beds with varied leafy plants and flowering shrubs behind lane, rainwater barrel and simple weather observation station, small access door far left, skyline and green hills, clear broad paved foreground in golden afternoon light.

## Verification scope

PNG signatures and dimensions were checked programmatically. All nine complete generated outputs were visually reviewed before copying. Runtime actor alignment and room interaction still require integration checks by the main application task. This asset task did not edit the application, engine, styles or HTML, and did not publish the website.
