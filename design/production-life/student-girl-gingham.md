# Student girl gingham production atlas

- Runtime ID: `player-girl-3`.
- PNG: `public/campus/assets/life/student-girl-gingham.png`.
- Metadata: `student-girl-gingham.layout.json`.
- Built-in image generation with transparent background; source copied unchanged from `/Users/jackho/.codex/generated_images/01a11b37-f27e-75e3-9f01-083b22e1092d/exec-78e3ca7d-e9f3-4c50-a9b0-c56fbd78e997.png`.
- References: student-girl-white edit target; GIRLS-REVIEW-v1 G4/G8 clothing; 05-walk-proportion-v3 approved body proportions.
- Actual dimensions: 1536 × 1024 RGBA, 2291816 bytes.
- Alpha range: 0–254; 60.54% exactly transparent; sampled empty edge gutters 0–1.
- Two rows: bob / long ponytail. Five columns: idle and four drawn walk keys. Standing heights 467/469 source pixels.
- Visual inspection: blue-white square gingham, short sleeves, matching checked belt, white socks and white school shoes; full feet, slender teenage proportions and clean ear colouring.
- Bounds measured from alpha >16 with 2 px margins. Per-row face registration keeps arms/backpack out of anchors. Use invariant standingHeight to scale.
- This is four drawn walking keys, not eight separate drawings. Runtime cycle needs visual verification. One approved light-medium skin tone; further tones need separately validated art or masks.

## Exact prompt

Use case: identity-preserve. Production transparent sprite atlas, precise OUTFIT-ONLY edit.
Image1 is exact edit target: completed student-girl-white, 2 rows by 5 columns. Preserve precise composition, all ten body poses, natural slender teenage body/leg proportions, face/head size, clean warm-peach ears, hair and backpacks. Row0 mushroom bob; row1 long ponytail. Image2 is wardrobe-only reference: G4 and G8 BLUE-WHITE CHECKED DRESS with WHITE SHOES. Image3 is approved anatomy authority. Never enlarge heads or shorten bodies.
Change only ALL TEN outfits: blue-and-white SMALL GINGHAM CHECKS over a short-sleeved collared knee-length shirt-dress; matching blue checked fabric belt with simple pale buckle; white ankle socks and WHITE low school leather shoes. Check pattern is fine square gingham, NOT vertical stripes, and follows clothing folds naturally. No red belt and no tie. Preserve navy backpack, full button front, clean pleated modest skirt, crisp white shoe silhouettes with pale grey sole/shading. Fine detailed original pixel-anime artwork.
Five columns unchanged: idle, left-contact walk, passing A, opposite-contact walk, passing B. Retain distinct opposite arm swing and support-leg overlap, stable shoe baseline, all full heads and feet visible. Same head/body scale across frames. Do not recompose.
1536x1024 RGBA with genuine transparent background everywhere except ten separate figures. NO matte, NO backdrop, NO ground/shadow/glow, NO text/grid/labels. No chibi and no3D.

