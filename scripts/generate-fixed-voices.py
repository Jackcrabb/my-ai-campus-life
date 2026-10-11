#!/usr/bin/env python3
"""Author fixed NPC MP3s; never run from the website or a teacher mutation.

Requires authoring-only edge-tts 7.2.8, ffmpeg and ffprobe. No API key, OpenRouter,
paid fallback or application dependency is used. The public Edge endpoint may
change or become unavailable; this script fails rather than switching providers.
Only exact cn/en fixed-dialogue corpus entries are accepted. Cantonese keeps the
existing device voice; academic questions/options/feedback are excluded upstream.

Approval here means live provider locale/gender metadata plus complete MP3 decode,
NOT an audible assessment. Review pronunciation in game when testing a release.
Run with --validate-only for an offline integrity check of a completed release.
Use --publish-cache to rebuild the manifest offline from fully verified MP3s.
"""
import argparse
import asyncio
import hashlib
import importlib.metadata
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
CORPUS = ROOT / "data/fixed-dialogue-corpus.json"
CACHE = ROOT / "data/fixed-voice-generation-cache.json"
MANIFEST = ROOT / "public/campus/fixed-voices.js"
PUBLIC = ROOT / "public/campus"
RATE, PITCH = "-8%", "+0Hz"
VOICE_CAST = {
    ("cn", "male"): ("zh-CN-YunxiNeural", "zh-CN", "Male"),
    ("cn", "female"): ("zh-CN-XiaoxiaoNeural", "zh-CN", "Female"),
    ("en", "male"): ("en-US-GuyNeural", "en-US", "Male"),
    ("en", "female"): ("en-US-JennyNeural", "en-US", "Female"),
}
REVIEW_BASIS = "provider locale/gender metadata and decoded full clip"


def digest(value):
    data = value if isinstance(value, bytes) else json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(data).hexdigest()


def atomic_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(path)


def load_lines():
    corpus = json.loads(CORPUS.read_text())
    if corpus.get("schemaVersion") != 1 or not isinstance(corpus.get("lines"), list) or not corpus["lines"]:
        raise ValueError("Expected a nonempty schemaVersion 1 fixed-dialogue corpus.")
    seen, lines = set(), []
    for item in corpus["lines"]:
        if not isinstance(item, dict) or set(item) != {"id", "characterId", "gender", "locale", "text"}:
            raise ValueError("Unexpected corpus fields; only exact fixed dialogue is accepted.")
        if not all(isinstance(item[k], str) for k in item):
            raise ValueError("All corpus fields must be strings.")
        if not re.fullmatch(r"[a-zA-Z0-9_-]{1,150}", item["id"]) or not re.fullmatch(r"[a-zA-Z0-9_-]{1,100}", item["characterId"]):
            raise ValueError("Invalid fixed-dialogue or character ID.")
        if (item["locale"], item["gender"]) not in VOICE_CAST or not 1 <= len(item["text"]) <= 5000 or item["text"] != item["text"].strip():
            raise ValueError("Unsupported locale/gender or invalid exact dialogue text.")
        identity = (item["characterId"], item["locale"], item["text"])
        if item["id"] in seen or identity in seen:
            raise ValueError("Duplicate fixed-dialogue ID or exact character/locale/text tuple.")
        seen.update((item["id"], identity))
        lines.append(item)
    return lines


def entry_for(line):
    voice, locale, gender = VOICE_CAST[(line["locale"], line["gender"])]
    source_hash = digest({**line, "voice": voice, "rate": RATE, "pitch": PITCH, "tool": "edge-tts 7.2.8"})
    return {**line, "voice": voice, "voiceLocale": locale, "speechLocale": locale, "voiceGender": gender,
            "rate": RATE, "pitch": PITCH, "sourceHash": source_hash,
            "src": f"assets/voices/{line['locale']}/{line['id']}-{source_hash[:12]}.mp3"}


def inspect_audio(path):
    if not path.is_file() or path.stat().st_size < 1000:
        raise ValueError(f"Missing or empty MP3: {path.name}")
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "null", "-"], check=True, capture_output=True, timeout=30)
    result = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_name,sample_rate,channels", "-of", "json", str(path)], check=True, capture_output=True, text=True, timeout=30)
    info = json.loads(result.stdout)
    streams = info.get("streams", [])
    duration = float(info.get("format", {}).get("duration", 0))
    if len(streams) != 1 or streams[0].get("codec_name") != "mp3" or duration <= 0:
        raise ValueError(f"Invalid audio format: {path.name}")
    return {"audioSha256": digest(path.read_bytes()), "durationSeconds": duration,
            "sampleRate": int(streams[0]["sample_rate"]), "channels": streams[0]["channels"]}


def verified_cache(entry, cached):
    if not isinstance(cached, dict) or any(cached.get(key) != value for key, value in entry.items()):
        raise ValueError(f"Stale or incomplete voice cache for {entry['id']}; inspect it before regenerating.")
    if cached.get("reviewBasis") != REVIEW_BASIS or cached.get("audiblyReviewed") is not False or cached.get("approved") is not True:
        raise ValueError(f"Missing technical review for {entry['id']}.")
    info = inspect_audio(PUBLIC / entry["src"])
    if any(cached.get(key) != value for key, value in info.items()):
        raise ValueError(f"MP3 checksum or decode metadata mismatch for {entry['id']}.")
    return cached


