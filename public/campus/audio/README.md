# Dialogue audio

[`voices/cn/`](voices/cn/) contains Mandarin MP3s and [`voices/en/`](voices/en/) contains English MP3s. The game loads only exact dialogue matches declared in [`game/fixed-voices.js`](../game/fixed-voices.js). The manifest records character identity, language, gender and file integrity.

Traditional Chinese retains device Cantonese read-aloud. Academic questions, answer choices and explanations are text-only, so teacher question edits do not require new recordings. The *Greensleeves* background arrangement is synthesized by the game rather than stored as a DSE examination recording.

Production details, validation limits and provenance are in the [speech-service guide](../../../docs/OPENROUTER-TTS-SERVICE.md) and [asset provenance](../../../ASSET-PROVENANCE.md). No API keys or student recordings belong in this folder.
