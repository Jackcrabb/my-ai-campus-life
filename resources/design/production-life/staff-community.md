# Community staff atlas

- Production file: `public/campus/images/life/staff-community.png`
- Layout: `resources/design/production-life/staff-community.layout.json`
- Built-in imagegen, one generation. Selected output copied unchanged; no Python pixel editing.
- Source: `/Users/jackho/.codex/generated_images/01a11b37-3623-7652-90a8-3813a11d2e1c/exec-36006755-3444-4506-9a75-7873e0d72cb4.png`
- Reference identities: approved roster third row. Body direction: approved walk-proportion-v3. Pose layout: staff-academic-b production atlas.
- Rows: music, librarian, ecology, PE. All 24 full bodies visually inspected; idle, contact, bent-knee passing, contact, bent-knee passing, conversation sequence. Real alpha verified; explicit frame bounds prevent irregular gutters from contaminating adjacent sprites.
- Apply one standingHeight scale per identity. Stylized proportions and gait still require runtime review; no learner testing implied.

## Exact prompt

```text
Use case: stylized-concept.
Production transparent sprite atlas for a Hong Kong school game. Exactly FOUR ROWS × SIX COLUMNS, 24 full-body sprites. Large portrait canvas with generous outer transparent margins and gaps; fit ALL hair, fingertips and shoe soles, no cropping.
Reference1: approved teacher roster. Use the THIRD ROW identities ONLY, four in order. Reference2: strict natural body proportions, small heads and long adult legs, around seven heads tall. Reference3: the exact production atlas layout and six-pose gait vocabulary to match, including visibly bent raised legs in passing columns. Do not copy reference3 identities. Adults, not chibi; head including hair approx one seventh of full height; slender natural torsos, long limbs, restrained fine pixel detail. Same body scale across all six poses of each person.

ROW1 music teacher: adult East Asian man with medium-length black center-part hair, off-white collarless shirt, muted mauve cardigan, charcoal straight full-length trousers, black low shoes. Match roster thirdrow first portrait.
ROW2 librarian: older East Asian woman with silver bob and round thin glasses, cream collared shirt, sage-green knitted vest, dark olive straight full-length trousers, dark flat shoes. Match thirdrow second portrait.
ROW3 ecology teacher: young-adult East Asian man with tousled black hair and a few freckles, pale yellow shirt, olive field vest with pockets, dark olive straight full-length trousers, brown walking shoes. Match thirdrow third portrait.
ROW4 physical education teacher: athletic adult man with deep brown skin and close-cropped dark hair, white polo with dark green shoulders/sleeves, dark green full-length sports trousers, dark trainers, plain whistle lanyard. Match thirdrow fourth portrait.

Each six-pose row faces RIGHT, side/slight3quarter angle. Column1 relaxed upright idle. Column2 walking left-foot forward ground contact, rightfoot behind, opposite arm swing. Column3 PASSING A: one leg VERTICAL under hips foot flat, other knee sharply BENT, heel raised, feet horizontally close together; NOT V-stride. Column4 walking right-foot forward ground contact, leftfoot behind, reversed arm swing. Column5 PASSING B: other leg vertical supporting, opposite knee bent and heel raised, feet close together. Column6 standing gentle conversation with one forearm bent and small open-palm gesture. Clear meaningful changes in legs AND arms; avoid duplicates. All six poses consistent head/body/wardrobe. Walking speed natural, not a run.
No props/books/instruments/backpacks, no labels/text/numbers, no panels/grid/borders, no background/floor/shadows, no logos/watermark. Actual transparent RGBA outside characters, not a checkerboard. Keep each row aligned at its own foot baseline. Preserve natural small-head proportion especially older librarian and athletic teacher.
```

