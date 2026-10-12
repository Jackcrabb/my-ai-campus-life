# Authored data

| File | Purpose |
|---|---|
| `grade-bank.json` | Canonical starter question bank across grades and subjects |
| `curriculum-alignment.json`, `curriculum-version.json` | Curriculum references and current authored-bank version |
| `starter-bank-previous-hashes.json` | Previous starter revision fingerprints used by safe updates |
| `fixed-dialogue-corpus.json` | Exact fixed dialogue exported from the runtime model; excludes academic questions and personal student data |
| `fixed-voice-generation-cache.json` | Reusable generated-file metadata and integrity values; contains no API keys |
| `voice-cast.json`, `voice-auditions.json`, `tts-script-catalog.json` | Internal voice-authoring direction and audition/catalog records |

The [content-authoring scripts](../scripts/content-authoring/) produce the public starter data in [`game/grade-content.js`](../public/campus/game/grade-content.js). The [dialogue exporter](../scripts/export-fixed-dialogue.mjs) checks spoken lines against the game. Student results, class-specific teacher questions and uploaded worksheets are stored by the classroom backend and are not committed here.
