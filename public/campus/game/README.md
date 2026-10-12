# Game source

This is the single maintained copy of the browser game's JavaScript and CSS. The public entry remains [`../index.html`](../index.html); students open the deployed `/campus/` URL, not this source folder.

| Files | Purpose |
|---|---|
| `app.js`, `campus-cloud.js` | Game state, panels, student progress and classroom synchronization |
| `engine.js`, `characters.js`, `campus-routines.js`, `campus-art.js` | Exploration, character identity, routines, animation and scenes |
| `content.js`, `subjects.js`, `grade-content.js` | Authored AI scenarios, learning spaces and generated starter questions |
| `teacher-ui.js`, `xlsx-export.js`, `worksheet-ui.js` | Teacher tools, student results and worksheets |
| `campus-audio.js`, `fixed-voices.js` | Fixed dialogue playback, strict language/gender matching and synthesized music |
| `*.css` | Shared pixel interface and responsive layouts |

JavaScript resource URLs are relative to `index.html`. CSS resource URLs are relative to this folder and use `../images/` or `../resources/`. Keep these bases distinct when adding a file. [`validate-resource-layout.mjs`](../../../scripts/validate-resource-layout.mjs) checks that deployed references resolve.

The editable question source is [`data/grade-bank.json`](../../../data/grade-bank.json), maintained with the [authoring scripts](../../../scripts/content-authoring/). Teacher-authored class questions and student records belong to the server database, not these public starter files.
