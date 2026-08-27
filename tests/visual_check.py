from playwright.sync_api import sync_playwright

results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    errors = []
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.goto("http://127.0.0.1:8765/", wait_until="domcontentloaded")
    page.wait_for_selector("#game-list a", timeout=5000)
    page.wait_for_timeout(500)

    h1_count = page.locator("h1").count()
    h4_count = page.locator("h4").count()
    tab_count = page.locator("#game-list a").count()
    iframe_count = page.locator(".game-frame").count()
    ad_count = page.locator(".ad-slot").count()

    results.append(f"desktop h1={h1_count} h4={h4_count} tabs={tab_count} iframes={iframe_count} ad-slots={ad_count}")

    coming = page.get_by_text("Coming Soon", exact=False).first
    # The first matching text may be inside a tab; click the Minecraft tab by link text.
    page.locator("#game-list a", has_text="Minecraft Unblocked").click(force=True)
    page.wait_for_timeout(300)
    toast = page.locator(".toast")
    toast_text = toast.inner_text() if toast.count() else ""
    results.append(f"coming-soon-toast={toast_text!r}")

    page.evaluate("document.querySelector(\".toast\")?.remove()")
    page.screenshot(path="visual-desktop.png", full_page=True)

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.goto("http://127.0.0.1:8765/", wait_until="domcontentloaded")
    mobile.wait_for_selector("#game-list a", timeout=5000)
    mobile.wait_for_timeout(500)
    mobile_h1 = mobile.locator("h1").count()
    mobile_tabs = mobile.locator("#game-list a").count()
    results.append(f"mobile h1={mobile_h1} tabs={mobile_tabs}")
    mobile.screenshot(path="visual-mobile.png", full_page=True)

    browser.close()

    print("\n".join(results))
    if errors:
        print("CONSOLE_ERRORS=" + " | ".join(errors))
        raise SystemExit(1)

    if h1_count != 1 or h4_count != 0 or tab_count != 7 or iframe_count != 1 or ad_count != 3:
        raise SystemExit("desktop structural check failed")
    if mobile_h1 != 1 or mobile_tabs != 7:
        raise SystemExit("mobile structural check failed")
    if "coming soon" not in toast_text.lower():
        raise SystemExit("coming soon feedback missing")
