# Leadership and support staff atlas

- Production file: `public/campus/images/life/staff-leadership.png`
- Layout: `resources/design/production-life/staff-leadership.layout.json`
- Built-in imagegen, one generation. Selected image copied unchanged; no Python pixel editing.
- Source: `/Users/jackho/.codex/generated_images/01a11b37-3623-7652-90a8-3813a11d2e1c/exec-4a80ad45-f9e2-4f19-9765-9e25e19861a9.png`
- Approved roster bottom row provides identities; walk-proportion-v3 provides body direction; academic B atlas provides pose/layout reference.
- Rows: principal, vice principal, school office clerk, new-student mentor. All 24 full bodies inspected, with contact and visibly bent-knee passing steps plus a separate conversation gesture. Actual RGBA alpha verified.
- Explicit measured bounds override nominal grid; stable per-identity standingHeight avoids scale oscillation. Stylized proportions and gait require runtime visual review; this is not a report of learner evaluation.

## Exact prompt

```text
Use case: stylized-concept.
Production transparent adult school staff sprite atlas. Exactly FOUR ROWS × SIX COLUMNS, 24 full-body sprites. Large portrait canvas with generous outer transparent margins and gaps. Include ALL hair, fingertips and shoe soles without clipping.
Reference1 approved Hong Kong school teacher roster: use its FOURTH/BOTTOM ROW four identities ONLY, in order. Reference2 approved walking body proportions: small heads, long natural adult limbs, about seven-head body height. Reference3 provides the consistent production atlas layout and pose rhythm, especially bent raised legs in passing columns; do not copy its identities.
CRITICAL ADULT ANATOMY: natural small heads (one seventh of full standing height), normal shoulders and hands, long legs; no chibi or large anime heads, no compressed torsos. Refined crisp fine pixel-art illustration, subtle restrained shading, warm friendly facial details. Same scale and wardrobe for every pose of each identity.

ROW1 Principal: older East Asian man, neatly swept gray hair, rectangular glasses, navy suit, white shirt, gold patterned tie, matching navy full-length trousers and black formal shoes. Match approved bottomrow first portrait.
ROW2 Vice principal: adult East Asian woman, short auburn side-swept hair, deep plum tailored jacket over cream collared blouse, plum straight full-length trousers, black low formal shoes. Match approved bottomrow second portrait.
ROW3 School office clerk: adult East Asian man, neat short black hair, rectangular glasses, light gray long-sleeved collared shirt, teal tie, small plain ID lanyard, charcoal straight full-length trousers, dark shoes. Match bottomrow third portrait.
ROW4 New-student mentor: adult East Asian woman, long dark brown hair in one side braid, peach cardigan over cream collared blouse, taupe straight full-length trousers, dark flat shoes. Match bottomrow fourth portrait.

SIX COLUMNS repeated for each identity, all facing RIGHT in side/slightthreequarter view and aligned foot baseline:
1 relaxed upright idle, hands relaxed, feet planted.
2 left-foot forward CONTACT step, rightfoot behind, opposite arm swing.
3 PASSING A: one leg vertical directly under hips, its foot flat; other leg knee sharply BENT with heel visibly lifted and lower leg trailing. Feet close together horizontally, NOT a V-stride.
4 right-foot forward CONTACT step, leftfoot behind; reversed opposite arm swing.
5 PASSING B: other leg supports vertically, opposite knee bent and raised heel; feet close together.
6 calm standing conversation, one forearm bent with a small open-palm explaining gesture.
Clear different limb poses: actual walking cycle not sliding duplicates; all characters capable of walking. Preserve head/body size and uniform design throughout row.

No handheld props, no books/notebooks/bags, no text/labels/numbers, no gridlines/panels/borders, no background/floor/shadows, no logos or watermark. Actual transparent RGBA alpha outside bodies. Keep 30+ transparent pixels around sheet edges, especially rightmost fingertips and bottomrow shoes.
```

