# Approved NPC identity variation and wardrobe production

The user approved review08 before this production pass. Four student sheets preserve the approved bob/short-boy/two-ponytail identities, their different expressions and builds, and four shared wardrobe indices. All16 staff keep their existing independent walking artwork and now use separately rendered matching waist-up portraits. Height variation is implemented through aspect-preserving scale; no source image is stretched in one axis.

Final student assets are `public/campus/images/life/cases-uniform-0-v2.png` through `cases-uniform-3-v2.png` (each1536×1024RGBA). Each has4rows×6poses: idle/contactA/passingA/contactB/passingB/talk. Their corresponding measured `cases-uniform-*-v2.layout.json` files give exact crops, face anchors and fixed standing heights. The earlier unapproved-size pass remains separately named for provenance and is not used by wardrobe selection.

Dialogue student asset: `cases-portraits-uniforms-v2.png` (1254×1254RGBA),4identity rows×4uniform columns. Individual crops are registered by canonical ID and uniform, not by speaker position. Portrait art is deliberately independent higher-detail artwork, not an enlarged40px face extracted from the walking sheet. Staff records are in `../production-staff-portraits-v3.md` and `.json`.

Source generation outputs (built-in imagegen; originals copied unchanged):
- uniform0: exec-c41d2921-f9d5-492a-929a-61ddd32d1240.png
- uniform1: exec-3c250108-3229-4ba0-a61e-5ad26f9a44fc.png
- uniform2: exec-337d346b-8331-4cfc-a50a-fbd01ef0cd85.png
- uniform3: exec-b518e59e-12bd-47a9-b8b6-bc68457b4585.png
- portrait: exec-c86c684a-61a7-4027-80a4-58c7848da15a.png

All outputs belong to the scoped illustration generation session01a11b37-f27e-75e3-9f01-083b22e1092d. Actual alpha is retained; empty background is transparent and face interiors are near-opaque (dominant252–253/255). No programmatic raster pixel editing was performed. The browser opacity and interpolation settings are responsible for final compositing.

Visual review: all4outfits ×4students rendered with their shared standing metric; complete feet and consistent baseline, varied physical heights, no anisotropic stretching. All20portrait crops were inspected on both pale and dark backgrounds. A390×844 viewport had a390×844 backing canvas at DPR1, rather than upscaling a500px-high raster. The automated test checks DPR2 backing dimensions as well. This is a scoped component review; final full-application QA remains with the main task.

## Exact anatomy / identity prompt

Use case: identity-preserve. Update the production4rows×6columns white-uniform sprite atlas in image1 to the newly APPROVED FOUR STUDENT identities and body-build differences from TOP ROW of image2. Image2 is authoritative; its bottom-row adults are not included in this sprite sheet.
Precisely preserve the distinct face, facialfeatures, headshape, hairstyle, skin tone and bodybuild of each approved top-row student in image2. DO NOT blend the two ponytail girls into clones. Every mainfigure naturally about5.8–6heads tall. Fine detailed crisp pixel-anime consistent with approvedart.
Sheetrow0 = image2toprowleft 程曉嵐: chinlengthbob, rounderface, straightbrows, petite/shorter but healthy sturdy teenbuild, visibly fuller legs than row2. Friendly smile.
Sheetrow1 = image2toprow2 許晉言: tousledshortboyhair, longnarrowface, straightnose, narroweyes, taller slender teenboy.
Sheetrow2 = image2toprow3 沈樂葵: longponytail, longerovalface, archedbrows, wide-setbright eyes, tall slender girl, cheerful expression.
Sheetrow3 = image2toprow4 韓芊澄: longponytail and neatfullfringe, softlysquarejaw, straightlowbrows, rounderfocusedeyes, fuller nose, broader shoulders/strongerlegs athleticgirl. She is visibly different from row2.
Allsixposes of eachrow must share EXACTsame face/hair/headsize/bodybuild; front-threequarterright. Sixcolumns: standingneutral; leftcontactwalk; passingA; rightcontactwalkoppositearms; passingB; standinggentleopenpalmgesture. Preserve modest gait and anatomicalarms/legs; fullhands/shoes safeinsidecells. Samebaseline perrow. Keep same4×6layout and no text.
UniformALLsame approvedcampuswhite set: girlswhiteSHORTsleevecollaredkneelengthshirtdressplainredbeltwhitesocksblackshoes; boywhiteSHORTsleeveopenneckshirtWHITE longtrousersblackbeltblackshoesnotie. Navybackpacks.
True transparentRGBA background, opaque face/clothing interiors, NOfloor/glow/haze/grid/caption. No new outfit, no chibi, no oversizedhead. Draw build differences naturally; do not squash or stretch a copied person. Highquality consistent with approved08board.

## Exact wardrobe prompts

### Uniform1

Use case: identity-preserve. CLOTHING-ONLY edit of the supplied4rows×6poses production student sprite atlas. Change only the school uniforms, keeping each of24 figures' exact face, hairstyle, skin, gender, natural slim teen anatomy, small head size, full-body scale, row position, feet baselines, backpack and limb poses. DO NOT enlarge heads or shorten legs; preserve wholebody proportions exactly. Keep row0bobgirl, row1shorthairedboy, row2longponygirl, row3slightlydifferentponygirl. Sixcolumns idle/walkcontactA/passingA/oppositecontactB/passingB/talkgesture. All three girls wear a light blue and white fine vertical pinstriped short-sleeve collared knee-length shirt dress, narrow dark navy necktie, white socks, dark brown leather shoes. Boy wears a white LONG-SLEEVE collared shirt (sleeves to wrist), GREY straight-leg LONG trousers, black belt, black leather shoes; NO tie. Keep navy backpacks.
Keep all4rows and6columns on samecanvas, no loss of hands/feet or change of pose. Crisp original fine pixel-anime, opaque face and clothing inside outlines, genuinely transparent RGBA background, no words, no coloredgrid, no background, no halo or floor shadow. Preserve anatomy and identity; wardrobe only.
IMPORTANT final identity approval: preserve the rounder sturdy bobgirl, narrow-faced slim boy, smiling tall/slim ponygirl, reserved square-rounded athletic ponygirl exactly as this corrected source. The distinct face shapes and builds must NOT converge. Natural5.8–6head anatomy, no larger heads. No redesign.

