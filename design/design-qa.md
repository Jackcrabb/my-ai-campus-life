# My AI Campus Life — integration QA, 9 October 2026

## Approved reference and implementation

The owner approved `campus-life-review-v1/06-pixel-dialogue-audio-proposal.png` before the pixel dialogue and sound UI were implemented. The implementation preserves its cream paper, deep teal, gold detailing, stepped pixel corners, transparent character cutouts and A-then-music control order. Readable native CJK text replaces baked-in lettering. Start-menu Settings is disabled; in-game settings remain available.

## Verified integration

- Desktop: new-student setup, a class join, actual server-graded answer, progress after reload, teacher unlock and results view.
- Downloaded a real XLSX from the running D1-backed UI and independently reopened it with openpyxl. It contains 13 subject sheets and the exact headers `班別`, `學號`, `學生姓名`, `學科得分`. The test student's row is present; incomplete subjects remain blank. Test identifiers and exports are excluded from this repository.
- Phone viewport 390×844: page scroll width390, game-frame bounds0,0,390,844. No horizontal overflow or unused page area below the game. The enlarged world characters and transparent dialogue crop were visually checked.
- Dialogue and audio controls remain inside the game. Text wraps and the audio panel scrolls when necessary. Language controls stay visible. Desktop browser console error log was empty during the final layout check.
- Runtime uses eight player atlases and five corrected NPC atlases. All20interactive NPC identities share world/dialogue source art. NPC movement, states, printers, 18scene scales and same-identity crops are covered by component checks; see `../tests/campus-component-qa.md`.
- Current source passes content, subjects, grade-bank, progression, cloud-client, integration, engine, teacher and audio suites. The real isolated D1 suite passes112 assertions/API checks. TypeScript no-emit check passes.

## Screenshots

- [Desktop dialogue](qa-life/dialogue-desktop.jpg)
- [Phone dialogue](qa-life/dialogue-mobile.jpg)
- [Phone campus scale](qa-life/campus-mobile.jpg)
- [Desktop audio controls](qa-life/audio-desktop.jpg)
- [Phone audio controls](qa-life/audio-mobile.jpg)

These are actual browser captures, not ImageGen previews. Older screenshots under `qa/` document previous iterations and do not represent this release.

## Material limitations

Speech selection is correct by locale, but full audible three-language completion failed verification in the in-app browser. Music generated measurable nonzero output after its gain adjustment. Neither result establishes a physical listening test. Read `../KNOWN-LIMITATIONS.md` for precise observations; do not describe browser speech as fully fixed or prerecorded character audio.

No physical-phone test, learner pilot or full accessibility audit was performed. Walk cycles use four drawn key poses. Questions are curated starters, not full curriculum coverage. Production access, D1 migration and deployment are checked separately after publication.
