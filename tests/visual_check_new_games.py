from playwright.sync_api import sync_playwright
import sys

sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://127.0.0.1:8765"

GAMES = [
    ("wordle", "Wordle Unblocked", "assets/games/wordle/index.html"),
    ("cupcake-2048", "2048 Cupcakes Unblocked", "assets/games/cupcake-2048/index.html"),
    ("minesweeper", "Minesweeper Unblocked", "assets/games/minesweeper/index.html"),
    ("tic-tac-toe", "Tic Tac Toe Unblocked", "assets/games/tic-tac-toe/index.html"),
    ("snake", "Snake Unblocked", "assets/games/snake/index.html"),
]


def run():
    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for slug, label, expected_frame in GAMES:
            page = browser.new_page(viewport={"width": 1440, "height": 1000})
            errors = []
            external = []

            def on_request(req):
                url = req.url
                if url.startswith(("http://", "https://")) and "127.0.0.1:8765" not in url:
                    external.append(url)

            page.on("pageerror", lambda exc: errors.append(str(exc)))
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
            page.on("request", on_request)

            page.goto(f"{BASE}/games/{slug}-unblocked.html", wait_until="domcontentloaded")
            page.wait_for_selector("#game-list a", timeout=5000)
            page.wait_for_timeout(500)

            h1 = page.locator("h1").count()
            h4 = page.locator("h4").count()
            iframes = page.locator(".game-frame").count()
            ads = page.locator(".ad-slot").count()
            tabs = page.locator("#game-list a").count()
            active = page.locator("#game-list a.is-active").count()
            active_text = page.locator("#game-list a.is-active").inner_text() if active else ""

            page.locator(".game-frame").scroll_into_view_if_needed()
            page.wait_for_timeout(7000)
            inner_src = page.locator(".game-frame").get_attribute("src") or ""
            frame_ok = expected_frame in inner_src

            page.locator(".game-shell").screenshot(path=f"visual-{slug}-desktop.png")

            if h1 != 1:
                failures.append(f"{slug}: h1={h1}")
            if h4 != 0:
                failures.append(f"{slug}: h4={h4}")
            if iframes != 1:
                failures.append(f"{slug}: iframes={iframes}")
            if ads != 3:
                failures.append(f"{slug}: ads={ads}")
            if tabs != 422:
                failures.append(f"{slug}: tabs={tabs}")
            if active != 1 or label not in active_text:
                failures.append(f"{slug}: active={active} text={active_text!r}")
            if not frame_ok:
                failures.append(f"{slug}: frame src {inner_src!r}")
            if errors:
                failures.append(f"{slug}: console/page errors {errors[:5]}")
            if external:
                failures.append(f"{slug}: external requests {external[:10]}")

            print(f"{slug}: tabs={tabs} h1={h1} ads={ads} frame={frame_ok}")
            page.close()
        browser.close()

    if failures:
        print("\n".join(failures))
        raise SystemExit(1)
    print("PASS: all new game pages loaded")


if __name__ == "__main__":
    run()
