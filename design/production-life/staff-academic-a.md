# Academic staff atlas A

- Production file: `public/campus/assets/life/staff-academic-a.png`
- Layout: `design/production-life/staff-academic-a.layout.json`
- Built-in imagegen, one generation; original copied unchanged. No Python or other pixel editing.
- Original: `/Users/jackho/.codex/generated_images/01a11b37-3623-7652-90a8-3813a11d2e1c/exec-6660378d-b58e-4791-95f5-a20306302770.png`
- References: approved `design/campus-life-review-v1/04-npc-roster.png` (first four identities) and `05-walk-proportion-v3.png` (body/pose direction).
- 1086 × 1448 RGBA; alpha range 0–255; 875,096 fully transparent pixels. 24 large isolated character components were measured at alpha >16. Each full body is visible.
- Rows: Chinese, English, Mathematics, Science; IDs `staff-chinese`, `staff-english`, `staff-maths`, `staff-chemistry`.
- Six poses per row: idle, left-contact, passing-a, right-contact, passing-b, explaining gesture. Generated gait poses are stylistic approximations and should be assessed in runtime for perceived stepping.
- Nominal 6×4 arrangement has varying gutters. Use explicit frame bounds, absolute head anchors and feet baselines, plus one fixed standingHeight per identity. Do not divide the sheet mechanically or normalize each pose by its own height.
- Visual inspection: identities, outfits and full bodies match the requested set; natural adult proportions remain stylized. Tiny saturated RGB fringes visible in raw transparent previews have alpha ≤2 and are effectively transparent when composited; alpha was preserved exactly.

## Exact prompt

```text
Use case: stylized-concept.
Asset type: production transparent pixel-art character sprite atlas for a Hong Kong school exploration game. This is a new sprite sheet derived from approved reference designs, not a poster or reference board.
Reference image 1: approved teacher roster. Preserve ONLY the first four teacher identities from its first row.
Reference image 2: approved natural body proportions, refined sprite illustration style, and walking mechanics. Adapt to ADULT teachers with approximately seven-head body height and long natural limbs; no chibi.

Create exactly 24 isolated full-body sprites in a perfectly regular 4-row by 6-column layout on a truly transparent background. Large output, preferably 1536 pixels wide by 2048 pixels tall or larger. Every cell has generous clear margins; no sprite overlaps another cell. All teachers face to the RIGHT, mostly side view with a slight three-quarter angle, including idle and conversation. All six poses of each identity maintain the same face, hair, outfit, scale and head-to-foot standing height.

Rows top to bottom:
Row 1 Chinese teacher: adult Hong Kong East Asian woman, chin-length black bob, cream collared blouse, muted plum cardigan, charcoal straight full-length trousers, black low shoes. Match the first teacher portrait in reference 1.
Row 2 English teacher: adult Hong Kong East Asian woman, long chestnut wavy hair, cream collared blouse, burgundy fitted jacket, dark brown straight full-length trousers, black low shoes. Match second portrait.
Row 3 Mathematics teacher: adult Hong Kong East Asian man, neatly short black hair, rectangular glasses, pale blue shirt with tie, navy knitted vest, charcoal straight full-length trousers, black shoes. Match third portrait.
Row 4 Science teacher: adult Hong Kong East Asian woman, black high ponytail, teal collared blouse, open white knee-length lab coat, dark navy straight full-length trousers, black low shoes. Match fourth portrait.

Columns left to right:
1 idle, relaxed upright stance, both feet planted.
2 walking left-foot CONTACT forward, right leg back, natural opposite arm swing.
3 walking PASSING A, weight-bearing leg under torso, other knee bent forward and heel raised.
4 walking right-foot CONTACT forward, left leg back, reversed opposite arm swing.
5 walking PASSING B, weight-bearing opposite leg under torso, other knee bent forward, clearly alternate to column3.
6 calm conversation, both feet planted, one forearm bent with a small open-palm explaining gesture.

Style: refined fine pixel art with small crisp pixel clusters, subtle restrained color shading, warm approachable faces; game sprite detail, not photorealism, not vector clip-art. No body enlargement between poses. Genuine alternate leg and arm poses, not sliding copies. No books, bags, large props, text, letters, frame numbers, captions, grid lines, borders, floor, shadows, scenery, watermark or logos. All pixels outside bodies must be actual zero alpha, no fake checkerboard. Keep full hair and shoes inside every cell.
```
