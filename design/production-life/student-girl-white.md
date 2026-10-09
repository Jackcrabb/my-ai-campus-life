# Production asset — girl white shirt dress and red belt

Generated on 2026-10-09 with the built-in OpenAI ImageGen tool, following explicit approval of the v3 proportion review and the G1/G5 wardrobe designs. This task changed no runtime JavaScript or CSS.

## Files and geometry

- PNG: `public/campus/assets/life/student-girl-white.png`
- Geometry: `design/production-life/student-girl-white.layout.json`
- Runtime ID: `player-girl-0`
- Actual output: 1536 × 1024 RGBA PNG, 1,980,773 bytes.
- Two rows × five columns. Row 0: chin-length mushroom bob; row 1: long single ponytail. Both retain the white short-sleeve collared knee-length dress, red belt, white socks, black shoes and navy backpack.
- Columns: idle, left contact, passing A, right contact, passing B.
- Bob identity: idle 0, walk [1,2,3,4], invariant standingHeight 462.
- Ponytail identity: idle 5, walk [6,7,8,9], invariant standingHeight 465.
- Frames use measured alpha bounds with two-pixel margins and shoe baselines. Crossed arms obscure part of the red belt in some poses, so horizontal registration follows the face-pixel median with a fixed offset calibrated to each row's idle waist. This avoids treating a forward hand as the torso centre.
- All frame rectangles and anchors were validated inside the source image. Always use an invariant identity scale from standingHeight, never a different scale based on each frame's height.

## References and generation history

1. `design/campus-life-review-v1/05-walk-proportion-v3.png`: authoritative body proportions, clean skin/ear palette, natural walking, face and backpack.
2. `design/character-review/GIRLS-REVIEW-v1.png`: G5 bob and G1 long ponytail; matching white summer dress with red belt.

Initial generation: `exec-bb339516-c4f8-47ea-835f-3258c6ae78ba`.

Targeted correction: `exec-15b8ec04-0424-4e85-a11c-20b246c5ae9d`. It corrected the last two columns' arm phase and asked for opposite near/far leg overlap, preserving the remaining figures. Final original file: `/Users/jackho/.codex/generated_images/01a11b37-f27e-75e3-9f01-083b22e1092d/exec-15b8ec04-0424-4e85-a11c-20b246c5ae9d.png`.

The final PNG is copied unchanged. No Python image editing, background removal, stretching or recolouring was applied. Python was used only to read alpha/colour samples and calculate JSON geometry.

## Inspection and limits

The final sheet has ten complete figures, two clearly distinct hairstyles, stable head/body scale, complete shoes, compact passing poses and opposite arm positions for the contact phases. The passing silhouettes remain similar when viewed from the side; the finished gait must be assessed in motion, with no claim that the atlas alone guarantees natural foot contact. Four independently drawn walking keys per hairstyle are supplied, not eight independent animation drawings.

Alpha range is 0–254, with 61.8% of pixels exactly zero. Top gutter is alpha 0; side gutters alpha 0–1; the narrow row gap is alpha 0–5 near antialiased edges. There is no opaque scenery or painted floor. Transparent pixels may retain dark RGB values.

This atlas contains the approved light-medium skin treatment. The runtime must not silently render all three skin choices identically. Additional per-skin artwork or validated face/limb masks remain separate work. Blind hue replacement is unsuitable because it may alter the red belt or hair highlights. Engine integration has been informed of this limitation.

## Exact initial prompt

