from playwright.sync_api import sync_playwright
import sys

sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://127.0.0.1:8765"
SNAKE = f"{BASE}/games/snake-unblocked.html"


def run():
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        home = browser.new_page(viewport={"width": 1440, "height": 1000})
        home.goto(BASE, wait_until="domcontentloaded")
        home.wait_for_selector("#game-list a", timeout=5000)
        home_tabs = home.locator("#game-list a").count()
        snake_link = home.locator("#game-list a", has_text="Snake Unblocked")
        snake_href = snake_link.get_attribute("href") if snake_link.count() else ""
        home.close()

        desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
        external = []

        def on_request(req):
            if req.url.startswith(("http://", "https://")) and "127.0.0.1:8765" not in req.url:
                external.append(req.url)

        desktop.on("pageerror", lambda exc: errors.append(str(exc)))
        desktop.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        desktop.on("request", on_request)

        desktop.goto(SNAKE, wait_until="domcontentloaded")
        desktop.wait_for_selector("#game-list a", timeout=5000)
        desktop.wait_for_timeout(8000)

        frame_src = desktop.locator(".game-frame").get_attribute("src") or ""
        frame_ok = "assets/games/snake/index.html" in frame_src
        tabs = desktop.locator("#game-list a").count()
        h1 = desktop.locator("h1").count()
        h4 = desktop.locator("h4").count()
        iframes = desktop.locator(".game-frame").count()
        ads = desktop.locator(".ad-slot").count()
        active = desktop.locator("#game-list a.is-active").count()
        active_text = desktop.locator("#game-list a.is-active").inner_text() if active else ""
        overflow = desktop.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth + 1")

        desktop.locator(".game-shell").screenshot(path="visual-snake-v2-desktop.png")

        desktop.evaluate("document.querySelector('.game-shell').requestFullscreen()")
        desktop.wait_for_function("document.fullscreenElement !== null", timeout=5000)
        desktop.wait_for_timeout(500)
        label = desktop.locator("#fullscreen-button").inner_text()
        desktop.screenshot(path="visual-snake-v2-fullscreen.png")
        desktop.evaluate("document.exitFullscreen()")
        desktop.wait_for_function("document.fullscreenElement === null", timeout=5000)
        desktop.close()

        viewport_checks = []
        for width, name in [(500, "500"), (768, "768"), (1024, "1024"), (1440, "1440")]:
            page = browser.new_page(viewport={"width": width, "height": 900})
            page_errors = []
            page.on("pageerror", lambda exc: page_errors.append(str(exc)))
            page.on("console", lambda msg: page_errors.append(msg.text) if msg.type == "error" else None)
            page.goto(SNAKE, wait_until="domcontentloaded")
            page.wait_for_selector("#game-list a", timeout=5000)
            page.wait_for_timeout(7000)
            page_overflow = page.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth + 1")
            viewport_checks.append(page_overflow)
            if page_errors:
                errors.extend(page_errors)
            page.screenshot(path=f"visual-snake-v2-{name}.png", full_page=True)
            page.close()

        browser.close()

    if (
        home_tabs != 423
        or "/games/snake-unblocked.html" not in snake_href
        or tabs != 423
        or h1 != 1
        or h4 != 0
        or iframes != 1
        or ads != 3
        or active != 1
        or "Snake Unblocked" not in active_text
        or not frame_ok
        or not overflow
        or label.lower() != "exit fullscreen"
        or not all(viewport_checks)
        or external
        or errors
    ):
        print({
            "home_tabs": home_tabs,
            "snake_href": snake_href,
            "tabs": tabs,
            "h1": h1,
            "h4": h4,
            "iframes": iframes,
            "ads": ads,
            "active": active,
            "active_text": active_text,
            "frame_ok": frame_ok,
            "overflow": overflow,
            "fullscreen_label": label,
            "viewport_checks": viewport_checks,
            "external": external[:5],
            "errors": errors[:5],
        })
        raise SystemExit(1)

    print("PASS: Snake Unblocked visual checks")


if __name__ == "__main__":
    run()