def write_manifest(clips):
    release = {"schemaVersion": 1, "sourceCorpusSha256": digest(CORPUS.read_bytes()), "reviewBasis": REVIEW_BASIS,
               "audiblyReviewed": False, "clips": clips}
    comment = ("/* Exact fixed NPC dialogue only; never academic questions/options/feedback.\n"
               " * Free authoring via edge-tts; gameplay only loads these local MP3 files.\n"
               " * approved means provider locale/gender metadata and complete MP3 decode.\n"
               " * No audible quality claim; Cantonese retains the original device voice.\n"
               " * Rebuild: scripts/generate-fixed-voices.py (authoring dependencies only).\n"
               " */\n")
    temporary = MANIFEST.with_suffix(".js.tmp")
    temporary.write_text(comment + "window.CAMPUS_FIXED_VOICES = Object.freeze(" + json.dumps(release, ensure_ascii=False, indent=2) + ");\n")
    temporary.replace(MANIFEST)


def release_clips(clips):
    result = []
    for clip in clips:
        prefix = {"cn": "欢迎入读明澄书院，新同学！", "en": "Welcome to Ming Ching College!"}[clip["locale"]]
        preview = clip["characterId"] == "staff-mentor" and clip["text"].startswith(prefix)
        result.append({**clip, **({"preview": True} if preview else {})})
    return result


async def generate(lines, cache):
    import edge_tts
    from edge_tts.drm import DRM
    if importlib.metadata.version("edge-tts") != "7.2.8":
        raise ValueError("This authoring workflow is verified with edge-tts 7.2.8 only.")

    def stop_on_block(error):
        raise error
    # Prevent the library's automatic 403 clock-skew retry. Never work around a block.
    DRM.handle_client_response_error = staticmethod(stop_on_block)
    voices = await asyncio.wait_for(edge_tts.list_voices(), timeout=30)
    inventory = {voice["ShortName"]: voice for voice in voices}
    for voice, locale, gender in set(VOICE_CAST.values()):
        item = inventory.get(voice, {})
        if item.get("Locale") != locale or item.get("Gender") != gender or item.get("Status") != "GA":
            raise ValueError(f"Voice unavailable or metadata changed: {voice}")
    print("Verified four live voice locale/gender pairs; generating with concurrency 2.", flush=True)
    queue = asyncio.Queue()
    for line in lines:
        queue.put_nowait(line)

    async def worker():
        while not queue.empty():
            line = queue.get_nowait()
            entry = entry_for(line)
            existing = cache["clips"].get(entry["sourceHash"])
            if existing:
                verified_cache(entry, existing)
                print(f"CACHE {line['locale']} {line['id']}", flush=True)
                continue
            target = PUBLIC / entry["src"]
            if target.exists():
                raise ValueError(f"Untracked MP3 already exists: {target.name}; inspect it first.")
            target.parent.mkdir(parents=True, exist_ok=True)
            temporary = target.with_suffix(".part.mp3")
            try:
                await asyncio.wait_for(edge_tts.Communicate(line["text"], voice=entry["voice"], rate=RATE, pitch=PITCH).save(str(temporary)), timeout=60)
                info = inspect_audio(temporary)
                temporary.replace(target)
                reviewed = {**entry, **info, "approved": True, "reviewBasis": REVIEW_BASIS,
                            "audiblyReviewed": False, "provider": "Microsoft Edge online text-to-speech",
                            "generatedAt": datetime.now(timezone.utc).isoformat(), "tool": "edge-tts 7.2.8"}
                cache["clips"][entry["sourceHash"]] = reviewed
                atomic_json(CACHE, cache)
                print(f"READY {len(cache['clips'])}/{len(lines)} {line['locale']} {line['id']} {info['durationSeconds']:.2f}s", flush=True)
            finally:
                temporary.unlink(missing_ok=True)

    # The first failure cancels the other in-flight worker and prevents new requests.
    async with asyncio.TaskGroup() as group:
        group.create_task(worker())
        group.create_task(worker())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument("--validate-only", action="store_true", help="Verify completed cache and MP3s offline; no generation.")
    modes.add_argument("--publish-cache", action="store_true", help="Rebuild the manifest from verified existing MP3s, offline.")
    args = parser.parse_args()
    for executable in ("ffmpeg", "ffprobe"):
        if not shutil.which(executable):
            raise ValueError(f"Authoring tool missing: {executable}")
    lines = load_lines()
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {"schemaVersion": 1, "clips": {}}
    if cache.get("schemaVersion") != 1 or not isinstance(cache.get("clips"), dict):
        raise ValueError("Invalid generation cache; inspect it before continuing.")
    if not args.validate_only and not args.publish_cache:
        asyncio.run(generate(lines, cache))
    clips = release_clips([verified_cache(entry_for(line), cache["clips"].get(entry_for(line)["sourceHash"])) for line in lines])
    if args.validate_only:
        content = MANIFEST.read_text()
        release = json.loads(content.split("Object.freeze(", 1)[1].rsplit(");", 1)[0])
        if release.get("clips") != clips or release.get("sourceCorpusSha256") != digest(CORPUS.read_bytes()):
            raise ValueError("Release manifest differs from the verified fixed corpus/cache.")
    else:
        write_manifest(clips)
    print(f"PASS {len(clips)} exact fixed-dialogue MP3s, checksum + full decode; audible review not claimed.")


if __name__ == "__main__":
    try:
        main()
    except BaseException as error:
        # Keep provider URLs/headers out of logs; the exception class/status suffice.
        failures = error.exceptions if isinstance(error, BaseExceptionGroup) else [error]
        for failure in failures:
            detail = str(failure) if isinstance(failure, ValueError) else f"HTTP {getattr(failure, 'status', 'n/a')}"
            print(f"STOP {type(failure).__name__}: {detail}", file=sys.stderr)
        sys.exit(1)
