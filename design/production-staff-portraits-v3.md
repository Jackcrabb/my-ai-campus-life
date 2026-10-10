# Staff dialogue portraits v3

Generated with the built-in image_gen tool on 2026-10-10. These are higher-detail waist-up portraits of the sixteen existing staff identities; they do not replace or alter world walking atlases.

## Delivered files

- [Atlas A](../public/campus/assets/life/staff-portraits-v3-a.png): Chinese, English, Maths, Chemistry; Geography, Computer, History, Art.
- [Atlas B](../public/campus/assets/life/staff-portraits-v3-b.png): Music, Library, Rooftop/Ecology, PE; Principal, Vice-principal, Office, Mentor.
- [Measured crop metadata](production-staff-portraits-v3.json): sixteen canonical IDs with source, crop x/y/w/h and actual sheetWidth/sheetHeight.

Both delivered originals are 1448 × 1086 RGBA pixels. The prompts requested a larger canvas, but the measured output is authoritative. Each has four columns and two rows; vertical row spacing is not exactly equal, so consumers must use the supplied individual crop rectangles. Alpha was preserved exactly: empty background is transparent and most character-interior pixels have alpha253 (99.2%), rather than claiming every pixel is255. No post-processing or hand-drawn replacement was applied.

## Visual inspection

The outputs were inspected as complete sheets against all four canonical v2 staff references. Hair, clothing, glasses and role order are retained; faces are larger and more detailed than the walking atlas frames. Atlas A received a composition-only imagegen correction because the first generation placed extended arms too close to neighbouring portraits. The corrected atlas and Atlas B have separable waist-up silhouettes and no captions or backplates. Real integration at dialogue display sizes remains the frontend owner's verification step.

The result retains the project's clean illustrated character style with fine shaded details; it is not a low-resolution block-pixel conversion. Head proportions remain natural for waist-up adult portraits. Library and Principal retain silver hair and glasses; the history teacher retains salt-and-pepper hair and beard.

## References and generation record

- [Academic A v2](../public/campus/assets/life/staff-academic-a-v2.png)
- [Academic B v2](../public/campus/assets/life/staff-academic-b-v2.png)
- [Community v2](../public/campus/assets/life/staff-community-v2.png)
- [Leadership v2](../public/campus/assets/life/staff-leadership-v2.png)
- [Approved proportion reference](campus-life-review-v1/05-walk-proportion-v3.png)

Built-in generation session: `01a11b37-3623-7652-90a8-3813a11d2e1c`.
Initial Atlas A draft: `exec-ab23e2dd-abcb-4e3f-9658-2dcb8e2cd82a.png` (not used at runtime).
Final Atlas A: `exec-f2e2ea5e-dcb6-451c-ac29-51041c416a52.png`.
Final Atlas B: `exec-b0c5fea0-96a8-49a1-89ca-e56ad923b1d2.png`.
Original generated files remain at the built-in generation destination; selected originals were copied unchanged into the public assets directory. SHA-256 values are in the metadata.

## Exact prompt — Atlas A initial

Use case: identity-preserve. Asset type: production game dialogue portrait atlas, transparent PNG, eight original Hong Kong school staff.
Transform the eight unique staff identities in reference images 1 and 2 into ONE high-resolution WAIST-UP dialogue portrait atlas with exactly FOUR columns by TWO rows. Image1 supplies the first four identities (one per source row), image2 supplies the next four identities. Image3 supplies the approved elegant natural human anatomy and fine illustrated game style; do not copy its school pupils or text.
Composition: requested canvas 2048x1536, eight equal512x768cells, each completely separate with generous transparent margins. Each adult is centered in own cell and visible from top of hair to just below waist including both full shoulders and relaxed forearms/hands. Friendly calm conversational poses, slight three-quarter view toward viewer, distinct clear eyes/brows/nose/mouth, gentle attentive expression. Highest face detail, crisp clean contours and restrained fine pixel-style shading suitable for a polished 2D campus visual novel. Natural adult head-to-body anatomy; head not oversized, no chibi, no childlike adults. Each portrait should fit inside its own cell, aligned head top near60px and waist baseline near710px. Never merge or crop hair/arms into adjacent cells.
Exact row-major order:
Top row col1 staff-chinese: East Asian adult woman, short black chin-length rounded bob with slight side fringe, plum cardigan over ivory collared blouse, dark trousers, no glasses. Same identity as image1 row1.
Top row col2 staff-english: East Asian adult woman with long loose chestnut-brown wavy hair, burgundy jacket/cardigan over ivory blouse, no glasses. Same identity as image1 row2.
Top row col3 staff-maths: East Asian adult man short neat black hair and rectangular dark glasses, navy sweater vest with subtle knit texture over pale blue collared shirt, navy tie. Same identity as image1 row3.
Top row col4 staff-chemistry: East Asian adult woman dark long high ponytail and fringe, white laboratory coat over teal collared blouse, no glasses. Same identity as image1 row4.
Bottom row col1 staff-geography: brown-skinned adult man with dark wavy hair, beige rolled-sleeve overshirt over dark green polo, no glasses/beard. Same identity as image2 row1.
Bottom row col2 staff-computer: East Asian adult woman with black asymmetrical chin-length bob, cobalt-blue collared blouse under charcoal waistcoat, plain staff lanyard, no readable text. Same identity as image2 row2.
Bottom row col3 staff-history: middle-aged man with salt-and-pepper short hair and close beard, brown corduroy jacket over cream collared shirt. Same identity as image2 row3.
Bottom row col4 staff-art: brown/dark-skinned adult woman curly dark bun, mustard yellow apron with small pastel paint marks over teal blouse. Same identity as image2 row4.
Preserve all eight separate existing identities, gender, age cues, hair shape, glasses, clothing colors. Do not invent jewelry or change uniforms. Refine facial resolution instead of using tiny full-body sprites. Fully opaque skin, eyes, hair and clothing, true alpha transparent background outside silhouettes. No background panels, no frames, no grid lines, no cell boxes, no shadows behind characters, no text, no names, no logo, no watermark. All8characters exactlyonce.

