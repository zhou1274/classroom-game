"""Build generic data for all remaining classroomgame embed entries."""
from __future__ import annotations
import json
import re
from pathlib import Path

TSV = Path("docs/embed-remaining-2026-08-28.tsv")
SELECTED = Path("tools/catalog-game-pages-data.mjs")
OUT = Path("tools/remaining-games-data.mjs")
EXISTING = Path("tools/game-pages-data.mjs")

EXCLUDE_EMBEDS = {
    "gunspin-2.html",
    "slice-master-2.html",
    "slice-master2.html",
    "soccer-bros.html",
    "sbrunga.html",
}

SLUG_OVERRIDES = {
    "2048": "2048-classic",
    "cupcake-2048": "cupcake-2048-classic",
    "minesweeper": "minesweeper-classic",
    "tic-tac-toe": "tic-tac-toe-classic",
    "wordle": "wordle-extra",
    "snakeio": "snake-classic",
    "uno-online": "uno-extra",
    "solitaire": "klondike-extra",
}

NAME_OVERRIDES = {
    "snakeio": "Snake Classic",
    "wordle": "Wordle Extra",
    "solitaire": "Klondike Extra",
}


def display_name(slug: str) -> str:
    raw = slug.replace("-", " ").replace("_", " ")
    if slug in NAME_OVERRIDES:
        return NAME_OVERRIDES[slug] + " Unblocked"
    raw = re.sub(r"\b3d\b", "3D", raw, flags=re.I)
    raw = re.sub(r"\bio\b", "IO", raw, flags=re.I)
    raw = re.sub(r"\bfnaf\b", "FNAF", raw, flags=re.I)
    raw = re.sub(r"\bvip\b", "VIP", raw, flags=re.I)
    title = raw.title()
    title = re.sub(r"(?<=\d)([A-Z])(?=[a-z])", lambda m: m.group(1).lower(), title)
    return title + " Unblocked"


def short_name(name: str) -> str:
    return name.removesuffix(" Unblocked")


def category_for(slug: str) -> str:
    low = slug.lower()
    if any(word in low for word in ["puzzle", "sort", "merge", "alchemy", "craft", "solitaire", "word", "chess", "checker", "card", "memory"]):
        return "puzzle game"
    if any(word in low for word in ["football", "soccer", "basket", "bowling", "archery", "boxing", "sport", "golf", "tennis", "hockey"]):
        return "sports game"
    if any(word in low for word in ["race", "racing", "drift", "moto", "car", "truck", "bike", "rider", "speed"]):
        return "racing game"
    if any(word in low for word in ["shooter", "war", "gun", "sniper", "shoot", "battle", "fight", "ninja", "zombie", "fnaf", "horror"]):
        return "arcade game"
    if any(word in low for word in ["clicker", "idle", "tycoon", "merge"]):
        return "idle game"
    return "arcade game"


def controls_for(category: str) -> str:
    if category == "sports game":
        return "Use the arrow keys or on-screen controls to move, jump, pass, or shoot."
    if category == "racing game":
        return "Use the arrow keys or touch controls to accelerate, brake, and steer."
    if category == "puzzle game":
        return "Tap or drag the on-screen items to solve the puzzle and move to the next round."
    if category == "idle game":
        return "Click or tap to earn points and spend them on upgrades."
    return "Use the arrow keys or touch controls to move around the game and avoid obstacles."


def main() -> None:
    rows: dict[str, str] = {}
    with TSV.open(encoding="utf-8") as handle:
        handle.readline()
        for line in handle:
            parts = line.rstrip("\n").split("\t")
            if len(parts) >= 3:
                rows[parts[0]] = parts[2]

    selected_text = SELECTED.read_text(encoding="utf-8")
    selected_slugs = set(re.findall(r'"slug": "([^"]+)"', selected_text))
    existing_text = EXISTING.read_text(encoding="utf-8")
    existing_urls = set(re.findall(r'embedUrl:\s*"([^"]+)"', existing_text))

    entries = []
    skipped = []
    for embed, target in sorted(rows.items()):
        if embed in EXCLUDE_EMBEDS:
            continue
        if embed.removesuffix(".html") in selected_slugs:
            continue
        # Keep conflict-safe slugs instead of overwriting existing pages.
        base = embed.removesuffix(".html")
        slug = SLUG_OVERRIDES.get(base, base)
        name = display_name(slug)
        category = category_for(base)
        intro = f"{name} is a browser game from the classroom catalog. It loads in the game area, so you can start a short round without downloading software.\n\n{name} uses simple controls and a compact round, which makes it easy to try during a classroom break."
        why = f"{name} works well in the classroom because the round can be short, the controls are simple, and the game stays in the browser."
        how = f"Start {name}, use the on-screen controls, and try one short round before starting again."
        students = f"You can open {name} in the browser and start playing right away. A short round makes it easy to stop when the next part of class begins."
        teachers = f"{name} is useful as a short supervised activity. Set a time limit before the round starts and ask students to stop at a clear point."
        safety = f"{name} is embedded from a third-party browser page. Teachers should review the source and follow school network rules before class."
        entries.append({
            "slug": slug,
            "name": name,
            "shortName": short_name(name),
            "category": category,
            "titleTag": "Fun Class Game",
            "embedUrl": target,
            "source": target,
            "controls": controls_for(category),
            "mobileControls": "Use the on-screen or touch controls shown by the game on a phone or tablet.",
            "intro": intro,
            "why": why,
            "howToPlay": how,
            "students": students,
            "teachers": teachers,
            "tip": "Start with one short round and stop at a clear point in the game.",
            "safety": safety,
        })

    lines = [
        "// All remaining classroomgame embed entries, generated from docs/embed-remaining-2026-08-28.tsv.",
        "// Regenerate with: python tools/build_all_remaining_data.py",
        "export const REMAINING_GAME_PAGES = ["
    ]
    for item in entries:
        lines.append("  {")
        for key, value in item.items():
            lines.append(f"    {json.dumps(key)}: {json.dumps(value)},")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"remaining_entries={len(entries)} skipped_selected={len(selected_slugs)}")


if __name__ == "__main__":
    main()
