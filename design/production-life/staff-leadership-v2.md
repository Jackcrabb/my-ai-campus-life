# Leadership anatomy revision

- Production sibling: `public/campus/assets/life/staff-leadership-v2.png`; measured layout: `staff-leadership-v2.layout.json`.
- Built-in imagegen anatomy correction. Original v1 unchanged; selected output copied without pixel manipulation.
- Source: `/Users/jackho/.codex/generated_images/01a11b37-3623-7652-90a8-3813a11d2e1c/exec-98f052b2-4d30-47e2-b06b-f35b47108fc4.png`.
- All24 full bodies and real RGBA alpha inspected. Explicit perframe bounds, anchors and peridentity fixed standingHeight regenerated.
- Approximate idle hairtop-to-chin units51/50/48/49px, excluding neck/braid hanging belowchin. Ratios stored in layout. Measurements are visual estimates with approximately3px uncertainty, not algorithmic anatomy guarantees. Runtime comparison to approved05-v3 remains the final visual check.

## Exact anatomy prompt

```text
Use case: precise-object-edit. Correct adult anatomy on this transparent 4-row ×6-column staff atlas. All24 current heads are too big, especially vice principal and mentor. Make the COMPLETE head/hair/face/skull unit dramatically SMALLER: target EIGHT HEADS tall fashion-figure adult proportions to ensure small refined heads, long necks, full-length torsos and naturally long legs. Head from hairtop to chin is ONLY12–13% of entire hairtop-to-shoe standing height. Do not include hanging hair below chin in the unit. Reduce head dimensions by about45% relative to body, not just a subtle5% adjustment. Keep each fullbody approx same pixel height as existing atlas by extending torso and especially legs upward into reclaimed space. Preserve normal adult shoulder width and hands, normal feet, identity/hairstyle/outfit, all6poses, right-facing angle and transparent background. NATURAL adult people, absolutely not chibi, teen proportions, big-headed anime, doll heads, or compressed legs.
Row1 older principal man sweptgrayhair rectangularglasses navy suit white shirt goldtie navytrousers blackshoes.
Row2 viceprincipal woman shortauburnsidepart hair deepplumsuit creamcollaredblouse plumtrousers blacklowshoes. Her entire head and hair must be naturally small adult proportions.
Row3 schooloffice man shortneatblackhair glasses graylongsleeveshirt tealtie plainlanyard charcoaltrousers.
Row4 newstudentmentor woman longdarkhair sidebraid peachcardigan creamcollaredblouse taupetrousers darkflats. Especially her head unit must be small and adult, not cute schoolgirl/chibi. Braid can hang naturally without expanding skull.
All24 FULL bodies fit with generous margins, especially rightmost fingertips and bottom shoes; use at least30transparentpixels aroundallouteredges. Preserve poses columns1 idle,2contact,3oneverticalleg+oneBENTknee raisedheel passing,4oppositecontact,5oppositepassing,6openpalmconversation. Same scale eachpose, real limbs not duplicateframe. Finepixelpaint style asoriginal but naturaladult anatomy.
No text, grid, frames, borders, background, floor, shadow, watermark or checkerboard. Preserve true RGBA transparency. Reference2 is desired refined natural adult limb length, not its clothes.
```