### Uniform2

Use case: identity-preserve. CLOTHING-ONLY edit of the supplied4rows×6poses production student sprite atlas. Change only the school uniforms, keeping each of24 figures' exact face, hairstyle, skin, gender, natural slim teen anatomy, small head size, full-body scale, row position, feet baselines, backpack and limb poses. DO NOT enlarge heads or shorten legs; preserve wholebody proportions exactly. Keep row0bobgirl, row1shorthairedboy, row2longponygirl, row3slightlydifferentponygirl. Sixcolumns idle/walkcontactA/passingA/oppositecontactB/passingB/talkgesture. All three girls wear a white LONG-SLEEVE collared blouse under a grey V-neck knee-length pinafore dress with a plain burgundy waist belt, white socks, black leather shoes. Boy wears WHITE SHORT-SLEEVE open-neck collared shirt with pale light-BLUE fine PINSTRIPED LONG TROUSERS, black belt, dark BROWN leather shoes. Keep navy backpacks.
Keep all4rows and6columns on samecanvas, no loss of hands/feet or change of pose. Crisp original fine pixel-anime, opaque face and clothing inside outlines, genuinely transparent RGBA background, no words, no coloredgrid, no background, no halo or floor shadow. Preserve anatomy and identity; wardrobe only.
IMPORTANT final identity approval: preserve the rounder sturdy bobgirl, narrow-faced slim boy, smiling tall/slim ponygirl, reserved square-rounded athletic ponygirl exactly as this corrected source. The distinct face shapes and builds must NOT converge. Natural5.8–6head anatomy, no larger heads. No redesign.

### Uniform3

Use case: identity-preserve. CLOTHING-ONLY edit of the supplied4rows×6poses production student sprite atlas. Change only the school uniforms, keeping each of24 figures' exact face, hairstyle, skin, gender, natural slim teen anatomy, small head size, full-body scale, row position, feet baselines, backpack and limb poses. DO NOT enlarge heads or shorten legs; preserve wholebody proportions exactly. Keep row0bobgirl, row1shorthairedboy, row2longponygirl, row3slightlydifferentponygirl. Sixcolumns idle/walkcontactA/passingA/oppositecontactB/passingB/talkgesture. All three girls wear a light BLUE AND WHITE SMALL CHECK GINGHAM short-sleeved knee-length shirt dress with a neat white collar, no redbelt, white socks, WHITE school shoes. Boy wears DARK NAVY SCHOOL BLAZER over white collared shirt with dark navy tie, GREY LONG TROUSERS, black belt, black leather shoes. Keep navy backpacks.
Keep all4rows and6columns on samecanvas, no loss of hands/feet or change of pose. Crisp original fine pixel-anime, opaque face and clothing inside outlines, genuinely transparent RGBA background, no words, no coloredgrid, no background, no halo or floor shadow. Preserve anatomy and identity; wardrobe only.
IMPORTANT final identity approval: preserve the rounder sturdy bobgirl, narrow-faced slim boy, smiling tall/slim ponygirl, reserved square-rounded athletic ponygirl exactly as this corrected source. The distinct face shapes and builds must NOT converge. Natural5.8–6head anatomy, no larger heads. No redesign.

## Exact final portrait prompt

Use case: identity-preserve. Targetimage1 is a sixteen-portrait4rows×4uniformcolumns atlas. Update ONLY each row's facial identity and appropriate shoulders/build to match the newly APPROVED TOPROW students of image2. Keep exactexisting16outfits, same4×4layout/waistupcrop, transparent background, no text.
Image2 top-row left-to-right maps to targetimage1 rows top-to-bottom, NOT columns. Repeat each canonical face consistently in all4uniformcolumns.
Row0程曉嵐: shortchinbob, rounderface, straightthickerbrows, compacthealthybuild, friendlywide smile; notchild.
Row1許晉言: shorttousledhair, narrowlongface, straightnose, slightlynarrowereyes, moreangularbrows, slenderboy; calm.
Row2沈樂葵: longponytail, longovalface, archedbrows, slightlywide-set brightalmond eyes, upturnednose, openlycheerful smile, slender highshoulders.
Row3韓芊澄: longponytail withfullfringe, distinctlysoftsquarejaw, lowstraightbrows, focusedroundereyes, fuller nose, reservedsmallsmile, broaderathleticshoulders. Do not clone row2face.
Keep same traditionalfinepixel-anime style; no coarse8bit, no blurry painterly effect. Detailed clear fullyOPAQUE faces/hair/clothes interiors. RealtransparentRGBA cutoutbackground, no glow, no grid, no shadow, no captions. Safe margin at headtop, wristsandshoulders, everyperson whollyinsidecell, no neighboringcell overlap. Faces are the MAINrequestedcorrection, closely match approvedfacialcloseups, not justdifferent expressions onidenticalhead. Keep outfits fromtargetcol0white/redbelt, col1striped/navytie, col2grey/burgundybelt, col3gingham andcorrespondingboyoutfits.

