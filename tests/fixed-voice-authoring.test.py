"""Offline authoring regressions. No provider requests or API credentials."""
import asyncio
import importlib.util
import json
from pathlib import Path
import tempfile
import types
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("fixed_author", Path(__file__).resolve().parents[1] / "scripts/generate-fixed-voices.py")
author = importlib.util.module_from_spec(spec)
spec.loader.exec_module(author)
LINE = {"id": "staff-principal-cn-example", "characterId": "staff-principal", "gender": "male", "locale": "cn", "text": "欢迎来到校园。"}


class FixedVoiceAuthoring(unittest.TestCase):
    def test_source_hash_changes_with_exact_text_and_gender(self):
        original = author.entry_for(LINE)
        self.assertNotEqual(original["sourceHash"], author.entry_for({**LINE, "text": "欢迎来到校园！"})["sourceHash"])
        self.assertNotEqual(original["sourceHash"], author.entry_for({**LINE, "gender": "female"})["sourceHash"])
        self.assertEqual(original["voice"], "zh-CN-YunxiNeural")
        self.assertEqual(original["speechLocale"], "zh-CN")

    def test_corpus_rejects_unsupported_language_and_arbitrary_fields(self):
        with tempfile.TemporaryDirectory() as directory:
            corpus = Path(directory) / "corpus.json"
            with patch.object(author, "CORPUS", corpus):
                for line in [{**LINE, "locale": "zh"}, {**LINE, "questionId": "q1"}, {**LINE, "text": " leading whitespace"}]:
                    corpus.write_text(json.dumps({"schemaVersion": 1, "lines": [line]}))
                    with self.assertRaises(ValueError):
                        author.load_lines()
                corpus.write_text(json.dumps({"schemaVersion": 1, "lines": [LINE, LINE]}))
                with self.assertRaises(ValueError):
                    author.load_lines()

    def test_cache_requires_matching_identity_checksum_and_decode(self):
        entry = author.entry_for(LINE)
        decoded = {"audioSha256": "valid-hash", "durationSeconds": 4.2, "sampleRate": 24000, "channels": 1}
        valid = {**entry, **decoded, "approved": True, "audiblyReviewed": False, "reviewBasis": author.REVIEW_BASIS}
        with patch.object(author, "inspect_audio", return_value=decoded) as inspect:
            self.assertEqual(author.verified_cache(entry, valid), valid)
            inspect.assert_called_once()
            for changes in [{"text": "A different line"}, {"audioSha256": "changed"}, {"approved": False}, {"reviewBasis": "guessed"}]:
                with self.assertRaises(ValueError):
                    author.verified_cache(entry, {**valid, **changes})
        with patch.object(author, "inspect_audio", side_effect=ValueError("Invalid audio format")):
            with self.assertRaises(ValueError):
                author.verified_cache(entry, valid)

    def test_preview_only_marks_exact_mentor_welcome(self):
        cn = {**LINE, "characterId": "staff-mentor", "text": "欢迎入读明澄书院，新同学！今天一起探索校园。"}
        en = {**cn, "locale": "en", "text": "Welcome to Ming Ching College! Explore the campus."}
        clips = author.release_clips([cn, en, {**cn, "characterId": "staff-principal"}, LINE])
        self.assertEqual([clip.get("preview", False) for clip in clips], [True, True, False, False])
        self.assertEqual(clips[0]["text"], cn["text"])

    def test_first_provider_failure_cancels_other_worker_without_retry(self):
        calls, cancellations = [], []
        fake = types.ModuleType("edge_tts")
        drm_module = types.ModuleType("edge_tts.drm")
        drm_module.DRM = type("DRM", (), {})

        async def list_voices():
            return [{"ShortName": name, "Locale": locale, "Gender": gender, "Status": "GA"} for name, locale, gender in author.VOICE_CAST.values()]

        class Communicate:
            def __init__(self, text, **_kwargs):
                self.text = text

            async def save(self, target):
                calls.append(self.text)
                Path(target).write_bytes(b"partial")
                try:
                    await asyncio.sleep(0 if len(calls) == 1 else 30)
                    raise RuntimeError("provider unavailable")
                except asyncio.CancelledError:
                    cancellations.append(self.text)
                    raise

        fake.list_voices, fake.Communicate = list_voices, Communicate
        with tempfile.TemporaryDirectory() as directory:
            with patch.dict("sys.modules", {"edge_tts": fake, "edge_tts.drm": drm_module}), patch.object(author.importlib.metadata, "version", return_value="7.2.8"), patch.object(author, "PUBLIC", Path(directory)):
                lines = [{**LINE, "id": f"line-{i}", "text": f"固定对白{i}"} for i in range(5)]
                with self.assertRaises(ExceptionGroup):
                    asyncio.run(author.generate(lines, {"schemaVersion": 1, "clips": {}}))
                self.assertLessEqual(len(calls), 2)
                self.assertEqual(len(cancellations), 1)
                self.assertEqual(list(Path(directory).rglob("*.mp3")), [])
                with self.assertRaises(RuntimeError):
                    drm_module.DRM.handle_client_response_error(RuntimeError("blocked"))


if __name__ == "__main__":
    unittest.main()
