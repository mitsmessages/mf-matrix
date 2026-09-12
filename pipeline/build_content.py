"""
Content pipeline: transcripts -> curriculum model, with citations.

Two modes:

  # 1. Validate that every curriculum citation points at a real transcript.
  python pipeline/build_content.py --check

  # 2. Regenerate module drafts with an LLM (needs GEMINI_API_KEY).
  python pipeline/build_content.py --generate --transcripts content/transcripts

The masterclass transcripts are course IP and are NOT committed. Place them in
`content/transcripts/` locally (see .gitignore). The curated `src/data/curriculum.ts`
is hand-reviewed; this pipeline keeps it honest and reproducible.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

LECTURE_RE = re.compile(r"^(L\d+(?:-\d+)?)\s+(.*)$")
CITATION_RE = re.compile(r'lectureId:\s*"([^"]+)"')


def parse_srt(text: str) -> str:
    """Strip SRT indices and timecodes, return the spoken text."""
    lines = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.isdigit() or "-->" in stripped:
            continue
        lines.append(stripped)
    return " ".join(lines)


def read_lecture(path: Path) -> str:
    raw = path.read_text(encoding="utf-8", errors="ignore")
    if path.suffix.lower() == ".srt":
        return parse_srt(raw)
    return raw


def extract_lectures(transcripts_dir: Path) -> list[dict[str, Any]]:
    if not transcripts_dir.exists():
        return []
    files: dict[str, Path] = {}
    for path in sorted(transcripts_dir.iterdir()):
        if path.suffix.lower() not in {".txt", ".srt"}:
            continue
        match = LECTURE_RE.match(path.stem)
        if not match:
            continue
        lecture_id, title = match.group(1), match.group(2).strip()
        # Prefer .txt over .srt for the same lecture.
        if lecture_id in files and files[lecture_id].suffix == ".txt":
            continue
        files[lecture_id] = path

    manifest = []
    for lecture_id, path in files.items():
        text = read_lecture(path)
        match = LECTURE_RE.match(path.stem)
        title = match.group(2).strip() if match else path.stem
        manifest.append(
            {
                "lectureId": lecture_id,
                "title": title,
                "source": path.name,
                "chars": len(text),
                "words": len(text.split()),
            }
        )
    return manifest


def curriculum_citations(curriculum_path: Path) -> set[str]:
    if not curriculum_path.exists():
        return set()
    return set(CITATION_RE.findall(curriculum_path.read_text(encoding="utf-8")))


def check(transcripts_dir: Path, curriculum_path: Path, out: Path) -> int:
    manifest = extract_lectures(transcripts_dir)
    citations = curriculum_citations(curriculum_path)

    print(f"Found {len(manifest)} transcripts, {len(citations)} distinct citations.")
    if not manifest:
        print(
            "NOTE: no transcripts found. Drop course files into "
            f"{transcripts_dir} to enable citation validation."
        )
        return 0

    available = {m["lectureId"] for m in manifest}
    missing = sorted(citations - available)
    if missing:
        print("CITATION ERRORS — these lecture ids have no transcript:", file=sys.stderr)
        for m in missing:
            print("  -", m, file=sys.stderr)
        return 1

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"lectures": manifest}, indent=2) + "\n", encoding="utf-8")
    print(f"OK — all citations resolve. Manifest -> {out}")
    return 0


def generate(transcripts_dir: Path, out: Path, model: str) -> int:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: set GEMINI_API_KEY to generate drafts.", file=sys.stderr)
        return 1

    manifest = extract_lectures(transcripts_dir)
    if not manifest:
        print("ERROR: no transcripts to generate from.", file=sys.stderr)
        return 1

    drafts = []
    for entry in manifest:
        text = read_lecture(transcripts_dir / entry["source"])
        prompt = (
            "You are helping structure a mutual-fund masterclass into curriculum modules.\n"
            "Return STRICT JSON with keys: title, subtitle, category, keyInsights (3-5 strings), "
            "commonMistake, scientificSolution, practicalRule, formulas "
            "(array of {name, formula, description}).\n"
            f"Lecture id: {entry['lectureId']}\nTranscript:\n{text[:20000]}"
        )
        drafts.append({"lectureId": entry["lectureId"], "prompt": prompt, "model": model})

    # The actual API call is intentionally left as the only integration point.
    # Wire in your preferred client here; the structure above is what matters.
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        json.dumps({"model": model, "drafts": drafts}, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Wrote {len(drafts)} prompt drafts -> {out}")
    print("Review and merge the hand-curated src/data/curriculum.ts; never ship unreviewed copy.")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--transcripts", default="content/transcripts")
    ap.add_argument("--curriculum", default="src/data/curriculum.ts")
    ap.add_argument("--manifest-out", default="content/generated/lecture_manifest.json")
    ap.add_argument("--generate", action="store_true")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--model", default=os.environ.get("VITE_GEMINI_MODEL", "gemini-2.5-flash"))
    args = ap.parse_args()

    transcripts_dir = Path(args.transcripts)
    curriculum_path = Path(args.curriculum)
    out = Path(args.manifest_out)

    if args.generate:
        return generate(transcripts_dir, Path("content/generated/modules.generated.json"), args.model)
    return check(transcripts_dir, curriculum_path, out)


if __name__ == "__main__":
    raise SystemExit(main())
