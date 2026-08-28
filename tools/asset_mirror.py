"""Mirror a GitHub Pages game directory into assets/games/<slug>.

This helper captures every same-origin asset that a real browser requests while
the game page loads, then writes it under the target directory. It is used for
the local-first migration workflow and is not part of the site runtime.
"""

from __future__ import annotations

import pathlib
import posixpath
import sys
import urllib.parse

from playwright.sync_api import sync_playwright


ROOT = pathlib.Path(__file__).resolve().parents[1]
GAMES_DIR = ROOT / "assets" / "games"

GAMES = {
    "cupcake-2048": "https://jasongamesdev.github.io/cupcake-2048/",
    "wordle": "https://jasongamesdev.github.io/wordle/",
    "minesweeper": "https://jasongamesdev.github.io/minesweeper/",
    "snake": "https://jasongamesdev.github.io/snake.io/",
    "tic-tac-toe": "https://jasongamesdev.github.io/Tic-Tac-Toe/",
}


def safe_target(
    root: pathlib.Path,
    slug: str,
    base_path: str,
    path: str,
) -> pathlib.Path | None:
    raw = urllib.parse.unquote(path)
    raw_base = base_path.rstrip("/")
    if raw.startswith(raw_base + "/"):
        relative = raw[len(raw_base + "/"):]
    elif raw == raw_base:
        relative = ""
    else:
        relative = raw.lstrip("/")

    if not relative:
        relative = "index.html"
    relative = posixpath.normpath(relative)
    if relative in ("", ".") or relative.startswith("../") or "/../" in relative:
        return None

    target = (root / slug / relative).resolve()
    if not target.is_relative_to((root / slug).resolve()):
        return None
    return target


def mirror(slug: str, url: str) -> None:
    origin = urllib.parse.urlparse(url).netloc
    base_path = urllib.parse.urlparse(url).path.rstrip("/")
    root = GAMES_DIR
    target_dir = (root / slug).resolve()
    target_dir.mkdir(parents=True, exist_ok=True)

    captured: list[tuple[urlparse.ParseResult, object]] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        def on_response(response) -> None:
            parsed = urllib.parse.urlparse(response.url)
            if parsed.netloc != origin:
                return
            captured.append((parsed, response))

        page.on("response", on_response)
        page.goto(url, wait_until="networkidle", timeout=45_000)
        page.wait_for_timeout(4_000)

        saved = 0
        skipped = 0
        for parsed, response in captured:
            try:
                if response.status < 200 or response.status >= 300:
                    skipped += 1
                    continue
                target = safe_target(root, slug, base_path, parsed.path)
                if target is None:
                    skipped += 1
                    continue
                body = response.body()
                if not body:
                    skipped += 1
                    continue
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(body)
                saved += 1
            except Exception:
                skipped += 1

        browser.close()

    print(f"{slug}: saved={saved} skipped={skipped}")


def main() -> int:
    selected = set(sys.argv[1:])
    if not selected:
        selected = set(GAMES)
    for slug, url in GAMES.items():
        if slug in selected or (selected == set(GAMES) and not sys.argv[1:]):
            mirror(slug, url)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
