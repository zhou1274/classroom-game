import os
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
BASE = "http://127.0.0.1:8765"
OUT = os.path.join(os.environ.get("TEMP", "C:/Users/焦孟祺/AppData/Local/Temp"), "classroom-visual")
os.makedirs(OUT, exist_ok=True)

CASES = [
    ("chess", 1440, 1000, "desktop"),
    ("pac-man", 1440, 1000, "desktop"),
    ("geometry-dash", 768, 900, "tablet"),
    ("chess", 500, 900, "mobile"),
    ("pac-man", 500, 900, "mobile"),
    ("minecraft", 1440, 1000, "desktop"),
]

failures = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for slug, width, height, label in CASES:
        page = browser.new_page(viewport={"width": width, "height": height})
        page.goto(f"{BASE}/games/{slug}-unblocked.html", wait_until="domcontentloaded")
        page.wait_for_selector("#game-list a", timeout=5000)
        page.wait_for_timeout(1200)

        h1 = page.locator("h1").count()
        h4 = page.locator("h4").count()
        tabs = page.locator("#game-list a").count()
        active = page.locator("#game-list a.is-active").count()
        iframes = page.locator("iframe.game-frame").count()
        ads = page.locator(".ad-slot").count()
        overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")

        if h1 != 1:
            failures.append(f"{slug}-{label}: h1={h1}")
        if h4 != 0:
            failures.append(f"{slug}-{label}: h4={h4}")
        if tabs != 423:
            failures.append(f"{slug}-{label}: tabs={tabs}")
        if active != 1:
            failures.append(f"{slug}-{label}: active={active}")
        if iframes != 1:
            failures.append(f"{slug}-{label}: iframes={iframes}")
        if ads != 3:
            failures.append(f"{slug}-{label}: ads={ads}")
        if overflow > 2:
            failures.append(f"{slug}-{label}: horizontal overflow={overflow}")

        page.locator(".game-shell").scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        shot = os.path.join(OUT, f"{slug}-{label}.png")
        page.locator(".game-shell").screenshot(path=shot)

        print(f"{slug}-{label}: tabs={tabs} h1={h1} ads={ads} overflow={overflow} shot={shot}")
        page.close()
    browser.close()

if failures:
    print("\n".join(failures))
    raise SystemExit(1)
print("PASS: iframe game pages rendered without layout failures")
