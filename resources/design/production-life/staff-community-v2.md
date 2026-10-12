# staff-community-v2 anatomy revision

- Production sibling: `public/campus/images/life/staff-community-v2.png`; layout: `staff-community-v2.layout.json`.
- Built-in imagegen. Single imagegen anatomy correction; original v1 preserved.
- Selected source copied unchanged: `/Users/jackho/.codex/generated_images/01a11b37-3623-7652-90a8-3813a11d2e1c/exec-d8bf3dfd-1c0a-4afa-bcee-b361585dd3d6.png`.
- All24 full bodies inspected, real alpha measured, explicit frames/fixed standing heights regenerated. No pixel editing by Python or canvas.
- Approximate idle hairtop-to-chin head heights and ratios recorded in metadata, excluding neck and hanging hair below chin. These are visual estimates with approximately3px uncertainty, not algorithmic anatomy guarantees. Parent should compare runtime visuals against approved05-v3 before final visual signoff.

## Anatomy correction — exact prompt

```text
Use case: precise-object-edit. Correct adult anatomy on this transparent 4-row ×6-column staff atlas. All24 current heads are too big, especially librarian and ecology teacher. Make the COMPLETE head/hair/face/skull unit dramatically SMALLER: target EIGHT HEADS tall fashion-figure adult proportions to ensure small refined heads, long necks, full-length torsos and naturally long legs. Head from hairtop to chin is ONLY12–13% of entire hairtop-to-shoe standing height. Do not include hanging hair below chin in the unit. Reduce head dimensions by about45% relative to body, not just a subtle5% adjustment. Keep each fullbody approx same pixel height as existing atlas by extending torso and especially legs upward into reclaimed space. Preserve normal adult shoulder width and hands, normal feet, identity/hairstyle/outfit, all6poses, right-facing angle and transparent background. NATURAL adult people, absolutely not chibi, teen proportions, big-headed anime, doll heads, or compressed legs.
Row1 music man centerpartblackhair mauvecardigan creamshirt charcoaltrousers.
Row2 older librarian woman silverbob roundglasses creamshirt sagevest olivetrousers. Especially her skull including bob must become small, NOT cute grandmother chibi.
Row3 ecology man tousleddarkhair freckles olivevest pale-yellowshirt darkolive trousers.
Row4 athletic darkskinned PE man closecroppedhair white-greenpolo darkgreen sports trousers.
All24 FULL bodies fit with generous margins, especially rightmost fingertips and bottom shoes; use at least30transparentpixels aroundallouteredges. Preserve poses columns1 idle,2contact,3oneverticalleg+oneBENTknee raisedheel passing,4oppositecontact,5oppositepassing,6openpalmconversation. Same scale eachpose, real limbs not duplicateframe. Finepixelpaint style asoriginal but naturaladult anatomy.
No text, grid, frames, borders, background, floor, shadow, watermark or checkerboard. Preserve true RGBA transparency. Reference2 is desired refined natural adult limb length, not its clothes.
```

