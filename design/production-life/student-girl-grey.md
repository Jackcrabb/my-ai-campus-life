# Student girl grey production atlas

- Runtime ID: `player-girl-2`.
- PNG: `public/campus/assets/life/student-girl-grey.png`.
- Metadata: `student-girl-grey.layout.json`.
- Built-in image generation with transparent background; source copied unchanged from `/Users/jackho/.codex/generated_images/01a11b37-f27e-75e3-9f01-083b22e1092d/exec-05e7c4d2-a060-4090-9e8d-c25825d5d201.png`.
- References: existing student-girl-white atlas as edit target; GIRLS-REVIEW-v1 G3/G7 clothing; 05-walk-proportion-v3 anatomy.
- Actual dimensions: 1536 × 1024 RGBA, 2023952 bytes.
- Alpha range: 0–254; 58.89% exactly transparent; sampled empty edge gutters 0–1.
- Hairstyle rows: bob / long ponytail. Idle plus four walk keys per row. Standing heights 463/467 source pixels.
- Visual inspection: white full-length cuffed sleeves under grey V-neck pinafore, pleated skirt, burgundy belt, white socks and black shoes; clean ears, full feet, natural body proportions retained.
- Alpha >16 bounds have 2 px margins. Fixed face-registration anchors exclude arms/backpack. Scale each identity from standingHeight, never frame crop height.
- Four independently drawn walk keys, not eight; runtime gait requires visual verification. One approved light-medium skin tone; additional tones require separately validated variants or masks.

## Exact prompt

Use case: identity-preserve. Production transparent sprite atlas, precise OUTFIT-ONLY edit.
Image1 is exact edit target: completed student-girl-white 2 rows by 5 columns. Preserve its precise composition, ten body poses, natural elongated teenage body/leg proportions, face/head size, clean warm-peach ears, hair and backpacks. Row0 mushroom bob, row1 long ponytail. Image2 is wardrobe-only reference: G3 and G7 winter GREY V-NECK PINAFORE over white long sleeves. Image3 is approved anatomy authority. Never enlarge heads or shorten bodies.
Change ALL TEN outfits only: WHITE LONG-SLEEVED collared blouse with wrist cuffs beneath a medium GREY V-NECK knee-length PINAFORE DRESS, crisp pleated grey skirt, BURGUNDY DARK RED plain narrow belt, white ankle socks and BLACK school leather shoes. No tie, no jacket, no short sleeves, no bare upper arms. V-neck pinafore must clearly layer over the white blouse. Preserve navy backpack. Exact garment identity of G3/G7, same fine detailed original pixel-anime style.
Five columns retained: idle, left contact, passing A, opposite contact, passing B. Keep the distinct opposite arm swing in columns2 and4 and columns3 and5. Bodies same scale, heads same size, each row same shoe baseline, all heads and feet fully visible. Do not recompose or create new stance.
1536x1024 genuine transparent RGBA PNG. NO background matte, NO floor, NO shadows/glow, NO labels/text/grid. Only ten isolated figures with clear transparent gaps. No chibi, no3D.

