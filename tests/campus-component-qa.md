# Campus engine and teacher workspace verification

Verified locally on 2026-10-09. These are developer checks with fictional fixtures, not a student learning trial. No deployment was performed by this component task.

## Automated checks

- `node tests/campus-engine.test.cjs`: shared identity and portrait consistency; all 20 NPCs and all background actors have actual walking frames; all eight wardrobe atlases have valid source crops; 18 locations and five floors; 13 classroom printers; fixed scale across poses; distance-driven gait and acceleration/recovery; bounded wandering; stop/converse/neutral transitions; explicit click intent; ground taps never open dialogue; E interaction; Space/Enter doors; cleanup and independent engine instances.
- `node tests/campus-teacher.test.cjs`: server session gate; no automatic class creation; explicit 24-class setup; same-origin authenticated requests; trilingual labels; revision-aware question edits; archive/new-activity confirmations; historic assignment scope; empty results; printer entry opens Results with its subject selected; no PIN echoed into markup; event cleanup.
- Syntax checks passed for `characters.js`, `engine.js`, `teacher-ui.js` and `xlsx-export.js`.
- The generated XLSX was opened independently with Python `zipfile` and `openpyxl`: valid ZIP container, exact four result headers, student number `01` remains text, an incomplete score stays blank, zero remains numeric, and formula-looking names remain strings.

## Browser observations

- Desktop engine fixture at 1280 × 720: deliberate click on the Chinese teacher caused the player to approach and emitted `subject:chinese`; the teacher stopped and used the dedicated gesture frame. Ending conversation restored the neutral stance. Other actors continued their bounded walking/rest cycles. No console warnings or errors were recorded.
- Characters use measured door-leaf references for all 18 locations, excluding transoms. Students use 82% and adults 89% of the reference height. Hall and playground references represent the foreground walking plane because their illustrated doors are distant. Aspect ratio is preserved, and hit areas, head markers and stride length use the same world height.
- All 20 neutral/talk portrait pairs were inspected on both pale and dark backgrounds. They use the same corrected source identity as the world sprite. No visible red/blue fringe appeared in the composed portraits or classroom scene.
- All eight outfits were inspected with the original, medium and dark skin choices in idle and contact poses. Only verified exposed-skin regions are transformed at runtime; hair, clothing, belts, socks and shoes retained their colors. Original PNGs are unchanged.
- Teacher workspace fixture: Chinese, Simplified Chinese and English forms were exercised, including entering a complete three-language question; class controls, empty results, lock/unlock and locale changes were checked. At 390 × 844 the document had no horizontal overflow. This fixture uses an in-memory API transport and does not demonstrate production authorization.
- The latest enlarged world scene was checked on desktop. Mobile full-game scene/dialogue verification is owned by the main integration task; this task did not change the shared browser viewport during the main task's mobile checks.

## Evidence

- `qa-artifacts/engine-chinese-desktop.png`
- `qa-artifacts/engine-talking-desktop.png`
- `qa-artifacts/npc-portraits-desktop.png`
- `qa-artifacts/skin-uniform0.png` through `skin-uniform3.png`
- `qa-artifacts/teacher-desktop.png`
- `qa-artifacts/teacher-mobile.png`

Fixtures are outside the deployed `public` directory. Serve the repository root locally and open `tests/campus-engine-preview.html`, `tests/campus-portraits-preview.html`, `tests/campus-skin-preview.html?uniform=0` (0–3), or `tests/campus-teacher-preview.html`.

## Practical limits

- Each production walk cycle contains four distinct drawn keys. It is not an eight-drawing animation. Distance-based playback and fixed per-identity scale prevent pose-height stretching, but this is stylized animation rather than a physically simulated foot-contact rig.
- Every production character has a real atlas. The procedural loader/error fallback remains available if an image cannot load, so missing files do not crash the game; it is not used as a substitute for a completed character asset.
- A future replacement sprite sheet needs its own measured crop/standing geometry and visually checked exposed-skin regions. Existing masks must not be applied blindly to unrelated artwork.
- Teacher results and access control require the server API. Browser fixture success is not a substitute for the main task's real-backend end-to-end checks.
