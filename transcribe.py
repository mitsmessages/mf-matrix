"""
Video Extracter - transcripter
Usage:
  python transcribe.py input.mp4
  python transcribe.py input.mp3 --model small --language en
  python transcribe.py ./downloads --model base

Input can be a single audio/video file OR a folder.
Output: <name>.txt + <name>.srt next to input (or in --output-dir).

No need to watch the full video - transcription runs faster than realtime on CPU
with int8, and much faster on GPU.
"""
import argparse
import sys
from pathlib import Path

AUDIO_EXTS = {".mp3", ".wav", ".m4a", ".ogg", ".flac", ".aac", ".wma", ".opus"}
VIDEO_EXTS = {".mp4", ".mkv", ".webm", ".mov", ".avi"}
ALL_EXTS = AUDIO_EXTS | VIDEO_EXTS


def to_srt_time(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def transcribe_one(model, src: Path, out_dir: Path, language: str | None, task: str = "transcribe"):
    from faster_whisper import WhisperModel  # noqa (model already loaded, just typing)

    print(f"\n>>> Transcribing: {src.name}")
    segments, info = model.transcribe(
        str(src),
        language=language,  # None = auto-detect
        task=task,
        beam_size=5,
        vad_filter=True,  # skip silence -> faster + cleaner
        vad_parameters=dict(min_silence_duration_ms=500),
    )

    segs = list(segments)  # must materialize to write files
    print(f"    detected language: {info.language} (p={info.language_probability:.2f}), "
          f"duration: {info.duration:.1f}s, segments: {len(segs)}")

    out_dir.mkdir(parents=True, exist_ok=True)
    txt_path = out_dir / (src.stem + ".txt")
    srt_path = out_dir / (src.stem + ".srt")

    with open(txt_path, "w", encoding="utf-8") as f:
        for seg in segs:
            f.write(seg.text.strip() + "\n")

    with open(srt_path, "w", encoding="utf-8") as f:
        for i, seg in enumerate(segs, 1):
            f.write(f"{i}\n{to_srt_time(seg.start)} --> {to_srt_time(seg.end)}\n"
                    f"{seg.text.strip()}\n\n")

    print(f"    wrote: {txt_path.name} + {srt_path.name}")
    return txt_path, srt_path


def main():
    ap = argparse.ArgumentParser(description="Transcribe audio/video to TXT+SRT (faster-whisper, offline)")
    ap.add_argument("input", help="audio/video file or folder")
    ap.add_argument("--model", default="small",
                    choices=["tiny", "base", "small", "medium", "large-v3"],
                    help="tiny/base=fastest, small=balanced (default), large-v3=best")
    ap.add_argument("--language", default=None,
                    help="e.g. en, hi. Default: auto-detect (best for Hinglish/English course)")
    ap.add_argument("--output-dir", default=None, help="where to write .txt/.srt (default: alongside input)")
    ap.add_argument("--device", default="auto", choices=["auto", "cpu", "cuda"],
                    help="auto = cuda if available else cpu")
    ap.add_argument("--translate", action="store_true",
                    help="translate to English instead of transcribe (for Hindi audio)")
    args = ap.parse_args()

    src = Path(args.input)
    if not src.exists():
        print(f"ERROR: not found: {src}", file=sys.stderr)
        sys.exit(1)

    if src.is_dir():
        files = sorted(p for p in src.iterdir() if p.suffix.lower() in ALL_EXTS)
        if not files:
            print(f"ERROR: no audio/video files in {src}", file=sys.stderr)
            sys.exit(1)
        default_out = src
    else:
        if src.suffix.lower() not in ALL_EXTS:
            print(f"WARNING: unusual extension {src.suffix}, trying anyway...")
        files = [src]
        default_out = src.parent

    out_dir = Path(args.output_dir) if args.output_dir else default_out

    # device / compute type
    device = args.device
    if device == "auto":
        try:
            import torch
            device = "cuda" if torch.cuda.is_available() else "cpu"
        except ImportError:
            device = "cpu"
    compute = "float16" if device == "cuda" else "int8"
    print(f"Loading model '{args.model}' on {device} ({compute})... (first run downloads ~0.5-3GB)")

    from faster_whisper import WhisperModel
    model = WhisperModel(args.model, device=device, compute_type=compute)

    task = "translate" if args.translate else "transcribe"
    for f in files:
        transcribe_one(model, f, out_dir, args.language, task)

    print("\nDone.")


if __name__ == "__main__":
    main()
