"""Inspect the real iframe targets for a set of classroomgame game pages."""

from __future__ import annotations

import re

import requests


BASE = "https://classroomgame.github.io/"

SLUGS = [
    "tetris",
    "math-games",
    "puzzle-games",
    "minecraft",
    "geometry-dash",
    "slope",
    "subway-surfers",
    "temple-run",
    "among-us",
    "8-ball-pool",
    "basketball-legends",
    "crossy-road",
    "paper-io",
    "doodle-jump",
    "pacman-html5",
    "flappy-bird",
    "cookie-clicker",
    "1v1lol",
    "chess",
    "checkers-legend",
    "klondike-solitaire",
    "classic-uno",
    "ball-sort-puzzle",
    "stickman-hook",
    "moto-x3m",
    "drift-hunters",
    "run-3",
    "vex-3",
    "red-ball-4",
    "bloons-tower-defense-3",
]


def first_url(page: str, patterns: list[str]) -> str:
    for pattern in patterns:
        match = re.search(pattern, page)
        if match:
            return match.group(1)
    return ""


for slug in SLUGS:
    page_url = f"{BASE}{slug}.html"
    try:
        response = requests.get(page_url, timeout=20, headers={"User-Agent": "Mozilla/5.0"})
    except Exception as error:
        print(f"{slug}\tHTTP_ERROR\t{error}")
        continue

    if response.status_code != 200 or "File not found" in response.text[:2000]:
        print(f"{slug}\t404\t{page_url}")
        continue

    embed_path = first_url(
        response.text,
        [
            r'<iframe[^>]+src="(/embed/[^"]+)"',
            r'<iframe[^>]+src="https://classroomgame.github.io(/embed/[^"]+)"',
            r'src="(/embed/[^"]+)"',
            r'src="https://classroomgame.github.io(/embed/[^"]+)"',
            r'href="(/embed/[^"]+)"',
        ],
    )
    target = ""
    if embed_path:
        embed_url = BASE + embed_path.lstrip("/")
        try:
            embed_page = requests.get(embed_url, timeout=20, headers={"User-Agent": "Mozilla/5.0"})
            target = first_url(
                embed_page.text,
                [
                    r'data-embed="([^"]+)"',
                    r'<iframe[^>]+src="([^"]+)"',
                    r'<iframe[^>]+src="https://([^"]+)"',
                ],
            )
        except Exception as error:
            target = f"EMBED_ERROR: {error}"
    else:
        embed_path = "NO_EMBED"

    print(f"{slug}\t{response.status_code}\t{embed_path}\t{target}")


if __name__ == "__main__":
    pass
