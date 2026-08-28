from pathlib import Path
from playwright.sync_api import sync_playwright

out = Path("C:/Users/焦孟祺/AppData/Local/Temp/classroom-seo-visual")
out.mkdir(parents=True, exist_ok=True)

pages = [
    ("home-desktop", "/", 1440, 1000),
    ("privacy-desktop", "/privacy-policy.html", 1440, 1000),
    ("terms-desktop", "/terms.html", 1440, 1000),
    ("about-desktop", "/about.html", 1440, 1000),
    ("contact-desktop", "/contact.html", 1440, 1000),
    ("404-desktop", "/404.html", 1440, 1000),
    ("minecraft-desktop", "/games/minecraft-unblocked.html", 1440, 1000),
    ("home-mobile", "/", 390, 844),
    ("privacy-mobile", "/privacy-policy.html", 390, 844)
]

results = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for label, pathname, width, height in pages:
        page = browser.new_page(viewport={"width": width, "height": height})
        errors = []
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.goto(f"http://127.0.0.1:8765{pathname}", wait_until="domcontentloaded")
        page.wait_for_timeout(1200)
        h1 = page.locator("h1").count()
        h4 = page.locator("h4").count()
        footer_links = page.locator(".site-footer nav a").count()
        overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        shot = out / f"{label}.png"
        page.screenshot(path=str(shot), full_page=True)
        results.append(f"{label}: h1={h1} h4={h4} footer={footer_links} overflow={overflow} path={shot}")
        if h1 != 1 or h4 != 0 or footer_links < 5 or overflow > 2 or errors:
            raise SystemExit(f"{label} failed: " + " | ".join(results + errors))
        page.close()
    browser.close()

print("\n".join(results))
print("PASS: SEO visual render checks")
