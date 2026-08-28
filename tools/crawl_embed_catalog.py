"""Resolve classroomgame.github.io embed targets from a local shallow clone."""
from __future__ import annotations
import argparse
import json
import re
from pathlib import Path

PATTERNS = [
    r'data-embed="([^"]+)"',
    r'<iframe[^>]+src="([^"]+)"',
    r"<iframe[^>]+src='([^']+)'",
    r'src="([^"]+)"',
    r"src='([^']+)'",
    r'href="([^"]+)"',
]


def first_target(html: str) -> str:
    for pattern in PATTERNS:
        match = re.search(pattern, html, re.I)
        if match:
            url = match.group(1)
            if url.startswith("/embed/"):
                url = "https://classroomgame.github.io/" + url.lstrip("/")
            elif url.startswith("/"):
                url = "https://classroomgame.github.io" + url
            if url and url not in ("about:blank", "#"):
                return url
    return ""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--src", required=True, help="Path to classroomgame.github.io repo checkout")
    parser.add_argument("--out", default="docs/embed-catalog-2026-08-28.tsv")
    args = parser.parse_args()

    root = Path(args.src)
    files = sorted((root / "embed").glob("*.html"))
    rows = []
    no_target = []
    for file in files:
        html = file.read_text(encoding="utf-8", errors="replace")
        target = first_target(html)
        if target:
            rows.append((file.name, "OK", target))
        else:
            no_target.append(file.name)
            rows.append((file.name, "NO_TARGET", ""))

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8", newline="\n") as handle:
        handle.write("embed_name\tstatus\ttarget\n")
        for name, status, target in rows:
            handle.write(f"{name}\t{status}\t{target}\n")

    statuses = {"OK": sum(1 for _, status, _ in rows if status == "OK"), "NO_TARGET": len(no_target)}
    print(f"embed_files={len(files)} statuses={json.dumps(statuses)}")
    print(f"written={out}")
    for name, status, target in rows[:40]:
        print(f"{name}\t{status}\t{target}")
    if no_target:
        print("no_target_sample=" + ",".join(no_target[:20]))


if __name__ == "__main__":
    main()