Use case: stylized-concept.
Asset type: PRODUCTION TRANSPARENT FULL-BODY WALKING SPRITE ATLAS for an original Hong Kong school game.
Create EXACTLY TEN complete GIRL figures in an exact TWO ROWS × FIVE COLUMNS grid, ideally1920×1280, each invisiblecell384×640. Preserve5×2cell geometry even if outputresolution changes. Every figure must fit fully inside its own cell with generous alpha gaps; all planted soles use95%cellheight baseline. Same physical body and head scale throughout.
REFERENCE1 is the USER-APPROVED v3 body-proportion review. Its BOTTOM GIRL ROW is AUTHORITATIVE for face, natural elongated teenage torso/legs, head-to-body scale, clean warm-peach ears, clothing and navybackpack. Preserve this exact anatomy; do NOT revert to short-legged/chibi shapes or oversizedheads.
REFERENCE2 is ONLY the approved hairstyle and outfit detail guide: G5 mushroom bob for TOP ROW and G1 long single ponytail for BOTTOM ROW. Do NOT copy reference2's poster, labels, other outfits or change thebodyproportions ofREFERENCE1.
ONE SAME light-medium warm-skinned teenage GIRL identity in allTEN cells. All face three-quarter RIGHT at sameangle. ROW1: rounded chin-length BLACK MUSHROOM BOB with soft full fringe asG5, no tiedhair. ROW2: long SINGLE BLACK PONYTAIL asG1/v3, extending down upper/midback; no twin-tails or bun. Only hairstyle differs byrow. Anatomical head/face size stays identical, not biggerbecause ofponytail.
EXACT OUTFIT ON EVERY FIGURE: WHITE SHORT-SLEEVE collared KNEE-LENGTH shirt dress, narrow plain RED BELT at natural waist, WHITE ankle socks, BLACK leather schoolshoes, dark NAVY BACKPACK worn correctly on BOTH shoulders. Modest opaque white fabric, pale blue-grey folds, smallbuttons, no tie, no badge/crest/logo. All aregirls in samekneelengthdress, not shorts/trousers. Hands empty, noheldbook.
FIVE COLUMN ORDER (same inbothrows):
1 IDLE: upright relaxed standing, bothshoesgrounded near eachother, armsrelaxed at sides so transitiontowalkisclean.
2 LEFTCONTACT: anatomical LEFT foot forward, leftheel contacting baseline; RIGHT leg behind with rightheel lifted and toesgrounded. RIGHTarm forward, LEFTarmback. Modest everyday step, no widerthan shoulderwidth; skirt shifts slightly without changinghem length.
3 PASSING A: LEFT leg carriesweight, LEFTshoe flat directlybelow hip; RIGHTknee flexes and passes forward just underneathpelvis, RIGHTshoe brieflyhovering beside theplantedankle. Feet closehorizontally, less thanhalfshoulderwidth apart. Bodyupright, no squat.
4 RIGHTCONTACT: anatomical RIGHTlegforward heelonbaseline, LEFTlegbehind toesonbaseline; LEFTarmforward RIGHTarmback. Clearlyopposite limb overlap/armswing fromcolumn2, not duplicatedpose.
5 PASSING B: RIGHTleg carriesweight, RIGHTshoe flat directlybelowhip; LEFTknee flexes and passes forward underneathpelvis, LEFTshoe brieflyhovering byplantedankle. Feet closehorizontally lessthanhalfshoulderwidth. Opposite supportleg tocolumn3. This MUST beaCOMPACTPASSINGpose, neverarepeatedwidecontactstride.
Inallcells at leastonefootgrounded; nofloating,jumping,running. Never shortenlegs/enlargeheadtofitpose. Oneinvariantbody scale across5poses: allheads samepixelwidth/height; shoulder/torso/thigh/calflengthsunchanged. Bendingknees canlowerheadslightlybutdoesnotrescalefigure. Posedifferencesmust beleg/arm motion, not uniformredesign. Hair/backpack haveonlyvery smallplausiblesway, attachmentsstable.
Fine crafted-pixel animeart exactlymatchingreference1: crisppixelclusters, precise silhouettes, refinedclothfolds, naturallysizedteenface/eyes, longnaturallegs. Cleanpeachears withsofttaninnerfold, NOred/purple/grey earpatch. NOgiantheads, NOchibi, NOsquatbodies, NOvector, NO3D, NOblur.
True transparent alpha outsidefigures. NOopaqueorpaintedbackground, NOcheckerboardpaintedintofile, NOfloor, NOgroundshadow, NOglow/halo, NOtext, NOlabels, NOgridlines, NOwatermark. Onlytencompletegirlcharacters.

## Exact correction prompt

Use case: precise-object-edit.
Correct ONLY COLUMNS4and5 in BOTH rows of this transparent2×5girl atlas; preserve every other sprite, all faces, hair, ears, outfits, natural bodyproportions and the1536×1024canvas. The first3columns stay unchanged.
Problem: columns4/5 are nearly duplicates of columns2/3 instead of the opposite gait phase. Fix their NEAR/FAR limb overlap and arm positions explicitly:
COLUMN4, bothrows: RIGHT-FOOT CONTACT and opposite armphase. The FOREGROUND/NEAR ARM (the clearly visible arm attached to the shoulder nearest the viewer) must now swing FORWARD toward screen-right, hand placed in frontofwaist at aboutbeltheight; elbow mildlybent. The FAR ARM swings BACK toward screen-left, smaller and partly behindbackpack. THIS MUST VISIBLY DIFFER fromcolumn2 where neararmhangsback. The FOREGROUND/NEAR leg now reaches FORWARD toscreen-right withheelgrounded; the FAR leg extends back toward screen-left withheelraised. Preserve modeststride, leglengths andthecommonfootbaseline. Separate near/far legedges through subtle shading.
COLUMN5, bothrows: OPPOSITE PASSING. FOREGROUND/NEAR ARM moves BACK/relaxes along rear sideofbody toward screen-left, hand nearthigh, not held forwardascolumn3. FAR arm lightlyforward, partlyvisible. The FOREGROUND/NEAR KNEE is the flexed moving knee, passing IN FRONT OF the otherleg, withthe lowerleg angled slightly backward and itsblackshoe visiblyOFFground just beside the plantedankle. The FAR leg is straight weightbearing beneathhip and itsblackshoeFLATonground. No largeforwardstride. Visibly draw the bentmovingforegroundleg overlapping the straight supportingfarleg, whereascolumn3 has thestraightleg infront andthe bentlegbehind. Feet stay close, not morethanhalfshoulderwidthhorizontal separation. No jumping.
Maintain identical headpixelSIZE and same longnatural teenanatomy inallfigures. No bodyrescaling, shorterlegs, squatpose or hugehead. ExactlytheexistingwhiteSHORTsleevecollareddress/redbelt/whitesocks/blackshoes/navybackpack. Toprowblackmushroombob,bottomrowlongsingleponytail. Warmpeachearsclean. Preserve truealpha background, NOtext/nogrid/noshadow/noglow. Only targeted limbpose correction in thefour specifiedsprites.

