# Map and quiz implementation QA

Date: 10 October 2026. Scope: approved map and question panels only; character artwork, world animation, audio and teacher workspace implementation are separate work.

**Source visual truth:** `resources/design/campus-life-review-v1/07-map-quiz-uniform-proposal.png` (1672 × 941 pixels). This is a two-panel proposal board, not a single runtime viewport. The user's later instruction replaces its horizontal floor tabs with a vertical selector: fifth physical level / 4F at the top, first physical level / ground floor at the bottom. No 5F or basement scene was added.

**Browser implementation:** `http://127.0.0.1:8771/campus/index.html`, separate local origin and browser tab from the user's active save. Desktop CSS viewport and screenshot: 1280 × 720. Mobile: 390 × 844. Screenshots use one image pixel per CSS pixel; no density resampling was needed. Compare the corresponding map and question regions, not the proposal board's surrounding title or its combined presentation layout.

Evidence:

- `tests/qa-artifacts/panels-map-desktop.jpg`
- `tests/qa-artifacts/panels-quiz-desktop.jpg`
- `tests/qa-artifacts/panels-map-mobile.jpg`
- `tests/qa-artifacts/panels-quiz-mobile.jpg`
- `resources/design/production-floorplans.md`: original generated asset, actual crop geometry and exact prompt.

## Findings and comparison history

All actionable P1/P2 findings below were corrected and recaptured.

1. **P1, inherited glass surface overrode the quiz frame.** The first desktop capture showed the old translucent rounded question body although the heading had the approved cream frame. Scoped `#modal` selectors now win over `ui-glass.css`'s portrait-dependent selectors. Latest desktop and mobile question captures show opaque cream, deep teal and gold.
2. **P2, selected answers changed height.** The legacy checked-radio rule added padding, moving the confirmation button when selecting an answer. The scoped checked option now keeps zero outer padding. Browser measurement after selecting an answer confirms all three short sample rows are 62px high.
3. **P2, compact question layout hid the main action unnecessarily.** Removed the duplicated generic room introduction from the question view and combined the teacher name and question title into one compact metadata row. The spoken teacher introduction and all explanatory feedback remain. In the desktop sample, all three options and the answer action are visible together; longer questions and feedback scroll inside the panel.
4. **P2, mobile header width inherited a desktop rule.** Its width was 76% rather than the full game panel. An equivalent-specificity mobile override restores full width with 8px side margins.
5. **P2, mobile portrait was positioned beneath the fixed top toolbar.** It now occupies a reserved area in the heading, outside the question text. Browser computed style confirms opacity `1` and mask `none`; the latest mobile image includes the entire head and upper body. No portrait watermark is used.
6. **Latest user direction, vertical physical floor order.** The selector now runs `4F, 3F, 2F, 1F, G`, labelled with both physical level and game floor. Room membership still comes from `CAMPUS_LOCATIONS`. Tests assert that order and the exact scene IDs on every floor.

## Required fidelity surfaces

- **Typography:** display headings use the project's available serif fallbacks, matching the proposal's formal school signage; option letters use Georgia and body copy keeps the readable existing system font. Chinese and English hierarchy, wrapping and radio labels were inspected. Larger-text rules are preserved for questions, options and explanatory notes.
- **Spacing and layout:** reused the existing pixel frame token, cream surfaces and restrained gold selected outlines. The question portrait has its own desktop column and a separate mobile header position. Standard buttons and map destinations remain keyboard focusable. The five-floor map uses a separate internal horizontal scroller on narrow screens and an explicit visible swipe instruction.
- **Colors and tokens:** use existing `--campus-ink`, `--campus-paper` and `--campus-gold`. Selected answers use pale green with a gold outline; feedback keeps distinct explanatory success/consideration states. Text and controls are opaque, without blur behind the quiz copy.
- **Image quality:** a new generated five-floor illustration replaces the old directory-card presentation. Each real room has discipline-specific props. Explicit crop geometry handles unequal generated panel gutters. No scene is fabricated to imitate the proposal grouping. Existing approved character assets are reused, with pixelated rendering and no opacity reduction; later artwork replacements are outside this QA scope.
- **Copy and content:** all new interface strings support Traditional Chinese, Simplified Chinese and English. All 18 actual locations remain reachable. The source board's sample question was not substituted for the game's existing curriculum content. The original evidence gate, options, repairs, subject answers and transfer question behavior remain.

The source and latest implementation images were opened together for a full-view comparison. Labels, frame edges, selected answer treatment and portrait separation were legible at the supplied sizes; browser bounding-box measurements supplemented the focused checks for row heights, portrait position and overflow. This is a region-level fidelity comparison because the source intentionally shows multiple screens on a single board.

## Verification

