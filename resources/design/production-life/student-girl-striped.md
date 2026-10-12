# Student girl striped production atlas

- Runtime ID: `player-girl-1`.
- PNG: `public/campus/images/life/student-girl-striped.png`.
- Metadata: `student-girl-striped.layout.json`.
- Built-in image generation with transparent background; source copied unchanged from `/Users/jackho/.codex/generated_images/01a11b37-f27e-75e3-9f01-083b22e1092d/exec-abaa20a3-c815-4483-bb71-1d6f7b570a28.png`.
- References: existing student-girl-white atlas as edit target; GIRLS-REVIEW-v1 G2/G6 for clothing; 05-walk-proportion-v3 for approved natural body proportions.
- Actual dimensions: 1536 × 1024 RGBA, 2167209 bytes.
- Alpha range: 0–254; 59.06% exactly transparent; sampled empty edge gutters 0–1.
- Two hairstyle rows: bob and long ponytail. Five columns: idle plus four drawn walking keys. Standing heights 464/468 source pixels.
- Visual inspection: short sleeves, blue vertical pinstripes, dark navy tie, matching blue belt, white socks and brown shoes; body proportions, full feet and clean warm ear palette retained.
- Crop bounds and foot anchors measured from alpha >16 with 2 px margins. Horizontal anchors track face at a fixed per-row offset. Use invariant row standingHeight for scale, never individual frame crop height.
- Four drawn walking keys are provided, not eight independently drawn frames. Runtime gait still needs visual verification. Additional skin tones require validated variants or masks; this asset has one approved light-medium tone.

## Exact prompt

Use case: identity-preserve. Production transparent sprite atlas, precise OUTFIT-ONLY edit.
Image1 is the exact edit target: the completed student-girl-white 2 rows by 5 columns atlas. Keep exactly its canvas composition, every character position, full-body natural teenage proportions, face/head size, clean warm-peach ears, hair, backpack, and the ten poses. Row0 mushroom bob, row1 long ponytail. Image2 is wardrobe-only reference: G2 and G6 BLUE VERTICAL PINSTRIPE DRESS. Image3 is the approved anatomy authority; do not shorten limbs or enlarge heads.
Change only the clothing/shoes in ALL TEN figures to the approved light-blue short-sleeve collared knee-length shirt-dress with fine blue-and-white VERTICAL PINSTRIPES, dark navy necktie, matching light-blue fabric belt, white socks, and DARK BROWN school leather shoes. Remove red belts completely. Preserve a navy backpack.
Keep five columns: idle, left-contact walk, passing A, right-contact walk, passing B; opposite arms and foot overlap retained. No new poses, no hand gestures, no drifting heads, no growing heads. Same scale and shoe baseline across all frames. Fine detailed original pixel-anime art with slender natural teenage legs and crisp soft-edged pixel clusters; no chibi, no 3D.
1536 by1024 transparent RGBA PNG. Background must be fully transparent everywhere except the ten separate characters, including gaps. No grey/brown matte, no floor, no shadow, no glow, no text, no labels, no grid. Keep every head and foot fully within its cell.

