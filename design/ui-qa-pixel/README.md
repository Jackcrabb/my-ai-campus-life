# Pixel interface verification — 10 October 2026

This is scoped evidence for `public/campus/campus-pixel-ui.css` and its markup/assets. It is not a release or a claim that every game, account or audio flow has passed.

## Implemented direction

The user-selected cream-enamel / deep-teal / gold reference is implemented as individually framed floating controls. **There is no opaque header rail. The canvas and dialogue background occupy the full viewport.** `--pixel-header-space` affects panel layout only. Earlier exploratory canvas insets were removed after the user's correction; screenshots of that obsolete campus layout were discarded.

A centralized palette supplies the HUD, location badge, enrolment, role cards, progress records, settings, dialogue, sound controls, map, quizzes, worksheet tools and teacher component hooks. Display typography uses the locally bundled Fusion Pixel font; question/answer/feedback and long-form tools retain an 18px system CJK sans-serif stack. Buttons preserve at least 44px touch targets. Phones up to 420px wide use two 44px labelled action rows. On short phones (height 780px or less), a single row of six pixel icons preserves 44px targets and accessible action names. The star readout floats above the lower interaction hint.

## Actual checks

- Chrome desktop (1728px wide): title/new-role/student enrolment, Continue, campus HUD, settings, map and teacher-entry/error layout inspected. The revised full-canvas layout measured `top: 0`, canvas height `822`, viewport height `822`; HUD background was transparent.
- Chrome 390×844: campus HUD and subject progress records inspected; Traditional and Simplified Chinese labels render, the SC pixel font reported loaded, page scroll width equals viewport width.
- Chrome 320×740, English, final compact pass: all six icon actions measured 48.2×44px and retained their accessible names. The concise `1F · Corridor` badge ends at 52px; the action row ends at 101px, above the first-floor transom/stair plaque. Canvas top 0 / height 740; page width and scroll width both 320px.
- Chrome 390×844, Traditional Chinese, final compact pass: location/A/music row 8–52px; six labelled actions in two 44px rows occupy 57–148px. The first-floor stair plaque is unobstructed. Stars float 66px above the viewport bottom. Canvas remains top 0 and full viewport height.
- **PASS:** no floating-HUD overlap with the visible first-floor door/stair plaques in these two checked phone viewports. No header rail or canvas inset is used.
- Temporary browser viewport overrides were reset afterwards.
- `node tests/progression.test.cjs` passed after index changes.
- PostCSS parsed the new stylesheet successfully; `git diff --check` passed.
- The selected reference and rendered desktop screenshot were viewed together: cream panels, dark-teal text/controls, restrained gold trim, crisp pixel display text and a visible campus background match the approved direction. The score indicator is retained as a functional game element.

## Evidence

- `campus-desktop-zh.png`: full-canvas floating HUD, current theme.
- `campus-mobile-390-zh.png`: final 390px two-row HUD, concise location and unobstructed first-floor stair plaque. The SC font was checked in the earlier typography pass.
- `subjects-mobile-390-cn.png`: scrollable subject records on 390px.
- `campus-mobile-320-en.png`: final short-phone English icon row at 320px.
- `teacher-entry-desktop.png`: desktop teacher entry on the earlier static preview; its visible server error is expected there and is **not** evidence of successful authentication. The live backend is tested separately by the parent task.

## Integration limits

Authenticated teacher hub/CRUD/results, all quiz/evidence steps and worksheet upload/download are not exhaustively visually verified in this scoped pass. Their shared selectors have been themed; end-to-end checks belong to the main release QA.

The engine's final door plaques are anchored inside the upper transom. The final compact pass above resolves the previously identified overlap at 390×844 and 320×740. This evidence does not cover every device/notch/zoom combination; keep the safe-area-aware offsets and full-viewport canvas when extending responsive support.

## Licensed resources

- [Fusion Pixel provenance](../../public/campus/assets/fonts/fusion-pixel/SOURCE.md): official 2026.09.25 WOFF2 release, SIL Open Font License; primary and upstream notices included. HK and SC files total 823,060 bytes.
- [Pixelarticons provenance](../../public/campus/assets/icons/pixelarticons/SOURCE.md): official free MIT icon files, unchanged, with license and SHA-256 records. No paid icon or new JavaScript dependency was added.
