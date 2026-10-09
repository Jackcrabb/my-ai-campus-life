# Production asset — boy light-blue pinstripe trousers

Generated on 2026-10-09 with built-in OpenAI ImageGen as a controlled edit of the approved boy-white production atlas. No runtime code was edited.

## Deliverables

- PNG: `public/campus/assets/life/student-boy-striped.png`
- Geometry: `design/production-life/student-boy-striped.layout.json`
- Runtime ID: `player-boy-2`
- Output: 1536 × 1024 RGBA PNG, 2080199 bytes.
- Source: `/Users/jackho/.codex/generated_images/01a11b37-f27e-75e3-9f01-083b22e1092d/exec-baa569a9-dcb0-4e89-8a15-02a2025567ac.png`

The ten complete figures retain the white short-sleeve shirt, black belt, navy backpack and existing natural body proportions. Trousers are light blue with fine vertical pinstripes following the folds, and shoes are dark brown. The two hair rows and five poses remain visually consistent with the input. No text, crest or scenery was introduced.

Alpha is 0–254; 53.81% of pixels are fully transparent. Inspected empty gutters have alpha 0–2. All ten source rectangles, horizontal anchors and shoe baselines pass bounds validation. PNG pixels were not edited programmatically.

Row 0 is tousled short hair: idle 0, walk [1,2,3,4], fixed standingHeight 452. Row 1 is buzz cut: idle 5, walk [6,7,8,9], fixed standingHeight 448. Horizontal registration follows the face median at an invariant offset from the idle anchor. Use one scale per identity; do not divide by each pose's frame height. The sheet supplies four drawn walk keys, not eight independent drawings. The final foot cycle still needs runtime visual verification.

The image contains the approved light-medium skin treatment. Other skin choices require separately validated assets or masks.

## References

1. `public/campus/assets/life/student-boy-white.png` — exact edit target and pose reference.
2. `design/character-review/BOYS-REVIEW-v1.png` — B3/B7 outfit only.
3. `design/campus-life-review-v1/05-walk-proportion-v3.png` — approved anatomy and ear palette.

## Exact prompt

Use case: identity-preserve.
Asset type: production transparent 2-row × 5-column boy walking atlas, controlled wardrobe variation.
INPUT1 is the exact EDIT TARGET atlas. Preserve all TEN characters' physical body scale, head/face/ear appearance, clean warm skin, two hairstyles, five distinct poses and foot baselines, spacing, camera and navy backpacks. TOP ROW tousled short hair; BOTTOM ROW extremely short buzz cut. All are boys, facing three-quarter right. Keep the natural elongated teenage proportions approved in INPUT3, never chibi.
INPUT2 is ONLY the B3/B7 outfit reference in column C: summer WHITE SHORT-SLEEVE collared shirt with LIGHT BLUE PINSTRIPED FULL-LENGTH TROUSERS and DARK BROWN SHOES. Do not copy its poster, text, other uniforms or body proportions.
Change only these wardrobe areas on ALL10 figures:
1) Keep the white short-sleeve open-neck collared shirt exactly as it is, tucked in; no tie, no jacket.
2) Change the white trousers to LIGHT BLUE straight long trousers with clearly visible fine darker-blue VERTICAL PINSTRIPES. Stripes follow the leg's fabric contours and bends, remain fine and regular; no checks, no thick bars, no shorts. Preserve exact existing trouser silhouette and foot coverage.
3) Change black leather shoes to DARK BROWN leather school shoes; keep exact shoe shape/position. Plain dark belt remains.
Everything else unchanged: empty hands, navy backpack both shoulders, body/limb lengths, head size, hair, ear peach palette and modest everyday gait. Keep columns idle/contactA/passingA/oppositeContact/passingB. Passing figures have feet close beneath hips, not replacement contact strides; keep opposite arm phases. No walking-leg enlargement or whole-body rescaling between frames.
Output remains1536×1024, EXACT5cols2rows, ten complete uncropped figures. True transparent alpha outside artwork, no background or floor, no shadows/halo, text, grid, watermark, crest or logo. Crisp fine crafted-pixel anime identical to INPUT1. This is an outfit change only.
