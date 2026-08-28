"""Compare the 420 embed catalog with the 30 current iframe sources."""
from __future__ import annotations
import re
from pathlib import Path


def norm(url: str) -> str:
    return url.strip().rstrip("/").lower().replace("https://", "").replace("http://", "")


def main() -> None:
    data = Path("tools/game-pages-data.mjs").read_text(encoding="utf-8")
    current = sorted({norm(url) for url in re.findall(r'embedUrl:\s*"([^"]+)"', data)})
    catalog = []
    with Path("docs/embed-catalog-2026-08-28.tsv").open(encoding="utf-8") as handle:
        header = handle.readline()
        for line in handle:
            parts = line.rstrip("\n").split("\t")
            if len(parts) >= 3:
                catalog.append({"name": parts[0], "status": parts[1], "target": parts[2]})
    remaining = [row for row in catalog if norm(row["target"]) not in current]
    by_host: dict[str, int] = {}
    for row in remaining:
        host = norm(row["target"]).split("/")[0]
        by_host[host] = by_host.get(host, 0) + 1
    print(f"catalog={len(catalog)} current_targets={len(current)} remaining={len(remaining)}")
    print("current_targets:")
    for url in current:
        print("  " + url)
    print("remaining_hosts=" + str(sorted(by_host.items(), key=lambda x: -x[1])[:20]))
    with Path("docs/embed-remaining-2026-08-28.tsv").open("w", encoding="utf-8", newline="\n") as handle:
        handle.write("embed_name\tstatus\ttarget\n")
        for row in remaining:
            handle.write(f"{row['name']}\t{row['status']}\t{row['target']}\n")
    print("written=docs/embed-remaining-2026-08-28.tsv")


if __name__ == "__main__":
    main()