- Passed `node --check public/campus/game/app.js`.
- Passed `node tests/progression.test.cjs`, extended to cover all 18 map locations in all three locales, five physical levels in descending order, current-location state, travel, invalid floor rejection, keyboard wrap and 2–5 option presentation/selection.
- Passed `node tests/campus-integration.test.cjs`, including existing class assignments with 4/5 answer options.
- Passed `node tests/campus-teacher.test.cjs` and `node tests/campus-audio.test.cjs`.
- Browser: travelled through the map to mathematics; selected an answer and received the original wrong-answer explanation; retried; switched between all three languages; inspected selected row sizes.
- Mobile: `body.scrollWidth === innerWidth === 390`; English question panel `scrollWidth === clientWidth === 350`. Floorplan scroll moved to `scrollLeft: 390` without page overflow. This exercised horizontal scrolling through the browser; it was not a physical touchscreen test.
- Browser console error/warning check returned no entries.
- Temporary mobile viewport override was reset.

## Remaining notes

No student trial or full accessibility audit is claimed. The mini map is schematic. Smaller screens intentionally pan the illustrated floorplan rather than shrinking its controls below a useful touch size. Full project build/deployment belongs to the integrating parent task; none was performed here. No Git or Sites publishing occurred.

Implementation checklist: all scoped P1/P2 fixes applied; desktop/mobile evidence saved; navigation and answer regression checks passed; source art provenance recorded.

final result: passed

## Final visual integration and release checks — 10 October 2026

The map/quiz sections above are retained as historical, scoped QA. The current integrated direction is the user's selected **10a cream-enamel / deep-teal / gold** reference: [`10a-door-hud-selected-reference.png`](resources/design/campus-life-review-v1/10a-door-hud-selected-reference.png), with its authored proposal at [`10a-door-hud-cream-enamel.png`](resources/design/campus-life-review-v1/10a-door-hud-cream-enamel.png). This final pass supersedes the earlier serif-display typography note: headings/navigation now use licensed, locally bundled Fusion Pixel HK/SC fonts; long questions, explanations and teacher tools retain readable CJK sans-serif text.

The selected reference and final implementation screenshots were inspected together. [`campus-final-desktop.png`](tests/qa-artifacts/campus-final-desktop.png), captured at **1280 × 720**, shows a full-viewport campus behind individual cream/teal/gold HUD controls and room plaques mounted inside the upper door transom. The HUD wrapper is transparent; there is no opaque header rail or canvas inset. Controls reflow at this width while the room labels remain visible. The reference board's footer caption is presentation material and is not reproduced in the game.

Phone evidence is recorded in [`design/ui-qa-pixel/README.md`](resources/design/ui-qa-pixel/README.md). At **390 × 844**, the top location/language/audio row occupies 8–52px and two labelled 44px HUD rows occupy 57–148px. At **320 × 740**, a single row of six icons occupies 57–101px; each target measures approximately 48 × 44px and retains its accessible action name. Concise location labels fit, the score floats above the lower interaction area, and the checked first-floor door/stair plaques are unobstructed. Canvas top is 0 with full viewport height, and page width equals scroll width at both checked phone sizes. Evidence: [`390px Traditional Chinese`](resources/design/ui-qa-pixel/campus-mobile-390-zh.png) and [`320px English`](resources/design/ui-qa-pixel/campus-mobile-320-en.png). Temporary viewport overrides were reset.

A single coherent final automated pass used the bundled Node executable at `/Users/jackho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`:

- **Passed:** all **11** `tests/*.test.cjs` files via Node's test runner, including engine, progression, cloud adapter/integration, teacher/worksheet UI, audio logic and the 234-question curriculum bank.
- **Passed:** `tests/voice-generation.test.mjs` — cast, explicit locale mapping, 60 planned audition entries and revision invalidation. This is a dry run; no synthesis API was called.
- **Passed:** `tests/starter-update.test.mjs` — isolated D1 upgrade preserves teacher edits, archives and frozen activities.
- **Passed:** `tests/worksheet-backend.test.mjs` — isolated D1/R2 tests cover Unicode filenames, retryable deletion and the exact 5 MiB size boundary. Its one storage-outage error log is an expected failure-path fixture; the test exited successfully.
- **Passed:** `tests/backend.test.mjs` with the actual production starter bank, **134 assertions/API checks**, including identity, 24 classes, recovery, student isolation, authoritative grading, idempotency, AI cases, versioned assignments, results, conflict handling, CSRF, expiry and PIN rate limits.
- **Passed:** TypeScript `tsc --noEmit` and `git diff --check`.

**Final scoped result: passed.** No outstanding visual P1/P2 defect remains in the desktop and phone combinations checked here. This is not a student efficacy trial, full accessibility audit, physical touchscreen/notch matrix, audible voice-quality validation, or end-to-end validation of every native print dialog/printer. Browser-dependent speech limitations remain documented separately. No claim of generated production voice files, successful physical printing, final build or deployment is made by this QA pass; build/publication are the integrating task's next steps.