## Exact prompt — Atlas A composition correction

Use case: identity-preserve. Edit this exact eight-person portrait atlas. Keep all eight faces, hairstyles, genders, age cues, skin tones, glasses and outfits unchanged. Keep the same sharp detailed illustrated game style. Fix ONLY composition for reliable independent sprite cropping: exactly FOUR equal columns by TWO equal rows on a 2048x1536 landscape canvas. Shrink each waist-up person within their own equal cell so there is at least 50 pixels of completely transparent gutter on every side of every person, including a wide transparent horizontal gap between the top and bottom rows. Every cell must be an independent rectangular portrait crop; do not allow any arm, hand, hair or clothing to extend into its neighbour's cell. Relax all raised/extended hands close to the person's torso; both shoulders and full head stay visible. Crop each figure cleanly just below the waist INSIDE its cell, with transparent space below. Eight people in exactly the same row-major order. Preserve natural adult anatomy, do not enlarge heads. High facial detail. True alpha-transparent background, fully opaque character pixels. No boxes, no grid lines, no text, no labels, no background/backplate. This is a technical atlas layout correction, not new character design.

## Exact prompt — Atlas B

Use case: identity-preserve. Asset type: transparent high-resolution waist-up dialogue portrait atlas for existing original Hong Kong school staff. Create exactly EIGHT adult staff portraits in a FOUR columns by TWO rows atlas.
Reference image1 supplies four canonical characters one per row: Music, Librarian, Ecology/Rooftop, PE. Reference image2 supplies four more one per row: Principal, Vice-principal, Office clerk, Mentor. Reference image3 is the completed companion portrait atlas: match its exact high facial detail, natural adult proportions, fine clean illustrated game style and generous transparent separation. Do not copy its eight identities.
Requested2048x1536canvas; each equal cell512x768. Every person centered within own equal cell with at least50pixels transparent margins on all four sides. Visible from entire topofhair down to just below waist, both full shoulders and forearms/hands visible, no legs. All forearms/hands relaxed close to torso so independent rectangular crops cannot overlap adjacent portraits. Wide transparent horizontal row gap. Gentle calm attentive conversational faces with clear eyes, eyebrows, nose, mouth, mature age cues. Natural adult anatomy, shoulders wide enough, no oversized heads, no chibi or adolescent-looking seniors.
Exact row-major order:
Toprow col1 staff-music: EastAsian adult man, dark centre-part medium-shorthair, dusty mauve cardigan over ivory collaredshirt, dark trousers, no glasses. Preserve image1 row1identity.
Toprow col2 staff-library: older EastAsian woman, short silver/graybob, rounddarkglasses, sagegreen knittedvest over ivory collaredblouse, olive trousers. Preserve image1 row2identity, unmistakably mature olderadult with subtle face lines, not childlike.
Toprow col3 staff-rooftop: youngadult EastAsian man, tousleddarkhair, subtle freckles, oliveutilityvest over pale yellow short-sleevedT-shirt, no glasses/beard. Preserve image1 row3identity.
Toprow col4 staff-playground: brown/darkskinned athletic adult man, very shortneat darkhair, whitePEpolo with darkgreen shoulders/sleeves/collar, whistle on blackneckcord, darkgreen tracktrousers. Preserve image1 row4identity.
Bottomrow col1 staff-principal: older EastAsian man, neat grayhair, rectangular darkglasses, navysuit, whitecollaredshirt, goldtie. Preserve image2 row1identity, mature distinguished face.
Bottomrow col2 staff-vice: middle-aged EastAsian woman, short auburn side-swepthair, plum suitjacket over ivory collaredblouse, plum trousers, no glasses. Preserve image2 row2identity.
Bottomrow col3 staff-office: EastAsian adult man, shortdarkhair and rectangular blackglasses, palegrayblue collaredshirt with teal tie, staffID lanyard, darktrousers, no jacket. Preserve image2 row3identity.
Bottomrow col4 staff-mentor: EastAsian adult woman, longdarkhair worn in one sidebraid over shoulder with soft fringe, peach cardigan over ivory blouse, taupetrousers, no glasses. Preserve image2 row4identity.
Allcharacters exactly once. Preserve gender, age, hair, glasses, skin tone, clothes and accessories of canonical staff. Only create clearer, larger waist-up dialogue illustrations, not redesigned characters. Fully opaque characters, true alpha transparency outside silhouettes. No backplates, background, cells, gridlines, shadows behind figures, captions, text, labels, logos, watermark. Clean flat waist cut inside eachcell with empty transparent margin below.

