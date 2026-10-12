# Academic A anatomy revision

- Production sibling: `public/campus/images/life/staff-academic-a-v2.png`; measured layout: `staff-academic-a-v2.layout.json`.
- Built-in imagegen anatomy correction; original v1 remains unchanged. Source output copied without pixel modification.
- Selected source: `/Users/jackho/.codex/generated_images/01a11b37-3623-7652-90a8-3813a11d2e1c/exec-a198e684-c480-4b9d-8396-d1cff422585c.png`.
- All24 full bodies inspected, alpha measured, frame and fixed-height metadata regenerated.
- Approximate idle head units (hairtop to chin, excluding hanging hair) 54/57/57/59px in row order. Ratios are recorded in layout. These are visual anatomical estimates, not algorithmic guarantees; runtime comparison with approved reference remains required.

## Exact anatomy-correction prompt

```text
Use case: precise-object-edit.
Target image1 is a 4-row ×6-column school teacher sprite atlas. Reference image2 is the approved NATURAL BODY PROPORTION; it is a style/anatomy reference, not a composition to copy.
Correct ONLY BODY PROPORTIONS of all24 adults, preserving exact four identities, clothes, right-facing view, fullbody six-pose sequence, transparency and regular arrangement.
MANDATORY QUANTITATIVE PROPORTION: each adult must be 6.2 to6.8 HEADS TALL. The head unit includes HAIR TOP to CHIN. Each head from hairtop to chin must occupy ONLY15–16.5% of standing hairtop-to-shoes body height and NEVER exceed18%. Current heads are too large: reduce every hair/head/face unit by approximately35–40% relative to body. This applies to every one of the24 poses including women with bobs and ponytail. Keep hairstyles/face identities but smaller natural adult head units. Ears/features scale together; don't leave huge hair halo.
Keep each character's existing full hairtop-to-shoes height and rowbaseline roughly unchanged. Use the space recovered from smaller head to LENGTHEN torso and especially upper/lower legs naturally: anatomically realistic long-legged adult proportions, NOT miniaturized children. Knees at natural adult position, normal shoulders, natural hands and footwear. Do not scale entire character down; REDUCE HEAD relative to whole body. No chibi/anime oversized heads. Natural tall elegant adults matching reference2.
Keep six poses: relaxed standing; left contact; bent-knee passingA with one raised heel; right contact; bent-knee passingB; calm open-hand conversation. Preserve coherent actual walking limbs. Same adult size in all6poses.
Four identities unchanged: Chinese black-bob woman plum cardigan cream blouse charcoal trousers; English chestnut-wavy woman burgundy jacket cream blouse darktrousers; Maths short-haired man rectangular glasses navy knittedvest lightblue shirt tie charcoal trousers; Science blackponytail woman white labcoat teal blouse dark trousers. Original fine pixel game rendering, warm face likeness, subtle shading.
All full hair, hands and shoes inside the canvas with clear transparent outer margins and gutters. No backgrounds, floor, shadow, text, labels, grid, border, checkerboard or watermark. Preserve genuine transparent alpha. This is an anatomy correction, not an outfit redesign.
```

